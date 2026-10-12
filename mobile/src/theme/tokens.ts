export const colors = {
  canvas: "#090A0C",
  surface: "#111215",
  surfaceRaised: "#17181B",
  surfaceElevated: "#1D1E22",
  border: "rgba(255,255,255,0.085)",
  borderStrong: "rgba(255,255,255,0.14)",
  text: "#F5F2EB",
  textSecondary: "#B0B0B5",
  textMuted: "#777981",
  gold: "#D7B982",
  goldSoft: "rgba(215,185,130,0.12)",
  success: "#83C9A1",
  warning: "#E6BD72",
  danger: "#E58B8B",
  instagram: "#D6A2B9",
  youtube: "#F08A87",
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, section: 36 } as const;
export const radius = { control: 12, card: 18, large: 24, pill: 999 } as const;
export const motion = { quick: 160, standard: 240, relaxed: 320, spring: { damping: 18, stiffness: 190, mass: 0.7 } } as const;
