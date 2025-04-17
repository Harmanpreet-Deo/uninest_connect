import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RedirectHandler() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) return navigate('/auth');

        axios.get('https://uninest-connect.onrender.com/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            const user = res.data;

            if (user.isProfileComplete) {
                navigate('/dashboard');
            } else {
                navigate('/profile/create');
            }
        }).catch(err => {
            console.error('Auth check failed:', err);
            localStorage.removeItem('token');
            navigate('/auth');
        });
    }, [navigate]);

    return null;
}
