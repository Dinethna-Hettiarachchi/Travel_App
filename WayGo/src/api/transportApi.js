const BASE_URL = 'https://transportapi.com/v3/uk';

const APP_ID = process.env.EXPO_PUBLIC_TRANSPORT_APP_ID || 'YOUR_APP_ID';
const APP_KEY = process.env.EXPO_PUBLIC_TRANSPORT_APP_KEY || 'YOUR_APP_KEY';

const buildQuery = (params) =>
  Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

const mockStops = [
  {
    atcocode: '490008660N',
    name: 'Strand / Savoy Street',
    distance: 120,
    indicator: 'Stop X',
    locality: 'London',
  },
  {
    atcocode: '490009333W',
    name: 'Waterloo Station',
    distance: 340,
    indicator: 'Stop F',
    locality: 'London',
  },
  {
    atcocode: '490000098E',
    name: 'Piccadilly Circus',
    distance: 450,
    indicator: 'Stop A',
    locality: 'London',
  },
  {
    atcocode: '490000103S',
    name: 'Oxford Circus',
    distance: 580,
    indicator: 'Stop C',
    locality: 'London',
  },
  {
    atcocode: '490000234N',
    name: 'King\'s Cross Station',
    distance: 720,
    indicator: 'Stop M',
    locality: 'London',
  },
  {
    atcocode: '490000567W',
    name: 'Victoria Station',
    distance: 890,
    indicator: 'Stop D',
    locality: 'London',
  },
];

const mockDepartures = [
  {
    line: '24',
    destination: 'Pimlico',
    expected: '3 mins',
    status: 'On time',
  },
  {
    line: '15',
    destination: 'Tower Hill',
    expected: '7 mins',
    status: 'On time',
  },
  {
    line: '11',
    destination: 'Liverpool Street',
    expected: '12 mins',
    status: 'On time',
  },
  {
    line: '23',
    destination: 'Westbourne Park',
    expected: '15 mins',
    status: 'Delayed',
  },
  {
    line: '88',
    destination: 'Parliament Hill Fields',
    expected: '18 mins',
    status: 'On time',
  },
];

export const fetchNearbyBusStops = async ({ lat, lon }) => {
  const query = buildQuery({
    type: 'bus_stop',
    lat,
    lon,
    app_id: APP_ID,
    app_key: APP_KEY,
  });

  try {
    const response = await fetch(`${BASE_URL}/places.json?${query}`);
    if (!response.ok) {
      throw new Error('Unable to fetch bus stops');
    }
    const data = await response.json();
    return data?.member || mockStops;
  } catch (error) {
    return mockStops;
  }
};

export const fetchLiveDepartures = async (atcocode) => {
  const query = buildQuery({
    app_id: APP_ID,
    app_key: APP_KEY,
  });

  try {
    const response = await fetch(`${BASE_URL}/bus/stop/${atcocode}/live.json?${query}`);
    if (!response.ok) {
      throw new Error('Unable to fetch live departures');
    }
    const data = await response.json();
    const departures = Object.values(data?.departures || {}).flat();
    return departures.map((item) => ({
      line: item.line,
      destination: item.direction || item.destination_name,
      expected: item.expected_departure_time || item.best_departure_estimate,
      status: item.status || item.departure_status || 'On time',
    }));
  } catch (error) {
    return mockDepartures;
  }
};

