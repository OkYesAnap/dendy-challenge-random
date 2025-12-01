"use client";
import {Canvas} from '@react-three/fiber';
import DynamicCylinder from "@/app/roulette/DynamicCylinder";
import {useSelector} from "react-redux";
import {slotsList as sSlotsList} from "@/redux/slices/gamesSlice";
import ModalPortal from "@/components/ModalPortal";
import {OrbitControls} from "@react-three/drei";
import ThreeArrow from "@/app/roulette/ThreeArrow";

interface Roulette3dProps {
    isOpen: boolean;
    onClose: () => void;
}

const Roulette3d: React.FC<Roulette3dProps> = ({isOpen, onClose}) => {
    const allGamesList = useSelector(sSlotsList);

    return (
        <ModalPortal {...{isOpen, onClose}}>
            <div className="w-[75vw] h-[80vh] border flex flex-col items-center">
                <span>Develop in Progress!</span>
                <Canvas camera={{position: [0, allGamesList.length / 2, allGamesList.length / 2], fov: 50}}>
                    <ambientLight/>
                    <DynamicCylinder/>
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
            </div>
        </ModalPortal>
    );
};

export default Roulette3d;