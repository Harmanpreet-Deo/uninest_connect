import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import OtpVerification from './OtpVerification';
import { isKpuStudentEmail } from '../../utils/validators';
import { sendOtp, verifyOtp, register } from '../../services/authService';
import { sendOtpEmail } from '../../services/emailService';

function RegisterForm() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = () => {
    if (!email) return 'Email is required';
    if (!isKpuStudentEmail(email)) return 'Must be a @student.kpu.ca email';
    return null;
  };

  const sendOtpHandler = async (e) => {
    e.preventDefault();
    const emailError = validateEmail();
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    try {
      const generatedOtp = await sendOtp(email, 'register');
      await sendOtpEmail(email, generatedOtp);
      setErrors({});
      setStep(2);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Error sending OTP';
      setErrors({ general: msg });
    }
  };


  const verifyOtpHandler = async (otp) => {
    try {
      await verifyOtp(email, otp);
      setStep(3);
    } catch (err) {
      alert('Invalid or expired OTP');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!password) newErrors.password = 'Password is required';
    if (password !== confirmPassword) newErrors.confirm = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await register(email, password);
      navigate('/profile/create');
    } catch (err) {
      alert('Registration failed');
      console.error(err);
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
              {errors.general && <div className="text-danger mb-3">{errors.general}</div>}
              <Button type="submit" variant="primary" className="w-100">
                Send OTP
              </Button>
            </Form>
        )}

        {step === 2 && <OtpVerification email={email} mode="register" onVerify={verifyOtpHandler} />}

        {step === 3 && (
            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3">
                <Form.Label>Create Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={!!errors.password}
                />
                <div className="invalid-feedback">{errors.password}</div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Retype password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    isInvalid={!!errors.confirm}
                />
                <div className="invalid-feedback">{errors.confirm}</div>
              </Form.Group>

              <Button type="submit" variant="success" className="w-100">
                Complete Registration
              </Button>
            </Form>
        )}
      </>
  );
}

export default RegisterForm;
