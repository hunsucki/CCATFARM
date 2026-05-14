import { useState } from 'react'
import { Bell, ChevronRight } from 'lucide-react'

type Filter = 'All' | 'Normal' | 'Abnormal'
const zoneFilters = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E']

const cropData: { zone: string; status: string; detail: string; img: string | null }[] = []

export default function Crops() {
  const [filter, setFilter] = useState<Filter>('All')
  const [selectedZones, setSelectedZones] = useState<string[]>([])

  const toggleZone = (z: string) =>
    setSelectedZones((prev) => prev.includes(z) ? prev.filter((x) => x !== z) : [...prev, z])

  const filtered = cropData.filter((c) => {
    const statusMatch = filter === 'All' || c.status === filter
    const zoneMatch = selectedZones.length === 0 || selectedZones.includes(c.zone)
    return statusMatch && zoneMatch
  })

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Crops Status</h1>
        <Bell size={20} className="header-icon" />
      </header>

      {/* Filter Bar */}
      <div className="crops-filter-bar">
        <div className="status-tabs">
          {(['All', 'Normal', 'Abnormal'] as Filter[]).map((f) => (
            <button key={f} className={`status-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        <div className="zone-checkboxes">
          {zoneFilters.map((z) => (
            <label key={z} className="zone-check">
              <input type="checkbox" checked={selectedZones.includes(z)} onChange={() => toggleZone(z)} />
              {z}
            </label>
          ))}
        </div>
      </div>

      <div className="page-content">
        {filtered.map((crop, i) => (
          <div key={i} className="crop-card">
            <div className="crop-img-placeholder" />
            <div className="crop-info">
              <p className="crop-zone">{crop.zone}</p>
              <p className="crop-status">{crop.status}</p>
              <p className="crop-detail">{crop.detail}</p>
            </div>
            <ChevronRight size={16} className="crop-arrow" />
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: 20, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
            데이터 없음
          </div>
        )}
      </div>
    </div>
  )
}
