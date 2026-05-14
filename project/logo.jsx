// Power Amigo logo — geometric starburst, 4 quadrants alternating cyan/green
function PowerAmigoLogo({ size = 48, showText = true, dark = false }) {
  const cyan = 'var(--brand-cyan, #00AEEF)';
  const green = 'var(--brand-green, #39B54A)';
  const text = dark ? '#fff' : '#0B2545';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <svg width={size} height={size} viewBox="0 0 64 64" style={{ flexShrink: 0 }}>
        {/* 4-quadrant starburst — each quadrant a pinched petal */}
        {/* Top-left: cyan */}
        <path d="M32 32 L32 4 Q28 18 4 32 Z" fill={cyan}/>
        {/* Top-right: green */}
        <path d="M32 32 L60 32 Q46 28 32 4 Z" fill={green}/>
        {/* Bottom-right: cyan */}
        <path d="M32 32 L32 60 Q36 46 60 32 Z" fill={cyan}/>
        {/* Bottom-left: green */}
        <path d="M32 32 L4 32 Q18 36 32 60 Z" fill={green}/>
      </svg>
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{
            fontFamily: 'Barlow, system-ui', fontWeight: 800, fontSize: size * 0.42,
            letterSpacing: '-0.01em', color: text, textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>Power Amigo</span>
          <span style={{
            fontFamily: 'Barlow, system-ui', fontWeight: 500, fontSize: size * 0.22,
            letterSpacing: '0.18em', color: dark ? 'rgba(255,255,255,0.6)' : '#5A7184',
            textTransform: 'uppercase', marginTop: 4,
            whiteSpace: 'nowrap',
          }}>Field App</span>
        </div>
      )}
    </div>
  );
}

window.PowerAmigoLogo = PowerAmigoLogo;
