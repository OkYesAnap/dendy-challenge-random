import Roulette from "@/app/roulette/Roulette";
import ChoseUrlParamsModal from "@/app/roulette/ChoseUrlParamsModal";
import SquareButton from "@/app/roulette/SquareButton";
import Info from "@/app/roulette/Info";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-regular-svg-icons";
import {Modals} from "@/app/roulette/types";
import {CellData, GoogleSheetsParams} from "@/utils/getGamesList";
import {useSelector} from "react-redux";
import {loading as sLoading} from "@/redux/slices/gamesSlice";
import Editor from "@/app/Editor";

const ModalManager = ({openModals, updateOpenModal, paramsRef, infoData, handleLoad, elementPos}: {
    openModals: Modals,
    updateOpenModal: (openModal: Partial<Modals>) => void
    paramsRef: React.RefObject<GoogleSheetsParams>
    infoData: CellData[];
    handleLoad: () => void;
    elementPos: DOMRect | undefined;
}) => {
    const loading = useSelector(sLoading);

    return (
        <>
            {openModals.openRouletteModal && <Roulette {...{setOpenRoll: () => updateOpenModal({openRouletteModal: false})}} />}
            <ChoseUrlParamsModal {...{
                isOpen: openModals.openChoseModal,
                handleLoad,
                onClose: (() => updateOpenModal({openChoseModal: false})),
                paramsRef,
                startPos: elementPos,
                startElement: <SquareButton icon={"📥"}/>
            }} />
            <Info {...{
                infoData,
                isOpen: openModals.openInfoModal,
                onClose: (() => updateOpenModal({openInfoModal: false})),
                startElement: <FontAwesomeIcon icon={faPlusSquare}/>,
                startPos: elementPos,
            }} />
            <Editor {...{
                isOpen: openModals.openEditorModal,
                onClose: (() => updateOpenModal({openEditorModal: false})),
                startElement: <SquareButton icon={"️️🖊️"}/>,
                startPos: elementPos,
            }} />
            {loading && (
                <div
                    className="fixed max-h-[85%] text-4xl left-1/2 transform p-10 -translate-x-1/2 top-1/2 -translate-y-[50%] border-3 bg-black rounded">
                    Loading List
                </div>)
            }
        </>);
};
export default ModalManager;