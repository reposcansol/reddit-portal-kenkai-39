
// Hash function to generate consistent colors for the same flair text
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Calculate relative luminance according to WCAG guidelines
const getLuminance = (hex: string): number => {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(cleanHex.substr(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substr(2, 2), 16) / 255;
  const b = parseInt(cleanHex.substr(4, 2), 16) / 255;
  
  // Apply gamma correction
  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  
  const rLinear = toLinear(r);
  const gLinear = toLinear(g);
  const bLinear = toLinear(b);
  
  // Calculate luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
};

// Determine if a color is light or dark
const isLightColor = (hex: string): boolean => {
  try {
    return getLuminance(hex) > 0.5;
  } catch {
    return false; // Default to dark if parsing fails
  }
};

// Curated background colors that fit the cyberpunk/terminal theme
const BACKGROUND_COLORS = [
  '#1a1a2e', // Dark navy
  '#16213e', // Dark blue
  '#0f3460', // Medium blue
  '#533483', // Purple
  '#7209b7', // Bright purple
  '#2d1b69', // Dark purple
  '#1a472a', // Dark green
  '#0d7377', // Teal
  '#14a085', // Green-teal
  '#2e8b57', // Sea green
  '#8b4513', // Saddle brown
  '#654321', // Dark brown
  '#2f4f4f', // Dark slate gray
  '#483d8b', // Dark slate blue
  '#556b2f', // Dark olive green
];

// High contrast text colors
const LIGHT_TEXT = '#e5e7eb'; // Light gray
const DARK_TEXT = '#1f2937'; // Dark gray

// Validate hex color format
const isValidHex = (color: string): boolean => {
  return /^#[0-9A-F]{6}$/i.test(color);
};

export interface FlairColors {
  backgroundColor: string;
  textColor: string;
}

export const getFlairColors = (flairText: string, redditBgColor?: string): FlairColors => {
  // If Reddit provides a valid background color, use it with proper contrast
  if (redditBgColor && isValidHex(redditBgColor)) {
    return {
      backgroundColor: redditBgColor,
      textColor: isLightColor(redditBgColor) ? DARK_TEXT : LIGHT_TEXT
    };
  }
  
  // Generate consistent background color based on flair text hash
  const hash = hashString(flairText);
  const backgroundIndex = hash % BACKGROUND_COLORS.length;
  const backgroundColor = BACKGROUND_COLORS[backgroundIndex];
  
  // Always use light text for our curated dark backgrounds
  return {
    backgroundColor,
    textColor: LIGHT_TEXT
  };
};
