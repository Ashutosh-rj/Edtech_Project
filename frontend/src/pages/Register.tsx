import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      await axios.post(`${apiBaseUrl}/auth/register`, {
        name,
        email,
        password
      });
      navigate('/login');
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const errMap = err.response.data.errors;
        const msg = Object.keys(errMap).map(k => `${k}: ${errMap[k]}`).join(', ');
        setError(msg);
      } else {
        setError(err.response?.data?.message || err.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
      {/* Image Side */}
      <div style={{ 
        flex: 1, 
        backgroundImage: `url('/images/aurora.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        {/* Dark overlay for contrast */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, var(--background), transparent)' }}></div>
      </div>

      {/* Form Side */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'var(--space-40)' }}>
        <div className="card" style={{ width: '100%', maxWidth: '440px', padding: 'var(--space-40)', border: 'none', boxShadow: 'none', background: 'transparent' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-32)' }}>
            <div style={{ width: '56px', height: '56px', background: 'var(--primary-light)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-20)', color: 'var(--primary)' }}>
              <UserPlus size={28} />
            </div>
            <h2 style={{ fontSize: '28px', color: 'var(--text-primary)', marginBottom: 'var(--space-8)' }}>Create Account</h2>
            <p className="text-secondary text-sm">Join our platform and start learning today.</p>
            {error && <div style={{ color: 'var(--danger)', marginTop: 'var(--space-12)', fontSize: '14px', background: 'rgba(239, 68, 68, 0.1)', padding: 'var(--space-8)', borderRadius: 'var(--radius-md)' }}>{error}</div>}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                className="input-control"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className="input-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="input-control"
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" style={{ marginTop: 'var(--space-8)', height: '44px', fontSize: '15px' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: 'var(--space-24)', fontSize: '14px' }}>
            <span className="text-muted">Already have an account? </span>
            <Link to="/login" className="font-medium" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
