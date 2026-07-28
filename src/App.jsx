import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'

// Public club site
import Home from './pages/Home'
import About from './pages/About'
import Domains from './pages/Domains'
import Programs from './pages/Programs'
import Events from './pages/Events'
import Team from './pages/Team'
import Join from './pages/Join'

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

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/domains" element={<Domains />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/events" element={<Events />} />
        <Route path="/team" element={<Team />} />
        <Route path="/join" element={<Join />} />

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
