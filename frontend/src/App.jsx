import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Teams from './pages/Teams';
import TeamDetails from './pages/TeamDetails';
import Races from './pages/Races';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Drivers from './pages/Drivers';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-f1-black text-f1-offwhite font-body selection:bg-f1-red selection:text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:id" element={<TeamDetails />} />
          <Route path="/races" element={<Races />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
