import React from 'react';
import RoutePredictionPanel from '../components/RoutePredictionPanel';
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
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
        <RoutePredictionPanel 
            departure={departureLocation.split(' ')[0]}
            arrival={arrivalLocation.split(' ')[0]}
            dateRange={dateRange}
            onDateChange={onDateChange}
          />

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
