const { Button, RarityChip, ProgressBar, CollectionCard, BreedDetailCard } = window.ToutouDexCompanionDesignSystem_d6706c;
const { Icon, CompanionType: T, Phone, NavBar, Photo, AppBar, Body, Card, GhostLink, ScanInvite } = window;

const SHELVES = [
  ['Herding', 3, 19], ['Sporting', 7, 22], ['Hounds', 2, 21], ['Working', 5, 18],
  ['Toy', 1, 17], ['Non-sporting', 2, 14], ['Mixes', 4, null],
];

function ShelfRow({ name, got, total, onClick }) {
  const pct = total ? Math.round(got / total * 100) : null;
  return <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', background: 'var(--surface)', border: '1px solid var(--hairline-soft)', borderRadius: 'var(--radius-lg)', padding: 7, cursor: 'pointer', textAlign: 'left', width: '100%', minHeight: 54 }}>
    <Photo h={40} style={{ width: 40 }} size={19} r="var(--radius-sm)" />
    <div style={{ flex: 1 }}>
      <div style={T.bodyMdMed}>{name}</div>
      <div style={{ ...T.caption, marginTop: 2 }}>{total ? `${got} of ${total} found` : `${got} found`}</div>
    </div>
    <span style={{ ...T.dataSm, color: 'var(--muted)' }}>{pct === null ? '—' : pct + '%'}</span>
    <Icon n="chevron-right" size={18} color="var(--muted-soft)" />
  </button>;
}

function AlbumHomeScreen({ onShelf, onNav, onSearch }) {
  return <Phone nav={<NavBar active="album" onChange={onNav} />}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px 4px' }}>
      <div style={T.displayMd}>Your field guide</div>
      <button onClick={onSearch} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon n="search" size={19} color="var(--body)" /></button>
    </div>
    <Body gap="var(--space-sm)" pad="var(--space-md)" style={{ overflow: 'hidden' }}>
      <Card>
        <div style={T.label}>Closest to done</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 6 }}>
          <span style={T.displayMd}>Terriers</span>
          <span style={{ ...T.dataLg, color: 'var(--primary)' }}>6/8</span>
        </div>
        <div style={{ margin: '10px 0 8px' }}><ProgressBar value={6} max={8} /></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={T.bodySm}>Two more finishes this shelf.</span>
          <GhostLink color="var(--primary)" onClick={onShelf}>Open</GhostLink>
        </div>
      </Card>
      <div style={{ ...T.label, marginTop: 2 }}>All shelves</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, overflowY: 'auto', paddingBottom: 2 }}>
        {SHELVES.map(([n, g, t]) => <ShelfRow key={n} name={n} got={g} total={t} onClick={onShelf} />)}
      </div>
    </Body>
  </Phone>;
}

