import { useState } from 'react'
import './App.css'
import ResourceCalendar from './components/ResourceCalendar'
import WeekView from './components/WeekView'
import { RESOURCES, EVENTS } from './demoData'
import type { CalendarEvent } from './types'

/** Calendar start: today at UTC midnight. */
const _today = new Date()
const START_DATE = new Date(Date.UTC(
  _today.getUTCFullYear(),
  _today.getUTCMonth(),
  _today.getUTCDate(),
))

type ViewMode = 'week' | 'gantt'

function App() {
  const [view, setView] = useState<ViewMode>('week')
  const [events, setEvents] = useState<CalendarEvent[]>(EVENTS)

  function handleEventCreate(ev: Omit<CalendarEvent, 'id'>) {
    const id = `custom-${Date.now()}`
    setEvents(prev => [...prev, { ...ev, id }])
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-row">
          <h1>Resource Calendar</h1>
          <div className="app-view-toggle" role="group" aria-label="View mode">
            <button
              className={`app-view-btn${view === 'week' ? ' app-view-btn--active' : ''}`}
              onClick={() => setView('week')}
            >
              Week
            </button>
            <button
              className={`app-view-btn${view === 'gantt' ? ' app-view-btn--active' : ''}`}
              onClick={() => setView('gantt')}
            >
              Gantt
            </button>
          </div>
        </div>
        <p className="app-subtitle">
          {view === 'week'
            ? 'Week view \u2014 UTC datetimes \u00b7 2\u00a0px\u00a0/\u00a05\u00a0min'
            : '120 days \u2014 UTC datetimes \u00b7 5-minute precision'}
        </p>
      </header>
      <main className="app-main">
        {view === 'week' ? (
          <WeekView
            resources={RESOURCES}
            events={events}
            startDate={START_DATE}
            onEventCreate={handleEventCreate}
          />
        ) : (
          <ResourceCalendar
            resources={RESOURCES}
            events={events}
            startDate={START_DATE}
            numDays={120}
          />
        )}
      </main>
    </div>
  )
}

export default App
