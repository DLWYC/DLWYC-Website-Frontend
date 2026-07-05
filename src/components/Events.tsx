import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { ChevronRightIcon, ClockIcon, MapPin } from "lucide-react";

export function Events(event: any) {
  return (
    <Item
      variant="outline"
      asChild
      className="group relative p-3 rounded-lg transition-all bg-white"
    >
      <a href="#">
        <div className="flex h-[64px] w-[56px] shrink-0 flex-col items-center justify-center rounded-lg bg-primary-main text-white">
          <p className="font-header text-[11px] font-medium uppercase tracking-wide opacity-90">
            {event.month}
          </p>
          <h2 className="font-header text-2xl font-bold leading-none">{event.date}</h2>
        </div>

        <ItemContent className="px-3 py-0">
          <div className="flex items-center gap-2">
            <ItemTitle className="font-header text-[15px] font-medium">
              {event.title}
            </ItemTitle>
            {/* <Badge
                      variant="secondary"
                      className="h-5 px-1.5 text-[10px] font-normal"
                    >
                      Upcoming
                    </Badge> */}
          </div>

          <ItemDescription className="font-grotesk text-[12px] leading-[17px] tracking-[0.3px] font-light text-muted-foreground">
            {event.description}
          </ItemDescription>

          <ItemActions className="flex items-center justify-between mt-1.5">
            <div className="flex  gap-4">
              <span className="flex items-center gap-1 font-header text-[11px] text-muted-foreground">
                <ClockIcon className="size-3.5" />
                {event.time}
              </span>
              <span className="flex items-center gap-1 font-header text-[11px] text-muted-foreground">
                <MapPin className="size-3.5" />
                {event.location}
              </span>
            </div>

            <span className="flex items-center font-rubik text-[13px] font-medium text-reddish">
              Read More
              <ChevronRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </ItemActions>
        </ItemContent>
      </a>
    </Item>
  );
}
