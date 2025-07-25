# DEVELOPMENT_GUIDE.md

## 2. ゲームの実行方法
**`index.html` ファイルをお使いのWebブラウザで開くだけでゲームを開始できます。**
ローカルサーバーの起動は不要です。

## 3. カスタマイズ方法: `rules.js`の歩き方
このゲームのすべては **`rules.js`** ファイルで定義されています。ファイルの中にある `gameRulesYAML` という変数の内容（バッククォート `` ` `` で囲まれた部分）を編集してください。

---

### 基本設定
```yaml
game_title: "育成ゲーム"
```
*   `game_title`: ゲーム画面の上部に表示されるタイトルです。

---

### `characters`: キャラクターの定義
```yaml
characters:
  - id: "child"
    name: "こども"
    emoji: "🐣"
    evolutions:
      - to: "adult_angel"
        conditions:
          - type: "time"
            value: 60
  - id: "tomb"
    name: "おはか"
    emoji: "🪦"
    is_final_state: true
```
*   `id`: 他の場所から参照するための、キャラクターのユニークなIDです（英数字推奨）。
*   `name`: ゲーム中に表示される名前です。
*   `emoji`: 表示したい絵文字です。
*   `is_final_state`: `true`にすると、このキャラクターが最終形態となり、ゲームが終了します。
*   `evolutions`: 進化の条件を定義します。
    *   `to`: 進化先のキャラクターの`id`。
    *   `conditions`: 進化するための条件をリスト形式で記述します（すべて満たすと進化）。
        *   `type: 'time'`: `value`秒、現在のキャラクターで居続けると条件を満たします。
        *   `type: 'parameter'`: `target`で指定したパラメータIDが、`value`以上の値になると条件を満たします。
    *   **重要**: `evolutions`リストは、上から順番に評価されます。条件が緩やかなものを下に書くのがコツです。

---

### `parameters`: ステータスの定義
```yaml
parameters:
  - id: "hunger"
    name: "おなか"
    max_value: 100
    initial_value: 80
    decrease_per_second: 1
```
*   `id`: パラメータのユニークなIDです。
*   `name`: 画面に表示される名前です。
*   `max_value`: パラメータの最大値です。
*   `initial_value`: ゲーム開始時の初期値です。
*   `decrease_per_second`: 1秒あたりに自然に減少していく量です。

---

### `actions`: お世話ボタンの定義
```yaml
actions:
  - id: "feed"
    name: "ごはん"
    message: "おいしい！"
    effects:
      - target: "hunger"
        value: 30
```
*   `id`: アクションのユニークなIDです。
*   `name`: ボタンに表示されるテキストです。
*   `message`: ボタンを押したときにキャラクターがしゃべるセリフです。
*   `effects`: ボタンを押したときの効果を定義します。
    *   `target`: 影響を与えたいパラメータの`id`。
    *   `value`: パラメータをいくつ増減させるか。

## 4. プロジェクトの構造
*   `index.html`: ゲーム画面の骨組みとなるファイル。
*   `style.css`: ゲームの見た目をレトロ風にデザインするファイル。
*   `engine.js`: `rules.js`を読み込んでゲームを動かす、心臓部のプログラム。
*   `rules.js`: ゲームのルールをYAML形式の文字列として定義するファイル。 