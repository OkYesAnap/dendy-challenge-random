import {useDispatch} from "react-redux";
import {ActionCreatorWithPayload} from "@reduxjs/toolkit";
import {ReactSetState} from "@/app/roulette/types";

interface UseDragAndDrop {
    setTextSlice: ActionCreatorWithPayload<string, "games/setValuesFromEditor">
    setTextEdit?: ReactSetState<string>
}

export const useDragAndDrop = ({setTextSlice, setTextEdit}: UseDragAndDrop) => {
    const dispatch = useDispatch();
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];

            if (file.type === 'text/plain') {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const text = event.target?.result as string;
                    if (setTextEdit) {
                        setTextEdit(text);
                    } else {
                        dispatch(setTextSlice(text));
                    }
                };
                reader.readAsText(file);
            } else {
                alert('Please use (.txt)');
            }
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };
    return {handleDrop, handleDragOver};
};