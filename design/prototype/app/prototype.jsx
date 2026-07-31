const { CompanionType: PT, Icon: PIcon } = window;

const GROUPS = [
  ['Scan chain', [['welcome', 'S01 Welcome'], ['camera', 'S03 Camera'], ['camera-help', 'S03b Camera — how to scan'], ['frame', 'S04 Frame the dog'], ['analyzing', 'S05 Analyzing']]],
  ['Outcomes', [['result-new', 'S06 Breed found'], ['celebrate', 'S07 New breed'], ['metagain', 'S09 Met again'], ['mix', 'S11 Looks like a mix'], ['unsure', 'S13 Not sure'], ['nodog', 'S15 No dog found']]],
  ['Album', [['album', 'S21 Album home'], ['shelf', 'S22 Group shelf'], ['breedcard', 'S08 Breed card'], ['locked', 'S23 Locked breed'], ['search', 'S25 Search — results'], ['search-empty', 'S25b Search — no match'], ['map', 'S26 Map teaser'], ['game', 'S40 Play teaser'], ['profile', 'S29 Profile']]],
  ['Account', [['save', 'S30 Keep it safe'], ['signup', 'S31 Create account'], ['signin', 'S32 Sign in'], ['signin-error', 'S32b Sign in — error'], ['reset', 'S33 Reset link sent'], ['merge', 'S37 Two collections'], ['chooseone', 'S39 Choose one instead']]],
  ['System', [['camera-blocked', 'S02 Camera blocked'], ['location', 'S20 Location'], ['notify', 'S38 Notifications'], ['settings', 'S34 Settings'], ['privacy', 'S36 Data & privacy'], ['privacy-confirm', 'S36b Delete — confirm'], ['offline', 'S17 Offline queued'], ['server', 'S18 Server error']]],
];
const RESULTS = [['new', 'New breed'], ['dup', 'Met again'], ['mix', 'Mix'], ['unsure', 'Not sure'], ['nodog', 'No dog'], ['server', 'Server error']];
const RESULT_ROUTE = { new: 'result-new', dup: 'metagain', mix: 'mix', unsure: 'unsure', nodog: 'nodog', server: 'server' };
const LABELS = Object.fromEntries(GROUPS.flatMap(([, rows]) => rows));

/* S13 serves three callers, so its three candidates must match whatever confidence sent the
   user there — a Bernese result cannot offer hound guesses. */
const CANDS = {
  hound: [['Beagle', 38, 'Shorter legs, white tail tip'], ['English Foxhound', 29, 'Taller, longer muzzle'], ['Harrier', 18, 'Sits between the two in size']],
  bernese: [['Bernese Mountain Dog', 84, 'Full white blaze, tan over each eye'], ['Greater Swiss Mountain Dog', 9, 'Shorter coat, heavier build'], ['Appenzeller Sennenhund', 4, 'Smaller, tail curls over the back']],
  mix: [['Labrador Retriever', 44, 'Otter tail, no mask'], ['Siberian Husky', 31, 'Blue or parti eyes, facial mask'], ['Alaskan Malamute', 12, 'Bigger, brown eyes, plumed tail']],
};

const INITIAL = { route: 'welcome', loggedIn: false, offline: false, cameraBlocked: false, location: false, notifications: false, notifAsked: false, locationAsked: false, accountNudgeShown: false, breeds: 41, discoveries: 0, next: 'new', searchEmpty: false, queued: 0, dupCount: 4, dupUndone: false, dupToast: false, unsureSet: 'hound' };

