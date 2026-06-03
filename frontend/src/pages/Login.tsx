import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (email && password) {
      try {
        await login(email, password);
        navigate('/dashboard');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
      {/* Form Side */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'var(--space-40)' }}>
        <div className="card" style={{ width: '100%', maxWidth: '440px', padding: 'var(--space-40)', border: 'none', boxShadow: 'none', background: 'transparent' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-32)' }}>
            <div style={{ width: '56px', height: '56px', background: 'var(--primary-light)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-20)', color: 'var(--primary)' }}>
              <LogIn size={28} />
            </div>
            <h2 style={{ fontSize: '28px', color: 'var(--text-primary)', marginBottom: 'var(--space-8)' }}>Welcome Back</h2>
            <p className="text-secondary text-sm">Enter your credentials to access your account.</p>
            {error && <div style={{ color: 'var(--danger)', marginTop: 'var(--space-12)', fontSize: '14px', background: 'rgba(239, 68, 68, 0.1)', padding: 'var(--space-8)', borderRadius: 'var(--radius-md)' }}>{error}</div>}
          </div>

          <form onSubmit={handleSubmit}>
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
            <div className="input-group" style={{ marginTop: 'var(--space-20)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
                <label htmlFor="password" style={{ marginBottom: 0 }}>Password</label>
                <a href="#" className="text-primary text-xs font-medium">Forgot password?</a>
              </div>
              <input
                type="password"
                id="password"
                className="input-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary w-full" style={{ marginTop: 'var(--space-24)', height: '44px', fontSize: '15px' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-24)', fontSize: '14px' }}>
            <span className="text-muted">Don't have an account? </span>
            <Link to="/register" className="font-medium" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign Up</Link>
          </div>
        </div>
      </div>
      
      {/* Image Side - Hidden on mobile, flex 1 on desktop. Needs a media query conceptually, but standard inline styles require JS for media queries. Let's just use CSS for this specific part, or assume a standard split that works well on desktop. For simplicity, we'll keep it inline and it will just be a split screen. */}
      <div style={{ 
        flex: 1, 
        backgroundImage: `url('/images/blue-gold-marble.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        {/* Dark overlay for contrast */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, var(--background), transparent)' }}></div>
      </div>
    </div>
  );
};

export default Login;
