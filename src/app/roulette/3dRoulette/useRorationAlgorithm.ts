import {useEffect, useRef} from "react";
import {finalSpeed} from "@/app/roulette/3dRoulette/threeConstants";
import {increaseDecreaseRotationSpeed, rotationSpeed as sRotationSpeed} from "@/redux/slices/roulette3dSlice";
import {useDispatch, useSelector} from "react-redux";

const useRorationAlgorithm = () => {
    const dispatch = useDispatch();
    const rotationSpeed = useSelector(sRotationSpeed);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
    useEffect(() => {
        if (rotationSpeed !== finalSpeed) {
            timerRef.current = setTimeout(() => {
                dispatch(increaseDecreaseRotationSpeed());
            }, 25);
        }
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [rotationSpeed, dispatch]);
};

export default useRorationAlgorithm;