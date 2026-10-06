"use client";
import {Canvas} from '@react-three/fiber';
import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect, useRef} from "react";
import {addRoll, slotsList as sSlotsList} from "@/redux/slices/gamesSlice";
import ModalPortal from "@/components/ModalPortal";
import SquareButton from "@/app/roulette/SquareButton";
import {
    current3dSlot as sCurrent3dSlot,
    rotationOptions as sRotationOptions,
    rotationSpeed as sRotationSpeed,
    increaseDecreaseRotationSpeed,
    setSpinSwitcher, setCurrent3dSlot,
    setMaxSpinMode,
    setSpinTimer,
    decrementSpinTimer,
    spinTimer as sSpinTimer,
} from "@/redux/slices/roulette3dSlice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowDown,
    faDharmachakra,
    faRotateLeft,
    faRotateRight,
    faPowerOff,
    faWrench,
} from "@fortawesome/free-solid-svg-icons";
import ThreeMainCanvas from "@/app/roulette/3dRoulette/ThreeMainCanvas";
import useRorationAlgorithm from "@/app/roulette/3dRoulette/useRorationAlgorithm";
import {calcRandomAddRollTime} from "@/app/roulette/3dRoulette/utils";
import {finalSpeed} from "@/app/roulette/3dRoulette/threeConstants";
import TimerButton from "@/app/roulette/3dRoulette/TimerButton";

interface Roulette3dProps {
    isOpen: boolean;
    onClose: () => void;
}

const Roulette3d: React.FC<Roulette3dProps> = ({isOpen, onClose}) => {
    const allGamesList = useSelector(sSlotsList);
    const rotationSpeed = useSelector(sRotationSpeed);
    const current3dSlot = useSelector(sCurrent3dSlot);
    const rotationOptions = useSelector(sRotationOptions);
    const dispatch = useDispatch();
    const currentSlot = useSelector(sCurrent3dSlot);
    const spinTimerValue = useSelector(sSpinTimer);
    const [showSettings, setShowSettings] = useState(false);
    const [timerInput, setTimerInput] = useState<string>("0");
    const intervalRef = useRef<ReturnType<typeof setInterval>>(null);
    const countdownActiveRef = useRef(false);

    useRorationAlgorithm();

    // Timer countdown effect
    useEffect(() => {
        if (rotationOptions.maxSpinMode && spinTimerValue !== undefined && spinTimerValue > 0) {
            countdownActiveRef.current = true;
            intervalRef.current = setInterval(() => {
                dispatch(decrementSpinTimer());
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [rotationOptions.maxSpinMode, spinTimerValue, dispatch]);
    const clearRolledItem = () => {
        if (rotationSpeed === finalSpeed) {
            dispatch(addRoll(currentSlot.index ?? null));
            dispatch(setCurrent3dSlot({...currentSlot, index: null}));
        }
    };

    // Stop spin when timer reaches 0 (only if countdown was actually running)
    useEffect(() => {
        if (countdownActiveRef.current && rotationOptions.maxSpinMode && spinTimerValue !== undefined && spinTimerValue === 0) {
            countdownActiveRef.current = false;
            dispatch(setMaxSpinMode(false));
        }
    }, [spinTimerValue, rotationOptions.maxSpinMode, dispatch]);
    const {wheelSpin, arrowSpin} = rotationOptions;
    return (
        <ModalPortal {...{isOpen, onClose}}>
            <div className="w-[75vw] h-[80vh] border flex flex-col items-center bg-gray-700">
                <Canvas shadows camera={{position: [0, allGamesList.length > 30 ? allGamesList.length / 3 : 10, 0], fov: 40}}>
                    <ThreeMainCanvas/>
                </Canvas>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                    <div
                        className="bg-black/70 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-4 shadow-2xl flex flex-col items-center justify-center">
                        <div className={'flex flex-row gap-1'}>
                            <SquareButton
                                icon={<FontAwesomeIcon
                                    style={{
                                        color: rotationOptions.maxSpinMode ? '#ff0000' : undefined
                                    }}
                                    icon={faPowerOff} />}
                                active={rotationOptions.maxSpinMode}
                                hint="Start Stop/Spin"
                                onClickButton={() => {
                                    clearRolledItem();
                                    if (!rotationOptions.maxSpinMode) {
                                        dispatch(increaseDecreaseRotationSpeed(calcRandomAddRollTime()+5));
                                        const timerVal = parseInt(timerInput, 10);
                                        if (!isNaN(timerVal) && timerVal > 0) {
                                            dispatch(setSpinTimer(timerVal));
                                        }
                                    }
                                    dispatch(setMaxSpinMode(!rotationOptions.maxSpinMode));
                                }}
                            />
                            <TimerButton
                                value={spinTimerValue ?? 0}
                                inputValue={timerInput}
                                onChangeInput={setTimerInput}
                                active={rotationOptions.maxSpinMode ?? false}
                                spinning={rotationSpeed !== finalSpeed}
                                hint={rotationOptions.maxSpinMode ? "Countdown..." : "Click to change timer"}
                            />
                            <SquareButton
                                icon={<FontAwesomeIcon icon={faWrench}/>}
                                active={showSettings}
                                hint="Settings"
                                onClickButton={() => setShowSettings(p => !p)}
                            />
                            {showSettings && <>
                                <SquareButton
                                    icon={<FontAwesomeIcon icon={faRotateRight}/>}
                                    active={rotationSpeed > 0}
                                    hint="Spin Right"
                                    onClickButton={() => {
                                        clearRolledItem();
                                        dispatch(increaseDecreaseRotationSpeed(calcRandomAddRollTime()));
                                    }}
                                />
                                <SquareButton
                                    icon={<FontAwesomeIcon
                                        className={`animate-spin`}
                                        style={{
                                            animationDuration: '5s',
                                            animationDirection: rotationSpeed < 0 ? 'reverse' : '',
                                            animationPlayState: wheelSpin && rotationSpeed !==0 ? 'running' : 'paused'
                                        }}
                                        icon={faDharmachakra} />}
                                    active={wheelSpin}
                                    hint="Toggle Wheel Spin"
                                    onClickButton={() => {
                                        dispatch(setSpinSwitcher({wheelSpin: !wheelSpin}));
                                    }}
                                />
                                <SquareButton
                                    icon={<FontAwesomeIcon
                                        className={`animate-spin`}
                                        style={{
                                            animationDuration: '5s',
                                            animationDirection: rotationSpeed > 0 ? 'reverse' : '',
                                            animationPlayState: arrowSpin && rotationSpeed !==0 ? 'running' : 'paused'
                                    }}
                                        icon={faArrowDown} />}
                                    active={arrowSpin}
                                    hint="Toggle Arrow Spin"
                                    onClickButton={() => {
                                        dispatch(setSpinSwitcher({arrowSpin: !arrowSpin}));
                                    }}
                                />
                                <SquareButton
                                    icon={<FontAwesomeIcon icon={faRotateLeft}/>}
                                    active={rotationSpeed < 0}
                                    hint="Spin Left"
                                    onClickButton={() => {
                                        clearRolledItem();
                                        dispatch(increaseDecreaseRotationSpeed(-calcRandomAddRollTime()));
                                    }}
                                />
                            </>}
                        </div>
                    </div>
                </div>
                {rotationSpeed === finalSpeed && current3dSlot.formattedValue && <span className={"absolute border p-2 mt-1 bg-black"}>{current3dSlot.formattedValue}</span>}
            </div>
        </ModalPortal>
    );
};

export default Roulette3d;
