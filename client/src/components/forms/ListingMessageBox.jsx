import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';

const ListingMessageBox = ({
                               receiverEmail,
                               receiverId,
                               senderId,
                               senderName,
                               senderEmail,
                               listingTitle
                           }) => {
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(false);
    const [isSelfMessage, setIsSelfMessage] = useState(false);

    useEffect(() => {
        emailjs.init('Y4AhMYU6RnI-vR_y7'); // ✅ Your EmailJS public key
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

        const fullMessage = `Inquiry about listing: "${listingTitle}"\n\n${message}`;

        const templateParams = {
            to_email: receiverEmail,
            from_name: senderName,
            from_email: senderEmail,
            message: fullMessage,
            title: 'Room Listing Inquiry',
            link: 'https://uninestconnect.com/listings'
        };

        try {
            await emailjs.send(
                'service_jexp31j',        // ✅ Same service ID
                'template_6fcampf',       // ✅ Same template ID
                templateParams,
                'Y4AhMYU6RnI-vR_y7'       // ✅ Public key again
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
                <p className="text-muted">You cannot message your own listing.</p>
            </div>
        );
    }

    if (!receiverEmail) {
        return (
            <div className="card p-3 shadow-sm">
                <p className="text-danger">Owner email not available. Cannot send message.</p>
            </div>
        );
    }

    return (
        <div className="card p-3 shadow-sm">
            <h5 className="mb-3">Contact Owner</h5>
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

export default ListingMessageBox;
