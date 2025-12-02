import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in environment variables');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Define email sender
export const EMAIL_FROM = 'CBS Logistics <onboarding@cbslogistics.com>';

// Email subjects
export const EMAIL_SUBJECTS = {
  CUSTOMER_WELCOME: 'Welcome to CBS Logistics! 🎉',
  AGENT_WELCOME: 'Your Agent Application is Under Review',
  CUSTOMER_APPROVED: 'Your CBS Logistics Account is Approved! 🎊',
  AGENT_APPROVED: 'Welcome to the CBS Logistics Agent Network! 🤝',
} as const;
