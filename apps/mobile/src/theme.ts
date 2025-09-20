export const theme = {
  colors: {
    background: '#0B0B0B',
    surface: '#111111',
    lime: '#D1FF3D',
    purple: '#873BBF',
    text: '#F5F5F5',
    muted: '#A3A3A3'
  },
  fonts: {
    heading: 'Inter_700Bold',
    body: 'Inter_400Regular',
    medium: 'Inter_600SemiBold',
    mono: 'SourceCodePro_600SemiBold'
  },
  spacing: (factor: number) => factor * 8,
  radius: {
    lg: 24,
    md: 16,
    sm: 8
  }
} as const;

export type Theme = typeof theme;
