import React from 'react';

function FallbackRules({ rules }) {
  return (
    <div className="card">
      <div className="card-header">🔄 Smart Fallback Rules</div>
      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '15px' }}>
        When things don't go as planned, these rules help you stay on track.
      </p>
      
      {rules && rules.length > 0 ? (
        <div className="fallback-list">
          {rules.map((rule) => (
            <div key={rule.id} className="fallback-rule">
              <div className="fallback-condition">
                If: {rule.condition}
              </div>
              <div className="fallback-action">
                Then: {rule.action}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No fallback rules</p>
        </div>
      )}
    </div>
  );
}

export default FallbackRules;
