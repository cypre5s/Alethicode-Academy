export const animPresets = {
  shy: {
    transform: 'translateY(8px)',
    transitionDuration: '0.6s',
    transitionTimingFunction: 'ease',
    filter: 'brightness(0.97)',
    holdMs: 1200,
  },
  angry: {
    animation: 'char-shake 0.3s ease 2',
    filter: 'brightness(0.88)',
    holdMs: 800,
  },
  surprise: {
    transform: 'translateY(-14px)',
    transitionDuration: '0.18s',
    transitionTimingFunction: 'ease-out',
    flash: true,
    holdMs: 600,
  },
  silent: {
    bgVignette: true,
    holdMs: 0,
  },
  lean_in: {
    transform: 'scale(1.03) translateY(-4px)',
    transitionDuration: '0.8s',
    transitionTimingFunction: 'ease-in-out',
    holdMs: 1500,
  },
  lean_back: {
    transform: 'scale(0.97) translateY(4px)',
    transitionDuration: '0.8s',
    transitionTimingFunction: 'ease-in-out',
    holdMs: 1500,
  },
  nod: {
    animation: 'char-nod 0.5s ease',
    holdMs: 600,
  },
  head_tilt: {
    animation: 'char-tilt 0.6s ease',
    holdMs: 700,
  },
  tremble: {
    animation: 'char-tremble 0.12s ease-in-out 5',
    holdMs: 700,
  },
  step_back: {
    transform: 'translateX(20px) scale(0.96)',
    transitionDuration: '0.4s',
    transitionTimingFunction: 'ease-out',
    holdMs: 1000,
  },
  step_forward: {
    transform: 'translateX(-10px) scale(1.04)',
    transitionDuration: '0.5s',
    transitionTimingFunction: 'ease-in-out',
    holdMs: 1000,
  },
  look_away: {
    transform: 'translateX(6px)',
    filter: 'brightness(0.94)',
    transitionDuration: '0.5s',
    transitionTimingFunction: 'ease',
    holdMs: 1200,
  },
  bounce: {
    animation: 'char-bounce 0.4s ease 2',
    holdMs: 900,
  },
}

export function getPreset(name) {
  return animPresets[name] || null
}
