import { colors } from '@/lib/colors'

interface ColorPickerProps {
  onColorSelect?: (colorKey: keyof typeof colors) => void
  showLabels?: boolean
  className?: string
}

export default function ColorPicker({ onColorSelect, showLabels = true, className = '' }: ColorPickerProps) {
  const colorEntries = Object.entries(colors) as [keyof typeof colors, typeof colors[keyof typeof colors]][]

  return (
    <div className={`grid grid-cols-7 gap-4 ${className}`}>
      {colorEntries.map(([key, color]) => (
        <div
          key={key}
          className="flex flex-col items-center cursor-pointer group"
          onClick={() => onColorSelect?.(key)}
        >
          {/* Color Swatch */}
          <div 
            className={`w-12 h-12 rounded-lg border-2 border-gray-300 ${color.bg} group-hover:scale-110 transition-transform`}
            title={`${key} - ${color.bg}`}
          />
          
          {/* Label */}
          {showLabels && (
            <div className="mt-2 text-center">
              <p className="text-xs font-medium capitalize text-gray-700 dark:text-gray-300">
                {key}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {getColorDescription(key)}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function getColorDescription(colorKey: keyof typeof colors): string {
  const descriptions = {
    primary: '#7F56D9',
    secondary: 'Supporting actions', 
    success: 'Positive feedback',
    warning: 'Caution needed',
    danger: 'Destructive actions',
    neutral: 'Black/4% opacity',
    surface: 'White background'
  }
  return descriptions[colorKey]
}

// Color Usage Examples Component
export function ColorUsageExamples() {
  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Color Usage Examples
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Primary Example */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Primary (#7F56D9)</h4>
          <button className={`px-4 py-2 rounded-lg text-white font-medium ${colors.primary.bg} ${colors.primary.hover}`}>
            Save Changes
          </button>
        </div>

        {/* Secondary Example */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Secondary (Blue)</h4>
          <button className={`px-4 py-2 rounded-lg text-white font-medium ${colors.secondary.bg} ${colors.secondary.hover}`}>
            Edit
          </button>
        </div>

        {/* Success Example */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Success (Green)</h4>
          <div className={`p-3 rounded-lg ${colors.success.light} ${colors.success.border}`}>
            <p className={`text-sm ${colors.success.text}`}>✓ Successfully saved!</p>
          </div>
        </div>

        {/* Warning Example */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Warning (Yellow)</h4>
          <div className={`p-3 rounded-lg ${colors.warning.light} ${colors.warning.border}`}>
            <p className={`text-sm ${colors.warning.text}`}>⚠ Please review before continuing</p>
          </div>
        </div>

        {/* Danger Example */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Danger (Red)</h4>
          <button className={`px-4 py-2 rounded-lg text-white font-medium ${colors.danger.bg} ${colors.danger.hover}`}>
            Delete
          </button>
        </div>

        {/* Neutral Example */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Neutral (Black/4%)</h4>
          <div className={`p-3 rounded-lg ${colors.neutral.bg} ${colors.neutral.border}`}>
            <p className={`text-sm ${colors.neutral.text}`}>Secondary content</p>
          </div>
        </div>

        {/* Surface Example */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Surface (White)</h4>
          <div className={`p-4 rounded-lg ${colors.surface.bg} ${colors.surface.border} ${colors.surface.text}`}>
            <p className="text-sm">Card content goes here</p>
          </div>
        </div>
      </div>
    </div>
  )
} 