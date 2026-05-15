import { baseColors } from "./theme/colors.js";
import { spacing } from "./theme/spacing.js";
import { typography } from "./theme/typography.js";


export function applyDocumentTheme() {
  const root = document.documentElement;

  root.style.setProperty(
    "--gradient-hero-gradient",
    `linear-gradient(180deg, ${baseColors.blueDeep} 0%, ${baseColors.bluePrimary} 55%, ${baseColors.blueSky} 100%)`,
  );

  root.style.setProperty(
    "--gradient-blue-glow-radial",
    "radial-gradient(50% 50%, rgba(0, 128, 248, 0.32) 0%, rgba(95, 189, 247, 0.32) 20%, rgba(211, 239, 252, 0.32) 60%, rgba(248, 249, 252, 0) 100%)",
  );

  root.style.setProperty("--space-xs", `${spacing.xs}px`);
  root.style.setProperty("--space-sm", `${spacing.sm}px`);
  root.style.setProperty("--space-md", `${spacing.md}px`);
  root.style.setProperty("--space-lg", `${spacing.lg}px`);
  root.style.setProperty("--space-xl", `${spacing.xl}px`);
  root.style.setProperty("--space-xxl", `${spacing.xxl}px`);
  root.style.setProperty("--space-xxxl", `${spacing.xxxl}px`);

  root.style.setProperty("--spacing-64", `${spacing.xxl}px`);
  root.style.setProperty("--spacing-128", `${spacing.xxxl}px`);

  root.style.setProperty("--font-theme-sans", typography.fontFamily.sans);
}
