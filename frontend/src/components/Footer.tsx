import { Link } from 'react-router-dom';
import { BookOpen, Globe, MessageSquare, Hash, Video, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ background: 'var(--surface-1)', borderTop: '1px solid var(--border)', padding: 'var(--space-64) 0 var(--space-32) 0', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-48)', marginBottom: 'var(--space-48)' }}>
          {/* Brand & Description */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontWeight: '700', fontSize: '24px', marginBottom: 'var(--space-16)' }}>
              <BookOpen color="var(--primary)" size={32} />
              EdTech Enterprise
            </Link>
            <p className="text-secondary text-sm" style={{ lineHeight: '1.6', marginBottom: 'var(--space-24)' }}>
              Empowering learners worldwide with cutting-edge technology, expert instructors, and a world-class curriculum designed for the future.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted" style={{ transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}><Globe size={20} /></a>
              <a href="#" className="text-muted" style={{ transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}><MessageSquare size={20} /></a>
              <a href="#" className="text-muted" style={{ transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}><Hash size={20} /></a>
              <a href="#" className="text-muted" style={{ transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}><Video size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '16px', marginBottom: 'var(--space-20)', fontWeight: '600' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
              <li><Link to="/courses" className="text-secondary text-sm">Browse Courses</Link></li>
              <li><Link to="/about" className="text-secondary text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-secondary text-sm">Contact Us</Link></li>
              <li><Link to="/instructors" className="text-secondary text-sm">Become an Instructor</Link></li>
              <li><Link to="/careers" className="text-secondary text-sm">Careers</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '16px', marginBottom: 'var(--space-20)', fontWeight: '600' }}>Top Categories</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
              <li><Link to="/courses?category=Web+Development" className="text-secondary text-sm">Web Development</Link></li>
              <li><Link to="/courses?category=Machine+Learning" className="text-secondary text-sm">Machine Learning</Link></li>
              <li><Link to="/courses?category=Cloud+Computing" className="text-secondary text-sm">Cloud Computing</Link></li>
              <li><Link to="/courses?category=DevOps" className="text-secondary text-sm">DevOps</Link></li>
              <li><Link to="/courses?category=Cybersecurity" className="text-secondary text-sm">Cybersecurity</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '16px', marginBottom: 'var(--space-20)', fontWeight: '600' }}>Contact Us</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-12)' }} className="text-secondary text-sm">
                <MapPin size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>NIT Patna</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }} className="text-secondary text-sm">
                <Phone size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>+91 9508295101</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }} className="text-secondary text-sm">
                <Mail size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>ashutoshrj5161@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-24)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-16)' }}>
          <p className="text-muted text-sm" style={{ margin: 0 }}>
            &copy; {new Date().getFullYear()} EdTech Enterprise. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-muted text-sm">Privacy Policy</Link>
            <Link to="/terms" className="text-muted text-sm">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
