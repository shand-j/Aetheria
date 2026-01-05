import React, { useState } from 'react';

function SetupWizard({ onComplete, loading }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    priorities: {
      work: 'high',
      family: 'high',
      fitness: 'medium',
      admin: 'medium'
    },
    goals: [],
    challenges: [],
    preferences: {
      morningPerson: true,
      workHours: '8:00-17:00'
    },
    constraints: {
      schoolDropoff: '07:30',
      schoolPickup: '15:00'
    }
  });

  const [currentInput, setCurrentInput] = useState('');

  const handlePriorityChange = (category, value) => {
    setFormData({
      ...formData,
      priorities: {
        ...formData.priorities,
        [category]: value
      }
    });
  };

  const handleAddItem = (field) => {
    if (currentInput.trim()) {
      setFormData({
        ...formData,
        [field]: [...formData[field], currentInput.trim()]
      });
      setCurrentInput('');
    }
  };

  const handleRemoveItem = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    });
  };

  const handleSubmit = () => {
    onComplete(formData);
  };

  const renderStep1 = () => (
    <div className="setup-step">
      <h2>🎯 Set Your Priorities</h2>
      <p style={{ color: '#6b7280', marginBottom: '20px' }}>
        Help us understand what matters most to you
      </p>

      {Object.entries(formData.priorities).map(([category, value]) => (
        <div key={category} style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', textTransform: 'capitalize' }}>
            {category}
          </label>
          <select
            value={value}
            onChange={(e) => handlePriorityChange(category, e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      ))}

      <button 
        className="btn btn-primary"
        onClick={() => setStep(2)}
        style={{ width: '100%' }}
      >
        Next: Goals
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="setup-step">
      <h2>📝 What Are Your Goals?</h2>
      <p style={{ color: '#6b7280', marginBottom: '20px' }}>
        Share what you'd like to accomplish this week
      </p>

      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddItem('goals')}
          placeholder="e.g., Exercise 4 times, Complete project X"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            marginBottom: '10px'
          }}
        />
        <button 
          className="btn btn-secondary"
          onClick={() => handleAddItem('goals')}
          style={{ width: '100%' }}
        >
          Add Goal
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        {formData.goals.map((goal, index) => (
          <div 
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px',
              background: '#f9fafb',
              borderRadius: '8px',
              marginBottom: '8px'
            }}
          >
            <span style={{ fontSize: '14px' }}>{goal}</span>
            <button
              onClick={() => handleRemoveItem('goals', index)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          className="btn"
          onClick={() => setStep(1)}
          style={{ flex: 1, background: '#e5e7eb' }}
        >
          Back
        </button>
        <button 
          className="btn btn-primary"
          onClick={() => setStep(3)}
          style={{ flex: 1 }}
        >
          Next: Challenges
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="setup-step">
      <h2>⚠️ What Challenges Do You Face?</h2>
      <p style={{ color: '#6b7280', marginBottom: '20px' }}>
        Help us understand what makes scheduling difficult
      </p>

      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddItem('challenges')}
          placeholder="e.g., Unpredictable kids' schedule, Frequent meetings"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            marginBottom: '10px'
          }}
        />
        <button 
          className="btn btn-secondary"
          onClick={() => handleAddItem('challenges')}
          style={{ width: '100%' }}
        >
          Add Challenge
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        {formData.challenges.map((challenge, index) => (
          <div 
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px',
              background: '#fef3c7',
              borderRadius: '8px',
              marginBottom: '8px'
            }}
          >
            <span style={{ fontSize: '14px' }}>{challenge}</span>
            <button
              onClick={() => handleRemoveItem('challenges', index)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          className="btn"
          onClick={() => setStep(2)}
          style={{ flex: 1, background: '#e5e7eb' }}
        >
          Back
        </button>
        <button 
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading}
          style={{ flex: 1 }}
        >
          {loading ? 'Generating...' : '✨ Generate My Schedule'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '40px auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: '4px',
                background: step >= s ? '#4f46e5' : '#e5e7eb',
                borderRadius: '2px',
                margin: '0 4px'
              }}
            />
          ))}
        </div>
        <div style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
          Step {step} of 3
        </div>
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
}

export default SetupWizard;
