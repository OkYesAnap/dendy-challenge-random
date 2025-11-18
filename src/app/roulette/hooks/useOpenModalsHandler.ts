import {Modals, ReactSetState} from "@/app/roulette/types";

export const useOpenModalsHandler = (setOpenModals: ReactSetState<Modals>) => {
    return (openModal: Partial<Modals>) => {
        setOpenModals(prev => ({...prev, ...openModal}));
    };
};