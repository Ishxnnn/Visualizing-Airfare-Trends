import React from 'react';
import './LocationSelector.css';

interface LocationSelectorProps {
  departureLocation: string;
  arrivalLocation: string;
  onDepartureChange?: (location: string) => void;
  onArrivalChange?: (location: string) => void;
  onSearch?: () => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  departureLocation,
  arrivalLocation,
  onDepartureChange,
  onArrivalChange,
  onSearch
}) => {
  const handleDepartureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onDepartureChange) {
      onDepartureChange(e.target.value);
    }
  };

  const handleArrivalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onArrivalChange) {
      onArrivalChange(e.target.value);
    }
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch();
    }
  };

  // Sample airport options - you would likely fetch these from an API
  const airports = [
    { code: 'SFO', name: 'San Francisco' },
    { code: 'LAX', name: 'Los Angeles' },
    { code: 'JFK', name: 'New York JFK' },
    { code: 'LGA', name: 'New York LaGuardia' },
    { code: 'ORD', name: 'Chicago' },
    { code: 'MIA', name: 'Miami' },
    { code: 'DFW', name: 'Dallas' },
    { code: 'DEN', name: 'Denver' },
    { code: 'SEA', name: 'Seattle' },
    { code: 'BOS', name: 'Boston' }
  ];

  return (
    <div className="location-selector">
      <div className="location-section">
        <h3>Departure</h3>
        <div className="location-dropdown">
          <select 
            value={departureLocation}
            onChange={handleDepartureChange}
            className="location-select"
          >
            {airports.map(airport => (
              <option key={airport.code} value={`${airport.code} (${airport.name})`}>
                {airport.code} ({airport.name})
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="location-section">
        <h3>Arrival</h3>
        <div className="location-dropdown">
          <select 
            value={arrivalLocation}
            onChange={handleArrivalChange}
            className="location-select"
          >
            {airports.map(airport => (
              <option key={airport.code} value={`${airport.code} (${airport.name})`}>
                {airport.code} ({airport.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="search-button-container">
        <button className="search-button" onClick={handleSearchClick}>
          View Data
        </button>
      </div>
    </div>
  );
};

export default LocationSelector;