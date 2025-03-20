import {
    beginEvent as sBeginEvent,
    currentSlot as sCurrentSlot,
    gamesInEvent as sGamesInEvent,
    allGamesList as sAllGamesList,
    resetStatistics,
    setCurrentSlot,
    setGamesInEvent,
    addSlots,
    addRoll,
}
    from "@/redux/slices/gamesSlice";
import React, { SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const RandomSlotControl = () => {
    const [blackSlotsCount, setBlackSlotsCount] = useState<number>(5);
    const [skipRolls, setSkipRolls] = useState<number>(0);
    const [autoDelay, setAutoDelay] = useState<number>(1000);
    const beginEvent = useSelector(sBeginEvent);
    const currentSlot = useSelector(sCurrentSlot);
    const gamesInEvent = useSelector(sGamesInEvent);
    const allGamesList = useSelector(sAllGamesList);
    const dispatch = useDispatch();
    const [zero, setZero] = useState<boolean>(true);
    const [auto, setAuto] = useState<boolean>(false);
    const timerForRandom = useRef<ReturnType<typeof setInterval>>(null);
    const timerForCurrentRoll = useRef<ReturnType<typeof setTimeout>>(null);
    useEffect(() => {
        const customSlots: string[] = [];
        if (blackSlotsCount) {
            for (let i = 0; i < blackSlotsCount; i++) {
                customSlots.push(`Black slot ${i + 1}`)
            }
        }
        if (zero) customSlots.push('Zero');
        dispatch(addSlots({ slots: customSlots }));
    }, [blackSlotsCount, zero, allGamesList, dispatch]);

    const handleCustom = () => {
        setRandom();
    }

    const randomCalculations = useCallback (() => {
        if (beginEvent.length) {
            dispatch(addRoll());
        } else {
            setAuto(false);
            dispatch(setCurrentSlot("Error all Games was rolled"));
        }

        if (timerForCurrentRoll.current) clearTimeout(timerForCurrentRoll.current);
        timerForCurrentRoll.current = setTimeout(() => {
            dispatch(setCurrentSlot(''));
        }, 1000);
    }, [beginEvent, dispatch])

    const setRandom = useCallback(() => {
        if (skipRolls > 0) {
            for (let i = 0; i < skipRolls; i++) {
                randomCalculations();
            }
        } else {
            randomCalculations();
        }
    }, [skipRolls, randomCalculations]);

    useEffect(() => {
        if (auto) {
            timerForRandom.current = setInterval(() => {
                setRandom();
            }, autoDelay);
        }
        return () => {
            if (timerForRandom.current) clearInterval(timerForRandom.current);
        }
    }, [auto, setRandom, autoDelay])

    const incrementBlackSlots = () => {
        setBlackSlotsCount(prevValue => prevValue + 1);
        setAuto(false);
    };

    const decrementBlackSlots = () => {
        setBlackSlotsCount(prevValue => Math.max(prevValue - 1, 0));
        setAuto(false);
    };

    const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<SetStateAction<number>>) => {
        const value = e.target.value;
        const min = 0;
        const max = 999999
        const numberValue = Number(value);
        if (!isNaN(numberValue) && numberValue >= min && numberValue <= max) {
            setter(numberValue);
        } else if (numberValue > max) {
            setter(max);
        }
        else if (value === '') {
            setter(0);
        }
    }

    return (
        <div>
            {currentSlot && (<div className="fixed text-xl left-1/2 transform -translate-x-1/2 bottom-30 bg-black p-4 border rounded">
                {currentSlot}
            </div>)}
            <div className="fixed bottom-0 left-1/2 transform items-center -translate-x-1/2 flex justify-between bg-black p-3 border">
                <div className={`flex-1 flex-col items-center text-center border pl-1 pr-1 ${auto ? 'text-gray-500' : ''}`}>
                    <div >Games in event</div>
                    <div className={`rounded border flex flex-row items-center ${auto ? 'text-gray-500' : ''}`}>
                        <button
                            disabled={auto}
                            onClick={() => dispatch(setGamesInEvent(gamesInEvent - 1))}
                            className={`text-white px-4 py-2 hover:bg-gray-700 border-r`}
                        >
                            -
                        </button>
                        <span className="px-4 hover:bg-gray-700">{gamesInEvent}</span>
                        <button
                            disabled={auto}
                            onClick={() => dispatch(setGamesInEvent(gamesInEvent + 1))}
                            className="text-white px-4 py-2 hover:bg-gray-700 border-l"
                        >
                            +
                        </button>
                    </div>
                </div>
                <div className={`flex-1 flex-col items-center text-center border pl-1 pr-1 ${auto ? 'text-gray-500' : ''}`}>
                    <div>ZERO</div>
                    <div className="p-2 border rounded">
                        <input
                            type="checkbox"
                            disabled={auto}
                            checked={zero}
                            className="p-2 rounded border transform scale-150"
                            onChange={(e) => {
                                setZero(e.target.checked);
                            }}
                        />
                    </div>
                </div>
                <div className={`flex-1 flex-col items-center text-center border pl-1 pr-1 ${auto ? 'text-gray-500' : ''}`}>
                    <div >Black fields</div>
                    <div className={`rounded border flex flex-row items-center ${auto ? 'text-gray-500' : ''}`}>
                        <button
                            onClick={decrementBlackSlots}
                            className="text-white px-4 py-2 hover:bg-gray-700 border-r"
                        >
                            -
                        </button>
                        <span className="px-4 hover:bg-gray-700">{blackSlotsCount}</span>
                        <button
                            onClick={incrementBlackSlots}
                            className="text-white px-4 py-2 hover:bg-gray-700 border-l"
                        >
                            +
                        </button>
                    </div>
                </div>
                <div className="flex-col items-center text-center border pl-1 pr-1">
                    <div>Generate</div>
                    <div className="flex flex-row">
                        <button disabled={auto} className={`border p-2  flex-1 ${auto ? 'text-gray-500' : ''}`} onClick={handleCustom}>Custom</button>
                        <button className="border p-2  flex-1" onClick={() => setAuto(!auto)}>{auto ? "Stop" : "Auto"}</button>
                        <button disabled={auto} className={`border p-2  flex-1 ${auto ? 'text-gray-500' : ''}`} onClick={() => dispatch(resetStatistics())}>Reset</button>
                    </div>
                </div>
                <div className="flex-col w-25 items-center text-center border pl-1 pr-1 max-w-fit">
                    <div>Auto Delay</div>
                    <div className="flex flex-row">
                        <input type="text" className="border p-2  flex-1 w-full" value={autoDelay} onChange={(e) => handleChangeText(e, setAutoDelay)} />
                    </div>
                </div>
                <div className="flex-col w-22 items-center text-center border pl-1 pr-1 max-w-fit">
                    <div>Skip Rolls</div>
                    <div className="flex flex-row">
                        <input type="text" className="border p-2  flex-1 w-full" value={skipRolls} onChange={(e) => handleChangeText(e, setSkipRolls)} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RandomSlotControl;