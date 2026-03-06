import './App.css'
import ResourceCalendar from './components/ResourceCalendar'
import { RESOURCES, EVENTS } from './demoData'

/** Calendar start: today at UTC midnight. */
const START_DATE = new Date(Date.UTC(
  new Date().getUTCFullYear(),
  new Date().getUTCMonth(),
  new Date().getUTCDate(),
))

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Resource Calendar</h1>
        <p className="app-subtitle">
          120 days &mdash; UTC datetimes &middot; 5-minute precision
        </p>
      </header>
      <main className="app-main">
        <ResourceCalendar
          resources={RESOURCES}
          events={EVENTS}
          startDate={START_DATE}
          numDays={120}
        />
      </main>
    </div>
  )
}

export default App
