# Google Flight 

## Project Setup

### 1. Clone the Repository
```sh
git clone https://github.com/abdulragib/google-flight.git
cd google-flight
```

### 2. Install Dependencies
```sh
yarn install
# or
npm install
```

### 3. Create an `.env` File
Create a `.env` file in the root directory and add the following environment variables:
```sh
VITE_API_BASE_URL=your_api_base_url
VITE_API_KEY=your_api_key
```

### 4. Start the Development Server
```sh
yarn dev
# or
npm run dev
```

### 5. Build for Production
```sh
yarn build
# or
npm run build
```

### 6. Run the Preview Server
```sh
yarn preview
# or
npm run preview
```

## Features
- Flight search functionality with origin, destination, departure & return dates.
- Select number of passengers and cabin class.
- Responsive and accessible UI with Tailwind CSS.

## Technologies Used
- Vite
- React
- TypeScript
- Tailwind CSS
- Lucide-react

## Components
- `SearchForm.tsx`: Handles flight search input fields.
- `AirportSearch.tsx`: Autocomplete airport search component.



