import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ReactSortable } from 'react-sortablejs';
import './ProductForm.css';

const categories = [
    'Electronics', 'Books', 'Furniture', 'Clothing', 'Appliances',
    'Sports', 'Toys', 'Tools', 'Automotive', 'Home Decor',
    'Health & Beauty', 'Office Supplies', 'Musical Instruments',
    'Garden', 'Art & Craft', 'Pet Supplies', 'Footwear', 'Jewelry', 'Other'
];

const ProductForm = ({ onSubmit, initialData = {}, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState('new');
    const [images, setImages] = useState([]);
    const [imagePreviewItems, setImagePreviewItems] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            setPrice(initialData.price || '');
            setCategory(initialData.category || '');
            setCondition(initialData.condition || 'new');

            if (initialData.images?.length) {
                const formatted = initialData.images.map((url, i) => ({
                    id: Date.now() + i,
                    src: typeof url === 'string' ? url : url.url,
                    file: null,
                }));
                setImagePreviewItems(formatted);
                setImages(formatted.map(item => null)); // Maintain index sync
            }
        }
    }, [initialData]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const readers = files.map((file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve({ file, src: reader.result });
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers).then((newItems) => {
            const formatted = newItems.map((item, i) => ({
                id: Date.now() + i,
                src: item.src,
                file: item.file
            }));

            setImagePreviewItems(prev => [...prev, ...formatted]);
            setImages(prev => [...prev, ...formatted.map(f => f.file)]);
        });
    };

    const removeImage = (id) => {
        const index = imagePreviewItems.findIndex(item => item.id === id);
        if (index === -1) return;
        const updatedPreview = imagePreviewItems.filter((_, i) => i !== index);
        const updatedImages = images.filter((_, i) => i !== index);
        setImagePreviewItems(updatedPreview);
        setImages(updatedImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitted(false);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('condition', condition);

        imagePreviewItems.forEach((item, i) => {
            if (!item.file && typeof item.src === 'string') {
                formData.append('existingImages', item.src);
            } else if (item.file) {
                formData.append('images', item.file);
            }
        });

        await onSubmit(formData);
        setIsSubmitting(false);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2000);
    };

    return (
        <Form onSubmit={handleSubmit} className="product-form px-3">
            <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    value={title}
                    maxLength={100}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </Form.Group>

            <Row className="mb-3">
                <Col>
                    <Form.Label>Price ($)</Form.Label>
                    <Form.Control
                        type="number"
                        value={price}
                        min={0.01}
                        step="0.01"
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </Col>
                <Col>
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select...</option>
                        {categories.map((cat, i) => (
                            <option key={i} value={cat}>{cat}</option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>

            <Form.Group className="mb-3 d-flex align-items-center gap-3">
                <Form.Label className="mb-0">Condition</Form.Label>
                <Form.Check
                    type="switch"
                    id="condition-switch"
                    label={condition === 'new' ? 'New' : 'Used'}
                    checked={condition === 'new'}
                    onChange={() => setCondition(condition === 'new' ? 'used' : 'new')}
                    style={{ transform: 'scale(1.2)' }}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Upload Images</Form.Label>
                <Form.Control
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                />
            </Form.Group>

            <ReactSortable
                list={imagePreviewItems}
                setList={setImagePreviewItems}
                className="image-preview d-flex flex-wrap gap-2 mb-3"
            >
                {imagePreviewItems.map((item, index) => (
                    <div key={item.id} className="position-relative">
                        <img
                            src={item.src}
                            alt={`Product ${index + 1}`}
                            style={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                            }}
                        />
                        <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0"
                            onClick={() => removeImage(item.id)}
                            style={{
                                borderRadius: '50%',
                                padding: '0 6px',
                                fontSize: '12px',
                            }}
                        >
                            ×
                        </Button>
                    </div>
                ))}
            </ReactSortable>

            <div className="d-flex gap-2 mt-2">
                <Button
                    type="submit"
                    variant={submitted ? 'success' : 'primary'}
                    disabled={isSubmitting}
                >
                    {submitted ? 'Saved' : isSubmitting ? 'Saving...' : 'Save Product'}
                </Button>
                {onCancel && (
                    <Button
                        variant="danger"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </Form>
    );
};

export default ProductForm;
