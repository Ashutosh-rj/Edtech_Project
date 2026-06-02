import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Video, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { getYouTubeThumbnail } from '../api/youtubeUtils';

export const CourseForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: 0,
    thumbnailUrl: '',
    status: 'DRAFT'
  });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing) {
      const fetchCourse = async () => {
        try {
          const response = await apiClient.get(`/courses/${id}`);
          setFormData({
            title: response.data.title || '',
            description: response.data.description || '',
            category: response.data.category || '',
            price: response.data.price || 0,
            thumbnailUrl: response.data.thumbnailUrl || '',
            status: response.data.status || 'DRAFT'
          });
        } catch (err) {
          console.error('Failed to load course details', err);
          setError('Failed to load course details.');
        } finally {
          setLoading(false);
        }
      };
      fetchCourse();
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (isEditing) {
        await apiClient.put(`/courses/${id}`, formData);
      } else {
        await apiClient.post('/courses', formData);
      }
      navigate('/manage-courses');
    } catch (err) {
      console.error('Failed to save course', err);
      setError('Failed to save course. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex-col items-center justify-center py-12" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="card skeleton w-full" style={{ height: '500px' }}></div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '100px' }}>
      <form onSubmit={handleSubmit}>
        
        {/* Sticky Header */}
        <div 
          className="flex items-center justify-between py-4 mb-8 sticky top-0 z-10" 
          style={{ 
            background: 'var(--surface-1)', 
            borderBottom: '1px solid var(--border)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}
        >
          <div className="flex items-center gap-4">
            <Link to="/manage-courses" className="btn btn-secondary flex items-center justify-center p-2 rounded-full hover-bg">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl m-0 font-bold">{isEditing ? 'Edit Course' : 'Create New Course'}</h1>
          </div>
          <div className="flex gap-4">
            <Link to="/manage-courses" className="btn btn-secondary px-6">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary flex items-center gap-2 px-8 font-bold" disabled={saving}>
              <Save size={18} /> {saving ? 'Saving...' : 'Save Course'}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 mb-6" style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: 'var(--space-16)', borderRadius: 'var(--radius-md)', border: '1px solid var(--danger)' }}>
            <AlertTriangle size={20} />
            <span className="font-medium">{error}</span>
          </div>
        )}
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-32)', alignItems: 'start' }}>
          
          {/* Main Column */}
          <div className="flex-col gap-8">
            
            {/* Section 1: General Info */}
            <div className="card p-8">
              <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-6 pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
                General Information
              </h3>
              
              <div className="form-group">
                <label className="form-label text-sm font-bold">Course Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-input text-lg font-medium py-3"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Complete Web Development Bootcamp"
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label text-sm font-bold">Description</label>
                <textarea
                  name="description"
                  className="form-input"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={8}
                  style={{ resize: 'vertical' }}
                  placeholder="Detailed description of what students will learn..."
                />
              </div>
            </div>

            {/* Section 2: Media */}
            <div className="card p-8">
              <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-6 pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
                Course Media
              </h3>
              
              <div className="form-group mb-0">
                <label className="form-label text-sm font-bold">Course Video URL (YouTube)</label>
                <div className="flex items-center gap-2 text-sm text-secondary mb-3">
                  <Video size={16} className="text-primary" />
                  <span>Paste a YouTube video link to automatically use it as the course video and thumbnail.</span>
                </div>
                <input
                  type="url"
                  name="thumbnailUrl"
                  className="form-input py-3"
                  value={formData.thumbnailUrl}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                
                <div className="mt-6 flex-col items-center justify-center border-2 border-dashed rounded-lg p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)', minHeight: '200px' }}>
                  {formData.thumbnailUrl ? (
                    <img 
                      src={getYouTubeThumbnail(formData.thumbnailUrl) || formData.thumbnailUrl} 
                      alt="Thumbnail preview" 
                      className="w-full h-auto max-h-[300px] object-cover rounded-md shadow-md"
                      onError={e => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                        if (e.currentTarget.nextElementSibling) {
                          (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                  ) : (
                    <div className="flex-col items-center text-secondary opacity-60">
                      <ImageIcon size={48} className="mb-2" />
                      <p>Image preview will appear here</p>
                    </div>
                  )}
                  <div className="flex-col items-center text-warning" style={{ display: 'none' }}>
                     <AlertTriangle size={32} className="mb-2" />
                     <p>Could not load preview. Please check the URL.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Column */}
          <div className="flex-col gap-8">
            
            {/* Section 3: Pricing & Category */}
            <div className="card p-6">
              <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-6 pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
                Organization & Pricing
              </h3>

              <div className="form-group">
                <label className="form-label text-sm font-bold">Category</label>
                <input
                  type="text"
                  name="category"
                  className="form-input py-3"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Programming"
                />
              </div>

              <div className="form-group">
                <label className="form-label text-sm font-bold">Price ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-secondary">$</span>
                  <input
                    type="number"
                    name="price"
                    className="form-input py-3 pl-8 text-lg font-bold"
                    value={Number.isNaN(formData.price) ? '' : formData.price}
                    onChange={e => {
                      const val = parseFloat(e.target.value);
                      setFormData(prev => ({ ...prev, price: Number.isNaN(val) ? 0 : val }));
                    }}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="form-group mb-0">
                <label className="form-label text-sm font-bold">Status</label>
                <select
                  name="status"
                  className="form-input py-3 font-medium"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="DRAFT">Draft (Hidden)</option>
                  <option value="PUBLISHED">Published (Visible)</option>
                </select>
                {formData.status === 'PUBLISHED' && (
                  <p className="text-xs text-success mt-2 font-medium">This course will be visible to students.</p>
                )}
                {formData.status === 'DRAFT' && (
                  <p className="text-xs text-warning mt-2 font-medium">This course is hidden from the catalog.</p>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </form>
    </div>
  );
};
