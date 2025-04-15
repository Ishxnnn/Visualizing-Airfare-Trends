import React, { useState } from 'react';
import CalendarComponent from '../components/CalendarComponent';
import './RoutePredictionPanel.css';

interface Props {
  departure: string;
  arrival: string;
  dateRange: { startDate: Date; endDate: Date };
  onDateChange: (range: { startDate: Date; endDate: Date }) => void;
}

const RoutePredictionPanel: React.FC<Props> = ({ departure, arrival, dateRange, onDateChange }) => {
  const [selectedEvent, setSelectedEvent] = useState<string>('None');
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleApply = async () => {
    setLoading(true);
    setPredictedPrice(null);

    try {
      const res = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          departure,
          arrival,
          startDate: dateRange.startDate.toISOString().split('T')[0],
          endDate: dateRange.endDate.toISOString().split('T')[0],
          event: selectedEvent,
        }),
      });

      const data = await res.json();

      if (res.ok && data.predictedPrice) {
        setPredictedPrice(data.predictedPrice);
      } else {
        console.error('Prediction error:', data.error);
      }
    } catch (err) {
      console.error('API error:', err);
    }

    setLoading(false);
  };

  return (
    <div className="calendar-prediction-box">
      <h2 className="fare-predictor-heading">Fare Predictor</h2>
      <div className="calendar-prediction-inner">
        <div className="location-section">
          <CalendarComponent
            onDateChange={onDateChange}
            initialDateRange={dateRange}
          />
        </div>

        <div className="location-section">
          <h3>Choose Special Event</h3>
          <div className="location-dropdown">
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="location-select"
            >
              <option value="None">None</option>
              <option value="Pandemic">Pandemic</option>
              <option value="Recession">Recession</option>
              <option value="Foreign/Domestic Conflict">Foreign/Domestic Conflict</option>
              <option value="Natural Disaster">Natural Disaster</option>
            </select>
          </div>
        </div>

        <div className="search-button-container">
          <button className="search-button" onClick={handleApply} disabled={loading}>
            {loading ? 'Predicting...' : 'Predict Route Fare'}
          </button>
        </div>

        <div className="prediction-result">
          {loading ? (
            <p className="loading-text">Loading prediction...</p>
          ) : predictedPrice !== null ? (
            <p>Your predicted price is: <strong>${predictedPrice}</strong></p>
          ) : (
            <p>We run a decision tree model to calculate your route fare.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutePredictionPanel;
