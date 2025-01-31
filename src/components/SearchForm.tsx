import React, { useState } from "react";
import { Plane, Calendar, Users } from "lucide-react";
import { FlightSearch } from "../types/flight";
import AirportSearch from "./AirportSearch";

interface SearchFormProps {
  onSearch: (search: FlightSearch) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [search, setSearch] = useState<FlightSearch>({
    origin: null,
    destination: null,
    departureDate: "",
    returnDate: "",
    adults: 1,
    cabinClass: "economy",
  });

  // console.log("serach", search);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(search);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From
          </label>
          <AirportSearch
            placeholder="Origin airport"
            value={search.origin}
            onChange={(airport) => setSearch({ ...search, origin: airport })}
            icon={<Plane className="w-5 h-5" />}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To
          </label>
          <AirportSearch
            placeholder="Destination airport"
            value={search.destination}
            onChange={(airport) =>
              setSearch({ ...search, destination: airport })
            }
            icon={<Plane className="w-5 h-5" />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Departure
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={search.departureDate}
              onChange={(e) =>
                setSearch({ ...search, departureDate: e.target.value })
              }
              className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Return (Optional)
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={search.returnDate}
              onChange={(e) =>
                setSearch({ ...search, returnDate: e.target.value })
              }
              className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Passengers
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              min="1"
              max="9"
              value={search.adults}
              onChange={(e) =>
                setSearch({ ...search, adults: parseInt(e.target.value) })
              }
              className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="space-x-4">
          {["economy", "premium_economy", "business", "first"].map((cabin) => (
            <label key={cabin} className="inline-flex items-center">
              <input
                type="radio"
                value={cabin}
                checked={search.cabinClass === cabin}
                onChange={(e) =>
                  setSearch({
                    ...search,
                    cabinClass: e.target.value as FlightSearch["cabinClass"],
                  })
                }
                className="form-radio text-blue-600"
              />
              <span className="ml-2 capitalize">
                {cabin === "premium_economy" ? "Premium Economy" : cabin}
              </span>
            </label>
          ))}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Search Flights
        </button>
      </div>
    </form>
  );
}
