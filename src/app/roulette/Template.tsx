import {useRouter, useSearchParams} from "next/navigation";
import {templates, UrlParams} from "@/app/roulette/constants/urlParams";
import {useEffect, useState} from "react";

const Template: React.FC = () => {
    const searchParams = useSearchParams();
    const [url, setUrl] = useState<string>('');
    const router = useRouter();
    useEffect(() => {
        setUrl(searchParams.get("url") || '');
    }, [setUrl, searchParams]);

    const handleTemplateClick = (template: UrlParams) => {
        const {range, url, header} = template;
        router.push(`?range=${range}&header=${header}&url=${url}`);
        setUrl(url);
    }

    return (
        <div className="text-2xl flex flex-col text-center p-5 border-3 bg-black rounded w-full">
            <div className="text-4xl">Templates</div>
            {templates.map(
                (item: UrlParams) => (
                    <div
                        className={`w-full m-1 border-1 hover:bg-gray-700 cursor-pointer ${item.url === url ? 'bg-gray-700' : ''}`}
                        key={item.hint} onClick={() => handleTemplateClick(item)}>
                        {item.hint}
                    </div>
                )
            )}
        </div>
    )
}
export default Template;