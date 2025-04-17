import React, { useState } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { sendResetOtp, verifyOtp, resetPassword } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { sendOtpEmail } from '../../services/emailService';


const ResetPasswordPage = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');

        const handleSendResetOtp = async () => {
            setLoading(true);
            setError('');
            setStatus('');
            try {
                const { otp } = await sendResetOtp(email); // ✅ get OTP from backend
                await sendOtpEmail(email, otp);       // ✅ send via frontend

                setStep(2);
                setStatus('OTP sent to your email!');
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to send OTP.');
            } finally {
                setLoading(false);
            }
        };

    const handleVerifyOtp = async () => {
        if (loading) return;
        setLoading(true);
        setError('');
        setStatus('');
        try {
            await verifyOtp(email, otp);
            setStep(3);
            setStatus('OTP verified! You can now reset your password.');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (loading) return;
        setLoading(true);
        setError('');
        setStatus('');
        try {
            await resetPassword({ email, newPassword });
            setStatus('Password reset successful! Redirecting...');
            setTimeout(() => navigate('/auth'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <Card className="p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
                <Card.Title className="text-center mb-3">Reset Your Password</Card.Title>

                {status && <Alert variant="success">{status}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                {loading && <Spinner animation="border" variant="primary" className="d-block mx-auto my-3" />}

                {!loading && step === 1 && (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button onClick={handleSendResetOtp} variant="primary" className="w-100">
                            Send OTP
                        </Button>
                    </>
                )}

                {!loading && step === 2 && (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>OTP</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the OTP sent to your email"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button onClick={handleVerifyOtp} variant="success" className="w-100">
                            Verify OTP
                        </Button>
                    </>
                )}

                {!loading && step === 3 && (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button onClick={handleResetPassword} variant="success" className="w-100">
                            Reset Password
                        </Button>
                    </>
                )}
            </Card>
        </div>
    );
};

export default ResetPasswordPage;
