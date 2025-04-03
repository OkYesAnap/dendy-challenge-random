import ModalPortal from "@/components/ModalPortal"
import { GoogleSheetsParams } from "@/utils/getGamesList";
import { useEffect } from "react";

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
    useEffect(() => { }, [paramsRef.current.header])

    return (<ModalPortal {...{ isOpen, onClose }}>
        <div className="flex flex-col text-gray-100">
            <div className="flex flex-row border p-2 items-center">
                <span className="w-1/6">URL:</span>
                <input onChange={(e) => handleChangeGoogleParams({ url: e.target.value })}
                    className="flex-1 bg-gray-700 p-1" type="text" defaultValue={paramsRef.current.url} />
            </div>
            <div className="flex flex-row border p-2 items-center">
                <span className="w-1/6">Range:</span>
                <input onChange={(e) => handleChangeGoogleParams({ range: e.target.value })}
                    className="flex-1 bg-gray-700 p-1" type="text" defaultValue={paramsRef.current.range} />
            </div>
            <div className="flex flex-row border p-2 items-center">
                <input className="ml-1 rounded border transform scale-150" type="checkbox" onChange={(e) => {
                    handleChangeGoogleParams({ header: e.target.checked })
                }}
                    defaultChecked={paramsRef.current.header}
                />
                <span className="flex-1 mr-2 pl-2">HEADER - first line will be skipped as Header</span>
            </div>
            <div className="flex flex-row border p-2 items-center">
                <button className="flex-1 mr-2 p-1 border" onClick={() => handleLoad()}>Load</button>
                <button className="flex-1 mr-2 p-1 border" onClick={onClose}>Cancel</button>
            </div>
        </div>
    </ModalPortal>)
}
export default ChoseParamsModal;