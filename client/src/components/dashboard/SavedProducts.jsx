import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Carousel } from 'react-bootstrap';
import { getSavedProducts, toggleSaveProduct } from '../../services/userService';
import { jwtDecode } from 'jwt-decode';
import ProductMessageBox from '../forms/ProductMessageBox';
import ReportModal from "../layout/ReportModal";

const SavedProducts = () => {
    const [savedProducts, setSavedProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showReport, setShowReport] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterCondition, setFilterCondition] = useState('All');
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

        const fetchSaved = async () => {
            try {
                const data = await getSavedProducts();
                setSavedProducts(data);
                if (data.length > 0) setSelectedProduct(data[0]);
            } catch (err) {
                console.error('Failed to load saved products:', err);
            }
        };

        fetchSaved();
    }, []);

    const handleUnsave = async (productId) => {
        try {
            await toggleSaveProduct(productId);
            const updated = savedProducts.filter(p => p._id !== productId);
            setSavedProducts(updated);
            if (selectedProduct?._id === productId) {
                setSelectedProduct(null);
            }
        } catch (err) {
            console.error('Failed to unsave product:', err);
        }
    };

    const filteredProducts = savedProducts.filter(product => {
        return (
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterCategory === 'All' || product.category === filterCategory) &&
            (filterCondition === 'All' || product.condition === filterCondition)
        );
    });

    return (
        <Container fluid className="my-4">
            <h3 className="fw-bold text-center mb-4">Saved Products</h3>
            <Row>
                {/* Product List (7/12) */}
                <Col md={7} style={{ maxHeight: '80vh', marginBottom: '10vh' }}>
                    <Form.Control
                        type="text"
                        placeholder="Search saved products..."
                        className="mb-2"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div className="d-flex gap-2 mb-3">
                        <Form.Select
                            size="sm"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Books">Books</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Appliances">Appliances</option>
                            <option value="Tools">Tools</option>
                            <option value="Office Supplies">Office Supplies</option>
                            <option value="Other">Other</option>
                        </Form.Select>

                        <Form.Select
                            size="sm"
                            value={filterCondition}
                            onChange={(e) => setFilterCondition(e.target.value)}
                        >
                            <option value="All">All Conditions</option>
                            <option value="new">New</option>
                            <option value="used">Used</option>
                        </Form.Select>

                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                                setSearchTerm('');
                                setFilterCategory('All');
                                setFilterCondition('All');
                            }}
                        >
                            Reset Filters
                        </Button>
                    </div>

                    <Row xs={1} sm={2} className="g-3 mt-3" style={{ maxHeight: '75vh', overflowY: 'scroll' }}>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <Col key={product._id}>
                                    <Card
                                        onClick={() => setSelectedProduct(product)}
                                        className={`shadow-sm p-2 ${selectedProduct?._id === product._id ? 'border-primary' : ''}`}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Card.Img
                                            variant="top"
                                            src={product.images[0] || '/placeholder.jpg'}
                                            style={{
                                                height: '140px', objectFit: 'contain',               // changed from 'cover'
                                                backgroundColor: '#f8f9fa'
                                            }}
                                        />
                                        <Card.Body className="p-2">
                                            <strong className="d-block text-truncate mb-1">{product.title}</strong>

                                            {/* ✅ Add this badge section */}
                                            <div className="d-flex flex-wrap gap-1 mb-2">
                                                <Badge bg={product.condition === 'new' ? 'success' : 'warning'}>{product.condition}</Badge>
                                                <Badge bg="secondary">{product.category}</Badge>
                                                <Badge bg="dark">${product.price}</Badge>
                                            </div>

                                            <small className="text-black d-block mb-2">
                                                Seller: <a href={`/roommates/profile/${product.user?._id}`} className="text-decoration-none">{product.user?.fullName}</a>
                                                {product.user?.isVerified && <Badge bg="success" className="ms-2">Verified</Badge>}
                                            </small>

                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                className="w-100"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUnsave(product._id);
                                                }}
                                            >
                                                Unsave
                                            </Button>
                                        </Card.Body>

                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <p className="text-white">No saved products found.</p>
                        )}
                    </Row>
                </Col>

                {/* Full View (5/12) */}
                <Col md={5}>
                    {selectedProduct ? (
                        <Card className="p-4 shadow-sm">
                            {selectedProduct.images?.length > 1 ? (
                                <Carousel className="mb-3">
                                    {selectedProduct.images.map((img, i) => (
                                        <Carousel.Item key={i}>
                                            <img
                                                src={img}
                                                className="d-block w-100"
                                                style={{ height: '240px', objectFit: 'cover', borderRadius: '8px' }}
                                                alt={`Slide ${i}`}
                                            />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            ) : (
                                <img
                                    src={selectedProduct.images[0] || '/placeholder.jpg'}
                                    alt={selectedProduct.title}
                                    className="img-fluid rounded border mb-3"
                                />
                            )}

                            <h5 className="fw-bold">{selectedProduct.title}</h5>
                            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                                <Badge bg={selectedProduct.condition === 'new' ? 'success' : 'warning'}>{selectedProduct.condition}</Badge>
                                <Badge bg="secondary">{selectedProduct.category}</Badge>
                                <Badge bg="dark">${selectedProduct.price}</Badge>
                            </div>
                            <p>{selectedProduct.description}</p>
                            <p className="text-muted mb-2">
                                Seller: <a href={`/roommates/profile/${selectedProduct.user?._id}`} className="text-decoration-none">{selectedProduct.user?.fullName}</a>
                                {selectedProduct.user?.isVerified && <Badge bg="success" className="ms-2">Verified</Badge>}
                            </p>

                            <hr />

                            <ProductMessageBox
                                receiverEmail={selectedProduct.user.email}
                                receiverId={selectedProduct.user._id}
                                senderId={currentUser?._id}
                                senderName={currentUser?.fullName}
                                senderEmail={currentUser?.email}
                            />
                            <Button
                                variant="outline-danger"
                                className="mt-3"
                                onClick={() => setShowReport(true)}
                            >
                                Report Product
                            </Button>

                            <ReportModal
                                show={showReport}
                                onHide={() => setShowReport(false)}
                                targetId={selectedProduct._id}
                                type="report_product"
                                targetLabel="Product"
                            />
                        </Card>
                    ) : (
                        <Card className="p-4 text-center shadow-sm">
                            <p className="text-white">Select a product to view details and message the owner.</p>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default SavedProducts;