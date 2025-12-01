export type ReactSetState<T> = React.Dispatch<React.SetStateAction<T>>;

export interface Cols {
    id?: string;
    label: string;
    type?: string;
}

export interface Modals {
    openChoseModal: boolean;
    openInfoModal: boolean;
    openRouletteModal: boolean;
    openRoulette3dModal: boolean;
    openEditorModal: boolean;
}

export const defaultOpenModals = {
    openChoseModal: false,
    openInfoModal: false,
    openRouletteModal: false,
    openRoulette3dModal: false,
    openEditorModal: false,
};