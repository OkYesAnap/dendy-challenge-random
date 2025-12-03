import {FC} from "react";
import ThreeDynamicTable from "@/app/roulette/3dRoulette/ThreeDynamicTable";
import ThreeArrow from "@/app/roulette/3dRoulette/ThreeArrow";
import {OrbitControls} from "@react-three/drei";
import {useSelector} from "react-redux";
import {slotsList as sSlotsList} from "@/redux/slices/gamesSlice";

const ThreeMainCanvas: FC = () => {
    const allGamesList = useSelector(sSlotsList);
    return (
        <>
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
                target={[0, 0, 0]}
            />
        </>
    );
};
export default ThreeMainCanvas;