export function beautifyUnit(unit: 'time' | 'weight' | 'body-weight') {
  switch (unit) {
    case 'time':
      return 'units.seconds';
    case 'weight':
      return 'units.kg';
    case 'body-weight':
      return 'units.percentage';
  }
}
