const { Button, CameraShutter } = window.ToutouDexCompanionDesignSystem_d6706c;
const { Icon, CompanionType: T, Phone, NavBar, Photo, Body, Card, GhostLink, FieldPill } = window;

/* Album-mode entrance: wordmark pops, the three cards deal in one-two-three, copy follows. Fades only under reduced-motion. */
if (!document.getElementById('td-anim')) {
  const st = document.createElement('style'); st.id = 'td-anim';
  st.textContent = `
@keyframes td-pop{0%{opacity:0;transform:scale(.93)}60%{opacity:1;transform:scale(1.045)}100%{opacity:1;transform:scale(1)}}
@keyframes td-deal{0%{opacity:0;transform:translateY(48px) scale(.86)}55%{opacity:1;transform:translateY(-9px) scale(1.035)}78%{transform:translateY(3px) scale(.996)}100%{opacity:1;transform:none}}
@keyframes td-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes td-fade{from{opacity:0}to{opacity:1}}
.td-pop{animation:td-pop .6s cubic-bezier(.34,1.4,.5,1) both}
.td-deal{animation:td-deal .7s cubic-bezier(.34,1.4,.5,1) both}
.td-rise{animation:td-rise .5s cubic-bezier(.2,.8,.3,1) both}
@media (prefers-reduced-motion: reduce){.td-pop,.td-deal,.td-rise{animation-name:td-fade;animation-duration:.3s;animation-timing-function:linear}}`;
  document.head.appendChild(st);
}

function WelcomeScreen({ onStart, onBrowse }) {
  return <Phone>
    <Body pad="var(--space-lg)" gap="var(--space-md)">
      <div className="td-pop" style={{ ...T.displayXl, fontSize: 30, letterSpacing: '-.4px', lineHeight: 1, textAlign: 'center', paddingTop: 10 }}>ToutouDex</div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {[-14, 0, 14].map((r, i) => <div key={i} className="td-deal" style={{ position: 'absolute', animationDelay: (i === 1 ? .56 : i === 0 ? .3 : .43) + 's', zIndex: i === 1 ? 2 : 1 }}>
          <div style={{ transform: `rotate(${r}deg) translateX(${r * 9}px)`, width: 152, aspectRatio: '3/4', background: 'var(--surface)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)', padding: 'var(--space-sm)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Photo h="100%" style={{ flex: 1 }} size={i === 1 ? 38 : 32} />
            {i === 1 && <div style={{ ...T.bodyMdMed, textAlign: 'center', fontSize: 13 }}>Beagle</div>}
            {i !== 1 && <div style={{ height: 20, borderRadius: 6, background: 'var(--surface-sunken)', margin: '0 22px' }} />}
          </div>
        </div>)}
      </div>
      <div className="td-rise" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', animationDelay: '.8s' }}>
        <div style={T.displayXl}>Collect the dogs you meet</div>
        <div style={T.bodyMd}>Point your camera at any dog, learn its breed, and fill a field guide of every one you've crossed paths with.</div>
      </div>
      <div className="td-rise" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', animationDelay: '.94s' }}>
        <Button variant="primary" onClick={onStart} style={{ width: '100%' }}>Start scanning</Button>
        <GhostLink color="var(--muted)" onClick={onBrowse}>I'll look around first</GhostLink>
      </div>
    </Body>
  </Phone>;
}

function CameraScreen({ firstTime = true, queued = 0, showNav = false, albumRoute = 'pill', helpOpen = false, onShutter, onNav, onAlbum }) {
  const [help, setHelp] = React.useState(helpOpen);
  return <Phone field nav={showNav ? <NavBar active="scan" field onChange={onNav} /> : null}>
    <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <Photo h="100%" tone="field" r="0" size={120} style={{ position: 'absolute', inset: 0, height: 'auto' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 80% at 50% 45%, transparent 40%, rgba(15,33,27,.55) 100%)' }} />
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 16px', gap: 8 }}>
        {albumRoute === 'pill'
          ? <button onClick={onAlbum} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}><FieldPill icon="layout-grid">Album · 41</FieldPill></button>
          : <span />}
        <span style={{ display: 'flex', gap: 8 }}><button onClick={() => setHelp(true)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}><FieldPill icon="circle-help" /></button><FieldPill icon="zap-off" /></span>
      </div>
      <div style={{ flex: 1 }} />
      {queued > 0 && <div style={{ position: 'relative', alignSelf: 'center', marginBottom: 10 }}><FieldPill icon="cloud-off" tone="solid">{queued} scan{queued > 1 ? 's' : ''} waiting for signal</FieldPill></div>}
      {firstTime && <div style={{ position: 'relative', alignSelf: 'center', marginBottom: 18, maxWidth: 300, textAlign: 'center', ...T.bodySm, color: 'var(--on-field)', background: 'rgba(23,51,42,.72)', borderRadius: 'var(--radius-md)', padding: '10px 16px', backdropFilter: 'blur(4px)' }}>Get the whole dog in frame, then tap</div>}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px 22px' }}>
        <Photo h={48} tone="field" icon="images" size={20} r="var(--radius-sm)" style={{ width: 48, border: '1px solid rgba(255,255,255,.25)' }} />
        <CameraShutter active onPress={onShutter} />
        <button style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,.12)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon n="switch-camera" size={21} color="var(--on-field)" /></button>
      </div>
      {help && <div onClick={() => setHelp(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(15,33,27,.6)', display: 'flex', alignItems: 'flex-end', zIndex: 30 }}>
        <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: 'var(--surface-field-elevated)', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0', padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <div style={{ ...T.displayMd, color: 'var(--on-field)' }}>Getting a clean scan</div>
          {[['maximize', 'The dog fills about half the frame'], ['sun', 'Light on the dog, not behind it'], ['move-horizontal', 'Side-on reads better than head-on']].map(([ic, t]) => <div key={t} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Icon n={ic} size={18} color="var(--on-field-muted)" />
            <span style={{ ...T.bodyMd, color: 'var(--on-field)' }}>{t}</span>
          </div>)}
          <div style={{ ...T.bodySm, color: 'var(--on-field-muted)' }}>Photos stay on your phone. Only the breed guess and the place are saved.</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}><GhostLink color="var(--on-field)" onClick={() => setHelp(false)}>Got it</GhostLink></div>
        </div>
      </div>}
      {albumRoute === 'swipe' && !showNav && <button onClick={onAlbum} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, paddingBottom: 6 }}>
        <Icon n="chevron-up" size={18} color="var(--on-field-muted)" />
        <span style={{ ...T.caption, color: 'var(--on-field-muted)' }}>Swipe up for your album</span>
      </button>}
    </div>
  </Phone>;
}

