import React, { useEffect, useState } from 'react';
import { Card, Button, Badge, Carousel } from 'react-bootstrap';
import { PlusCircle, PencilSquare } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import ListingForm from '../forms/ListingForm';
import {
    getMyListing,
    createListing,
    updateListing,
    deleteListing,
    renewListing
} from '../../services/listingService';

const YourListing = () => {
    const [listing, setListing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const isExpired = listing?.expiresAt && new Date(listing.expiresAt) < new Date();

    const fetchListing = async () => {
        try {
            const data = await getMyListing();
            setListing(data);
        } catch (err) {
            setListing(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListing();
    }, []);

    const handleSubmit = async (formData) => {
        try {
            if (listing) {
                await updateListing(listing._id, formData);
            } else {
                await createListing(formData);
            }
            await fetchListing();
            setShowForm(false); // ✅ hide form after save
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = () => setShowForm(true);
    const handleDelete = () => {
        toast.warn(
            ({ closeToast }) => (
                <div>
                    <div className="mb-2">Are you sure you want to delete your listing?</div>
                    <div className="d-flex justify-content-end gap-2">
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={closeToast}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={async () => {
                                try {
                                    await deleteListing();
                                    setListing(null);
                                    setShowForm(false);
                                    closeToast();
                                    toast.success('Listing deleted successfully!');
                                } catch {
                                    toast.error('Failed to delete listing.');
                                }
                            }}
                        >
                            Yes, Delete
                        </Button>
                    </div>
                </div>
            ),
            { autoClose: false }
        );
    };

    const handleRenew = async () => {
        try {
            await renewListing();
            toast.success('Listing renewed!');
            fetchListing(); // refresh updated listing
        } catch {
            toast.error('Failed to renew listing.');
        }
    };


    const handleEdit = () => setShowForm(true);

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="d-flex flex-column align-items-center mt-4">
            <div className="text-center mb-3">
                <h3 className="fw-bold mb-1">Your Listing</h3>
                <p className="text-white mb-0">Manage or create your personal rental listing</p>
            </div>

            {!showForm && listing ? (
                <Card className="p-4 shadow-sm w-100" style={{ maxWidth: '900px' }}>
                    <Carousel className="mb-3">
                        {listing.images?.map((img, index) => {
                            const imageUrl = typeof img === 'string' ? img : img.url;
                            return (
                                <Carousel.Item key={index}>
                                    <img
                                        src={imageUrl}
                                        className="d-block w-100"
                                        style={{ height: '300px', objectFit: 'cover', borderRadius: '10px' }}
                                        alt={listing.title}
                                        onError={(e) => (e.target.style.display = 'none')}
                                    />
                                </Carousel.Item>
                            );
                        })}
                    </Carousel>

                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <h5 className="fw-bold mb-2">{listing.location}</h5>
                            <div className="d-flex flex-wrap align-items-center gap-2">
                                {listing.isVerified && (
                                    <Badge bg="success" style={{ fontSize: '14px', padding: '6px 12px' }}>
                                        ✅ Verified
                                    </Badge>
                                )}
                                {listing.furnished && (
                                    <Badge bg="info" style={{ fontSize: '14px', padding: '6px 12px' }}>
                                        🛋️ Furnished
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <Button variant="outline-primary" size="sm" onClick={handleEdit}>
                            <PencilSquare className="me-1" /> Edit
                        </Button>
                        {isExpired && (
                            <Button
                                variant="warning"
                                size="sm"
                                onClick={handleRenew}
                            >
                                🔁 Renew Listing
                            </Button>
                        )}
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => {
handleDelete()
                            }}
                        >
                            🗑️ Delete
                        </Button>

                    </div>

                    <p><strong>Title:</strong> {listing.title}</p>
                    <p><strong>Description:</strong> {listing.description}</p>
                    <p><strong>Rent:</strong> ${listing.rent}/month</p>
                    <p><strong>Amenities:</strong> {listing.utilities?.join(', ') || 'None'}</p>
                    <p><strong>Available From:</strong> {new Date(listing.availabilityDate).toLocaleDateString()}</p>
                    <p className="text-muted">Last Modified: {new Date(listing.updatedAt).toLocaleString()}</p>
                </Card>
            ) : !showForm ? (
                <Card className="p-4 shadow-sm text-center" style={{ maxWidth: '500px' }}>
                    <h5 className="mb-3">You haven’t created a listing yet</h5>
                    <p className="text-muted">Let others find you by adding a rental listing.</p>
                    <Button variant="primary" onClick={handleCreate}>
                        <PlusCircle className="me-2" /> Create Listing
                    </Button>
                </Card>
            ) : (
                <ListingForm
                    initialData={listing || {}}
                    onSubmit={handleSubmit}
                    onCancel={() => setShowForm(false)}
                />
            )}
        </div>
    );
};

export default YourListing;
