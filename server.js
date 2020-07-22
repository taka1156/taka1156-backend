const express = require('express');
const asyncHandler = require('express-async-handler'); // expressでもasync使いたい
const app = express();
const db = require('./sqlite.js');

// 表示関連
const HEIGHT = 28;
const WIDTH = 27;
const DIGIT = 8; //桁

// 0埋め
function zeroPadding(num) {
  return ('0000000000' + num).slice(-DIGIT);
}

// SVG生成
function makeSvg(viewer) {
  let len = '';
  const DISPLAY_NUM = zeroPadding(viewer);

  for (let i = 0; i < DIGIT; i++) {
    const IMG = `<rect id="Rectangle" fill="#000000" x=\"${i * WIDTH}\" y="0" width=\"${WIDTH}\" height=\"${HEIGHT}\"></rect>
      <text id="0" font-family="Courier" font-size="24" font-weight="normal" fill="white">
        <tspan x=\"${i * WIDTH + 6}\" y="22">${DISPLAY_NUM[i]}</tspan>
      </text>`;

    len = len + IMG;
  }

  return `<svg width=\"${WIDTH * DIGIT}px\" height=\"${HEIGHT}px\" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Counter</title>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
     ${len}
    </g>
  </svg>`;
}

// 簡易的な生死確認
app.get('/', (req, res) => {
  const client = req.query.client
  if (client === 'gas') {
    res.send('Glitch woke up')
    return
  }
  res.send('<h1>Server is running</h1>');
});

// 閲覧回数返却
app.get('/counter.svg',asyncHandler(async (req, res) => {
    const VIEWER = (await db.read()) + 1; //　閲覧数読み取り
    await db.add(VIEWER); // 更新
    res.set({
      'content-type': 'image/svg+xml',
      'cache-control': 'max-age=0, no-cache, no-store, must-revalidate'
    });
    res.send(makeSvg(VIEWER));
  })
);

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port' + listener.address().port);
});
