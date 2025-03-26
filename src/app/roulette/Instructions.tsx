const Instructions: React.FC = () => (
    <div className="fixed max-h-[85%] text-2xl left-1/2 transform p-10 -translate-x-1/2 top-1/2 -translate-y-[50%] border-3 bg-black rounded">
        <div>
            Please provide the Google Sheets URL and specify the RANGE, ensuring that the fields are not empty.
        </div>
        <div className="mt-4 font-bold">
            IMPORTANT: Please use the direct URL from your browser, NOT the share link!
        </div>
    </div>
);

export default Instructions;