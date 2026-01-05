import React from 'react';
import { calendarAPI } from '../services/api';

function Header({ onReset, schedule }) {
  const handleExport = async () => {
    if (!schedule) return;
    
    try {
      const response = await calendarAPI.exportICal(schedule);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'aetheria-schedule.ics');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting schedule:', error);
      alert('Failed to export schedule');
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div>
          <h1>✨ Aetheria</h1>
          <p>Your AI-Powered Scheduling Assistant</p>
        </div>
        <div className="nav-buttons">
          {schedule && (
            <button className="icon-button" onClick={handleExport}>
              📅 Export
            </button>
          )}
          <button className="icon-button" onClick={onReset}>
            🔄 New Schedule
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
