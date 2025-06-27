/**
 * Predefined Color System for Radice ALM
 * 
 * This file contains 7 predefined colors that should be used consistently
 * across the application. Each color has a specific purpose and includes
 * both light and dark mode variants.
 * 
 * Brand Colors:
 * - Background: white
 * - Outline: black 16% opacity
 * - OnBackground4: black 4% opacity
 * - OnBackground64: black 64% opacity
 * - OnBackground: black
 * - Primary: #7F56D9
 * 
 * Usage:
 * - Import the color constants: import { colors } from '@/lib/colors'
 * - Use in components: className={colors.primary.bg}
 */

export const colors = {
  // Primary - Main brand color (#7F56D9)
  primary: {
    bg: 'bg-[#7F56D9] dark:bg-[#7F56D9]',
    text: 'text-[#7F56D9] dark:text-[#7F56D9]',
    border: 'border-[#7F56D9] dark:border-[#7F56D9]',
    hover: 'hover:bg-[#6B47C7] dark:hover:bg-[#6B47C7]',
    focus: 'focus:ring-[#7F56D9] focus:border-[#7F56D9]',
    light: 'bg-[#7F56D9]/10 dark:bg-[#7F56D9]/20',
  },

  // Secondary - Supporting color (Blue)
  secondary: {
    bg: 'bg-blue-500 dark:bg-blue-600',
    text: 'text-blue-500 dark:text-blue-600',
    border: 'border-blue-500 dark:border-blue-600',
    hover: 'hover:bg-blue-600 dark:hover:bg-blue-700',
    focus: 'focus:ring-blue-500 focus:border-blue-500',
    light: 'bg-blue-50 dark:bg-blue-900/20',
  },

  // Success - Positive actions (Green)
  success: {
    bg: 'bg-green-500 dark:bg-green-600',
    text: 'text-green-500 dark:text-green-600',
    border: 'border-green-500 dark:border-green-600',
    hover: 'hover:bg-green-600 dark:hover:bg-green-700',
    focus: 'focus:ring-green-500 focus:border-green-500',
    light: 'bg-green-50 dark:bg-green-900/20',
  },

  // Warning - Caution actions (Yellow/Orange)
  warning: {
    bg: 'bg-yellow-500 dark:bg-yellow-600',
    text: 'text-yellow-500 dark:text-yellow-600',
    border: 'border-yellow-500 dark:border-yellow-600',
    hover: 'hover:bg-yellow-600 dark:hover:bg-yellow-700',
    focus: 'focus:ring-yellow-500 focus:border-yellow-500',
    light: 'bg-yellow-50 dark:bg-yellow-900/20',
  },

  // Danger - Destructive actions (Red)
  danger: {
    bg: 'bg-red-500 dark:bg-red-600',
    text: 'text-red-500 dark:text-red-600',
    border: 'border-red-500 dark:border-red-600',
    hover: 'hover:bg-red-600 dark:hover:bg-red-700',
    focus: 'focus:ring-red-500 focus:border-red-500',
    light: 'bg-red-50 dark:bg-red-900/20',
  },

  // Neutral - Backgrounds and borders (Black with opacity)
  neutral: {
    bg: 'bg-black/4 dark:bg-white/4', // OnBackground4
    text: 'text-black/64 dark:text-white/64', // OnBackground64
    border: 'border-black/16 dark:border-white/16', // Outline
    hover: 'hover:bg-black/8 dark:hover:bg-white/8',
    focus: 'focus:ring-black/16 focus:border-black/16',
    light: 'bg-black/2 dark:bg-white/2',
  },

  // Surface - Cards and containers (White/Dark)
  surface: {
    bg: 'bg-white dark:bg-gray-900',
    text: 'text-black dark:text-white', // OnBackground
    border: 'border-black/16 dark:border-white/16', // Outline
    hover: 'hover:bg-black/2 dark:hover:bg-white/2',
    focus: 'focus:ring-black/16 focus:border-black/16',
    light: 'bg-black/1 dark:bg-white/1',
  },
} as const;

/**
 * Color Usage Guidelines:
 * 
 * 1. PRIMARY (#7F56D9): Main actions, primary buttons, brand elements
 *    - Use for: "Save", "Update", "Submit", "Continue" buttons
 *    - Use for: Brand logos, main navigation highlights
 * 
 * 2. SECONDARY (Blue): Supporting actions, secondary buttons
 *    - Use for: "Cancel", "Back", "Edit" buttons
 *    - Use for: Links, informational elements
 * 
 * 3. SUCCESS (Green): Positive feedback, successful actions
 *    - Use for: Success messages, "Complete", "Done" buttons
 *    - Use for: Status indicators, checkmarks
 * 
 * 4. WARNING (Yellow): Caution, attention needed
 *    - Use for: Warning messages, "Are you sure?" dialogs
 *    - Use for: Pending states, attention-grabbing elements
 * 
 * 5. DANGER (Red): Destructive actions, errors
 *    - Use for: "Delete", "Remove", "Cancel" actions
 *    - Use for: Error messages, validation errors
 * 
 * 6. NEUTRAL (Black with opacity): Backgrounds, disabled states
 *    - Use for: Disabled buttons, secondary backgrounds (4% opacity)
 *    - Use for: Borders, dividers (16% opacity)
 *    - Use for: Secondary text (64% opacity)
 * 
 * 7. SURFACE (White/Dark): Cards, containers, main backgrounds
 *    - Use for: Card backgrounds, main content areas
 *    - Use for: Modal backgrounds, form containers
 * 
 * Brand Color Specifications:
 * - Background: white
 * - Outline: black 16% opacity
 * - OnBackground4: black 4% opacity
 * - OnBackground64: black 64% opacity
 * - OnBackground: black
 * - Primary: #7F56D9
 * 
 * Example Usage:
 * 
 * // Primary button with brand color
 * <button className={`px-4 py-2 rounded ${colors.primary.bg} text-white ${colors.primary.hover}`}>
 *   Save Changes
 * </button>
 * 
 * // Success message
 * <div className={`p-4 rounded ${colors.success.light} ${colors.success.border}`}>
 *   <p className={colors.success.text}>Successfully saved!</p>
 * </div>
 * 
 * // Neutral background with 4% opacity
 * <div className={`p-4 rounded ${colors.neutral.bg}`}>
 *   <p className={colors.neutral.text}>Secondary content</p>
 * </div>
 * 
 * // Surface with outline
 * <div className={`p-4 rounded ${colors.surface.bg} ${colors.surface.border} ${colors.surface.text}`}>
 *   Card content
 * </div>
 */ 