import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Form, Button, Tabs, Tab, Row, Col } from 'react-bootstrap';
import { createUserProfile } from '../../services/userService';
import { markProfileComplete } from '../../services/authService'; // ✅ import the new function
import { useNavigate } from 'react-router-dom';
import './ProfileForm.css';

const ProfileForm = () => {
    const [photo, setPhoto] = useState(null);
    const defaultPhoto = '/default_profile.png';

    const [gender, setGender] = useState('M');
    const [dob, setDob] = useState('');
    const [fullName, setFullName] = useState('');
    const [budget, setBudget] = useState(500);
    const [campus, setCampus] = useState('Surrey');
    const [pets, setPets] = useState(0);
    const [year, setYear] = useState(1);
    const [bio, setBio] = useState('');

    const navigate = useNavigate();

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file); // ✅ keep the actual File
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        const token = localStorage.getItem('token');

        // append file if exists
        if (photo && typeof photo !== 'string') {
            formData.append('profilePicture', photo); // must be the actual File
        }

        formData.append('fullName', fullName);
        formData.append('gender', gender);
        formData.append('dob', dob);
        formData.append('budget', budget);
        formData.append('campus', campus);
        formData.append('pets', pets);
        formData.append('year', year);
        formData.append('bio', bio);

        try {
            await createUserProfile(formData, token);
        
            // ✅ Mark profile as complete in the backend
            await markProfileComplete();
        
            // ✅ Optionally update localStorage if user is already stored
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                user.isProfileComplete = true;
                localStorage.setItem('user', JSON.stringify(user));
            }
        
            toast.success('Profile created successfully!');
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            console.error('Profile creation failed:', err);
            toast.error('Profile creation failed. Please try again.');
        }
        
    };



    return (
        <Form onSubmit={handleSubmit} className="profile-form">
            {/* Profile Picture */}
            <div className="text-center mb-4">
                <img
                    src={photo ? URL.createObjectURL(photo) : defaultPhoto}
                    alt="Profile Preview"
                    className="rounded-circle"
                    style={{
                        width: '90px',
                        height: '90px',
                        objectFit: 'cover',
                        border: '2px solid #ccc'
                    }}
                />
                <Form.Group controlId="photoUpload" className="mt-2">
                    <Form.Control type="file" accept="image/*" onChange={handlePhotoUpload} />
                </Form.Group>
            </div>

            {/* Full Name */}
            <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Full Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />
            </Form.Group>

            {/* Gender Tabs */}
            <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Gender</Form.Label>
                <Tabs activeKey={gender} onSelect={(k) => setGender(k)} className="mb-2">
                    <Tab eventKey="M" title="Male" />
                    <Tab eventKey="F" title="Female" />
                    <Tab eventKey="Other" title="Other" />
                    <Tab eventKey="Prefer not to say" title="Prefer not to say" />
                </Tabs>
            </Form.Group>

            {/* DOB + Budget */}
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Group controlId="dob">
                        <Form.Label className="fw-semibold">Date of Birth</Form.Label>
                        <Form.Control
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            required
                            max={new Date().toISOString().split('T')[0]} // prevents future date
                        />

                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="budget">
                        <Form.Label className="fw-semibold">Budget</Form.Label>
                        <Form.Range
                            min={0}
                            max={4000}
                            step={50}
                            value={budget}
                            onChange={(e) => setBudget(Number(e.target.value))}
                        />
                        <p className="text-muted">Selected Budget: ${budget}</p>
                    </Form.Group>
                </Col>
            </Row>

            {/* Campus Tabs */}
            <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Campus</Form.Label>
                <Tabs activeKey={campus} onSelect={(k) => setCampus(k)} className="mb-2">
                    <Tab eventKey="Surrey" title="Surrey" />
                    <Tab eventKey="Richmond" title="Richmond" />
                    <Tab eventKey="Langley" title="Langley" />
                    <Tab eventKey="Civic Plaza" title="Civic Plaza" />
                </Tabs>
            </Form.Group>

            {/* Pets + Year */}
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Group controlId="pets">
                        <Form.Label className="fw-semibold">Pets</Form.Label>
                        <Form.Control
                            type="number"
                            min={0}
                            value={pets}
                            onChange={(e) => setPets(Number(e.target.value))}
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="year">
                        <Form.Label className="fw-semibold">Year (1-4)</Form.Label>
                        <Form.Control
                            type="number"
                            min={1}
                            max={4}
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                        />
                    </Form.Group>
                </Col>
            </Row>

            {/* Bio */}
            <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Bio</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Tell us about yourself"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
            </Form.Group>

            {/* Submit */}
            <div className="text-center">
                <Button type="submit" variant="dark" className="px-5">
                    Save & Continue
                </Button>
            </div>
        </Form>
    );
};

export default ProfileForm;
