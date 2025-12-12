
export const baseColors = {
  yellow: '#ffcc00',
  blue: '#00ccff',
  magenta: '#cc00ff',
  paleGreen: '#00ffcc',
  vibrantBlue: '#1c55ff',
  pink: '#ffccff',
}

export const extraColors = {
  white: '#ffffff',
}

export const colors = {
  ...baseColors,
  ...extraColors,
}

export const colorValues = Object.values(colors)
