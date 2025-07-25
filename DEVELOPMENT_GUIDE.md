# YAMLでつくる！レトロ育成ゲーム 開発＆改造ガイド

## 1. はじめに

このプロジェクトは、`rules.yml` というたった一つの設定ファイルを編集するだけで、あなただけのオリジナルな「たまごっち風育成ゲーム」を作れるゲームエンジンです。

このガイドを読めば、キャラクターの見た目（絵文字）や進化の条件、お世話の内容まで、すべてを自由自在にカスタマイズする方法がわかります。

## 2. ゲームの実行方法

### 必要なもの
*   Webブラウザ (Google Chrome, Firefoxなど)
*   テキストエディタ (VSCode, Sublime Textなど)

### 実行手順
1.  **Webサーバーの起動**
    *   このプロジェクトのフォルダをターミナル（コマンドプロンプト）で開きます。
    *   以下のコマンドを実行して、簡易的なWebサーバーを起動します。
    ```bash
    python3 -m http.server 8000
    ```
    *   もし`python3`で動かない場合は`python`を試してください。

2.  **ブラウザでアクセス**
    *   Webブラウザを開き、アドレスバーに以下のURLを入力します。
    > http://localhost:8000

これでゲームが起動します！

## 3. カスタマイズ方法: `rules.yml`の歩き方

このゲームのすべては`rules.yml`で定義されています。各項目の意味を解説します。

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
*   `engine.js`: `rules.yml`を読み込んでゲームを動かす、心臓部のプログラム。
*   `rules.yml`: このゲームのルール、キャラクター、アイテムなどを定義する設計図。 