import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './components/pages/Login.css';
import Login from './components/pages/Login';
import MainPage from './MainPage';
import { Story, Safety_map } from './components/pages';
import ManageStories from './components/pages/ManageStories';
import SignUp from './components/pages/SignUp';
import ProtectedRoute from './components/ProtectedRoute';  
import ForgotPassword from './components/pages/ForgotPassword';
import PinSafety_map from './components/pages/PinSafety_map';

function App() {
  // Initialize state with data from localStorage
  const [stories, setStories] = useState(() => {
    const saved = localStorage.getItem('approvedStories');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [pendingStories, setPendingStories] = useState(() => {
    const saved = localStorage.getItem('pendingStories');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [tempStory, setTempStory] = useState(null);

  // Save to localStorage whenever stories change
  useEffect(() => {
    localStorage.setItem('approvedStories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('pendingStories', JSON.stringify(pendingStories));
  }, [pendingStories]);

  // Load tempStory from sessionStorage on app mount
  useEffect(() => {
    const storedTempStory = sessionStorage.getItem('tempStory');
    if (storedTempStory) {
      try {
        const parsedStory = JSON.parse(storedTempStory);
        setTempStory(parsedStory);
        console.log('Loaded tempStory from sessionStorage:', parsedStory);
      } catch (error) {
        console.error('Error parsing stored tempStory:', error);
        sessionStorage.removeItem('tempStory'); // Clear corrupted data
      }
    }
  }, []);

  // Add story text temporarily (before location is pinned)
  const addTempStory = (storyText) => {
    const tempStoryData = {
      id: Date.now(),
      text: storyText,
      submittedAt: new Date().toISOString()
    };
    
    console.log('Adding temp story:', tempStoryData);
    
    // Store in both state and sessionStorage
    setTempStory(tempStoryData);
    sessionStorage.setItem('tempStory', JSON.stringify(tempStoryData));
  };

  // Add story with location to pending queue
  const addPendingStoryWithLocation = (location) => {
    console.log('Adding story with location:', { tempStory, location });
    
    if (tempStory) {
      const storyWithLocation = {
        ...tempStory,
        location: location, // { lat, lng }
        status: 'pending'
      };
      
      console.log('Final story with location:', storyWithLocation);
      
      setPendingStories(prev => {
        const updated = [...prev, storyWithLocation];
        return updated;
      });
      
      // Clear temp story from both state and sessionStorage
      setTempStory(null);
      sessionStorage.removeItem('tempStory');
      
      console.log('Story added to pending, tempStory cleared');
    } else {
      console.error('No tempStory found when trying to add location');
    }
  };

  // Approve story (move from pending to approved)
  const approveStory = (storyId) => {
    const storyToApprove = pendingStories.find(story => story.id === storyId);
    if (storyToApprove) {
      const approvedStory = {
        ...storyToApprove,
        status: 'approved',
        approvedAt: new Date().toISOString()
      };
      
      setStories(prev => {
        const updated = [...prev, approvedStory];
        return updated;
      });
      
      setPendingStories(prev => {
        const updated = prev.filter(story => story.id !== storyId);
        return updated;
      });
      
      console.log('Story approved:', approvedStory);
    }
  };

  // Reject story (remove from pending)
  const rejectStory = (storyId) => {
    setPendingStories(prev => {
      const updated = prev.filter(story => story.id !== storyId);
      return updated;
    });
    console.log('Story rejected:', storyId);
  };

  // Delete approved story
  const deleteApprovedStory = (storyId) => {
    setStories(prev => {
      const updated = prev.filter(story => story.id !== storyId);
      return updated;
    });
    console.log('Approved story deleted:', storyId);
  };

  // Debug: Log state changes
  useEffect(() => {
    console.log('Current tempStory state:', tempStory);
  }, [tempStory]);

  useEffect(() => {
    console.log('Current pendingStories count:', pendingStories.length);
    console.log('Pending stories:', pendingStories);
  }, [pendingStories]);

  useEffect(() => {
    console.log('Current approved stories count:', stories.length);
    console.log('Approved stories:', stories);
  }, [stories]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route 
        path="/story" 
        element={
          <ProtectedRoute>
            <MainPage>
              <Story 
                stories={stories} 
                setStories={setStories} 
                onAddStory={addTempStory} 
              />
            </MainPage>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/safety_map" 
        element={
          <ProtectedRoute>
            <MainPage>
              <Safety_map approvedStories={stories} />
            </MainPage>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/manageStories" 
        element={
          <ProtectedRoute>
            <ManageStories 
              pendingStories={pendingStories}
              approvedStories={stories}
              onApprove={approveStory}
              onReject={rejectStory}
              onDelete={deleteApprovedStory}
            />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/signUp" 
        element={<SignUp />} 
      />

      {/* Pin safety map route for location selection */}
      <Route 
        path="/pin-safety-map" 
        element={
          <ProtectedRoute>
            <PinSafety_map 
              tempStory={tempStory}
              onSubmitStoryWithLocation={addPendingStoryWithLocation}
            />
          </ProtectedRoute>
        } 
      />

      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;