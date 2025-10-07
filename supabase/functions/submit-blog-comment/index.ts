import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CommentRequest {
  postId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  parentCommentId?: string;
  honeypot?: string;
  timeToSubmit?: number;
}

// Spam detection function
function calculateSpamScore(content: string, email: string, timeToSubmit: number): number {
  let score = 0;

  // Check for excessive URLs (>3 URLs = +0.3)
  const urlCount = (content.match(/https?:\/\//gi) || []).length;
  if (urlCount > 3) score += 0.3;
  else if (urlCount > 1) score += 0.1;

  // Check for spam keywords
  const spamKeywords = ['viagra', 'casino', 'lottery', 'prize', 'winner', 'click here', 'buy now'];
  const lowerContent = content.toLowerCase();
  spamKeywords.forEach(keyword => {
    if (lowerContent.includes(keyword)) score += 0.2;
  });

  // Check for excessive caps (>30% = +0.2)
  const capsCount = (content.match(/[A-Z]/g) || []).length;
  const capsPercentage = capsCount / content.length;
  if (capsPercentage > 0.3) score += 0.2;

  // Check for repeated characters (e.g., "heyyy!!!")
  if (/(.)\1{3,}/.test(content)) score += 0.1;

  // Check for suspicious email domains
  const suspiciousDomains = ['tempmail', 'throwaway', 'guerrillamail', '10minutemail'];
  if (suspiciousDomains.some(domain => email.includes(domain))) score += 0.3;

  // Time-based scoring (too fast = bot, too slow = suspicious)
  if (timeToSubmit < 3) score += 0.4; // Less than 3 seconds
  if (timeToSubmit > 1800) score += 0.2; // More than 30 minutes

  // Content length checks
  if (content.length < 10) score += 0.2; // Too short
  if (content.length > 2000) score += 0.1; // Too long

  return Math.min(score, 1); // Cap at 1.0
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const {
      postId,
      authorName,
      authorEmail,
      content,
      parentCommentId,
      honeypot,
      timeToSubmit = 0
    }: CommentRequest = await req.json();

    // Get IP and user agent
    const ipAddress = req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Honeypot check
    if (honeypot && honeypot.length > 0) {
      console.log('Honeypot triggered:', ipAddress);
      return new Response(
        JSON.stringify({ error: 'Spam detected' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Input validation
    if (!postId || !authorName || !authorEmail || !content) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (content.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Content too long (max 2000 characters)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authorEmail)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting check - max 3 comments per hour per IP
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
    const { count } = await supabase
      .from('blog_comments')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ipAddress)
      .gte('created_at', oneHourAgo);

    if (count && count >= 3) {
      console.log('Rate limit exceeded for IP:', ipAddress);
      return new Response(
        JSON.stringify({ error: 'Too many comments. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Duplicate detection - check for identical content in last 24 hours
    const oneDayAgo = new Date(Date.now() - 86400000).toISOString();
    const { data: duplicates } = await supabase
      .from('blog_comments')
      .select('id')
      .eq('content', content)
      .eq('author_email', authorEmail)
      .gte('created_at', oneDayAgo);

    if (duplicates && duplicates.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Duplicate comment detected' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate spam score
    const spamScore = calculateSpamScore(content, authorEmail, timeToSubmit);
    console.log('Spam score:', spamScore, 'for email:', authorEmail);

    // Determine status based on spam score
    let status = 'approved';
    if (spamScore > 0.7) {
      status = 'spam';
    } else if (spamScore > 0.3) {
      status = 'pending';
    }

    // Insert comment
    const { data: comment, error } = await supabase
      .from('blog_comments')
      .insert({
        post_id: postId,
        author_name: authorName,
        author_email: authorEmail,
        content: content,
        parent_comment_id: parentCommentId || null,
        status,
        spam_score: spamScore,
        ip_address: ipAddress,
        user_agent: userAgent
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting comment:', error);
      throw error;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        comment,
        message: status === 'pending' 
          ? 'Your comment is awaiting moderation' 
          : 'Comment posted successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in submit-blog-comment function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};

serve(handler);
