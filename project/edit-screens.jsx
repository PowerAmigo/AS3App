// Edit screens for Site, Row, Sensor + Row Detail with sensor list
// All editors follow the same pattern: TopBar with title, form fields, primary "Save",
// and a destructive "Delete" affordance at the bottom.

// ─────────────────────────────────────────────────────────────
// Shared destructive-action button
// ─────────────────────────────────────────────────────────────
function DangerButton({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', minHeight: 52, padding: '0 20px',
      background: '#fff', color: '#DC2626',
      border: '1.5px solid #FDE5E5', borderRadius: 12,
      fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 14,
      letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      cursor: 'pointer',
    }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 3.5h10M5 3.5V2a1 1 0 011-1h2a1 1 0 011 1v1.5M3.5 3.5L4 12a1 1 0 001 1h4a1 1 0 001-1l.5-8.5"
          stroke="#DC2626" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// EditSiteScreen
// ─────────────────────────────────────────────────────────────
function EditSiteScreen({ site, onBack, onSave, onDelete }) {
  const [name, setName] = React.useState(site.name);
  const [desc, setDesc] = React.useState(site.description || '');

  const handleSave = () => {
    // TODO: PATCH /sites/{site_id}
    //   headers: { Authorization: 'Bearer <token>' }
    //   body: { site_name: name, description: desc }
    //   returns: { ok: true }
    onSave({ ...site, name, description: desc });
  };

  const handleDelete = () => {
    if (!confirm(`Delete "${site.name}"? This will remove all rows and sensors under this site.`)) return;
    // TODO: DELETE /sites/{site_id}
    //   headers: { Authorization: 'Bearer <token>' }
    onDelete(site);
  };

  return (
    <>
      <TopBar title="Edit Site" subtitle={site.name} onBack={onBack} />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px 24px', background: '#fff', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <FieldInput label="Site Name" value={name} onChange={setName} autoFocus />
        <FieldInput label="Description" value={desc} onChange={setDesc} placeholder="e.g. QLD — 120 MW · Block 3" />

        <div style={{
          background: '#F4F7FA', borderRadius: 12, padding: 14,
          fontFamily: 'Barlow, system-ui', fontSize: 13, color: '#5A7184',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
            <span>Gateway</span><span style={{ fontFamily: 'ui-monospace, monospace', color: '#0B2545', fontWeight: 600 }}>PA-GW-A4F2-9B71</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
            <span>Rows</span><span style={{ color: '#0B2545', fontWeight: 600 }}>{site.rows}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
            <span>Sensors</span><span style={{ color: '#0B2545', fontWeight: 600 }}>{site.sensors}</span>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 8 }} />
        <PrimaryButton onClick={handleSave} disabled={!name}>Save Changes</PrimaryButton>
        <DangerButton onClick={handleDelete}>Delete Site</DangerButton>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// EditRowScreen
// ─────────────────────────────────────────────────────────────
function EditRowScreen({ site, row, onBack, onSave, onDelete }) {
  const [name, setName] = React.useState(row.name);
  const [expected, setExpected] = React.useState(String(row.expected));

  const handleSave = () => {
    // TODO: PATCH /rows/{row_id}
    //   headers: { Authorization: 'Bearer <token>' }
    //   body: { row_name: name, expected_sensors: parseInt(expected, 10) }
    //   returns: { ok: true }
    onSave({ ...row, name, expected: parseInt(expected, 10) || row.expected });
  };

  const handleDelete = () => {
    if (!confirm(`Delete "${row.name}"? This will remove ${row.sensors} sensors on this row.`)) return;
    // TODO: DELETE /rows/{row_id}
    //   headers: { Authorization: 'Bearer <token>' }
    onDelete(row);
  };

  return (
    <>
      <TopBar title="Edit Row" subtitle={`${site.name} · ${row.name}`} onBack={onBack} />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px 24px', background: '#fff', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <FieldInput label="Row Name / Label" value={name} onChange={setName} autoFocus />
        <FieldInput label="Expected Sensors" type="number" value={expected} onChange={setExpected}
          hint="Total strings on this DC line." />

        <div style={{
          background: '#F4F7FA', borderRadius: 12, padding: 14,
          fontFamily: 'Barlow, system-ui', fontSize: 13, color: '#5A7184',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
            <span>Registered</span><span style={{ color: '#0B2545', fontWeight: 600 }}>{row.sensors} sensors</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
            <span>Healthy</span>
            <span style={{ color: 'var(--brand-green, #39B54A)', fontWeight: 700 }}>
              {row.healthy} / {row.sensors || 1}
            </span>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 8 }} />
        <PrimaryButton onClick={handleSave} disabled={!name}>Save Changes</PrimaryButton>
        <DangerButton onClick={handleDelete}>Delete Row</DangerButton>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// EditSensorScreen — edit sensor ID, GPS, status
// ─────────────────────────────────────────────────────────────
function EditSensorScreen({ site, row, sensor, sites, onBack, onSave, onDelete }) {
  const [siteId, setSiteId] = React.useState(site.id);
  const [rowId, setRowId] = React.useState(row.id);
  const [sensorId, setSensorId] = React.useState(sensor.id);
  const [lat, setLat] = React.useState(String(sensor.lat));
  const [lng, setLng] = React.useState(String(sensor.lng));
  const [status, setStatus] = React.useState(sensor.status || 'online');

  const targetSite = sites.find(s => s.id === siteId) || site;
  const availableRows = targetSite.rowsList || [];

  const handleSave = () => {
    // TODO: PATCH /sensors/{sensor_id}
    //   headers: { Authorization: 'Bearer <token>' }
    //   body: {
    //     site_id: siteId, row_id: rowId,
    //     sensor_id: sensorId,
    //     lat: parseFloat(lat), lng: parseFloat(lng),
    //     status: status,
    //   }
    //   returns: { ok: true }
    onSave({
      ...sensor,
      id: sensorId,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      status,
    }, { fromSiteId: site.id, fromRowId: row.id, toSiteId: siteId, toRowId: rowId });
  };

  const handleDelete = () => {
    if (!confirm(`Delete sensor ${sensor.id}?`)) return;
    // TODO: DELETE /sensors/{sensor_id}
    onDelete(sensor, { siteId: site.id, rowId: row.id });
  };

  const reAcquireGps = () => {
    // TODO: navigator.geolocation.getCurrentPosition → update lat/lng
    const jitter = () => (Math.random() - 0.5) * 0.0008;
    setLat((parseFloat(lat) + jitter()).toFixed(4));
    setLng((parseFloat(lng) + jitter()).toFixed(4));
  };

  const Select = ({ label, value, onChange, options }) => (
    <label style={{ display: 'block' }}>
      <div style={{
        fontFamily: 'Barlow, system-ui', fontWeight: 600, fontSize: 12,
        color: '#5A7184', letterSpacing: '0.1em', textTransform: 'uppercase',
        whiteSpace: 'nowrap', marginBottom: 6,
      }}>{label}</div>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: '#F4F7FA', border: '1.5px solid #D6DFE8',
        borderRadius: 10, padding: '0 14px', height: 52,
      }}>
        <select value={value} onChange={e => onChange(e.target.value)} style={{
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
      <TopBar title="Edit Sensor" subtitle={sensor.id} onBack={onBack} />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px 24px', background: '#fff', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Select label="Site" value={siteId} onChange={(v) => {
          setSiteId(v);
          const newSite = sites.find(s => s.id === v);
          if (newSite && newSite.rowsList?.[0]) setRowId(newSite.rowsList[0].id);
        }}
          options={sites.map(s => ({ value: s.id, label: s.name }))} />
        <Select label="Row" value={rowId} onChange={setRowId}
          options={availableRows.length
            ? availableRows.map(r => ({ value: r.id, label: r.name }))
            : [{ value: '', label: 'No rows on this site' }]} />

        <FieldInput label="Sensor ID" value={sensorId} onChange={setSensorId}
          hint="Scan a new QR or edit manually." />

        <div>
          <div style={{
            fontFamily: 'Barlow, system-ui', fontWeight: 600, fontSize: 12,
            color: '#5A7184', letterSpacing: '0.1em', textTransform: 'uppercase',
            whiteSpace: 'nowrap', marginBottom: 6,
          }}>GPS Coordinates</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 10 }}>
            <FieldInput label="" value={lat} onChange={setLat} prefix="LAT" />
            <FieldInput label="" value={lng} onChange={setLng} prefix="LNG" />
          </div>
          <button onClick={reAcquireGps} style={{
            marginTop: 10, padding: '10px 14px', borderRadius: 10,
            border: '1.5px solid #D6DFE8', background: '#fff', cursor: 'pointer',
            fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 13,
            color: '#0B2545', letterSpacing: '0.04em', textTransform: 'uppercase',
            whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v3M7 10v3M1 7h3M10 7h3M3 3l2 2M9 9l2 2M3 11l2-2M9 5l2-2"
                stroke="#0B2545" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            Re-acquire from GPS
          </button>
        </div>

        <div>
          <div style={{
            fontFamily: 'Barlow, system-ui', fontWeight: 600, fontSize: 12,
            color: '#5A7184', letterSpacing: '0.1em', textTransform: 'uppercase',
            whiteSpace: 'nowrap', marginBottom: 6,
          }}>Status</div>
          <div style={{ display: 'flex', background: '#F4F7FA', borderRadius: 10, padding: 4, border: '1.5px solid #D6DFE8' }}>
            {[
              { v: 'online', label: 'Online' },
              { v: 'pending', label: 'Pending' },
              { v: 'fault', label: 'Fault' },
            ].map(o => (
              <button key={o.v} onClick={() => setStatus(o.v)} style={{
                flex: 1, padding: '10px', borderRadius: 8, border: 0, cursor: 'pointer',
                background: status === o.v ? '#fff' : 'transparent',
                boxShadow: status === o.v ? '0 1px 4px rgba(11,37,69,0.08)' : 'none',
                fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 13,
                color: status === o.v ? '#0B2545' : '#5A7184',
                letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap',
              }}>{o.label}</button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 8 }} />
        <PrimaryButton onClick={handleSave} disabled={!sensorId}>Save Changes</PrimaryButton>
        <DangerButton onClick={handleDelete}>Delete Sensor</DangerButton>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// RowDetailScreen — lists sensors with edit affordance
// ─────────────────────────────────────────────────────────────
function RowDetailScreen({ site, row, onBack, onEditRow, onAddSensor, onEditSensor }) {
  const sensors = row.sensorsList || [];
  return (
    <>
      <TopBar title={row.name} subtitle={site.name} onBack={onBack}
        right={
          <button onClick={onEditRow} style={{
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
        {/* row summary */}
        <div style={{ background: '#fff', margin: 16, borderRadius: 14, padding: 16, border: '1px solid #E5ECF2' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { label: 'Registered', value: `${sensors.length}/${row.expected}`, color: '#0B2545' },
              { label: 'Healthy', value: row.healthy, color: 'var(--brand-green, #39B54A)' },
              { label: 'Issues', value: sensors.filter(s => s.status === 'fault').length, color: '#DC2626' },
            ].map(s => (
              <div key={s.label}>
                <div style={{
                  fontFamily: 'Barlow, system-ui', fontWeight: 800, fontSize: 22,
                  color: s.color, lineHeight: 1, fontVariantNumeric: 'tabular-nums',
                }}>{s.value}</div>
                <div style={{
                  fontFamily: 'Barlow, system-ui', fontWeight: 600, fontSize: 11,
                  color: '#5A7184', letterSpacing: '0.08em', textTransform: 'uppercase',
                  whiteSpace: 'nowrap', marginTop: 4,
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* add sensor */}
        <div style={{ padding: '0 16px 16px' }}>
          <button onClick={onAddSensor} style={{
            width: '100%', padding: '14px', borderRadius: 12, border: 0,
            background: 'var(--brand-green, #39B54A)', color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 14,
            letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap',
            boxShadow: '0 4px 14px rgba(57,181,74,0.28)',
          }}>+ Register Sensor on this Row</button>
        </div>

        {/* sensor list */}
        <div style={{
          padding: '0 20px 12px',
          fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 13,
          color: '#5A7184', letterSpacing: '0.12em', textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>Sensors</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 16px 20px' }}>
          {sensors.length === 0 ? (
            <div style={{
              padding: '32px 20px', textAlign: 'center', background: '#fff',
              borderRadius: 12, border: '1.5px dashed #D6DFE8',
            }}>
              <div style={{
                fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 16, color: '#0B2545',
              }}>No sensors yet</div>
              <div style={{
                fontFamily: 'Barlow, system-ui', fontSize: 13, color: '#5A7184', marginTop: 4,
              }}>Scan the first sensor QR to start commissioning this row.</div>
            </div>
          ) : sensors.map((sensor, i) => (
            <button key={sensor.id} onClick={() => onEditSensor(sensor)} style={{
              background: '#fff', border: '1px solid #E5ECF2', borderRadius: 12,
              padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
              cursor: 'pointer', textAlign: 'left', width: '100%',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                background: sensor.status === 'online' ? '#E6F8EA' : sensor.status === 'fault' ? '#FDE5E5' : '#FFF3D6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Barlow, system-ui', fontWeight: 800, fontSize: 13,
                color: sensor.status === 'online' ? '#1F7A2D' : sensor.status === 'fault' ? '#9B1C1C' : '#8A5A00',
                fontVariantNumeric: 'tabular-nums',
              }}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'ui-monospace, "SF Mono", monospace', fontWeight: 600, fontSize: 13,
                  color: '#0B2545', lineHeight: 1.2,
                }}>{sensor.id}</div>
                <div style={{
                  fontFamily: 'ui-monospace, "SF Mono", monospace', fontSize: 11.5,
                  color: '#5A7184', marginTop: 4, fontVariantNumeric: 'tabular-nums',
                }}>{sensor.lat.toFixed(4)}, {sensor.lng.toFixed(4)}</div>
              </div>
              <StatusBadge tone={
                sensor.status === 'online' ? 'online' :
                sensor.status === 'fault' ? 'error' : 'pending'
              }>{sensor.status}</StatusBadge>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginLeft: 4 }}>
                <path d="M5 2l5 5-5 5" stroke="#C2CCD6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

Object.assign(window, {
  DangerButton, EditSiteScreen, EditRowScreen, EditSensorScreen, RowDetailScreen,
});
