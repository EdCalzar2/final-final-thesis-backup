import React, { useState, useEffect } from 'react';
import Header from '../Header';
import Form from '../Form';
import StoryList from '../StoryList';

export const Story = ({ stories, setStories, onAddStory }) => {
  const userName = localStorage.getItem('userName');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleDeleteStory = (storyToDelete) => {
    setStories(stories.filter(story => story !== storyToDelete));
  };

  useEffect(() => {
    // Listen for back/forward navigation
    const handlePopState = (event) => {
      event.preventDefault();
      setShowLogoutConfirm(true);
      // Push state back so user stays here until they confirm
      window.history.pushState(null, null, window.location.pathname);
    };

    // Push initial state so popstate fires on back
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Optional: also warn if trying to close/refresh tab
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const confirmLogout = () => {
    // Clear user data
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    // Redirect to login page
    window.location.href = '/';
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        padding: '10px 20px',
        border: '2px black solid',
        width: '210px',
        fontWeight: 'bold',
        fontSize: '16px',
        color: '#333',
        backgroundColor: 'white'
      }}>
        {userName ? `Welcome, ${userName}!` : ''}
      </div>

      <Header />
      <Form onAddStory={onAddStory} />
      <StoryList stories={stories} onDeleteStory={handleDeleteStory} />

      {showLogoutConfirm && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 8,
            maxWidth: 300,
            textAlign: 'center',
          }}>
            <p>Are you sure you want to log out?</p>
            <button onClick={confirmLogout} style={{ marginRight: 10 }}>Yes</button>
            <button onClick={cancelLogout}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};
