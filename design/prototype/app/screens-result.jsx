const { Button, RarityChip, ProgressBar, CelebrationModal } = window.ToutouDexCompanionDesignSystem_d6706c;
const { Icon, CompanionType: T, Phone, Photo, Body, Card, GhostLink, ConfidenceRing } = window;

function ResultHeader({ right, onClose }) {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 12px 0', flex: 'none' }}>
    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 44, height: 44, display: 'flex', alignItems: 'center' }}><Icon n="x" size={24} color="var(--body)" /></button>
    {right}
  </div>;
}

function Toast({ children, action, onAction }) {
  return <div style={{ position: 'absolute', left: 16, right: 16, bottom: 24, background: 'var(--ink)', borderRadius: 'var(--radius-md)', padding: '13px 14px 13px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: 'var(--shadow-elevated)', zIndex: 50 }}>
    <span style={{ ...T.bodySm, color: 'var(--canvas)', flex: 1 }}>{children}</span>
    {action && <button onClick={onAction} style={{ background: 'none', border: 'none', cursor: 'pointer', ...T.label, color: 'var(--accent)', padding: '4px 2px' }}>{action}</button>}
  </div>;
}

function FactCard({ children, label = 'Did you know' }) {
  return <Card tone="fact" style={{ display: 'flex', gap: 12 }}>
    <Icon n="sparkles" size={20} color="var(--secondary)" style={{ marginTop: 2 }} />
    <div>
      <div style={{ ...T.label, color: 'var(--secondary)' }}>{label}</div>
      <div style={{ ...T.bodyMd, color: 'var(--ink)', marginTop: 4 }}>{children}</div>
    </div>
  </Card>;
}

function ResultBreedScreen({ isNew = true, celebrate = false, onAdd, onClose, onOthers }) {
  return <Phone>
    <ResultHeader onClose={onClose} right={<RarityChip rarity="common" />} />
    <Body gap="var(--space-md)" style={{ alignItems: 'center', textAlign: 'center' }}>
      <div style={{ position: 'relative', marginTop: 4 }}>
        <ConfidenceRing size={196} segs={[{ pct: 84, color: 'var(--primary)' }, { pct: 9, color: 'var(--secondary)' }]}>
          <Photo h="100%" r="50%" size={64} />
        </ConfidenceRing>
        <span style={{ position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)', background: 'var(--surface)', boxShadow: 'var(--shadow-card)', borderRadius: 'var(--radius-pill)', padding: '6px 14px', ...T.dataSm, color: 'var(--ink)', whiteSpace: 'nowrap' }}>84% sure</span>
      </div>
      <div style={{ marginTop: 10 }}>
        {isNew && <div style={{ ...T.label, color: 'var(--accent-deep)' }}>New breed</div>}
        <div style={{ ...T.displayLg, marginTop: 4 }}>Bernese Mountain Dog</div>
        <div style={{ ...T.caption, marginTop: 6 }}>Working group · 41st breed in your guide</div>
      </div>
      <FactCard>Bred to haul carts of milk across Swiss alpine farms — a full-grown one can pull four times its own weight.</FactCard>
      <div style={{ flex: 1 }} />
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button variant="accent" onClick={onAdd} style={{ width: '100%' }}>Add to collection</Button>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GhostLink color="var(--muted)" icon="list" onClick={onOthers}>Not this breed? See other guesses</GhostLink>
        </div>
      </div>
    </Body>
    <CelebrationModal open={celebrate} breedName="Bernese Mountain Dog" fact="41 of 130 — your first from the Working group." onClaim={onAdd} onClose={onClose} />
  </Phone>;
}

/* S09 — a breed you already own. The sighting is written on arrival, so Undo has to reverse a real write. */
function MetAgainScreen({ count = 4, undone = false, toast = false, onUndo, onRedo, onScanAnother, onClose, onSeeCard }) {
  const n = undone ? count - 1 : count;
  const tiles = Math.min(n, 4);
  return <Phone>
    <ResultHeader onClose={onClose} right={undone ? <GhostLink icon="rotate-ccw" color="var(--primary)" onClick={onRedo}>Add it back</GhostLink> : <GhostLink icon="undo-2" color="var(--muted)" onClick={onUndo}>Undo</GhostLink>} />
    <Body gap="var(--space-md)">
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-end' }}>
        <Photo h={124} style={{ width: 124, boxShadow: 'var(--shadow-card)' }} r="var(--radius-lg)" />
        <div style={{ paddingBottom: 4 }}>
          <div style={T.label}>Already yours</div>
          <div style={{ ...T.displayMd, marginTop: 4 }}>Golden Retriever</div>
          <div style={{ ...T.dataLg, marginTop: 6, color: undone ? 'var(--muted)' : 'var(--primary)' }}>×{n}</div>
        </div>
      </div>
      <Card tone="sunken">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={T.label}>{undone ? "This card's album" : "Added to this card's album"}</span>
          <span style={{ ...T.dataSm, color: 'var(--muted)' }}>bronze</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 10 }}>
          {Array.from({ length: tiles }).map((_, i) => <Photo key={i} h={64} size={22} r="var(--radius-sm)" style={i === tiles - 1 && !undone ? { outline: '2px solid var(--primary)', outlineOffset: 2 } : { opacity: .75 }} />)}
          {undone && <div style={{ height: 64, borderRadius: 'var(--radius-sm)', border: '1.5px dashed var(--muted-soft)', background: 'transparent' }} />}
        </div>
        <div style={{ marginTop: 14 }}><ProgressBar value={n} max={10} /></div>
        <div style={{ ...T.bodySm, marginTop: 8 }}>{Math.max(0, 10 - n)} more Goldens and this card turns silver.</div>
      </Card>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button variant="primary" onClick={onScanAnother} style={{ width: '100%' }}>Scan another</Button>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GhostLink icon="pencil" color="var(--muted)">Name this one</GhostLink>
          <GhostLink color="var(--muted)" onClick={onSeeCard}>See the card</GhostLink>
        </div>
      </div>
    </Body>
    {toast && <Toast action="Redo" onAction={onRedo}>Sighting removed — back to ×{n}.</Toast>}
  </Phone>;
}

function MixScreen({ onAdd, onClose, onPurebred }) {
  return <Phone>
    <ResultHeader onClose={onClose} right={<span style={{ ...T.label, background: 'var(--surface-sunken)', color: 'var(--body)', borderRadius: 'var(--radius-pill)', padding: '5px 11px' }}>Mix</span>} />
    <Body gap="var(--space-md)" style={{ alignItems: 'center', textAlign: 'center' }}>
      <div style={{ position: 'relative', marginTop: 4 }}>
        <ConfidenceRing size={196} segs={[{ pct: 44, color: 'var(--primary)' }, { pct: 31, color: 'var(--secondary)' }]}>
          <Photo h="100%" r="50%" size={64} />
        </ConfidenceRing>
        <span style={{ position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)', background: 'var(--surface)', boxShadow: 'var(--shadow-card)', borderRadius: 'var(--radius-pill)', padding: '6px 14px', ...T.dataSm, color: 'var(--ink)', whiteSpace: 'nowrap' }}>44 / 31 split</span>
      </div>
      <div style={{ marginTop: 10 }}>
        <div style={{ ...T.label, color: 'var(--secondary)' }}>Looks like a mix</div>
        <div style={{ ...T.displayLg, marginTop: 4 }}>Labrador × Husky</div>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', width: '100%' }}>
        {[['Labrador', 44, 'var(--primary)'], ['Husky', 31, 'var(--secondary)']].map(([n, p, c]) => <Card key={n} tone="sunken" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <Photo h={54} style={{ width: 54 }} r="50%" size={24} />
          <div style={{ ...T.bodyMdMed, fontSize: 14 }}>{n}</div>
          <div style={{ ...T.dataSm, color: c }}>{p}%</div>
        </Card>)}
      </div>
      <div style={{ ...T.bodySm, textAlign: 'left' }}>Mixes get their own shelf. This photo also joins both parent cards as a sighting — neither counts as discovered.</div>
      <div style={{ flex: 1 }} />
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button variant="accent" onClick={onAdd} style={{ width: '100%' }}>Add this mix</Button>
        <div style={{ display: 'flex', justifyContent: 'center' }}><GhostLink color="var(--muted)" onClick={onPurebred}>Actually it's a purebred</GhostLink></div>
      </div>
    </Body>
  </Phone>;
}

const HOUND_CANDS = [['Beagle', 38, 'Shorter legs, white tail tip'], ['English Foxhound', 29, 'Taller, longer muzzle'], ['Harrier', 18, 'Sits between the two in size']];

/* S13 — candidates are passed in so the three always match the confidence that produced them. */
function UnsureScreen({ cands = HOUND_CANDS, onPick, onClose, onNone, onRetake }) {
  return <Phone>
    <ResultHeader onClose={onClose} right={<Photo h={44} style={{ width: 44 }} r="var(--radius-sm)" size={18} />} />
    <Body gap="var(--space-sm)">
      <div>
        <div style={T.displayMd}>Which one is it?</div>
        <div style={{ ...T.bodyMd, marginTop: 6 }}>We narrowed it to three. Compare them with the dog in front of you.</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginTop: 4 }}>
        {cands.map(([n, p, hint], i) => <button key={n} onClick={onPick} style={{ textAlign: 'left', background: 'var(--surface)', border: `1px solid ${i === 0 ? 'var(--primary)' : 'var(--hairline)'}`, borderRadius: 'var(--radius-xl)', padding: 'var(--space-sm)', display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-card)' }}>
          <Photo h={78} style={{ width: 78 }} size={30} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
              <span style={{ ...T.headingSm }}>{n}</span>
              <span style={{ ...T.dataSm, color: 'var(--muted)' }}>{p}%</span>
            </div>
            <div style={{ ...T.bodySm, marginTop: 3 }}>{hint}</div>
          </div>
          <Icon n="chevron-right" size={20} color="var(--muted-soft)" />
        </button>)}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <GhostLink color="var(--muted)" onClick={onNone}>None of these</GhostLink>
        <GhostLink color="var(--muted)" onClick={onRetake}>Re-frame photo</GhostLink>
      </div>
    </Body>
  </Phone>;
}

function NoDogScreen({ onRetake, onClose, onReframe }) {
  const tips = [['maximize', 'Get closer — the dog should fill about half the frame'], ['sun', 'Face the light rather than shooting into it'], ['move-horizontal', 'Side-on works better than head-on']];
  return <Phone>
    <ResultHeader onClose={onClose} />
    <Body gap="var(--space-md)">
      <Photo h={190} style={{ opacity: .55 }} size={56} r="var(--radius-xl)" />
      <div>
        <div style={T.displayMd}>We couldn't spot a dog in that one</div>
        <div style={{ ...T.bodyMd, marginTop: 6 }}>Three things that usually fix it:</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        {tips.map(([ic, t]) => <div key={t} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon n={ic} size={19} color="var(--body)" /></span>
          <span style={T.bodyMd}>{t}</span>
        </div>)}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button variant="primary" onClick={onRetake} style={{ width: '100%' }}>Take another photo</Button>
        <div style={{ display: 'flex', justifyContent: 'center' }}><GhostLink color="var(--muted)" onClick={onReframe}>Re-frame this one instead</GhostLink></div>
      </div>
    </Body>
  </Phone>;
}

Object.assign(window, { ResultBreedScreen, MetAgainScreen, MixScreen, UnsureScreen, NoDogScreen, FactCard, ResultHeader, Toast, HOUND_CANDS });
