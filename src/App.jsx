import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import BinaryBlitz from './activities/binary-blitz/BinaryBlitz'
import TapeoutCalculator from './activities/tapeout-calculator/TapeoutCalculator'
import WaferDefectMap from './activities/wafer-defect-map/WaferDefectMap'
import SizeOfTransistor from './activities/size-of-transistor/SizeOfTransistor'
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
        <Route path="/binary-blitz" element={<BinaryBlitz />} />
        <Route path="/tapeout-calculator" element={<TapeoutCalculator />} />
        <Route path="/wafer-defect-map" element={<WaferDefectMap />} />
        <Route path="/size-of-transistor" element={<SizeOfTransistor />} />
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