import ModalPortal from "@/components/ModalPortal"
import { GoogleSheetsParams } from "@/redux/slices/gamesSlice";

interface ChoseParamsModalProps {
    isOpen: boolean;
    onClose: () => void;
    paramsRef: React.RefObject<GoogleSheetsParams>
    handleLoad: () => void;
}

const ChoseParamsModal: React.FC<ChoseParamsModalProps> = ({
    isOpen,
    onClose,
    paramsRef,
    handleLoad }) => {

    const handleChangeGoogleParams = (params: Partial<GoogleSheetsParams>) => {
        paramsRef.current = { ...paramsRef.current, ...params }
    }

    return (<ModalPortal {...{ isOpen, onClose }}>
        <div className="flex flex-col">
            <div className="flex flex-row border p-2 items-center">
                <span className="flex-1">URL:</span>
                <input onChange={(e) => handleChangeGoogleParams({ url: e.target.value })}
                    className="flex-1 bg-gray-700 p-1" type="text" defaultValue={paramsRef.current.url} />
            </div>
            <div className="flex flex-row border p-2 items-center">
                <span className="flex-1 mr-2 pt-1">Range:</span>
                <input onChange={(e) => handleChangeGoogleParams({ range: e.target.value })}
                    className="flex-1 bg-gray-700 p-1" type="text" defaultValue={paramsRef.current.range} />
            </div>
            <div className="flex flex-row border p-2 items-center">
                <button className="flex-1 mr-2 p-1 border" onClick={() => handleLoad()}>Load</button>
                <button className="flex-1 mr-2 p-1 border" onClick={onClose}>Cancel</button>
            </div>
        </div>
    </ModalPortal>)
}
export default ChoseParamsModal;