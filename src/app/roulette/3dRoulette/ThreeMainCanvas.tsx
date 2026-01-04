import {FC} from "react";
import ThreeSpinningWheel from "@/app/roulette/3dRoulette/ThreeSpinningWheel";
import ThreeArrow from "@/app/roulette/3dRoulette/ThreeArrow";
import {OrbitControls} from "@react-three/drei";
import {useSelector} from "react-redux";
import {slotsList as sSlotsList} from "@/redux/slices/gamesSlice";

const ThreeMainCanvas: FC = () => {
    const allGamesList = useSelector(sSlotsList);
    return (
        <>
            <directionalLight
                position={[3, 5, 3]}
                intensity={1.5}
            />
            <directionalLight
                position={[3, 5, -3]}
                intensity={0.4}
            />
            <ThreeSpinningWheel/>
            <ThreeArrow/>
            <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={5}
                maxDistance={allGamesList.length < 10 ? 10 : allGamesList.length}
                minPolarAngle={0}
                maxPolarAngle={Math.PI}
                target={[0, 2.5, 0]}
            />
        </>
    );
};
export default ThreeMainCanvas;