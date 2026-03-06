import React, { useState } from "react";
import type { CalendarEvent, Resource } from "../types";
import "./ResourceCalendar.css";

interface ResourceCalendarProps {
  resources: Resource[];
  events: CalendarEvent[];
  /** Visible day start in minutes from midnight (default 8*60 = 480) */
  dayStartMinutes?: number;
  /** Visible day end in minutes from midnight (default 18*60 = 1080) */
  dayEndMinutes?: number;
  /** Column width in hours (default 2) */
  slotHours?: number;
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export const ResourceCalendar: React.FC<ResourceCalendarProps> = ({
  resources,
  events,
  dayStartMinutes = 8 * 60,
  dayEndMinutes = 18 * 60,
  slotHours = 2,
}) => {
  const [tooltip, setTooltip] = useState<{
    event: CalendarEvent;
    x: number;
    y: number;
  } | null>(null);

  const totalMinutes = dayEndMinutes - dayStartMinutes;
  const slotMinutes = slotHours * 60;
  const slots: number[] = [];
  for (let t = dayStartMinutes; t < dayEndMinutes; t += slotMinutes) {
    slots.push(t);
  }

  /** Quarter-hour grid lines within a row */
  const quarterLines: number[] = [];
  for (
    let t = dayStartMinutes + 15;
    t < dayEndMinutes;
    t += 15
  ) {
    quarterLines.push(t);
  }

  function eventStyle(
    ev: CalendarEvent,
    resource: Resource
  ): React.CSSProperties {
    const clampedStart = Math.max(ev.startMinutes, dayStartMinutes);
    const clampedEnd = Math.min(ev.endMinutes, dayEndMinutes);
    const left = ((clampedStart - dayStartMinutes) / totalMinutes) * 100;
    const width = ((clampedEnd - clampedStart) / totalMinutes) * 100;
    return {
      left: `${left}%`,
      width: `calc(${width}% - 2px)`,
      backgroundColor: ev.color ?? resource.color,
    };
  }

  function quarterLineStyle(minuteOfDay: number): React.CSSProperties {
    const left = ((minuteOfDay - dayStartMinutes) / totalMinutes) * 100;
    const isHour = minuteOfDay % 60 === 0;
    const isSlotBoundary = minuteOfDay % slotMinutes === 0;
    return {
      left: `${left}%`,
      borderLeft: isSlotBoundary
        ? "1px solid #d1d5db"
        : isHour
        ? "1px dashed #e5e7eb"
        : "1px dotted #f3f4f6",
    };
  }

  function handleMouseEnter(
    e: React.MouseEvent,
    ev: CalendarEvent
  ) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({ event: ev, x: rect.left + rect.width / 2, y: rect.top });
  }

  function handleMouseLeave() {
    setTooltip(null);
  }

  const resourceMap = Object.fromEntries(resources.map((r) => [r.id, r]));

  return (
    <div className="rc-wrapper">
      {/* Header: resource label column + time slot columns */}
      <div className="rc-header">
        <div className="rc-corner" />
        <div className="rc-timeline-header">
          {slots.map((slot) => (
            <div
              key={slot}
              className="rc-slot-label"
              style={{ left: `${((slot - dayStartMinutes) / totalMinutes) * 100}%`, width: `${(slotMinutes / totalMinutes) * 100}%` }}
            >
              {formatTime(slot)}
            </div>
          ))}
          {/* End label */}
          <div
            className="rc-slot-label rc-slot-label--end"
            style={{ left: "100%", width: 0 }}
          >
            {formatTime(dayEndMinutes)}
          </div>
        </div>
      </div>

      {/* Body: rows per resource */}
      <div className="rc-body">
        {resources.map((resource) => {
          const rowEvents = events.filter(
            (ev) =>
              ev.resourceId === resource.id &&
              ev.startMinutes < dayEndMinutes &&
              ev.endMinutes > dayStartMinutes
          );

          return (
            <div key={resource.id} className="rc-row">
              {/* Resource label */}
              <div className="rc-resource-label">
                <span
                  className="rc-resource-dot"
                  style={{ backgroundColor: resource.color }}
                />
                {resource.name}
              </div>

              {/* Event area */}
              <div className="rc-event-area">
                {/* Grid lines for all quarter-hour marks */}
                {quarterLines.map((t) => (
                  <div
                    key={t}
                    className="rc-grid-line"
                    style={quarterLineStyle(t)}
                  />
                ))}
                {/* End boundary */}
                <div
                  className="rc-grid-line"
                  style={{ left: "100%", borderLeft: "1px solid #d1d5db" }}
                />

                {/* Events */}
                {rowEvents.map((ev) => {
                  const res = resourceMap[ev.resourceId];
                  const duration = ev.endMinutes - ev.startMinutes;
                  const isNarrow = duration < 30;
                  return (
                    <div
                      key={ev.id}
                      className={`rc-event${isNarrow ? " rc-event--narrow" : ""}`}
                      style={eventStyle(ev, res)}
                      onMouseEnter={(e) => handleMouseEnter(e, ev)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <span className="rc-event-title">{ev.title}</span>
                      {!isNarrow && (
                        <span className="rc-event-time">
                          {formatTime(ev.startMinutes)}–{formatTime(ev.endMinutes)}
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

      {/* Tooltip */}
      {tooltip && (
        <div
          className="rc-tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <strong>{tooltip.event.title}</strong>
          <br />
          {formatTime(tooltip.event.startMinutes)} –{" "}
          {formatTime(tooltip.event.endMinutes)}
        </div>
      )}
    </div>
  );
};

export default ResourceCalendar;
