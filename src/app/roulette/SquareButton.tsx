import React, {useState, useRef, useEffect, JSX} from "react";

export const buttonsClasses = "flex-1 p-1 border text-3xl rounded-full w-15 h-15";

const SquareButton = ({
                          disabled = false,
                          icon,
                          onClickButton,
                          hint,
                          active,
                      }: {
    disabled?: boolean;
    icon: string | JSX.Element;
    onClickButton?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    hint?: string;
    active?: boolean;
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
                    : 'hover:brightness-70 transition duration-200'} ${
                    active ? 'bg-amber-700' : ''
                }`}
                disabled={disabled}
                onClick={onClickButton}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                ref={buttonRef}
            >
                {icon}
            </button>
            {showHint && hint && !disabled && (
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