const { Button, TextInput, ProgressBar } = window.ToutouDexCompanionDesignSystem_d6706c;
const { Icon, CompanionType: T, Phone, NavBar, Photo, AppBar, Body, Card, GhostLink } = window;

function Sheet({ children, onClose }) {
  return <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,33,27,0.55)', display: 'flex', alignItems: 'flex-end', zIndex: 40 }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: 'var(--surface)', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0', padding: 'var(--space-lg)', paddingBottom: 'var(--space-xl)', boxShadow: 'var(--shadow-elevated)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{ width: 40, height: 4, borderRadius: 99, background: 'var(--hairline)', alignSelf: 'center' }} />
      {children}
    </div>
  </div>;
}

function Field({ label, placeholder, value, type, error }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <span style={T.label}>{label}</span>
    <TextInput placeholder={placeholder} value={value} onChange={() => { }} style={error ? { borderColor: 'var(--error)', borderWidth: 1.5 } : undefined} />
    {error && <span style={{ ...T.bodySm, color: 'var(--error)', display: 'flex', gap: 6, alignItems: 'center' }}><Icon n="circle-alert" size={14} color="var(--error)" />{error}</span>}
  </div>;
}

/* S30 — the account nudge, fired at the 5th discovery or on Sync. Never a wall. */
function SaveCollectionSheet({ onCreate, onDismiss, onSignIn }) {
  return <Phone nav={<NavBar active="album" />}>
    <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 12, filter: 'blur(1.5px)', opacity: .6 }}>
      <div style={T.displayMd}>Your field guide</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {[0, 1, 2, 3, 4, 5].map(i => <Photo key={i} h={126} r="var(--radius-xl)" size={26} />)}
      </div>
    </div>
    <Sheet onClose={onDismiss}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon n="cloud-upload" size={22} color="var(--accent-deep)" /></span>
        <div>
          <div style={T.displayMd}>Keep your collection safe</div>
          <div style={{ ...T.bodyMd, marginTop: 6 }}>Your five breeds live on this phone only. An account backs them up and moves them to a new phone.</div>
        </div>
      </div>
      <Button variant="primary" onClick={onCreate} style={{ width: '100%' }}>Create an account</Button>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
        <GhostLink color="var(--muted)" onClick={onDismiss}>Not now</GhostLink>
        <GhostLink color="var(--primary)" onClick={onSignIn}>I already have one</GhostLink>
      </div>
    </Sheet>
  </Phone>;
}

