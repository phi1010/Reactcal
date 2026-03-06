import './App.css'
import ResourceCalendar from './components/ResourceCalendar'
import { RESOURCES, EVENTS } from './demoData'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Resource Calendar</h1>
        <p className="app-subtitle">
          Today &mdash; 2-hour time slots &middot; Events at quarter-hour precision
        </p>
      </header>
      <main className="app-main">
        <ResourceCalendar
          resources={RESOURCES}
          events={EVENTS}
          dayStartMinutes={8 * 60}
          dayEndMinutes={18 * 60}
          slotHours={2}
        />
      </main>
    </div>
  )
}

export default App
