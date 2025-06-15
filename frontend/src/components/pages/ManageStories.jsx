import styles from './manageStories.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

export default function ManageStories({ 
  pendingStories = [], 
  approvedStories = [], 
  onApprove, 
  onReject, 
  onDelete 
}) {
  const navigate = useNavigate();
  const storyContentRefs = useRef({});
  const [overflowedStories, setOverflowedStories] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    const overflowCheck = {};
    Object.entries(storyContentRefs.current).forEach(([id, el]) => {
      if (el) {
        overflowCheck[id] = el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth;
      }
    });
    setOverflowedStories(overflowCheck);
  }, [pendingStories, approvedStories]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        setModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const scrollStoryContent = (id, direction) => {
    const el = storyContentRefs.current[id];
    if (!el) return;

    const scrollStep = 100;
    switch(direction) {
      case 'up':
        el.scrollBy({ top: -scrollStep, behavior: 'smooth' });
        break;
      case 'down':
        el.scrollBy({ top: scrollStep, behavior: 'smooth' });
        break;
      case 'left':
        el.scrollBy({ left: -scrollStep, behavior: 'smooth' });
        break;
      case 'right':
        el.scrollBy({ left: scrollStep, behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  const openModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
    setModalTitle('');
  };

  const handleModalClick = e => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleApprove = (storyId) => {
    if (onApprove) {
      onApprove(storyId);
    }
  };

  const handleReject = (storyId) => {
    if (onReject) {
      onReject(storyId);
    }
  };

  const handleDelete = (storyId) => {
    if (onDelete) {
      onDelete(storyId);
    }
  };

  const ScrollButtons = ({ id }) => (
    <div className={styles.scrollButtonsContainer}>
      <button aria-label="Scroll up" className={styles.scrollButton} onClick={() => scrollStoryContent(id, 'up')}>▲</button>
      <button aria-label="Scroll down" className={styles.scrollButton} onClick={() => scrollStoryContent(id, 'down')}>▼</button>
      <button aria-label="Scroll left" className={styles.scrollButton} onClick={() => scrollStoryContent(id, 'left')}>◀</button>
      <button aria-label="Scroll right" className={styles.scrollButton} onClick={() => scrollStoryContent(id, 'right')}>▶</button>
    </div>
  );

  return (
    <div className={styles.manageStoriesBackground}>

      {/* Modal Overlay */}
      {modalOpen && (
        <div 
          className={styles.modalOverlay} 
          onClick={handleModalClick} 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modalTitle"
          tabIndex={-1}
        >
          <div className={styles.modalContent}>
            <h3 id="modalTitle" className={styles.modalTitle}>{modalTitle}</h3>
            <div className={styles.modalBody}>
              {modalContent}
            </div>
            <button className={styles.modalCloseButton} onClick={closeModal} aria-label="Close modal">×</button>
          </div>
        </div>
      )}

      <nav className={styles.navStories}>
        <ul>
          <li>
            <NavLink 
              to="/manageStories"
              className={({ isActive }) => isActive ? styles.active : undefined}
            >
              Manage Stories
            </NavLink>
          </li>
          <button 
            className={styles.logoutButton} 
            onClick={handleLogout}
          >
            Log Out
        </button>
        </ul>
      </nav>

      

      <div className={styles.contentContainer}>

        {/* Pending Stories Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Pending Stories ({pendingStories.length})
          </h2>
          <div className={styles.storiesGrid}>
            {pendingStories.length === 0 ? (
              <p className={styles.emptyMessage}>No pending stories</p>
            ) : (
              pendingStories.map(story => (
                <div key={story.id} className={styles.storyCard}>
                  <div className={styles.storyHeader}>
                    <span className={styles.statusBadge}>Pending</span>
                    <span className={styles.storyId}>ID: {story.id}</span>
                  </div>
                  <div 
                    className={styles.storyContentScrollable} 
                    ref={el => storyContentRefs.current[story.id] = el}
                    tabIndex={0} 
                    aria-label="Story content scroll area"
                  >
                    <p className={styles.storyText}>
                      {story.text.length > 200 ? story.text.substring(0, 40) + '...' : story.text}
                    </p>
                  </div>
                  
                  {/* Location Information */}
                  {story.location && (
                    <div className={styles.locationInfo}>
                      <strong>📍 Location:</strong><br/>
                      Lat: {story.location.lat.toFixed(6)}<br/>
                      Lng: {story.location.lng.toFixed(6)}
                    </div>
                  )}
                  
                  <small className={styles.submissionDate}>
                    Submitted: {new Date(story.submittedAt).toLocaleDateString()}
                  </small>
                  
                  {/* Action Buttons for Pending Stories */}
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.approveButton} 
                      onClick={() => handleApprove(story.id)}
                    >
                      Approve
                    </button>
                    <button 
                      className={styles.rejectButton} 
                      onClick={() => handleReject(story.id)}
                    >
                      Reject
                    </button>
                  </div>
                  
                  {story.text.length > 200 && (
                    <>
                      <br />
                      <button 
                        className={styles.fullStory} 
                        onClick={() => openModal('INCIDENT REPORT', (
                          <div>
                            <h4>Safety Incident Report</h4>
                            <h4>Username: </h4>
                            <h4>Story ID: {story.id}</h4>
                            <h4><br/>Story Description:</h4>
                            
                            <div className={styles.storyBox}>
                              <p>{story.text}</p>
                            </div>
                            
                            {story.location && (
                              <div style={{ marginTop: '15px' }}>
                                <h4>Location Details:</h4>
                                <div style={{
                                  backgroundColor: '#f8f9fa',
                                  padding: '10px',
                                  borderRadius: '4px',
                                  border: '1px solid #dee2e6'
                                }}>
                                  <strong>Latitude:</strong> {story.location.lat.toFixed(6)}<br/>
                                  <strong>Longitude:</strong> {story.location.lng.toFixed(6)}
                                </div>
                              </div>
                            )}
                            
                            <div style={{ marginTop: '15px' }}>
                              <h4>Submission Details:</h4>
                              <div style={{
                                backgroundColor: '#f8f9fa',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #dee2e6'
                              }}>
                                <strong>Submitted:</strong> {new Date(story.submittedAt).toLocaleString()}<br/>
                                <strong>Status:</strong> Pending Review
                              </div>
                            </div>
                          </div>
                        ))}
                      >
                        View Full Story
                      </button>
                    </>
                  )}
                  
                  {overflowedStories[story.id] && <ScrollButtons id={story.id} />}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Approved Stories Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Approved Stories ({approvedStories.length})
          </h2>
          <div className={styles.storiesGrid}>
            {approvedStories.length === 0 ? (
              <p className={styles.emptyMessage}>No approved stories</p>
            ) : (
              approvedStories.map(story => (
                <div key={story.id} className={styles.storyCard}>
                  <div className={styles.storyHeader}>
                    <span className={styles.statusBadgeApproved}>Approved</span>
                    <span className={styles.storyId}>ID: {story.id}</span>
                  </div>
                  <div 
                    className={styles.storyContentScrollable} 
                    ref={el => storyContentRefs.current[`approved_${story.id}`] = el}
                    tabIndex={0} 
                    aria-label="Story content scroll area"
                  >
                    <p className={styles.storyText}>
                      {story.text.length > 200 ? story.text.substring(0, 40) + '...' : story.text}
                    </p>
                  </div>
                  
                  {/* Location Information */}
                  {story.location && (
                    <div className={styles.locationInfo}>
                      <strong>📍 Location:</strong><br/>
                      Lat: {story.location.lat.toFixed(6)}<br/>
                      Lng: {story.location.lng.toFixed(6)}
                    </div>
                  )}
                  
                  <small className={styles.submissionDate}>
                    Submitted: {new Date(story.submittedAt).toLocaleDateString()}
                  </small>
                  
                  {/* Action Buttons for Approved Stories */}
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.deleteButton} 
                      onClick={() => handleDelete(story.id)}
                    >
                      Delete
                    </button>
                  </div>
                  
                  {story.text.length > 5 && (
                    <>
                      <br />
                      <button 
                        className={styles.fullStory} 
                        onClick={() => openModal('APPROVED INCIDENT REPORT', (
                          <div>
                            <h4 className={styles.status}>ACCOUNT STATUS</h4>
                            <h4>Username: </h4>
                            <h4>Story ID: {story.id}</h4>
                            <h4><br/>Story Description:</h4>
                            
                            <div className={styles.storyBox}>
                              <p>{story.text}</p>
                            </div>
                            
                            {story.location && (
                              <div style={{ marginTop: '15px' }}>
                                <h4>Location Details:</h4>
                                <div style={{
                                  backgroundColor: '#f8f9fa',
                                  padding: '10px',
                                  borderRadius: '4px',
                                  border: '1px solid #dee2e6'
                                }}>
                                  <strong>Latitude:</strong> {story.location.lat.toFixed(6)}<br/>
                                  <strong>Longitude:</strong> {story.location.lng.toFixed(6)}
                                </div>
                              </div>
                            )}
                            
                            <div style={{ marginTop: '15px' }}>
                              <h4>Submission Details:</h4>
                              <div style={{
                                backgroundColor: '#d4edda',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #c3e6cb'
                              }}>
                                <strong>Submitted:</strong> {new Date(story.submittedAt).toLocaleDateString()}<br/>
                                <strong>Status:</strong> ✅ Approved & Visible on Safety Map
                              </div>
                            </div>
                          </div>
                        ))}
                      >
                        View Full Story
                      </button>
                    </>
                  )}
                  
                  {overflowedStories[`approved_${story.id}`] && <ScrollButtons id={`approved_${story.id}`} />}
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}