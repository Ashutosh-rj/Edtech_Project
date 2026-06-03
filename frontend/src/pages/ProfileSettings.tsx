import { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { User, Save, AlertTriangle, Upload } from 'lucide-react';

interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  avatarUrl: string;
}

export const ProfileSettings = () => {
  const { loggedInUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    email: loggedInUser || '',
    firstName: '',
    lastName: '',
    bio: '',
    avatarUrl: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get('/users/profile');
        if (res.data) {
          setProfile(res.data);
        }
      } catch (err: any) {
        // If 404 or profile not found, it's fine, it means it's a new profile
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    setMessage(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await apiClient.post('/users/profile/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // The backend returns the URL string
      setProfile(prev => ({ ...prev, avatarUrl: res.data }));
      setMessage({ type: 'success', text: 'Image uploaded successfully. Click Save Changes to keep it.' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to upload image.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await apiClient.post('/users/profile', profile);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-col items-center justify-center py-12" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div className="card skeleton w-full" style={{ height: '400px' }}></div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Profile Settings</h1>
        <p className="text-secondary text-lg">Manage your personal information and bio.</p>
      </div>

      <div className="card">
        {message && (
          <div className="flex items-center gap-2 mb-6" style={{ 
            padding: 'var(--space-12) var(--space-16)', 
            borderRadius: 'var(--radius-md)', 
            background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
          }}>
            {message.type === 'error' && <AlertTriangle size={18} />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-col gap-6">
          <div className="flex items-center gap-6 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
            {profile.avatarUrl ? (
              <img 
                src={profile.avatarUrl} 
                alt="Profile Preview" 
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/80?text=Error'; }}
              />
            ) : (
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--surface-2)', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={32} color="var(--text-muted)" />
              </div>
            )}
            <div className="flex-grow">
              <label className="form-label">Profile Picture</label>
              <div className="flex items-center gap-3">
                <label 
                  className={`btn ${uploading ? 'btn-secondary' : 'btn-primary'}`} 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: uploading ? 'not-allowed' : 'pointer' }}
                >
                  <Upload size={18} />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    disabled={uploading}
                  />
                </label>
                <span className="text-secondary text-sm">JPEG, PNG, GIF up to 5MB</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)' }}>
            <div className="form-group mb-0">
              <label className="form-label" htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="form-input"
                value={profile.firstName || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-0">
              <label className="form-label" htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="form-input"
                value={profile.lastName || ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={profile.email}
              disabled
              style={{ opacity: 0.7, cursor: 'not-allowed', background: 'var(--surface-2)' }}
            />
            <span className="block mt-2 text-sm text-secondary">Email cannot be changed.</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="bio">About Me (Bio)</label>
            <textarea
              id="bio"
              name="bio"
              className="form-input"
              rows={5}
              value={profile.bio}
              onChange={handleChange}
              placeholder="Tell us a little bit about yourself..."
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="flex justify-end pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <button type="submit" className="btn btn-primary flex items-center gap-2" disabled={saving}>
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
