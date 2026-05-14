import { Bell, User } from 'lucide-react'

export default function Settings() {
  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Settings</h1>
        <Bell size={20} className="header-icon" />
      </header>

      <div className="page-content">
        {/* Avatar */}
        <div className="settings-avatar">
          <div className="avatar-circle">
            <User size={48} color="#555" />
          </div>
        </div>

        {/* Form Fields */}
        <div className="settings-form">
          {[
            { label: 'USER NAME', type: 'text', placeholder: '' },
            { label: 'EMAIL ADDRESS', type: 'email', placeholder: '' },
            { label: 'PHONE NUMBER', type: 'tel', placeholder: '🇰🇷 82 +' },
            { label: 'HOME ADDRESS', type: 'text', placeholder: '' },
            { label: 'FARM ADDRESS', type: 'text', placeholder: '' },
            { label: 'ROBOT SCHEDULING', type: 'text', placeholder: '' },
          ].map((field) => (
            <div key={field.label} className="form-group">
              <label className="form-label">{field.label}</label>
              <input className="form-input" type={field.type} placeholder={field.placeholder} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
