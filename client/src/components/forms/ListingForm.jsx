import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ReactSortable } from 'react-sortablejs';
import './ListingForm.css';

const utilitiesList = ['Water', 'Electricity', 'Internet', 'Gas', 'Laundry', 'Parking', 'Heating'];

const formatDate = (value) => {
    if (!value) return '';
    try {
        return new Date(value).toISOString().split('T')[0];
    } catch {
        return '';
    }
};

const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
};


const ListingForm = ({ onSubmit, initialData = {}, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [rent, setRent] = useState('');
    const [location, setLocation] = useState('');
    const [availabilityDate, setAvailabilityDate] = useState('');
    const [furnished, setFurnished] = useState(false);
    const [utilities, setUtilities] = useState([]);
    const [images, setImages] = useState([]);
    const [imagePreviewItems, setImagePreviewItems] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const isEdit = !!initialData && Object.keys(initialData).length > 0;

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            setRent(initialData.rent || '');
            setLocation(initialData.location || '');
            setAvailabilityDate(formatDate(initialData.availabilityDate));
            setFurnished(initialData.furnished || false);
            setUtilities(initialData.utilities || []);
            if (initialData.images?.length) {
                const formatted = initialData.images.map((url, i) => ({
                    id: i + 1,
                    src: typeof url === 'string' ? url : url.url,
                    file: null
                }));
                setImagePreviewItems(formatted);
                setImages(new Array(formatted.length).fill(null));
            }
        }
    }, [initialData]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const readers = files.map(
            (file) =>
                new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve({ file, src: reader.result });
                    reader.readAsDataURL(file);
                })
        );

        Promise.all(readers).then((newItems) => {
            const newFormatted = newItems.map((item, index) => ({
                id: Date.now() + index,
                src: item.src,
                file: item.file
            }));
            setImagePreviewItems((prev) => [...prev, ...newFormatted]);
            setImages((prev) => [...prev, ...newItems.map(item => item.file)]);
        });
    };

    const removeImage = (id) => {
        const index = imagePreviewItems.findIndex(item => item.id === id);
        const updatedPreviews = imagePreviewItems.filter(item => item.id !== id);
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImagePreviewItems(updatedPreviews);
        setImages(updatedImages);
    };

    const toggleUtility = (utility) => {
        setUtilities((prev) =>
            prev.includes(utility)
                ? prev.filter((u) => u !== utility)
                : [...prev, utility]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitted(false);

        const formData = new FormData();

        formData.append('title', title);
        formData.append('description', description);
        formData.append('rent', rent);
        formData.append('location', location);
        formData.append('availabilityDate', availabilityDate);
        formData.append('furnished', furnished);
        utilities.forEach((u) => formData.append('utilities', u));

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
        <Form onSubmit={handleSubmit} className="listing-form px-3">
            <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </Form.Group>

            <Row className="mb-3">
                <Col>
                    <Form.Label>Rent</Form.Label>
                    <Form.Control
                        type="number"
                        value={rent}
                        onChange={(e) => setRent(e.target.value)}
                        required
                    />
                </Col>
                <Col>
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </Col>
            </Row>

            <Form.Group className="mb-3">
                <Form.Label>Availability Date</Form.Label>
                <Form.Control
                    type="date"
                    value={availabilityDate}
                    min={getTomorrowDate()}
                    onChange={(e) => setAvailabilityDate(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3 d-flex align-items-center gap-3">
                <Form.Label className="mb-0">Furnished</Form.Label>
                <Form.Check
                    type="switch"
                    id="furnished-switch"
                    label={furnished ? 'Yes' : 'No'}
                    checked={furnished}
                    onChange={() => setFurnished(!furnished)}
                    style={{ transform: 'scale(1.2)' }}
                />
            </Form.Group>


            <Form.Group className="mb-3">
                <Form.Label>Utilities Included</Form.Label>
                <div className="utility-bubbles">
                    {utilitiesList.map((util, index) => (
                        <div
                            key={index}
                            className={`bubble ${utilities.includes(util) ? 'selected' : ''}`}
                            onClick={() => toggleUtility(util)}
                        >
                            {util}
                        </div>
                    ))}
                </div>
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
                            alt={`preview-${index}`}
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
                    {submitted ? 'Saved' : isSubmitting ? 'Saving...' : 'Save Listing'}
                </Button>

                {isEdit && onCancel && (
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

export default ListingForm;
