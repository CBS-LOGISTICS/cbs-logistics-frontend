import * as React from 'react';

interface AdminWelcomeEmailProps {
    fullName: string;
    email: string;
    tempPassword?: string;
    loginUrl: string;
}

export const AdminWelcomeEmail: React.FC<AdminWelcomeEmailProps> = ({
    fullName,
    email,
    tempPassword,
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
                                            Welcome to the Team! 🚀
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
                                            You have been added as an administrator to CBS Logistics. We are excited to have you on board.
                                        </p>

                                        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px', margin: '30px 0' }}>
                                            <h3 style={{ fontSize: '18px', color: '#333333', margin: '0 0 15px' }}>
                                                Your Login Credentials
                                            </h3>
                                            <p style={{ fontSize: '14px', color: '#666666', margin: '0 0 10px' }}>
                                                <strong>Email:</strong> {email}
                                            </p>
                                            {tempPassword && (
                                                <p style={{ fontSize: '14px', color: '#666666', margin: '0 0 10px' }}>
                                                    <strong>Temporary Password:</strong> <span style={{ fontFamily: 'monospace', backgroundColor: '#e9ecef', padding: '2px 6px', borderRadius: '4px' }}>{tempPassword}</span>
                                                </p>
                                            )}
                                            <p style={{ fontSize: '14px', color: '#666666', margin: '15px 0 0', fontStyle: 'italic' }}>
                                                Please log in and change your password immediately.
                                            </p>
                                        </div>

                                        <div style={{ textAlign: 'center', margin: '30px 0' }}>
                                            <a href={loginUrl} style={{ backgroundColor: '#F63915', color: '#ffffff', padding: '14px 28px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', display: 'inline-block' }}>
                                                Login to Dashboard
                                            </a>
                                        </div>

                                        <p style={{ fontSize: '16px', color: '#333333', lineHeight: '24px', margin: '0' }}>
                                            Best regards,<br />
                                            <strong>The CBS Logistics Team</strong>
                                        </p>
                                    </td>
                                </tr>

                                {/* Footer */}
                                <tr>
                                    <td style={{ backgroundColor: '#f8f9fa', padding: '30px', textAlign: 'center', borderTop: '1px solid #e9ecef' }}>
                                        <p style={{ fontSize: '14px', color: '#666666', margin: '0 0 10px' }}>
                                            <strong>CBS Logistics</strong>
                                        </p>
                                        <p style={{ fontSize: '12px', color: '#999999', margin: '0' }}>
                                            Your trusted partner in logistics and procurement services
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
