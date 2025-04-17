import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById, toggleLikeProfile } from '../../services/userService';
import { Card, Badge, Button, Container, Row, Col } from 'react-bootstrap';
import { CheckCircle, HeartFill, Heart } from 'react-bootstrap-icons';
import { jwtDecode } from 'jwt-decode';
import ProfileMessageBox from "../../components/forms/ProfileMessageBox";
import ReportModal from "../../components/layout/ReportModal";



const RoommateProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserById(id);
                setUser(data);
                setIsLiked(data?.isLiked || false);
            } catch (err) {
                console.error('Failed to load profile:', err);
            }
        };

        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decoded = jwtDecode(token);

                setCurrentUser({
                    _id: decoded.id,
                    fullName: decoded.fullName,
                    email: decoded.email
                });
            } catch (err) {
                console.error('Token decode error:', err);
            }
        }


        fetchProfile();
    }, [id]);

    const handleToggleLike = async () => {
        try {
            setLoading(true);
            await toggleLikeProfile(id);
            setIsLiked((prev) => !prev);
        } catch (err) {
            console.error('Error toggling like:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderBubbles = (arr) => {
        if (Array.isArray(arr) && arr.length > 0 && arr.some(Boolean)) {
            return (
                <div className="d-flex flex-wrap gap-2 mt-1">
                    {arr.map(
                        (item, idx) =>
                            item && (
                                <span
                                    key={idx}
                                    className="px-3 py-1 text-sm fw-medium rounded-pill bg-dark text-white"
                                >
                  {item}
                </span>
                            )
                    )}
                </div>
            );
        }
        return <span className="text-muted">N/A</span>;
    };

    if (!user) return <p className="text-center p-4">Loading profile...</p>;

    return (
        <Container className="my-5">
            <h2 className="text-center fw-bold mb-4">Roommate Profile</h2>
            <Card className="p-4 shadow-sm">
                <Row className="align-items-start">
                    {/* Left: Profile Info */}
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
                                <Button
                                    variant={isLiked ? 'danger' : 'outline-danger'}
                                    onClick={handleToggleLike}
                                    disabled={loading}
                                    className="d-flex align-items-center gap-2"
                                >
                                    {isLiked ? <HeartFill /> : <Heart />}
                                    {isLiked ? 'Unlike' : 'Like'}
                                </Button>
                            </Col>
                        </Row>

                        {/* Profile Fields */}
                        <Row>
                            <Col md={6}>
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

                        {/* Collaborative Search Fields */}
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

                    {/* Right: Message Box */}
                    <Col lg={4} className="mt-4 mt-lg-0">
                        {currentUser && currentUser._id !== user._id && (
                            <>
                                <ProfileMessageBox
                                    receiverEmail={user.email}
                                    receiverId={user._id}
                                    senderId={currentUser._id}
                                    senderName={currentUser.fullName}
                                    senderEmail={currentUser.email}
                                />

                                <Button
                                    variant="outline-danger"
                                    className="mt-3 w-100"
                                    onClick={() => setShowReportModal(true)}
                                >
                                    Report User
                                </Button>

                                <ReportModal
                                    show={showReportModal}
                                    onHide={() => setShowReportModal(false)}
                                    type="report_user"
                                    targetId={user._id}
                                    targetLabel={user.fullName}
                                />
                            </>
                        )}

                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export default RoommateProfile;
