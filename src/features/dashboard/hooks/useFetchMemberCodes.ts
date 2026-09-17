import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "@/config/api";

export type TicketStatus = "Used" | "Not Used";
 
export interface MemberRecord {
  _id: string;
  userName: string;
  userId: string;
  code: string;
  status: TicketStatus;
}

const selectRows = (res: any): MemberRecord[] =>
  Array.isArray(res) ? res : (res?.data ?? []);

export function useFetchMemberCodes(eventId: string) {
  return useQuery({
    queryKey: ["member-codes", eventId],
    queryFn: async ({ signal }) => {
      // `signal` cancels the in-flight request when the user switches events fast.
      const res = await api.get(`/events/member-codes?eventID=${eventId}`, { signal });
      return res.data;
    },
    enabled: Boolean(eventId), // no request until an event is picked
    placeholderData: keepPreviousData, // old table stays on screen while the new one loads
    staleTime: 60_000, // 1 min: re-visiting the tab doesn't refetch
    gcTime: 5 * 60_000, // cached events switch back instantly
    refetchOnWindowFocus: false,
    select: selectRows, // normalise once, not in the component
  });
}
