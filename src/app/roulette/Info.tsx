import ModalPortal from "@/components/ModalPortal";
import Image from "next/image";

interface InfoProps {
    headers: string[];
    infoData: string[];
    isOpen: boolean;
    onClose: () => void;
}

const isImageUrl = (data: string) => {
    const pattern = /^(https?:\/\/).+\.(jpg|jpeg|png|gif|bmp|webp)$/i;
    return pattern.test(data);
};

const Info: React.FC<InfoProps> = ({ headers, infoData, isOpen, onClose }) => {
    return <ModalPortal {...{ isOpen, onClose }}>{infoData.map((item, i) => {
        return i > 0 ? (
            <div 
            key={`${infoData[0]}-${i}`} 
            className="flex items-center justify-center border">
                {headers[i] && <div className="text-2xl font-bold pl-2 pr-2">{headers[i]}:</div>}
                <div> {isImageUrl(item) ? (
                    <Image
                        src={item}
                        alt={infoData[1]}
                        width={100}
                        height={100}
                        className="w-full" />)
                    : <div className="text-xl p-2">
                        {item}
                    </div>}
                </div>
            </div>) : null;
    })}</ModalPortal>
}

export default Info;