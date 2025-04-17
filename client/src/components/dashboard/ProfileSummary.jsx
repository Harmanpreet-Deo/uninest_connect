import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Form, Tabs, Tab } from 'react-bootstrap';
import { getCurrentUser, updateUserProfile } from '../../services/userService';
import { toast } from 'react-toastify';
import BubbleSelect from '../common/BubbleSelect';
import './ProfileSummary.css';
import {createUserProfile} from "../../services/userService";

import { PencilSquare, XCircle } from 'react-bootstrap-icons';

const ProfileSummary = () => {
  const [editMode, setEditMode] = useState(false);
  const [status, setStatus] = useState('Looking for Roommate');
  const [profile, setProfile] = useState({});
  const [backupProfile, setBackupProfile] = useState({});
  const [originalStatus, setOriginalStatus] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // Add this at the top

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show immediate preview
    setSelectedFile(file); // Store for actual upload later
    setProfile((prev) => ({
      ...prev,
      profilePicture: URL.createObjectURL(file),
    }));

    toast.info('Photo selected! Changes will apply after saving.');
  };




  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(Date.parse(dob)); // forces ISO
    if (isNaN(birthDate.getTime())) return '';
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const age = calculateAge(profile.dob);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setProfile((prev) => ({ ...prev, [name]: val }));
  };



  const toggleStatus = () => {
    const updated = status === 'Looking for Roommate' ? 'Looking for a Place to Rent' : 'Looking for Roommate';
    setStatus(updated);
    setProfile((prev) => ({ ...prev, status: updated }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');

    try {
      let photoUrl = profile.photo;

      // 🔼 Upload photo if a new file was selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('profilePicture', selectedFile);

        const uploaded = await createUserProfile(formData, token);
        photoUrl = uploaded.profilePicture;
      }

      // 🔄 Prepare final payload
      const updatedProfile = {
        ...profile,
        profilePicture: photoUrl,
        hobbies: Array.isArray(profile.hobbies) ? profile.hobbies.join(',') : profile.hobbies,
        languagesSpoken: Array.isArray(profile.languagesSpoken) ? profile.languagesSpoken.join(',') : profile.languagesSpoken
      };

      await updateUserProfile(updatedProfile, token);
      setEditMode(false);
      setSelectedFile(null); // reset selected image
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Update failed:', err);
      toast.error('Failed to update profile.');
    }
  };


  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchProfile = async () => {
      try {
        const userData = await getCurrentUser(token);
        setProfile({
          ...userData,
          sleepSchedule: userData.sleepSchedule || '',
          studyStyle: userData.studyStyle || '',
          socialPreference: userData.socialPreference || '',
          foodPreference: userData.foodPreference || '',
          hobbies: userData.hobbies ? userData.hobbies.split(',') : [],
          languagesSpoken: userData.languagesSpoken ? userData.languagesSpoken.split(',') : [],
          smoking: !!userData.smoking,
          drinking: !!userData.drinking,
          guestFriendly: !!userData.guestFriendly,
        });
        setStatus(userData.status || 'Looking for Roommate');
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };
    fetchProfile();
  }, []);

  return (
      <div className="d-flex flex-column align-items-center mt-4">
        <div className="text-center mb-3">
          <h3 className="fw-bold mb-1">My Profile</h3>
          <p className="text-white mb-0">Manage your profile and preferences</p>
        </div>

        <Card className="profile-summary-form p-4 shadow-sm position-relative">
          <Button
              variant="link"
              onClick={() => {
                if (!editMode) {
                  setBackupProfile(profile);
                  setOriginalStatus(status);
                  setEditMode(true);
                } else {
                  setProfile(backupProfile);
                  setStatus(originalStatus);
                  setEditMode(false);
                }
              }}
              className="position-absolute top-0 end-0 m-3 p-1 edit-icon"
          >
            {editMode ? <XCircle size={20} color="red" /> : <PencilSquare size={20} />}
          </Button>


          <div className="text-center mb-4">
            <img
                src={profile.profilePicture || '/default_profile.png'}
                alt="Profile"
                className="rounded-circle shadow-sm mb-2"
                style={{ width: '90px', height: '90px', objectFit: 'cover' }}
            />

            {editMode && <Form.Control type="file" accept="image/*" onChange={handlePhotoUpload} />}
            <h4 className="fw-bold mt-2">{profile.fullName}</h4>
            <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap">
              {profile.isVerified && (
                  <span className="text-success fw-semibold">✅ Verified</span>
              )}
              {editMode ? (
                  <div className="custom-toggle-wrapper">
                    <label className="switch">
                      <input
                          type="checkbox"
                          checked={status === 'Looking for Roommate'}
                          onChange={toggleStatus}
                      />
                      <span className="slider round"></span>
                    </label>
                    <span className="ms-2">{status}</span>
                  </div>
              ) : (
                  <span><strong>Status:</strong> {status}</span>
              )}
            </div>
          </div>

          <Form>
            <Row>
              <Col md={6}>
                <Row className="mb-3">
                  <Col><Form.Label><strong>Email</strong></Form.Label><Form.Control plaintext readOnly value={profile.email || ''} /></Col>
                </Row>
                <Row className="mb-3">
                  <Col><Form.Label><strong>Budget</strong></Form.Label>{editMode ? (<><Form.Range min={0} max={4000} step={50} value={profile.budget || 0} onChange={(e) => setProfile((prev) => ({ ...prev, budget: +e.target.value }))} /><div className="text-muted">Selected Budget: ${profile.budget}</div></>) : (<Form.Control plaintext readOnly value={`$${profile.budget ?? 'Not specified'}`} />)}</Col>
                </Row>
                <Row className="mb-3">
                  <Col><Form.Label><strong>Gender</strong></Form.Label>{editMode ? (<Tabs activeKey={profile.gender} onSelect={(k) => setProfile((prev) => ({ ...prev, gender: k }))}><Tab eventKey="Male" title="Male" /><Tab eventKey="Female" title="Female" /><Tab eventKey="Other" title="Other" /><Tab eventKey="Prefer not to say" title="Prefer not to say" /></Tabs>) : (<Form.Control plaintext readOnly value={profile.gender || 'Not set'} />)}</Col>
                </Row>
                <Row className="mb-3">
                  <Col><Form.Label><strong>Campus</strong></Form.Label>{editMode ? (<Tabs activeKey={profile.campus} onSelect={(k) => setProfile((prev) => ({ ...prev, campus: k }))}><Tab eventKey="Surrey" title="Surrey" /><Tab eventKey="Richmond" title="Richmond" /><Tab eventKey="Langley" title="Langley" /><Tab eventKey="Civic Plaza" title="Civic Plaza" /></Tabs>) : (<Form.Control plaintext readOnly value={profile.campus || 'Not set'} />)}</Col>
                </Row>
                <Row className="mb-3">
                  <Col><Form.Label><strong>Year</strong></Form.Label>{editMode ? <Form.Control name="year" type="number" min={1} max={4} value={profile.year || ''} onChange={handleChange} /> : <Form.Control plaintext readOnly value={profile.year || 'Not set'} />}</Col>
                </Row>
                <Row className="mb-3">
                  <Col><Form.Label><strong>Pets</strong></Form.Label>{editMode ? <Form.Control name="pets" type="number" min={0} value={profile.pets || ''} onChange={handleChange} /> : <Form.Control plaintext readOnly value={profile.pets || 'Not set'} />}</Col>
                </Row>
                <Row className="mb-3">
                  <Col><Form.Label><strong>Age</strong></Form.Label><Form.Control plaintext readOnly value={age ? `${age} years` : 'Not provided'} /></Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label><strong>Bio</strong></Form.Label>
                  {editMode ? <Form.Control as="textarea" name="bio" rows={3} value={profile.bio || ''} onChange={handleChange} /> : <Card className="p-3 bg-light border rounded-3"><p className="mb-0">{profile.bio || 'Not set'}</p></Card>}
                </Form.Group>
              </Col>

              <Col md={6}>
                <h5 className="fw-bold mb-3">Preferences</h5>
                {!editMode ? (
                    <>
                      <Row className="mb-3">
                        <Col><Form.Label><strong>Sleep Schedule</strong></Form.Label><Form.Control plaintext readOnly value={profile.sleepSchedule || 'Not set'} /></Col>
                        <Col><Form.Label><strong>Study Style</strong></Form.Label><Form.Control plaintext readOnly value={profile.studyStyle || 'Not set'} /></Col>
                      </Row>
                      <Row className="mb-3">
                        <Col><Form.Label><strong>Social Preference</strong></Form.Label><Form.Control plaintext readOnly value={profile.socialPreference || 'Not set'} /></Col>
                        <Col><Form.Label><strong>Food Preference</strong></Form.Label><Form.Control plaintext readOnly value={profile.foodPreference || 'Not set'} /></Col>
                      </Row>
                      <Row className="mb-3">
                        <Col><Form.Label><strong>Hobbies</strong></Form.Label><Form.Control plaintext readOnly value={profile.hobbies?.length ? profile.hobbies.join(', ') : 'Not set'} /></Col>
                      </Row>
                      <Row className="mb-3">
                        <Col><Form.Label><strong>Languages Spoken</strong></Form.Label><Form.Control plaintext readOnly value={profile.languagesSpoken?.length ? profile.languagesSpoken.join(', ') : 'Not set'} /></Col>
                      </Row>
                      <Row className="mb-3">
                        <Col><Form.Label><strong>Smoking</strong></Form.Label><Form.Control plaintext readOnly value={profile.smoking ? 'Yes' : 'No'} /></Col>
                        <Col><Form.Label><strong>Drinking</strong></Form.Label><Form.Control plaintext readOnly value={profile.drinking ? 'Yes' : 'No'} /></Col>
                        <Col><Form.Label><strong>Guest Friendly</strong></Form.Label><Form.Control plaintext readOnly value={profile.guestFriendly ? 'Yes' : 'No'} /></Col>
                      </Row>
                    </>
                ) : (
                    <>
                      <Form.Label className="mt-3"><strong>Sleep Schedule</strong></Form.Label>
                      <BubbleSelect options={['Early Bird', 'Night Owl']} selected={profile.sleepSchedule} onChange={(val) => setProfile({ ...profile, sleepSchedule: val })} />

                      <Form.Label className="mt-3"><strong>Study Style</strong></Form.Label>
                      <BubbleSelect options={['Quiet', 'Collaborative']} selected={profile.studyStyle} onChange={(val) => setProfile({ ...profile, studyStyle: val })} />

                      <Form.Label className="mt-3"><strong>Social Preference</strong></Form.Label>
                      <BubbleSelect options={['Introvert', 'Extrovert']} selected={profile.socialPreference} onChange={(val) => setProfile({ ...profile, socialPreference: val })} />

                      <Form.Label className="mt-3"><strong>Food Preference</strong></Form.Label>
                      <BubbleSelect options={['Vegetarian', 'Non-Vegetarian', 'Vegan']} selected={profile.foodPreference} onChange={(val) => setProfile({ ...profile, foodPreference: val })} />

                      <Form.Check type="checkbox" label="Smoking" name="smoking" checked={profile.smoking} onChange={handleChange} />
                      <Form.Check type="checkbox" label="Drinking" name="drinking" checked={profile.drinking} onChange={handleChange} />
                      <Form.Check type="checkbox" label="Guest Friendly" name="guestFriendly" checked={profile.guestFriendly} onChange={handleChange} />

                      <Form.Label className="mt-3"><strong>Hobbies</strong></Form.Label>
                      <BubbleSelect options={['Gaming', 'Music', 'Cooking', 'Reading', 'Photography', 'Traveling']} selected={profile.hobbies} onChange={(val) => setProfile({ ...profile, hobbies: val })} multi />

                      <Form.Label className="mt-3"><strong>Languages Spoken</strong></Form.Label>
                      <BubbleSelect options={['English', 'Hindi', 'Punjabi', 'French', 'Spanish']} selected={profile.languagesSpoken} onChange={(val) => setProfile({ ...profile, languagesSpoken: val })} multi />
                    </>
                )}
                {editMode && (
                    <div className="text-center mt-3">
                      <Button variant="success" onClick={handleSave}>Save Changes</Button>
                    </div>
                )}
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
  );
};

export default ProfileSummary;