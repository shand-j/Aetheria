import React from 'react';

function GoalsPanel({ goals, onUpdateGoal }) {
  const handleProgressUpdate = (goalId, increment) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const newCurrent = Math.max(0, Math.min(goal.target, goal.current + increment));
    onUpdateGoal(goalId, { current: newCurrent });
  };

  const getProgressPercentage = (current, target) => {
    return Math.min(100, Math.round((current / target) * 100));
  };

  return (
    <div className="card">
      <div className="card-header">🎯 Weekly Goals</div>
      
      {goals && goals.length > 0 ? (
        <div className="goals-list">
          {goals.map((goal) => (
            <div key={goal.id} className="goal-item">
              <div className="goal-header">
                <span className="goal-title">{goal.goal}</span>
                <span className="goal-progress">
                  {goal.current}/{goal.target}
                </span>
              </div>
              
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${getProgressPercentage(goal.current, goal.target)}%` 
                  }}
                />
              </div>
              
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleProgressUpdate(goal.id, 1)}
                  disabled={goal.current >= goal.target}
                  style={{ 
                    padding: '6px 12px', 
                    fontSize: '12px',
                    opacity: goal.current >= goal.target ? 0.5 : 1
                  }}
                >
                  +1
                </button>
                <button
                  className="btn"
                  onClick={() => handleProgressUpdate(goal.id, -1)}
                  disabled={goal.current <= 0}
                  style={{ 
                    padding: '6px 12px', 
                    fontSize: '12px',
                    background: '#e5e7eb',
                    opacity: goal.current <= 0 ? 0.5 : 1
                  }}
                >
                  -1
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No goals set</p>
        </div>
      )}
    </div>
  );
}

export default GoalsPanel;
