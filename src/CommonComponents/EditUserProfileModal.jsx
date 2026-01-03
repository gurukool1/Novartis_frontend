import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

export const EditUserProfileModal = ({ 
  show, 
  handleClose, 
  user, 
  onSubmit,
  loading
}) => {
  const [formData, setFormData] = useState({
    investigatorName: '',
    username: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  
  // Password visibility states
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        investigatorName: user.investigatorName || '',
        username: user.username || '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    setPasswordError('');
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'newPassword' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    const payload = {
      userId: user.id,
      investigatorName: formData.investigatorName,
      username: formData.username,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword
    };

    onSubmit(payload);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit User Profile</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Investigator Name</Form.Label>
            <Form.Control
              type="text"
              name="investigatorName"
              value={formData.investigatorName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3 position-relative">
            <Form.Label>New Password (Optional)</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Control
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
              <Button
                variant="link"
                onClick={() => setShowNewPassword(prev => !prev)}
                style={{ position: 'absolute', right: '10px' }}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
          </Form.Group>
          
          <Form.Group className="mb-3 position-relative">
            <Form.Label>Confirm Password</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Control
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
              />
              <Button
                variant="link"
                onClick={() => setShowConfirmPassword(prev => !prev)}
                style={{ position: 'absolute', right: '10px' }}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
            {passwordError && (
              <Form.Text className="text-danger">{passwordError}</Form.Text>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
