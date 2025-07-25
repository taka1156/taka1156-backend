import Database from 'better-sqlite3';

const db = new Database('counters.sqlite');

// 初期化処理：テーブル作成と初期データ挿入（存在しない場合のみ）
const initializeCounter = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS counter (
      id INTEGER PRIMARY KEY,
      viewer INTEGER NOT NULL DEFAULT 0
    );
  `);

  const existing = db.prepare('SELECT 1 FROM counter WHERE id = ?').get(0);
  if (!existing) {
    db.prepare('INSERT INTO counter (id, viewer) VALUES (?, ?)').run(0, 0);
  }
};

// 閲覧数の更新
const incrementViewer = (viewer: number): void => {
  db.prepare('UPDATE counter SET viewer = ? WHERE id = ?').run(viewer, 0);
};

// 閲覧数の取得
const getViewerCount = (): number => {
  const row = db.prepare('SELECT viewer FROM counter WHERE id = ?').get(0);

  if (typeof row === 'object' && row != null && 'viewer' in row && typeof row.viewer === 'number') {
    return row.viewer
  }

  return 0
};

// 初期化は即時実行
initializeCounter();

export default {
  add: (viewer: string) => incrementViewer(Number(viewer)),
  read: () => getViewerCount(),
};
