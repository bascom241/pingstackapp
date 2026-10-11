import carton from "../../../assets/empty.png"


interface EmptyCartonStateProps {
    isOpen: boolean
    setIsOpen:(val: boolean) => void
}

const EmptyCartonState = ({isOpen, setIsOpen}: EmptyCartonStateProps) => {
    return (
        <main className="flex items-center justify-center w-full mt-16">
            <div className="flex flex-col items-center gap-2">
                <img
                    src={carton}
                    className="w-36 h-36"

                />

                <h1 className=" text-center sm:text-start font-bold sm:text-2xl text-xl"> You have not created any email campaigns yet</h1>
                <h2 className=" text-center sm:text-start text-[12px] sm:text-base">Click on "Create campaign" and start designing your first email campaign.</h2>
                <button
                    type="button"
                    className="w-[60%] md:w-[50%] sm:w-[35%] mt-2 bg-[#004aad] hover:bg-blue-700 text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-sm shadow-blue-900/10 flex items-center justify-center gap-2 group cursor-pointer"

                    onClick={()=> setIsOpen(true )}
                >
                    Create campaign
                </button>
            </div>
        </main>
    )
}

export default EmptyCartonState