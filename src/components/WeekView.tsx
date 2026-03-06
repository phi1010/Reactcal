import React, { useMemo, useState } from "react";
import type { CalendarEvent, Resource } from "../types";
import "./WeekView.css";

interface WeekViewProps {
  resources: Resource[];
  events: CalendarEvent[];
  /** Optional date to seed the initial week (shows the week containing this date). Defaults to today. */
  startDate?: Date;
}

/** Pixels per 5-minute slot (2 px × 1 slot). */
const SLOT_PX = 2;
/** Minutes per slot. */
const SLOT_MIN = 5;
/** Pixel height of one full hour (12 slots × 2 px = 24 px). */
const HOUR_PX = (60 / SLOT_MIN) * SLOT_PX; // 24 px
/** Total pixel height of one full day (24 hours × 24 px = 576 px). */
const DAY_H_PX = 24 * HOUR_PX; // 576 px
/** Width of the sticky time-gutter column. */
const GUTTER_PX = 52;
/** Width of each resource sub-column inside a day. */
const SUBCOL_PX = 60;

/** Sunday-first (index 0 = Sun) to align with Date.getUTCDay() return values. */
const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

const HOURS_24 = Array.from({ length: 24 }, (_, i) => i);

/** Return the UTC Monday of the ISO week containing `date`. */
function getWeekMonday(date: Date): Date {
  const dow = date.getUTCDay(); // 0 = Sun
  const delta = dow === 0 ? -6 : 1 - dow;
  return new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate() + delta,
  ));
}

function addDays(date: Date, n: number): Date {
  return new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate() + n,
  ));
}

function fmtHour(h: number): string {
  return `${String(h).padStart(2, "0")}:00`;
}

function fmtTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

