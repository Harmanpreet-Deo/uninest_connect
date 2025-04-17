import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { sendOtp } from '../../services/authService';
import { sendOtpEmail } from '../../services/emailService';

function OtpVerification({ email, mode = 'login', onVerify, isVerifying = false }) {
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(20); // 2 minutes
    const [canResend, setCanResend] = useState(false);
    const [error, setError] = useState('');
    const [resendMessage, setResendMessage] = useState('');

    useEffect(() => {
        if (timer > 0) {
            const countdown = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(countdown);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleResend = async () => {
        if (!canResend) return;

        try {
            setTimer(120);
            setCanResend(false);
            setError('');
            setResendMessage('');

            const generatedOtp = await sendOtp(email, mode);
            await sendOtpEmail(email, generatedOtp);

            setResendMessage('OTP has been resent!');
        } catch (err) {
            console.error('Failed to resend OTP:', err);
            setError('Failed to resend OTP. Please try again.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!otp.trim()) {
            setError('OTP is required');
            return;
        }
        setError('');
        onVerify(otp);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>OTP Code</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    isInvalid={!!error}
                />
                <div className="invalid-feedback">{error}</div>
            </Form.Group>

            {resendMessage && (
                <div className="text-success mb-2">{resendMessage}</div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-3">
                <Button type="submit" variant="primary" disabled={isVerifying}>
                    Verify OTP
                </Button>
                <small className="text-muted">
                    {canResend ? (
                        <Button variant="link" onClick={handleResend} size="sm">
                            Resend OTP
                        </Button>
                    ) : (
                        `Resend in ${Math.floor(timer / 60)
                            .toString()
                            .padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`
                    )}
                </small>
            </div>
        </Form>
    );
}

export default OtpVerification;
