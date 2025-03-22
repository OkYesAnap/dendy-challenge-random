import ModalPortal from "@/components/ModalPortal";
import Image from "next/image";

interface InfoProps {
    isOpen: boolean;
    onClose: () => void;
    infoData: string[];
}

const isImageUrl = (data: string) => {
    const pattern = /^(https?:\/\/).+\.(jpg|jpeg|png|gif|bmp|webp)$/i;
    return pattern.test(data);
};

const Info: React.FC<InfoProps> = ({ isOpen, infoData, onClose }) => {
    return <ModalPortal {...{ isOpen, onClose }}>{infoData.map((item, i) => {
        return i ? (
            <div key={`${infoData[0]}-${i}`}> {isImageUrl(item) ? (
                <Image
                    src={item}
                    alt={infoData[1]}
                    width={0}
                    height={0}
                    className="w-full h-auto" />)
                : <div className="max-w-100 border p-2 whitespace-pre-wrap">
                    {item}
                </div>}
            </div>) : null;
    })}</ModalPortal>
}

export default Info;