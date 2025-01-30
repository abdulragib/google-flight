import React, { useState, useEffect, useRef } from "react";
import { searchAirports } from "../api/flightApi";
import { Airport } from "../types/flight";
import { Loader2 } from "lucide-react";

interface AirportSearchProps {
  placeholder: string;
  value: Airport | null;
  onChange: (airport: Airport | null) => void;
  icon?: React.ReactNode;
}

export default function AirportSearch({
  placeholder,
  value,
  onChange,
  icon,
}: AirportSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Airport[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout>();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchAirportsWithQuery = async () => {
      if (query.length < 2) {
        setResults([]);
        setError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log("Searching airports for:", query);
        const data = await searchAirports(query);

        // console.log('airports data--', data);

        if (data.airports) {
          console.log("airports data 0", data.airports);

          const tempData = data.airports
            .map((airport: any) => ({
              entityId: airport.entityId,
              cityName: airport.presentation?.title || "",
              countryName: airport.presentation?.subtitle || "",
              iata: airport.skyId || "",
            }));
           
          console.log("tempData", tempData);

          results.push(...tempData);
          console.log("results", results);
        } else {
          setResults([]);
          setError(
            "No airports found. Try searching for a city name or airport code."
          );
        }
      } catch (error) {
        setResults([]);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to search airports. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(searchAirportsWithQuery, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (!newQuery) {
      onChange(null);
    }
    setIsOpen(true);
    setError(null);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type="text"
          placeholder={placeholder}
          value={value ? `${value.cityName} (${value.iata})` : query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className={`w-full p-2 ${
            icon ? "pl-10" : ""
          } border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? "border-red-300" : ""
          }`}
          aria-label={placeholder}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="airport-search-results"
          aria-autocomplete="list"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>

      {isOpen && (query.length >= 2 || results.length > 0) && (
        <div
          id="airport-search-results"
          className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200"
          role="listbox"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Searching airports...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : results.length > 0 ? (
            <ul className="max-h-60 overflow-auto">
              {results.map((airport) => (
                <li
                  key={airport.entityId}
                  onClick={() => {
                    onChange(airport);
                    setQuery("");
                    setIsOpen(false);
                  }}
                  className="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  role="option"
                  aria-selected={value?.entityId === airport.entityId}
                >
                  <div className="font-medium text-gray-900">
                    {airport.cityName} ({airport.iata})
                  </div>
                  <div className="text-sm text-gray-500">
                    {airport.cityName}, {airport.countryName}
                  </div>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              No airports found. Try searching for a city name or airport code.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
