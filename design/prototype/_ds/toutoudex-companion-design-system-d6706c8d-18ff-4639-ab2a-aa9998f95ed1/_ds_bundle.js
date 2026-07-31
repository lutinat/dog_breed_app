/* @ds-bundle: {"format":4,"namespace":"ToutouDexCompanionDesignSystem_d6706c","components":[{"name":"CameraShutter","sourcePath":"components/camera/CameraShutter.jsx"},{"name":"BreedDetailCard","sourcePath":"components/collection/BreedDetailCard.jsx"},{"name":"CollectionCard","sourcePath":"components/collection/CollectionCard.jsx"},{"name":"CelebrationModal","sourcePath":"components/feedback/CelebrationModal.jsx"},{"name":"ConfidenceMeter","sourcePath":"components/feedback/ConfidenceMeter.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"RarityChip","sourcePath":"components/feedback/RarityChip.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"TextInput","sourcePath":"components/forms/TextInput.jsx"},{"name":"BottomNav","sourcePath":"components/navigation/BottomNav.jsx"}],"sourceHashes":{"components/camera/CameraShutter.jsx":"f30966cd7bed","components/collection/BreedDetailCard.jsx":"edc984d3d6f0","components/collection/CollectionCard.jsx":"d63625e8b634","components/feedback/CelebrationModal.jsx":"3591cea446e0","components/feedback/ConfidenceMeter.jsx":"cd75307cc187","components/feedback/ProgressBar.jsx":"4f4e3501d600","components/feedback/RarityChip.jsx":"31fc9b45ac8b","components/forms/Button.jsx":"bbcc26e37b7e","components/forms/TextInput.jsx":"8c77e93d8183","components/navigation/BottomNav.jsx":"2147f780437b","ui_kits/toutoudex-app/BreedDetailScreen.jsx":"182fe1f7495a","ui_kits/toutoudex-app/CollectionScreen.jsx":"fe99bfb257c6","ui_kits/toutoudex-app/PhoneFrame.jsx":"437204ffe984","ui_kits/toutoudex-app/ProfileScreen.jsx":"f81b4771412a","ui_kits/toutoudex-app/ScanResultScreen.jsx":"0c0172943043","ui_kits/toutoudex-app/ScanScreen.jsx":"6c1f33b73002","ui_kits/toutoudex-app/data.js":"41d419a5904f"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ToutouDexCompanionDesignSystem_d6706c = window.ToutouDexCompanionDesignSystem_d6706c || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/camera/CameraShutter.jsx
try { (() => {
function CameraShutter({
  onPress,
  active = false,
  style
}) {
  const [down, setDown] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onMouseDown: () => setDown(true),
    onMouseUp: () => setDown(false),
    onMouseLeave: () => setDown(false),
    onClick: onPress,
    style: {
      width: 76,
      height: 76,
      borderRadius: 'var(--radius-pill)',
      backgroundColor: 'var(--on-field)',
      border: '4px solid rgba(255,255,255,0.4)',
      boxShadow: active ? 'var(--shadow-field-glow)' : 'none',
      transform: down ? 'scale(0.96)' : 'scale(1)',
      transition: 'transform var(--duration-instant) var(--easing-spring)',
      cursor: 'pointer',
      ...style
    }
  });
}
Object.assign(__ds_scope, { CameraShutter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/camera/CameraShutter.jsx", error: String((e && e.message) || e) }); }

// components/collection/BreedDetailCard.jsx
try { (() => {
function BreedDetailCard({
  breedName,
  rarity = 'common',
  fact,
  location,
  date,
  duplicateCount = 0,
  imageSlot,
  style
}) {
  const rarityColor = {
    common: 'var(--muted)',
    rare: 'var(--secondary)',
    legendary: 'var(--rarity-legendary)'
  }[rarity];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: 'var(--surface)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-lg)',
      boxShadow: 'var(--shadow-elevated)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-md)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-md)',
      aspectRatio: '4/3',
      backgroundColor: 'var(--surface-sunken)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, imageSlot || /*#__PURE__*/React.createElement("img", {
    src: "https://unpkg.com/lucide-static@latest/icons/dog.svg",
    alt: "",
    style: {
      width: '30%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--label-uppercase-size)',
      fontWeight: 'var(--label-uppercase-weight)',
      letterSpacing: 'var(--label-uppercase-ls)',
      textTransform: 'uppercase',
      color: rarityColor
    }
  }, rarity)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--display-lg-size)',
      fontWeight: 'var(--display-lg-weight)',
      lineHeight: 'var(--display-lg-lh)',
      letterSpacing: 'var(--display-lg-ls)',
      color: 'var(--ink)'
    }
  }, breedName), fact && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--body-md-size)',
      color: 'var(--body)',
      backgroundColor: 'var(--accent-soft)',
      borderRadius: 'var(--radius-md)',
      padding: '10px 14px'
    }
  }, fact), (location || date) && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--caption-size)',
      color: 'var(--muted)'
    }
  }, "First scanned ", location ? `in ${location}` : '', " ", date), duplicateCount > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--data-sm-size)',
      color: 'var(--secondary)'
    }
  }, "\xD7", duplicateCount, " scanned"));
}
Object.assign(__ds_scope, { BreedDetailCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/collection/BreedDetailCard.jsx", error: String((e && e.message) || e) }); }

// components/collection/CollectionCard.jsx
try { (() => {
function CollectionCard({
  locked = false,
  breedName,
  rarity = 'common',
  imageSlot,
  style
}) {
  if (locked) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        aspectRatio: '3/4',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--surface-sunken)',
        border: '1px dashed var(--hairline)',
        padding: 'var(--space-sm)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        gap: 6,
        position: 'relative',
        ...style
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "https://unpkg.com/lucide-static@latest/icons/lock.svg",
      alt: "locked",
      style: {
        width: 16,
        height: 16,
        position: 'absolute',
        top: 10,
        left: 10,
        opacity: 0.55
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.35
      }
    }, imageSlot || /*#__PURE__*/React.createElement("img", {
      src: "https://unpkg.com/lucide-static@latest/icons/dog.svg",
      alt: "",
      style: {
        width: '46%',
        filter: 'grayscale(1)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-ui)',
        fontSize: 'var(--body-md-medium-size)',
        color: 'var(--muted)',
        textAlign: 'center'
      }
    }, "???"));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '3/4',
      borderRadius: 'var(--radius-xl)',
      backgroundColor: 'var(--surface)',
      boxShadow: rarity === 'legendary' ? 'var(--shadow-card), var(--shadow-legendary-glow)' : 'var(--shadow-card)',
      padding: 'var(--space-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      position: 'relative',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 10,
      left: 10
    }
  }, rarity && /*#__PURE__*/React.createElement(RarityChipInline, {
    rarity: rarity
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      backgroundColor: 'var(--surface-sunken)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, imageSlot || /*#__PURE__*/React.createElement("img", {
    src: "https://unpkg.com/lucide-static@latest/icons/dog.svg",
    alt: "",
    style: {
      width: '46%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--body-md-medium-size)',
      fontWeight: 'var(--body-md-medium-weight)',
      color: 'var(--ink)',
      textAlign: 'center'
    }
  }, breedName));
}
function RarityChipInline({
  rarity
}) {
  const map = {
    common: {
      backgroundColor: 'var(--surface-sunken)',
      color: 'var(--muted)'
    },
    rare: {
      backgroundColor: 'var(--secondary-soft)',
      color: 'var(--secondary)'
    },
    legendary: {
      backgroundColor: 'var(--rarity-legendary)',
      color: 'var(--on-accent)'
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--label-uppercase-size)',
      fontWeight: 'var(--label-uppercase-weight)',
      letterSpacing: 'var(--label-uppercase-ls)',
      textTransform: 'uppercase',
      borderRadius: 'var(--radius-pill)',
      padding: '3px 8px',
      ...map[rarity]
    }
  }, rarity);
}
Object.assign(__ds_scope, { CollectionCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/collection/CollectionCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/CelebrationModal.jsx
try { (() => {
function CelebrationModal({
  open,
  breedName,
  fact,
  onClaim,
  onClose
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(15,33,27,0.55)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      backgroundColor: 'var(--surface)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-xl)',
      boxShadow: 'var(--shadow-elevated), var(--shadow-legendary-glow)',
      maxWidth: 320,
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-md)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--label-uppercase-size)',
      fontWeight: 'var(--label-uppercase-weight)',
      letterSpacing: 'var(--label-uppercase-ls)',
      color: 'var(--accent-deep)',
      textTransform: 'uppercase'
    }
  }, "New Breed!"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--display-xl-size)',
      fontWeight: 'var(--display-xl-weight)',
      lineHeight: 'var(--display-xl-lh)',
      letterSpacing: 'var(--display-xl-ls)',
      color: 'var(--ink)'
    }
  }, breedName), fact && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--body-md-size)',
      color: 'var(--body)',
      backgroundColor: 'var(--accent-soft)',
      borderRadius: 'var(--radius-md)',
      padding: '10px 14px'
    }
  }, fact), /*#__PURE__*/React.createElement("button", {
    onClick: onClaim,
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--button-size)',
      fontWeight: 'var(--button-weight)',
      backgroundColor: 'var(--accent)',
      color: 'var(--on-accent)',
      border: 'none',
      borderRadius: 'var(--radius-md)',
      padding: '14px 24px',
      height: 52,
      width: '100%',
      boxShadow: 'var(--shadow-field-glow)',
      cursor: 'pointer'
    }
  }, "Add to collection")));
}
Object.assign(__ds_scope, { CelebrationModal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/CelebrationModal.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ConfidenceMeter.jsx
try { (() => {
function ConfidenceMeter({
  confidence = 0,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: 'var(--surface-field-elevated)',
      color: 'var(--on-field)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--data-sm-size)',
      fontWeight: 'var(--data-sm-weight)',
      letterSpacing: 'var(--data-sm-ls)',
      borderRadius: 'var(--radius-pill)',
      padding: '6px 12px',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: `conic-gradient(var(--accent) ${confidence * 3.6}deg, rgba(255,255,255,0.2) 0deg)`
    }
  }), confidence, "%");
}
Object.assign(__ds_scope, { ConfidenceMeter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ConfidenceMeter.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.jsx
try { (() => {
function ProgressBar({
  value = 0,
  max = 100,
  style
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '10px',
      backgroundColor: 'var(--surface-sunken)',
      borderRadius: 'var(--radius-pill)',
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + '%',
      height: '100%',
      backgroundColor: 'var(--primary)',
      borderRadius: 'var(--radius-pill)',
      transition: 'width var(--duration-slow) var(--easing-decelerate)'
    }
  }));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/feedback/RarityChip.jsx
try { (() => {
const rarityStyles = {
  common: {
    backgroundColor: 'var(--surface-sunken)',
    color: 'var(--muted)'
  },
  rare: {
    backgroundColor: 'var(--secondary-soft)',
    color: 'var(--secondary)'
  },
  legendary: {
    backgroundColor: 'var(--rarity-legendary)',
    color: 'var(--on-accent)',
    boxShadow: 'var(--shadow-legendary-glow)'
  }
};
function RarityChip({
  rarity = 'common',
  style
}) {
  const s = rarityStyles[rarity] || rarityStyles.common;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--label-uppercase-size)',
      fontWeight: 'var(--label-uppercase-weight)',
      lineHeight: 'var(--label-uppercase-lh)',
      letterSpacing: 'var(--label-uppercase-ls)',
      textTransform: 'uppercase',
      borderRadius: 'var(--radius-pill)',
      padding: '4px 10px',
      display: 'inline-block',
      ...s,
      ...style
    }
  }, rarity);
}
Object.assign(__ds_scope, { RarityChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/RarityChip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
const base = {
  fontFamily: 'var(--font-ui)',
  fontSize: 'var(--button-size)',
  fontWeight: 'var(--button-weight)',
  lineHeight: 'var(--button-lh)',
  border: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  transition: 'transform var(--duration-instant) var(--easing-standard), background-color var(--duration-fast) var(--easing-standard)'
};
const variants = {
  primary: {
    backgroundColor: 'var(--primary)',
    color: 'var(--on-primary)',
    borderRadius: 'var(--radius-md)',
    padding: '14px 24px',
    height: '52px'
  },
  accent: {
    backgroundColor: 'var(--accent)',
    color: 'var(--on-accent)',
    borderRadius: 'var(--radius-md)',
    padding: '14px 24px',
    height: '52px',
    boxShadow: 'var(--shadow-field-glow)'
  },
  secondary: {
    backgroundColor: 'transparent',
    color: 'var(--primary)',
    borderRadius: 'var(--radius-md)',
    padding: '12.5px 24px',
    height: '52px',
    border: '1.5px solid var(--primary)'
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--body)',
    padding: '10px 16px',
    height: 'auto'
  }
};
const pressed = {
  primary: 'var(--primary-pressed)'
};
function Button({
  variant = 'primary',
  disabled = false,
  icon = null,
  children,
  onClick,
  style
}) {
  const [down, setDown] = React.useState(false);
  const v = variants[variant] || variants.primary;
  return /*#__PURE__*/React.createElement("button", {
    disabled: disabled,
    onMouseDown: () => setDown(true),
    onMouseUp: () => setDown(false),
    onMouseLeave: () => setDown(false),
    onClick: onClick,
    style: {
      ...base,
      ...v,
      backgroundColor: down && variant === 'primary' ? pressed.primary : v.backgroundColor,
      transform: down ? 'scale(0.96)' : 'scale(1)',
      opacity: disabled ? 0.45 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
      ...style
    }
  }, icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextInput.jsx
try { (() => {
function TextInput({
  placeholder = '',
  value,
  onChange,
  disabled = false,
  style
}) {
  return /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: placeholder,
    value: value,
    onChange: onChange,
    disabled: disabled,
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--body-md-size)',
      fontWeight: 'var(--body-md-weight)',
      color: 'var(--ink)',
      backgroundColor: 'var(--surface)',
      borderRadius: 'var(--radius-md)',
      padding: '14px 16px',
      height: '52px',
      border: '1px solid var(--hairline)',
      outline: 'none',
      boxSizing: 'border-box',
      width: '100%',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  });
}
Object.assign(__ds_scope, { TextInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextInput.jsx", error: String((e && e.message) || e) }); }

// components/navigation/BottomNav.jsx
try { (() => {
const tabs = [{
  key: 'scan',
  label: 'Scan',
  icon: 'camera'
}, {
  key: 'collection',
  label: 'Collection',
  icon: 'layout-grid'
}, {
  key: 'map',
  label: 'Map',
  icon: 'map'
}, {
  key: 'profile',
  label: 'Profile',
  icon: 'user'
}];
function BottomNav({
  active = 'collection',
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      height: 64,
      backgroundColor: 'var(--surface)',
      borderTop: '1px solid var(--hairline)',
      fontFamily: 'var(--font-ui)'
    }
  }, tabs.map(t => {
    const isScan = t.key === 'scan';
    const isActive = active === t.key;
    return /*#__PURE__*/React.createElement("button", {
      key: t.key,
      onClick: () => onChange && onChange(t.key),
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        color: isActive ? 'var(--primary)' : 'var(--muted)',
        transform: isScan ? 'translateY(-10px)' : isActive ? 'translateY(-2px)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: isScan ? 44 : 24,
        height: isScan ? 44 : 24,
        borderRadius: '50%',
        backgroundColor: isScan ? 'var(--accent)' : 'transparent',
        boxShadow: isScan ? 'var(--shadow-field-glow)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: `https://unpkg.com/lucide-static@latest/icons/${t.icon}.svg`,
      alt: "",
      style: {
        width: isScan ? 22 : 20,
        height: isScan ? 22 : 20,
        filter: isScan ? 'invert(16%) sepia(9%)' : isActive ? 'none' : 'grayscale(1) opacity(0.7)'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 600
      }
    }, t.label), isActive && !isScan && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 4,
        height: 4,
        borderRadius: '50%',
        backgroundColor: 'var(--primary)'
      }
    }));
  }));
}
Object.assign(__ds_scope, { BottomNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/BottomNav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/toutoudex-app/BreedDetailScreen.jsx
try { (() => {
function BreedDetailScreen({
  breed,
  onBack,
  onTab
}) {
  const {
    BreedDetailCard,
    BottomNav,
    Button
  } = window.ToutouDexCompanionDesignSystem_d6706c;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: 'var(--canvas)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 16px 0'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: onBack,
    style: {
      padding: '4px 0'
    }
  }, "\u2190 Back")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement(BreedDetailCard, {
    breedName: breed.name,
    rarity: breed.rarity,
    fact: window.ToutouDexFacts[breed.name] || 'A loyal companion with a distinct look and personality.',
    location: "Portland, OR",
    date: "Mar 2",
    duplicateCount: breed.rarity === 'legendary' ? 2 : 0
  })), /*#__PURE__*/React.createElement(BottomNav, {
    active: "collection",
    onChange: onTab
  }));
}
window.BreedDetailScreen = BreedDetailScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/toutoudex-app/BreedDetailScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/toutoudex-app/CollectionScreen.jsx
try { (() => {
function CollectionScreen({
  unlocked,
  onOpenBreed,
  onTab
}) {
  const {
    CollectionCard,
    ProgressBar,
    BottomNav
  } = window.ToutouDexCompanionDesignSystem_d6706c;
  const all = window.ToutouDexBreeds;
  const count = unlocked.length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: 'var(--canvas)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 16px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      fontWeight: 600,
      color: 'var(--ink)'
    }
  }, "Your Collection"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(ProgressBar, {
    value: count,
    max: all.length
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--body)'
    }
  }, count, " / ", all.length))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      padding: '4px 16px 16px',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 10
    }
  }, all.map(b => {
    const isUnlocked = unlocked.includes(b.name);
    return /*#__PURE__*/React.createElement("div", {
      key: b.name,
      onClick: () => isUnlocked && onOpenBreed(b),
      style: {
        cursor: isUnlocked ? 'pointer' : 'default'
      }
    }, /*#__PURE__*/React.createElement(CollectionCard, {
      locked: !isUnlocked,
      breedName: b.name,
      rarity: b.rarity
    }));
  })), /*#__PURE__*/React.createElement(BottomNav, {
    active: "collection",
    onChange: onTab
  }));
}
window.CollectionScreen = CollectionScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/toutoudex-app/CollectionScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/toutoudex-app/PhoneFrame.jsx
try { (() => {
function PhoneFrame({
  children,
  dark
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 393,
      height: 750,
      borderRadius: 40,
      backgroundColor: dark ? 'var(--canvas-field)' : 'var(--canvas)',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
      border: '8px solid #111',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column'
    }
  }, children);
}
window.PhoneFrame = PhoneFrame;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/toutoudex-app/PhoneFrame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/toutoudex-app/ProfileScreen.jsx
try { (() => {
function ProfileScreen({
  unlocked,
  onTab
}) {
  const {
    BottomNav
  } = window.ToutouDexCompanionDesignSystem_d6706c;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: 'var(--canvas)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      fontWeight: 600,
      color: 'var(--ink)'
    }
  }, "Profile"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 13,
      color: 'var(--muted)'
    }
  }, "A quiet screen \u2014 utility, not gamified.")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '14px 0',
      borderBottom: '1px solid var(--hairline)',
      fontFamily: 'var(--font-ui)',
      fontSize: 15,
      color: 'var(--body)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Breeds found"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      color: 'var(--ink)'
    }
  }, unlocked.length)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '14px 0',
      borderBottom: '1px solid var(--hairline)',
      fontFamily: 'var(--font-ui)',
      fontSize: 15,
      color: 'var(--body)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Notifications"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--muted)'
    }
  }, "On")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '14px 0',
      borderBottom: '1px solid var(--hairline)',
      fontFamily: 'var(--font-ui)',
      fontSize: 15,
      color: 'var(--body)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Units"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--muted)'
    }
  }, "Miles"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(BottomNav, {
    active: "profile",
    onChange: onTab
  }));
}
window.ProfileScreen = ProfileScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/toutoudex-app/ProfileScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/toutoudex-app/ScanResultScreen.jsx
try { (() => {
function ScanResultScreen({
  breed,
  onAdd
}) {
  const {
    CelebrationModal
  } = window.ToutouDexCompanionDesignSystem_d6706c;
  const [open, setOpen] = React.useState(true);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: 'relative',
      background: 'var(--canvas-field)'
    }
  }, /*#__PURE__*/React.createElement(CelebrationModal, {
    open: open,
    breedName: breed.name,
    fact: window.ToutouDexFacts[breed.name] || 'A loyal companion with a distinct look and personality.',
    onClaim: () => {
      setOpen(false);
      onAdd();
    },
    onClose: () => {
      setOpen(false);
      onAdd();
    }
  }));
}
window.ScanResultScreen = ScanResultScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/toutoudex-app/ScanResultScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/toutoudex-app/ScanScreen.jsx
try { (() => {
function ScanScreen({
  onCapture
}) {
  const {
    ConfidenceMeter,
    CameraShutter,
    Button
  } = window.ToutouDexCompanionDesignSystem_d6706c;
  const [confidence, setConfidence] = React.useState(0);
  const [detecting, setDetecting] = React.useState(true);
  React.useEffect(() => {
    const t = setInterval(() => setConfidence(c => Math.min(96, c + 8)), 150);
    return () => clearInterval(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: 'var(--canvas-field)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'radial-gradient(circle at 50% 40%, #1e4335 0%, #0f211b 70%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '18px 16px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-ui)',
      color: 'var(--on-field)',
      fontSize: 13,
      fontWeight: 600
    }
  }, "ToutouDex"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    style: {
      color: 'var(--on-field-muted)',
      padding: '6px 10px',
      fontSize: 12
    }
  }, "How it works")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 220,
      height: 260,
      border: '2px solid var(--accent)',
      borderRadius: 16,
      opacity: 0.6 + confidence / 100 * 0.4,
      boxShadow: confidence > 80 ? 'var(--shadow-field-glow)' : 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 24,
      left: '50%',
      transform: 'translateX(-50%)'
    }
  }, /*#__PURE__*/React.createElement(ConfidenceMeter, {
    confidence: confidence
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      padding: '0 0 40px'
    }
  }, /*#__PURE__*/React.createElement(CameraShutter, {
    active: confidence > 80,
    onPress: onCapture
  })));
}
window.ScanScreen = ScanScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/toutoudex-app/ScanScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/toutoudex-app/data.js
try { (() => {
window.ToutouDexBreeds = [{
  name: 'Shiba Inu',
  rarity: 'legendary'
}, {
  name: 'Corgi',
  rarity: 'rare'
}, {
  name: 'Labrador',
  rarity: 'common'
}, {
  name: 'Beagle',
  rarity: 'common'
}, {
  name: 'Husky',
  rarity: 'rare'
}, {
  name: 'Poodle',
  rarity: 'common'
}];
window.ToutouDexFacts = {
  'Shiba Inu': "Shiba Inus were bred to hunt in Japan's mountainous terrain — their name means \"brushwood dog.\""
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/toutoudex-app/data.js", error: String((e && e.message) || e) }); }

__ds_ns.CameraShutter = __ds_scope.CameraShutter;

__ds_ns.BreedDetailCard = __ds_scope.BreedDetailCard;

__ds_ns.CollectionCard = __ds_scope.CollectionCard;

__ds_ns.CelebrationModal = __ds_scope.CelebrationModal;

__ds_ns.ConfidenceMeter = __ds_scope.ConfidenceMeter;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.RarityChip = __ds_scope.RarityChip;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.TextInput = __ds_scope.TextInput;

__ds_ns.BottomNav = __ds_scope.BottomNav;

})();
