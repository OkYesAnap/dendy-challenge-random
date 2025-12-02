"use client";
import {Canvas} from '@react-three/fiber';
import ThreeDynamicTable from "@/app/roulette/3dRoulette/ThreeDynamicTable";
import {useDispatch, useSelector} from "react-redux";
import {slotsList as sSlotsList} from "@/redux/slices/gamesSlice";
import ModalPortal from "@/components/ModalPortal";
import {OrbitControls} from "@react-three/drei";
import ThreeArrow from "@/app/roulette/3dRoulette/ThreeArrow";
import SquareButton from "@/app/roulette/SquareButton";
import {current3dSlot as sCurrent3dSlot, increaseDecreaseRotationSpeed} from "@/redux/slices/roulette3dSlice";

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
                <Canvas camera={{position: [0, allGamesList.length / 2, allGamesList.length / 2], fov: 50}}>
                    <ambientLight/>
                    <ThreeDynamicTable/>
                    <ThreeArrow/>
                    <OrbitControls
                        enablePan={true}
                        enableZoom={true}
                        enableRotate={true}
                        minDistance={5}
                        maxDistance={allGamesList.length}
                        minPolarAngle={0}
                        maxPolarAngle={Math.PI}
                        autoRotate={false}
                        autoRotateSpeed={1}
                        target={[0, 0, 0]}
                    />
                </Canvas>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                    <div
                        className="bg-black/70 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-4 shadow-2xl flex flex-col items-center justify-center">
                        <p className="text-white text-lg font-medium text-center">
                            {current3dSlot.formattedValue}
                        </p>
                        <SquareButton
                            icon={"!!!"}
                            onClickButton={() => {
                                dispatch(increaseDecreaseRotationSpeed(5));
                            }}
                        />
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
};

export default Roulette3d;