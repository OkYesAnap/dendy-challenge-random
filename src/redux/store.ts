import { configureStore } from '@reduxjs/toolkit';
import gamesReducer from './slices/gamesSlice';

const store = configureStore({
    reducer: {
        games: gamesReducer,
    },
});

export default store;