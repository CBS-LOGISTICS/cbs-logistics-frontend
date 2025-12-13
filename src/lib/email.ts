import nodemailer from 'nodemailer';
import { Resend } from 'resend';

type SendEmailParams = {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
};

const isProd = process.env.NODE_ENV === 'production';

export const sendEmail = async ({ to, subject, html, from }: SendEmailParams) => {
    const fromAddress = from || process.env.SMTP_FROM || 'onboarding@resend.dev';

    if (isProd) {
        if (!process.env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY is missing in production');
            throw new Error('Missing RESEND_API_KEY');
        }
        const resend = new Resend(process.env.RESEND_API_KEY);

        try {
            const data = await resend.emails.send({
                from: fromAddress,
                to,
                subject,
                html,
            });
            return { success: true, data };
        } catch (error) {
            console.error('Resend error:', error);
            return { success: false, error };
        }
    } else {
        // Development mode: Use Nodemailer
        // If no SMTP credentials are provided, we can use a test account or just log it.
        // For now, let's assume we want to use a real SMTP if provided, or fall back to logging.

        if (process.env.SMTP_HOST || process.env.SMTP_SERVICE) {
            const transportConfig: any = process.env.SMTP_SERVICE === 'gmail'
                ? {
                    service: 'gmail',
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                }
                : {
                    host: process.env.SMTP_HOST,
                    port: Number(process.env.SMTP_PORT) || 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                };

            const transporter = nodemailer.createTransport(transportConfig);

            try {
                const info = await transporter.sendMail({
                    from: fromAddress,
                    to: Array.isArray(to) ? to.join(', ') : to,
                    subject,
                    html,
                });
                console.log('📧 Email sent via Nodemailer:', info.messageId);
                return { success: true, data: info };
            } catch (error) {
                console.error('Nodemailer error:', error);
                return { success: false, error };
            }
        } else {
            console.log('⚠️ No SMTP_HOST provided. Logging email to console instead.');
            console.log('--- EMAIL START ---');
            console.log(`To: ${to}`);
            console.log(`From: ${fromAddress}`);
            console.log(`Subject: ${subject}`);
            console.log('Body:', html);
            console.log('--- EMAIL END ---');
            return { success: true, data: { message: 'Logged to console' } };
        }
    }
};
