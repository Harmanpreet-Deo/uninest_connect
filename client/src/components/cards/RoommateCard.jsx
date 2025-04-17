import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { CheckCircle, HeartFill, Heart } from 'react-bootstrap-icons';

const RoommateCard = ({ user, score, onView, isLiked, onLikeToggle }) => {
    const truncateBio = (bio, maxLen = 120) =>
        bio && bio.length > maxLen ? bio.slice(0, maxLen) + '...' : bio;

    const genderColor = user.gender === 'Male'
        ? 'primary'
        : user.gender === 'Female'
            ? 'danger'
            : 'secondary';

    return (
        <Card className="shadow-sm p-3 h-100">
            <div className="d-flex align-items-center mb-3">
                <img
                    src={user.profilePicture || '/default_profile.png'}
                    alt={`${user.fullName || 'User'}'s profile`}
                    className="rounded-circle me-3"
                    style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        border: '2px solid #ccc'
                    }}
                />
                <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="fw-bold mb-0">{user.fullName}</h5>
                        {user.isVerified && (
                            <Badge bg="success">
                                <CheckCircle className="me-1" /> Verified
                            </Badge>
                        )}
                    </div>
                    <p className="text-muted small mb-1">{user.status}</p>
                    <Badge bg={genderColor}>{user.gender}</Badge>
                </div>
            </div>

            <p className="mb-3">{truncateBio(user.bio)}</p>

            <div className="d-flex justify-content-between align-items-center">
                <Badge bg="dark">Score: {Math.round(score)}%</Badge>

                <div className="d-flex gap-2">
                    <Button
                        variant="outline-dark"
                        size="sm"
                        onClick={() => window.open(`/roommates/profile/${user._id}`, '_blank')}
                    >
                        View
                    </Button>

                    <Button
                        variant={isLiked ? 'danger' : 'outline-danger'}
                        size="sm"
                        onClick={onLikeToggle}
                        title={isLiked ? 'Unlike' : 'Like'}
                    >
                        {isLiked ? <HeartFill /> : <Heart />}
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default RoommateCard;
