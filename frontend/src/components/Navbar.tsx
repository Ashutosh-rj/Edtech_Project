import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { BookOpen, LogOut, LayoutDashboard, UserCircle, ShieldCheck, GraduationCap, Search, User, Bell, Check, Sun, Moon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { apiClient } from '../api/apiClient';

const roleMeta: Record<string, { label: string; color: string; badgeClass: string }> = {
  ADMIN:      { label: 'Admin',      color: 'var(--danger)', badgeClass: 'badge-warning' }, // Using danger color but maybe we need a dedicated badge-danger class, fallback to badge-warning or custom style
  INSTRUCTOR: { label: 'Instructor', color: 'var(--warning)', badgeClass: 'badge-warning' },
  STUDENT:    { label: 'Student',    color: 'var(--primary)', badgeClass: 'badge-primary' },
};

interface NotificationData {
  id: number;
  subject: string;
  message: string;
  read: boolean;
  isRead?: boolean;
  createdAt: string;
}

export const Navbar = () => {
  const { loggedInUser, role, logout } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);

  // Notification states
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !(n.read || n.isRead)).length;

  const fetchNotifications = async () => {
    if (!loggedInUser) return;
    try {
      const res = await apiClient.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  useEffect(() => {
    if (loggedInUser) {
      apiClient.get('/users/profile')
        .then(res => {
          if (res.data?.avatarUrl) {
            setProfilePic(res.data.avatarUrl);
          }
        })
        .catch(err => console.error("Failed to load navbar profile pic", err));
      
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000); 
      return () => clearInterval(interval);
    }
  }, [loggedInUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await apiClient.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, isRead: true } : n));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const normalizedRole = (role ?? 'STUDENT').toUpperCase();
  const meta = roleMeta[normalizedRole] ?? roleMeta.STUDENT;

  const isAdmin      = normalizedRole === 'ADMIN';
  const isInstructor = normalizedRole === 'INSTRUCTOR' || isAdmin;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: resolvedTheme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 var(--space-24)',
      height: '72px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'background 0.2s ease, border-color 0.2s ease'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontWeight: '700', fontSize: '1.25rem' }}>
        <BookOpen color="var(--primary)" size={28} />
        EdTech Enterprise
      </Link>

      <nav style={{ display: 'flex', gap: 'var(--space-24)', alignItems: 'center' }}>
        <Link to="/courses" style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
          Courses
        </Link>
        <Link to="/courses?category=all" style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
          Categories
        </Link>
        
        {/* Search Bar in Navbar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-3)', padding: '6px 12px', borderRadius: '24px', border: '1px solid transparent' }}>
          <Search size={16} color="var(--text-muted)" style={{ marginRight: '8px' }} />
          <input 
            type="text" 
            placeholder="Search courses..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '180px', fontSize: '14px', fontFamily: 'inherit' }} 
          />
        </form>

        <button onClick={toggleTheme} title="Toggle Theme" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface-3)' }}>
          {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {loggedInUser ? (
          <>
            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            {isInstructor && (
              <Link to="/manage-courses" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                <GraduationCap size={18} />
                Manage Courses
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', fontWeight: '600' }}>
                <ShieldCheck size={18} />
                Admin Panel
              </Link>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-16)', marginLeft: 'var(--space-12)', paddingLeft: 'var(--space-24)', borderLeft: '1px solid var(--border)' }}>
              {/* Notification Bell */}
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{ color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', background: 'none', border: 'none' }}
                >
                  <Bell size={22} />
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--danger)', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '2px 5px', borderRadius: '10px', minWidth: '18px', textAlign: 'center', border: '2px solid var(--surface-1)' }}>
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {isDropdownOpen && (
                  <div className="card" style={{ position: 'absolute', top: 'calc(100% + 12px)', right: '0', width: '320px', padding: '0', zIndex: 50, overflow: 'hidden' }}>
                    <div style={{ padding: 'var(--space-16)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-2)' }}>
                      <h4 style={{ margin: 0, fontSize: '14px' }}>Notifications</h4>
                      {unreadCount > 0 && <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600' }}>{unreadCount} new</span>}
                    </div>
                    <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(notif => (
                          <div key={notif.id} style={{ padding: '16px', borderBottom: '1px solid var(--border)', background: (notif.read || notif.isRead) ? 'transparent' : 'var(--primary-light)', display: 'flex', gap: '12px', transition: 'background 0.2s' }}>
                            <div style={{ flex: 1 }}>
                              <h5 style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--text-primary)' }}>{notif.subject}</h5>
                              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{notif.message}</p>
                              <span style={{ display: 'block', marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                                {new Date(notif.createdAt).toLocaleString()}
                              </span>
                            </div>
                            {!(notif.read || notif.isRead) && (
                              <button 
                                onClick={() => handleMarkAsRead(notif.id)}
                                title="Mark as read"
                                style={{ color: 'var(--primary)', cursor: 'pointer', padding: '4px', height: 'fit-content', alignSelf: 'center' }}
                              >
                                <Check size={16} />
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Link (Avatar + Name) */}
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                {profilePic ? (
                  <img src={profilePic} alt="User" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }} />
                ) : (
                  <UserCircle size={36} color="var(--text-muted)" />
                )}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{loggedInUser}</span>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: meta.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {meta.label}
                  </span>
                </div>
              </Link>
              
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 12px', gap: '6px' }}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '12px', paddingLeft: '24px', borderLeft: '1px solid var(--border)' }}>
            <Link to="/login" className="btn btn-secondary">Log in</Link>
            <Link to="/register" className="btn btn-primary">Sign up</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

