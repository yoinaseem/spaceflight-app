// Generate consistent color based on news site name
export const getAccentColor = (siteName: string): string => {
  const colors = [
    '#60a5fa', // lighter blue
    '#a78bfa', // lighter purple
    '#f9a8d4', // lighter pink
    '#fbbf24', // lighter amber
    '#6ee7b7', // lighter emerald
    '#67e8f9', // lighter cyan
    '#fb923c', // lighter orange
    '#818cf8', // lighter indigo
  ];

  let hash = 0;
  for (let i = 0; i < siteName.length; i++) {
    hash = siteName.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};
