import { createLazyFileRoute } from "@tanstack/react-router";
import Male from "@/assets/male.png";
import Female from "@/assets/female.png";
import {
  BellIcon,
  CalendarDays,
  ClockIcon,
  LibraryBig,
  MapPin,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRightIcon } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { useGetDashboardStats } from "@/features/dashboard/hooks/useGetDashhboardStats";
import { Events } from "@/components/Events";

export const Route = createLazyFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user } = useAuthUser();
  const { data } = useGetDashboardStats();

  return (
    <div className="flex flex-col space-y-5">
      {/* TopSection */}
      <div className="flex gap-6 lg:flex-row flex-col justify-between ">
        <div className="flex lg:w-[70%] rounded-[10px] h-[40vh] bg-white px-6 items-center relative">
          <div className="space-y-3 ">
            <h2 className="text-[40px] font-header mb-5">
              Hi, {user.fullName}
            </h2>
            <p className="font-grotesk text-[13px] leading-[21px] tracking-[1.2px] font-[300]">
              Welcome.
            </p>

            <div className="flex gap-4 items-center wrap-normal">
              <p className="font-header lg:text-[12px] text-[14px] font-[400]">
                UniqueID:{" "}
                <span className="text-primary-main font-[400]">
                  {user.uniqueID}
                </span>
              </p>
              <p className="font-header lg:text-[12px] text-[14px] font-[400]">
                Email:{" "}
                <span className="text-primary-main font-[400]">
                  {user.email}
                </span>
              </p>
            </div>
          </div>

          <img
            src={user.gender == "Male" ? Male : Female}
            alt="male avatar"
            className="w-[35%] absolute object-cover right-0 z-[70] -bottom-[100px]"
          />
        </div>

        <div className=" bg-[white] h-[40vh] lg:flex flex-col hidden w-[30%] py-3 px-3 rounded-[10px] space-y-3 ">
          <div className="flex">
            <p className="gap-2 flex font-rubik items-center text-[16px]">
              {" "}
              <BellIcon width={20} /> Notifications{" "}
            </p>
          </div>

          <ScrollArea className="h-[30vh] w-full">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Item variant="outline" className="p-1 mt-1 mb-1">
                <ItemContent className="p-0">
                  <ItemTitle className="font-header text-[14px]">
                    Basic Item
                  </ItemTitle>
                  <ItemDescription className="font-grotesk text-[12px]  leading-[17px] tracking-[0.3px] font-[300]">
                    A simple item with title and description.
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <ChevronRightIcon className="size-4" />
                </ItemActions>
              </Item>
            ))}
          </ScrollArea>
        </div>
      </div>
      {/* TopSection */}

      {/* Second Section */}
      <div className="rounded-[10px]  px-2 py-3 grid lg:grid-cols-3 gap-3">
        <div className="rounded-[10px] bg-[#c5c2f4] lg:h-[30vh] h-[30vh] flex flex-col px-5 py-3 justify-end text-[black] gap-4 pb-3">
          <CalendarDays />

          <h2 className="text-[40px] font-header font-bold">
            {data?.totalEvents}
          </h2>
          <p className="font-grotesk text-[17px] leading-[21px] tracking-[0.3px] font-[500]">
            Upcoming Events.
          </p>
        </div>

        <div className="rounded-[10px] bg-[#f0c7c2] lg:h-[30vh] h-[30vh] flex flex-col px-5 py-3 justify-end text-[black] gap-4 pb-3">
          <LibraryBig />

          <h2 className="text-[40px] font-header font-bold">43</h2>
          <p className="font-grotesk text-[17px] leading-[21px] tracking-[0.3px] font-[500]">
            Resources.
          </p>
        </div>

        <div className="rounded-[10px] bg-[#A0C6AD] lg:h-[30vh] h-[30vh]"></div>
      </div>
      {/* Second Section */}

      {/* Events */}
      <div className="rounded-[10px] lg:flex gap-3">
        <div className="rounded-xl lg:w-[66%] p-4 bg-card border border-border/60">
          <div className="flex items-center justify-between mb-3">
            <p className="font-header text-lg font-semibold tracking-tight">
              Latest Events
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground border cursor-pointer py-1"
            >
              View all
            </Button>
          </div>

          <Separator className="mb-3" />

          <div className="flex flex-col gap-2">
            {data?.latestEvent.map((event: any) => (
              <Events events={event} />
            ))}
          </div>
        </div>

        {/* Calendar */}
        <div className="lg:w-[34%] lg:flex hidden">
          <Calendar
            mode="single"
            selected={Date.now()}
            // onSelect={setSelectedDate}
            className="rounded-lg border bg-white border-muted w-full"
            captionLayout="dropdown"
          />
        </div>
        {/* Calendar */}
      </div>
      {/* Events */}
    </div>
  );
}
