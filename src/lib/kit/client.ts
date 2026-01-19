/**
 * Kit.com (ConvertKit) V4 API Client
 * Base URL: https://api.kit.com/v4/
 * Auth: X-Kit-Api-Key header
 */

const KIT_API_BASE = 'https://api.kit.com/v4';

interface KitSubscriberParams {
  email: string;
  first_name?: string;
  state?: 'active' | 'inactive';
  fields?: Record<string, string>;
}

interface KitApiResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

interface KitSubscriber {
  id: number;
  email_address: string;
  first_name: string | null;
  state: string;
  created_at: string;
}

async function kitFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<KitApiResponse<T>> {
  const apiKey = process.env.KIT_API_KEY;
  
  if (!apiKey) {
    throw new Error('KIT_API_KEY environment variable is not set');
  }

  const response = await fetch(`${KIT_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Kit-Api-Key': apiKey,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Kit API error: ${response.status} - ${JSON.stringify(errorData)}`
    );
  }

  return response.json();
}

/**
 * Create or update a subscriber (upsert behavior)
 * If email exists, updates first_name; otherwise creates new subscriber
 */
export async function createSubscriber(params: KitSubscriberParams) {
  const { email, ...rest } = params;
  return kitFetch<KitSubscriber>('/subscribers', {
    method: 'POST',
    body: JSON.stringify({
      email_address: email,
      ...rest
    }),
  });
}

/**
 * Get a subscriber by email
 */
export async function getSubscriberByEmail(email: string) {
  const encodedEmail = encodeURIComponent(email);
  return kitFetch<KitSubscriber[]>(`/subscribers?email_address=${encodedEmail}`);
}

/**
 * Tag a subscriber
 */
export async function tagSubscriber(subscriberId: number, tagId: number) {
  return kitFetch(`/tags/${tagId}/subscribers/${subscriberId}`, {
    method: 'POST',
  });
}

/**
 * Add subscriber to a form
 */
export async function addSubscriberToForm(subscriberId: number, formId: number) {
  return kitFetch(`/forms/${formId}/subscribers/${subscriberId}`, {
    method: 'POST',
  });
}

/**
 * List all tags
 */
export async function listTags() {
  return kitFetch<Array<{ id: number; name: string }>>('/tags');
}

interface KitBroadcastParams {
  subject: string;
  content: string;
  description?: string;
  public?: boolean;
  published_at?: string;
  send_at?: string;
  thumbnail_alt?: string;
  thumbnail_url?: string;
  email_layout_template?: string;
}

/**
 * Create a draft broadcast
 * Note: V4 API might use /broadcasts
 */
export async function createBroadcast(params: KitBroadcastParams) {
  return kitFetch<{ id: number; subject: string; state: string }>('/broadcasts', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
