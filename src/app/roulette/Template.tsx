import {useRouter, useSearchParams} from "next/navigation";
import {templates, UrlParams} from "@/app/roulette/constants/urlParams";
import {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {setValuesFromEditor} from "@/redux/slices/gamesSlice";

const Template: React.FC = () => {
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const [url, setUrl] = useState<string>('');
    const router = useRouter();
    const fmRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setUrl(searchParams.get("url") || '');
    }, [setUrl, searchParams]);

    const handleTemplateClick = (template: UrlParams) => {
        const {range, url, header} = template;
        router.push(`?range=${range}&header=${header}&url=${url}`);
        setUrl(url);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                dispatch(setValuesFromEditor(text));
            };
            reader.readAsText(file);
        }
    };

    const handleOpenFileManager = () => {
        fmRef.current?.click();
    };

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
            <div className="text-4xl mx-auto mt-2 p-2 border cursor-pointer hover:bg-gray-700" onClick={handleOpenFileManager}>📂</div>
            <input
                ref={fmRef}
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
};
export default Template;