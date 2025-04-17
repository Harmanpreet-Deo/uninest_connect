import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import ProfileMessageBox from '../../components/forms/ProfileMessageBox';
import { toggleLikeProfile, getLikedProfiles } from '../../services/userService';
import { jwtDecode } from 'jwt-decode';
import ReportModal from '../layout/ReportModal';

const LikedProfiles = () => {
    const [likedProfiles, setLikedProfiles] = useState([]);
    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);
    const [filterBudget, setFilterBudget] = useState(2000);
    const [filterCampus, setFilterCampus] = useState('All');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setCurrentUser({
                    _id: decoded.id,
                    fullName: decoded.fullName,
                    email: decoded.email,
                });
            } catch (err) {
                console.error('Token decode error:', err);
            }
        }

        const fetchLiked = async () => {
            try {
                const profiles = await getLikedProfiles();
                setLikedProfiles(profiles);
                if (profiles.length > 0) setSelectedProfile(profiles[0]);
            } catch (err) {
                console.error('Failed to load liked profiles:', err);
            }
        };

        fetchLiked();
    }, []);

    const handleUnlike = async (profileId) => {
        try {
            await toggleLikeProfile(profileId);
            const updated = likedProfiles.filter((p) => p._id !== profileId);
            setLikedProfiles(updated);
            if (selectedProfile?._id === profileId) {
                setSelectedProfile(null);
            }
        } catch (err) {
            console.error('Failed to unlike profile:', err);
        }
    };

    const renderBubble = (label) => (
        <span className="px-3 py-1 text-sm fw-medium rounded-pill bg-dark text-white">
            {label}
        </span>
    );

    const filteredProfiles = likedProfiles.filter((user) => {
        return (
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (!filterVerifiedOnly || user.isVerified) &&
            (!user.budget || user.budget <= filterBudget) &&
            (filterCampus === 'All' || user.campus === filterCampus)
        );
    });

    const renderBubbles = (items) => {
        return Array.isArray(items) && items.length > 0 ? (
            <div className="d-flex flex-wrap gap-2">
                {items.map((item, idx) => (
                    <span key={idx} className="px-3 py-1 text-sm fw-medium rounded-pill bg-secondary text-white">
                        {item}
                    </span>
                ))}
            </div>
        ) : (
            <p className="text-muted">N/A</p>
        );
    };

    return (
        <Container fluid className="my-4">
            <h3 className="fw-bold text-center mb-4">Your Liked Profiles</h3>
            <Row>
                {/* Left Panel */}
                <Col lg={4} className="pe-4 mb-4 border-end">
                    <Form.Control
                        type="text"
                        placeholder="Search liked profiles..."
                        className="mb-3"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <div
                            className={`rounded-pill px-3 py-1 border ${filterVerifiedOnly ? 'bg-dark text-white' : 'text-white'}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setFilterVerifiedOnly((prev) => !prev)}
                        >
                            Verified only
                        </div>
                        <Form.Select
                            size="sm"
                            value={filterCampus}
                            onChange={(e) => setFilterCampus(e.target.value)}
                            style={{ width: '50%' }}
                        >
                            <option value="All Campus">All</option>
                            <option value="Surrey">Surrey</option>
                            <option value="Richmond">Richmond</option>
                            <option value="Langley">Langley</option>
                        </Form.Select>
                    </div>

                    <Form.Range
                        min={0}
                        max={2000}  // ✅ Add a max value
                        step={50}
                        value={filterBudget}
                        onChange={(e) => setFilterBudget(Number(e.target.value))}
                    />
                    <div className="text-white small mb-2">Budget: ${filterBudget}</div>
                    <Button
                        variant="outline-light"
                        size="sm"
                        className="mb-3"
                        onClick={() => {
                            setSearchTerm('');
                            setFilterVerifiedOnly(false);
                            setFilterCampus('All');
                            setFilterBudget(2000);
                        }}
                    >
                        Reset Filters
                    </Button>



                    <div style={{ maxHeight: '60vh', overflowY: 'auto', borderRadius: '5px', paddingRight:'5px'}}>
                        {filteredProfiles.length > 0 ? (
                            filteredProfiles.map((user) => (
                                <Card
                                    key={user._id}
                                    className={`mb-3 shadow-sm ${selectedProfile?._id === user._id ? 'border-primary' : ''}`}
                                    onClick={() => setSelectedProfile(user)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Card.Body className="d-flex align-items-center gap-3">
                                        <img
                                            src={user.profilePicture || '/default_profile.png'}
                                            alt={user.fullName}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                        <div className="flex-grow-1">
                                            <strong>{user.fullName}</strong>
                                            {user.isVerified && (
                                                <span className="badge bg-success ms-2">Verified</span>
                                            )}
                                            <div className="text-muted small">Looking for a Place to Rent</div>
                                        </div>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUnlike(user._id);
                                            }}
                                        >
                                            Unlike
                                        </Button>
                                    </Card.Body>
                                </Card>
                            ))
                        ) : (
                            <p className="text-muted">No liked profiles found.</p>
                        )}
                    </div>
                </Col>

                {/* Right Panel */}
                <Col lg={8} className="px-4">
                    {selectedProfile ? (
                        <Card className="mb-4 p-4 shadow-sm">
                            <Row>
                                <Col md={2} className="text-center">
                                    <img
                                        src={selectedProfile.profilePicture || '/default_profile.png'}
                                        alt={selectedProfile.fullName}
                                        className="rounded-circle"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover', border: '2px solid #ccc' }}
                                    />
                                </Col>
                                <Col>
                                    <h4 className="fw-bold">
                                        {selectedProfile.fullName}
                                        {selectedProfile.isVerified && (
                                            <span className="badge bg-success ms-2">Verified</span>
                                        )}
                                    </h4>
                                    <p className="text-muted">Looking for a Place to Rent</p>
                                    <p>{selectedProfile.bio}</p>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md={6}>
                                    <p><strong>Gender:</strong> {selectedProfile.gender || 'N/A'}</p>
                                    <p><strong>Campus:</strong> {selectedProfile.campus || 'N/A'}</p>
                                    <p><strong>Budget:</strong> ${selectedProfile.budget}</p>
                                    <p><strong>Year:</strong> {selectedProfile.year || 'N/A'}</p>
                                    <p><strong>Pets:</strong> {selectedProfile.pets || 'N/A'}</p>
                                    <p><strong>Smoking:</strong> {selectedProfile.smoking || 'N/A'}</p>
                                    <p><strong>Drinking:</strong> {selectedProfile.drinking || 'N/A'}</p>
                                    <p><strong>Guest Friendly:</strong> {selectedProfile.guestFriendly || 'N/A'}</p>
                                    <p className="mt-3"><strong>Languages Spoken:</strong></p>
                                    {renderBubbles(selectedProfile.languagesSpoken || [])}
                                    <p className="mt-3"><strong>Hobbies:</strong></p>
                                    {renderBubbles(selectedProfile.hobbies || [])}
                                    <p><strong>Sleep Schedule:</strong></p>
                                    {selectedProfile.sleepSchedule ? renderBubble(selectedProfile.sleepSchedule) : <p className="text-muted">N/A</p>}
                                </Col>
                                <Col md={6}>
                                    <p className="mt-3"><strong>Study Style:</strong></p>
                                    {selectedProfile.studyStyle ? renderBubble(selectedProfile.studyStyle) : <p className="text-muted">N/A</p>}
                                    <p className="mt-3"><strong>Social Preference:</strong></p>
                                    {selectedProfile.socialPreference ? renderBubble(selectedProfile.socialPreference) : <p className="text-muted">N/A</p>}
                                    <p className="mt-3"><strong>Food Preference:</strong></p>
                                    {selectedProfile.foodPreference ? renderBubble(selectedProfile.foodPreference) : <p className="text-muted">N/A</p>}
                                    <hr className="my-4" />
                                    <>
                                        <ProfileMessageBox
                                            receiverEmail={selectedProfile.email}
                                            receiverId={selectedProfile._id}
                                            senderId={currentUser?._id}
                                            senderName={currentUser?.fullName}
                                            senderEmail={currentUser?.email}
                                        />

                                        <Button
                                            className="mt-3"
                                            variant="outline-danger"
                                            onClick={() => setShowReportModal(true)}
                                        >
                                            Report User
                                        </Button>

                                        <ReportModal
                                            show={showReportModal}
                                            onHide={() => setShowReportModal(false)}
                                            type="report_user"
                                            targetId={selectedProfile._id}
                                            targetLabel={selectedProfile.fullName}
                                        />
                                    </>

                                </Col>
                            </Row>
                        </Card>
                    ) : (
                        <Card className="p-4 text-center shadow-sm">
                            <p className="text-muted">Select a profile to view details and send a message.</p>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default LikedProfiles;
