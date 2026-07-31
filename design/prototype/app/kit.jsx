const DS = window.ToutouDexCompanionDesignSystem_d6706c;
const ICON = n => `https://unpkg.com/lucide-static@latest/icons/${n}.svg`;

/* Icons follow the design system's own technique: <img> + filter tint (mask-image does not survive every render path). */
const ICON_FILTER = {
  'var(--on-field)': 'brightness(0) invert(1)',
  'var(--on-primary)': 'brightness(0) invert(1)',
  'var(--on-secondary)': 'brightness(0) invert(1)',
  'var(--canvas)': 'brightness(0) invert(1)',
  '#fff': 'brightness(0) invert(1)',
  '#FFFFFF': 'brightness(0) invert(1)',
  white: 'brightness(0) invert(1)',
  'var(--accent)': 'invert(72%) sepia(48%) saturate(1180%) hue-rotate(340deg) brightness(101%) contrast(92%)',
  'var(--error)': 'invert(30%) sepia(46%) saturate(1600%) hue-rotate(333deg) brightness(94%) contrast(88%)',
  'var(--success)': 'invert(45%) sepia(24%) saturate(866%) hue-rotate(93deg) brightness(92%) contrast(88%)',
  'var(--on-field-muted)': 'brightness(0) invert(1) opacity(.65)',
  'var(--ink)': 'brightness(0) opacity(.88)',
  'var(--body)': 'brightness(0) opacity(.74)',
  'var(--muted)': 'brightness(0) opacity(.55)',
  'var(--muted-soft)': 'brightness(0) opacity(.4)',
  'var(--on-accent)': 'brightness(0) opacity(.85)',
  'var(--primary)': 'invert(31%) sepia(18%) saturate(1032%) hue-rotate(112deg) brightness(94%) contrast(90%)',
  'var(--secondary)': 'invert(43%) sepia(38%) saturate(624%) hue-rotate(158deg) brightness(91%) contrast(88%)',
  'var(--accent-deep)': 'invert(58%) sepia(58%) saturate(950%) hue-rotate(1deg) brightness(92%) contrast(90%)',
  'currentColor': 'brightness(0) opacity(.8)',
};
function iconFilter(c) {
  if (ICON_FILTER[c]) return ICON_FILTER[c];
  if (typeof c === 'string' && c.startsWith('rgba(255')) return 'brightness(0) invert(1) opacity(.22)';
  if (typeof c === 'string' && c.startsWith('rgba(169')) return 'brightness(0) invert(1) opacity(.3)';
  if (typeof c === 'string' && c.startsWith('rgba(')) return 'brightness(0) opacity(.3)';
  return 'brightness(0) opacity(.8)';
}
function Icon({ n, size = 20, color = 'currentColor', style }) {
  return <img src={ICON(n)} alt="" style={{ display: 'block', width: size, height: size, flex: 'none', filter: iconFilter(color), ...style }} />;
}

const CompanionType = {
  displayXl: { fontFamily: 'var(--font-display)', fontSize: 'var(--display-xl-size)', fontWeight: 600, lineHeight: 'var(--display-xl-lh)', letterSpacing: 'var(--display-xl-ls)', color: 'var(--ink)' },
  displayLg: { fontFamily: 'var(--font-display)', fontSize: 'var(--display-lg-size)', fontWeight: 600, lineHeight: 'var(--display-lg-lh)', letterSpacing: 'var(--display-lg-ls)', color: 'var(--ink)' },
  displayMd: { fontFamily: 'var(--font-display)', fontSize: 'var(--display-md-size)', fontWeight: 600, lineHeight: 'var(--display-md-lh)', color: 'var(--ink)' },
  headingSm: { fontFamily: 'var(--font-ui)', fontSize: 'var(--heading-sm-size)', fontWeight: 600, lineHeight: 1.3, color: 'var(--ink)' },
  bodyMd: { fontFamily: 'var(--font-ui)', fontSize: 'var(--body-md-size)', fontWeight: 400, lineHeight: 1.5, color: 'var(--body)' },
  bodyMdMed: { fontFamily: 'var(--font-ui)', fontSize: 'var(--body-md-size)', fontWeight: 500, lineHeight: 1.5, color: 'var(--ink)' },
  bodySm: { fontFamily: 'var(--font-ui)', fontSize: 'var(--body-sm-size)', fontWeight: 400, lineHeight: 1.45, color: 'var(--body)' },
  caption: { fontFamily: 'var(--font-ui)', fontSize: 'var(--caption-size)', fontWeight: 500, lineHeight: 1.4, letterSpacing: 'var(--caption-ls)', color: 'var(--muted)' },
  label: { fontFamily: 'var(--font-ui)', fontSize: 'var(--label-uppercase-size)', fontWeight: 600, lineHeight: 1.3, letterSpacing: 'var(--label-uppercase-ls)', textTransform: 'uppercase', color: 'var(--muted)' },
  dataLg: { fontFamily: 'var(--font-mono)', fontSize: 'var(--data-lg-size)', fontWeight: 500, lineHeight: 1.1, color: 'var(--ink)' },
  dataSm: { fontFamily: 'var(--font-mono)', fontSize: 'var(--data-sm-size)', fontWeight: 500, lineHeight: 1.2, letterSpacing: 'var(--data-sm-ls)', color: 'var(--body)' },
};

