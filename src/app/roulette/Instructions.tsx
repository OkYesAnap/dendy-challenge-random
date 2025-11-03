import {GoogleSheetsParams} from "@/utils/getGamesList";
import {ChoseParamsModalProps} from "@/app/roulette/types";

const Instructions = (
    {
        paramsRef,
        handleLoad,
        onClose
    }: Partial<ChoseParamsModalProps>) => {
    const handleChangeGoogleParams = (params: Partial<GoogleSheetsParams>) => {
        paramsRef!.current = {...paramsRef!.current, ...params}
    }

    return (<div className="text-2xl flex flex-col text-center p-5 border-3 bg-black rounded w-full">
            <div>
                Please provide the Google Sheets URL and specify the RANGE, ensuring that the fields are not
                empty.
            </div>
            <div className="mt-4 font-bold">
                IMPORTANT: Please use the direct URL from your browser, NOT the share link!
            </div>
            <table className="w-full border-collapse border border-gray-300">
                <tbody>
                <tr className="border">
                    <td className="w-1/12 border p-2 text-center align-middle">
                        URL:
                    </td>
                    <td colSpan={2} className="w-11/12 border p-2 text-center align-middle">
                        <input
                            onChange={(e) => handleChangeGoogleParams({url: e.target.value})}
                            className="w-full bg-gray-700 p-1 text-center"
                            type="text"
                            defaultValue={paramsRef!.current.url}
                        />
                    </td>
                </tr>
                <tr className="border">
                    <td className="w-1/12 border p-2 text-center align-middle">
                        Range:
                    </td>
                    <td className="w-3/12 border p-2 text-center align-middle">
                        <input
                            onChange={(e) => handleChangeGoogleParams({range: e.target.value})}
                            className="w-full bg-gray-700 p-1 text-center"
                            type="text"
                            defaultValue={paramsRef!.current.range}
                        />
                    </td>
                    <td className="w-8/12 text-left pl-3">
                        <input
                            className="scale-150 mr-3"
                            type="checkbox"
                            onChange={(e) => {
                                handleChangeGoogleParams({header: e.target.checked});
                            }}
                            defaultChecked={paramsRef!.current.header}
                        />
                        <span>HEADER - first line will be skipped as Header</span>
                    </td>
                </tr>
                </tbody>
            </table>
            <div className="flex flex-row border p-2 items-center">
                <button className="flex-1 mr-2 p-1 border" onClick={() => handleLoad!()}>Load</button>
                <button className="flex-1 mr-2 p-1 border" onClick={onClose}>Cancel</button>
            </div>
        </div>
    )
}

export default Instructions;