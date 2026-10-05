import React, { useState, useRef, useEffect, useCallback } from "react";
import SquareButton from "@/app/roulette/SquareButton";

interface TimerButtonProps {
    value: number;           // current countdown value (live during spin)
    inputValue: string;      // the user-set timer input string
    onChangeInput: (val: string) => void;
    active: boolean;         // true when maxSpinMode is on (countdown running)
    spinning: boolean;       // true while wheel is still rotating (hasn't fully stopped yet)
    hint: string;
}

const TimerButton: React.FC<TimerButtonProps> = ({
    value,
    inputValue,
    onChangeInput,
    active,
    spinning,
    hint
}) => {
    const [editing, setEditing] = useState(false);
    const [editVal, setEditVal] = useState(inputValue);
    const inputRef = useRef<HTMLInputElement>(null);

    // Keep editVal in sync when not editing
    useEffect(() => {
        if (!editing) {
            setEditVal(inputValue);
        }
    }, [inputValue, editing]);

    // Focus input when edit mode opens
    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editing]);

    const commitEdit = useCallback(() => {
        const parsed = parseInt(editVal, 10);
        const clamped = !isNaN(parsed) ? Math.min(120, Math.max(0, parsed)) : 0;
        onChangeInput(clamped.toString());
        setEditing(false);
    }, [editVal, onChangeInput]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                commitEdit();
            } else if (e.key === "Escape") {
                setEditVal(inputValue);
                setEditing(false);
            }
        },
        [commitEdit, inputValue],
    );

    const handleSave = useCallback(() => {
        commitEdit();
    }, [commitEdit]);
    const parsedInput = parseInt(inputValue, 10);
    const displayValue = active && value > 0
        ? value
        : parsedInput === 0
            ? "Timer Off"
            : spinning
                ? 0
                : parsedInput;

    if (editing) {
        return (
            <SquareButton icon={
            <div className="flex items-center justify-center">
                <input
                    ref={inputRef}
                    type="number"
                    min="0"
                    max="120"
                    value={editVal}
                    onChange={(e) => setEditVal(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className="w-10 bg-transparent text-white text-sm outline-none text-center [appearance:textfield]"
                    title="Spin duration in seconds (0 = unlimited)"
                />
            </div>}
            />
        );
    }

    return (
        <SquareButton
            icon={<div className="flex items-center justify-center"><span className="text-sm font-mono">{displayValue}</span></div>}
            active={active}
            hint={hint}
            onClickButton={() => setEditing(true)}
        />
    );
};

export default TimerButton;
