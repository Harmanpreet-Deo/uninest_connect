import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';

const ProfileMessageBox = ({ receiverEmail, senderName, senderId, senderEmail, receiverId }) => {
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(false);
    const [isSelfMessage, setIsSelfMessage] = useState(false);

    // ✅ Initialize EmailJS once
    useEffect(() => {
        emailjs.init('Y4AhMYU6RnI-vR_y7');
    }, []);

    // ✅ Prevent user from messaging themselves
    useEffect(() => {
        if (senderId === receiverId) {
            setIsSelfMessage(true);
        }
    }, [senderId, receiverId]);

    const handleSend = async (e) => {
        e.preventDefault();
        setSending(true);
        setSent(false);
        setError(false);

        const templateParams = {
            to_email: receiverEmail,
            from_name: senderName,
            from_email: senderEmail,
            message: message,
            title: 'Roommate Finder Message',
            link: `https://uninestconnect.com/roommates/profile/${senderId}`,
        };

        try {
            await emailjs.send(
                'service_jexp31j',       // ✅ Your actual EmailJS service ID
                'template_6fcampf',      // ✅ Your template ID
                templateParams,
                'Y4AhMYU6RnI-vR_y7'      // ✅ Your public API key
            );
            setSent(true);
            console.log("📧 Sending Email:", {
                receiverEmail,
                senderName,
                senderId,
                senderEmail,
                receiverId,
            });

            setMessage('');
        } catch (err) {
            console.error('Email send error:', err);
            setError(true);
        } finally {
            setSending(false);
        }
    };

    if (isSelfMessage) {
        return (
            <div className="card p-3 shadow-sm">
                <p className="text-muted">You cannot message your own profile.</p>
            </div>
        );
    }

    return (
        <div className="card p-3 shadow-sm">
            <h5 className="mb-3">Send a Message</h5>
            <form onSubmit={handleSend}>
                <div className="mb-3">
          <textarea
              className="form-control"
              rows="5"
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
          />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={sending}>
                    {sending ? 'Sending...' : 'Send Message'}
                </button>
                {sent && <div className="text-success mt-2">Message sent!</div>}
                {error && <div className="text-danger mt-2">Failed to send. Please try again.</div>}
            </form>
        </div>
    );
};

export default ProfileMessageBox;
