const { Button, TextInput, CollectionCard } = window.ToutouDexCompanionDesignSystem_d6706c;
const { Icon, CompanionType: T, Phone, NavBar, Photo, AppBar, Body, Card, GhostLink, Sheet } = window;

function Row({ icon, label, sub, right, danger, onClick }) {
  return <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', borderBottom: '1px solid var(--hairline-soft)', padding: '14px 4px', cursor: 'pointer', textAlign: 'left', width: '100%', minHeight: 44 }}>
    {icon && <Icon n={icon} size={19} color={danger ? 'var(--error)' : 'var(--muted)'} />}
    <span style={{ flex: 1 }}>
      <span style={{ ...T.bodyMdMed, color: danger ? 'var(--error)' : 'var(--ink)', display: 'block' }}>{label}</span>
      {sub && <span style={{ ...T.caption, display: 'block', marginTop: 2 }}>{sub}</span>}
    </span>
    {right || <Icon n="chevron-right" size={18} color="var(--muted-soft)" />}
  </button>;
}

function Toggle({ on }) {
  return <span style={{ width: 44, height: 26, borderRadius: 99, background: on ? 'var(--primary)' : 'var(--surface-sunken)', border: on ? 'none' : '1px solid var(--hairline)', display: 'flex', alignItems: 'center', padding: 3, justifyContent: on ? 'flex-end' : 'flex-start' }}>
    <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--surface)', boxShadow: 'var(--shadow-card)' }} />
  </span>;
}

/* S02 — camera permanently denied. The one screen that must not be a dead end. */
function CameraBlockedScreen({ onSettings, onBrowse }) {
  return <Phone>
    <Body gap="var(--space-md)" style={{ alignItems: 'center', textAlign: 'center' }}>
      <div style={{ flex: 1 }} />
      <span style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon n="camera-off" size={30} color="var(--body)" /></span>
      <div style={T.displayMd}>ToutouDex needs the camera</div>
      <div style={T.bodyMd}>Spotting breeds means looking at a dog. Turn the camera on in Settings and you're back in the field.</div>
      <div style={{ flex: 1 }} />
      <Button variant="primary" onClick={onSettings} style={{ width: '100%' }}>Open settings</Button>
      <GhostLink color="var(--muted)" onClick={onBrowse}>Browse the breeds instead</GhostLink>
    </Body>
  </Phone>;
}

/* S20 — asked on the first successful result, never at launch. */
function LocationSheet({ onAllow, onSkip }) {
  return <Phone>
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', filter: 'blur(1.5px)', opacity: .55 }}>
      <Photo h={190} style={{ width: 190 }} r="50%" size={60} />
      <div style={T.displayLg}>Bernese Mountain Dog</div>
    </div>
    <Sheet onClose={onSkip}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--secondary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon n="map-pin" size={22} color="var(--secondary)" /></span>
        <div>
          <div style={T.displayMd}>Remember where you met this one</div>
          <div style={{ ...T.bodyMd, marginTop: 6 }}>Each card keeps the spot you found it. Only you see it, and you can turn it off any time.</div>
        </div>
      </div>
      <Button variant="primary" onClick={onAllow} style={{ width: '100%' }}>Save the spot</Button>
      <div style={{ display: 'flex', justifyContent: 'center' }}><GhostLink color="var(--muted)" onClick={onSkip}>Not this time</GhostLink></div>
    </Sheet>
  </Phone>;
}

/* S38 — asked once, after the third discovery. */
function NotificationSheet({ onAllow, onSkip }) {
  return <Phone>
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10, filter: 'blur(1.5px)', opacity: .55 }}>
      <div style={T.displayMd}>Your field guide</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>{[0, 1, 2].map(i => <Photo key={i} h={126} r="var(--radius-xl)" size={26} />)}</div>
    </div>
    <Sheet onClose={onSkip}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon n="bell" size={21} color="var(--primary)" /></span>
        <div>
          <div style={T.displayMd}>A nudge when you're close</div>
          <div style={{ ...T.bodyMd, marginTop: 6 }}>One message when a shelf is nearly complete, and a weekly recap. Nothing else, ever.</div>
        </div>
      </div>
      <Button variant="primary" onClick={onAllow} style={{ width: '100%' }}>Turn on nudges</Button>
      <div style={{ display: 'flex', justifyContent: 'center' }}><GhostLink color="var(--muted)" onClick={onSkip}>No thanks</GhostLink></div>
    </Sheet>
  </Phone>;
}

