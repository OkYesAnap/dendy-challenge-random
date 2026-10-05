import {useEffect, useRef} from "react";
import {finalSpeed} from "@/app/roulette/3dRoulette/threeConstants";
import {increaseDecreaseRotationSpeed, rotationSpeed as sRotationSpeed, rotationOptions as sRotationOptions} from "@/redux/slices/roulette3dSlice";
import {useDispatch, useSelector} from "react-redux";

const useRorationAlgorithm = () => {
    const dispatch = useDispatch();
    const rotationSpeed = useSelector(sRotationSpeed);
    const rotationOptions = useSelector(sRotationOptions);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
    useEffect(() => {
        if (rotationSpeed !== finalSpeed && !rotationOptions.maxSpinMode) {
            timerRef.current = setTimeout(() => {
                dispatch(increaseDecreaseRotationSpeed());
            }, 25);
        }
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [rotationSpeed, rotationOptions.maxSpinMode, dispatch]);
};

export default useRorationAlgorithm;