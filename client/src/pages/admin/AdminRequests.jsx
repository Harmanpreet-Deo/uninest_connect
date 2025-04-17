import React, { useEffect, useState } from 'react';
import { Card, Badge, Button, Spinner, Form, Row, Col } from 'react-bootstrap';
import { getAllAdminRequests, updateRequestStatus, deleteEntityByAdmin } from '../../services/adminService';

const AdminRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('newest');
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await getAllAdminRequests();
                setRequests(data);
            } catch (err) {
                console.error('Failed to fetch requests', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        await updateRequestStatus(id, status);
        const data = await getAllAdminRequests();
        setRequests(data);
    };

    const handleDelete = async (type, id) => {
        const confirm = window.confirm(`Are you sure you want to delete this ${type}?`);
        if (!confirm) return;
        await deleteEntityByAdmin(type, id);
        const data = await getAllAdminRequests();
        setRequests(data);
    };

    const filtered = requests.filter(r =>
        (!filterType || r.type === filterType) &&
        (!filterStatus || r.status === filterStatus)
    );

    const sorted = [...filtered].sort((a, b) =>
        sortOrder === 'newest'
            ? new Date(b.createdAt) - new Date(a.createdAt)
            : new Date(a.createdAt) - new Date(b.createdAt)
    );

    const totalPages = Math.ceil(sorted.length / itemsPerPage);
    const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <>
            <Row className="mb-3 g-2">
                <Col md={3}>
                    <Form.Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="">All Types</option>
                        <option value="support">Support</option>
                        <option value="verify_listing">Verify Listing</option>
                        <option value="verify_profile">Verify Profile</option>
                        <option value="delete_account">Delete Account</option>
                        <option value="report_user">Report User</option>
                        <option value="report_listing">Report Listing</option>
                        <option value="report_product">Report Product</option>
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                        <option value="dismissed">Dismissed</option>
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Button variant="secondary" onClick={() => {
                        setSortOrder('newest');
                        setFilterType('');
                        setFilterStatus('');
                    }}>Reset Filters</Button>
                </Col>
            </Row>

            {loading ? (
                <Spinner animation="border" variant="dark" />
            ) : paginated.length === 0 ? (
                <p>No requests found.</p>
            ) : (
                paginated.map((req) => (
                    <Card key={req._id} className="mb-3 shadow-sm">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <span>
                                <Badge bg="secondary" className="me-2">{req.type}</Badge>
                                <Badge bg={req.status === 'pending' ? 'warning' : req.status === 'resolved' ? 'success' : 'danger'}>
                                    {req.status}
                                </Badge>
                            </span>
                            <small>{new Date(req.createdAt).toLocaleString()}</small>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>
                                <a
                                    href={`/admin/user/${req.user?._id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-decoration-none fw-bold"
                                >
                                    {req.user?.fullName}
                                </a>
                            </Card.Title>

                            <p className="mb-1"><strong>Email:</strong> {req.user?.email}</p>

                            {req.message && (
                                <p className="mt-2"><strong>Message:</strong> {req.message}</p>
                            )}

                            {req.type === 'verify_profile' && req.idPhotos?.front && req.idPhotos?.back && (
                                <>
                                    <p className="mt-3"><strong>ID Proof (Click to view full size):</strong></p>
                                    <div className="d-flex gap-3 flex-wrap">
                                        {[req.idPhotos.front, req.idPhotos.back].map((url, i) => (
                                            <a key={i} href={url} target="_blank" rel="noreferrer">
                                                <img
                                                    src={url}
                                                    alt={`ID-${i}`}
                                                    style={{
                                                        width: '160px',
                                                        height: 'auto',
                                                        border: '1px solid #ccc',
                                                        borderRadius: '4px',
                                                    }}
                                                />
                                            </a>
                                        ))}
                                    </div>
                                </>
                            )}




                            {req.type === 'verify_listing' && (
                                <>
                                    {req.targetListing && (
                                        <p>
                                            <strong>Listing:</strong>{' '}
                                            <a
                                                href={`/admin/listing/${req.targetListing._id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {req.targetListing.title}
                                            </a>
                                        </p>
                                    )}

                                    {req.document?.url && (
                                        <>
                                            <p className="mt-2"><strong>Proof Document:</strong></p>
                                            <a
                                                href={req.document.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="d-block text-decoration-underline"
                                            >
                                                View Document
                                            </a>
                                        </>
                                    )}
                                </>
                            )}


                            {req.targetUser && (
                                <p><strong>Reported User:</strong>{' '}
                                    <a
                                        href={`/admin/user/${req.targetUser._id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {req.targetUser.fullName}
                                    </a>
                                </p>
                            )}

                            {req.targetProduct && (
                                <p><strong>Product:</strong>{' '}
                                    <a
                                        href={`/admin/product/${req.targetProduct._id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {req.targetProduct.title}
                                    </a>
                                    {' '}
                                    <Button size="sm" variant="danger" onClick={() => handleDelete('product', req.targetProduct._id)}>Delete</Button>
                                </p>
                            )}

                            {req.targetListing && req.type !== 'verify_listing' && (
                                <p><strong>Listing:</strong>{' '}
                                    <a
                                        href={`/admin/listing/${req.targetListing._id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {req.targetListing.title}
                                    </a>
                                    {' '}
                                    <Button size="sm" variant="danger" onClick={() => handleDelete('listing', req.targetListing._id)}>Delete</Button>
                                </p>
                            )}

                            {req.type === 'delete_account' && (
                                <Button size="sm" variant="danger" className="my-2" onClick={() => handleDelete('user', req.user._id)}>
                                    Delete Account
                                </Button>
                            )}

                            {req.status === 'pending' && (
                                <div className="d-flex gap-2 mt-3">
                                    <Button size="sm" variant="success" onClick={() => handleStatusUpdate(req._id, 'resolved')}>Approve / Mark Resolved</Button>
                                    <Button size="sm" variant="secondary" onClick={() => handleStatusUpdate(req._id, 'dismissed')}>Dismiss</Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                ))
            )}

            {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                    <Button size="sm" variant="dark" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>⬅ Prev</Button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <Button size="sm" variant="dark" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>Next ➡</Button>
                </div>
            )}
        </>
    );
};

export default AdminRequests;
