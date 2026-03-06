export interface Resource {
  id: string;
  name: string;
  color: string;
}

export interface CalendarEvent {
  id: string;
  resourceId: string;
  title: string;
  /** Minutes from midnight */
  startMinutes: number;
  /** Minutes from midnight */
  endMinutes: number;
  color?: string;
}
