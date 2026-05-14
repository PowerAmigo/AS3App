// Shared UI primitives — buttons, inputs, status badges, phone shell, bottom nav
// Industrial-utilitarian aesthetic: high contrast, large tap targets, no fluff

// ─────────────────────────────────────────────────────────────
// Phone shell — minimal hardware frame around the app surface
// ─────────────────────────────────────────────────────────────
function PhoneShell({ children, statusBarDark = false }) {
  return (
    <div style={{
      width: 390, height: 844, borderRadius: 48, overflow: 'hidden',
      position: 'relative', background: '#000',
      boxShadow: '0 40px 80px rgba(8,30,50,0.22), 0 0 0 1px rgba(0,0,0,0.18), 0 0 0 12px #1a1d22, 0 0 0 13px rgba(255,255,255,0.06)',
      fontFamily: 'Barlow, "DM Sans", system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased',
    }}>
      {/* Dynamic island */}
      <div style={{
        position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
        width: 120, height: 34, borderRadius: 24, background: '#000', zIndex: 50,
      }} />
      {/* Status bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 40,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 32px 0', height: 54, boxSizing: 'border-box',
        pointerEvents: 'none',
      }}>
        <span style={{
          fontFamily: '-apple-system, system-ui', fontWeight: 600, fontSize: 16,
          color: statusBarDark ? '#fff' : '#0B2545',
        }}>9:41</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {/* Signal */}
          <svg width="17" height="11" viewBox="0 0 17 11">
            {[3, 5, 7, 9].map((h, i) => (
              <rect key={i} x={i * 4} y={11 - h} width="3" height={h} rx="0.6"
                fill={statusBarDark ? '#fff' : '#0B2545'}/>
            ))}
          </svg>
          {/* Wifi */}
          <svg width="15" height="11" viewBox="0 0 15 11" fill={statusBarDark ? '#fff' : '#0B2545'}>
            <path d="M7.5 2.5C9.5 2.5 11.3 3.3 12.6 4.6L13.6 3.7C12 2.1 9.9 1.1 7.5 1.1C5.1 1.1 3 2.1 1.4 3.7L2.4 4.6C3.7 3.3 5.5 2.5 7.5 2.5Z"/>
            <path d="M7.5 5.7C8.7 5.7 9.8 6.2 10.6 7L11.5 6.1C10.4 5 9 4.4 7.5 4.4C6 4.4 4.6 5 3.5 6.1L4.4 7C5.2 6.2 6.3 5.7 7.5 5.7Z"/>
            <circle cx="7.5" cy="9.2" r="1.3"/>
          </svg>
          {/* Battery */}
          <svg width="25" height="12" viewBox="0 0 25 12">
            <rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none"
              stroke={statusBarDark ? 'rgba(255,255,255,0.5)' : 'rgba(11,37,69,0.5)'}/>
            <rect x="2" y="2" width="18" height="8" rx="1.5"
              fill={statusBarDark ? '#fff' : '#0B2545'}/>
            <rect x="22.5" y="4" width="2" height="4" rx="0.8"
              fill={statusBarDark ? 'rgba(255,255,255,0.5)' : 'rgba(11,37,69,0.5)'}/>
          </svg>
        </div>
      </div>
      {/* Content area */}
      <div style={{
        position: 'absolute', inset: 0, paddingTop: 54,
        display: 'flex', flexDirection: 'column',
      }}>
        {children}
      </div>
      {/* Home indicator */}
      <div style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        width: 134, height: 5, borderRadius: 100, background: 'rgba(0,0,0,0.35)',
        zIndex: 60, pointerEvents: 'none',
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Top app bar
// ─────────────────────────────────────────────────────────────
function TopBar({ title, subtitle, onBack, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 20px 16px', borderBottom: '1px solid #E5ECF2',
      background: '#fff', flexShrink: 0,
    }}>
      {onBack && (
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 10, border: '1.5px solid #D6DFE8',
          background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', padding: 0, flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="#0B2545" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 22,
          color: '#0B2545', lineHeight: 1.15, letterSpacing: '-0.01em',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{title}</div>
        {subtitle && (
          <div style={{
            fontFamily: 'Barlow, system-ui', fontWeight: 500, fontSize: 13,
            color: '#5A7184', marginTop: 2, letterSpacing: '0.04em',
            textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>{subtitle}</div>
        )}
      </div>
      {right}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Primary button — high-contrast, tappable
// ─────────────────────────────────────────────────────────────
function PrimaryButton({ children, onClick, variant = 'primary', icon, disabled, style = {} }) {
  const colors = {
    primary:   { bg: 'var(--brand-cyan, #00AEEF)', text: '#fff', shadow: '0 4px 14px rgba(0,174,239,0.32)' },
    secondary: { bg: '#fff', text: '#0B2545', shadow: '0 1px 0 #D6DFE8, 0 0 0 1.5px #D6DFE8 inset' },
    success:   { bg: 'var(--brand-green, #39B54A)', text: '#fff', shadow: '0 4px 14px rgba(57,181,74,0.32)' },
    ghost:     { bg: 'transparent', text: '#0B2545', shadow: 'none' },
  };
  const c = colors[variant];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', minHeight: 56, padding: '0 20px',
      background: disabled ? '#D6DFE8' : c.bg, color: disabled ? '#8A9BAD' : c.text,
      boxShadow: disabled ? 'none' : c.shadow, borderRadius: 12, border: 0,
      fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 17,
      letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'transform 0.06s ease',
      ...style,
    }}
      onMouseDown={e => !disabled && (e.currentTarget.style.transform = 'scale(0.98)')}
      onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {icon}
      <span style={{ whiteSpace: 'nowrap' }}>{children}</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Text input field with floating label
// ─────────────────────────────────────────────────────────────
function FieldInput({ label, value, onChange, type = 'text', placeholder, hint, prefix, autoFocus }) {
  return (
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
        {prefix && <span style={{ color: '#5A7184', marginRight: 8, fontWeight: 600 }}>{prefix}</span>}
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} autoFocus={autoFocus}
          style={{
            flex: 1, border: 0, outline: 0, background: 'transparent',
            fontFamily: 'Barlow, system-ui', fontWeight: 500, fontSize: 17,
            color: '#0B2545', minWidth: 0,
          }}
        />
      </div>
      {hint && (
        <div style={{
          fontFamily: 'Barlow, system-ui', fontSize: 13, color: '#5A7184',
          marginTop: 6,
        }}>{hint}</div>
      )}
    </label>
  );
}

// ─────────────────────────────────────────────────────────────
// Status badge — pill with optional dot
// ─────────────────────────────────────────────────────────────
function StatusBadge({ children, tone = 'neutral' }) {
  const tones = {
    online:  { bg: '#E6F8EA', text: '#1F7A2D', dot: 'var(--brand-green, #39B54A)' },
    pending: { bg: '#FFF3D6', text: '#8A5A00', dot: '#F2A900' },
    error:   { bg: '#FDE5E5', text: '#9B1C1C', dot: '#DC2626' },
    info:    { bg: '#E0F6FE', text: '#005F87', dot: 'var(--brand-cyan, #00AEEF)' },
    neutral: { bg: '#EEF2F6', text: '#3A5266', dot: '#5A7184' },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: t.bg, color: t.text, padding: '4px 10px',
      borderRadius: 100, fontFamily: 'Barlow, system-ui',
      fontWeight: 600, fontSize: 12, letterSpacing: '0.04em',
      textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 100, background: t.dot }} />
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom navigation
// ─────────────────────────────────────────────────────────────
function BottomNav({ active, onChange, alertCount = 0 }) {
  const items = [
    { id: 'dashboard', label: 'Sites', icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 9l8-6 8 6v10a1 1 0 01-1 1h-4v-6H8v6H4a1 1 0 01-1-1V9z"
          stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    )},
    { id: 'alerts', label: 'Alerts', icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 2a6 6 0 00-6 6v3l-2 4h16l-2-4V8a6 6 0 00-6-6zM8 17a3 3 0 006 0"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
    { id: 'settings', label: 'Settings', icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M11 1.5v3M11 17.5v3M20.5 11h-3M4.5 11h-3M17.7 4.3l-2.1 2.1M6.4 15.6l-2.1 2.1M17.7 17.7l-2.1-2.1M6.4 6.4L4.3 4.3"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    )},
  ];
  return (
    <div style={{
      display: 'flex', borderTop: '1px solid #E5ECF2',
      background: '#fff', padding: '8px 8px 28px', flexShrink: 0,
    }}>
      {items.map(it => {
        const isActive = active === it.id;
        return (
          <button key={it.id} onClick={() => onChange(it.id)} style={{
            flex: 1, background: 'transparent', border: 0, padding: '10px 4px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: isActive ? 'var(--brand-cyan, #00AEEF)' : '#5A7184',
            cursor: 'pointer', position: 'relative',
          }}>
            <div style={{ position: 'relative' }}>
              {it.icon}
              {it.id === 'alerts' && alertCount > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -8,
                  minWidth: 18, height: 18, borderRadius: 100, padding: '0 5px',
                  background: '#DC2626', color: '#fff', fontFamily: 'Barlow, system-ui',
                  fontWeight: 700, fontSize: 11, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  border: '2px solid #fff', boxSizing: 'content-box',
                }}>{alertCount}</span>
              )}
            </div>
            <span style={{
              fontFamily: 'Barlow, system-ui', fontWeight: 600, fontSize: 11,
              letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}>{it.label}</span>
            {isActive && (
              <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: 28, height: 3, borderRadius: 100,
                background: 'var(--brand-cyan, #00AEEF)',
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// QR Scanner viewfinder — animated corner brackets
// ─────────────────────────────────────────────────────────────
function QRScanner({ label = 'Tap to Scan', onScan }) {
  const [scanning, setScanning] = React.useState(false);
  const trigger = () => {
    setScanning(true);
    setTimeout(() => { setScanning(false); onScan && onScan(); }, 1400);
  };
  const corner = (rot) => (
    <div style={{
      position: 'absolute', width: 32, height: 32,
      transform: `rotate(${rot}deg)`,
      ...(rot === 0   ? { top: -2, left: -2 } : {}),
      ...(rot === 90  ? { top: -2, right: -2 } : {}),
      ...(rot === 180 ? { bottom: -2, right: -2 } : {}),
      ...(rot === 270 ? { bottom: -2, left: -2 } : {}),
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 32, height: 4, background: 'var(--brand-cyan, #00AEEF)', borderRadius: 2 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: 32, background: 'var(--brand-cyan, #00AEEF)', borderRadius: 2 }} />
    </div>
  );
  return (
    <button onClick={trigger} style={{
      width: '100%', aspectRatio: '1 / 1', position: 'relative',
      background: 'linear-gradient(135deg, #1a1d22 0%, #0B2545 100%)',
      borderRadius: 16, border: 0, cursor: 'pointer', padding: 0,
      overflow: 'hidden', flexShrink: 0,
    }}>
      {/* simulated camera noise grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.18,
        backgroundImage: 'radial-gradient(circle at 30% 40%, #00AEEF 0%, transparent 35%), radial-gradient(circle at 70% 60%, #39B54A 0%, transparent 35%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.04) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.04) 75%, rgba(255,255,255,0.04) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.04) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.04) 75%, rgba(255,255,255,0.04) 76%, transparent 77%, transparent)',
        backgroundSize: '40px 40px',
      }} />

      {/* viewfinder box */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60%', aspectRatio: '1 / 1',
      }}>
        {corner(0)}{corner(90)}{corner(180)}{corner(270)}
        {/* scanning laser */}
        {scanning && (
          <div style={{
            position: 'absolute', left: 4, right: 4, height: 2,
            background: 'linear-gradient(90deg, transparent, var(--brand-cyan, #00AEEF), transparent)',
            boxShadow: '0 0 12px var(--brand-cyan, #00AEEF)',
            animation: 'scan 1.4s ease-in-out',
          }} />
        )}
      </div>

      {/* label */}
      <div style={{
        position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center',
        fontFamily: 'Barlow, system-ui', fontWeight: 700, fontSize: 15,
        color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}>{scanning ? 'Scanning…' : label}</div>

      {/* camera icon top-left */}
      <div style={{
        position: 'absolute', top: 16, left: 16, display: 'flex',
        alignItems: 'center', gap: 6,
        fontFamily: 'Barlow, system-ui', fontWeight: 600, fontSize: 11,
        color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}>
        <span style={{ width: 8, height: 8, borderRadius: 100, background: '#DC2626', boxShadow: '0 0 8px #DC2626' }} />
        Camera
      </div>
    </button>
  );
}

Object.assign(window, {
  PhoneShell, TopBar, PrimaryButton, FieldInput, StatusBadge, BottomNav, QRScanner,
});
