import React, { useState } from "react";
import { searchFlights } from "./api/flightApi";
import { FlightSearch, FlightResult } from "./types/flight";
import SearchForm from "./components/SearchForm";
import FlightResults from "./components/FlightResults";

function App() {
  const [flights, setFlights] = useState<FlightResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [currentSearch, setCurrentSearch] = useState<{
    origin: string;
    destination: string;
  } | null>(null);

  const handleSearch = async (search: FlightSearch) => {
    if (!search.origin || !search.destination || !search.departureDate) {
      alert("Please fill in all required fields");
      return;
    }
  
    setLoading(true);
    setSearched(true);
    setCurrentSearch({
      origin: `${search.origin.cityName} (${search.origin.iata})`,
      destination: `${search.destination.cityName} (${search.destination.iata})`,
    });


    try {
      const response = await searchFlights({
        originSkyId: search.origin.iata,
        destinationSkyId: search.destination.iata,
        date: search.departureDate,
        adults: search.adults,
        cabinClass: search.cabinClass,
        originEntityId: search.origin.entityId,
        destinationEntityId: search.destination.entityId,
      });

      console.log("flight response data", response);
  
      // Check if itineraries is present in the response
      if (!response.data.itineraries[0] || response.data.itineraries[0].length === 0) {
        setFlights([]);
        alert("No flights found. Try different search criteria.");
        return;
      }
  
      // Map over the itineraries if they exist and are valid
      setFlights(response.data.itineraries.map((itinerary: any) => ({
        id: itinerary.id,
        airline: itinerary.legs[0].carriers.marketing[0]?.name || 'Unknown Airline', // Fallback if no carrier is present
        price: itinerary.price.formatted,
        departureTime: itinerary.legs[0]?.departure,
        arrivalTime: itinerary.legs[0]?.arrival,
        duration: `${Math.floor(itinerary.legs[0]?.durationInMinutes / 60)}h ${itinerary.legs[0]?.durationInMinutes % 60}m`,
        stops: itinerary.legs[0]?.stopCount || 0, // Default to 0 stops if not available
      })));

      console.log("flights demo", flights);
    } catch (error) {
      console.error("Error searching flights:", error);
      alert("An error occurred while searching for flights. Please try again.");
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Google Flight</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <SearchForm onSearch={handleSearch} />

        {searched && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Flight Results</h2>
            <FlightResults
              flights={flights}
              loading={loading}
              origin={currentSearch?.origin}
              destination={currentSearch?.destination}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
