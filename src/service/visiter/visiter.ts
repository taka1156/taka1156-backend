import db from '~/tools/db/sqlite';

// 閲覧者を計算して返却
const getVisiterCounts = async (): Promise<SvgDisplay> => {
  const VIEWER = (await db.read()) + 1; //　閲覧数読み取り
  await db.add(VIEWER); // 閲覧数更新
  const SHAPED_VIEWER: SvgDisplay = shapedVisiterCounts(VIEWER);
  return SHAPED_VIEWER;
};

// 閲覧者数の整形
const shapedVisiterCounts = (viewer: string): string[] => {
  const ZERO_PADDING_VIEWER = zeroPadding(viewer);
  return ZERO_PADDING_VIEWER.split('');
};

// 0埋め
const zeroPadding = (str: string, digit = 8): string => {
  const PADDING_CHAR = Array(10).fill(0).join('');
  return `${PADDING_CHAR + str}`.slice(-digit);
};

export { getVisiterCounts };
