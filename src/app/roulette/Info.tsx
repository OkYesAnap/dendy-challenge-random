import ModalPortal from "@/components/ModalPortal";
import Image from "next/image";
import {ReactNode} from "react";
import {CellData} from "@/utils/getGamesList";
import {headers as sHeaders} from "@/redux/slices/gamesSlice";
import {useSelector} from "react-redux";

interface InfoProps {
    startPos?: DOMRect;
    infoData: CellData[];
    isOpen: boolean;
    onClose: () => void;
    startElement: ReactNode;
}

const isImageUrl = (data: string) => {
    const pattern = /^(https?:\/\/).+\.(jpg|jpeg|png|gif|bmp|webp)$/i;
    return pattern.test(data);
};


const Info: React.FC<InfoProps> = ({infoData, isOpen, onClose, startPos, startElement}) => {
    const headers = useSelector(sHeaders);
    return <ModalPortal {...{isOpen, onClose, startPos, startElement}}>
        {infoData.map((item, i) => {
            const direction = item.formattedValue?.length > 50 ? "flex-col" : "flex-row";
            return i > 0 && item.formattedValue ? (
                <div
                    key={`${infoData[0]}-${i}`}
                    className={`flex items-center justify-center py-2 px-4 border ${direction}`}>
                    {headers[i - 1] && !item.hyperlink &&
                        <div className="text-2xl font-bold">{headers[i - 1].label}:&nbsp;</div>}
                    <div> {isImageUrl(item.formattedValue) ? (
                            <Image
                                src={item.formattedValue}
                                alt={infoData[1].formattedValue}
                                width={100}
                                height={100}
                                className="w-full"/>)
                        : <div className="text-2xl">
                            {item.hyperlink ? (<a
                                    href={item.hyperlink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    {item.hyperlink}
                                </a>)
                                : item.formattedValue}
                        </div>}
                    </div>
                </div>) : null;
        })}</ModalPortal>;
};

export default Info;