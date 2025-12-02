import * as React from 'react';

interface AgentApprovalEmailProps {
    firstName: string;
    referralCode: string;
    loginUrl: string;
}

export const AgentApprovalEmail: React.FC<AgentApprovalEmailProps> = ({
    firstName,
    referralCode,
    loginUrl,
}) => {
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
                                {/* Header */}
                                <tr>
                                    <td style={{ backgroundColor: '#F63915', padding: '30px', textAlign: 'center' }}>
                                        <h1 style={{ color: '#ffffff', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                                            Application Approved! 🎉
                                        </h1>
                                    </td>
                                </tr>

                                {/* Content */}
                                <tr>
                                    <td style={{ padding: '40px 30px' }}>
                                        <p style={{ fontSize: '16px', color: '#333333', lineHeight: '24px', margin: '0 0 20px' }}>
                                            Hi <strong>{firstName}</strong>,
                                        </p>

                                        <p style={{ fontSize: '16px', color: '#333333', lineHeight: '24px', margin: '0 0 20px' }}>
                                            Great news! Your application to become a CBS Logistics Agent has been approved. You can now start referring customers and earning commissions.
                                        </p>

                                        <div style={{ backgroundColor: '#f0f7ff', padding: '20px', borderRadius: '6px', margin: '30px 0', textAlign: 'center' }}>
                                            <p style={{ fontSize: '14px', color: '#666666', margin: '0 0 10px' }}>
                                                Your Unique Referral Code
                                            </p>
                                            <p style={{ fontSize: '32px', color: '#1a73e8', fontWeight: 'bold', margin: 0, letterSpacing: '2px' }}>
                                                {referralCode}
                                            </p>
                                        </div>

                                        <div style={{ textAlign: 'center', margin: '30px 0' }}>
                                            <a href={loginUrl} style={{ backgroundColor: '#F63915', color: '#ffffff', padding: '12px 30px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block' }}>
                                                Log In to Dashboard
                                            </a>
                                        </div>

                                        <p style={{ fontSize: '16px', color: '#333333', lineHeight: '24px', margin: '0' }}>
                                            Best regards,<br />
                                            <strong>The CBS Logistics Team</strong>
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
