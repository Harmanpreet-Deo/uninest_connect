import emailjs from '@emailjs/browser';

export const sendOtpEmail = (email, otp) => {
    const templateParams = {
        to_email: email,
        otp: otp
    };

    return emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.REACT_APP_EMAILJS_USER_ID
    );
};


