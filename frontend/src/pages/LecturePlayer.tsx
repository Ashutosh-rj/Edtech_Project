import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { PlayCircle, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { getYouTubeEmbedUrl, extractYouTubeId } from '../api/youtubeUtils';

interface Lecture {
  id: number;
  title: string;
  videoId: string;
  durationSeconds: number;
}

interface Quiz {
  id: number;
  title: string;
}

interface Enrollment {
  id: number;
  courseId: number;
  progressPercentage: number;
  completed: boolean;
}

export const LecturePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentLectureIndex, setCurrentLectureIndex] = useState(0);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [lecturesRes, enrollmentRes, quizzesRes] = await Promise.all([
          apiClient.get(`/lectures/course/${courseId}`),
          apiClient.get(`/enrollments/course/${courseId}`),
          apiClient.get(`/quizzes/course/${courseId}`).catch(() => ({ data: [] }))
        ]);
        
        let fetchedLectures = lecturesRes.data;

        // Fallback: If no lectures exist, but the course has a youtube link in the thumbnail,
        // treat that video as the single course lecture.
        if (fetchedLectures.length === 0) {
          const courseRes = await apiClient.get(`/courses/${courseId}`);
          const course = courseRes.data;
          if (course && course.thumbnailUrl && extractYouTubeId(course.thumbnailUrl)) {
            fetchedLectures = [{
              id: 0,
              title: course.title || 'Course Video',
              videoId: course.thumbnailUrl, // will be parsed by getYouTubeEmbedUrl
              durationSeconds: 0
            }];
          }
        }

        setLectures(fetchedLectures);
        setEnrollment(enrollmentRes.data);
        setQuizzes(quizzesRes.data);
      } catch (error: any) {
        if (error.response?.status === 404) {
          // Not enrolled?
          navigate(`/courses/${courseId}`);
        }
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchCourseData();
  }, [courseId, navigate]);

  const handleUpdateProgress = async () => {
    if (!enrollment) return;
    
    // In a real app, this would be more granular based on video watched time.
    // Here we'll just bump it linearly
    const increment = Math.ceil(100 / lectures.length);
    const newProgress = Math.min(100, enrollment.progressPercentage + increment);

    try {
      // HIGH-08 / MED-02: Fixed API call to use courseId (not enrollment.id) and param name 'progress' (not 'percentage')
      const res = await apiClient.put(`/enrollments/${courseId}/progress?progress=${newProgress}`);
      setEnrollment(res.data);
      
      // If completed, maybe generate certificate
      if (newProgress === 100 && !enrollment.completed) {
        await apiClient.post(`/certificates/generate/${courseId}`);
        alert('Congratulations! You completed the course and earned a certificate.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex-col items-center justify-center py-12">
      <div className="card skeleton w-full" style={{ height: '600px' }}></div>
    </div>
  );
  
  if (lectures.length === 0) return <div className="text-center py-12 text-secondary">No lectures found for this course.</div>;

  const currentLecture = lectures[currentLectureIndex];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-24)', height: 'calc(100vh - var(--space-48) - 72px)', alignItems: 'start' }}>
      {/* Video Player Area */}
      <div className="flex-col h-full gap-4">
        <div className="card flex-col p-0 overflow-hidden shadow-lg h-full">
          <div style={{ flexGrow: 1, backgroundColor: '#000', position: 'relative', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
            {getYouTubeEmbedUrl(currentLecture.videoId) ? (
              <iframe
                width="100%"
                height="100%"
                src={getYouTubeEmbedUrl(currentLecture.videoId)!}
                title={currentLecture.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              />
            ) : (
              <div className="flex-col items-center justify-center h-full w-full text-secondary gap-3 absolute inset-0">
                <AlertTriangle size={48} className="text-warning" />
                <p className="text-lg">No valid video URL for this lecture.</p>
                <code className="text-sm opacity-60 bg-surface-2 p-2 rounded">{currentLecture.videoId}</code>
              </div>
            )}
          </div>
          <div style={{ padding: 'var(--space-24)' }}>
            <h2 className="text-2xl mb-2 font-bold">{currentLecture.title}</h2>
            <p className="text-secondary mb-6 font-medium">Lecture {currentLectureIndex + 1} of {lectures.length}</p>
            
            <button className="btn btn-primary font-medium" onClick={handleUpdateProgress}>
              Mark as Complete & Update Progress
            </button>
          </div>
        </div>
      </div>

      {/* Playlist Sidebar */}
      <div className="card p-0 flex-col shadow-lg h-full" style={{ maxHeight: 'calc(100vh - var(--space-48) - 72px)' }}>
        <div style={{ padding: 'var(--space-24)', borderBottom: '1px solid var(--border)', background: 'var(--surface-1)' }}>
          <h3 className="text-lg font-bold mb-4">Course Content</h3>
          
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-secondary">Progress</span>
            <span className="text-sm font-bold text-primary">{enrollment?.progressPercentage}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'var(--surface-2)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ width: `${enrollment?.progressPercentage}%`, height: '100%', background: enrollment?.completed ? 'var(--success)' : 'var(--primary)', borderRadius: 'var(--radius-full)', transition: 'width 0.5s ease-out' }}></div>
          </div>
        </div>

        <div style={{ overflowY: 'auto', flexGrow: 1 }} className="custom-scrollbar">
          {lectures.map((lecture, idx) => (
            <div 
              key={lecture.id} 
              onClick={() => setCurrentLectureIndex(idx)}
              className="hover-bg"
              style={{ 
                padding: 'var(--space-16) var(--space-24)', 
                borderBottom: '1px solid var(--border)', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-12)',
                background: currentLectureIndex === idx ? 'var(--primary-light)' : 'transparent',
                borderLeft: currentLectureIndex === idx ? '4px solid var(--primary)' : '4px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              {/* Simplified logic: assumed checked if passed current index based on progress */}
              {(idx + 1) / lectures.length * 100 <= (enrollment?.progressPercentage || 0) ? (
                <CheckCircle size={20} className="text-success flex-shrink-0" />
              ) : (
                <PlayCircle size={20} className={currentLectureIndex === idx ? 'text-primary flex-shrink-0' : 'text-muted flex-shrink-0'} />
              )}
              
              <div className="flex-col">
                <div className={`font-medium ${currentLectureIndex === idx ? 'text-primary font-semibold' : 'text-primary'}`}>
                  {lecture.title}
                </div>
                <div className="text-xs text-secondary mt-1 font-medium">{Math.floor(lecture.durationSeconds / 60)} min</div>
              </div>
            </div>
          ))}

          {quizzes.length > 0 && (
            <div className="mt-4">
              <div style={{ padding: 'var(--space-8) var(--space-24)', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Course Quizzes
              </div>
              {quizzes.map((quiz) => (
                <div 
                  key={quiz.id} 
                  onClick={() => navigate(`/quizzes/${quiz.id}`)}
                  className="hover-bg"
                  style={{ 
                    padding: 'var(--space-16) var(--space-24)', 
                    borderBottom: '1px solid var(--border)', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-12)',
                    transition: 'all 0.2s',
                  }}
                >
                  <FileText size={20} className="text-warning flex-shrink-0" />
                  <div className="font-medium text-secondary">
                    {quiz.title}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default LecturePlayer;
