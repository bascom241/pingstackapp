

interface CampaignHeaderProps {
    isOpen: boolean
    setIsOpen:(val: boolean) => void
}
const CampaignHeader = ({ setIsOpen}: CampaignHeaderProps) => {


    return (
        <header className="sm:flex items-center justify-between w-full">
            <div>
                <p className="font-bold sm:text-3xl text-xl ">Campaigns</p>
            </div>

            <div>
                <button
                    type="button"
                    className=" w-full mt-2 bg-[#004aad] hover:bg-blue-700 text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-sm shadow-blue-900/10 hidden sm:flex items-center justify-center gap-2 group cursor-pointer"
                    onClick={() => setIsOpen(true)}
                >
                    Create campaign
                </button>
            </div>
        </header>
    )
}

export default CampaignHeader