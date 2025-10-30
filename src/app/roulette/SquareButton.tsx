import {buttonsClasses} from "@/app/roulette/MainInfo";
import React from "react";

const SquareButton = ({disabled = false, icon, onClickButton}: {
    disabled?: boolean,
    icon: string,
    onClickButton: () => void
}) => {
    return (
        <button className={`${buttonsClasses} ${disabled
            ? 'text-gray-500 grayscale'
            : 'hover:bg-gray-700'}`}
                disabled={disabled}
                onClick={onClickButton}>
            {icon}
        </button>)
}

export default SquareButton;