function GroupShelfScreen({ onBreed, onLocked, onBack, onNav, showRarity = true }) {
  const breeds = [['Jack Russell', 'common', 3], ['Scottish Terrier', 'common', 1], ['Airedale', 'rare', 1], ['Bull Terrier', 'common', 2], ['Cairn Terrier', 'common', 1], ['Norfolk Terrier', 'rare', 1]];
  return <Phone nav={<NavBar active="album" onChange={onNav} />}>
    <AppBar title="Terriers" sub="6 / 8 found" onLeft={onBack} right={<button style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon n="sliders-horizontal" size={18} color="var(--body)" /></button>} />
    <div style={{ padding: '0 16px 12px' }}><ProgressBar value={6} max={8} /></div>
    <Body pad="0 16px 16px" gap="var(--space-sm)" style={{ overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-sm)' }}>
        {breeds.map(([n, r, c]) => <div key={n} style={{ position: 'relative' }} onClick={onBreed}>
          <CollectionCard breedName={n} rarity={showRarity ? r : null} />
          {c > 1 && <span style={{ position: 'absolute', top: 10, right: 10, ...T.dataSm, fontSize: 11, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-pill)', padding: '2px 7px', color: 'var(--body)' }}>×{c}</span>}
        </div>)}
        <div onClick={onLocked}><CollectionCard locked /></div>
        <div onClick={onLocked}><CollectionCard locked /></div>
      </div>
      <div style={{ ...T.caption, textAlign: 'center', marginTop: 4 }}>Tap a silhouette to see where that one turns up</div>
    </Body>
  </Phone>;
}

function BreedCardScreen({ onBack, onScan, onNav, showRarity = true, cta = 'arrow' }) {
  return <Phone nav={<NavBar active="album" onChange={onNav} scanLabel={cta === 'extended' ? 'Scan another' : null} />}>
    <AppBar title="" onLeft={onBack} right={<button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}><Icon n="ellipsis" size={20} color="var(--body)" /></button>} />
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 16px 8px', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <BreedDetailCard breedName="Jack Russell" rarity={showRarity ? 'common' : undefined} duplicateCount={3}
        fact="Bred to chase foxes out of burrows — which is why yours never stops digging."
        location="Parc de la Tête d'Or" date="12 Mar"
        imageSlot={<Photo h="100%" r="0" size={58} style={{ width: '100%' }} />} />
      <Card tone="sunken">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={T.label}>Your album · 3 dogs met</span>
          <span style={{ ...T.dataSm, color: 'var(--muted)' }}>bronze · 7 to silver</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 10 }}>
          {['Rex', '', ''].map((c, i) => <div key={i} style={{ position: 'relative' }}>
            <Photo h={78} size={26} r="var(--radius-sm)" />
            {c && <span style={{ position: 'absolute', left: 6, bottom: 6, ...T.caption, color: 'var(--on-field)', background: 'rgba(15,33,27,.6)', borderRadius: 'var(--radius-pill)', padding: '2px 8px' }}>{c}</span>}
          </div>)}
        </div>
        <div style={{ marginTop: 12 }}><ProgressBar value={3} max={10} /></div>
      </Card>
      <Card tone="fact">
        <div style={{ ...T.label, color: 'var(--secondary)' }}>How they compare</div>
        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
          {[['Energy', 92], ['Size', 28]].map(([l, v]) => <div key={l} style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={T.caption}>{l}</span><span style={{ ...T.dataSm, fontSize: 11, color: 'var(--secondary)' }}>{v}</span></div>
            <div style={{ height: 6, borderRadius: 99, background: 'rgba(62,124,166,.18)', marginTop: 4 }}><div style={{ width: v + '%', height: '100%', borderRadius: 99, background: 'var(--secondary)' }} /></div>
          </div>)}
        </div>
      </Card>
    </div>
    <div style={{ flex: 'none', padding: '8px 16px var(--space-md)' }}>
      <Button variant="secondary" style={{ width: '100%' }}>Learn more about this breed</Button>
      <ScanInvite label="Scan another" mode={cta} onScan={onScan} />
    </div>
  </Phone>;
}

