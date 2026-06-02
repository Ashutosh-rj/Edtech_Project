import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { Star } from 'lucide-react';

interface Review {
  id: number;
  courseId: number;
  studentId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const CourseReviews = ({ courseId }: { courseId: number }) => {
  const { loggedInUser } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const fetchReviews = async () => {
    try {
      const response = await apiClient.get(`/reviews/course/${courseId}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedInUser) return;
    setSubmitting(true);
    try {
      await apiClient.post('/reviews', {
        courseId,
        rating,
        comment
      });
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: '48px' }}>
      <h2>Student Reviews</h2>
      
      {loggedInUser && (
        <div className="glass-panel" style={{ marginBottom: '24px' }}>
          <h4>Write a Review</h4>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Rating</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={24} 
                    fill={rating >= star ? 'var(--warning)' : 'none'}
                    color={rating >= star ? 'var(--warning)' : 'var(--text-muted)'}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                    onClick={() => setRating(star)}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Comment</label>
              <textarea 
                className="form-control"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you think of this course?"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ color: 'var(--text-muted)' }}>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No reviews yet. Be the first to review this course!</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map(review => (
            <div key={review.id} className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontWeight: '600', color: 'var(--primary)' }}>{review.studentId}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={16} 
                    fill={review.rating >= star ? 'var(--warning)' : 'none'}
                    color={review.rating >= star ? 'var(--warning)' : 'var(--border)'}
                  />
                ))}
              </div>
              <p style={{ margin: 0, lineHeight: '1.6' }}>{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
