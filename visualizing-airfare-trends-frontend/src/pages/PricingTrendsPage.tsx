import React, { useState } from 'react';
import CalendarComponent from '../components/CalendarComponent';
import './PricingTrendsPage.css';

interface PricingTrendsPageProps {
  departureLocation: string;
  arrivalLocation: string;
  dateRange: { startDate: Date; endDate: Date };
  onDateChange: (range: { startDate: Date; endDate: Date }) => void;
  onBack: () => void;
}

const PricingTrendsPage: React.FC<PricingTrendsPageProps> = ({
  departureLocation,
  arrivalLocation,
  dateRange,
  onDateChange,
  onBack
}) => {
  const [selectedEvent, setSelectedEvent] = useState<string>('None');

  // Sample data for charts
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Economic metrics for the selected month
  const metrics = {
    GDP: '21.43 trillion USD',
    'Unemployment Rate': '3.7%',
    'Inflation Rate': '2.9%',
    'Interest Rates': '5.25%',
    'Oil Prices': '$82.75 per barrel'
  };

  return (
    <div className="pricing-trends-container">
      <div className="pricing-trends-header">
        <button className="back-button" onClick={onBack}>
          &larr; Back to Search
        </button>
        <h1>Flight Price Analysis: {departureLocation} to {arrivalLocation}</h1>
      </div>

      <div className="pricing-trends-content">
        <div className="pricing-trends-row">
          <div className="calendar-section">
            {/* Using the same CalendarComponent as the home page */}
            <CalendarComponent 
              onDateChange={onDateChange} 
              initialDateRange={dateRange}
            />
          </div>

          <div className="chart-section">
            <h2>Historical Pricing Trends</h2>
            <div className="chart">
              <div className="chart-controls">
                <button className="chart-nav-btn">&lt;</button>
                <button className="chart-nav-btn">&gt;</button>
              </div>
              <div className="chart-bars">
                {months.map((month, index) => (
                  <div 
                    key={month} 
                    className={`chart-bar ${index === 3 ? 'highlighted' : ''}`}
                    style={{ height: `${Math.random() * 70 + 30}%` }}
                  >
                    <span className="bar-value">${Math.floor(Math.random() * 300 + 200)}</span>
                    <div className="bar-fill"></div>
                    <span className="bar-label">{month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pricing-trends-row">
          <div className="prediction-section">
            <h2>Price Prediction</h2>
            <div className="event-options">
              <label className="event-option">
                <input
                  type="radio"
                  name="event"
                  value="None"
                  checked={selectedEvent === 'None'}
                  onChange={() => setSelectedEvent('None')}
                />
                <span>None</span>
              </label>
              <label className="event-option">
                <input
                  type="radio"
                  name="event"
                  value="Pandemic"
                  checked={selectedEvent === 'Pandemic'}
                  onChange={() => setSelectedEvent('Pandemic')}
                />
                <span>Pandemic</span>
              </label>
              <label className="event-option">
                <input
                  type="radio"
                  name="event"
                  value="Recession"
                  checked={selectedEvent === 'Recession'}
                  onChange={() => setSelectedEvent('Recession')}
                />
                <span>Recession</span>
              </label>
              <label className="event-option">
                <input
                  type="radio"
                  name="event"
                  value="Foreign/Domestic Conflict"
                  checked={selectedEvent === 'Foreign/Domestic Conflict'}
                  onChange={() => setSelectedEvent('Foreign/Domestic Conflict')}
                />
                <span>Foreign/Domestic Conflict</span>
              </label>
              <label className="event-option">
                <input
                  type="radio"
                  name="event"
                  value="Natural Disaster"
                  checked={selectedEvent === 'Natural Disaster'}
                  onChange={() => setSelectedEvent('Natural Disaster')}
                />
                <span>Natural Disaster</span>
              </label>
            </div>
            <button className="apply-button">Apply</button>
            <div className="prediction-result">
              <p>Your predicted price is: <strong>$583</strong></p>
            </div>
          </div>

          <div className="metrics-section">
            <h2>Metrics</h2>
            <div className="metrics-content">
              <h3>August 2021</h3>
              {Object.entries(metrics).map(([key, value]) => (
                <div key={key} className="metric-item">
                  <span className="metric-label">{key}:</span>
                  <span className="metric-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pricing-trends-row">
          <div className="seasonal-trends-section">
            <h2>Seasonal Pricing Trends</h2>
            <div className="chart">
              <div className="chart-controls">
                <button className="chart-nav-btn">&lt;</button>
                <button className="chart-nav-btn">&gt;</button>
              </div>
              <div className="chart-bars">
                {months.map((month) => (
                  <div 
                    key={`seasonal-${month}`} 
                    className="chart-bar"
                    style={{ height: `${Math.random() * 70 + 30}%` }}
                  >
                    <span className="bar-value">${Math.floor(Math.random() * 300 + 200)}</span>
                    <div className="bar-fill"></div>
                    <span className="bar-label">{month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingTrendsPage;