function StatusBar({ field }) {
  const c = field ? 'var(--on-field-muted)' : 'var(--muted)';
  return <div style={{ height: 30, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: c }}>
    <span>9:41</span>
    <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}><Icon n="signal" size={13} color={c} /><Icon n="wifi" size={13} color={c} /><Icon n="battery-full" size={15} color={c} /></span>
  </div>;
}

function Phone({ children, field = false, nav = null, style }) {
  return <div style={{ width: 412, height: 915, borderRadius: 38, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', background: field ? 'var(--canvas-field)' : 'var(--canvas)', boxShadow: 'var(--shadow-elevated)', ...style }}>
    <StatusBar field={field} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>{children}</div>
    {nav}
    <div style={{ height: 22, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: nav ? (field ? 'var(--surface-field)' : 'var(--surface)') : 'transparent' }}>
      <div style={{ width: 120, height: 4, borderRadius: 99, background: field ? 'rgba(255,255,255,.3)' : 'rgba(34,48,42,.22)' }} />
    </div>
  </div>;
}

/* Proposed DS addition: BottomNav with 5 slots + "coming later" tabs. Mirrors the DS BottomNav spec (64px, hairline top edge, raised marigold Scan). */
const NAV_TABS = [
  { k: 'album', l: 'Album', i: 'layout-grid' },
  { k: 'map', l: 'Map', i: 'map', soon: true },
  { k: 'scan', l: 'Scan', i: 'camera' },
  { k: 'game', l: 'Play', i: 'gamepad-2', soon: true },
  { k: 'you', l: 'You', i: 'user' },
];
function NavBar({ active = 'album', onChange, field = false, scanLabel }) {
  return <div style={{ height: 64, flex: 'none', display: 'grid', gridTemplateColumns: scanLabel ? '1fr 1fr 1.5fr 1fr 1fr' : 'repeat(5,1fr)', alignItems: 'center', background: field ? 'var(--surface-field)' : 'var(--surface)', borderTop: `1px solid ${field ? 'rgba(255,255,255,.09)' : 'var(--hairline)'}` }}>
    {NAV_TABS.map(t => {
      const isScan = t.k === 'scan', on = active === t.k;
      const col = on ? (field ? 'var(--on-field)' : 'var(--primary)') : (t.soon ? (field ? 'rgba(169,196,183,.5)' : 'var(--muted-soft)') : (field ? 'var(--on-field-muted)' : 'var(--muted)'));
      if (isScan && scanLabel) return <button key={t.k} onClick={() => onChange && onChange(t.k)} style={{ background: 'var(--accent)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: 50, borderRadius: 'var(--radius-pill)', boxShadow: 'var(--shadow-field-glow)', transform: 'translateY(-12px)', padding: '0 14px' }}>
        <Icon n="camera" size={21} color="var(--on-accent)" />
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13.5, fontWeight: 600, color: 'var(--on-accent)', whiteSpace: 'nowrap' }}>{scanLabel}</span>
      </button>;
      return <button key={t.k} onClick={() => onChange && onChange(t.k)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: col, transform: isScan ? 'translateY(-12px)' : on ? 'translateY(-2px)' : 'none', minHeight: 44 }}>
        <span style={{ width: isScan ? 50 : 26, height: isScan ? 50 : 26, borderRadius: '50%', background: isScan ? 'var(--accent)' : 'transparent', boxShadow: isScan ? 'var(--shadow-field-glow)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon n={t.i} size={isScan ? 24 : 21} color={isScan ? 'var(--on-accent)' : col} />
        </span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10.5, fontWeight: 600 }}>{t.l}</span>
        {on && !isScan && <span style={{ width: 4, height: 4, borderRadius: '50%', background: field ? 'var(--on-field)' : 'var(--primary)', marginTop: -2 }} />}
      </button>;
    })}
  </div>;
}

/* Proposed DS addition: ConfidenceRing — the Album-mode counterpart to ConfidenceMeter (which is Field-only, dark-pill). */
function ConfidenceRing({ segs, size = 190, thickness = 11, children }) {
  let acc = 0;
  const stops = segs.map(s => { const a = acc; acc += s.pct; return `${s.color} ${a}% ${acc}%`; });
  stops.push(`var(--surface-sunken) ${acc}% 100%`);
  return <div style={{ width: size, height: size, borderRadius: '50%', padding: thickness, background: `conic-gradient(from -90deg, ${stops.join(',')})`, flex: 'none' }}>
    <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--canvas)', background: 'var(--surface-sunken)' }}>{children}</div>
  </div>;
}

