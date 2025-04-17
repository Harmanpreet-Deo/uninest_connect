import React, { useEffect, useState } from 'react';
import {
    Card, Button, Badge, Carousel, Row, Col, Pagination
} from 'react-bootstrap';
import { PlusCircle, PencilSquare } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import ProductForm from '../forms/ProductForm';
import ProductFilterBar from "../layout/ProductFilterBar";

import {
    getUserProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus
} from '../../services/productService';

const YourProducts = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [conditionFilter, setConditionFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [priceSort, setPriceSort] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const fetchProducts = async () => {
        try {
            const res = await getUserProducts();
            setProducts(res);
        } catch {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        let filtered = [...products];
        if (searchTerm) filtered = filtered.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
        if (conditionFilter) filtered = filtered.filter(p => p.condition === conditionFilter);
        if (categoryFilter) filtered = filtered.filter(p => p.category === categoryFilter);

        if (priceSort === 'lowest') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (priceSort === 'highest') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortOrder === 'newest') {
            filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        } else {
            filtered.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
        }

        setFilteredProducts(filtered);
        setCurrentPage(1);
    }, [products, sortOrder, conditionFilter, categoryFilter, priceSort, searchTerm]);

    const handleSubmit = async (formData) => {
        try {
            if (editingProduct) {
                await updateProduct(editingProduct._id, formData);
                toast.success('Product updated!');
            } else {
                await createProduct(formData);
                toast.success('Product created!');
            }
            await fetchProducts();
            setShowForm(false);
            setEditingProduct(null);
        } catch (err) {
            const message = err?.response?.data?.message || 'Failed to save product';
            toast.error(message);
        }
    };

    const toggleSold = async (product) => {
        try {
            await updateProductStatus(product._id, !product.isSold);
            await fetchProducts();
            toast.success(`Marked as ${!product.isSold ? 'Sold' : 'Available'}`);
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = (id) => {
        toast.warn(
            ({ closeToast }) => (
                <div>
                    <div className="mb-2">Are you sure you want to delete this product?</div>
                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="outline-secondary" size="sm" onClick={closeToast}>Cancel</Button>
                        <Button variant="danger" size="sm" onClick={async () => {
                            try {
                                await deleteProduct(id);
                                closeToast();
                                toast.success('Product deleted!');
                                await fetchProducts();
                            } catch {
                                toast.error('Failed to delete product');
                            }
                        }}>
                            Yes, Delete
                        </Button>
                    </div>
                </div>
            ),
            { autoClose: false }
        );
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleCreate = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    const categories = [...new Set(products.map(p => p.category))];
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginated = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="d-flex flex-column align-items-center mt-4">
            <div className="text-center mb-3">
                <h3 className="fw-bold mb-1">Your Products</h3>
                <p className="text-white mb-0">Manage or list items you want to sell</p>
            </div>

            {!showForm && products.length > 0 && (
                <div className="w-100 mb-4 d-flex align-items-start justify-content-between flex-row" style={{ maxWidth: '1200px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ all: 'unset', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <ProductFilterBar
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            sortOrder={sortOrder}
                            setSortOrder={setSortOrder}
                            conditionFilter={conditionFilter}
                            setConditionFilter={setConditionFilter}
                            categoryFilter={categoryFilter}
                            setCategoryFilter={setCategoryFilter}
                            priceSort={priceSort}
                            setPriceSort={setPriceSort}
                            categories={categories}
                            onReset={() => {
                                setSortOrder('newest');
                                setConditionFilter('');
                                setCategoryFilter('');
                                setSearchTerm('');
                                setPriceSort('');
                            }}
                        />
                    </div>
                    <Button variant="primary" size="sm" onClick={handleCreate}>
                        <PlusCircle className="me-2" /> Add Product
                    </Button>
                </div>
            )}


            {showForm ? (
                <ProductForm
                    initialData={editingProduct || {}}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingProduct(null);
                    }}
                />
            ) : products.length === 0 ? (
                <div className="text-center mt-5">
                    <h5>You haven't added any products yet.</h5>
                    <Button className="mt-3" variant="dark" onClick={handleCreate}>
                        <PlusCircle className="me-2" /> Add Your First Product
                    </Button>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center mt-4">
                    <h5 className="mb-3">No products match your filters.</h5>
                    <p className="text-muted">Try adjusting your filters or create a new product.</p>
                </div>
            ) : (
                <div className="container">
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {paginated.map(product => (
                            <Col key={product._id}>
                                <Card className="p-3 shadow-sm h-100">
                                    {product.images?.length > 0 && (
                                        <Carousel className="mb-3">
                                            {product.images.map((img, index) => (
                                                <Carousel.Item key={index}>
                                                    <img
                                                        src={img}
                                                        className="d-block w-100"
                                                        style={{ height: '240px', objectFit: 'cover', borderRadius: '8px' }}
                                                        alt={product.title}
                                                    />
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>
                                    )}
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <h5 className="fw-bold">{product.title}</h5>
                                            <div className="d-flex flex-wrap align-items-center gap-2">
                                                {product.isSold && (
                                                    <Badge bg="danger">Sold</Badge>
                                                )}
                                                <Badge bg="secondary">{product.category}</Badge>
                                                <Badge bg={product.condition === 'new' ? 'success' : 'warning'}>
                                                    {product.condition === 'new' ? 'New' : 'Used'}
                                                </Badge>
                                                <Badge bg="dark">${product.price}</Badge>
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <Button variant="outline-primary" size="sm" onClick={() => handleEdit(product)}>
                                                <PencilSquare className="me-1" /> Edit
                                            </Button>
                                            <Button
                                                variant={product.isSold ? 'warning' : 'success'}
                                                size="sm"
                                                onClick={() => toggleSold(product)}
                                            >
                                                {product.isSold ? 'Mark as Available' : 'Mark as Sold'}
                                            </Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(product._id)}>
                                                🗑️ Delete
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="mb-1">{product.description}</p>
                                    <p className="text-muted small mb-0">
                                        Last Updated: {new Date(product.updatedAt).toLocaleString()}
                                    </p>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {totalPages > 1 && (
                        <Pagination className="justify-content-center mt-4">
                            {[...Array(totalPages)].map((_, index) => (
                                <Pagination.Item
                                    key={index + 1}
                                    active={index + 1 === currentPage}
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    )}
                </div>
            )}
        </div>
    );
};

export default YourProducts;
