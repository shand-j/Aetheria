import React, { useState, useEffect } from 'react';
import { scheduleAPI, goalsAPI } from '../services/api';
import Header from '../components/Header';
import ScheduleView from '../components/ScheduleView';
import GoalsPanel from '../components/GoalsPanel';
import FallbackRules from '../components/FallbackRules';
import SetupWizard from '../components/SetupWizard';

function Dashboard() {
  const [schedule, setSchedule] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(true);
  const [userId] = useState('default'); // In production, this would come from auth

  useEffect(() => {
    loadSchedule();
    loadGoals();
  }, []);

  const loadSchedule = async () => {
    try {
      const response = await scheduleAPI.get(userId);
      if (response.data.success) {
        setSchedule(response.data.schedule);
        setShowSetup(false);
      }
    } catch (error) {
      console.log('No schedule found, showing setup');
    }
  };

  const loadGoals = async () => {
    try {
      const response = await goalsAPI.get(userId);
      if (response.data.success) {
        setGoals(response.data.goals);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const handleGenerateSchedule = async (userProfile) => {
    setLoading(true);
    try {
      const response = await scheduleAPI.generate({
        ...userProfile,
        userId: userId
      });
      
      if (response.data.success) {
        setSchedule(response.data.schedule);
        setShowSetup(false);
        
        // Load weekly goals from the generated schedule
        if (response.data.schedule.weeklyGoals) {
          setGoals(response.data.schedule.weeklyGoals);
        }
      }
    } catch (error) {
      console.error('Error generating schedule:', error);
      alert('Failed to generate schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGoal = async (goalId, updates) => {
    try {
      await goalsAPI.update(userId, goalId, updates);
      loadGoals();
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleApplyFallback = async (disruption) => {
    try {
      const response = await scheduleAPI.applyFallback(userId, disruption);
      if (response.data.success) {
        alert(`Fallback applied: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error applying fallback:', error);
    }
  };

  if (showSetup) {
    return (
      <div className="App">
        <Header />
        <div className="container">
          <SetupWizard onComplete={handleGenerateSchedule} loading={loading} />
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header 
        onReset={() => setShowSetup(true)}
        schedule={schedule}
      />
      <div className="container">
        {loading ? (
          <div className="loading">
            <h2>Generating your personalized schedule...</h2>
            <p>This may take a moment</p>
          </div>
        ) : schedule ? (
          <div className="dashboard-grid">
            <div className="schedule-section">
              <ScheduleView 
                schedule={schedule.dailySchedule} 
                onApplyFallback={handleApplyFallback}
              />
            </div>
            <div className="sidebar-section">
              <GoalsPanel 
                goals={goals}
                onUpdateGoal={handleUpdateGoal}
              />
              <FallbackRules rules={schedule.fallbackRules} />
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <h2>No schedule found</h2>
            <p>Create your first schedule to get started</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowSetup(true)}
            >
              Create Schedule
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
