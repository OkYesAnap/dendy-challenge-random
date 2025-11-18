import ModalPortal from "@/components/ModalPortal";
import Template from "@/app/roulette/Template";
import Instructions from "@/app/roulette/Instructions";
import {ChoseParamsModalProps} from "@/app/roulette/types";
import {useState} from "react";

const ChoseUrlParamsModal: React.FC<ChoseParamsModalProps> = (
    {
        isOpen,
        onClose,
        paramsRef,
        handleLoad,
        startPos,
        startElement
    }) => {

    const [isCustomLoad, setIsCustomLoad] = useState<boolean>(false);

    return (<ModalPortal {...{isOpen, onClose, startPos, startElement}}>
        <div className="flex flex-col text-gray-100">
            <div className="p-3 text-3xl w-auto border-2 hover:bg-gray-700 cursor-pointer"
                 onClick={() => setIsCustomLoad(prev => !prev)}>{isCustomLoad ? 'Load Templates' : 'Custom Load'}
            </div>
            {isCustomLoad ? <Instructions {...{paramsRef, handleLoad, onClose}}/> : <Template/>}
        </div>
    </ModalPortal>);
};
export default ChoseUrlParamsModal;