function FrameScreen({ firstTime = true, onConfirm, onRetake }) {
  return <Phone field>
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 16px 10px' }}>
        <GhostLink icon="rotate-ccw" color="var(--on-field-muted)" onClick={onRetake}>Retake</GhostLink>
        <span style={{ ...T.label, color: 'var(--on-field-muted)' }}>Frame the dog</span>
        <span style={{ width: 76 }} />
      </div>
      <div style={{ flex: 1, minHeight: 0, position: 'relative', margin: '0 16px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <Photo h="100%" tone="field" r="0" size={110} style={{ position: 'absolute', inset: 0, height: 'auto' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,33,27,.5)' }} />
        <div style={{ position: 'absolute', left: 46, right: 46, top: 130, bottom: 150, border: '1.5px solid var(--accent)', borderRadius: 4, boxShadow: 'var(--shadow-field-glow)', background: 'rgba(0,0,0,0)' }}>
          {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([x, y], i) => <span key={i} style={{ position: 'absolute', [x ? 'right' : 'left']: -7, [y ? 'bottom' : 'top']: -7, width: 16, height: 16, borderRadius: 4, background: 'var(--accent)' }} />)}
          <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon n="dog" size={90} color="rgba(255,255,255,.14)" /></span>
        </div>
      </div>
      <div style={{ padding: '16px 16px 20px', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        {firstTime && <div style={{ ...T.bodySm, color: 'var(--on-field-muted)', textAlign: 'center' }}>Drag the corners so the dog fills the box</div>}
        <Button variant="primary" onClick={onConfirm} style={{ width: '100%' }}>Identify this dog</Button>
      </div>
    </div>
  </Phone>;
}

function AnalyzingScreen({ onCancel }) {
  return <Phone field>
    <Body center gap="var(--space-lg)" style={{ alignItems: 'center', textAlign: 'center' }}>
      <style>{`@keyframes tdpulse{0%,100%{transform:scale(1);opacity:.55}50%{transform:scale(1.04);opacity:1}}@media (prefers-reduced-motion:reduce){.tdpulse{animation:none!important}}`}</style>
      <div className="tdpulse" style={{ width: 236, height: 236, borderRadius: '50%', padding: 8, background: 'conic-gradient(from -90deg, var(--accent) 0 25%, rgba(242,169,59,.15) 25% 100%)', animation: 'tdpulse 1.4s var(--easing-standard) infinite' }}>
        <Photo h="100%" tone="field" r="50%" size={72} style={{ border: '4px solid var(--canvas-field)' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ ...T.displayMd, color: 'var(--on-field)' }}>Reading the fur…</div>
        <div style={{ ...T.bodySm, color: 'var(--on-field-muted)' }}>Comparing against 130 breeds</div>
      </div>
      <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <GhostLink color="var(--on-field-muted)" onClick={onCancel}>Cancel</GhostLink>
      </div>
    </Body>
  </Phone>;
}

Object.assign(window, { WelcomeScreen, CameraScreen, FrameScreen, AnalyzingScreen });
