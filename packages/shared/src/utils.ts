export function batch<T>(items: T[], batchSize: number): T[][] {
  if (items.length <= batchSize) {
    return [items];
  }

  return items.reduce<T[][]>((acc, item, index) => {
    const chunk = Math.floor(index / batchSize);

    if (!acc[chunk]) {
      acc[chunk] = [];
    }

    acc[chunk].push(item);

    return acc;
  }, []);
}