/* S25 — search across all 130, collected or not. */
function SearchScreen({ empty = false, onBack, onNav, onClear }) {
  const hits = [['Jack Russell', 'Terriers', true], ['Russell Terrier', 'Terriers', false], ['Parson Russell', 'Terriers', false]];
  return <Phone nav={<NavBar active="album" onChange={onNav} />}>
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 16px 10px' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: 44, height: 44, display: 'flex', alignItems: 'center' }}><Icon n="chevron-left" size={24} color="var(--ink)" /></button>
      <div style={{ flex: 1, position: 'relative' }}>
        <TextInput value={empty ? 'shiba' : 'russell'} onChange={() => { }} placeholder="Search 130 breeds" style={{ width: '100%', paddingLeft: 42 }} />
        <span style={{ position: 'absolute', left: 14, top: 16 }}><Icon n="search" size={19} color="var(--muted)" /></span>
      </div>
    </div>
    <Body pad="0 16px 16px" gap="var(--space-sm)">
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['All', 'Collected', 'Missing', 'Rare'].map((f, i) => <button key={f} style={{ ...T.label, display: 'inline-flex', alignItems: 'center', minHeight: 44, borderRadius: 'var(--radius-pill)', padding: '7px 13px', cursor: 'pointer', background: i === 0 ? 'var(--primary)' : 'var(--surface)', color: i === 0 ? 'var(--on-primary)' : 'var(--muted)', border: i === 0 ? 'none' : '1px solid var(--hairline)' }}>{f}</button>)}
      </div>
      {empty
        ? <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 10 }}>
          <Icon n="search-x" size={34} color="var(--muted-soft)" />
          <div style={T.headingSm}>No breed called "shiba" here</div>
          <div style={{ ...T.bodySm, maxWidth: 250 }}>The model knows 130 breeds — this one isn't among them yet.</div>
          <GhostLink color="var(--primary)" onClick={onClear}>Clear search</GhostLink>
        </div>
        : <div style={{ display: 'flex', flexDirection: 'column' }}>
          {hits.map(([n, g, got]) => <button key={n} style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'none', border: 'none', borderBottom: '1px solid var(--hairline-soft)', padding: '10px 4px', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
            <Photo h={54} style={{ width: 42, opacity: got ? 1 : .5 }} size={20} r="var(--radius-sm)" />
            <span style={{ flex: 1 }}>
              <span style={{ ...T.bodyMdMed, display: 'block', color: got ? 'var(--ink)' : 'var(--muted)' }}>{got ? n : '??'}</span>
              <span style={{ ...T.caption, display: 'block' }}>{g}{got ? ' · collected' : ' · not met yet'}</span>
            </span>
            <Icon n={got ? 'chevron-right' : 'lock'} size={17} color="var(--muted-soft)" />
          </button>)}
        </div>}
    </Body>
  </Phone>;
}

/* S34 / S35 / S36 */
function SettingsScreen({ onBack, onNav, onData, onNotify, onLocation, onSignOut }) {
  return <Phone nav={<NavBar active="you" onChange={onNav} />}>
    <AppBar title="Settings" onLeft={onBack} />
    <Body pad="0 16px 16px" gap="var(--space-lg)">
      <div>
        <div style={{ ...T.label, marginBottom: 4 }}>Account</div>
        <Row icon="user" label="lucas@example.com" sub="Signed in · synced 2 minutes ago" />
        <Row icon="cloud-upload" label="Back up photos" right={<Toggle />} />
      </div>
      <div>
        <div style={{ ...T.label, marginBottom: 4 }}>App</div>
        <Row icon="bell" label="Notifications" sub="Milestones on · weekly recap off" onClick={onNotify} />
        <Row icon="map-pin" label="Location" sub="Saved with each scan" onClick={onLocation} />
        <Row icon="images" label="Library imports" sub="Marked, and left off the map" right={<Toggle on />} />
      </div>
      <div>
        <div style={{ ...T.label, marginBottom: 4 }}>Data</div>
        <Row icon="shield" label="Data & privacy" onClick={onData} />
        <Row icon="circle-help" label="How ToutouDex works" />
        <Row icon="info" label="About · v1.0" right={<span />} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}><GhostLink color="var(--muted)" onClick={onSignOut}>Sign out</GhostLink></div>
    </Body>
  </Phone>;
}

