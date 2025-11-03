import {getAllGamesList} from "@/redux/slices/gamesSlice";
import {useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/redux/store";
import {useCallback} from "react";
import {GoogleSheetsParams} from "@/utils/getGamesList";
import {ReactSetState} from "@/app/roulette/types";

export const useHandleLoad = ({paramsRef, setOpenChoseModal}: {
    paramsRef: React.RefObject<GoogleSheetsParams>,
    setOpenChoseModal: ReactSetState<boolean>
}) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    return useCallback(() => {
        const {range, url, header} = paramsRef.current;
        router.push(`?range=${range}&header=${header}&url=${url}`);
        dispatch(getAllGamesList(paramsRef.current));
        setOpenChoseModal(false);
    }, [dispatch, router,  paramsRef, setOpenChoseModal])
}