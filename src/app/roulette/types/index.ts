import {GoogleSheetsParams} from "@/utils/getGamesList";
import {ReactNode} from "react";

export type ReactSetState<T> = React.Dispatch<React.SetStateAction<T>>;

export interface Cols {
    id?: string;
    label: string;
    type?: string;
}


export interface ChoseParamsModalProps {
    isOpen: boolean;
    onClose: () => void;
    paramsRef: React.RefObject<GoogleSheetsParams>
    handleLoad: () => void;
    startPos?: DOMRect,
    startElement?: ReactNode;
}

export interface Modals {
    openChoseModal: boolean;
    openInfoModal: boolean;
    openRouletteModal: boolean;
}

export const defaultOpenModals = {
    openChoseModal: false,
    openInfoModal: false,
    openRouletteModal: false,
};