function LockedBreedScreen({ onBack, onScan, onNav, cta = 'arrow' }) {
  return <Phone nav={<NavBar active="album" onChange={onNav} scanLabel={cta === 'extended' ? 'Go find one' : null} />}>
    <AppBar title="" onLeft={onBack} right={<RarityChip rarity="rare" />} />
    <Body gap="var(--space-md)" style={{ alignItems: 'center', textAlign: 'center' }}>
      <div style={{ flex: 1 }} />
      <div style={{ width: 216, aspectRatio: '3/4', borderRadius: 'var(--radius-xl)', background: 'var(--surface-sunken)', border: '1px dashed var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon n="dog" size={104} color="rgba(113,128,122,.28)" />
      </div>
      <div>
        <div style={T.label}>Terriers · not met yet</div>
        <div style={{ ...T.displayLg, marginTop: 4, letterSpacing: '2px' }}>??</div>
      </div>
      <Card tone="sunken" style={{ textAlign: 'left' }}>
        <div style={T.bodyMd}>A wiry terrier from the north of England. Uncommon in cities — you'll have better luck on a countryside walk.</div>
      </Card>
      <div style={{ flex: 1 }} />
      <ScanInvite label="Go find one" mode={cta} onScan={onScan} />
    </Body>
  </Phone>;
}

function MapTeaserScreen({ onScan, onNav, cta = 'arrow' }) {
  return <Phone nav={<NavBar active="map" onChange={onNav} scanLabel={cta === 'extended' ? 'Keep scanning' : null} />}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px 4px' }}>
      <div style={T.displayMd}>Your map</div>
      <span style={{ ...T.label, background: 'var(--surface-sunken)', color: 'var(--muted)', borderRadius: 'var(--radius-pill)', padding: '5px 11px' }}>Coming later</span>
    </div>
    <Body gap="var(--space-md)">
      <div style={{ flex: 1, borderRadius: 'var(--radius-xl)', background: 'var(--surface-sunken)', position: 'relative', overflow: 'hidden', border: '1px solid var(--hairline)' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: .5, background: 'repeating-linear-gradient(0deg,transparent,transparent 46px,var(--hairline) 46px,var(--hairline) 47px),repeating-linear-gradient(90deg,transparent,transparent 46px,var(--hairline) 46px,var(--hairline) 47px)' }} />
        {[[60, 120], [210, 250], [110, 360], [250, 90]].map(([x, y], i) => <span key={i} style={{ position: 'absolute', left: x, top: y, opacity: .45 }}><Icon n="map-pin" size={30} color="var(--primary)" /></span>)}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(251,247,239,0) 40%,rgba(251,247,239,.85) 100%)' }} />
      </div>
      <Card>
        <div style={T.displayMd}>Every dog you meet, pinned</div>
        <div style={{ ...T.bodyMd, marginTop: 6 }}>We're already saving where each scan happens — this map will fill itself in the day it opens.</div>
      </Card>
      <ScanInvite label="Keep scanning" mode={cta} onScan={onScan} />
    </Body>
  </Phone>;
}

function GameTeaserScreen({ onScan, onNav, cta = 'arrow' }) {
  const modes = [['Guess the breed', 'A photo, four names, ten seconds.', 'help-circle'], ['Flash cards', 'Swipe away the breeds you already know.', 'layers'], ['Weekly challenge', '"Meet two hounds this week."', 'target']];
  return <Phone nav={<NavBar active="game" onChange={onNav} scanLabel={cta === 'extended' ? 'Collect dogs' : null} />}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px 4px' }}>
      <div style={T.displayMd}>Play</div>
      <span style={{ ...T.label, background: 'var(--surface-sunken)', color: 'var(--muted)', borderRadius: 'var(--radius-pill)', padding: '5px 11px' }}>Coming later</span>
    </div>
    <Body gap="var(--space-sm)">
      <div style={{ flex: 1 }} />
      {modes.map(([n, d, ic]) => <Card key={n} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', opacity: .72 }}>
        <span style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon n={ic} size={23} color="var(--muted)" /></span>
        <div>
          <div style={T.headingSm}>{n}</div>
          <div style={{ ...T.bodySm, marginTop: 2 }}>{d}</div>
        </div>
      </Card>)}
      <Card tone="sunken" style={{ marginTop: 8 }}>
        <div style={T.bodyMd}>Games are built from the breeds you've collected. The more you scan, the more there is to play.</div>
      </Card>
      <div style={{ flex: 1 }} />
      <ScanInvite label="Go collect some dogs" mode={cta} onScan={onScan} />
    </Body>
  </Phone>;
}

function ProfileScreen({ onNav, anonymous = true, onSettings, onCreate, onSignIn, onData }) {
  return <Phone nav={<NavBar active="you" onChange={onNav} />}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px 4px' }}>
      <div style={T.displayMd}>You</div>
      <button onClick={onSettings} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon n="settings" size={19} color="var(--body)" /></button>
    </div>
    <Body gap="var(--space-md)">
      <Card style={{ textAlign: 'center' }}>
        <div style={T.label}>Breeds discovered</div>
        <div style={{ ...T.dataLg, fontSize: 44, marginTop: 6, color: 'var(--ink)' }}>41<span style={{ fontSize: 22, color: 'var(--muted)' }}>/130</span></div>
        <div style={{ margin: '14px 0 8px' }}><ProgressBar value={41} max={130} /></div>
        <div style={T.bodySm}>Two shelves complete · 68 dogs met in total</div>
      </Card>
      {anonymous && <Card tone="reward" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Icon n="cloud-upload" size={20} color="var(--accent-deep)" style={{ marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <div style={T.headingSm}>Keep your collection safe</div>
          <div style={{ ...T.bodySm, marginTop: 4 }}>Your 41 breeds live on this phone only. An account backs them up.</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <Button variant="primary" onClick={onCreate} style={{ flex: 1 }}>Create account</Button>
            <Button variant="ghost" onClick={onSignIn}>Sign in</Button>
          </div>
        </div>
      </Card>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[['bell', 'Notifications'], ['map-pin', 'Location'], ['shield', 'Data & privacy'], ['circle-help', 'How ToutouDex works'], ['info', 'About']].map(([ic, l]) => <button key={l} onClick={l === 'Data & privacy' ? onData : onSettings} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', borderBottom: '1px solid var(--hairline-soft)', padding: '14px 4px', cursor: 'pointer', textAlign: 'left' }}>
          <Icon n={ic} size={19} color="var(--muted)" />
          <span style={{ ...T.bodyMdMed, flex: 1 }}>{l}</span>
          <Icon n="chevron-right" size={18} color="var(--muted-soft)" />
        </button>)}
      </div>
    </Body>
  </Phone>;
}

Object.assign(window, { AlbumHomeScreen, GroupShelfScreen, BreedCardScreen, LockedBreedScreen, MapTeaserScreen, GameTeaserScreen, ProfileScreen, ShelfRow });
