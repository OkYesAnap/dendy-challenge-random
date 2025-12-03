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
    const r = angle < 0 ? angle % TWO_PI : TWO_PI - angle % TWO_PI;
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
            let newSpeed = state.rotationSpeed;
            if (newSpeed < 0) { newSpeed *= -1;}
            if (newSpeed > 50) {
                newSpeed -= 1;
            } else if (newSpeed > 40) {
                newSpeed -= 0.8;
            }else if (newSpeed > 30) {
                newSpeed -= 0.6;
            }else if (newSpeed > 20) {
                newSpeed -= 0.4;
            } else if (newSpeed > 10) {
                newSpeed -= 0.2;
            } else if (newSpeed > 1) {
                newSpeed -= 0.01;
            } else {
                newSpeed = Number((newSpeed - 0.001).toFixed(4));
            }
            if (state.rotationSpeed < 0) { newSpeed *= -1;}
            state.rotationSpeed = newSpeed;
        },
        setRotationSpeed(state: Roulette3dState, action: PayloadAction<number>) {
            state.rotationSpeed = action.payload;
        },
        setSlotEdgeAngles(state: Roulette3dState, action: PayloadAction<SlotEdgeAngle[]>) {
            state.slotEdgeAngles = action.payload;
        },
        setCurrentGame(state: Roulette3dState, action: PayloadAction<number>) {
            const currentArrowAngle = wrapRadians(action.payload);
            const diff = Math.PI * 2 / state.slotEdgeAngles.length;
            const getGame = state.slotEdgeAngles.find(slot => currentArrowAngle < slot.edgeAngle + diff);
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