/* S31 */
function SignUpScreen({ onBack, onSubmit, loading = false, onSignIn }) {
  return <Phone>
    <AppBar title="" onLeft={onBack} left="x" />
    <Body gap="var(--space-md)">
      <div style={{ flex: 1, minHeight: 8 }} />
      <div>
        <div style={T.displayLg}>Create an account</div>
        <div style={{ ...T.bodyMd, marginTop: 6 }}>Your 41 breeds come with you.</div>
      </div>
      <Field label="Email" placeholder="you@example.com" />
      <Field label="Password" placeholder="At least 8 characters" />
      <div style={{ ...T.bodySm, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <Icon n="shield-check" size={16} color="var(--muted)" style={{ marginTop: 2 }} />
        We only store your email and your collection. Photos stay on your phone unless you turn on backup.
      </div>
      <div style={{ flex: 1.15, minHeight: 8 }} />
      <Button variant="primary" onClick={onSubmit} disabled={loading} style={{ width: '100%' }}>{loading ? 'Creating…' : 'Create account'}</Button>
      <div style={{ display: 'flex', justifyContent: 'center' }}><GhostLink color="var(--muted)" onClick={onSignIn}>I already have an account</GhostLink></div>
    </Body>
  </Phone>;
}

/* S32 — with the inline error state, form contents kept. */
function SignInScreen({ onBack, error = false, onSubmit, onReset }) {
  return <Phone>
    <AppBar title="" onLeft={onBack} left="x" />
    <Body gap="var(--space-md)">
      <div style={{ flex: 1, minHeight: 8 }} />
      <div style={T.displayLg}>Welcome back</div>
      <Field label="Email" placeholder="you@example.com" value="lucas@example.com" />
      <Field label="Password" placeholder="Your password" value="••••••••" error={error ? "That password doesn't match this email" : null} />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}><GhostLink color="var(--primary)" onClick={onReset}>Forgot password?</GhostLink></div>
      <div style={{ flex: 1.15, minHeight: 8 }} />
      <Button variant="primary" onClick={onSubmit} style={{ width: '100%' }}>Sign in</Button>
    </Body>
  </Phone>;
}

/* S33 */
function ResetSentScreen({ onBack }) {
  return <Phone>
    <AppBar title="" onLeft={onBack} left="x" />
    <Body gap="var(--space-md)" style={{ alignItems: 'center', textAlign: 'center' }}>
      <div style={{ flex: 1 }} />
      <span style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon n="mail-check" size={32} color="var(--primary)" /></span>
      <div style={T.displayMd}>Check your inbox</div>
      <div style={T.bodyMd}>We sent a reset link to <b>lucas@example.com</b>. It works for the next hour.</div>
      <div style={{ flex: 1 }} />
      <Button variant="secondary" style={{ width: '100%' }}>Open mail app</Button>
      <GhostLink color="var(--muted)">Send it again</GhostLink>
    </Body>
  </Phone>;
}

/* S37 — signing in on a phone that already has an anonymous collection. */
function MergeScreen({ onKeepBoth, onChooseOne }) {
  const cols = [['On this phone', 41, 'Collected here since March'], ['In your account', 12, 'Last synced 2 weeks ago']];
  return <Phone>
    <AppBar title="" left={null} />
    <Body gap="var(--space-md)">
      <div>
        <div style={T.displayLg}>Two collections</div>
        <div style={{ ...T.bodyMd, marginTop: 6 }}>You've been collecting on this phone while signed out. Nothing is deleted unless you choose it.</div>
      </div>
      {cols.map(([t, n, s], i) => <Card key={t} style={{ display: 'flex', gap: 14, alignItems: 'center', border: i === 0 ? '1.5px solid var(--primary)' : '1px solid var(--hairline)' }}>
        <span style={{ ...T.dataLg, color: i === 0 ? 'var(--primary)' : 'var(--muted)', width: 44, textAlign: 'center' }}>{n}</span>
        <div style={{ flex: 1 }}>
          <div style={T.bodyMdMed}>{t}</div>
          <div style={{ ...T.caption, marginTop: 2 }}>{s}</div>
        </div>
      </Card>)}
      <Card tone="sunken">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Icon n="git-merge" size={19} color="var(--primary)" />
          <div style={T.bodyMdMed}>Keep both — 47 breeds</div>
        </div>
        <div style={{ ...T.bodySm, marginTop: 6 }}>Six breeds appear in both; their photos are merged into one card.</div>
      </Card>
      <div style={{ flex: 1 }} />
      <Button variant="primary" onClick={onKeepBoth} style={{ width: '100%' }}>Keep both</Button>
      <div style={{ display: 'flex', justifyContent: 'center' }}><GhostLink color="var(--muted)" onClick={onChooseOne}>Choose one instead</GhostLink></div>
    </Body>
  </Phone>;
}

/* S39 — the merge fallback. Merging is the risky write, so the escape hatch is
   "keep one, set the other aside" — reversible for 30 days rather than destructive. */
function ChooseOneScreen({ onBack, onKeep }) {
  const [pick, setPick] = React.useState(0);
  const cols = [['On this phone', 41, 'Collected here since March', '68 photos'], ['In your account', 12, 'Last synced 2 weeks ago', '19 photos']];
  const other = cols[pick === 0 ? 1 : 0];
  return <Phone>
    <AppBar title="Choose one" onLeft={onBack} />
    <Body pad="0 16px 16px" gap="var(--space-md)">
      <div style={T.bodyMd}>Keeping one collection is simpler than merging, but the other gets set aside. You can restore it for 30 days.</div>
      {cols.map(([t, n, sub, ph], i) => <button key={t} onClick={() => setPick(i)} style={{ textAlign: 'left', cursor: 'pointer', background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-md)', display: 'flex', gap: 14, alignItems: 'center', border: pick === i ? '1.5px solid var(--primary)' : '1px solid var(--hairline)', boxShadow: pick === i ? 'var(--shadow-card)' : 'none' }}>
        <span style={{ ...T.dataLg, color: pick === i ? 'var(--primary)' : 'var(--muted)', width: 44, textAlign: 'center' }}>{n}</span>
        <span style={{ flex: 1 }}>
          <span style={{ ...T.bodyMdMed, display: 'block' }}>{t}</span>
          <span style={{ ...T.caption, display: 'block', marginTop: 2 }}>{sub} · {ph}</span>
        </span>
        <span style={{ width: 24, height: 24, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: pick === i ? 'var(--primary)' : 'transparent', border: pick === i ? 'none' : '1.5px solid var(--hairline)' }}>{pick === i && <Icon n="check" size={15} color="var(--on-primary)" />}</span>
      </button>)}
      <Card tone="sunken">
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Icon n="archive" size={19} color="var(--secondary)" style={{ marginTop: 2 }} />
          <div>
            <div style={T.bodyMdMed}>{other[0]} gets set aside</div>
            <div style={{ ...T.bodySm, marginTop: 4 }}>{other[1]} breeds and {other[3]} stay in Settings until 27 August. After that they're gone for good.</div>
          </div>
        </div>
      </Card>
      <div style={{ flex: 1 }} />
      <Button variant="primary" onClick={() => onKeep(cols[pick][1])} style={{ width: '100%' }}>Keep {cols[pick][0].toLowerCase()}</Button>
      <div style={{ display: 'flex', justifyContent: 'center' }}><GhostLink color="var(--muted)" onClick={onBack}>Merge them instead</GhostLink></div>
    </Body>
  </Phone>;
}

Object.assign(window, { Sheet, Field, SaveCollectionSheet, SignUpScreen, SignInScreen, ResetSentScreen, MergeScreen, ChooseOneScreen });
