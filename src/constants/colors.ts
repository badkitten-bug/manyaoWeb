/**
 * Surfie Green Color Palette
 * Migrated from 0xaddresscom app
 * Based on the logo color #187773 and expanded palette
 */

export const SurfieGreen = {
  50: '#F1FCFA',   // Very light green
  100: '#CFF8F0',  // Light green (QR Card background)
  200: '#A0EFE3',  // Light green
  300: '#68E0D1',  // Medium light green
  400: '#39C8BB',  // Medium green
  500: '#20ACA2',  // Medium green (YAOs badge)
  600: '#178A84',  // Medium dark green
  700: '#187773',  // Dark green (Primary color, matches logo)
  800: '#165956',  // Dark green
  900: '#174A48',  // Very dark green
  950: '#072C2C',  // Darkest green
} as const;

export const SurfieGreenUsage = {
  primary: SurfieGreen[700],      // Main brand color
  secondary: SurfieGreen[50],     // Light backgrounds
  accent: SurfieGreen[500],       // YAOs badge, highlights
  background: SurfieGreen[100],   // QR Card background
  text: SurfieGreen[700],         // Primary text
  textSecondary: SurfieGreen[600], // Secondary text
} as const;

// Colors from the original app
export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: SurfieGreen[700],
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: SurfieGreen[700],
    primary: SurfieGreen[700],
    secondary: SurfieGreen[50],
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#fff",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#fff",
    primary: SurfieGreen[700],
    secondary: SurfieGreen[50],
  },
};

// Button colors from original app
export const ButtonColors = {
  primary: SurfieGreen[700],      // #187773 - Main buttons
  primaryHover: SurfieGreen[800], // #165956 - Hover state
  success: "#4CAF50",             // Green for success/confirm
  error: "#f44336",               // Red for retake/error
  secondary: "#666",              // Gray for secondary actions
  disabled: "#ccc",               // Disabled state
};

// Background colors from original app
export const BackgroundColors = {
  light: "#f5f5f5",              // Main background
  card: "#fff",                  // Card backgrounds
  dark: "#151718",               // Dark mode background
  overlay: "rgba(0,0,0,0.5)",    // Overlays
};

// Text colors from original app
export const TextColors = {
  primary: "#333",               // Main text
  secondary: "#666",             // Secondary text
  light: "#888",                 // Light text
  white: "#fff",                 // White text
  dark: "#ECEDEE",               // Dark mode text
};