export const WeekView: React.FC<WeekViewProps> = ({ resources, events, startDate }) => {
  const initWeekStart = useMemo(
    () => getWeekMonday(startDate ?? new Date()),
    [startDate],
  );

  const [weekStart, setWeekStart] = useState(initWeekStart);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const [tooltip, setTooltip] = useState<{
    ev: CalendarEvent;
    x: number;
    y: number;
  } | null>(null);

  const weekLabel = useMemo(() => {
    const last = addDays(weekStart, 6);
    if (weekStart.getUTCMonth() === last.getUTCMonth()) {
      return `${MONTH_SHORT[weekStart.getUTCMonth()]} ${weekStart.getUTCDate()}–${last.getUTCDate()}, ${weekStart.getUTCFullYear()}`;
    }
    return `${MONTH_SHORT[weekStart.getUTCMonth()]} ${weekStart.getUTCDate()} – ${MONTH_SHORT[last.getUTCMonth()]} ${last.getUTCDate()}, ${weekStart.getUTCFullYear()}`;
  }, [weekStart]);

  /** All events that overlap the currently displayed week. */
  const visibleEvents = useMemo(() => {
    const startMs = weekStart.getTime();
    const endMs   = startMs + 7 * 86_400_000;
    return events.filter(ev => {
      const s = new Date(ev.startUtc).getTime();
      const e = new Date(ev.endUtc).getTime();
      return s < endMs && e > startMs;
    });
  }, [events, weekStart]);

  /** Return positioned events for a single (day, resource) cell. */
  function cellEvents(day: Date, resourceId: string) {
    const dayMs    = day.getTime();
    const dayEndMs = dayMs + 86_400_000;
    return visibleEvents
      .filter(ev =>
        ev.resourceId === resourceId &&
        new Date(ev.startUtc).getTime() < dayEndMs &&
        new Date(ev.endUtc).getTime()   > dayMs,
      )
      .map(ev => {
        const clampedStart = Math.max(new Date(ev.startUtc).getTime(), dayMs);
        const clampedEnd   = Math.min(new Date(ev.endUtc).getTime(), dayEndMs);
        const startMin = (clampedStart - dayMs) / 60_000;
        const endMin   = (clampedEnd   - dayMs) / 60_000;
        const topPx    = (startMin / SLOT_MIN) * SLOT_PX;
        const heightPx = Math.max(SLOT_PX, ((endMin - startMin) / SLOT_MIN) * SLOT_PX);
        return { ev, topPx, heightPx };
      });
  }

  function handleMouseEnter(e: React.MouseEvent, ev: CalendarEvent) {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({ ev, x: r.left + r.width / 2, y: r.top });
  }

  const dayColW = resources.length * SUBCOL_PX;
  const totalW  = GUTTER_PX + 7 * dayColW;

  return (
    <div className="wv-outer">

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <div className="wv-nav">
        <button
          className="wv-nav-btn"
          onClick={() => setWeekStart(d => addDays(d, -7))}
          aria-label="Previous week"
        >&#8249;</button>
        <span className="wv-week-label">{weekLabel}</span>
        <button
          className="wv-nav-btn"
          onClick={() => setWeekStart(d => addDays(d, 7))}
          aria-label="Next week"
        >&#8250;</button>
      </div>

      {/* ── Scrollable grid ────────────────────────────────────────────────── */}
      <div className="wv-scroll-area">
        <div className="wv-inner" style={{ minWidth: totalW }}>

          {/* Sticky header: day titles + resource sub-headers */}
          <div className="wv-header">
            {/* Corner cell – sticky in both top and left */}
            <div className="wv-corner" style={{ width: GUTTER_PX, minWidth: GUTTER_PX }} />

            <div className="wv-day-headers">
              {weekDays.map((day, di) => {
                const dow = day.getUTCDay();
                const isWE = dow === 0 || dow === 6;
                return (
                  <div
                    key={di}
                    className={`wv-day-hdr${isWE ? " wv-day-hdr--we" : ""}`}
                    style={{ width: dayColW, minWidth: dayColW }}
                  >
                    {/* Row 1: weekday name + date */}
                    <div className="wv-day-title">
                      {WEEKDAY_SHORT[dow]}&nbsp;{day.getUTCDate()}&nbsp;{MONTH_SHORT[day.getUTCMonth()]}
                    </div>
                    {/* Row 2: one cell per resource */}
                    <div className="wv-subcol-headers">
                      {resources.map(r => (
                        <div
                          key={r.id}
                          className="wv-subcol-hdr"
                          style={{ width: SUBCOL_PX, minWidth: SUBCOL_PX }}
                          title={r.name}
                        >
                          <span className="wv-dot" style={{ background: r.color }} />
                          <span className="wv-subcol-name">{r.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Body: time gutter + day columns */}
          <div className="wv-body">

            {/* Time gutter – sticky left, contains hour labels */}
            <div
              className="wv-gutter"
              style={{ width: GUTTER_PX, minWidth: GUTTER_PX, height: DAY_H_PX }}
            >
              {/* One label per hour, each spanning HOUR_PX = 24 px (12 × 2 px slots). */}
              {HOURS_24.map(h => (
                <div
                  key={h}
                  className="wv-hour-label"
                  style={{ top: h * HOUR_PX, height: HOUR_PX }}
                >
                  {fmtHour(h)}
                </div>
              ))}
            </div>

            {/* Seven day columns */}
            {weekDays.map((day, di) => {
              const dow = day.getUTCDay();
              const isWE = dow === 0 || dow === 6;
              return (
                <div
                  key={di}
                  className={`wv-day-col${isWE ? " wv-day-col--we" : ""}`}
                  style={{ width: dayColW, height: DAY_H_PX }}
                >
                  {/* Horizontal hour gridlines spanning the full day column */}
                  {HOURS_24.map(h => (
                    <div
                      key={h}
                      className="wv-hour-line"
                      style={{ top: h * HOUR_PX }}
                    />
                  ))}

                  {/* Half-hour tick marks (no label) */}
                  {HOURS_24.map(h => (
                    <div
                      key={h}
                      className="wv-half-line"
                      style={{ top: h * HOUR_PX + HOUR_PX / 2 }}
                    />
                  ))}

                  {/* Resource sub-columns, one per resource */}
                  {resources.map((resource, ri) => (
                    <div
                      key={resource.id}
                      className="wv-subcol"
                      style={{ left: ri * SUBCOL_PX, width: SUBCOL_PX }}
                    >
                      {cellEvents(day, resource.id).map(({ ev, topPx, heightPx }) => (
                        <div
                          key={ev.id}
                          className="wv-event"
                          style={{
                            top: topPx,
                            height: heightPx,
                            background: ev.color ?? resource.color,
                          }}
                          onMouseEnter={e => handleMouseEnter(e, ev)}
                          onMouseLeave={() => setTooltip(null)}
                        >
                          {/* Show title only when the event block is at least one hour tall */}
                          {heightPx >= HOUR_PX && (
                            <span className="wv-event-title">{ev.title}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="wv-tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <strong>{tooltip.ev.title}</strong>
          <br />
          {fmtTime(tooltip.ev.startUtc)} – {fmtTime(tooltip.ev.endUtc)} UTC
          <br />
          <span className="wv-tooltip-date">
            {new Date(tooltip.ev.startUtc).toISOString().slice(0, 10)}
          </span>
        </div>
      )}
    </div>
  );
};

export default WeekView;
