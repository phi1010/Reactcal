import React, { useMemo, useState } from "react";
import type { CalendarEvent, Resource } from "../types";
import "./ResourceCalendar.css";

interface ResourceCalendarProps {
  resources: Resource[];
  events: CalendarEvent[];
  /** UTC start date for the calendar view (time component is ignored). Defaults to today. */
  startDate?: Date;
  /** Number of days to display (default 120). */
  numDays?: number;
}

/** Pixels wide for each day column. */
const DAY_COL_PX = 56;
/** Pixels wide for the sticky resource-name column. */
const RESOURCE_COL_PX = 160;

const WEEKDAY_ABBR = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;
const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

/** Return a new Date snapped to UTC midnight for the given date. */
function utcDayStart(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/** Add n whole days (in ms) to a UTC date. */
function addUtcDays(date: Date, n: number): Date {
  return new Date(date.getTime() + n * 86_400_000);
}

/** Format a UTC ISO datetime as HH:MM (5-minute precision display). */
function formatUtcTime(isoString: string): string {
  const d = new Date(isoString);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

/** Format a UTC date as YYYY-MM-DD. */
function formatDateISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export const ResourceCalendar: React.FC<ResourceCalendarProps> = ({
  resources,
  events,
  startDate,
  numDays = 120,
}) => {
  const [tooltip, setTooltip] = useState<{
    event: CalendarEvent;
    x: number;
    y: number;
  } | null>(null);

  // Normalise to UTC midnight.
  const calStart = useMemo(() => utcDayStart(startDate ?? new Date()), [startDate]);
  const calEnd   = useMemo(() => addUtcDays(calStart, numDays), [calStart, numDays]);
  const totalMs  = calEnd.getTime() - calStart.getTime();

  // Build the array of day dates.
  const days = useMemo<Date[]>(() => {
    const arr: Date[] = [];
    for (let i = 0; i < numDays; i++) arr.push(addUtcDays(calStart, i));
    return arr;
  }, [calStart, numDays]);

  // Group consecutive days into month buckets for the two-row header.
  const monthGroups = useMemo(() => {
    const groups: { label: string; span: number; startIdx: number }[] = [];
    let cur = { label: "", span: 0, startIdx: 0 };
    days.forEach((d, i) => {
      const label = `${MONTH_ABBR[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
      if (label !== cur.label) {
        if (cur.span > 0) groups.push(cur);
        cur = { label, span: 1, startIdx: i };
      } else {
        cur.span++;
      }
    });
    if (cur.span > 0) groups.push(cur);
    return groups;
  }, [days]);

  const resourceMap = useMemo(
    () => Object.fromEntries(resources.map((r) => [r.id, r])),
    [resources],
  );

  /** Return absolute positioning style for an event bar, or null if outside range. */
  function eventStyle(startMs: number, endMs: number, resource: Resource, eventColor?: string): React.CSSProperties | null {
    const cStart  = Math.max(startMs, calStart.getTime());
    const cEnd    = Math.min(endMs, calEnd.getTime());
    if (cEnd <= cStart) return null;
    const left  = ((cStart - calStart.getTime()) / totalMs) * 100;
    const width = ((cEnd - cStart) / totalMs) * 100;
    return {
      left: `${left}%`,
      width: `calc(${width}% - 2px)`,
      backgroundColor: eventColor ?? resource.color,
    };
  }

  function handleMouseEnter(e: React.MouseEvent, ev: CalendarEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({ event: ev, x: rect.left + rect.width / 2, y: rect.top });
  }
  function handleMouseLeave() {
    setTooltip(null);
  }

  const totalContentWidth = numDays * DAY_COL_PX;

  return (
    <div className="rc-scroll-wrap">
      <div className="rc-inner" style={{ minWidth: totalContentWidth + RESOURCE_COL_PX }}>

        {/* ── HEADER (sticky top) ── */}
        <div className="rc-header">
          {/* Corner cell: sticky top + left */}
          <div className="rc-corner" />

          <div className="rc-date-header" style={{ width: totalContentWidth }}>
            {/* Row 1: month banners */}
            <div className="rc-month-row">
              {monthGroups.map((g) => (
                <div
                  key={`${g.label}-${g.startIdx}`}
                  className="rc-month-label"
                  style={{ width: g.span * DAY_COL_PX }}
                >
                  {g.label}
                </div>
              ))}
            </div>

            {/* Row 2: individual day numbers + weekday letter */}
            <div className="rc-day-row">
              {days.map((d, i) => {
                const dow = d.getUTCDay();
                const isWeekend = dow === 0 || dow === 6;
                return (
                  <div
                    key={i}
                    className={`rc-day-label${isWeekend ? " rc-day-label--weekend" : ""}`}
                    style={{ width: DAY_COL_PX }}
                    title={formatDateISO(d)}
                  >
                    <span className="rc-day-num">{d.getUTCDate()}</span>
                    <span className="rc-day-wd">{WEEKDAY_ABBR[dow]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="rc-body">
          {resources.map((resource) => {
            const rowEvents = events.filter(
              (ev) =>
                ev.resourceId === resource.id &&
                new Date(ev.startUtc).getTime() < calEnd.getTime() &&
                new Date(ev.endUtc).getTime()   > calStart.getTime(),
            );

            return (
              <div key={resource.id} className="rc-row">
                {/* Resource label (sticky left) */}
                <div className="rc-resource-label">
                  <span
                    className="rc-resource-dot"
                    style={{ backgroundColor: resource.color }}
                  />
                  {resource.name}
                </div>

                {/* Event area */}
                <div
                  className="rc-event-area"
                  style={{ width: totalContentWidth }}
                >
                  {/* Day-column background stripes */}
                  {days.map((d, i) => {
                    const dow = d.getUTCDay();
                    return (
                      <div
                        key={i}
                        className={`rc-day-col${dow === 0 || dow === 6 ? " rc-day-col--weekend" : ""}`}
                        style={{ left: i * DAY_COL_PX, width: DAY_COL_PX }}
                      />
                    );
                  })}

                  {/* Events */}
                  {rowEvents.map((ev) => {
                    const res      = resourceMap[ev.resourceId];
                    const startMs  = new Date(ev.startUtc).getTime();
                    const endMs    = new Date(ev.endUtc).getTime();
                    const style    = eventStyle(startMs, endMs, res, ev.color);
                    if (!style) return null;
                    // Events shorter than 30 min get the "narrow" treatment.
                    const isNarrow = (endMs - startMs) < 30 * 60 * 1000;
                    return (
                      <div
                        key={ev.id}
                        className={`rc-event${isNarrow ? " rc-event--narrow" : ""}`}
                        style={style}
                        onMouseEnter={(e) => handleMouseEnter(e, ev)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <span className="rc-event-title">{ev.title}</span>
                        {!isNarrow && (
                          <span className="rc-event-time">
                            {formatUtcTime(ev.startUtc)}–{formatUtcTime(ev.endUtc)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="rc-tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <strong>{tooltip.event.title}</strong>
          <br />
          {formatUtcTime(tooltip.event.startUtc)} – {formatUtcTime(tooltip.event.endUtc)} UTC
          <br />
          <span className="rc-tooltip-date">
            {new Date(tooltip.event.startUtc).toISOString().slice(0, 10)}
          </span>
        </div>
      )}
    </div>
  );
};

export default ResourceCalendar;

