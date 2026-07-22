import React, { useEffect, useState, type ChangeEvent } from "react";
import { Users, Plus, Search, Filter, Upload, Trash2, MoreVertical, FileText, Loader2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import UploadCsv from "../../ui/modals/Upload";
import ListModal from "../../ui/modals/ListModal";
import { useGetAllAudience, useCreateAudience, AUDIENCE_QUERY_KEY } from "../../features/contacts/hooks/useAudience";
import { useGetAllSubscibers } from "../../features/contacts/hooks/useSubsciber";
import type { CreateAudience } from "../../types/contacts/AudienceType";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { getApiErrorMessage } from "../../utils/apiError";
import UploadSingleSubsciber from "../../ui/modals/UploadSingleSubsciber";


type Contact = {
  orderId: string;
  orderCreator: string 
  transactionNumber: string;

  status: "Subscribed" | "Unsubscribed" | "Bounced";
  createdAt: string;
};





export default function Contacts() {
  const [activeList, setActiveList] = useState<string>();
  const [idToFetch, setIdToFetch] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewListModalOpen, setIsNewListModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModaOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newListName, setNewListName] = useState<CreateAudience>({ name: "" });
  const [page, setPage] = useState(0);
  const pageSize = 3;
  const { enqueueSnackbar } = useSnackbar();

  const queryClient = useQueryClient()




  console.log(idToFetch)
const { data: subscriberData, isPending: loadingContent } = useGetAllSubscibers(
    idToFetch || "", 
    searchQuery, 
    page, 
    pageSize
  );

  

  // 2. Safely derive current contacts with a fallback array
  const currentContacts = subscriberData?.content ?? [];
  console.log(currentContacts)

  const { mutate, isPending: creatingAudience } = useCreateAudience();
  const { data, isPending, isError, error } = useGetAllAudience();


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewListName({ name: e.target.value });
  };

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newListName.name.trim()) return;
    mutate(newListName, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: AUDIENCE_QUERY_KEY });
        enqueueSnackbar("successfully uploaded", { variant: "success" });
        setNewListName({ name: "" });
        setIsNewListModalOpen(false);
        setActiveList(data.id);
      },
      onError: (error) => {
        const errorMessage = getApiErrorMessage(error, "Something went wrong");
        enqueueSnackbar(errorMessage || "Failed to create", {
          variant: "error",
        });
      },
    });
  };

  const handleToggleTabsAndSetIdToFetch = (id: string) => {
    setActiveList(id);
    setIdToFetch(id);
  };

  useEffect(() => {
    if (data && data.length > 0 && !activeList) {
      setActiveList(data[0].id);
      setIdToFetch(data[0].id);
    }
  }, [data, activeList]);


  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">

      {/* Upper Meta Info Framework */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Audience Directory</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your global telephone segments, coordinate dynamic lists, and verify delivery paths.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            onClick={() => setIsUploadModaOpen(true)}
          >
            <Upload size={14} />
            <span>Bulk Import CSV</span>
          </button>
          <button
            onClick={() => setIsNewListModalOpen(true)}
            className="flex-1 sm:flex-none bg-[#004aad] hover:bg-[#003985] text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-[#004aad]/10"
          >
            <Plus size={14} />
            <span>Create List</span>
          </button>
        </div>
      </div>

      {/* Main Structural Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

        {/* Left Aspect Sidepanel: Contact Directories/Lists */}
        <div className="lg:col-span-2 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Available Databases ({data?.length})
          </span>

          <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm space-y-1 max-h-[600px] overflow-y-auto scrollbar-none">
            {isPending && (
              <div className="w-full py-10 flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-500" size={50} />
              </div>
            )}


            {isError && !isPending && (
              <div className="w-full py-10 flex items-center justify-center">
                <p className="text-red-500 font-medium">Failed to fetch Audience List</p>
              </div>
            )}
            {
              !isPending && !isError && (
                <>
                  {data && data.length > 0 ? (data.map((list: any) => {
                    const isActive = activeList === list.id;

                    console.log(isActive)
                    return (
                      <button
                        key={list.id}
                        onClick={() => handleToggleTabsAndSetIdToFetch(list.id)}
                        className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${isActive
                          ? "bg-[#004aad]/5 border border-[#004aad]/10 text-[#004aad]"
                          : "bg-transparent border border-transparent text-gray-700 hover:bg-gray-50/80"
                          }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-[#004aad] text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                            <Users size={15} />
                          </div>
                          <div className="min-w-0 flex flex-col">
                            <span className={`text-xs font-bold truncate ${isActive ? 'text-[#004aad]' : 'text-gray-800'}`}>
                              {list.name}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                              Updated {list.updatedAt}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${list.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                            list.status === "Draft" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                              "bg-gray-100 text-gray-500"
                            }`}>
                            {list.totalCount.toLocaleString()}
                          </span>
                        </div>
                      </button>
                    );
                  })) : (<div className="w-full py-10 flex items-center justify-center">
                    <p className="text-gray-400 text-sm">No audience lists found.</p>
                  </div>)}
                </>
              )
            }

          </div>
        </div>

        {/* Right Aspect Workspace: Subscribers Deep-Dive Table View */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm min-w-0 flex flex-col min-h-[480px]">

          {/* Internal Actions Deck */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-50 mb-4">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Query name or telephone sequence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-2 text-xs text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#004aad]/10 focus:border-[#004aad] transition-all"
              />
            </div>

            <div className="flex items-center gap-2 justify-end">
              <button className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 cursor-pointer">
                <Filter size={14} />
              </button>
              <button 
                onClick={()=> setIsAddMemberOpen(true)}
              className="bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-colors">
                <Plus size={13} /> Add Member
              </button>
            </div>
          </div>

          {/* Core Table Viewport Framework */}
          <div className="flex-1 overflow-x-auto">
            {currentContacts.length === 0 ? (
              <div className="h-full py-20 flex flex-col items-center justify-center text-center px-4">
                <div className="p-3 bg-slate-50 rounded-2xl text-gray-300 mb-3 border border-gray-100">
                  <FileText size={24} />
                </div>
                <p className="text-xs font-bold text-gray-700">Database segment is vacant</p>
                <p className="text-[11px] text-gray-400 mt-0.5 max-w-[240px]">
                  No numbers mapped to this repository. Import a CSV stack or enter keys manually.
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Subscriber</th>
                    <th className="pb-3 font-semibold">Destination Number</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs text-gray-600 font-medium">
                  {currentContacts && currentContacts.length > 0 &&
                    currentContacts
                      .filter((c: Contact) => c.orderCreator.toLowerCase().includes(searchQuery.toLowerCase()) || c.transactionNumber.includes(searchQuery))
                      .map((contact: Contact) => (
                      <tr key={contact.orderId} className="hover:bg-gray-50/40 transition-colors group">
                        {/* Identity Pillar */}
                        <td className="py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-full bg-slate-100 text-gray-600 font-bold text-[10px] flex items-center justify-center uppercase shrink-0">
                              {contact.orderCreator.substring(0, 2)}
                            </div>
                            <span className="font-bold text-gray-800 truncate max-w-[120px]">{contact.orderCreator}</span>
                          </div>
                        </td>

                        {/* Number Pillar */}
                        <td className="py-3 font-mono text-[11px] text-gray-500">
                          {contact.transactionNumber}
                        </td>

                        {/* Status Marker Pillar */}
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${contact.status === "Subscribed" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                            contact.status === "Unsubscribed" ? "bg-gray-100 text-gray-500" :
                              "bg-rose-50 text-rose-700 border border-rose-100"
                            }`}>
                            {contact.status}
                          </span>
                        </td>

                        {/* Action Column Triggers */}
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 text-gray-400 hover:text-rose-600 rounded hover:bg-rose-50 cursor-pointer">
                              <Trash2 size={13} />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100 cursor-pointer">
                              <MoreVertical size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* Modern Centered Overlay Modal (Framer Motion Enhanced) */}
      <AnimatePresence>
        {isNewListModalOpen &&
          <ListModal
            newListName={newListName}
            handleCreateList={handleCreateList}
            handleChange={handleChange}
            setIsNewListModalOpen={setIsNewListModalOpen}
            isPending={creatingAudience}

          />
        }
      </AnimatePresence>

      <AnimatePresence>
        {
          isUploadModalOpen && (
            <UploadCsv
              setIsUploadModaOpen={setIsUploadModaOpen}
              selectedId={idToFetch}
            />
          )
        }
      </AnimatePresence>

      <AnimatePresence>
        {
          isAddMemberOpen && (
            <UploadSingleSubsciber
              setAdd={setIsAddMemberOpen}
              selectedId={idToFetch}
            />
          )
        }
      </AnimatePresence>

    </div>
  );
}