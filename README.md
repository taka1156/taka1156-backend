# AccsessCounter

## 概要
Glitch + Express.js + Sqliteで作成したアクセスカウンターです。<br>
githubの自己紹介用README.mdで使用しています。<br>

## 仕組み
sqliteでアクセスが来るたびにカウントを行い、その度に、
svgを動的に生成してheaderの`content-type`に`image/svg+xml`として送付しています。

その他、キャッシュを無効にしたり、スリープするのを防ぐために、Google App Scriptで五分毎に、
Glitch Apiを叩く処理も使っています。

### 更新履歴

- 2020/07/22<br>
  アクセスカウンターの機能作成