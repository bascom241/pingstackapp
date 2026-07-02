import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "../api/getAllTransactions";

export const useAllHistory = (page: number, size: number) => {
  return useQuery({
    // Critical: Add page and size here so cache updates when page shifts
    queryKey: ["history", page, size], 
    queryFn: () => getTransactions(page, size),
    placeholderData: (previousData) => previousData, // Smooth UI: keeps old data visible while loading the next page
  });
};