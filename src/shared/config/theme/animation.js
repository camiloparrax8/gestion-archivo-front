export const duration = {
  fast: "150ms",
  normal: "300ms",
  slow: "500ms",
};

export const easing = {
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
};

export const keyframes = {
  fadeIn: {
    "0%": { opacity: 0 },
    "100%": { opacity: 1 },
  },
  slideUp: {
    "0%": {
      transform: "translateY(10px)",
      opacity: 0,
    },
    "100%": {
      transform: "translateY(0)",
      opacity: 1,
    },
  },
  scaleIn: {
    "0%": {
      transform: "scale(0.95)",
      opacity: 0,
    },
    "100%": {
      transform: "scale(1)",
      opacity: 1,
    },
  },
};

export const animations = {
  fadeIn: `fadeIn ${duration.normal} ${easing.easeOut}`,
  slideUp: `slideUp ${duration.normal} ${easing.easeOut}`,
  scaleIn: `scaleIn ${duration.fast} ${easing.easeOut}`,
};
