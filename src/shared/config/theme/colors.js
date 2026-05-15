/**
 * Paleta Orion — azul de marca (sin verdes tipo Guven Market del otro repo).
 * Valores distintos del gris neutro anterior para que el tema se note en pantalla.
 */
export const baseColors = {
  blueDeep: "#001033",
  bluePrimary: "#0050f8",
  blueBright: "#0080f8",
  blueSky: "#5fbdf7",
  blueSoft: "#e0f6ff",
  /** Lienzo general: tinte azul visible (antes #f8f9fc casi gris) */
  canvas: "#e8f1fb",
  navy: "#1b2540",
  gray: "#6b7184",
  white: "#ffffff",
  light: "#f8f9fc",
  dark: "#1b2540",
  black: "#000000",
};

export const colors = {
  primary: baseColors.blueDeep,
  secondary: baseColors.bluePrimary,
  accent: baseColors.blueSky,
  secondaryDark: "#0a1f4d",

  success: "#0284c7",
  danger: "#dc2626",
  neutral: baseColors.gray,

  background: baseColors.canvas,
  surface: baseColors.white,

  dark: baseColors.dark,
  light: "#f9fafb",

  primaryHover: "#001a4d",
  primaryActive: "#000819",
  primaryDisabled: "#93c5fd",

  secondaryHover: "#0046d9",
  secondaryActive: "#003bb8",
  secondaryDisabled: "#93c5fd",

  accentHover: "#38bdf8",
  accentActive: "#0ea5e9",
  accentDisabled: "#bae6fd",

  dangerHover: "#b91c1c",
  dangerActive: "#991b1b",
  dangerDisabled: "#fca5a5",

  successHover: "#0369a1",
  successActive: "#075985",
  successDisabled: "#7dd3fc",

  neutralHover: "#4b5563",
  neutralActive: "#374151",
  neutralDisabled: "#9ca3af",

  backgroundHover: "#dceaf8",
  backgroundActive: "#cddff4",
  backgroundDisabled: "#f1f5f9",

  surfaceHover: "#f8f8f8",
  surfaceActive: "#f1f1f1",
  surfaceDisabled: "#ffffff",
};