function Photo({ h, r = 'var(--radius-md)', tone = 'album', icon = 'dog', size = 44, style }) {
  return <div style={{ height: h, borderRadius: r, background: tone === 'field' ? 'linear-gradient(155deg,var(--surface-field),var(--canvas-field))' : 'linear-gradient(155deg,var(--surface-sunken),var(--hairline))', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flex: 'none', ...style }}>
    <Icon n={icon} size={size} color={tone === 'field' ? 'rgba(169,196,183,.28)' : 'rgba(113,128,122,.3)'} />
  </div>;
}

/* Tiny shared store so every independently-mounted frame on the canvas reacts to the Tweaks panel. */
const tweakStore = { v: {}, subs: new Set(), set(next) { this.v = next; this.subs.forEach(f => f(next)); } };
function useTweakValues() {
  const [v, setV] = React.useState(tweakStore.v);
  React.useEffect(() => { const f = x => setV(x); tweakStore.subs.add(f); return () => tweakStore.subs.delete(f); }, []);
  return v;
}
function Tweaked({ render }) { return render(useTweakValues()); }

function AppBar({ title, sub, left = 'chevron-left', right, onLeft }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 16px 10px', flex: 'none' }}>
    {left && <button onClick={onLeft} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', width: 44, height: 44, marginLeft: -10, display: 'flex', alignItems: 'center' }}><Icon n={left} size={24} color="var(--ink)" /></button>}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={CompanionType.displayMd}>{title}</div>
      {sub && <div style={{ ...CompanionType.dataSm, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>}
    </div>
    {right}
  </div>;
}

function Body({ children, pad = 'var(--space-md)', gap = 'var(--space-md)', center, style }) {
  return <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap, padding: pad, justifyContent: center ? 'center' : 'flex-start', ...style }}>{children}</div>;
}

function Card({ children, tone = 'surface', style }) {
  const bg = { surface: 'var(--surface)', sunken: 'var(--surface-sunken)', fact: 'var(--secondary-soft)', reward: 'var(--accent-soft)' }[tone];
  return <div style={{ background: bg, borderRadius: 'var(--radius-xl)', padding: 'var(--space-md)', boxShadow: tone === 'surface' ? 'var(--shadow-card)' : 'none', flex: 'none', ...style }}>{children}</div>;
}

function GhostLink({ children, icon, onClick, color = 'var(--body)' }) {
  return <button onClick={onClick} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 44, padding: '10px 12px', fontFamily: 'var(--font-ui)', fontSize: 'var(--button-size)', fontWeight: 600, color }}>
    {icon && <Icon n={icon} size={17} color={color} />}{children}
  </button>;
}

function FieldPill({ children, icon, tone = 'dim' }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, borderRadius: 'var(--radius-pill)', padding: '8px 14px', background: tone === 'dim' ? 'rgba(23,51,42,.72)' : 'var(--surface-field-elevated)', color: 'var(--on-field)', fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500, backdropFilter: 'blur(4px)' }}>
    {icon && <Icon n={icon} size={15} color="var(--on-field)" />}{children}
  </span>;
}

/* One scan affordance per screen: the raised nav button. This renders the *invitation* to use it, never a second filled circle above it. */
function ScanInvite({ label, mode = 'arrow', onScan }) {
  if (mode !== 'arrow') return null;
  return <button onClick={onScan} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '6px 0 2px', width: '100%', minHeight: 44 }}>
    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--button-size)', fontWeight: 600, color: 'var(--primary)' }}>{label}</span>
    <Icon n="chevron-down" size={18} color="var(--primary)" />
  </button>;
}

Object.assign(window, { DS, Icon, ICON, CompanionType, StatusBar, Phone, NavBar, ConfidenceRing, Photo, AppBar, Body, Card, GhostLink, FieldPill, tweakStore, useTweakValues, Tweaked, ScanInvite });
