import ModalPortal from "@/components/ModalPortal";
import {ReactNode, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {allData as sAllData, setValuesFromEditor} from "@/redux/slices/gamesSlice";
import {CellData} from "@/utils/getGamesList";
import {ReactSetState} from "@/app/roulette/types";

interface EditorProps {
    startPos?: DOMRect;
    isOpen: boolean;
    onClose: () => void;
    startElement?: ReactNode;
}

const heightChanger = (h: number, setter: ReactSetState<number>) => {
    setter(h * 2);
};

const widthChanger = (h: number, setter: ReactSetState<number>) => {
    setter(h * 0.75);
};

const Editor: React.FC<EditorProps> = ({isOpen, onClose, startElement, startPos}) => {

    const [textEdit, setTextEdit] = useState<string>("");

    const [height, setHeight] = useState<number>(1);
    const [width, setWidth] = useState<number>(1);
    const allData = useSelector(sAllData);
    const dispatch = useDispatch();

    useEffect(() => {
        const text = allData.reduce((collectText: string, item: CellData[]) => {
            return collectText + item[1].formattedValue + "\n";
        }, '');
        setTextEdit(text || '');
    }, [allData]);


    useEffect(() => {
        const currentTextArray = textEdit.split('\n');
        const lineLength = Math.max(...currentTextArray.map(str => str.length));
        widthChanger(lineLength, setWidth);
        if (currentTextArray.length < 24) {
            heightChanger(currentTextArray.length, setHeight);
        } else {
            heightChanger(24, setHeight);
        }
    }, [textEdit, allData, width]);

    return (
        <ModalPortal {...{isOpen, onClose, startPos, startElement}}>
            <div className="flex flex-col border-2 p-2">
            <textarea
                className="px-2"
                style={{height: `${height + 1}rem`, width: `${width + 4}rem`}}
                value={textEdit}
                onChange={(e) => {
                    setTextEdit(e.target.value);
                }}/>
                <button className="hover:bg-gray-700 cursor-pointer border w-full"
                        onClick={() => {
                            onClose();
                            dispatch(setValuesFromEditor(textEdit));
                        }}>Save
                </button>
            </div>
        </ModalPortal>
    );
};

export default Editor;