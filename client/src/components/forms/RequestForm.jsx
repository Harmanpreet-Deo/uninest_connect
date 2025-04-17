import React, { useEffect, useState } from 'react';
import { Form, Button, Alert, Container, Row, Col, Badge } from 'react-bootstrap';
import { submitRequest, getMyRequests } from '../../services/userService';

const RequestForm = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [requests, setRequests] = useState([]);
    const [filterType, setFilterType] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');
        setError('');
        try {
            const payload = {
                type: 'support',
                message: `Title: ${title}\n\n${message}`
            };
            await submitRequest(payload);
            setStatus('Support request submitted successfully!');
            setTitle('');
            setMessage('');
            fetchRequests();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        }
    };

    const fetchRequests = async () => {
        try {
            const data = await getMyRequests();
            setRequests(data);
        } catch (err) {
            console.error('Failed to fetch requests', err);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const filtered = filterType ? requests.filter(r => r.type === filterType) : requests;

    return (
        <Container className="mt-4">
            <Row className="g-4">
                {/* Form Column */}
                <Col xs={12} md={6}>
                    <div className="p-4 shadow bg-dark text-white rounded">
                        <h5 className="mb-3">Submit a Request</h5>

                        {status && <Alert variant="success">{status}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your subject..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    placeholder="Describe your issue or feedback..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button type="submit" variant="outline-success">
                                Send Request
                            </Button>
                        </Form>
                    </div>
                </Col>

                {/* History Column */}
                <Col xs={12} md={6}>
                    <div className="p-3 bg-dark text-white rounded shadow-sm">
                        <h6 className="mb-3">Your Previous Requests</h6>

                        <Form.Select
                            className="mb-3"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="">All Types</option>
                            <option value="support">Contact Support</option>
                            <option value="verify_listing">Verify Listing</option>
                            <option value="verify_profile">Verify Profile</option>
                            <option value="delete_account">Delete Account</option>
                            <option value="report_user">Report User</option>
                            <option value="report_product">Report Product</option>
                            <option value="report_listing">Report Listing</option>
                        </Form.Select>


                        <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
                            {filtered.length === 0 ? (
                                <p className="text-white">No requests found.</p>
                            ) : (
                                filtered.map((r) => (
                                    <div
                                        key={r._id}
                                        className="p-3 mb-2 rounded"
                                        style={{ backgroundColor: '#2c2c2c', color: 'white' }}
                                    >
                                        <h5 className="text-capitalize">{r.type}</h5>
                                        <Badge bg={r.status === 'pending' ? 'warning' : r.status === 'resolved' ? 'success' : 'secondary'}>
                                            {r.status}
                                        </Badge>
                                        <div className="small mt-2">{r.message}</div>
                                        <div className="text-light small mt-1">{new Date(r.createdAt).toLocaleString()}</div>
                                    </div>

                                ))
                            )}
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default RequestForm;
