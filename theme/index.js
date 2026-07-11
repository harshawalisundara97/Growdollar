import { lightColors, darkColors } from './colors';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' },
  h2: { fontSize: 22, fontWeight: '700' },
  h3: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 15, fontWeight: '400' },
  caption: { fontSize: 13, fontWeight: '400' },
  button: { fontSize: 16, fontWeight: '600' },
};

export const shadow = (colors) => ({
  sm: {
    shadowColor: colors.mode === 'dark' ? '#000' : '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: colors.mode === 'dark' ? 0.4 : 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: colors.mode === 'dark' ? 0.5 : 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
});

export function buildTheme(mode) {
  const colors = mode === 'dark' ? darkColors : lightColors;
  return {
    mode,
    colors,
    spacing,
    radius,
    typography,
    shadow: shadow(colors),
  };
}

export { lightColors, darkColors };
