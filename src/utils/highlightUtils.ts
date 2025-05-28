
export const getHighlightLevel = (percentage: number): 'none' | 'low' | 'medium' | 'high' => {
  if (percentage < 20) return 'none';
  if (percentage < 50) return 'low';
  if (percentage < 75) return 'medium';
  return 'high';
};
