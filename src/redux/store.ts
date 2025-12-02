import { configureStore } from '@reduxjs/toolkit';
import gamesReducer from './slices/gamesSlice';
import roulette3dSlice from "@/redux/slices/roulette3dSlice";

const store = configureStore({
    reducer: {
        games: gamesReducer,
        roulette3d: roulette3dSlice
    },
});


export type AppDispatch = typeof store.dispatch;
export default store;