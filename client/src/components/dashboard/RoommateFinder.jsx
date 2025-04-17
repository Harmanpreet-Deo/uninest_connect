import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner, Alert, Form, Button } from 'react-bootstrap';
import RoommateCard from '../cards/RoommateCard';
import RoommateFilterBar from '../layout/RoommateFilterBar';
import api from '../../services/api';
import { toggleLikeProfile } from '../../services/userService';

const RoommateFinder = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likedIds, setLikedIds] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [sameGenderOnly, setSameGenderOnly] = useState(false);
    const [onlyVerified, setOnlyVerified] = useState(false);
    const [currentGender, setCurrentGender] = useState('');
    const [campusFilter, setCampusFilter] = useState('');
    const [budgetRange, setBudgetRange] = useState([0, 4000]);

    const [currentPage, setCurrentPage] = useState(1);
    const profilesPerPage = 9;

    // Fetch recommendations and liked profile IDs
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const { data } = await api.get('/roommates/recommendations');
                setRecommendations(data.recommendations);
                setFiltered(data.recommendations);
                setCurrentGender(data.currentGender);

                const res = await api.get('/auth/me');
                setLikedIds(res.data.likedProfiles || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecommendations();
    }, []);

    // Toggle like/unlike
    const handleLikeToggle = async (userId) => {
        try {
            await toggleLikeProfile(userId);
            setLikedIds(prev =>
                prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
            );
        } catch (err) {
            console.error('Failed to toggle like:', err);
        }
    };


    // Filter logic
    useEffect(() => {
        const lowerSearch = searchTerm.toLowerCase();
        const result = recommendations.filter((user) => {
            if (!user) return false;

            const nameMatch = user.fullName?.toLowerCase().includes(lowerSearch) || false;
            const genderMatch = sameGenderOnly ? user.gender === currentGender : true;
            const campusMatch = campusFilter ? user.campus === campusFilter : true;
            const budgetMatch =
                user.budget != null && !isNaN(user.budget)
                    ? user.budget >= budgetRange[0] && user.budget <= budgetRange[1]
                    : true;
            const verifiedMatch = onlyVerified ? user.isVerified === true : true;

            return nameMatch && genderMatch && campusMatch && budgetMatch && verifiedMatch;
        });

        setFiltered(result);
        setCurrentPage(1);
    }, [searchTerm, sameGenderOnly, campusFilter, budgetRange, recommendations, currentGender, onlyVerified]);

    const handleResetFilters = () => {
        setSearchTerm('');
        setSameGenderOnly(false);
        setOnlyVerified(false);
        setCampusFilter('');
        setBudgetRange([0, 4000]);
    };

    const totalPages = Math.ceil(filtered.length / profilesPerPage);
    const currentProfiles = filtered.slice(
        (currentPage - 1) * profilesPerPage,
        currentPage * profilesPerPage
    );

    if (loading) return <div className="text-center mt-3"><Spinner animation="border" /></div>;

    return (
        <div className="container mt-0">
            <h3 className="fw-bold mb-1 text-center">Roommate Finder</h3>
            <p className="text-white text-center mb-4" style={{ fontSize: '0.95rem' }}>
                The more profiles you like, the more accurate your recommendations become.
            </p>

            <RoommateFilterBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sameGenderOnly={sameGenderOnly}
                setSameGenderOnly={setSameGenderOnly}
                onlyVerified={onlyVerified}
                setOnlyVerified={setOnlyVerified}
                campusFilter={campusFilter}
                setCampusFilter={setCampusFilter}
                budgetRange={budgetRange}
                setBudgetRange={setBudgetRange}
                onReset={handleResetFilters}
            />

            {filtered.length === 0 ? (
                <Alert variant="warning" className="text-center mt-3">
                    No matching profiles found.
                </Alert>
            ) : (
                <>
                    <Row xs={1} md={3} className="g-4">
                        {currentProfiles.map((user) => (
                            <Col key={user._id}>
                                <RoommateCard
                                    user={user}
                                    score={user.compatibilityScore}
                                    isLiked={likedIds.includes(user._id)}
                                    onLikeToggle={() => handleLikeToggle(user._id)}
                                    onView={() => alert(`View profile for ${user.fullName || 'Unnamed User'}`)}
                                />
                            </Col>
                        ))}
                    </Row>

                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap mt-4">
                            <Button
                                variant="dark"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            >
                                ⬅ Prev
                            </Button>

                            <span className="fw-semibold">Page {currentPage} of {totalPages}</span>

                            <Button
                                variant="dark"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            >
                                Next ➡
                            </Button>

                            <Button
                                variant="dark"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(totalPages)}
                            >
                                &gt;&gt; Last
                            </Button>

                            <Form.Select
                                value={currentPage}
                                onChange={(e) => setCurrentPage(Number(e.target.value))}
                                style={{ width: '120px' }}
                            >
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        Page {i + 1}
                                    </option>
                                ))}
                            </Form.Select>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default RoommateFinder;
