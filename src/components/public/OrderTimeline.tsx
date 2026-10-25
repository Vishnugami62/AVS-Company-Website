import { Check } from "lucide-react";
import { STATUS_FLOW, STATUS_LABEL } from "@/lib/constants";
import { flowIndexFor } from "@/lib/tracking";
import { formatDateTime, cn } from "@/lib/utils";

type EventLite = { status: string; createdAt: Date | string };

export function OrderTimeline({
  status,
  events,
}: {
  status: string;
  events: EventLite[];
}) {
  const currentIndex = flowIndexFor(status);
  const timeByStatus = new Map<string, Date | string>();
  for (const e of events) {
    if (!timeByStatus.has(e.status)) timeByStatus.set(e.status, e.createdAt);
  }

  return (
    <ol className="relative space-y-0">
      {STATUS_FLOW.map((stage, i) => {
        const done = i < currentIndex;
        const current = i === currentIndex;
        const time = timeByStatus.get(stage);
        const isLast = i === STATUS_FLOW.length - 1;
        return (
          <li key={stage} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && (
              <span
                className={cn(
                  "absolute left-[15px] top-8 h-[calc(100%-1rem)] w-0.5",
                  done ? "bg-gold" : "bg-navy/10",
                )}
                aria-hidden
              />
            )}
            <span
              className={cn(
                "relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold",
                done && "bg-gold text-navy-deep",
                current && "bg-navy text-gold-light ring-4 ring-gold/25",
                !done && !current && "border border-navy/15 bg-white text-muted",
              )}
            >
              {done ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <div className="pt-1">
              <div
                className={cn(
                  "font-head font-bold",
                  current ? "text-navy" : done ? "text-navy/80" : "text-muted",
                )}
              >
                {STATUS_LABEL[stage]}
              </div>
              <div className="text-xs text-muted">
                {time ? formatDateTime(time) : current ? "In progress" : "Up next"}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
