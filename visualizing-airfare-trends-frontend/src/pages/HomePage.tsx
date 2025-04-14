import React, { useState, useEffect } from "react";
import CalendarComponent from "../components/CalendarComponent";
import LocationSelector from "../components/LocationSelector";
import USAFlightMap from "../components/USAFlightMap";
import PricingTrendsPage from "./PricingTrendsPage";
import "./HomePage.css";

// Airport interface
interface Airport {
  code: string;
  name: string;
}

// Route interface
interface FlightRoute {
  from: string;
  to: string;
  popularity: number;
  passengerCount?: number;
  averageFare?: number;
}

const HomePage: React.FC = () => {
  // Date state
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7))
  });

  // Location state
  const [departureLocation, setDepartureLocation] = useState("Select departure");
  const [arrivalLocation, setArrivalLocation] = useState("Select arrival");
  
  // Navigation state
  const [showPricingTrends, setShowPricingTrends] = useState(false);
  
  // Airport data
  const [airports, setAirports] = useState<Airport[]>([]);
  const [routes, setRoutes] = useState<FlightRoute[]>([]);
  const [availableDestinations, setAvailableDestinations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch routes from API
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:5000/api/routes');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch routes: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setRoutes(data);
        
        // Extract unique airports and create airport objects
        const airportSet = new Set<string>();
        data.forEach((route: FlightRoute) => {
          airportSet.add(route.from);
          airportSet.add(route.to);
        });
        
        // Create airport objects with names from airportCoordinates
        const airportList: Airport[] = Array.from(airportSet).map(code => ({
          code,
          name: getAirportName(code)
        }));
        
        // Sort airports alphabetically by code
        airportList.sort((a, b) => a.code.localeCompare(b.code));
        
        setAirports(airportList);
      } catch (error) {
        console.error("Error fetching routes:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoutes();
  }, []);

  // Update available destinations when departure changes
  useEffect(() => {
    if (departureLocation === 'Select departure') {
      setAvailableDestinations([]);
      return;
    }
    
    const departureCode = departureLocation.split(' ')[0];
    
    // Find all routes from the selected departure
    const destinations = routes
      .filter(route => route.from === departureCode || route.to === departureCode)
      .map(route => route.from === departureCode ? route.to : route.from);
    
    // Remove duplicates
    setAvailableDestinations([...new Set(destinations)]);
    
    // Reset arrival if not in available destinations
    if (arrivalLocation !== 'Select arrival') {
      const arrivalCode = arrivalLocation.split(' ')[0];
      if (!destinations.includes(arrivalCode)) {
        setArrivalLocation('Select arrival');
      }
    }
  }, [departureLocation, routes]);

  // Get selected route passenger count
  const getSelectedRoutePassengers = () => {
    if (departureLocation === 'Select departure' || arrivalLocation === 'Select arrival') {
      return undefined;
    }
    
    const departureCode = departureLocation.split(' ')[0];
    const arrivalCode = arrivalLocation.split(' ')[0];
    
    // Find the route
    const route = routes.find(r => 
      (r.from === departureCode && r.to === arrivalCode) || 
      (r.from === arrivalCode && r.to === departureCode)
    );
    
    return route?.passengerCount;
  };

  // Get selected route average fare
  const getSelectedRouteFare = () => {
    if (departureLocation === 'Select departure' || arrivalLocation === 'Select arrival') {
      return undefined;
    }
    
    const departureCode = departureLocation.split(' ')[0];
    const arrivalCode = arrivalLocation.split(' ')[0];
    
    // Find the route
    const route = routes.find(r => 
      (r.from === departureCode && r.to === arrivalCode) || 
      (r.from === arrivalCode && r.to === departureCode)
    );
    
    return route?.averageFare;
  };

  // Get airport name helper function
  const getAirportName = (code: string) => {
    const airports: {[key: string]: string} = {
      'ABQ': 'Albuquerque',
      'ATL': 'Atlanta',
      'AUS': 'Austin',
      'BNA': 'Nashville',
      'BOS': 'Boston',
      'BUR': 'Burbank',
      'BWI': 'Baltimore',
      'CLE': 'Cleveland',
      'CLT': 'Charlotte',
      'DAL': 'Dallas Love Field',
      'DCA': 'Washington Reagan',
      'DEN': 'Denver',
      'DFW': 'Dallas',
      'DTW': 'Detroit',
      'EWR': 'Newark',
      'FLL': 'Fort Lauderdale',
      'HOU': 'Houston Hobby',
      'IAD': 'Washington DC',
      'IAH': 'Houston',
      'JFK': 'New York JFK',
      'LAS': 'Las Vegas',
      'LAX': 'Los Angeles',
      'LGA': 'New York LaGuardia',
      'MCO': 'Orlando',
      'MDW': 'Chicago Midway',
      'MIA': 'Miami',
      'MSP': 'Minneapolis',
      'MSY': 'New Orleans',
      'OAK': 'Oakland',
      'ONT': 'Ontario',
      'ORD': 'Chicago',
      'PBI': 'West Palm Beach',
      'PDX': 'Portland',
      'PHL': 'Philadelphia',
      'PHX': 'Phoenix',
      'PVD': 'Providence',
      'RDU': 'Raleigh-Durham',
      'RSW': 'Fort Myers',
      'SAN': 'San Diego',
      'SAT': 'San Antonio',
      'SEA': 'Seattle',
      'SFO': 'San Francisco',
      'SJC': 'San Jose',
      'SLC': 'Salt Lake City',
      'SMF': 'Sacramento',
      'SNA': 'Santa Ana',
      'STL': 'St. Louis',
      'TPA': 'Tampa'
    };
    
    return airports[code] || code;
  };

  const handleDateChange = (range: { startDate: Date; endDate: Date }) => {
    setDateRange(range);
    console.log("Selected date range:", range);
  };

  const handleDepartureChange = (location: string) => {
    setDepartureLocation(location);
    console.log("Departure location changed to:", location);
    
    // Reset arrival when departure changes
    if (location === 'Select departure') {
      setArrivalLocation('Select arrival');
    }
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

  // Otherwise render the home page
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
              airports={airports}
              availableDestinations={availableDestinations}
              selectedRoutePassengers={getSelectedRoutePassengers()}
              selectedRouteFare={getSelectedRouteFare()}
              onDepartureChange={handleDepartureChange}
              onArrivalChange={handleArrivalChange}
              onSearch={handleSearch}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
