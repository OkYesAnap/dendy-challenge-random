import {buttonsClasses} from "@/app/roulette/MainInfo";
import React, {useState, useRef, useEffect} from "react";

const SquareButton = ({
                          disabled = false,
                          icon,
                          onClickButton,
                          hint,
                      }: {
    disabled?: boolean;
    icon: string;
    onClickButton?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    hint?: string;
}) => {
    const [showHint, setShowHint] = useState(false);
    const timeoutRef = useRef<number | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const handleMouseEnter = () => {
        if (hint) {
            timeoutRef.current = window.setTimeout(() => {
                setShowHint(true);
            }, 500);
        }
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setShowHint(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="relative inline-block">
            <button
                className={`${buttonsClasses} ${disabled
                    ? 'text-gray-500 grayscale'
                    : 'hover:bg-gray-700'}`}
                disabled={disabled}
                onClick={onClickButton}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                ref={buttonRef}
            >
                {icon}
            </button>
            {showHint && hint && !disabled &&  (
                <div
                    className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-black border border-gray-300 rounded px-2 py-1 text-sm shadow-lg z-10 whitespace-nowrap"
                >
                    {hint}
                </div>
            )}
        </div>
    );
};

export default SquareButton;