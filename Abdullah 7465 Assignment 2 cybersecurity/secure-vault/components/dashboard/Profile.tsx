
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import type { User } from '../../types';

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await apiService.getProfile();
        setUser(profileData);
        setUsername(profileData.username);
        setEmail(profileData.email);
      } catch (error) {
        setMessage('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await apiService.updateProfile({ username, email });
      setMessage('Profile updated successfully!');
      // A full app would update the global user context here.
    } catch (error) {
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (!user) return <div>Could not load profile.</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
      <p className="text-slate-400 mb-8">View and update your account details.</p>
      
      <div className="max-w-2xl bg-slate-800 p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="username" className="block text-slate-300 text-sm font-bold mb-2">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow-sm appearance-none border border-slate-700 rounded w-full py-3 px-4 bg-slate-700 text-slate-200 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-slate-300 text-sm font-bold mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow-sm appearance-none border border-slate-700 rounded w-full py-3 px-4 bg-slate-700 text-slate-200 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
           <div className="mb-6">
            <label className="block text-slate-300 text-sm font-bold mb-2">User ID</label>
            <p className="text-slate-400 text-sm bg-slate-700 p-3 rounded">{user.userId}</p>
          </div>
           <div className="mb-6">
            <label className="block text-slate-300 text-sm font-bold mb-2">Member Since</label>
            <p className="text-slate-400 text-sm bg-slate-700 p-3 rounded">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline disabled:bg-indigo-400"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {message && <p className="text-sm text-green-400">{message}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
