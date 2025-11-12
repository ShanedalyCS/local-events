import React, { useState } from 'react';
import './AccountSettings.css';

function AccountSettings() {
  const [formData, setFormData] = useState({
    username: 'John Doe',
    email: 'johndoe@email.com',
    location: 'Dublin, Ireland',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated account info:', formData);
    alert('Account updated successfully!');
  };

  return (
    <div className="settings-container">
      <h2>Account Settings</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label>New Location:</label>
        <input
          type="location"
          name="location"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default AccountSettings;

