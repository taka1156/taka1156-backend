const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("counters.sqlite");

db.serialize(() => {
  let isViewer = false;
  // テーブルがなければ作成
  db.run("CREATE TABLE IF NOT EXISTS counter(id INTEGER , viewer INTEGER)");
  
  db.get('SELECT * FROM counter WHERE id = 0', function(err, row) {
    if (err) {
      return console.error(err.message);
    }
    if(row != null) {
      isViewer = true;
    }
  });

  // プリペアードステートメントでデータ挿入
  if(!isViewer) {
    db.run(`INSERT INTO counter values(0, 0)`, function(err) {
      if (err) {
        return console.error(err.message);
      }
    });
  }
});

// 閲覧回数更新
async function add(num) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      try {
        db.run(`UPDATE counter SET viewer = ${num} WHERE id = 0`);
        return resolve();
      } catch(e) {        
        return reject(e);
      }
    });
  });
}

// 閲覧回数取得
async function read() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      try {
        let viewer = 0;
        db.get('SELECT * FROM counter WHERE id = 0', (err, row) => {
            console.log(row.viewer);
            return resolve(row.viewer);
        });
      } catch(e) {        
        return reject(e);
      }
    });
  });
}

module.exports = { add, read };
