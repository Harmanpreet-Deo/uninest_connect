import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Carousel } from 'react-bootstrap';
import { getAllListings } from '../../services/userService';
import { jwtDecode } from 'jwt-decode';
import ListingMessageBox from '../forms/ListingMessageBox';
import ListingFilterBar from '../layout/ListingFilterBar';
import { Link } from 'react-router-dom';
import { toggleSaveListing } from "../../services/userService";
import ReportModal from "../layout/ReportModal";


const BrowseListings = () => {
    const [listings, setListings] = useState([]);
    const [showReport, setShowReport] = useState(false);

    const [filteredListings, setFilteredListings] = useState([]);
    const [selectedListing, setSelectedListing] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [campusFilter, setCampusFilter] = useState('');
    const [furnishedOnly, setFurnishedOnly] = useState(false);
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [sortOrder, setSortOrder] = useState('newest');
    const [availabilitySort, setAvailabilitySort] = useState('');
    const [rentLimit, setRentLimit] = useState(2000);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setCurrentUser({ id: decoded.id, fullName: decoded.fullName, email: decoded.email });
        }

        const fetchListings = async () => {
            const all = await getAllListings();
            setListings(all);
        };

        fetchListings();
    }, []);

    useEffect(() => {
        let filtered = [...listings];

        if (searchTerm) filtered = filtered.filter(l => l.title.toLowerCase().includes(searchTerm.toLowerCase()));
        if (campusFilter) filtered = filtered.filter(l => l.location === campusFilter);
        if (furnishedOnly) filtered = filtered.filter(l => l.furnished);
        if (verifiedOnly) filtered = filtered.filter(l => l.isVerified);
        filtered = filtered.filter(l => l.rent <= rentLimit);

        if (availabilitySort) {
            filtered.sort((a, b) =>
                availabilitySort === 'soonest'
                    ? new Date(a.availabilityDate) - new Date(b.availabilityDate)
                    : new Date(b.availabilityDate) - new Date(a.availabilityDate)
            );
        } else {
            filtered.sort((a, b) =>
                sortOrder === 'newest'
                    ? new Date(b.createdAt) - new Date(a.createdAt)
                    : new Date(a.createdAt) - new Date(b.createdAt)
            );
        }

        setFilteredListings(filtered);
        setCurrentPage(1);
    }, [searchTerm, campusFilter, furnishedOnly, verifiedOnly, sortOrder, availabilitySort, rentLimit, listings]);

    const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
    const paginated = filteredListings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleToggleSave = async (listingId) => {
        try {
            const updated = await toggleSaveListing(listingId);
            setCurrentUser(prev => ({ ...prev, savedListings: updated.savedListings }));
        } catch (err) {
            console.error('Error saving listing:', err);
        }
    };


    const handleReset = () => {
        setSearchTerm('');
        setCampusFilter('');
        setFurnishedOnly(false);
        setVerifiedOnly(false);
        setSortOrder('newest');
        setAvailabilitySort('');
        setRentLimit(2000);
    };

    return (
        <Container fluid className="my-4">
            <h3 className="fw-bold text-center mb-4">Browse Listings</h3>

            <ListingFilterBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                campusFilter={campusFilter}
                setCampusFilter={setCampusFilter}
                furnishedOnly={furnishedOnly}
                setFurnishedOnly={setFurnishedOnly}
                verifiedOnly={verifiedOnly}
                setVerifiedOnly={setVerifiedOnly}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                availabilitySort={availabilitySort}
                setAvailabilitySort={setAvailabilitySort}
                rentLimit={rentLimit}
                setRentLimit={setRentLimit}
                onReset={handleReset}
            />

            <Row>
                <Col lg={7}>
                    {paginated.length === 0 ? (
                        <div className="text-center text-white py-5">
                            <h5>No listings found.</h5>
                        </div>
                    ) : (
                        <Row xs={1} md={2} className="g-4">
                            {paginated.map(listing => (
                                <Col key={listing._id}>
                                    <Card className="h-100 shadow-sm p-1" onClick={() => setSelectedListing(listing)} style={{ cursor: 'pointer' }}>
                                        {listing.images?.[0]?.url && (
                                            <Card.Img variant="top" src={listing.images[0].url} style={{ height: '180px', objectFit: 'cover' }} />
                                        )}
                                        <Card.Body>
                                            <Card.Title>{listing.title}</Card.Title>
                                            <div className="d-flex flex-wrap gap-2 mb-2">
                                                <Badge bg="secondary">{listing.location}</Badge>
                                                <Badge bg="dark">${listing.rent}</Badge>
                                                {listing.furnished && <Badge bg="info">Furnished</Badge>}
                                                {listing.isVerified && <Badge bg="success">Verified</Badge>}
                                            </div>
                                            <p className="text-muted small">Available: {new Date(listing.availabilityDate).toLocaleDateString()}</p>
                                            {currentUser?.id !== listing.user._id && (
                                                <Button
                                                    size="sm"
                                                    variant={currentUser?.savedListings?.includes(listing._id) ? 'outline-danger' : 'outline-success'}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleSave(listing._id);
                                                    }}
                                                >
                                                    {currentUser?.savedListings?.includes(listing._id) ? 'Unsave' : 'Save'}
                                                </Button>
                                            )}

                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}

                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                            <Button size="sm" variant="dark" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                                ⬅ Prev
                            </Button>
                            <span className="text-white">Page {currentPage} of {totalPages}</span>
                            <Button size="sm" variant="dark" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                                Next ➡
                            </Button>
                            <Button size="sm" variant="dark" onClick={() => setCurrentPage(totalPages)}>
                                &gt;&gt; Last
                            </Button>
                            <Form.Select
                                size="sm"
                                style={{ width: '100px' }}
                                value={currentPage}
                                onChange={(e) => setCurrentPage(Number(e.target.value))}
                            >
                                {[...Array(totalPages)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>Page {i + 1}</option>
                                ))}
                            </Form.Select>
                        </div>
                    )}
                </Col>

                <Col lg={5}>
                    {selectedListing ? (
                        <Card className="shadow-sm p-3">
                            {selectedListing.images?.length > 0 && (
                                <Carousel>
                                    {selectedListing.images.map((img, i) => (
                                        <Carousel.Item key={i}>
                                            <img
                                                src={img.url}
                                                className="d-block w-100"
                                                style={{ height: '250px', objectFit: 'contain' }}
                                                alt={`Slide ${i}`}
                                            />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            )}
                            <Card.Body>
                                <h5>{selectedListing.title}</h5>
                                <p className="text-muted mb-2">
                                    Tenant:{' '}
                                    <Link
                                        to={`/roommates/profile/${selectedListing.user?._id}`}
                                        className="fw-semibold text-decoration-none"
                                    >
                                        {selectedListing.user?.fullName}
                                    </Link>{' '}
                                    {selectedListing.isVerified && (
                                        <Badge bg="success">Verified</Badge>
                                    )}
                                </p>

                                <p className="text-muted">{selectedListing.description}</p>
                                <div className="d-flex flex-wrap gap-2 mb-3">
                                    <Badge bg="secondary">{selectedListing.location}</Badge>
                                    <Badge bg="dark">${selectedListing.rent}</Badge>
                                    {selectedListing.isVerified && <Badge bg="success">Verified</Badge>}

                                    {selectedListing.furnished && <Badge bg="info">Furnished</Badge>}
                                    {selectedListing.utilities?.map((util, i) => (
                                        <Badge key={i} bg="light" text="dark">{util}</Badge>
                                    ))}
                                </div>
                                <p><strong>Available:</strong> {new Date(selectedListing.availabilityDate).toLocaleDateString()}</p>
                                <p className="text-muted mb-1">
                                    <strong>Last Updated:</strong> {new Date(selectedListing.updatedAt).toLocaleDateString()}
                                </p>

                                {currentUser?.id !== selectedListing.user._id && (
                                    <>
                                        <ListingMessageBox
                                            receiverEmail={selectedListing.user.email}
                                            receiverId={selectedListing.user._id}
                                            senderId={currentUser.id}
                                            senderName={currentUser.fullName}
                                            senderEmail={currentUser.email}
                                            listingTitle={selectedListing.title}
                                        />

                                        <Button
                                            variant="outline-danger"
                                            className="mt-3"
                                            onClick={() => setShowReport(true)}
                                        >
                                            Report Listing
                                        </Button>

                                        <ReportModal
                                            show={showReport}
                                            onHide={() => setShowReport(false)}
                                            targetId={selectedListing._id}
                                            type="report_listing"
                                            targetLabel="Listing"
                                        />
                                    </>
                                )}

                            </Card.Body>
                        </Card>
                    ) : (
                        <p className="text-white text-center">Select a listing to view details.</p>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default BrowseListings;
