import React from 'react';
import RoutePredictionPanel from '../components/RoutePredictionPanel';
import QuarterlyTrendsPanel from '../components/QuarterlyTrendsPanel';
import YearlyTrendsPanel from '../components/YearlyTrendsPanel';
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
          {/* Left Column */}
          <RoutePredictionPanel 
            departure={departureLocation.split(' ')[0]}
            arrival={arrivalLocation.split(' ')[0]}
            dateRange={dateRange}
            onDateChange={onDateChange}
          />

          {/* Right Column: Quarterly + Yearly stacked */}
          <div className="stacked-panels">
            <QuarterlyTrendsPanel 
              departure={departureLocation.split(' ')[0]} 
              arrival={arrivalLocation.split(' ')[0]} 
              dateRange={dateRange}
            />
            <YearlyTrendsPanel 
              departure={departureLocation.split(' ')[0]} 
              arrival={arrivalLocation.split(' ')[0]} 
              dateRange={dateRange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingTrendsPage;
