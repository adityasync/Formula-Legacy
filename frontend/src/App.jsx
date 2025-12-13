import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Teams from './pages/Teams';
import TeamDetails from './pages/TeamDetails';
import Races from './pages/Races';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Drivers from './pages/Drivers';
import DriverProfile from './pages/DriverProfile';
import Analytics from './pages/Analytics';
import Circuits from './pages/Circuits';
import CircuitDetails from './pages/CircuitDetails';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-f1-black text-f1-offwhite font-body selection:bg-f1-red selection:text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/drivers/:id" element={<DriverProfile />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:id" element={<TeamDetails />} />
          <Route path="/circuits" element={<Circuits />} />
          <Route path="/circuits/:id" element={<CircuitDetails />} />
          <Route path="/races" element={<Races />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;

