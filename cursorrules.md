- name: "Step 1: Project Setup"
  prompt: "レトロ育成ゲームのプロジェクトをセットアップします。`index.html`, `style.css`, `engine.js`, `rules.yml` の4つのファイルを作成してください。"

- name: "Step 2: Create HTML Structure"
  prompt: "`index.html`を編集します。Google Fontsから'Press Start 2P'を読み込み、ゲームのタイトル、キャラクター（絵文字）表示エリア、ふきだし、ステータス、アクションボタンのパネルなど、画面の骨組みを配置してください。"

- name: "Step 3: Apply Retro CSS Design"
  prompt: "`style.css`を全面的に書き換えます。ゲームボーイ風のカラーパレットとレイアウト、ドットフォントの適用、丸いボタンのデザインなど、絵文字表示に特化したレトロゲームの雰囲気にしてください。"

- name: "Step 4: Define Game Rules in YAML"
  prompt: |
    `rules.yml`にゲームのルールを定義します。以下の内容をコピーしてください。
    ```yaml
    # ------------------------------------
    # 育成ゲームのルール設定ファイル
    # ------------------------------------

    # ゲームの基本設定
    game_title: "育成ゲーム"

    # ------------------------------------
    # キャラクターの定義
    # ------------------------------------
    characters:
      - id: "egg"
        name: "タマゴ"
        emoji: "🥚"
        evolve_to: "child"
        evolve_conditions:
          - type: "time"
            value: 10 # 10秒経過で進化

      - id: "child"
        name: "こども"
        emoji: "🐣"
        evolutions:
          - to: "adult_angel"
            conditions:
              - type: "parameter"
                target: "mood"
                value: 70
              - type: "time"
                value: 60
          - to: "adult_devil"
            conditions:
              - type: "time"
                value: 60

      - id: "adult_angel"
        name: "てんし"
        emoji: "😇"
        evolutions:
          - to: "tomb"
            conditions:
              - type: "time"
                value: 180

      - id: "adult_devil"
        name: "あくま"
        emoji: "😈"
        evolutions:
          - to: "tomb"
            conditions:
              - type: "time"
                value: 120

      - id: "tomb"
        name: "おはか"
        emoji: "🪦"
        is_final_state: true

    # ------------------------------------
    # パラメータの定義
    # ------------------------------------
    parameters:
      - id: "hunger"
        name: "おなか"
        max_value: 100
        initial_value: 80
        decrease_per_second: 1
      - id: "mood"
        name: "ごきげん"
        max_value: 100
        initial_value: 50
        decrease_per_second: 2

    # ------------------------------------
    # プレイヤーのアクション（お世話ボタン）の定義
    # ------------------------------------
    actions:
      - id: "feed"
        name: "ごはん"
        message: "おいしい！"
        effects:
          - target: "hunger"
            value: 30
      - id: "play"
        name: "あそぶ"
        message: "たのしいな！"
        effects:
          - target: "mood"
            value: 20
    ```

- name: "Step 5: Implement Game Engine in JS"
  prompt: |
    `engine.js`にゲームのロジックを実装します。
    - `rules.yml`の読み込みと解釈。
    - 時間経過によるパラメータの自然減少。
    - お世話ボタンの効果（パラメータ回復、セリフ再生）。
    - `rules.yml`に基づいた複雑な分岐進化の処理。
    - ゲームオーバー（最終形態への進化）を検知し、ループを停止して「はじめから」ボタンを表示するリスタート機能。

- name: "Step 6: Create Development Guides"
  prompt: "プロジェクトのドキュメントを作成します。ユーザー向けの`DEVELOPMENT_GUIDE.md`と、AIアシスタント向けの`BUILD_GUIDE.md`の2つを作成してください。`DEVELOPMENT_GUIDE.md`にはゲームの遊び方と`rules.yml`の改造方法を、`BUILD_GUIDE.md`にはここまでの構築手順をまとめてください。"

- name: "Step 7: Run and Finalize"
  prompt: "全てのファイルが完成しました。最後に `python3 -m http.server 8000` を実行してWebサーバーを起動し、ユーザーに http://localhost:8000 へアクセスして動作確認するよう案内し、プロジェクトを完了してください。" 