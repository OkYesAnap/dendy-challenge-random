import {useRouter} from "next/navigation";
import {templates, UrlParams} from "@/app/roulette/utils/constants/urlParams";

const Template: React.FC = () => {
    const router = useRouter();

    const handleTemplateClick = (template: UrlParams) => {
        const {range, url, header} = template;
        router.push(`?range=${range}&header=${header}&url=${url}`);
    }

    return (
        <div className="text-2xl flex flex-col text-center p-5 border-3 bg-black rounded w-full">
            <div className="text-4xl">Templates</div>
            {templates.map(
                (item: UrlParams) => (
                    <div className="w-full m-1 border-1 hover:bg-gray-700 cursor-pointer"
                        key={item.hint} onClick={() => handleTemplateClick(item)}>
                        {item.hint}
                    </div>
                )
            )}
        </div>
    )
}
export default Template;