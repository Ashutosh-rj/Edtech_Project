import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import {
  BookOpen, Users, Trash2, CheckCircle, Clock,
  AlertTriangle, RefreshCw,
} from 'lucide-react';
import { getCourseCoverImage } from '../api/youtubeUtils';

interface Course {
  id: number;
  title: string;
  category: string;
  price: number;
  status: string;
  instructorId: string;
  thumbnailUrl: string;
}

interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: string;
}

type Tab = 'courses' | 'users';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('courses');

  // ── Courses state ────────────────────────────────────────────────────────────
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  // ── Users state ──────────────────────────────────────────────────────────────
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  // ── Fetch all courses ────────────────────────────────────────────────────────
  const fetchCourses = async () => {
    setCoursesLoading(true);
    setCoursesError(null);
    try {
      const res = await apiClient.get('/courses/all');
      setCourses(res.data);
    } catch (err: unknown) {
      setCoursesError('Failed to load courses. Make sure course-service is running.');
      console.error(err);
    } finally {
      setCoursesLoading(false);
    }
  };

  // ── Fetch all users ──────────────────────────────────────────────────────────
  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      // Fetch from auth-service to get ALL registered users, regardless of profile completion
      const res = await apiClient.get('/auth/users/all');
      setUsers(res.data);
    } catch (err: unknown) {
      setUsersError('Failed to load users. Make sure user-service is running.');
      console.error(err);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (activeTab === 'users' && users.length === 0 && !usersLoading) {
      fetchUsers();
    }
  }, [activeTab]);

  // ── Actions ──────────────────────────────────────────────────────────────────
  const handlePublish = async (id: number) => {
    try {
      const res = await apiClient.put(`/courses/${id}/publish`);
      setCourses(prev => prev.map(c => c.id === id ? res.data : c));
    } catch (err) {
      alert('Failed to publish course.');
      console.error(err);
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!window.confirm('Delete this course? This action cannot be undone.')) return;
    try {
      await apiClient.delete(`/courses/${id}`);
      setCourses(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert('Failed to delete course.');
      console.error(err);
    }
  };

  const handleChangeRole = async (email: string, newRole: string) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    try {
      await apiClient.put(`/auth/users/${email}/role?role=${newRole}`);
      // Optimistically update UI
      setUsers(prev => prev.map(u => u.email === email ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Failed to update role. Make sure auth-service is running and token is valid.');
      console.error(err);
    }
  };

  // ── Styles ───────────────────────────────────────────────────────────────────
  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: 'var(--space-12) var(--space-24)',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px',
    transition: 'all 0.2s',
    background: active ? 'var(--primary)' : 'var(--surface-2)',
    color: active ? 'white' : 'var(--text-secondary)',
    borderBottom: active ? 'none' : '1px solid var(--border)'
  });

  const statusBadge = (status: string): React.CSSProperties => ({
    padding: '4px 12px',
    borderRadius: 'var(--radius-full)',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    background: status === 'PUBLISHED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
    color: status === 'PUBLISHED' ? 'var(--success)' : 'var(--warning)',
    display: 'inline-block'
  });

  const tableHeaderStyle: React.CSSProperties = {
    padding: 'var(--space-16)',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--border)',
    background: 'var(--surface-1)'
  };

  const tdStyle: React.CSSProperties = {
    padding: 'var(--space-16)',
    borderBottom: '1px solid var(--border)',
    verticalAlign: 'middle',
    color: 'var(--text-primary)'
  };

  const publishedCount  = courses.filter(c => c.status === 'PUBLISHED').length;
  const draftCount      = courses.filter(c => c.status !== 'PUBLISHED').length;

  return (
    <div>
      {/* ── Header ── */}
      <div style={{
        marginBottom: 'var(--space-32)',
        padding: 'var(--space-48) var(--space-32)',
        borderRadius: 'var(--radius-xl)',
        backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95) 30%, rgba(15, 23, 42, 0.4)), url('/images/fnaf-cat.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        color: '#f8fafc'
      }}>
        <div>
          <h1 style={{ fontSize: '36px', marginBottom: 'var(--space-8)', color: '#f8fafc' }}>Admin Panel</h1>
          <p style={{ color: '#cbd5e1', fontSize: '18px' }}>Full platform oversight — courses, users, and content moderation.</p>
        </div>
      </div>

      {/* ── Summary stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-24)', marginBottom: 'var(--space-40)' }}>
        <div className="card flex items-center gap-4">
          <div style={{ background: 'var(--primary-light)', padding: 'var(--space-16)', borderRadius: 'var(--radius-lg)', color: 'var(--primary)' }}>
            <BookOpen size={28} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>{courses.length}</h3>
            <p className="text-secondary text-sm m-0 font-medium mt-1">Total Courses</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div style={{ background: 'rgba(16,185,129,0.1)', padding: 'var(--space-16)', borderRadius: 'var(--radius-lg)', color: 'var(--success)' }}>
            <CheckCircle size={28} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>{publishedCount}</h3>
            <p className="text-secondary text-sm m-0 font-medium mt-1">Published</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div style={{ background: 'rgba(245,158,11,0.1)', padding: 'var(--space-16)', borderRadius: 'var(--radius-lg)', color: 'var(--warning)' }}>
            <Clock size={28} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>{draftCount}</h3>
            <p className="text-secondary text-sm m-0 font-medium mt-1">Drafts</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div style={{ background: 'rgba(139,92,246,0.1)', padding: 'var(--space-16)', borderRadius: 'var(--radius-lg)', color: '#8b5cf6' }}>
            <Users size={28} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>{users.length || '—'}</h3>
            <p className="text-secondary text-sm m-0 font-medium mt-1">Users</p>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: 'var(--space-12)', marginBottom: 'var(--space-24)' }}>
        <button id="admin-tab-courses" style={tabStyle(activeTab === 'courses')} onClick={() => setActiveTab('courses')}>
          <BookOpen size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
          Courses
        </button>
        <button id="admin-tab-users" style={tabStyle(activeTab === 'users')} onClick={() => setActiveTab('users')}>
          <Users size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
          Users
        </button>
      </div>

      {/* ── Courses Tab ── */}
      {activeTab === 'courses' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-20) var(--space-24)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-2)' }}>
            <h3 className="text-lg m-0 font-semibold">All Courses</h3>
            <button onClick={fetchCourses} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }} title="Refresh">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {coursesLoading && (
            <div style={{ padding: 'var(--space-48)', textAlign: 'center', color: 'var(--text-muted)' }}>Loading courses…</div>
          )}
          {coursesError && (
            <div style={{ padding: 'var(--space-24)', display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--danger)' }}>
              <AlertTriangle size={20} /> {coursesError}
            </div>
          )}
          {!coursesLoading && !coursesError && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>ID</th>
                    <th style={tableHeaderStyle}>Thumbnail</th>
                    <th style={tableHeaderStyle}>Title</th>
                    <th style={tableHeaderStyle}>Category</th>
                    <th style={tableHeaderStyle}>Instructor</th>
                    <th style={tableHeaderStyle}>Price</th>
                    <th style={tableHeaderStyle}>Status</th>
                    <th style={tableHeaderStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.length === 0 ? (
                    <tr><td colSpan={8} style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-muted)' }}>No courses found.</td></tr>
                  ) : courses.map(course => (
                    <tr key={course.id} className="hover-bg" style={{ transition: 'background 0.15s' }}>
                      <td style={{ ...tdStyle, color: 'var(--text-muted)', fontSize: '14px' }}>#{course.id}</td>
                      <td style={{ ...tdStyle, padding: '12px 16px' }}>
                        <img 
                          src={getCourseCoverImage(course.thumbnailUrl, course.id)} 
                          alt={course.title}
                          style={{ width: '64px', height: '36px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      </td>
                      <td style={{ ...tdStyle, fontWeight: '600' }}>{course.title}</td>
                      <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{course.category}</td>
                      <td style={{ ...tdStyle, fontSize: '14px', color: 'var(--text-secondary)' }}>{course.instructorId}</td>
                      <td style={{ ...tdStyle, fontWeight: '600', color: 'var(--primary)' }}>${course.price?.toFixed(2)}</td>
                      <td style={tdStyle}><span style={statusBadge(course.status)}>{course.status}</span></td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {course.status !== 'PUBLISHED' && (
                            <button
                              id={`admin-publish-${course.id}`}
                              className="btn btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '13px', color: 'var(--success)', borderColor: 'rgba(16,185,129,0.3)' }}
                              onClick={() => handlePublish(course.id)}
                              title="Publish this course">
                              <CheckCircle size={14} /> Publish
                            </button>
                          )}
                          <button
                            id={`admin-delete-course-${course.id}`}
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '13px', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)' }}
                            onClick={() => handleDeleteCourse(course.id)}
                            title="Delete this course">
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Users Tab ── */}
      {activeTab === 'users' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-20) var(--space-24)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-2)' }}>
            <h3 className="text-lg m-0 font-semibold">Registered Users</h3>
            <button onClick={fetchUsers} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }} title="Refresh">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {usersLoading && (
            <div style={{ padding: 'var(--space-48)', textAlign: 'center', color: 'var(--text-muted)' }}>Loading users…</div>
          )}
          {usersError && (
            <div style={{ padding: 'var(--space-24)', display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--warning)' }}>
              <AlertTriangle size={20} /> {usersError}
            </div>
          )}
          {!usersLoading && !usersError && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>Name</th>
                    <th style={tableHeaderStyle}>Email</th>
                    <th style={tableHeaderStyle}>Role</th>
                    <th style={tableHeaderStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={4} style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-muted)' }}>
                      No user profiles found.
                    </td></tr>
                  ) : users.map(user => (
                    <tr key={user.email} className="hover-bg" style={{ transition: 'background 0.15s' }}>
                      <td style={{ ...tdStyle, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-light)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: 'var(--primary)' }}>
                          {user.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        {user.name}
                      </td>
                      <td style={{ ...tdStyle, color: 'var(--text-secondary)', fontSize: '15px' }}>{user.email}</td>
                      <td style={{ ...tdStyle, fontSize: '14px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          fontSize: '12px',
                          display: 'inline-block',
                          background: user.role === 'ADMIN' ? 'rgba(239,68,68,0.1)' : user.role === 'INSTRUCTOR' ? 'rgba(245,158,11,0.1)' : 'var(--primary-light)',
                          color: user.role === 'ADMIN' ? 'var(--danger)' : user.role === 'INSTRUCTOR' ? 'var(--warning)' : 'var(--primary)',
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {user.role !== 'ADMIN' && (
                            <>
                              {user.role === 'STUDENT' ? (
                                <button
                                  className="btn btn-secondary"
                                  style={{ padding: '6px 12px', fontSize: '13px', color: 'var(--warning)', borderColor: 'rgba(245,158,11,0.3)' }}
                                  onClick={() => handleChangeRole(user.email, 'INSTRUCTOR')}
                                >
                                  Make Instructor
                                </button>
                              ) : (
                                <button
                                  className="btn btn-secondary"
                                  style={{ padding: '6px 12px', fontSize: '13px', color: 'var(--primary)', borderColor: 'var(--border)' }}
                                  onClick={() => handleChangeRole(user.email, 'STUDENT')}
                                >
                                  Demote to Student
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
