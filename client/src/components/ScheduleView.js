import React, { useState } from 'react';

function ScheduleView({ schedule, onApplyFallback }) {
  const [selectedDisruption, setSelectedDisruption] = useState('');

  const getCategoryBadgeClass = (category) => {
    return `badge badge-${category}`;
  };

  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };

  const handleApplyFallback = () => {
    if (selectedDisruption.trim()) {
      onApplyFallback(selectedDisruption);
      setSelectedDisruption('');
    }
  };

  return (
    <div className="card">
      <div className="card-header">📅 Today's Schedule</div>
      
      <div className="schedule-list">
        {schedule && schedule.length > 0 ? (
          schedule.map((item) => (
            <div 
              key={item.id} 
              className={`time-block ${getPriorityClass(item.priority)}`}
            >
              <div className="time-label">
                {item.startTime} - {item.endTime}
              </div>
              <div className="activity-details">
                <div className="activity-title">{item.activity}</div>
                <div className="activity-description">{item.description}</div>
                <div className="activity-meta">
                  <span className={getCategoryBadgeClass(item.category)}>
                    {item.category}
                  </span>
                  <span className="badge">
                    {item.flexibility} flexibility
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No schedule items</p>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">⚡ Apply Fallback Rule</div>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '10px' }}>
          Something unexpected came up? Describe what happened and we'll adjust your schedule.
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={selectedDisruption}
            onChange={(e) => setSelectedDisruption(e.target.value)}
            placeholder="e.g., Meeting ran over, Kids sick, etc."
            style={{
              flex: 1,
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <button 
            className="btn btn-secondary"
            onClick={handleApplyFallback}
            disabled={!selectedDisruption.trim()}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScheduleView;
