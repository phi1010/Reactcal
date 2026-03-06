import type { Resource, CalendarEvent } from "./types";

export const RESOURCES: Resource[] = [
  { id: "r1", name: "Conference Room A", color: "#4f46e5" },
  { id: "r2", name: "Conference Room B", color: "#0891b2" },
  { id: "r3", name: "Alice Johnson", color: "#059669" },
  { id: "r4", name: "Bob Martinez", color: "#d97706" },
  { id: "r5", name: "Carol White", color: "#dc2626" },
  { id: "r6", name: "Lab / Workshop", color: "#7c3aed" },
];

/** Build a UTC ISO datetime string with 5-minute precision. */
function utc(year: number, month: number, day: number, hour: number, minute: number): string {
  return new Date(Date.UTC(year, month - 1, day, hour, minute, 0)).toISOString();
}

export const EVENTS: CalendarEvent[] = [
  // Conference Room A
  { id: "e1",  resourceId: "r1", title: "Sprint Planning",     startUtc: utc(2026, 3,  6,  9,  0), endUtc: utc(2026, 3,  6, 10, 30) },
  { id: "e2",  resourceId: "r1", title: "Client Demo",         startUtc: utc(2026, 3,  6, 13, 15), endUtc: utc(2026, 3,  6, 14, 45) },
  { id: "e3",  resourceId: "r1", title: "Retrospective",       startUtc: utc(2026, 3,  9, 16,  0), endUtc: utc(2026, 3,  9, 17,  0) },
  { id: "e4",  resourceId: "r1", title: "Q2 Planning",         startUtc: utc(2026, 3, 13, 10,  0), endUtc: utc(2026, 3, 13, 12,  0) },
  { id: "e5",  resourceId: "r1", title: "Board Meeting",       startUtc: utc(2026, 3, 20,  9, 30), endUtc: utc(2026, 3, 20, 11, 30) },
  { id: "e6",  resourceId: "r1", title: "Release Review",      startUtc: utc(2026, 4,  3, 14,  5), endUtc: utc(2026, 4,  3, 15, 20) },

  // Conference Room B
  { id: "e7",  resourceId: "r2", title: "Design Review",       startUtc: utc(2026, 3,  6,  8, 30), endUtc: utc(2026, 3,  6,  9, 30) },
  { id: "e8",  resourceId: "r2", title: "Architecture Meeting", startUtc: utc(2026, 3,  7, 11,  0), endUtc: utc(2026, 3,  7, 12, 30) },
  { id: "e9",  resourceId: "r2", title: "Vendor Call",         startUtc: utc(2026, 3, 10, 14, 45), endUtc: utc(2026, 3, 10, 15, 15) },
  { id: "e10", resourceId: "r2", title: "API Workshop",        startUtc: utc(2026, 3, 17, 13,  0), endUtc: utc(2026, 3, 17, 15, 30) },
  { id: "e11", resourceId: "r2", title: "UX Walkthrough",      startUtc: utc(2026, 4, 10,  9, 10), endUtc: utc(2026, 4, 10, 10, 40) },

  // Alice Johnson
  { id: "e12", resourceId: "r3", title: "1:1 with Manager",   startUtc: utc(2026, 3,  6,  9, 30), endUtc: utc(2026, 3,  6, 10,  0) },
  { id: "e13", resourceId: "r3", title: "Code Review Session", startUtc: utc(2026, 3,  8, 10, 15), endUtc: utc(2026, 3,  8, 11, 45) },
  { id: "e14", resourceId: "r3", title: "Training Workshop",  startUtc: utc(2026, 3, 11, 14,  0), endUtc: utc(2026, 3, 11, 16, 30) },
  { id: "e15", resourceId: "r3", title: "Sprint Demo",        startUtc: utc(2026, 3, 20, 15,  0), endUtc: utc(2026, 3, 20, 16,  0) },
  { id: "e16", resourceId: "r3", title: "Conference Talk",    startUtc: utc(2026, 4, 22, 10, 35), endUtc: utc(2026, 4, 22, 11, 20) },

  // Bob Martinez
  { id: "e17", resourceId: "r4", title: "Sales Pitch",        startUtc: utc(2026, 3,  7,  8,  0), endUtc: utc(2026, 3,  7,  9, 15) },
  { id: "e18", resourceId: "r4", title: "Lunch Meeting",      startUtc: utc(2026, 3,  9, 12,  0), endUtc: utc(2026, 3,  9, 13,  0) },
  { id: "e19", resourceId: "r4", title: "Product Roadmap",    startUtc: utc(2026, 3, 12, 15, 15), endUtc: utc(2026, 3, 12, 16, 45) },
  { id: "e20", resourceId: "r4", title: "Investor Call",      startUtc: utc(2026, 3, 25, 10,  5), endUtc: utc(2026, 3, 25, 11, 20) },
  { id: "e21", resourceId: "r4", title: "Partner Summit",     startUtc: utc(2026, 5,  5,  9,  0), endUtc: utc(2026, 5,  5, 17,  0) },

  // Carol White
  { id: "e22", resourceId: "r5", title: "Standup",            startUtc: utc(2026, 3,  6,  8, 45), endUtc: utc(2026, 3,  6,  9, 15) },
  { id: "e23", resourceId: "r5", title: "Backend Integration", startUtc: utc(2026, 3,  8, 10,  0), endUtc: utc(2026, 3,  8, 12,  0) },
  { id: "e24", resourceId: "r5", title: "Security Audit",     startUtc: utc(2026, 3, 14, 13, 30), endUtc: utc(2026, 3, 14, 14, 15) },
  { id: "e25", resourceId: "r5", title: "Deployment Window",  startUtc: utc(2026, 3, 28, 14,  0), endUtc: utc(2026, 3, 28, 15, 30) },
  { id: "e26", resourceId: "r5", title: "Perf Review",        startUtc: utc(2026, 4, 15,  9, 55), endUtc: utc(2026, 4, 15, 10, 55) },

  // Lab / Workshop
  { id: "e27", resourceId: "r6", title: "Hardware Testing",   startUtc: utc(2026, 3,  6,  8,  0), endUtc: utc(2026, 3,  6, 10,  0) },
  { id: "e28", resourceId: "r6", title: "3D Printing",        startUtc: utc(2026, 3,  9, 11, 15), endUtc: utc(2026, 3,  9, 13, 45) },
  { id: "e29", resourceId: "r6", title: "Prototype Review",   startUtc: utc(2026, 3, 16, 15,  0), endUtc: utc(2026, 3, 16, 16, 15) },
  { id: "e30", resourceId: "r6", title: "Lab Calibration",    startUtc: utc(2026, 4,  1,  9,  0), endUtc: utc(2026, 4,  1, 12,  0) },
  { id: "e31", resourceId: "r6", title: "Firmware Flash",     startUtc: utc(2026, 5, 15, 13, 10), endUtc: utc(2026, 5, 15, 14, 50) },
];

