// 日付を整形して返却
const getDate = (): string[] => {
  const SHAPED_DATE = shapedDate(new Date());
  return SHAPED_DATE;
};

// 日付の整形
const shapedDate = (date: Date): string[] => {
  const DATE = new Date(date).toLocaleDateString('ja-jp');
  return [...DATE].map(c => (c === '-' ? '/' : c));
};

export { getDate };
