import { useState } from 'react'
import styles from './App.module.css'
import ResourceCalendar from './components/ResourceCalendar'
import WeekView from './components/WeekView'
import WeekViewCombined from './components/WeekViewCombined'
import { RESOURCES, EVENTS } from './demoData'
import type { CalendarEvent } from './types'

/** Calendar start: today at UTC midnight. */
const _today = new Date()
const START_DATE = new Date(Date.UTC(
  _today.getUTCFullYear(),
  _today.getUTCMonth(),
  _today.getUTCDate(),
))

type ViewMode = 'week' | 'combined' | 'gantt'

function App() {
  const [view, setView] = useState<ViewMode>('week')
  const [events, setEvents] = useState<CalendarEvent[]>(EVENTS)

  function handleEventCreate(ev: Omit<CalendarEvent, 'id'>) {
    const id = `custom-${Date.now()}`
    setEvents(prev => [...prev, { ...ev, id }])
  }

  const subtitle =
    view === 'week'     ? 'Week view \u2014 one column per resource per day \u00b7 UTC'
    : view === 'combined' ? 'Combined week view \u2014 all resources share each day column \u00b7 UTC'
    :                       '120 days \u2014 UTC datetimes \u00b7 5-minute precision'

  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <div className={styles.appHeaderRow}>
          <h1>Resource Calendar</h1>
          <div className={styles.appViewToggle} role="group" aria-label="View mode">
            <button
              className={`${styles.appViewBtn}${view === 'week' ? ` ${styles.appViewBtnActive}` : ''}`}
              onClick={() => setView('week')}
            >
              Week
            </button>
            <button
              className={`${styles.appViewBtn}${view === 'combined' ? ` ${styles.appViewBtnActive}` : ''}`}
              onClick={() => setView('combined')}
            >
              Combined
            </button>
            <button
              className={`${styles.appViewBtn}${view === 'gantt' ? ` ${styles.appViewBtnActive}` : ''}`}
              onClick={() => setView('gantt')}
            >
              Gantt
            </button>
          </div>
        </div>
        <p className={styles.appSubtitle}>{subtitle}</p>
      </header>
      <main className={styles.appMain}>
        {view === 'week' ? (
          <WeekView
            resources={RESOURCES}
            events={events}
            startDate={START_DATE}
            onEventCreate={handleEventCreate}
          />
        ) : view === 'combined' ? (
          <WeekViewCombined
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
