import { useState } from "react"
import {
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  ChevronLeft,
  PhoneCall,
  Mail
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from "@mui/material"
import { AnimatePresence } from "framer-motion"
import SenderIdModal from "../../ui/modals/SenderId"
import { useGetAllSenderIds } from "../../features/senderId/hooks/useSenderIds"

export default function SenderId() {
  const [activeTab, setActiveTab] = useState<"sms" | "email">("sms")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(0)
  const pageSize = 5

  const { data } = useGetAllSenderIds(page, pageSize)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  // Status Chip Helper
  const getStatusChip = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "verified":
        return (
          <Chip
            icon={<CheckCircle2 size={14} className="text-emerald-600" />}
            label={status}
            className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium"
            size="small"
          />
        )
      case "pending":
        return (
          <Chip
            icon={<Clock size={14} className="text-amber-600" />}
            label="Pending"
            className="bg-amber-50 text-amber-700 border border-amber-200 font-medium"
            size="small"
          />
        )
      case "rejected":
      case "failed":
        return (
          <Chip
            icon={<XCircle size={14} className="text-rose-600" />}
            label="Rejected"
            className="bg-rose-50 text-rose-700 border border-rose-200 font-medium"
            size="small"
          />
        )
      default:
        return <Chip label={status || "Unknown"} size="small" />
    }
  }

  const senderIds = data?.content || []
  const totalPages = data?.totalPages || 1
  const isFirstPage = data?.first ?? true
  const isLastPage = data?.last ?? true

  return (
    <main className="flex flex-col w-full h-auto p-6 max-w-6xl mx-auto gap-6">
      
      {/* Top Header & Context Description */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Sender Identities
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-xl">
            Manage your verified phone Sender IDs for SMS broadcasts and custom email domains for outgoing campaigns.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="whitespace-nowrap bg-[#004aad] hover:bg-[#003985] text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#004aad]/40"
        >
          <Plus size={18} />
          {activeTab === "sms" ? "Request SMS ID" : "Add Email Domain"}
        </button>
      </div>

      {/* Tab Switcher (SMS Phone vs Email Domains) */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
        <button
          onClick={() => setActiveTab("sms")}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === "sms"
              ? "bg-[#004aad]/10 text-[#004aad]"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <PhoneCall size={14} />
          <span>SMS Sender IDs (Phone)</span>
        </button>

        <button
          onClick={() => setActiveTab("email")}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === "email"
              ? "bg-[#004aad]/10 text-[#004aad]"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <Mail size={14} />
          <span>Email Sender Domains</span>
        </button>
      </div>

      {/* Tab 1: SMS Sender IDs View */}
      {activeTab === "sms" && (
        <>
          {senderIds.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
              <p className="text-center text-gray-400 max-w-xs text-sm">
                No SMS Sender IDs registered. Click "Request SMS ID" to send messages to phone devices.
              </p>
            </div>
          ) : (
            <TableContainer component={Paper} elevation={0} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <Table sx={{ minWidth: 650 }} aria-label="SMS sender id table">
                <TableHead className="bg-gray-50/70 border-b border-gray-200">
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Sender ID</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Use Case</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Date Requested</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }} align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {senderIds.map((row: any) => (
                    <TableRow key={row.id} className="hover:bg-gray-50/50 transition-colors last:border-0">
                      <TableCell className="font-semibold text-gray-900" sx={{ fontSize: '0.875rem' }}>
                        {row.senderId}
                      </TableCell>
                      <TableCell className="text-gray-600" sx={{ fontSize: '0.875rem' }}>
                        {row.companyName}
                      </TableCell>
                      <TableCell className="text-gray-500 max-w-[200px] truncate" sx={{ fontSize: '0.875rem' }}>
                        {row.useCaseSample}
                      </TableCell>
                      <TableCell className="text-gray-500" sx={{ fontSize: '0.875rem' }}>
                        {row.createdAt}
                      </TableCell>
                      <TableCell align="right">
                        {getStatusChip(row.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-3 px-4 pb-4 mt-2">
                  <span className="text-xs text-gray-400">
                    Page {page + 1} of {totalPages}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage(prev => Math.max(0, prev - 1))}
                      disabled={isFirstPage}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPage(prev => prev + 1)}
                      disabled={isLastPage}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </TableContainer>
          )}
        </>
      )}

      {/* Tab 2: Email Sending Domains View */}
      {activeTab === "email" && (
        <TableContainer component={Paper} elevation={0} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <Table sx={{ minWidth: 650 }} aria-label="email sender domain table">
            <TableHead className="bg-gray-50/70 border-b border-gray-200">
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Domain</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>DKIM Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>SPF Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Added Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }} align="right">Deliverability</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow className="hover:bg-gray-50/50 transition-colors">
                <TableCell className="font-semibold text-gray-900" sx={{ fontSize: '0.875rem' }}>
                  app.pingstack.com
                </TableCell>
                <TableCell className="text-gray-600" sx={{ fontSize: '0.875rem' }}>
                  Verified
                </TableCell>
                <TableCell className="text-gray-600" sx={{ fontSize: '0.875rem' }}>
                  Verified
                </TableCell>
                <TableCell className="text-gray-500" sx={{ fontSize: '0.875rem' }}>
                  2026-07-10
                </TableCell>
                <TableCell align="right">
                  {getStatusChip("Approved")}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal Handler with AnimatePresence */}
      <AnimatePresence>
        {isModalOpen && (
          <SenderIdModal onClose={handleCloseModal} />
        )}
      </AnimatePresence>

    </main>
  )
}