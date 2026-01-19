import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/sanity/client";

interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create contact form submission in Sanity
    const result = await serverClient.create({
      _type: "contactSubmission",
      name,
      email,
      subject: subject || "General Inquiry",
      message,
      submittedAt: new Date().toISOString(),
      status: "new",
    });

    // Send email via EmailJS
    try {
      const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: process.env.EMAILJS_SERVICE_ID,
          template_id: process.env.EMAILJS_TEMPLATE_ID,
          user_id: process.env.EMAILJS_PUBLIC_KEY,
          accessToken: process.env.EMAILJS_PRIVATE_KEY, // Use Private Key for server-side auth
          template_params: {
            from_name: name,
            from_email: email,
            subject: subject || "General Inquiry",
            message: message,
            reply_to: email, // Standard practice for "Reply-To"
          },
        }),
      });

      if (!emailResponse.ok) {
        console.error("EmailJS failed:", await emailResponse.text());
        // We don't fail the request because Sanity saved it successfully
      }
    } catch (emailError) {
      console.error("EmailJS error:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
      id: result._id,
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit message. Please try again." },
      { status: 500 }
    );
  }
}
