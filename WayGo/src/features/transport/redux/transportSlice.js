import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNearbyBusStops, fetchLiveDepartures } from '../../../api/transportApi';
import { saveFavorites, getFavorites } from '../../../utils/storage';

const initialState = {
  busStops: [],
  liveDepartures: [],
  selectedStop: null,
  favorites: [],
  loading: false,
  error: null,
};

export const loadFavorites = createAsyncThunk('transport/loadFavorites', async () => {
  const stored = await getFavorites();
  return stored;
});

export const fetchBusStops = createAsyncThunk(
  'transport/fetchBusStops',
  async ({ lat, lon }, { rejectWithValue }) => {
    try {
      const stops = await fetchNearbyBusStops({ lat, lon });
      return stops;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBusStopDetails = createAsyncThunk(
  'transport/fetchBusStopDetails',
  async (atcocode, { rejectWithValue }) => {
    try {
      const departures = await fetchLiveDepartures(atcocode);
      return departures;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleFavoriteStop = createAsyncThunk(
  'transport/toggleFavoriteStop',
  async (stop, { getState }) => {
    const { favorites } = getState().transport;
    const exists = favorites.some((item) => item.atcocode === stop.atcocode);
    const updatedFavorites = exists
      ? favorites.filter((item) => item.atcocode !== stop.atcocode)
      : [...favorites, stop];

    await saveFavorites(updatedFavorites);
    return updatedFavorites;
  }
);

const transportSlice = createSlice({
  name: 'transport',
  initialState,
  reducers: {
    setSelectedStop(state, action) {
      state.selectedStop = action.payload;
    },
    clearTransportState(state) {
      state.busStops = [];
      state.liveDepartures = [];
      state.selectedStop = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusStops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusStops.fulfilled, (state, action) => {
        state.loading = false;
        state.busStops = action.payload;
      })
      .addCase(fetchBusStops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to load bus stops';
      })
      .addCase(fetchBusStopDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusStopDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.liveDepartures = action.payload;
      })
      .addCase(fetchBusStopDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to load departures';
      })
      .addCase(toggleFavoriteStop.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload || [];
      });
  },
});

export const { setSelectedStop, clearTransportState } = transportSlice.actions;

export default transportSlice.reducer;

