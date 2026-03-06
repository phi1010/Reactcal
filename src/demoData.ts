import type { Resource, CalendarEvent } from "./types";

export const RESOURCES: Resource[] = [
  { id: "r1", name: "Conference Room A", color: "#4f46e5" },
  { id: "r2", name: "Conference Room B", color: "#0891b2" },
  { id: "r3", name: "Alice Johnson", color: "#059669" },
  { id: "r4", name: "Bob Martinez", color: "#d97706" },
  { id: "r5", name: "Carol White", color: "#dc2626" },
  { id: "r6", name: "Lab / Workshop", color: "#7c3aed" },
];

function hm(h: number, m: number): number {
  return h * 60 + m;
}

export const EVENTS: CalendarEvent[] = [
  // Conference Room A
  {
    id: "e1",
    resourceId: "r1",
    title: "Sprint Planning",
    startMinutes: hm(9, 0),
    endMinutes: hm(10, 30),
  },
  {
    id: "e2",
    resourceId: "r1",
    title: "Client Demo",
    startMinutes: hm(13, 15),
    endMinutes: hm(14, 45),
  },
  {
    id: "e3",
    resourceId: "r1",
    title: "Retrospective",
    startMinutes: hm(16, 0),
    endMinutes: hm(17, 0),
  },

  // Conference Room B
  {
    id: "e4",
    resourceId: "r2",
    title: "Design Review",
    startMinutes: hm(8, 30),
    endMinutes: hm(9, 30),
  },
  {
    id: "e5",
    resourceId: "r2",
    title: "Architecture Meeting",
    startMinutes: hm(11, 0),
    endMinutes: hm(12, 30),
  },
  {
    id: "e6",
    resourceId: "r2",
    title: "Vendor Call",
    startMinutes: hm(14, 45),
    endMinutes: hm(15, 15),
  },

  // Alice Johnson
  {
    id: "e7",
    resourceId: "r3",
    title: "1:1 with Manager",
    startMinutes: hm(9, 30),
    endMinutes: hm(10, 0),
  },
  {
    id: "e8",
    resourceId: "r3",
    title: "Code Review Session",
    startMinutes: hm(10, 15),
    endMinutes: hm(11, 45),
  },
  {
    id: "e9",
    resourceId: "r3",
    title: "Training Workshop",
    startMinutes: hm(14, 0),
    endMinutes: hm(16, 30),
  },

  // Bob Martinez
  {
    id: "e10",
    resourceId: "r4",
    title: "Sales Pitch",
    startMinutes: hm(8, 0),
    endMinutes: hm(9, 15),
  },
  {
    id: "e11",
    resourceId: "r4",
    title: "Lunch Meeting",
    startMinutes: hm(12, 0),
    endMinutes: hm(13, 0),
  },
  {
    id: "e12",
    resourceId: "r4",
    title: "Product Roadmap",
    startMinutes: hm(15, 15),
    endMinutes: hm(16, 45),
  },

  // Carol White
  {
    id: "e13",
    resourceId: "r5",
    title: "Standup",
    startMinutes: hm(8, 45),
    endMinutes: hm(9, 15),
  },
  {
    id: "e14",
    resourceId: "r5",
    title: "Backend Integration",
    startMinutes: hm(10, 0),
    endMinutes: hm(12, 0),
  },
  {
    id: "e15",
    resourceId: "r5",
    title: "Security Audit",
    startMinutes: hm(13, 30),
    endMinutes: hm(14, 15),
  },

  // Lab / Workshop
  {
    id: "e16",
    resourceId: "r6",
    title: "Hardware Testing",
    startMinutes: hm(8, 0),
    endMinutes: hm(10, 0),
  },
  {
    id: "e17",
    resourceId: "r6",
    title: "3D Printing",
    startMinutes: hm(11, 15),
    endMinutes: hm(13, 45),
  },
  {
    id: "e18",
    resourceId: "r6",
    title: "Prototype Review",
    startMinutes: hm(15, 0),
    endMinutes: hm(16, 15),
  },
];
