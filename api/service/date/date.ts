// 日付を整形して返却
const getDate = (): SvgDisplay => {
  const SHAPED_DATE: SvgDisplay = shapedDate();
  return SHAPED_DATE;
};

// 日付の整形
const shapedDate = (): string[] => {
  const DATE = new Date().toLocaleDateString('ja-JP');
  return [...DATE].map(c => (c === '-' ? '/' : c));
};

export { getDate };
