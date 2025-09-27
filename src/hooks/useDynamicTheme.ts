import { useEffect } from 'react';
import { useSiteColors } from '@/hooks/useSettings';

// Helper function para converter hex para hsl de forma segura
function hexToHsl(hex: string): string {
  if (!hex || typeof hex !== 'string' || !/^#?[0-9A-F]{6}$/i.test(hex)) {
    return ''; // Retorna string vazia se o formato for inválido
  }

  // Remove o # se presente
  hex = hex.replace('#', '');
  
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;  
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
}

export const useDynamicTheme = () => {
  const { data: colors } = useSiteColors();

  useEffect(() => {
    if (!colors) return;

    const root = document.documentElement;
    const colorMap = {
      '--primary': colors.primary,
      '--secondary': colors.secondary,
      '--accent': colors.accent,
      '--background': colors.background,
      '--foreground': colors.foreground,
    };

    for (const [property, hexValue] of Object.entries(colorMap)) {
      if (hexValue) {
        const hslValue = hexToHsl(hexValue);
        if (hslValue) {
          root.style.setProperty(property, hslValue);
        }
      }
    }
  }, [colors]);
};