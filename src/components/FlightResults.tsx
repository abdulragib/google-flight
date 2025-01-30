import React from 'react';
import { format } from 'date-fns';
import { Plane } from 'lucide-react';
import { FlightResult } from '../types/flight';

interface FlightResultsProps {
  flights: FlightResult[];
  loading: boolean;
  origin?: string;
  destination?: string;
}

export default function FlightResults({ flights, loading, origin, destination }: FlightResultsProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  console.log("flight results", flights);
  if (flights.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No flights found. Try different search criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>From: <span className="font-semibold">{origin}</span></div>
          <Plane className="w-4 h-4 text-gray-400" />
          <div>To: <span className="font-semibold">{destination}</span></div>
        </div>
      </div>

      {flights.map((flight) => (
        <div key={flight.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-lg font-semibold">{flight.airline}</div>
              <div className="text-sm text-gray-500">Flight {flight.flightNumber}</div>
            </div>
            <div className="text-xl font-bold">{flight.price}</div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex-1">
              <div className="text-lg font-medium">
                {format(new Date(flight.departureTime), 'HH:mm')}
              </div>
              <div className="text-sm text-gray-500">
                {format(new Date(flight.departureTime), 'MMM d')}
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-[200px] flex items-center">
                <div className="h-[2px] flex-1 bg-gray-300"></div>
                <Plane className="w-5 h-5 mx-2 text-blue-600" />
                <div className="h-[2px] flex-1 bg-gray-300"></div>
              </div>
            </div>

            <div className="flex-1 text-right">
              <div className="text-lg font-medium">
                {format(new Date(flight.arrivalTime), 'HH:mm')}
              </div>
              <div className="text-sm text-gray-500">
                {format(new Date(flight.arrivalTime), 'MMM d')}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <div>Duration: {flight.duration}</div>
            <div>{flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
