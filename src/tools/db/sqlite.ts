import * as sqlite3 from 'sqlite3';
const sqlite = sqlite3.verbose();
const db = new sqlite.Database('counters.sqlite');

db.serialize(() => {
  let isViewerData = false;
  // テーブルがなければ作成
  db.run('CREATE TABLE IF NOT EXISTS counter(id INTEGER , viewer INTEGER)', err => {
    if (err) {
      return console.error(err.message);
    }
  });

  db.get('SELECT * FROM counter WHERE id = 0', (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    // id = 0のデータがなければ新規にデータを挿入
    if (row != null) {
      isViewerData = true;
    }
  });

  // id = 0のデータを挿入
  if (!isViewerData) {
    db.run('INSERT INTO counter values(0, 0)', err => {
      if (err) {
        return console.error(err.message);
      }
    });
  }
});

// 閲覧回数更新
const add = (viewer: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      try {
        db.run(`UPDATE counter SET viewer = ${viewer} WHERE id = 0`);
        return resolve();
      } catch (e) {
        return reject(e);
      }
    });
  });
};

// 閲覧回数取得
const read = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      try {
        db.get('SELECT * FROM counter WHERE id = 0', (err, { viewer }) => {
          return resolve(viewer);
        });
      } catch (e) {
        return reject(e);
      }
    });
  });
};

export default { add, read };
