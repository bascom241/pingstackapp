import { Info } from "lucide-react"


interface ErrorCampaignProps {
    text: string 
}
const ErrorUI = ({text}: ErrorCampaignProps) => {


    const handleRefresh = () => {
        window.location.reload();
    };
    return (
        <main className="flex items-center justify-center w-full mt-16">
            <div className="flex flex-col items-center gap-2">
                <Info className="text-red-600" size={64} />

                <h1 className=" text-center sm:text-start font-bold sm:text-2xl text-xl"> oops, we have encoutered an issue Loading your {text}</h1>
                <h2 className=" text-center sm:text-start text-[12px] sm:text-base">Click on "Refresh Button" to Reload Your Data.</h2>
                <button
                    type="button"
                    className="w-[60%] md:w-[50%] sm:w-[35%] mt-2 bg-[#004aad] hover:bg-blue-700 text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-sm shadow-blue-900/10 flex items-center justify-center gap-2 group cursor-pointer"
                    onClick={handleRefresh}
                >
                    Refresh
                </button>
            </div>
        </main>
    )
}

export default ErrorUI

