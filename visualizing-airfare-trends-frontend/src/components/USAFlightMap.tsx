import React, { useState, useEffect } from 'react';
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  Line, 
  Marker 
} from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import './USAFlightMap.css';

// USA TopoJSON
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Airport coordinates [longitude, latitude]
const airportCoordinates: { [key: string]: [number, number] } = {
  'SFO': [-122.3795, 37.6213],
  'LAX': [-118.4085, 33.9416],
  'JFK': [-73.7781, 40.6413],
  'LGA': [-73.8740, 40.7769],
  'ORD': [-87.9073, 41.9742],
  'MIA': [-80.2870, 25.7951],
  'DFW': [-97.0403, 32.8998],
  'DEN': [-104.6737, 39.8561],
  'SEA': [-122.3088, 47.4502],
  'BOS': [-71.0062, 42.3656],
  'ATL': [-84.4277, 33.6407],
  'IAD': [-77.4565, 38.9531],
  'PHX': [-112.0115, 33.4352]
};

// Scale for line thickness based on popularity
const popularityScale = scaleLinear()
  .domain([0, 10])
  .range([1, 3]);

// Predefined popular routes
const popularRoutes = [
  { from: 'SFO', to: 'JFK', popularity: 10 },
  { from: 'LAX', to: 'ORD', popularity: 8 },
  { from: 'DFW', to: 'MIA', popularity: 7 },
  { from: 'SEA', to: 'DEN', popularity: 6 },
  { from: 'BOS', to: 'ATL', popularity: 9 },
  { from: 'ORD', to: 'LGA', popularity: 10 },
  { from: 'ATL', to: 'IAD', popularity: 5 },
  { from: 'PHX', to: 'SEA', popularity: 4 },
  { from: 'SFO', to: 'DEN', popularity: 8 },
  { from: 'LGA', to: 'MIA', popularity: 7 }
];

interface FlightRoute {
  from: string;
  to: string;
  popularity: number;
  selected?: boolean;
}

interface USAFlightMapProps {
  selectedDeparture: string;
  selectedArrival: string;
  onRouteSelect?: (departure: string, arrival: string) => void;
}

const USAFlightMap: React.FC<USAFlightMapProps> = ({ 
  selectedDeparture, 
  selectedArrival, 
  onRouteSelect 
}) => {
  const [routes, setRoutes] = useState<FlightRoute[]>(popularRoutes);
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);
  
  // Extract airport codes from the full location strings
  const getDepartureCode = () => selectedDeparture.split(' ')[0];
  const getArrivalCode = () => selectedArrival.split(' ')[0];

  // Update selected route when departure or arrival changes
  useEffect(() => {
    const departureCode = getDepartureCode();
    const arrivalCode = getArrivalCode();
    
    setRoutes(prevRoutes => 
      prevRoutes.map(route => ({
        ...route,
        selected: (route.from === departureCode && route.to === arrivalCode) ||
                  (route.from === arrivalCode && route.to === departureCode)
      }))
    );
  }, [selectedDeparture, selectedArrival]);

  const handleRouteClick = (route: FlightRoute) => {
    if (onRouteSelect) {
      onRouteSelect(`${route.from} (${getAirportName(route.from)})`, 
                    `${route.to} (${getAirportName(route.to)})`);
    }
  };

  const getAirportName = (code: string) => {
    const airports: {[key: string]: string} = {
      'SFO': 'San Francisco',
      'LAX': 'Los Angeles',
      'JFK': 'New York JFK',
      'LGA': 'New York LaGuardia',
      'ORD': 'Chicago',
      'MIA': 'Miami',
      'DFW': 'Dallas',
      'DEN': 'Denver',
      'SEA': 'Seattle',
      'BOS': 'Boston',
      'ATL': 'Atlanta',
      'IAD': 'Washington DC',
      'PHX': 'Phoenix'
    };
    
    return airports[code] || code;
  };

  return (
    <div className="usa-flight-map">
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{ scale: 1000 }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#EAEAEC"
                stroke="#D6D6DA"
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none", cursor: "default" },
                  pressed: { outline: "none" }
                }}
                pointerEvents="none"
              />
            ))
          }
        </Geographies>

        {/* Flight routes */}
        {routes.map((route) => {
          // Only draw if both airports exist
          if (airportCoordinates[route.from] && airportCoordinates[route.to]) {
            const routeId = `${route.from}-${route.to}`;
            const isHovered = hoveredRoute === routeId;
            const isSelected = route.selected;
            
            return (
              <Line
                key={routeId}
                from={airportCoordinates[route.from]}
                to={airportCoordinates[route.to]}
                stroke={isSelected ? "#FF0000" : "#0066FF"}
                strokeWidth={isHovered ? popularityScale(route.popularity) + 1 : popularityScale(route.popularity)}
                strokeLinecap="round"
                className="flight-route"
                onMouseEnter={() => setHoveredRoute(routeId)}
                onMouseLeave={() => setHoveredRoute(null)}
                onClick={() => handleRouteClick(route)}
                style={{ cursor: 'pointer' }}
              />
            );
          }
          return null;
        })}

        {/* Airport markers */}
        {Object.entries(airportCoordinates).map(([code, coordinates]) => {
          const departureCode = getDepartureCode();
          const arrivalCode = getArrivalCode();
          const isSelected = code === departureCode || code === arrivalCode;
          
          return (
            <Marker key={code} coordinates={coordinates}>
              <circle
                r={isSelected ? 6 : 4}
                fill={isSelected ? "#FF0000" : "#0066FF"}
                stroke="#fff"
                strokeWidth={2}
                className="airport-marker"
              />
              <text
                textAnchor="middle"
                y={-10}
                style={{
                  fontFamily: "system-ui",
                  fontSize: "10px",
                  fontWeight: isSelected ? "bold" : "normal",
                  fill: "#333"
                }}
              >
                {code}
              </text>
            </Marker>
          );
        })}
      </ComposableMap>
      
      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: "#0066FF" }}></div>
          <span>Available Routes</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: "#FF0000" }}></div>
          <span>Selected Route</span>
        </div>
      </div>
    </div>
  );
};

export default USAFlightMap;
