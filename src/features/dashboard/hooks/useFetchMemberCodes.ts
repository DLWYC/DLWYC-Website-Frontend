import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "@/config/api";

export type TicketStatus = "Used" | "Not Used";

export interface MemberRecord {
  _id: string;
  userName: string;
  code: string;
  status: TicketStatus;
  usageTime: string | null;
}

interface RawCode {
  _id: string;
  code: string;
  status: TicketStatus;
  usageTime: string | null;
  user: { _id: string; fullName: string } | null;
}

interface CodesResponse {
  message: string;
  data: {
    _id: string;
    codes: RawCode[];
  };
}

// The array actually lives at `data.codes`, not `data` itself — this is the
// one place that mapping happens, so the component never has to know the
// wire shape. Also normalises `user: null` (an unused ticket) to a safe
// display fallback instead of leaking `null` into the table.
const selectRows = (res: CodesResponse): MemberRecord[] => {
  const codes = res?.data?.codes;
  if (!Array.isArray(codes)) return [];

  return codes.map((c) => ({
    _id: c._id,
    userName: c.user?.fullName ?? "—",
    code: c.code,
    status: c.status,
    usageTime: c.usageTime,
  }));
};

export function useFetchMemberCodes(eventId: string) {
  return useQuery({
    queryKey: ["member-codes", eventId],
    queryFn: async ({ signal }) => {
      // `signal` cancels the in-flight request when the user switches events fast.
      const res = await api.get(`/events/member-codes?eventID=${eventId}`, { signal });
      return res.data as CodesResponse;
    },
    enabled: Boolean(eventId), // no request until an event is picked
    placeholderData: keepPreviousData, // old table stays on screen while the new one loads
    staleTime: 60_000, // 1 min: re-visiting the tab doesn't refetch
    gcTime: 5 * 60_000, // cached events switch back instantly
    refetchOnWindowFocus: false,
    select: selectRows, // normalise once, not in the component
  });
}