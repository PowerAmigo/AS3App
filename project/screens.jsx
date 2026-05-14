// Power Amigo Field App — all 7 screens
// Screens use shared primitives from ui.jsx and logo.jsx

// Mock data
const MOCK_SITES = [
  { id: 's1', name: 'Maryborough Solar Farm', description: 'QLD — 120 MW', rows: 24, sensors: 192, status: 'online', alerts: 0 },
  { id: 's2', name: 'Coleambally Array B', description: 'NSW — 80 MW', rows: 16, sensors: 128, status: 'pending', alerts: 2 },
  { id: 's3', name: 'Bungala North',        description: 'SA — 220 MW',  rows: 32, sensors: 256, status: 'online', alerts: 0 },
];

// ═════════════════════════════════════════════════════════════
// 1. LOGIN / REGISTER
// ═════════════════════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [mode, setMode] = React.useState('login'); // 'login' | 'register'
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = () => {
    // TODO: POST /auth/login
    //   body: { email, password }
    //   returns: { token: "<JWT>", user: { id, name, role } }
    // Subsequent requests must include: Authorization: Bearer <token>
    onLogin();
  };

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: '#fff', overflow: 'auto',
    }}>
      {/* brand header */}
      <div style={{
        padding: '40px 28px 28px',
        background: 'linear-gradient(180deg, #F4FAFE 0%, #fff 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        borderBottom: '1px solid #E5ECF2',
      }}>
        <PowerAmigoLogo size={64} />
        <div style={{
          fontFamily: 'Barlow, system-ui', fontSize: 14, fontWeight: 500,
          color: '#5A7184', textAlign: 'center', maxWidth: 280,
        }}>
          Solar string commissioning & monitoring for field technicians
        </div>
      </div>

      {/* mode toggle */}
      <div style={{ padding: '24px 24px 0', display: 'flex', gap: 4,
        background: '#F4F7FA', margin: '24px 24px 0', borderRadius: 12, padding: 4 }}>
        {['login', 'register'].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            flex: 1, padding: '12px 0', borderRadius: 9, border: 0, cursor: 'pointer',
            background: mode === m ? '#fff' : 'transparent',
            boxShadow: mode === m ? '0 1px 4px rgba(11,37,69,0.08)' : 'none',
            fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 13,
            color: mode === m ? '#0B2545' : '#5A7184',
            letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>
            {m === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        ))}
      </div>

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
        {mode === 'register' && (
          <FieldInput label="Full Name" value="" onChange={() => {}} placeholder="Jordan Chen" />
        )}
        <FieldInput label="Email" type="email" value={email} onChange={setEmail}
          placeholder="tech@poweramigo.com.au" autoFocus />
        <FieldInput label="Password" type="password" value={password} onChange={setPassword}
          placeholder="••••••••" />
        {mode === 'register' && (
          <FieldInput label="Crew / Region" value="" onChange={() => {}} placeholder="QLD South Field Crew" />
        )}

        {mode === 'login' && (
          <button style={{
            alignSelf: 'flex-end', background: 'transparent', border: 0, padding: 0,
            color: 'var(--brand-cyan, #00AEEF)', fontFamily: 'Barlow, system-ui',
            fontWeight: 600, fontSize: 14, cursor: 'pointer', letterSpacing: '0.02em',
          }}>Forgot password?</button>
        )}

        <div style={{ flex: 1 }} />

        <PrimaryButton onClick={handleSubmit}>
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </PrimaryButton>

        <div style={{
          textAlign: 'center', fontFamily: 'Barlow, system-ui', fontSize: 12,
          color: '#5A7184', letterSpacing: '0.06em',
          paddingTop: 4,
        }}>
          v3.2.1 · Secure field connection
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// 2. DASHBOARD — sites list
// ═════════════════════════════════════════════════════════════
function DashboardScreen({ sites, onOpenSite, onAddSite, onLogout }) {
  return (
    <>
      <TopBar
        title="Sites"
        subtitle={`${sites.length} registered · QLD South`}
        right={
          <button onClick={onLogout} style={{
            width: 40, height: 40, borderRadius: 10, border: 0, background: '#F4F7FA',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="6" r="3" stroke="#0B2545" strokeWidth="1.8"/>
              <path d="M2 14c1-3 3.5-4 6-4s5 1 6 4" stroke="#0B2545" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        }
      />

      <div style={{ flex: 1, overflow: 'auto', background: '#F4F7FA' }}>
        {/* hero stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1,
          background: '#E5ECF2', borderBottom: '1px solid #E5ECF2',
        }}>
          {[
            { label: 'Sites', value: sites.length, tone: '#0B2545' },
            { label: 'Sensors', value: sites.reduce((s, x) => s + x.sensors, 0), tone: 'var(--brand-cyan, #00AEEF)' },
            { label: 'Alerts', value: sites.reduce((s, x) => s + x.alerts, 0), tone: '#DC2626' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', padding: '14px 12px', textAlign: 'center' }}>
              <div style={{
                fontFamily: 'Barlow, system-ui', fontWeight: 800, fontSize: 26,
                color: s.tone, lineHeight: 1, fontVariantNumeric: 'tabular-nums',
              }}>{s.value}</div>
              <div style={{
                fontFamily: 'Barlow, system-ui', fontWeight: 600, fontSize: 11,
                color: '#5A7184', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                marginTop: 4,
              }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* section header */}
        <div style={{
          padding: '20px 20px 12px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{
            fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 13,
            color: '#5A7184', letterSpacing: '0.12em', textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>Your Sites</div>
          <div style={{
            fontFamily: 'Barlow, system-ui', fontWeight: 600, fontSize: 13,
            color: 'var(--brand-cyan, #00AEEF)',
          }}>Filter</div>
        </div>

        {/* site cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px 20px' }}>
          {sites.map(site => (
            <button key={site.id} onClick={() => onOpenSite(site)} style={{
              background: '#fff', border: '1px solid #E5ECF2', borderRadius: 14,
              padding: 16, cursor: 'pointer', textAlign: 'left',
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                  background: 'linear-gradient(135deg, #E0F6FE 0%, #E6F8EA 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="6" width="18" height="12" rx="1.5" stroke="var(--brand-cyan, #00AEEF)" strokeWidth="1.8"/>
                    <path d="M3 10h18M3 14h18M9 6v12M15 6v12" stroke="var(--brand-cyan, #00AEEF)" strokeWidth="1.4"/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 17,
                    color: '#0B2545', lineHeight: 1.2, marginBottom: 4,
                  }}>{site.name}</div>
                  <div style={{
                    fontFamily: 'Barlow, system-ui', fontSize: 13, color: '#5A7184',
                  }}>{site.description}</div>
                </div>
                <StatusBadge tone={site.status === 'online' ? 'online' : 'pending'}>
                  {site.status}
                </StatusBadge>
              </div>

              <div style={{
                display: 'flex', gap: 16, paddingTop: 12,
                borderTop: '1px dashed #E5ECF2',
              }}>
                <div>
                  <div style={{
                    fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 18,
                    color: '#0B2545', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                  }}>{site.rows}</div>
                  <div style={{
                    fontFamily: 'Barlow, system-ui', fontWeight: 600, fontSize: 11,
                    color: '#5A7184', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                    marginTop: 2,
                  }}>Rows</div>
                </div>
                <div style={{ width: 1, background: '#E5ECF2' }} />
                <div>
                  <div style={{
                    fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 18,
                    color: '#0B2545', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                  }}>{site.sensors}</div>
                  <div style={{
                    fontFamily: 'Barlow, system-ui', fontWeight: 600, fontSize: 11,
                    color: '#5A7184', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                    marginTop: 2,
                  }}>Sensors</div>
                </div>
                {site.alerts > 0 && (
                  <>
                    <div style={{ width: 1, background: '#E5ECF2' }} />
                    <div>
                      <div style={{
                        fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 18,
                        color: '#DC2626', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                      }}>{site.alerts}</div>
                      <div style={{
                        fontFamily: 'Barlow, system-ui', fontWeight: 600, fontSize: 11,
                        color: '#DC2626', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                        marginTop: 2,
                      }}>Alerts</div>
                    </div>
                  </>
                )}
                <div style={{ flex: 1 }} />
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ alignSelf: 'center' }}>
                  <path d="M7 4l6 6-6 6" stroke="#C2CCD6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* FAB */}
      <button onClick={onAddSite} style={{
        position: 'absolute', bottom: 96, right: 20, zIndex: 30,
        width: 60, height: 60, borderRadius: 16, border: 0,
        background: 'var(--brand-cyan, #00AEEF)',
        boxShadow: '0 8px 20px rgba(0,174,239,0.42)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 6v16M6 14h16" stroke="#fff" strokeWidth="2.8" strokeLinecap="round"/>
        </svg>
      </button>
    </>
  );
}

// ═════════════════════════════════════════════════════════════
// 3. CREATE SITE
// ═════════════════════════════════════════════════════════════
function CreateSiteScreen({ onBack, onCreated }) {
  const [name, setName] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [gatewayId, setGatewayId] = React.useState(null);

  const handleSave = () => {
    // TODO: POST /sites
    //   headers: { Authorization: 'Bearer <token>' }
    //   body: { site_name: name, description: desc, gateway_id: gatewayId }
    //   returns: { site_id: "uuid" }
    onCreated({
      id: 's' + Date.now(), name, description: desc,
      rows: 0, sensors: 0, status: 'pending', alerts: 0,
    });
  };

  return (
    <>
      <TopBar title="New Site" subtitle="Step 1 of 2" onBack={onBack} />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px 24px', background: '#fff', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <FieldInput label="Site Name" value={name} onChange={setName}
          placeholder="e.g. Maryborough Solar Farm" autoFocus
          hint="Use the official site name from the commissioning brief." />
        <FieldInput label="Description (optional)" value={desc} onChange={setDesc}
          placeholder="QLD — 120 MW · Block 3" />

        <div>
          <div style={{
            fontFamily: 'Barlow, system-ui', fontWeight: 600, fontSize: 12,
            color: '#5A7184', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap',
            marginBottom: 8,
          }}>Gateway Pairing</div>
          <QRScanner
            label={gatewayId ? `✓ ${gatewayId}` : 'Scan Gateway QR Code'}
            onScan={() => setGatewayId('PA-GW-A4F2-9B71')}
          />
          <div style={{
            fontFamily: 'Barlow, system-ui', fontSize: 13, color: '#5A7184', marginTop: 10,
          }}>
            Locate the QR sticker on the LoRa gateway enclosure. Brackets will lock when aligned.
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 8 }} />
        <PrimaryButton onClick={handleSave} disabled={!name || !gatewayId}>
          Create Site
        </PrimaryButton>
      </div>
    </>
  );
}

// ═════════════════════════════════════════════════════════════
// 4. SITE DETAIL / ROWS
// ═════════════════════════════════════════════════════════════
function SiteDetailScreen({ site, rows, onBack, onAddRow, onRegisterSensor, onEditSite, onOpenRow }) {
  return (
    <>
      <TopBar title={site.name} subtitle={site.description} onBack={onBack}
        right={
          <button onClick={onEditSite} style={{
            width: 40, height: 40, borderRadius: 10, border: '1.5px solid #D6DFE8',
            background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 0, flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M11 1.5l3.5 3.5L5 14.5H1.5V11L11 1.5z"
                stroke="#0B2545" strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>
        }
      />
      <div style={{ flex: 1, overflow: 'auto', background: '#F4F7FA' }}>
        {/* site summary card */}
        <div style={{
          background: '#fff', margin: 16, borderRadius: 14, padding: 16,
          border: '1px solid #E5ECF2',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <StatusBadge tone={site.status === 'online' ? 'online' : 'pending'}>{site.status}</StatusBadge>
            <span style={{
              fontFamily: 'Barlow, system-ui', fontSize: 12, color: '#5A7184', letterSpacing: '0.06em',
            }}>Gateway PA-GW-A4F2-9B71</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { label: 'Rows', value: rows.length, color: '#0B2545' },
              { label: 'Sensors', value: rows.reduce((s, r) => s + r.sensors, 0), color: 'var(--brand-cyan, #00AEEF)' },
              { label: 'Healthy', value: rows.reduce((s, r) => s + r.healthy, 0), color: 'var(--brand-green, #39B54A)' },
            ].map(s => (
              <div key={s.label}>
                <div style={{
                  fontFamily: 'Barlow, system-ui', fontWeight: 800, fontSize: 22,
                  color: s.color, lineHeight: 1, fontVariantNumeric: 'tabular-nums',
                }}>{s.value}</div>
                <div style={{
                  fontFamily: 'Barlow, system-ui', fontWeight: 600, fontSize: 11,
                  color: '#5A7184', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                  marginTop: 4,
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* quick actions */}
        <div style={{ padding: '0 16px 16px', display: 'flex', gap: 10 }}>
          <button onClick={onRegisterSensor} style={{
            flex: 1, padding: '14px', borderRadius: 12, border: 0,
            background: 'var(--brand-green, #39B54A)', color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 14,
            letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap',
            boxShadow: '0 4px 14px rgba(57,181,74,0.28)',
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="6" height="6" rx="1" stroke="#fff" strokeWidth="1.6"/>
              <rect x="10" y="2" width="6" height="6" rx="1" stroke="#fff" strokeWidth="1.6"/>
              <rect x="2" y="10" width="6" height="6" rx="1" stroke="#fff" strokeWidth="1.6"/>
              <rect x="11" y="11" width="2" height="2" fill="#fff"/>
              <rect x="14" y="14" width="2" height="2" fill="#fff"/>
            </svg>
            Register Sensor
          </button>
        </div>

        {/* rows list */}
        <div style={{ padding: '0 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 13,
            color: '#5A7184', letterSpacing: '0.12em', textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>Rows (DC Lines)</div>
          <button onClick={onAddRow} style={{
            background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
            color: 'var(--brand-cyan, #00AEEF)', fontFamily: 'Barlow, system-ui',
            fontWeight: 700, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
          }}>+ Add Row</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 16px 20px' }}>
          {rows.map(r => (
            <button key={r.id} onClick={() => onOpenRow && onOpenRow(r)} style={{
              background: '#fff', border: '1px solid #E5ECF2', borderRadius: 12,
              padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14,
              cursor: 'pointer', textAlign: 'left', width: '100%',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: r.sensors >= r.expected ? '#E6F8EA' : '#FFF3D6',
                color: r.sensors >= r.expected ? '#1F7A2D' : '#8A5A00',
                fontFamily: 'Barlow, system-ui', fontWeight: 800, fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                letterSpacing: '0.04em',
              }}>{r.name.replace(/[^A-Z0-9]/gi, '').slice(-3)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 16,
                  color: '#0B2545', lineHeight: 1.2,
                }}>{r.name}</div>
                <div style={{
                  fontFamily: 'Barlow, system-ui', fontSize: 13, color: '#5A7184',
                  marginTop: 2,
                }}>
                  <span style={{ fontWeight: 700, color: '#0B2545' }}>{r.sensors}</span>
                  {' / '}{r.expected} sensors registered
                </div>
              </div>
              {/* mini progress bar */}
              <div style={{ width: 56, textAlign: 'right' }}>
                <div style={{
                  fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 13,
                  color: r.sensors >= r.expected ? 'var(--brand-green, #39B54A)' : '#8A5A00',
                  fontVariantNumeric: 'tabular-nums',
                }}>{Math.round((r.sensors / r.expected) * 100)}%</div>
                <div style={{
                  height: 4, background: '#E5ECF2', borderRadius: 100, marginTop: 4, overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', width: `${Math.min(100, (r.sensors / r.expected) * 100)}%`,
                    background: r.sensors >= r.expected ? 'var(--brand-green, #39B54A)' : '#F2A900',
                  }} />
                </div>
              </div>
            </button>
          ))}
          {rows.length === 0 && (
            <div style={{
              padding: '32px 20px', textAlign: 'center', background: '#fff',
              borderRadius: 12, border: '1.5px dashed #D6DFE8',
            }}>
              <div style={{
                fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 16, color: '#0B2545',
              }}>No rows yet</div>
              <div style={{
                fontFamily: 'Barlow, system-ui', fontSize: 13, color: '#5A7184', marginTop: 4,
              }}>Add the first DC line to start commissioning.</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ═════════════════════════════════════════════════════════════
// 5. CREATE ROW
// ═════════════════════════════════════════════════════════════
function CreateRowScreen({ site, onBack, onCreated }) {
  const [name, setName] = React.useState('');
  const [expected, setExpected] = React.useState('8');

  const handleSave = () => {
    // TODO: POST /rows
    //   headers: { Authorization: 'Bearer <token>' }
    //   body: { site_id: site.id, row_name: name }
    //   returns: { row_id: "uuid" }
    onCreated({
      id: 'r' + Date.now(), name,
      sensors: 0, expected: parseInt(expected, 10) || 8, healthy: 0,
    });
  };

  return (
    <>
      <TopBar title="New Row" subtitle={site.name} onBack={onBack} />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px 24px', background: '#fff', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <FieldInput label="Row Name / Label" value={name} onChange={setName}
          placeholder="e.g. Row 12-A" autoFocus
          hint="Use the field-painted label visible on the combiner box." />
        <FieldInput label="Expected Sensors" type="number" value={expected} onChange={setExpected}
          hint="Total strings on this DC line." />

        {/* suggested labels */}
        <div>
          <div style={{
            fontFamily: 'Barlow, system-ui', fontWeight: 600, fontSize: 12,
            color: '#5A7184', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap',
            marginBottom: 8,
          }}>Quick Labels</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Row 01', 'Row 02', 'Row 03', 'Row 04', 'Block A1', 'Block A2'].map(l => (
              <button key={l} onClick={() => setName(l)} style={{
                padding: '8px 14px', borderRadius: 100, border: '1.5px solid #D6DFE8',
                background: '#fff', cursor: 'pointer',
                fontFamily: 'Barlow, system-ui', fontWeight: 600, fontSize: 13,
                color: '#0B2545', letterSpacing: '0.02em',
              }}>{l}</button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }} />
        <PrimaryButton onClick={handleSave} disabled={!name}>Save Row</PrimaryButton>
      </div>
    </>
  );
}

// ═════════════════════════════════════════════════════════════
// 6. SENSOR REGISTRATION
// ═════════════════════════════════════════════════════════════
function SensorRegisterScreen({ sites, defaults, onBack, onConfirmed }) {
  const [siteId, setSiteId] = React.useState(defaults?.siteId || sites[0]?.id);
  const [rowId, setRowId] = React.useState(defaults?.rowId || sites[0]?.rowsList?.[0]?.id);
  const [sensorId, setSensorId] = React.useState(null);
  const [gpsState, setGpsState] = React.useState('idle'); // idle|locating|done
  const [coords, setCoords] = React.useState(null);

  // Auto-acquire GPS on mount (simulated)
  React.useEffect(() => {
    setGpsState('locating');
    // TODO: navigator.geolocation.getCurrentPosition
    const t = setTimeout(() => {
      setCoords({ lat: -28.0167, lng: 153.4000, accuracy: 3.2 });
      setGpsState('done');
    }, 1800);
    return () => clearTimeout(t);
  }, []);

  const site = sites.find(s => s.id === siteId);
  const rows = site?.rowsList || [];
  const row = rows.find(r => r.id === rowId) || rows[0];

  const handleConfirm = () => {
    // TODO: POST /sensors
    //   headers: { Authorization: 'Bearer <token>' }
    //   body: {
    //     site_id: siteId,
    //     row_id: rowId,
    //     sensor_id: sensorId,        // decoded from QR
    //     lat: coords.lat,
    //     lng: coords.lng,
    //     timestamp: new Date().toISOString(),
    //   }
    //   returns: { ok: true, sensor: { ... } }
    onConfirmed({
      site, row, sensorId, coords, timestamp: new Date(),
    });
  };

  const Select = ({ label, value, onChange, options }) => (
    <label style={{ display: 'block' }}>
      <div style={{
        fontFamily: 'Barlow, system-ui', fontWeight: 600, fontSize: 12,
        color: '#5A7184', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap',
        marginBottom: 6,
      }}>{label}</div>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: '#F4F7FA', border: '1.5px solid #D6DFE8',
        borderRadius: 10, padding: '0 14px', height: 52,
      }}>
        <select value={value} onChange={e => onChange(e.target.value)}
          style={{
            flex: 1, border: 0, outline: 0, background: 'transparent',
            fontFamily: 'Barlow, system-ui', fontWeight: 600, fontSize: 17,
            color: '#0B2545', appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer',
          }}>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 5l4 4 4-4" stroke="#5A7184" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </label>
  );

  return (
    <>
      <TopBar title="Register Sensor" subtitle="String QR · location · upload" onBack={onBack} />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px 24px', background: '#fff', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Select label="Site" value={siteId} onChange={setSiteId}
          options={sites.map(s => ({ value: s.id, label: s.name }))} />
        <Select label="Row" value={row?.id || ''} onChange={setRowId}
          options={rows.length ? rows.map(r => ({ value: r.id, label: r.name })) : [{ value: '', label: 'No rows — add one first' }]} />

        <div>
          <div style={{
            fontFamily: 'Barlow, system-ui', fontWeight: 600, fontSize: 12,
            color: '#5A7184', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap',
            marginBottom: 8,
          }}>Sensor QR</div>
          <QRScanner
            label={sensorId ? `✓ ${sensorId}` : 'Scan Sensor QR Code'}
            onScan={() => setSensorId('PA-SN-7F3C-' + Math.floor(1000 + Math.random() * 9000))}
          />
        </div>

        {/* GPS card */}
        <div style={{
          background: '#F4F7FA', border: '1.5px solid #D6DFE8',
          borderRadius: 12, padding: 14, display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10,
            background: gpsState === 'done' ? '#E6F8EA' : '#E0F6FE',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {gpsState === 'locating' ? (
              <div style={{
                width: 22, height: 22, borderRadius: 100,
                border: '2.5px solid #E5ECF2',
                borderTopColor: 'var(--brand-cyan, #00AEEF)',
                animation: 'spin 0.9s linear infinite',
              }} />
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="9" r="3" stroke={gpsState === 'done' ? 'var(--brand-green, #39B54A)' : 'var(--brand-cyan, #00AEEF)'} strokeWidth="2"/>
                <path d="M11 1.5a7.5 7.5 0 00-7.5 7.5c0 5 7.5 11.5 7.5 11.5s7.5-6.5 7.5-11.5A7.5 7.5 0 0011 1.5z" stroke={gpsState === 'done' ? 'var(--brand-green, #39B54A)' : 'var(--brand-cyan, #00AEEF)'} strokeWidth="2"/>
              </svg>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 14,
              color: '#0B2545', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}>
              {gpsState === 'locating' ? 'Acquiring GPS…' : 'Location locked'}
            </div>
            {coords ? (
              <div style={{
                fontFamily: 'Barlow, system-ui', fontVariantNumeric: 'tabular-nums',
                fontSize: 15, color: '#0B2545', marginTop: 4, fontWeight: 600,
              }}>
                {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                <span style={{ color: '#5A7184', fontWeight: 500, marginLeft: 8 }}>±{coords.accuracy}m</span>
              </div>
            ) : (
              <div style={{
                fontFamily: 'Barlow, system-ui', fontSize: 13, color: '#5A7184', marginTop: 4,
              }}>Hold device level. Sky view recommended.</div>
            )}
          </div>
          {gpsState === 'done' && (
            <StatusBadge tone="online">Fix</StatusBadge>
          )}
        </div>

        <div style={{ flex: 1, minHeight: 8 }} />
        <PrimaryButton onClick={handleConfirm} variant="success"
          disabled={!sensorId || gpsState !== 'done' || !row}>
          Confirm & Upload
        </PrimaryButton>
      </div>
    </>
  );
}

// ═════════════════════════════════════════════════════════════
// 7. SUCCESS
// ═════════════════════════════════════════════════════════════
function SuccessScreen({ result, onAnother, onDashboard }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {/* hero */}
      <div style={{
        background: 'linear-gradient(160deg, var(--brand-green, #39B54A) 0%, #2EA63F 100%)',
        padding: '48px 28px 36px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 16, color: '#fff',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 100, background: 'rgba(255,255,255,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '3px solid rgba(255,255,255,0.4)',
        }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M10 20l7 7 14-14" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'Barlow, system-ui', fontWeight: 800, fontSize: 26,
            letterSpacing: '-0.01em', lineHeight: 1.1,
          }}>Sensor Registered</div>
          <div style={{
            fontFamily: 'Barlow, system-ui', fontWeight: 500, fontSize: 15,
            opacity: 0.85, marginTop: 6,
          }}>Uploaded to cloud · {new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>

      {/* receipt */}
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{
          background: '#F4F7FA', border: '1.5px solid #E5ECF2', borderRadius: 14,
          padding: '4px 18px', display: 'flex', flexDirection: 'column',
        }}>
          {[
            { label: 'Site', value: result.site?.name || '—' },
            { label: 'Row', value: result.row?.name || '—' },
            { label: 'Sensor ID', value: result.sensorId || '—', mono: true },
            { label: 'GPS', value: result.coords ? `${result.coords.lat.toFixed(4)}, ${result.coords.lng.toFixed(4)}` : '—', mono: true },
            { label: 'Accuracy', value: result.coords ? `±${result.coords.accuracy}m` : '—' },
            { label: 'Timestamp', value: result.timestamp?.toLocaleString('en-AU') || '—' },
          ].map((row, i, arr) => (
            <div key={row.label} style={{
              display: 'flex', alignItems: 'center', padding: '14px 0',
              borderBottom: i < arr.length - 1 ? '1px dashed #E5ECF2' : 0,
            }}>
              <div style={{
                fontFamily: 'Barlow, system-ui', fontWeight: 600, fontSize: 12,
                color: '#5A7184', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                width: 96, flexShrink: 0,
              }}>{row.label}</div>
              <div style={{
                fontFamily: row.mono ? 'ui-monospace, "SF Mono", monospace' : 'Barlow, system-ui',
                fontWeight: row.mono ? 600 : 600, fontSize: row.mono ? 14 : 15,
                color: '#0B2545', flex: 1, textAlign: 'right', wordBreak: 'break-all',
                fontVariantNumeric: 'tabular-nums',
              }}>{row.value}</div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />
        <PrimaryButton onClick={onAnother} variant="primary">Register Another</PrimaryButton>
        <PrimaryButton onClick={onDashboard} variant="secondary">Go to Dashboard</PrimaryButton>
      </div>
    </div>
  );
}

Object.assign(window, {
  LoginScreen, DashboardScreen, CreateSiteScreen,
  SiteDetailScreen, CreateRowScreen, SensorRegisterScreen, SuccessScreen,
  MOCK_SITES,
});
