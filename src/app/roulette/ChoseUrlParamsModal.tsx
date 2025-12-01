import ModalPortal from "@/components/ModalPortal";
import Template from "@/app/roulette/Template";
import Instructions from "@/app/roulette/Instructions";
import {ReactNode, useState} from "react";
import {useDragAndDrop} from "@/app/roulette/hooks/useDragAndDrop";
import {setValuesFromEditor} from "@/redux/slices/gamesSlice";
import {GoogleSheetsParams} from "@/utils/getGamesList";

interface ChoseParamsModalProps {
    isOpen: boolean;
    onClose: () => void;
    paramsRef: React.RefObject<GoogleSheetsParams>
    handleLoad: () => void;
    startPos?: DOMRect,
    startElement?: ReactNode;
}

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
    const {handleDrop, handleDragOver} = useDragAndDrop({setTextSlice: setValuesFromEditor});


    return (<ModalPortal {...{isOpen, onClose, startPos, startElement}}>
        <div onDrop={handleDrop} onDragOver={handleDragOver} className="flex flex-col text-gray-100">
            <div className="p-3 text-3xl w-auto border-2 hover:bg-gray-700 cursor-pointer"
                 onClick={() => setIsCustomLoad(prev => !prev)}>{isCustomLoad ? 'Load Templates' : 'Custom Load'}
            </div>
            {isCustomLoad ? <Instructions {...{paramsRef, handleLoad, onClose}}/> : <Template/>}
        </div>
    </ModalPortal>);
};
export default ChoseUrlParamsModal;