import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserByIdAdmin } from '../../services/adminService';
import { Card, Spinner, Badge, Container, Row, Col } from 'react-bootstrap';
import { CheckCircle } from 'react-bootstrap-icons';

const AdminUserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getUserByIdAdmin(id);
                setUser(data);
            } catch (err) {
                console.error('Failed to fetch user:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const renderBubbles = (arr) => {
        if (Array.isArray(arr) && arr.length > 0 && arr.some(Boolean)) {
            return (
                <div className="d-flex flex-wrap gap-2 mt-1">
                    {arr.map((item, idx) => (
                        <span
                            key={idx}
                            className="px-3 py-1 text-sm fw-medium rounded-pill bg-dark text-white"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            );
        }
        return <span className="text-muted">N/A</span>;
    };

    if (loading) return <Spinner animation="border" variant="dark" />;
    if (!user) return <p>User not found</p>;

    return (
        <Container className="my-5">
            <h2 className="text-center fw-bold mb-4">View User Profile</h2>
            <Card className="p-4 shadow-sm">
                <Row className="align-items-start">
                    {/* Left Section */}
                    <Col lg={8}>
                        <Row className="align-items-center mb-4">
                            <Col md={3} className="text-center mb-3">
                                <img
                                    src={user.profilePicture || '/default_profile.png'}
                                    alt={user.fullName}
                                    className="rounded-circle"
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        objectFit: 'cover',
                                        border: '3px solid #ccc',
                                    }}
                                />
                            </Col>
                            <Col>
                                <h3 className="fw-bold d-flex align-items-center gap-2">
                                    {user.fullName}
                                    {user.isVerified && (
                                        <Badge bg="success" className="d-flex align-items-center">
                                            <CheckCircle className="me-1" /> Verified
                                        </Badge>
                                    )}
                                </h3>
                                <p className="text-muted mb-1">{user.status}</p>
                                <p className="mb-2">{user.bio}</p>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Gender:</strong> {user.gender || 'N/A'}</p>
                                <p><strong>Campus:</strong> {user.campus || 'N/A'}</p>
                                <p><strong>Budget:</strong> ${user.budget}</p>
                                <p><strong>Year of Study:</strong> {user.year || 'N/A'}</p>
                                <p><strong>Pets:</strong> {user.pets || 'N/A'}</p>
                            </Col>
                            <Col md={6}>
                                <p><strong>Smoking:</strong> {user.smoking || 'N/A'}</p>
                                <p><strong>Drinking:</strong> {user.drinking || 'N/A'}</p>
                                <p><strong>Guest Friendly:</strong> {user.guestFriendly || 'N/A'}</p>
                            </Col>
                        </Row>

                        <hr />

                        <Row>
                            <Col md={6}>
                                <p><strong>Sleep Schedule:</strong></p>
                                {renderBubbles([user.sleepSchedule])}
                                <p className="mt-3"><strong>Study Style:</strong></p>
                                {renderBubbles([user.studyStyle])}
                                <p className="mt-3"><strong>Social Preference:</strong></p>
                                {renderBubbles([user.socialPreference])}
                            </Col>
                            <Col md={6}>
                                <p><strong>Food Preference:</strong></p>
                                {renderBubbles([user.foodPreference])}
                                <p className="mt-3"><strong>Languages Spoken:</strong></p>
                                {renderBubbles(user.languagesSpoken)}
                                <p className="mt-3"><strong>Hobbies:</strong></p>
                                {renderBubbles(user.hobbies)}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export default AdminUserProfile;
