import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Pagination, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // ✅ Make sure this is imported
import { getAllProducts, toggleSaveProduct, getSavedProducts } from '../../services/userService';
import { jwtDecode } from 'jwt-decode';
import ProductFilterBar from '../layout/ProductFilterBar';
import ProductMessageBox from '../forms/ProductMessageBox';
import ReportModal from "../layout/ReportModal";

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const [savedProducts, setSavedProducts] = useState([]);
    const [showReport, setShowReport] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [conditionFilter, setConditionFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [priceSort, setPriceSort] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setCurrentUser({ id: decoded.id, fullName: decoded.fullName, email: decoded.email });
        }

        const fetchData = async () => {
            const all = await getAllProducts();
            const saved = await getSavedProducts();
            setProducts(all.filter(p => !p.isSold));
            setSavedProducts(saved);
        };

        fetchData();
    }, []);

    const handleToggleSave = async (productId) => {
        await toggleSaveProduct(productId);
        const updated = await getSavedProducts();
        setSavedProducts(updated);
    };

    const categories = [...new Set(products.map(p => p.category))];

    const filtered = products.filter(product => {
        return (
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (categoryFilter === '' || product.category === categoryFilter) &&
            (conditionFilter === '' || product.condition === conditionFilter)
        );
    }).sort((a, b) => {
        if (priceSort === 'lowest') return a.price - b.price;
        if (priceSort === 'highest') return b.price - a.price;
        if (sortOrder === 'newest') return new Date(b.updatedAt) - new Date(a.updatedAt);
        return new Date(a.updatedAt) - new Date(b.updatedAt);
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <Container fluid className="my-4">
            <h3 className="fw-bold text-center mb-4">Marketplace</h3>
            <Row>
                {/* Left side: Filters + Product Grid */}
                <Col lg={7} className="mb-3">
                    <ProductFilterBar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        conditionFilter={conditionFilter}
                        setConditionFilter={setConditionFilter}
                        categoryFilter={categoryFilter}
                        setCategoryFilter={setCategoryFilter}
                        categories={categories}
                        priceSort={priceSort}
                        setPriceSort={setPriceSort}
                        onReset={() => {
                            setSearchTerm('');
                            setSortOrder('newest');
                            setCategoryFilter('');
                            setConditionFilter('');
                            setPriceSort('');
                        }}
                    />



                    {paginated.length === 0 ? (
                        <div className="text-center text-white py-5">
                            <h5>No products found.</h5>
                            <p>Try adjusting your filters or search terms.</p>
                        </div>
                    ) : (
                        <Row xs={1} md={2} className="g-4">
                        {paginated.map(product => (
                            <Col key={product._id}>
                                <Card className="h-100 p-2 shadow-sm">
                                    {product.images?.[0] && (
                                        <Card.Img
                                            variant="top"
                                            src={product.images[0]}
                                            style={{
                                                height: '180px',
                                                objectFit: 'contain',               // changed from 'cover'
                                                backgroundColor: '#f8f9fa'          // light background to fill space around image
                                            }}
                                        />

                                    )}
                                    <Card.Body>
                                        <Card.Title>{product.title}</Card.Title>
                                        <div className="d-flex flex-wrap gap-2 mb-2">
                                            <Badge bg={product.condition === 'new' ? 'success' : 'warning'}>
                                                {product.condition}
                                            </Badge>
                                            <Badge bg="secondary">{product.category}</Badge>
                                            <Badge bg="dark">${product.price}</Badge>
                                        </div>
                                        <p className="text-muted mb-1">Seller: {product.user?.fullName} {product.user?.isVerified && <Badge bg="success">Verified</Badge>}</p>
                                        {currentUser?.id !== product.user._id && (
                                            <Button
                                                variant={savedProducts.some(p => p._id === product._id) ? 'outline-danger' : 'outline-success'}
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleToggleSave(product._id)}
                                            >
                                                {savedProducts.some(p => p._id === product._id) ? 'Unsave' : 'Save'}
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => setSelectedProduct(product)}
                                        >
                                            View
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>)}

                    {totalPages > 1 && (
                        <Pagination className="justify-content-center mt-4">
                            <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                            <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                            {[...Array(totalPages)].map((_, i) => (
                                <Pagination.Item
                                    key={i + 1}
                                    active={i + 1 === currentPage}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                            <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                            <Form.Select
                                size="sm"
                                style={{ width: '80px', marginLeft: '10px' }}
                                value={currentPage}
                                onChange={e => setCurrentPage(Number(e.target.value))}
                            >
                                {[...Array(totalPages)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>Page {i + 1}</option>
                                ))}
                            </Form.Select>
                        </Pagination>
                    )}
                </Col>

                {/* Right side: Full product view */}
                <Col lg={5}>
                    {selectedProduct ? (
                        <Card className="shadow-sm p-3">
                            {selectedProduct.images?.length > 1 ? (
                                <Carousel>
                                    {selectedProduct.images.map((img, i) => (
                                        <Carousel.Item key={i}>
                                            <img
                                                src={img}
                                                className="d-block w-100"
                                                style={{ height: '250px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                                                alt={`Slide ${i}`}
                                            />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            ) : selectedProduct.images?.length === 1 ? (
                                <img
                                    src={selectedProduct.images[0]}
                                    className="d-block w-100"
                                    style={{ height: '250px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                                    alt="Product"
                                />
                            ) : null}

                            <Card.Body>
                                <h5>{selectedProduct.title}</h5>
                                <div className="d-flex flex-wrap gap-2 mb-2">
                                    <Badge bg={selectedProduct.condition === 'new' ? 'success' : 'warning'}>
                                        {selectedProduct.condition}
                                    </Badge>
                                    <Badge bg="secondary">{selectedProduct.category}</Badge>
                                    <Badge bg="dark">${selectedProduct.price}</Badge>
                                </div>
                                <p>{selectedProduct.description}</p>
                                <p className="text-muted mb-1">
                                    Seller:{' '}
                                    <Link
                                        to={`/roommates/profile/${selectedProduct.user?._id}`}
                                        className="fw-semibold text-decoration-none"
                                    >
                                        {selectedProduct.user?.fullName}
                                    </Link>{' '}
                                    {selectedProduct.user?.isVerified && (
                                        <Badge bg="success">Verified</Badge>
                                    )}
                                </p>

                                {currentUser?.id !== selectedProduct.user._id && (
                                    <div className="mt-4">
                                        <ProductMessageBox
                                            receiverEmail={selectedProduct?.user?.email}
                                            receiverId={selectedProduct?.user?._id}
                                            senderId={currentUser.id}
                                            senderName={currentUser.fullName}
                                            senderEmail={currentUser.email}
                                            productTitle={selectedProduct.title}
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
                                    </div>
                                )}

                            </Card.Body>
                        </Card>
                    ) : (
                        <p className="text-white text-center">Select a product to view details.</p>
                    )}
                </Col>

            </Row>
        </Container>
    );
};

export default Marketplace;