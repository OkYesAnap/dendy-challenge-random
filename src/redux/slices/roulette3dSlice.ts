import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CellData} from "@/utils/getGamesList";
import {defaultCellData} from "@/redux/slices/gamesSlice";

export interface SlotEdgeAngle {
    formattedValue: string;
    edgeAngle: number
}

interface Roulette3dState {
    rotationSpeed: number;
    slotEdgeAngles: Array<SlotEdgeAngle>
    currentSlot: CellData;
}

const initialState: Roulette3dState = {
    rotationSpeed: 0,
    slotEdgeAngles: [],
    currentSlot: defaultCellData
};

const TWO_PI = Math.PI * 2;

function wrapRadians(angle: number): number {
    const r = angle % TWO_PI;
    return Math.abs((r) % TWO_PI);
}

const rouletteSlice = createSlice({
    name: 'roulette3d',
    initialState,
    reducers: {
        increaseDecreaseRotationSpeed(state: Roulette3dState, action: PayloadAction<number | undefined>) {
            if (action.payload !== undefined) {
                state.rotationSpeed += action.payload;
            }
            if (state.rotationSpeed > 50) {
                state.rotationSpeed -= 1;
            } else if (state.rotationSpeed > 20) {
                state.rotationSpeed -= 0.4;
            } else if (state.rotationSpeed > 10) {
                state.rotationSpeed -= 0.2;
            } else if (state.rotationSpeed > 1) {
                state.rotationSpeed -= 0.02;
            } else {
                state.rotationSpeed -= 0.001;
            }
        },
        setRotationSpeed(state: Roulette3dState, action: PayloadAction<number>) {
            state.rotationSpeed = action.payload;
        },
        setSlotEdgeAngles(state: Roulette3dState, action: PayloadAction<SlotEdgeAngle[]>) {
            state.slotEdgeAngles = action.payload;
        },
        setCurrentGame(state: Roulette3dState, action: PayloadAction<number>) {
            const currentArrowAngle = wrapRadians(action.payload);
            // const getDiff = Math.PI / 180 * state.slotEdgeAngles.length;
            const getGame = state.slotEdgeAngles.find(slot => currentArrowAngle < slot.edgeAngle);
            state.currentSlot = {formattedValue: getGame?.formattedValue || ""};
        }
    }
});

export const {
    setRotationSpeed,
    increaseDecreaseRotationSpeed,
    setSlotEdgeAngles,
    setCurrentGame
} = rouletteSlice.actions;

export const rotationSpeed = (state: { roulette3d: Roulette3dState }) => state.roulette3d.rotationSpeed;
export const slotEdgeAngles = (state: { roulette3d: Roulette3dState }) => state.roulette3d.slotEdgeAngles;
export const current3dSlot = (state: { roulette3d: Roulette3dState }) => state.roulette3d.currentSlot;

export default rouletteSlice.reducer;