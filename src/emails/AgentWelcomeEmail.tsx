import * as React from 'react';

interface AgentWelcomeEmailProps {
    firstName: string;
    lastName: string;
    email: string;
}

export const AgentWelcomeEmail: React.FC<AgentWelcomeEmailProps> = ({
    firstName,
    lastName,
    email,
}) => {
    const fullName = `${firstName} ${lastName}`;

    return (
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
            </head>
            <body style={{ backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
                <table style={{ width: '100%', backgroundColor: '#f6f9fc', padding: '20px 0' }}>
                    <tr>
                        <td align="center">
                            <table style={{ maxWidth: '600px', width: '100%', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                {/* Logo Header */}
                                <tr>
                                    <td style={{ backgroundColor: '#ffffff', padding: '30px 30px 20px', textAlign: 'center', borderBottom: '3px solid #F63915' }}>
                                        <table style={{ width: '100%' }}>
                                            <tr>
                                                <td align="center">
                                                    <div style={{ display: 'inline-block', backgroundColor: '#F63915', padding: '12px', borderRadius: '12px', marginBottom: '12px' }}>
                                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <line x1="12" y1="22.08" x2="12" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                    <h1 style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: '#F63915', letterSpacing: '-0.5px' }}>CBS Logistics</h1>
                                                    <p style={{ margin: '5px 0 0', fontSize: '13px', color: '#666666', fontWeight: '500' }}>Your Trusted Logistics Partner</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                {/* Main Header */}
                                <tr>
                                    <td style={{ backgroundColor: '#F63915', padding: '30px 30px', textAlign: 'center' }}>
                                        <h1 style={{ color: '#ffffff', margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
                                            Agent Application Received! 🤝
                                        </h1>
                                    </td>
                                </tr>

                                {/* Content */}
                                <tr>
                                    <td style={{ padding: '40px 30px' }}>
                                        <p style={{ fontSize: '16px', color: '#333333', lineHeight: '24px', margin: '0 0 20px' }}>
                                            Hi <strong>{fullName}</strong>,
                                        </p>

                                        <p style={{ fontSize: '16px', color: '#333333', lineHeight: '24px', margin: '0 0 20px' }}>
                                            Thank you for applying to join the CBS Logistics Agent Network! We're thrilled to review your application.
                                        </p>

                                        <p style={{ fontSize: '16px', color: '#333333', lineHeight: '24px', margin: '0 0 20px' }}>
                                            Your application has been submitted successfully and is currently under review by our admin team.
                                        </p>

                                        <div style={{ backgroundColor: '#f0f7ff', padding: '20px', borderRadius: '6px', margin: '30px 0' }}>
                                            <h3 style={{ fontSize: '18px', color: '#1a73e8', margin: '0 0 15px', display: 'flex', alignItems: 'center' }}>
                                                ⏳ Review Process
                                            </h3>
                                            <p style={{ fontSize: '14px', color: '#333333', margin: 0, lineHeight: '22px' }}>
                                                Our team carefully reviews each agent application to ensure quality and compliance.
                                                This typically takes <strong>2-5 business days</strong>.
                                            </p>
                                        </div>

                                        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px', margin: '30px 0' }}>
                                            <h3 style={{ fontSize: '18px', color: '#333333', margin: '0 0 15px' }}>
                                                What Happens Next?
                                            </h3>
                                            <ul style={{ fontSize: '14px', color: '#666666', lineHeight: '22px', paddingLeft: '20px', margin: 0 }}>
                                                <li style={{ marginBottom: '10px' }}>
                                                    <strong>Application Review:</strong> Our team will verify your information and documentation
                                                </li>
                                                <li style={{ marginBottom: '10px' }}>
                                                    <strong>Approval Notification:</strong> You'll receive an email once approved
                                                </li>
                                                <li style={{ marginBottom: '10px' }}>
                                                    <strong>Referral Code:</strong> Upon approval, you'll receive your unique referral code
                                                </li>
                                                <li style={{ marginBottom: '10px' }}>
                                                    <strong>Commission Earnings:</strong> Start referring customers and earning commissions
                                                </li>
                                                <li>
                                                    <strong>Dashboard Access:</strong> Access your agent dashboard to track performance
                                                </li>
                                            </ul>
                                        </div>

                                        <div style={{ backgroundColor: '#fff3e0', padding: '20px', borderRadius: '6px', margin: '30px 0', borderLeft: '4px solid #ff9800' }}>
                                            <h4 style={{ fontSize: '16px', color: '#e65100', margin: '0 0 10px' }}>
                                                💡 Pro Tip
                                            </h4>
                                            <p style={{ fontSize: '14px', color: '#666666', margin: 0, lineHeight: '22px' }}>
                                                While waiting for approval, familiarize yourself with our services and commission structure.
                                                This will help you hit the ground running once approved!
                                            </p>
                                        </div>

                                        <p style={{ fontSize: '16px', color: '#333333', lineHeight: '24px', margin: '30px 0 20px' }}>
                                            If you have any questions about your application or our agent program, please don't hesitate to contact our support team.
                                        </p>

                                        <p style={{ fontSize: '16px', color: '#333333', lineHeight: '24px', margin: '0' }}>
                                            We look forward to having you as part of our agent network!
                                        </p>

                                        <p style={{ fontSize: '16px', color: '#333333', lineHeight: '24px', margin: '20px 0 0' }}>
                                            Best regards,<br />
                                            <strong>The CBS Logistics Team</strong>
                                        </p>
                                    </td>
                                </tr>

                                {/* Footer */}
                                <tr>
                                    <td style={{ backgroundColor: '#f8f9fa', padding: '30px', textAlign: 'center', borderTop: '1px solid #e9ecef' }}>
                                        <p style={{ fontSize: '14px', color: '#666666', margin: '0 0 10px' }}>
                                            <strong>CBS Logistics Agent Network</strong>
                                        </p>
                                        <p style={{ fontSize: '12px', color: '#999999', margin: '0' }}>
                                            Empowering agents to grow their business with us
                                        </p>
                                        <p style={{ fontSize: '12px', color: '#999999', margin: '10px 0 0' }}>
                                            This email was sent to {email}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    );
};
