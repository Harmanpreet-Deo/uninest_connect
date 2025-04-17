import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';

const ProductMessageBox = ({
                               receiverEmail,
                               receiverId,
                               senderId,
                               senderName,
                               senderEmail,
                               productTitle
                           }) => {
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(false);
    const [isSelfMessage, setIsSelfMessage] = useState(false);

    useEffect(() => {
        emailjs.init('Y4AhMYU6RnI-vR_y7'); // ✅ Your public key
    }, []);

    useEffect(() => {
        if (senderId && receiverId && senderId === receiverId) {
            setIsSelfMessage(true);
        }
    }, [senderId, receiverId]);

    const handleSend = async (e) => {
        e.preventDefault();
        setSending(true);
        setSent(false);
        setError(false);

        const fullMessage = `Inquiry about product: "${productTitle}"\n\n${message}`;

        const templateParams = {
            to_email: receiverEmail,
            from_name: senderName,
            from_email: senderEmail,
            message: fullMessage,
            title: 'Marketplace Product Message',
            link: 'https://uninestconnect.com/marketplace'
        };

        try {
            await emailjs.send(
                'service_jexp31j',       // ✅ EmailJS service ID
                'template_6fcampf',      // ✅ EmailJS template ID
                templateParams,
                'Y4AhMYU6RnI-vR_y7'      // ✅ Public API key again
            );
            setSent(true);
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
                <p className="text-muted">You cannot message your own product.</p>
            </div>
        );
    }

    if (!receiverEmail) {
        return (
            <div className="card p-3 shadow-sm">
                <p className="text-danger">Seller email not available. Cannot send message.</p>
            </div>
        );
    }

    return (
        <div className="card p-3 shadow-sm">
            <h5 className="mb-3">Contact Seller</h5>
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
                <button type="submit" className="btn btn-dark w-100" disabled={sending}>
                    {sending ? 'Sending...' : 'Send Message'}
                </button>
                {sent && <div className="text-success mt-2">Message sent!</div>}
                {error && <div className="text-danger mt-2">Failed to send message. Try again later.</div>}
            </form>
        </div>
    );
};

export default ProductMessageBox;
