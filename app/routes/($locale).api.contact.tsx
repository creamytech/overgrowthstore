import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';

/**
 * Contact Form API - Uses Resend to send emails
 * POST /api/contact with FormData containing name, email, subject, message
 */
export async function action({request, context}: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    // Validate required fields
    if (!name || !email || !message) {
      return json({success: false, error: 'Name, email, and message are required'}, {status: 400});
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json({success: false, error: 'Please enter a valid email address'}, {status: 400});
    }

    const {env} = context;
    
    // Check if Resend API key is configured
    if (!env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return json({success: false, error: 'Email service not configured'}, {status: 500});
    }

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Overgrowth Contact <hello@news.overgrowth.co>', // Verified domain in Resend
        to: ['customerservice@overgrowth.co'], // Your email address
        reply_to: email,
        subject: `[Contact Form] ${subject || 'New Message'}`,
        html: `
          <div style="font-family: monospace; max-width: 600px;">
            <h2 style="color: #1a472a;">New Contact Form Submission</h2>
            <hr style="border: 1px solid #eee;" />
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
            <hr style="border: 1px solid #eee;" />
            <h3 style="color: #1a472a;">Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
            <hr style="border: 1px solid #eee;" />
            <p style="color: #888; font-size: 12px;">Sent from overgrowth.co contact form</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json() as { message?: string; error?: string; statusCode?: number };
      console.error('Resend API Error:', JSON.stringify(errorData, null, 2));
      console.error('Resend API Status:', response.status);
      // Return the actual error for debugging
      const errorMessage = errorData.message || errorData.error || 'Failed to send message. Please try again.';
      return json({success: false, error: errorMessage}, {status: 500});
    }

    return json({success: true, message: 'Message sent successfully!'});
  } catch (error) {
    console.error('Contact API Error:', error);
    return json({success: false, error: 'Something went wrong. Please try again.'}, {status: 500});
  }
}
