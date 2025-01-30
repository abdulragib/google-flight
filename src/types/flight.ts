export interface Airport {
  id: string;
  name: string;
  cityName: string;
  countryName: string;
  iata: string;
}

export interface FlightSearch {
  origin: Airport | null;
  destination: Airport | null;
  departureDate: string;
  returnDate?: string;
  adults: number;
  cabinClass: 'economy' | 'business' | 'first';
}

export interface FlightResult {
  id: string;
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  stops: number;
}