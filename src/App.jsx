import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import { isHidden } from './data/nav'

// Public club site
import Home from './pages/Home'
import About from './pages/About'
import Domains from './pages/Domains'
import Programs from './pages/Programs'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Team from './pages/Team'
import Join from './pages/Join'
import RegisterChipWar from './pages/RegisterChipWar'

// Stories
import StoryPage from './pages/StoryPage'

// Playground
import Playground from './pages/Playground'
import BinaryBlitz from './activities/binary-blitz/BinaryBlitz'
import TapeoutCalculator from './activities/tapeout-calculator/TapeoutCalculator'
import WaferDefectMap from './activities/wafer-defect-map/WaferDefectMap'
import SizeOfTransistor from './activities/size-of-transistor/SizeOfTransistor'

// Weekly challenges — these paths are shared with students, do not change them
import WeekHub from './activities/week-activities/WeekHub'
import FoundryCEO from './activities/week-activities/foundry-ceo/FoundryCEO'
import TapeoutSprint from './activities/week-activities/tapeout-sprint/TapeoutSprint'
import SiliconDetective from './activities/week-activities/silicon-detective/SiliconDetective'
import Dashboard from './activities/dashboard/Dashboard'
import Leaderboard from './activities/week-activities/Leaderboard'

/**
 * A route for a page that may be hidden. The page component stays wired up;
 * while its nav entry carries `hidden`, the path sends visitors home instead,
 * so an old link cannot land on a half-finished page.
 */
function gate(path, element) {
  return isHidden(path) ? <Navigate to="/" replace /> : element
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={gate('/about', <About />)} />
        <Route path="/domains" element={gate('/domains', <Domains />)} />
        <Route path="/programs" element={gate('/programs', <Programs />)} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/team" element={<Team />} />
        <Route path="/join" element={<Join />} />
        <Route path="/events/chip-war/register" element={<RegisterChipWar />} />

        <Route path="/stories/:slug" element={<StoryPage />} />

        <Route path="/playground" element={<Playground />} />
        <Route path="/playground/binary-blitz" element={<BinaryBlitz />} />
        <Route path="/playground/tapeout-calculator" element={<TapeoutCalculator />} />
        <Route path="/playground/wafer-defect-map" element={<WaferDefectMap />} />
        <Route path="/playground/size-of-transistor" element={<SizeOfTransistor />} />

        <Route path="/challenges" element={<WeekHub />} />
        <Route path="/challenges/foundry-ceo" element={<FoundryCEO />} />
        <Route path="/challenges/tapeout-sprint" element={<TapeoutSprint />} />
        <Route path="/challenges/silicon-detective" element={<SiliconDetective />} />
        <Route path="/challenges/dashboard" element={<Dashboard />} />
        <Route path="/challenges/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  )
}
