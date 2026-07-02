import { useState } from "react"
import { Plus, CheckCircle2, Clock, XCircle } from "lucide-react"
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
import SenderIdModal from "../../ui/modals/SenderId";

// Mock Data Structure
const mockSenderIds = [
    { id: 1, senderId: "Pingstack", company: "Pingstack Inc.", useCase: "OTP & Transactions", status: "Approved", date: "2026-07-02" },
    { id: 2, senderId: "PingAlert", company: "Pingstack Inc.", useCase: "Marketing campaigns", status: "Pending", date: "2026-07-01" },
    { id: 3, senderId: "SpammyId", company: "Unknown Corp", useCase: "Testing", status: "Rejected", date: "2026-06-28" },
];

const SenderId = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Replace this with your actual API state later
    const [senderIds] = useState(mockSenderIds); 

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    // Helper to style status badges cleanly
    const getStatusChip = (status: string) => {
        switch (status) {
            case "Approved":
                return <Chip icon={<CheckCircle2 size={14} className="text-emerald-600" />} label="Approved" className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium" size="small" />;
            case "Pending":
                return <Chip icon={<Clock size={14} className="text-amber-600" />} label="Pending" className="bg-amber-50 text-amber-700 border border-amber-200 font-medium" size="small" />;
            case "Rejected":
                return <Chip icon={<XCircle size={14} className="text-rose-600" />} label="Rejected" className="bg-rose-50 text-rose-700 border border-rose-200 font-medium" size="small" />;
            default:
                return <Chip label={status} size="small" />;
        }
    };

    return (
        <main className="flex flex-col w-full h-auto  p-6 max-w-6xl mx-auto gap-8">
            
            {/* Top Bar / Header Action Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full border-b border-gray-100 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Sender IDs</h1>
                    <p className="text-sm text-gray-500 mt-1 max-w-xl">
                        Approve your sender ID to push out SMS messages to your customers. Approved IDs are required to broadcast on Pingstack.
                    </p>
                </div>
                <button
                    onClick={handleOpenModal}
                    className="whitespace-nowrap bg-[#004aad] hover:bg-[#003985] text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#004aad]/40"
                >
                    <Plus size={18} />
                    Request New ID
                </button>
            </div>

            {/* Table Area or Empty State */}
            {senderIds.length === 0 ? (
                <div className="w-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                    <p className="text-center text-gray-400 max-w-xs text-sm">
                        No Sender IDs found. Click "Request New ID" to get started.
                    </p>
                </div>
            ) : (
                <TableContainer component={Paper} elevation={0} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <Table sx={{ minWidth: 650 }} aria-label="sender id management table">
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
                            {senderIds.map((row) => (
                                <TableRow 
                                    key={row.id} 
                                    className="hover:bg-gray-50/50 transition-colors last:border-0"
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell className="font-semibold text-gray-900" sx={{ fontSize: '0.875rem' }}>
                                        {row.senderId}
                                    </TableCell>
                                    <TableCell className="text-gray-600" sx={{ fontSize: '0.875rem' }}>
                                        {row.company}
                                    </TableCell>
                                    <TableCell className="text-gray-500 max-w-[200px] truncate" sx={{ fontSize: '0.875rem' }}>
                                        {row.useCase}
                                    </TableCell>
                                    <TableCell className="text-gray-500" sx={{ fontSize: '0.875rem' }}>
                                        {row.date}
                                    </TableCell>
                                    <TableCell align="right">
                                        {getStatusChip(row.status)}
                                    </TableCell>
                                </TableRow>
                            ))}
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

export default SenderId