// File: AdminUserProduct.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductByIdAdmin } from '../../services/adminService';
import { Container, Row, Col, Card, Spinner, Badge, Carousel } from 'react-bootstrap';

const AdminUserProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductByIdAdmin(id);
                setProduct(data);
            } catch (err) {
                console.error('Failed to fetch product:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="dark" /></div>;
    if (!product) return <p className="text-center text-muted mt-5">Product not found.</p>;

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <h3 className="text-center fw-bold mb-4">View Product</h3>
                    <Card className="p-4 shadow-sm">
                        {product.images?.length > 0 && (
                            product.images.length > 1 ? (
                                <Carousel className="mb-3">
                                    {product.images.map((img, i) => (
                                        <Carousel.Item key={i}>
                                            <img
                                                src={img.url}
                                                alt={`Product ${i + 1}`}
                                                className="d-block w-100"
                                                style={{ height: '250px', objectFit: 'contain', borderRadius: '8px' }}
                                            />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            ) : (
                                <img
                                    src={product.images[0].url}
                                    className="img-fluid rounded border mb-3"
                                    style={{ height: '250px', objectFit: 'contain' }}
                                    alt={product.title}
                                />
                            )
                        )}

                        <h4 className="fw-bold">{product.title}</h4>
                        <div className="d-flex flex-wrap gap-2 mb-2">
                            <Badge bg={product.condition === 'new' ? 'success' : 'warning'}>
                                {product.condition}
                            </Badge>
                            <Badge bg="secondary">{product.category}</Badge>
                            <Badge bg="dark">${product.price}</Badge>
                        </div>

                        <p className="mb-3">{product.description}</p>

                        <p className="mb-1">
                            <strong>Owner:</strong>{' '}
                            <a
                                href={`/admin/user/${product.user._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="fw-semibold text-decoration-none"
                            >
                                {product.user.fullName}
                            </a>
                        </p>
                        {product.user?.isVerified && <Badge bg="success" className="ms-2">Verified</Badge>}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminUserProduct;
