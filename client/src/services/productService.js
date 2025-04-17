import api from './api'; // baseURL is already set

export const createProduct = async (formData) => {
    const { data } = await api.post('/products/create', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return data;
};

export const getUserProducts = async () => {
    const { data } = await api.get('/products/me');
    return data;
};

export const updateProduct = async (id, formData) => {
    const { data } = await api.put(`/products/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return data;
};

export const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
};

export const updateProductStatus = async (id, isSold) => {
    await api.patch(`/products/${id}/sold`, { isSold }); // ✅ dynamic
};


