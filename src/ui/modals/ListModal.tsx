import React, { type ChangeEvent } from 'react'
import {motion} from "framer-motion"
import { useCreateSubcriber } from '../../features/contacts/hooks/useSubsciber'
import type { CreateAudience } from '../../types/contacts/AudienceType'
import { Loader2 } from 'lucide-react'
interface ListModalProps  {
    newListName: CreateAudience
    handleChange : (e:ChangeEvent<HTMLInputElement>)=> void
    handleCreateList : (e: React.FormEvent) => void 
    setIsNewListModalOpen: (v: boolean)=> void
    isPending: boolean
}
const ListModal = ({newListName, handleChange, isPending,  handleCreateList, setIsNewListModalOpen}: ListModalProps) => {
 




  return (
     <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xl max-w-sm w-full space-y-4"
            >
              <div>
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">Spawn New Segment</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Initialize an isolated node stack database repository.</p>
              </div>

              <form onSubmit={handleCreateList} className="space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">List Designation Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., Lagos Operations Trunk List"
                    value={newListName.name}
                    onChange={ handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#004aad]/10 focus:border-[#004aad] transition-all"
                  />
                </div>

                <div className="flex justify-end gap-1.5 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsNewListModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-[#004aad] hover:bg-[#003985] text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shadow-sm shadow-[#004aad]/10"
                  >
                    {isPending ? <Loader2 className='animate-spin'/> : "Generate Segment"}
                   
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
  )
}

export default ListModal
