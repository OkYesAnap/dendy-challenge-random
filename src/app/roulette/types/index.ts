import {GoogleSheetsParams} from "@/utils/getGamesList";
import {ReactNode} from "react";

export type ReactSetState<T> = React.Dispatch<React.SetStateAction<T>>;

export interface Cols {
    id: string;
    label: string;
    type: string;
}


export interface ChoseParamsModalProps {
    isOpen: boolean;
    onClose: () => void;
    paramsRef: React.RefObject<GoogleSheetsParams>
    handleLoad: () => void;
    startPos?: DOMRect,
    startElement?: ReactNode;
}