function DataPrivacyScreen({ confirming = false, onBack, onNav, onDelete, onConfirmDelete, onCancelDelete }) {
  const [typed, setTyped] = React.useState('');
  const armed = typed.trim().toUpperCase() === 'DELETE';
  React.useEffect(() => { if (!confirming) setTyped(''); }, [confirming]);
  return <Phone nav={<NavBar active="you" onChange={onNav} />}>
    <AppBar title="Data & privacy" onLeft={onBack} />
    <Body pad="0 16px 16px" gap="var(--space-md)">
      <Card tone="sunken">
        <div style={T.bodyMd}>Your collection is 41 breeds and 68 photos. Photos are stored on this phone; only breed names and dates sync to your account.</div>
      </Card>
      <div>
        <Row icon="download" label="Export my collection" sub="A single file with every breed, date and place" />
        <Row icon="image-off" label="Delete all photos" sub="Breeds stay discovered" />
        <Row icon="trash-2" label="Delete my account" sub="Everything goes, on every device" danger onClick={onDelete} />
      </div>
      <div style={{ flex: 1 }} />
    </Body>
    {confirming && <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,33,27,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 40 }}>
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', boxShadow: 'var(--shadow-elevated)' }}>
        <div style={T.displayMd}>Delete everything?</div>
        <div style={T.bodyMd}>41 breeds and 68 photos will be removed from every device. This cannot be undone.</div>
        <TextInput value={typed} onChange={e => setTyped(e.target.value)} placeholder="Type DELETE to confirm" />
        <Button variant="primary" onClick={armed ? onConfirmDelete : undefined} style={{ width: '100%', background: armed ? 'var(--error)' : 'var(--surface-sunken)', color: armed ? 'var(--on-primary)' : 'var(--muted-soft)', cursor: armed ? 'pointer' : 'not-allowed' }}>Delete my account</Button>
        <GhostLink color="var(--muted)" onClick={onCancelDelete}>Keep my collection</GhostLink>
      </div>
    </div>}
  </Phone>;
}

/* S17 / S18 — the two network failures, both ending on an action. */
function OfflineScreen({ onKeepScanning, onClose, onRetryNow }) {
  return <Phone>
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '4px 12px' }}><button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 10 }}><Icon n="x" size={22} color="var(--body)" /></button></div>
    <Body gap="var(--space-md)">
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <Photo h={96} style={{ width: 96 }} r="var(--radius-lg)" size={30} />
        <div>
          <div style={T.displayMd}>Saved for later</div>
          <div style={{ ...T.bodyMd, marginTop: 4 }}>No signal out here. We'll identify this one the moment you're back online.</div>
        </div>
      </div>
      <Card tone="sunken" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Icon n="cloud-off" size={18} color="var(--muted)" />
        <span style={{ ...T.bodySm, flex: 1 }}>2 scans waiting</span>
        <span style={{ ...T.dataSm, color: 'var(--muted)' }}>queued</span>
      </Card>
      <div style={{ flex: 1 }} />
      <Button variant="primary" onClick={onKeepScanning} style={{ width: '100%' }}>Keep scanning</Button>
      <div style={{ display: 'flex', justifyContent: 'center' }}><GhostLink color="var(--muted)" onClick={onRetryNow}>Try again now</GhostLink></div>
    </Body>
  </Phone>;
}

function ServerErrorScreen({ onRetry, onClose, onSaveLater }) {
  return <Phone>
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '4px 12px' }}><button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 10 }}><Icon n="x" size={22} color="var(--body)" /></button></div>
    <Body gap="var(--space-md)" style={{ alignItems: 'center', textAlign: 'center' }}>
      <div style={{ flex: 1 }} />
      <span style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon n="server-crash" size={30} color="var(--body)" /></span>
      <div style={T.displayMd}>That one didn't get through</div>
      <div style={T.bodyMd}>Our side, not yours. Your photo is still here — try again in a moment.</div>
      <div style={{ flex: 1 }} />
      <Button variant="primary" onClick={onRetry} style={{ width: '100%' }}>Try again</Button>
      <GhostLink color="var(--muted)" onClick={onSaveLater}>Save it for later</GhostLink>
    </Body>
  </Phone>;
}

Object.assign(window, { Row, Toggle, CameraBlockedScreen, LocationSheet, NotificationSheet, SearchScreen, SettingsScreen, DataPrivacyScreen, OfflineScreen, ServerErrorScreen });
