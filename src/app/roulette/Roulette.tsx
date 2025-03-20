import {
    rollOneStep,
    shuffle,
    beginEvent as sBeginEvent,
} from "@/redux/slices/gamesSlice";
import * as motion from "motion/react-client"
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const slotHeight = 16;

const intervals = { min: 50, max: 2000, step: 5 };

const Roulette: React.FC<{ setOpenRoll: () => void }> = ({ setOpenRoll }) => {
    const currentRolls = useSelector(sBeginEvent);
    const [start, setStart] = useState<boolean>(false);
    const [winSlot, setWinSlot] = useState<number>(0);
    const [rollStage, setRollStage] = useState<number>(0);
    const [halfListHeight, setHalfListHeight] = useState<number>(0);
    const rollIntervalRef = useRef<ReturnType<typeof setInterval>>(null);
    const rollTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

    const listRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (listRef.current) {
            const heightInPx = listRef.current.offsetHeight;
            setWinSlot(heightInPx);
            const listItemHeight = listRef.current.querySelector('li')?.offsetHeight || 1;
            const slot = Math.floor(heightInPx / listItemHeight / 2);
            setWinSlot(slot);
            const height = slot * listItemHeight + 10;
            setHalfListHeight(height);
        }
    }, [listRef, setWinSlot, setHalfListHeight, winSlot, dispatch]);

    useEffect(() => {


        if (start) {
            rollIntervalRef.current = setInterval(() => {
                dispatch(rollOneStep());
            }, intervals.min);
        }


        if (!start && rollStage) {
            if (rollIntervalRef.current) clearInterval(rollIntervalRef.current)
            if (rollTimeoutRef.current) clearInterval(rollTimeoutRef.current)
            rollTimeoutRef.current = setTimeout(() => {
                console.log(rollStage);
                dispatch(rollOneStep());
                setRollStage((prev) => prev = (prev + prev/20));
            }, rollStage);


            if (rollStage >= intervals.max - Math.random()*1000) {
                setRollStage(0);
            }
        }
        return () => {
            if (rollIntervalRef.current) clearInterval(rollIntervalRef.current)
            if (rollTimeoutRef.current) clearInterval(rollTimeoutRef.current)
        }
    }, [start, rollStage, dispatch]);

    const handleStart = () => {
        setStart(true);
    }
    const handleStopWithDelay = () => {
        setStart(false);
        setRollStage(1);
    }

    return (
        <div className="fixed inset-0 bg-black/80">
            <div
                ref={listRef}
                className="fixed max-h-[85%] text-xl left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-[56%] border-3 bg-black rounded overflow-hidden">
                <div style={{ top: `${halfListHeight}px` }} className={`absolute -right-5 bg-white w-10 h-10 rotate-[45deg] z-10`} />
                <div style={{ top: `${halfListHeight - 18}px` }} className={`absolute bg-white w-full h-2 z-10`} />
                <div style={{ top: `${halfListHeight + 50}px` }} className={`absolute bg-white w-full h-2 z-10`} />
                <div style={{ top: `${halfListHeight}px` }} className={`absolute -left-5 bg-white w-10 h-10 rotate-[45deg] z-10`} />
                <ul className="w-full flex flex-col">
                    {currentRolls.map((slot) => (
                        <motion.li
                            className={`border-t border-b h-${slotHeight} border-gray-300 p-4 text-center whitespace-nowrap overflow-ellipsis`}
                            key={slot}
                            layout
                            transition={{
                                default: { ease: "ease" },
                                layout: { duration: start || (!start && rollStage)? (rollStage) / 1000 : 5}
                            }}
                        >
                            {slot}
                        </motion.li>
                    ))}
                </ul>
            </div>
            <div className="fixed text-xl left-1/2 transform -translate-x-1/2 bottom-0 bg-black p-3 border rounded overflow-hidden">
                <button className="border border-gray-300 p-4 hover:bg-gray-700" onClick={() => dispatch(shuffle())}>
                    Shuffle
                </button>
                <button className="border border-gray-300 p-4 hover:bg-gray-700" onClick={setOpenRoll}>
                    Close
                </button>
                <button className={`border border-gray-300 p-4 ${start ? 'text-gray-600' : 'hover:bg-gray-700'}`}
                    disabled={start}
                    onClick={handleStart}>
                    Start
                </button>
                <button className={`border border-gray-300 p-4 ${!start ? 'text-gray-600' : 'hover:bg-gray-700'}`}
                    disabled={!start}
                    onClick={handleStopWithDelay}>
                    Stop
                </button>
            </div>
        </div>
    );
};
export default Roulette;