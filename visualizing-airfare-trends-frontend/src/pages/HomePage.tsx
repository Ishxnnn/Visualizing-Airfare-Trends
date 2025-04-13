import React, { useState } from "react";
import CalendarComponent from "../components/CalendarComponent";
import LocationSelector from "../components/LocationSelector";
import USAFlightMap from "../components/USAFlightMap";
import PricingTrendsPage from "./PricingTrendsPage";
import "./HomePage.css";

const HomePage: React.FC = () => {
  // Date state
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7))
  });

  // Location state
  const [departureLocation, setDepartureLocation] = useState("LAX (Los Angeles)");
  const [arrivalLocation, setArrivalLocation] = useState("ORD (Chicago)");
  
  // Page navigation state
  const [showPricingTrends, setShowPricingTrends] = useState(false);

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

  const handleRouteSelect = (departure: string, arrival: string) => {
    setDepartureLocation(departure);
    setArrivalLocation(arrival);
    console.log("Route selected:", { departure, arrival });
  };

  const handleSearch = () => {
    // Navigate to pricing trends page
    setShowPricingTrends(true);
    console.log("Navigating to pricing trends page with:", {
      departure: departureLocation,
      arrival: arrivalLocation,
      dates: dateRange
    });
  };

  const handleBackToSearch = () => {
    setShowPricingTrends(false);
  };

  // Render the pricing trends page if showPricingTrends is true
  if (showPricingTrends) {
    return (
      <PricingTrendsPage
        departureLocation={departureLocation}
        arrivalLocation={arrivalLocation}
        dateRange={dateRange}
        onDateChange={handleDateChange}
        onBack={handleBackToSearch}
      />
    );
  }

  // Otherwise render the search page
  return (
    <div className="homepage-container">
      <div className="homepage-content">
        {/* MAP SECTION */}
        <div className="map-section">
          <USAFlightMap 
            selectedDeparture={departureLocation}
            selectedArrival={arrivalLocation}
            onRouteSelect={handleRouteSelect}
          />
        </div>

        {/* MAIN CONTENT (Calendar + Location) */}
        <div className="homepage-columns">
          <div className="calendar-column">
            <CalendarComponent 
              onDateChange={handleDateChange}
              initialDateRange={dateRange}
            />
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
