// ------------------------------------
// ゲームエンジン (engine.js)
// ------------------------------------

document.addEventListener('DOMContentLoaded', async () => {
    let gameInterval; // ゲームループのタイマーを保持する変数

    async function startGame() {
        if (gameInterval) {
            clearInterval(gameInterval);
        }

        // --- 1. 初期設定 -------------------------
        const config = await loadConfig();
        const elements = getDOMElements();
        let gameState = initializeGameState(config);

        // --- 2. 画面の初期描画 --------------------
        render(config, gameState, elements);

        // --- 3. ゲームループの開始 ------------------
        gameInterval = setInterval(() => {
            const isGameOver = updateGameState(config, gameState);
            render(config, gameState, elements);

            if (isGameOver) {
                clearInterval(gameInterval);
                showRestartButton(elements);
            }
        }, 1000); // 1秒ごとに更新
    }

    function showRestartButton(elements) {
        elements.actionsPanel.innerHTML = ''; // ボタンをクリア
        const restartButton = document.createElement('button');
        restartButton.textContent = "最初から";
        restartButton.style.width = '160px'; // 横長のボタン
        restartButton.style.borderRadius = '10px';
        restartButton.addEventListener('click', startGame);
        elements.actionsPanel.appendChild(restartButton);
    }
    
    // ゲーム開始
    startGame();
});

// 設定ファイル(rules.yml)を読み込む
async function loadConfig() {
    const response = await fetch('rules.yml');
    const ymlText = await response.text();
    return jsyaml.load(ymlText);
}

// HTML要素を取得する
function getDOMElements() {
    return {
        title: document.getElementById('game-title'),
        characterDisplay: document.getElementById('character-display'), // 絵文字表示用
        speechBubble: document.getElementById('speech-bubble'),
        statusDisplay: document.getElementById('status-display'),
        actionsPanel: document.getElementById('actions-panel'),
    };
}

// ゲーム状態を初期化する
function initializeGameState(config) {
    const state = {
        characterId: config.characters[0].id,
        parameters: {},
        age: 0, // 経過時間(秒)
        currentMessage: "", // 表示中のメッセージ
        messageTimeout: null, // メッセージを消すタイマー
    };
    config.parameters.forEach(p => {
        state.parameters[p.id] = p.initial_value;
    });
    return state;
}

// アクションボタンのクリックイベントを設定する
function setupActionButtons(config, gameState, elements) {
    elements.actionsPanel.innerHTML = '';
    config.actions.forEach(action => {
        const button = document.createElement('button');
        button.textContent = action.name;
        button.addEventListener('click', () => {
            // パラメータの更新
            action.effects.forEach(effect => {
                const param = gameState.parameters[effect.target];
                const paramConfig = config.parameters.find(p => p.id === effect.target);
                gameState.parameters[effect.target] = Math.min(paramConfig.max_value, param + effect.value);
            });
            // メッセージの表示
            if (action.message) {
                showSpeechBubble(action.message, gameState, elements);
            }
            render(config, gameState, elements); // 即時反映
        });
        elements.actionsPanel.appendChild(button);
    });
}

// ふきだしにメッセージを表示する
function showSpeechBubble(message, gameState, elements) {
    // 既存のタイマーをクリア
    if (gameState.messageTimeout) {
        clearTimeout(gameState.messageTimeout);
    }
    
    gameState.currentMessage = message;
    elements.speechBubble.textContent = message;
    elements.speechBubble.classList.remove('hidden');

    // 3秒後にメッセージを消す
    gameState.messageTimeout = setTimeout(() => {
        gameState.currentMessage = "";
        elements.speechBubble.classList.add('hidden');
    }, 3000);
}

// ゲームの状態を更新する (1秒ごと)
// @returns {boolean} ゲームオーバーならtrueを返す
function updateGameState(config, gameState) {
    gameState.age++;

    // パラメータの自然減少
    config.parameters.forEach(p => {
        gameState.parameters[p.id] = Math.max(0, gameState.parameters[p.id] - p.decrease_per_second);
    });

    // 進化のチェック
    const currentCharacter = config.characters.find(c => c.id === gameState.characterId);
    if (currentCharacter.evolutions) {
        // 分岐進化のロジック
        for (const evolution of currentCharacter.evolutions) {
            const allConditionsMet = evolution.conditions.every(cond => {
                if (cond.type === 'time') {
                    return gameState.age >= cond.value;
                }
                if (cond.type === 'parameter') {
                    return gameState.parameters[cond.target] >= cond.value;
                }
                return false;
            });

            if (allConditionsMet) {
                gameState.characterId = evolution.to;
                gameState.age = 0; // 進化したら年齢をリセット

                // 最終形態になったかチェック
                const newCharacter = config.characters.find(c => c.id === gameState.characterId);
                if (newCharacter.is_final_state) {
                    return true; // ゲームオーバー
                }

                break; 
            }
        }
    } else if (currentCharacter.evolve_to) {
        // 単純進化のロジック（後方互換性のため残す）
        const condition = currentCharacter.evolve_conditions.find(c => c.type === 'time');
        if (condition && gameState.age >= condition.value) {
            gameState.characterId = currentCharacter.evolve_to;
            gameState.age = 0;
        }
    }
    return false; // ゲームは続く
}

// 画面を再描画する
function render(config, gameState, elements) {
    const character = config.characters.find(c => c.id === gameState.characterId);
    
    // タイトル
    elements.title.textContent = character.name; // キャラ名を表示

    // キャラクター表示
    elements.characterDisplay.textContent = character.emoji;

    // ゲームオーバー状態の表示
    if (character.is_final_state) {
        elements.speechBubble.classList.add('hidden');
        elements.statusDisplay.innerHTML = ''; // ステータスをクリア
        elements.actionsPanel.innerHTML = ''; // ボタンをクリア
        return; // ここで描画を終了
    }

    // ふきだし
    if (gameState.currentMessage) {
        elements.speechBubble.textContent = gameState.currentMessage;
        elements.speechBubble.classList.remove('hidden');
    } else {
        elements.speechBubble.classList.add('hidden');
    }

    // パラメータ
    elements.statusDisplay.innerHTML = '';
    config.parameters.forEach(p => {
        const value = gameState.parameters[p.id];
        elements.statusDisplay.innerHTML += `<div>${p.name}: ${Math.floor(value)} / ${p.max_value}</div>`;
    });

    // ボタン（毎回再設定）
    setupActionButtons(config, gameState, elements);
} 