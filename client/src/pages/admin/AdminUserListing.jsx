// File: AdminUserListing.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Badge, Carousel } from 'react-bootstrap';
import { getListingByIdAdmin } from '../../services/adminService';

const AdminUserListing = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const data = await getListingByIdAdmin(id);
                setListing(data);
            } catch (err) {
                console.error('Failed to fetch listing:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [id]);

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="dark" /></div>;
    if (!listing) return <p className="text-center text-muted mt-5">Listing not found.</p>;

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <h3 className="text-center fw-bold mb-4">View Listing</h3>
                    <Card className="p-4 shadow-sm">
                        {listing.images?.length > 0 && (
                            <Carousel className="mb-3">
                                {listing.images.map((img, i) => (
                                    <Carousel.Item key={i}>
                                        <img
                                            src={img.url}
                                            className="d-block w-100"
                                            style={{ height: '300px', objectFit: 'contain' }}
                                            alt={`Slide ${i}`}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        )}

                        <Card.Body>
                            <h4>{listing.title}</h4>
                            <p className="text-muted">{listing.description}</p>

                            <div className="d-flex flex-wrap gap-2 mb-3">
                                <Badge bg="secondary">{listing.location}</Badge>
                                <Badge bg="dark">${listing.rent}</Badge>
                                {listing.furnished && <Badge bg="info">Furnished</Badge>}
                                {listing.isVerified && <Badge bg="success">Verified</Badge>}
                                {listing.utilities?.map((util, i) => (
                                    <Badge key={i} bg="light" text="dark">{util}</Badge>
                                ))}
                            </div>

                            <p><strong>Available from:</strong> {new Date(listing.availabilityDate).toLocaleDateString()}</p>
                            <p className="mb-1"><strong>Last Updated:</strong> {new Date(listing.updatedAt).toLocaleDateString()}</p>

                            <p className="mb-0">
                                <strong>Owner:</strong>{' '}
                                <a
                                    href={`/admin/user/${listing.user?._id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="fw-semibold text-decoration-none"
                                >
                                    {listing.user?.fullName}
                                </a>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminUserListing;
