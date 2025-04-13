import React, { useState } from "react";
import CalendarComponent from "../components/CalendarComponent";
import LocationSelector from "../components/LocationSelector";
import "./HomePage.css";

const HomePage: React.FC = () => {
  // Date state
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7))
  });

  // Location state
  const [departureLocation, setDepartureLocation] = useState("SFO (San Francisco)");
  const [arrivalLocation, setArrivalLocation] = useState("LGA (New York City)");

  const handleDateChange = (range: { startDate: Date; endDate: Date }) => {
    setDateRange(range);
    console.log("Selected date range:", range);
  };

  const handleDepartureChange = (location: string) => {
    setDepartureLocation(location);
    console.log("Departure location changed to:", location);
  };

  const handleArrivalChange = (location: string) => {
    setArrivalLocation(location);
    console.log("Arrival location changed to:", location);
  };

  const handleSearch = () => {
    // Implement search functionality
    console.log("Searching for flights:", {
      departure: departureLocation,
      arrival: arrivalLocation,
      dates: dateRange
    });
  };

  return (
    <div className="homepage-container">
      <div className="homepage-content">
        {/* MAP SECTION */}
        <div className="map-section">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/975fe16f5f360709c551a1e5357c3de4066e3d0c?placeholderIfAbsent=true&apiKey=eafb45c2a494467c8e1296db52df8a5e"
            alt="Header Map"
            className="map-image"
          />
        </div>

        {/* MAIN CONTENT (Calendar + Location) */}
        <div className="homepage-columns">
          <div className="calendar-column">
            <CalendarComponent onDateChange={handleDateChange} />
          </div>

          <div className="location-column">
            <LocationSelector
              departureLocation={departureLocation}
              arrivalLocation={arrivalLocation}
              onDepartureChange={handleDepartureChange}
              onArrivalChange={handleArrivalChange}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