const protoUI = {
  panel: { width: 292, flex: 'none', height: '100%', overflowY: 'auto', background: 'var(--surface)', borderRight: '1px solid var(--hairline)', padding: '18px 16px 40px', display: 'flex', flexDirection: 'column', gap: 16 },
  group: { display: 'flex', flexDirection: 'column', gap: 3 },
  item: on => ({ textAlign: 'left', background: on ? 'var(--primary-soft)' : 'none', color: on ? 'var(--primary)' : 'var(--body)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '7px 9px', font: '500 12.5px var(--font-ui)', cursor: 'pointer' }),
  chip: on => ({ background: on ? 'var(--primary)' : 'var(--surface-sunken)', color: on ? 'var(--on-primary,#fff)' : 'var(--body)', border: on ? 'none' : '1px solid var(--hairline)', borderRadius: 'var(--radius-pill)', padding: '5px 11px', font: '600 11.5px var(--font-ui)', cursor: 'pointer' }),
  row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '5px 0' },
  sw: on => ({ width: 38, height: 22, flex: 'none', borderRadius: 99, border: on ? 'none' : '1px solid var(--hairline)', background: on ? 'var(--primary)' : 'var(--surface-sunken)', display: 'flex', alignItems: 'center', justifyContent: on ? 'flex-end' : 'flex-start', padding: 2, cursor: 'pointer' }),
  knob: { width: 18, height: 18, borderRadius: '50%', background: 'var(--surface)', boxShadow: 'var(--shadow-card)' },
};

function PanelSection({ label, children }) {
  return <div style={protoUI.group}>
    <div style={{ ...PT.label, marginBottom: 4 }}>{label}</div>
    {children}
  </div>;
}
function Switch({ label, on, onChange }) {
  return <div style={protoUI.row}>
    <span style={{ ...PT.bodySm, color: 'var(--ink)' }}>{label}</span>
    <button onClick={() => onChange(!on)} style={protoUI.sw(on)}><span style={protoUI.knob} /></button>
  </div>;
}

function Prototype() {
  const [s, setS] = React.useState(() => {
    try { const raw = localStorage.getItem('toutoudex-proto'); if (raw) { const { dupUndone, dupToast, ...saved } = JSON.parse(raw); return { ...INITIAL, ...saved }; } } catch (e) { }
    return INITIAL;
  });
  const hist = React.useRef([]);
  const pending = React.useRef([]);
  const [scale, setScale] = React.useState(1);

  /* dupUndone/dupToast are transient — persisting them restores a reversal whose toast has already expired. */
  React.useEffect(() => { try { const { dupUndone, dupToast, ...keep } = s; localStorage.setItem('toutoudex-proto', JSON.stringify(keep)); } catch (e) { } }, [s]);
  React.useEffect(() => {
    const fit = () => setScale(Math.min(1, (window.innerHeight - 96) / 915));
    fit(); window.addEventListener('resize', fit); return () => window.removeEventListener('resize', fit);
  }, []);

  const go = (route, patch) => { hist.current.push(s.route); setS(v => ({ ...v, route, ...patch })); };
  const jump = route => { hist.current = []; pending.current = []; setS(v => ({ ...v, route })); };
  const back = () => { const p = hist.current.pop(); if (p) setS(v => ({ ...v, route: p })); };

  React.useEffect(() => {
    if (s.route !== 'analyzing') return;
    const t = setTimeout(() => {
      if (s.offline) setS(v => ({ ...v, route: 'offline', queued: v.queued + 1 }));
      else setS(v => ({ ...v, route: RESULT_ROUTE[v.next] }));
    }, 1500);
    return () => clearTimeout(t);
  }, [s.route, s.offline, s.next]);

  /* The toast is timed separately from the reversal: dismissing it must not restore the sighting. */
  React.useEffect(() => {
    if (!s.dupToast) return;
    const t = setTimeout(() => setS(v => ({ ...v, dupToast: false })), 4000);
    return () => clearTimeout(t);
  }, [s.dupToast]);

  /* A discovery is filed, then the prompts that are owed get queued behind it. */
  const discover = () => {
    const d = s.discoveries + 1, q = [];
    if (!s.location && !s.locationAsked) q.push('location');
    if (d >= 3 && !s.notifications && !s.notifAsked) q.push('notify');
    if (d >= 5 && !s.loggedIn && !s.accountNudgeShown) q.push('save');
    q.push('breedcard');
    pending.current = q;
    setS(v => ({ ...v, breeds: v.breeds + 1, discoveries: d, route: q.shift() }));
  };
  const next = patch => {
    const r = pending.current.shift() || 'album';
    setS(v => ({ ...v, route: r, ...patch }));
  };
  const nav = k => jump(k === 'you' ? 'profile' : k === 'scan' ? (s.cameraBlocked ? 'camera-blocked' : 'camera') : k);
  const toCamera = () => jump(s.cameraBlocked ? 'camera-blocked' : 'camera');

  const R = {
    welcome: () => <WelcomeScreen onStart={toCamera} onBrowse={() => jump('album')} />,
    camera: () => <CameraScreen firstTime={s.discoveries === 0} queued={s.queued} albumRoute="pill" onShutter={() => go('frame')} onAlbum={() => jump('album')} onNav={nav} />,
    'camera-help': () => <CameraScreen helpOpen firstTime={false} queued={s.queued} albumRoute="pill" onShutter={() => go('frame')} onAlbum={() => jump('album')} onNav={nav} />,
    'camera-blocked': () => <CameraBlockedScreen onSettings={() => go('settings')} onBrowse={() => jump('album')} />,
    frame: () => <FrameScreen firstTime={s.discoveries === 0} onConfirm={() => go('analyzing')} onRetake={toCamera} />,
    analyzing: () => <AnalyzingScreen onCancel={toCamera} />,
    'result-new': () => <ResultBreedScreen onAdd={() => go('celebrate')} onClose={toCamera} onOthers={() => go('unsure', { unsureSet: 'bernese' })} />,
    celebrate: () => <ResultBreedScreen celebrate onAdd={discover} onClose={toCamera} />,
    metagain: () => <MetAgainScreen count={s.dupCount} undone={s.dupUndone} toast={s.dupToast} onUndo={() => setS(v => ({ ...v, dupUndone: true, dupToast: true }))} onRedo={() => setS(v => ({ ...v, dupUndone: false, dupToast: false }))} onSeeCard={() => go('breedcard')} onScanAnother={toCamera} onClose={() => jump('album')} />,
    mix: () => <MixScreen onAdd={discover} onClose={toCamera} onPurebred={() => go('unsure', { unsureSet: 'mix' })} />,
    unsure: () => <UnsureScreen cands={CANDS[s.unsureSet] || CANDS.hound} onPick={() => go('result-new')} onClose={toCamera} onNone={() => go('camera-help')} onRetake={() => go('frame')} />,
    nodog: () => <NoDogScreen onRetake={toCamera} onClose={() => jump('album')} onReframe={() => go('frame')} />,
    offline: () => <OfflineScreen onKeepScanning={toCamera} onClose={() => jump('album')} onRetryNow={() => go('analyzing')} />,
    server: () => <ServerErrorScreen onRetry={() => go('analyzing')} onClose={toCamera} onSaveLater={() => jump('album')} />,
    location: () => <LocationSheet onAllow={() => next({ location: true, locationAsked: true })} onSkip={() => next({ locationAsked: true })} />,
    notify: () => <NotificationSheet onAllow={() => next({ notifications: true, notifAsked: true })} onSkip={() => next({ notifAsked: true })} />,
    save: () => <SaveCollectionSheet onCreate={() => { setS(v => ({ ...v, accountNudgeShown: true })); go('signup'); }} onSignIn={() => { setS(v => ({ ...v, accountNudgeShown: true })); go('signin'); }} onDismiss={() => next({ accountNudgeShown: true })} />,
    signup: () => <SignUpScreen onBack={back} onSignIn={() => go('signin')} onSubmit={() => { hist.current = []; setS(v => ({ ...v, loggedIn: true, route: 'album' })); }} />,
    signin: () => <SignInScreen onBack={back} onReset={() => go('reset')} onSubmit={() => go(s.loggedIn ? 'album' : 'merge')} />,
    'signin-error': () => <SignInScreen error onBack={back} onReset={() => go('reset')} onSubmit={() => go('merge')} />,
    reset: () => <ResetSentScreen onBack={back} />,
    merge: () => <MergeScreen onKeepBoth={() => { hist.current = []; setS(v => ({ ...v, loggedIn: true, breeds: 47, route: 'album' })); }} onChooseOne={() => go('chooseone')} />,
    chooseone: () => <ChooseOneScreen onBack={back} onKeep={n => { hist.current = []; setS(v => ({ ...v, loggedIn: true, breeds: n, route: 'album' })); }} />,
    album: () => <AlbumHomeScreen onShelf={() => go('shelf')} onSearch={() => go(s.searchEmpty ? 'search-empty' : 'search')} onNav={nav} />,
    shelf: () => <GroupShelfScreen onBreed={() => go('breedcard')} onLocked={() => go('locked')} onBack={() => jump('album')} onNav={nav} />,
    breedcard: () => <BreedCardScreen onBack={back} onScan={toCamera} onNav={nav} />,
    locked: () => <LockedBreedScreen onBack={back} onScan={toCamera} onNav={nav} />,
    search: () => <SearchScreen onBack={back} onNav={nav} onClear={back} />,
    'search-empty': () => <SearchScreen empty onBack={back} onNav={nav} onClear={back} />,
    map: () => <MapTeaserScreen onScan={toCamera} onNav={nav} />,
    game: () => <GameTeaserScreen onScan={toCamera} onNav={nav} />,
    profile: () => <ProfileScreen anonymous={!s.loggedIn} onNav={nav} onSettings={() => go('settings')} onCreate={() => go('signup')} onSignIn={() => go('signin')} onData={() => go('privacy')} />,
    settings: () => <SettingsScreen onBack={back} onNav={nav} onData={() => go('privacy')} onNotify={() => go('notify')} onLocation={() => go('location')} onSignOut={() => { hist.current = []; pending.current = []; setS(v => ({ ...v, loggedIn: false, route: 'welcome' })); }} />,
    privacy: () => <DataPrivacyScreen onBack={back} onNav={nav} onDelete={() => go('privacy-confirm')} />,
    'privacy-confirm': () => <DataPrivacyScreen confirming onBack={back} onNav={nav} onCancelDelete={() => jump('privacy')} onConfirmDelete={() => { hist.current = []; setS({ ...INITIAL }); }} />,
  };

  return <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#E8E4DA' }}>
    <div style={protoUI.panel}>
      <div>
        <div style={{ ...PT.displayMd, fontSize: 20 }}>ToutouDex prototype</div>
        <div style={{ ...PT.bodySm, marginTop: 2 }}>31 screens, wired. Set the conditions, then walk it.</div>
      </div>
      <PanelSection label="Next scan returns">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {RESULTS.map(([k, l]) => <button key={k} onClick={() => setS(v => ({ ...v, next: k }))} style={protoUI.chip(s.next === k)}>{l}</button>)}
        </div>
      </PanelSection>
      <PanelSection label="Conditions">
        <Switch label="Signed in" on={s.loggedIn} onChange={v => setS(x => ({ ...x, loggedIn: v }))} />
        <Switch label="Offline" on={s.offline} onChange={v => setS(x => ({ ...x, offline: v }))} />
        <Switch label="Camera permission blocked" on={s.cameraBlocked} onChange={v => setS(x => ({ ...x, cameraBlocked: v }))} />
        <Switch label="Location granted" on={s.location} onChange={v => setS(x => ({ ...x, location: v }))} />
        <Switch label="Search finds nothing" on={s.searchEmpty} onChange={v => setS(x => ({ ...x, searchEmpty: v }))} />
        <div style={{ ...protoUI.row, borderTop: '1px solid var(--hairline-soft)', marginTop: 4, paddingTop: 8 }}>
          <span style={{ ...PT.bodySm, color: 'var(--ink)' }}>Sightings on repeat card</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {[-1, 1].map(d => <button key={d} onClick={() => setS(v => ({ ...v, dupCount: Math.min(10, Math.max(2, v.dupCount + d)), dupUndone: false, dupToast: false }))} style={{ ...protoUI.chip(false), padding: '3px 8px' }}>{d < 0 ? '−' : '+'}</button>)}
            <span style={{ ...PT.dataSm, minWidth: 16, textAlign: 'right' }}>{s.dupUndone ? s.dupCount - 1 : s.dupCount}</span>
          </span>
        </div>
        <div style={protoUI.row}>
          <span style={{ ...PT.bodySm, color: 'var(--ink)' }}>Breeds · discoveries</span>
          <span style={{ ...PT.dataSm }}>{s.breeds} · {s.discoveries}{s.queued ? ` · ${s.queued} queued` : ''}</span>
        </div>
        <button onClick={() => { hist.current = []; pending.current = []; setS({ ...INITIAL }); }} style={{ ...protoUI.chip(false), alignSelf: 'flex-start', marginTop: 2 }}>Reset session</button>
      </PanelSection>
      {GROUPS.map(([g, rows]) => <PanelSection key={g} label={g}>
        {rows.map(([k, l]) => <button key={k} onClick={() => jump(k)} style={protoUI.item(s.route === k)}>{l}</button>)}
      </PanelSection>)}
    </div>
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '18px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={back} disabled={!hist.current.length} style={{ ...protoUI.chip(false), opacity: hist.current.length ? 1 : .4, display: 'flex', alignItems: 'center', gap: 5 }}><PIcon n="arrow-left" size={13} color="var(--body)" />Back</button>
        <span style={{ ...PT.bodySm, color: 'var(--ink)', fontWeight: 500 }}>{LABELS[s.route] || s.route}</span>
      </div>
      <div style={{ width: 412 * scale, height: 915 * scale, flex: 'none' }}>
        <div style={{ width: 412, height: 915, transform: `scale(${scale})`, transformOrigin: 'top left' }}>{(R[s.route] || R.welcome)()}</div>
      </div>
    </div>
  </div>;
}

Object.assign(window, { Prototype });
