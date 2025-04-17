import api from './api';

export const createListing = async (formData) => {
    const { data } = await api.post('/listings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
};

export const getMyListing = async () => {
    const { data } = await api.get('/listings/me');
    return data;
};

export const updateListing = async (id, formData) => {
    const { data } = await api.put(`/listings/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
};

export const deleteListing = async (id) => {
    await api.delete(`/listings/${id}`);
};

export const renewListing = async () => {
    const { data } = await api.patch('/listing/renew');
    return data;
};
