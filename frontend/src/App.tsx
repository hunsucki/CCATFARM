import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Home as HomeIcon, Map as MapIcon, Leaf, Settings as SettingsIcon } from 'lucide-react'
import Home from './pages/Home'
import Map from './pages/Map'
import Crops from './pages/Crops'
import Settings from './pages/Settings'
import './App.css'

const navItems = [
  { to: '/', label: 'Main', icon: HomeIcon },
  { to: '/map', label: 'Map', icon: MapIcon },
  { to: '/crops', label: 'Crops', icon: Leaf },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
]

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/crops" element={<Crops />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>

        <nav className="bottom-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={22} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </BrowserRouter>
  )
}
