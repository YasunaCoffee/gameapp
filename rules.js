// ゲームのルールを定義するJavaScriptファイル

const gameRulesYAML = `
# ------------------------------------
# 育成ゲームのルール設定
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
        value: 10

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
`; 