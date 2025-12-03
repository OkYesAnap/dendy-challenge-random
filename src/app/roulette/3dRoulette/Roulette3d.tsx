"use client";
import {Canvas} from '@react-three/fiber';
import {useDispatch, useSelector} from "react-redux";
import {slotsList as sSlotsList} from "@/redux/slices/gamesSlice";
import ModalPortal from "@/components/ModalPortal";
import SquareButton from "@/app/roulette/SquareButton";
import {current3dSlot as sCurrent3dSlot, increaseDecreaseRotationSpeed} from "@/redux/slices/roulette3dSlice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRotateLeft, faRotateRight} from "@fortawesome/free-solid-svg-icons";
import ThreeMainCanvas from "@/app/roulette/3dRoulette/ThreeMainCanvas";

interface Roulette3dProps {
    isOpen: boolean;
    onClose: () => void;
}

const Roulette3d: React.FC<Roulette3dProps> = ({isOpen, onClose}) => {
    const allGamesList = useSelector(sSlotsList);
    const current3dSlot = useSelector(sCurrent3dSlot);
    const dispatch = useDispatch();
    return (
        <ModalPortal {...{isOpen, onClose}}>
            <div className="w-[75vw] h-[80vh] border flex flex-col items-center">
                <span>Develop in Progress!</span>
                <Canvas camera={{position: [0, allGamesList.length / 3, 0], fov: 40}}>
                    <ThreeMainCanvas/>
                </Canvas>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                    <div
                        className="bg-black/70 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-4 shadow-2xl flex flex-col items-center justify-center">
                        <p className="text-white text-lg font-medium text-center">
                            {current3dSlot.formattedValue}
                        </p>
                        <div className={'flex-row'}>
                        <SquareButton
                            icon={<FontAwesomeIcon icon={faRotateRight} />}
                            onClickButton={() => {
                                dispatch(increaseDecreaseRotationSpeed(1));
                            }}
                        />
                        <SquareButton
                            icon={<FontAwesomeIcon icon={faRotateLeft} />}
                            onClickButton={() => {
                                dispatch(increaseDecreaseRotationSpeed(-1));
                            }}
                        />
                        </div>
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
};

export default Roulette3d;