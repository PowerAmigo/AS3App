// Alerts & Settings screens for the bottom-nav tabs

function AlertsScreen({ alerts, onOpenSensor }) {
  return (
    <>
      <TopBar title="Active Alerts" subtitle={`${alerts.length} requiring attention`} />
      <div style={{ flex: 1, overflow: 'auto', background: '#F4F7FA', padding: '16px' }}>
        {/* filter chips */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
          {[
            { label: 'All', count: alerts.length, active: true },
            { label: 'Critical', count: alerts.filter(a => a.severity === 'critical').length },
            { label: 'Warning', count: alerts.filter(a => a.severity === 'warning').length },
            { label: 'Info', count: alerts.filter(a => a.severity === 'info').length },
          ].map(c => (
            <button key={c.label} style={{
              padding: '8px 14px', borderRadius: 100,
              background: c.active ? '#0B2545' : '#fff',
              color: c.active ? '#fff' : '#0B2545',
              border: c.active ? 0 : '1.5px solid #D6DFE8',
              fontFamily: 'Barlow, system-ui', fontWeight: 600, fontSize: 13,
              cursor: 'pointer', whiteSpace: 'nowrap', letterSpacing: '0.02em',
            }}>{c.label} · {c.count}</button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {alerts.map(a => (
            <div key={a.id} style={{
              background: '#fff', borderRadius: 12, padding: 14,
              border: '1px solid #E5ECF2', display: 'flex', gap: 12,
            }}>
              <div style={{
                width: 4, alignSelf: 'stretch', borderRadius: 100,
                background: a.severity === 'critical' ? '#DC2626' : a.severity === 'warning' ? '#F2A900' : 'var(--brand-cyan, #00AEEF)',
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <StatusBadge tone={a.severity === 'critical' ? 'error' : a.severity === 'warning' ? 'pending' : 'info'}>
                    {a.severity}
                  </StatusBadge>
                  <span style={{
                    fontFamily: 'Barlow, system-ui', fontWeight: 600, fontSize: 12,
                    color: '#5A7184', marginLeft: 'auto',
                  }}>{a.ago}</span>
                </div>
                <div style={{
                  fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 15,
                  color: '#0B2545', lineHeight: 1.3,
                }}>{a.title}</div>
                <div style={{
                  fontFamily: 'Barlow, system-ui', fontSize: 13, color: '#5A7184', marginTop: 3,
                }}>{a.site} · {a.row}</div>

                {/* GPS / Sensor reference strip */}
                {a.coords && (
                  <div style={{
                    marginTop: 10, padding: '8px 10px',
                    background: '#F4F7FA', borderRadius: 8,
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                      <circle cx="7" cy="6" r="2" stroke="var(--brand-cyan, #00AEEF)" strokeWidth="1.5"/>
                      <path d="M7 1a5 5 0 00-5 5c0 3.5 5 7.5 5 7.5s5-4 5-7.5a5 5 0 00-5-5z" stroke="var(--brand-cyan, #00AEEF)" strokeWidth="1.5"/>
                    </svg>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {a.sensorId && (
                        <div style={{
                          fontFamily: 'ui-monospace, "SF Mono", monospace',
                          fontSize: 11, fontWeight: 600, color: '#5A7184',
                          marginBottom: 2,
                        }}>{a.sensorId}</div>
                      )}
                      <div style={{
                        fontFamily: 'ui-monospace, "SF Mono", monospace',
                        fontSize: 12.5, fontWeight: 600, color: '#0B2545',
                        fontVariantNumeric: 'tabular-nums',
                      }}>
                        {a.coords.lat.toFixed(4)}, {a.coords.lng.toFixed(4)}
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenSensor && onOpenSensor(a)}
                      style={{
                        background: '#fff', border: '1.5px solid #D6DFE8',
                        padding: '6px 10px', borderRadius: 8, cursor: 'pointer',
                        fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 11,
                        color: '#0B2545', letterSpacing: '0.06em', textTransform: 'uppercase',
                        whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4,
                      }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5h6m0 0L5 2m3 3L5 8" stroke="#0B2545" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Locate
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function SettingsScreen({ onLogout }) {
  const items = [
    { group: 'Account', rows: [
      { label: 'Profile', value: 'Jordan Chen' },
      { label: 'Crew', value: 'QLD South Field' },
      { label: 'Role', value: 'Lead Technician' },
    ]},
    { group: 'Field Mode', rows: [
      { label: 'Sunlight Display', value: 'Auto', toggle: false },
      { label: 'Offline Queue', value: '3 pending uploads', toggle: true, on: true },
      { label: 'Haptic Feedback', value: 'On', toggle: true, on: true },
    ]},
    { group: 'Data & Sync', rows: [
      { label: 'Last Sync', value: '2 min ago' },
      { label: 'Storage', value: '14 of 50 MB' },
      { label: 'Server Region', value: 'AWS ap-southeast-2' },
    ]},
  ];
  return (
    <>
      <TopBar title="Settings" subtitle="v3.2.1 · Build 2026.04" />
      <div style={{ flex: 1, overflow: 'auto', background: '#F4F7FA', padding: '16px 0' }}>
        {items.map(group => (
          <div key={group.group} style={{ marginBottom: 20 }}>
            <div style={{
              padding: '0 20px 10px',
              fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 12,
              color: '#5A7184', letterSpacing: '0.14em', textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}>{group.group}</div>
            <div style={{
              margin: '0 16px', background: '#fff', borderRadius: 14,
              border: '1px solid #E5ECF2', overflow: 'hidden',
            }}>
              {group.rows.map((r, i) => (
                <div key={r.label} style={{
                  display: 'flex', alignItems: 'center',
                  padding: '14px 16px', minHeight: 52,
                  borderBottom: i < group.rows.length - 1 ? '1px solid #F0F4F7' : 0,
                }}>
                  <div style={{
                    flex: 1, fontFamily: 'Barlow, system-ui', fontWeight: 600,
                    fontSize: 15, color: '#0B2545',
                  }}>{r.label}</div>
                  {r.toggle ? (
                    <div style={{
                      width: 44, height: 26, borderRadius: 100,
                      background: r.on ? 'var(--brand-green, #39B54A)' : '#D6DFE8',
                      padding: 3, transition: 'background 0.2s',
                      display: 'flex', justifyContent: r.on ? 'flex-end' : 'flex-start',
                    }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: 100, background: '#fff',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                    </div>
                  ) : (
                    <span style={{
                      fontFamily: 'Barlow, system-ui', fontSize: 14, color: '#5A7184',
                    }}>{r.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ padding: '0 24px 24px' }}>
          <button onClick={onLogout} style={{
            width: '100%', padding: '14px', borderRadius: 12, border: '1.5px solid #FDE5E5',
            background: '#fff', color: '#DC2626', cursor: 'pointer',
            fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 14,
            letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>Sign Out</button>
        </div>
      </div>
    </>
  );
}

const MOCK_ALERTS = [
  { id: 'a1', severity: 'critical', title: 'String voltage below threshold (612V)',
    site: 'Coleambally Array B', row: 'Row 08-A', ago: '12 min',
    sensorId: 'PA-SN-7F3C-4421', coords: { lat: -34.7912, lng: 145.8743 } },
  { id: 'a2', severity: 'critical', title: 'Sensor offline — no telemetry for 38 min',
    site: 'Coleambally Array B', row: 'Row 11-B', ago: '38 min',
    sensorId: 'PA-SN-7F3C-4892', coords: { lat: -34.7918, lng: 145.8771 } },
  { id: 'a3', severity: 'warning', title: 'Temperature drift detected (+6°C)',
    site: 'Maryborough Solar Farm', row: 'Row 03-A', ago: '1 h',
    sensorId: 'PA-SN-7F3C-1056', coords: { lat: -25.5408, lng: 152.7012 } },
  { id: 'a4', severity: 'info', title: 'Gateway firmware update available',
    site: 'Bungala North', row: 'Gateway PA-GW-9B12', ago: '3 h',
    coords: { lat: -32.4361, lng: 137.7715 } },
];

Object.assign(window, { AlertsScreen, SettingsScreen, MOCK_ALERTS });
