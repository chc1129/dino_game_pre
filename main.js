// ============================================================
// main.js
// ゲームループ・初期化・入力処理・シーン管理
// ============================================================

let canvas, g;
let player;
let enemies = [];
let gameOverImg;
let frameCnt, score;
let scene;
let jumpPressed = false;
let groundTiles = [];
let groundTileWidth = 0;
let clouds = [];
let animationId = 0;

// ゲーム起動時の処理
window.onload = function () {
    canvas = document.getElementById("gamecanvas");
    g = canvas.getContext("2d");

    init();

    document.onkeydown = keydown;
    document.onkeyup   = keyup;

    loop();
};


// ゲームループ（requestAnimationFrameで約60FPS）
function loop() {
    mainloop();
    // アニメーションIDを保持してキャンセルできるようにする
    animationId = requestAnimationFrame(loop);
}

// 毎フレームの処理：更新→描画の順で実行
function mainloop() {
    update();
    draw();
}


// ゲーム全体の初期化
function init() {
    // リスタート時に既存のループをキャンセルしてから再開する
    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    // 生成と初期化を createPlayer() に一本化
    player = createPlayer();

    // 敵を2体生成して配列に格納
    enemies = [];
    [GameConfig.ENEMY_START_X, GameConfig.ENEMY_START_X + 400].forEach(startX => {
        enemies.push(createEnemy(startX)); // enemy.jsで定義
    });

    // ゲームオーバー画像を事前ロード
    gameOverImg     = new Image();
    gameOverImg.onload = () => {};
    gameOverImg.src = CharacterImages.chrgameover;

    initClouds();  // cloud.jsで定義
    initGround();  // ground.jsで定義

    scene       = Scenes.Title;
    score       = 0;
    frameCnt    = 0;
    jumpPressed = false;
}


// シーンごとの更新処理
function update() {
    if (scene === Scenes.GameMain) playGame();
    // Title・GameOverは更新処理なし
}

// シーンごとの描画処理
function draw() {
    if      (scene === Scenes.Title)    { drawTitle(g);                         }
    else if (scene === Scenes.GameMain) { drawGame(g, player, enemies, score);  }
    else if (scene === Scenes.GameOver) {
        drawGame(g, player, enemies, score);
        drawGameOver(g, player, gameOverImg);
    }
    // GameOverはdrawGame()の上にdrawGameOver()をオーバーレイ
}


// キー押下処理
function keydown(e) {
    if (scene === Scenes.Title) {
        if (e.key === " " || e.key === "Enter") {
        scene = Scenes.GameMain;
        }
    } else if (scene === Scenes.GameMain) {
        // 地面にいるときのみジャンプ受付（空中での連続ジャンプ防止）
        if (!jumpPressed &&
            player.posy >= GameConfig.GROUND_LEVEL &&
            JUMP_KEYS.includes(e.key)) {

            jumpPressed         = true;
            player.speed        = GameConfig.PLAYER_JUMP_SPEED;
            player.acceleration = GameConfig.PLAYER_JUMP_ACCEL;
        }
    } else if (scene === Scenes.GameOver) {
        // GameOver時にスペース・エンターでリスタート
        if (e.key === " " || e.key === "Enter") {
            restart();
            return;
        }
    }
}


// キー離上処理
function keyup(e) {
    if (JUMP_KEYS.includes(e.key)) {
        jumpPressed = false;
    }
}


// ゲームメインループ処理
function playGame() {
    // プレイヤー移動・着地判定
    const isLanded = updatePlayer(player); // player.jsで定義
    if (isLanded) jumpPressed = false;

    // 敵の移動・再配置・当たり判定
    const isHit = updateEnemies(enemies, player); // enemy.jsで定義
    if (isHit) {
        // ゲームオーバー処理
        scene = Scenes.GameOver;
        enemies.forEach(e => { e.speed = 0; e.acceleration = 0; });
        player.speed        = 0;
        player.acceleration = 0;
        jumpPressed         = false;
        // ゲームオーバー確定後は以降の処理をスキップ
        return;
    }

    // playerのアニメーション処理をコール
    updatePlayerAnimation(player, frameCnt); // player.jsで定義
    // enemyのアニメーション処理をコール
    updateEnemyAnimation(enemies, frameCnt); // enemy.jsで定義
    // 雲のスクロール処理をコール
    updateClouds();                          // cloud.jsで定義
    // 地面のスクロール処理をコール
    const scrollSpeed = enemies[0].speed + enemies[0].acceleration;
    updateGround(scrollSpeed);               // ground.jsで定義

    // スコアカウンタ処理をコール
    scoreCount();
    // フレームカウンタ処理をコール
    frameCounter();
}


// ゲームリスタート処理
// GameOver時のキー入力から呼び出される
function restart() {
    // 既存のアニメーションループをキャンセル
    // キャンセルしないとloop()が多重起動してしまう
    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    //既存のinit()を利用してゲーム状態を初期化
    // player・enemy・cloud・groundの初期化も内部で実施される
    init();

    // 既存のloop()を利用してゲームループを再起動
    loop();
}



// スコアカウント・敵速度更新
function scoreCount() {
    score++;
    // SCORE_UP_INTERVALの倍数スコアでサウンド再生
    if (score % SoundConfig.SCORE_UP_INTERVAL === 0) {
        playScoreUp(); // sound.jsで定義
    }
    updateEnemySpeed(enemies, score); // enemy.jsで定義
}

// フレームカウンタ（0〜FRAME_COUNTER_RESETでループ）
function frameCounter() {
    frameCnt++;
    if (frameCnt > GameConfig.FRAME_COUNTER_RESET) {
        frameCnt = 0;
    }
}


