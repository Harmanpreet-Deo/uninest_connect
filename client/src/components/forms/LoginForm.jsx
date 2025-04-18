import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import OtpVerification from './OtpVerification';
import { isKpuStudentEmail } from '../../utils/validators';
import { sendOtpEmail } from '../../services/emailService';
import { preLogin, sendOtp, verifyOtp, login } from '../../services/authService';



function LoginForm() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!isKpuStudentEmail(email)) newErrors.email = 'Must be a @student.kpu.ca email';
    if (!password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const sendOtpHandler = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // ✅ 1. Check credentials first
      await preLogin(email, password);

      // ✅ 2. If valid, send OTP
      const generatedOtp = await sendOtp(email, 'login');
      await sendOtpEmail(email, generatedOtp);

      setErrors({});
      setStep(2);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed';
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpHandler = async (otp) => {
    try {
      await verifyOtp(email, otp);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      alert('Invalid OTP or login failed');
    }
  };

  return (
    <>
      {step === 1 && (
        <Form onSubmit={sendOtpHandler}>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter @student.kpu.ca email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
            />
            <div className="invalid-feedback">{errors.email}</div>
          </Form.Group>

          <Form.Group className="mb-3 position-relative">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
            />
            <Button
              variant="link"
              className="position-absolute end-0 top-50 translate-middle-y me-2 p-0"
              style={{ fontSize: '0.9rem' }}
              onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </Button>
            <div className="text-end mt-2">
              <a href="/auth/reset-password" style={{ fontSize: '0.9rem', color: '#007bff' }}>
                Forgot your password?
              </a>
            </div>
            <div className="invalid-feedback">{errors.password}</div>
          </Form.Group>

          {errors.general && <div className="text-danger mb-3">{errors.general}</div>}
          <Button type="submit" variant="primary" className="w-100" disabled={loading}>
            {loading ? 'Submitting...' : 'Login'}
          </Button>

        </Form>
      )}

      {step === 2 && <OtpVerification email={email} mode="login" onVerify={verifyOtpHandler} />}
    </>
  );
}

export default LoginForm;
