let canvas, g;
let player;
let enemies = [];
let frameCnt, score, rand;
let scene;
let jumpPressed = false;

// Spriteクラス
class Sprite {
  image = null;
  posx= 0;
  posy = 0;
  addposy = 0;
  r = 0;
  speed = 0;
  acceleration = 0;

  draw(g) {
    g.drawImage(
        this.image,
        this.posx - this.image.width / 2,
        this.posy - this.image.height / 2
    );
  }
}

// シーン定義
const Scenes = {
  Title: "Title",
  GameMain: "GameMain",
  GameOver: "GameOver",
};

window.onload = function () {
  // 描画コンテキストの取得
  canvas = document.getElementById("gamecanvas");
  g = canvas.getContext("2d");
  // 初期化
  init();
  // 入力処理の指定
  document.onkeydown = keydown;
  // ゲームループの設定 60FPS(16ms)
  loop();
};

function loop() {
  mainloop();
  requestAnimationFrame(loop);
}

function init() {
  // 自キャラ設定
  player = new Sprite();
  player.image = new Image();   // ← これを追加
  player.image.onload = () => {};
  player.image.src = CharacterImages.chrRun1; // 画像の読み込み
  player.posx = GameConfig.PLAYER_START_X; // スタート位置
  player.posy = GameConfig.PLAYER_START_Y;
  player.r = GameConfig.PLAYER_RADIUS;
  player.speed = GameConfig.PLAYER_INITIAL_SPEED;
  player.acceleration = GameConfig.PLAYER_INITIAL_ACCEL;

  // 敵設定
  enemies = [];
  const enemyStartPositions = [
    GameConfig.ENEMY_START_X,
    GameConfig.ENEMY_START_X + 400
  ];

  enemyStartPositions.forEach((startX) => {
    const enemy = new Sprite();
    enemy.image = new Image();
    enemy.image.src = EnemyImages.enemy01; // 画像の読み込み
    enemy.posx = startX;
    enemy.posy = GameConfig.GROUND_LEVEL;
    enemy.r = GameConfig.ENEMY_RADIUS;     // 敵の当たり判定半径
    enemy.speed = GameConfig.ENEMY_INITIAL_SPEED; // 敵の初期速度
    enemy.acceleration = GameConfig.ENEMY_ACCELERATION;
    enemy.type = 'cactus1';
    enemy.isAnimated = false;
    enemies.push(enemy);
  });

  /*
  let enemy = new Sprite();
  enemy.image = new Image();
  enemy.image.src = EnemyImages.enemy01; // 画像の読み込み
  enemy.posx = GameConfig.ENEMY_START_X; // スタート位置
  enemy.posy = GameConfig.GROUND_LEVEL;
  enemy.r = GameConfig.ENEMY_RADIUS;     // 敵の当たり判定半径
  enemy.speed = GameConfig.ENEMY_INITIAL_SPEED; // 敵の初期速度
  enemy.acceleration = GameConfig.ENEMY_ACCELERATION; // 敵の加速度
  enemy.type = 'cactus1';
  enemy.isAnimated = false;
  */

  // ゲーム管理データ
  scene = Scenes.Title;
  // スコア初期化
  score = 0;
  // フレームカウンタ
  frameCnt = 0;
}

function keydown(e) {
  if (scene === Scenes.Title) {
    // タイトル画面
    if (e.key === " " || e.key === "Enter") {
      scene = Scenes.GameMain; // ゲーム開始
      return;
    }
  } else if (scene === Scenes.GameMain) {
    // Space or "↑" or Enter 押下時（キーリピート防止）
    if (!jumpPressed && JUMP_KEYS.includes(e.key)) {
      jumpPressed = true;
      player.speed = GameConfig.PLAYER_JUMP_SPEED;
      player.acceleration = GameConfig.PLAYER_JUMP_ACCEL;
    }
  }
}

function keyup(e) {
  // Space or "↑" or Enter 離上時
  if (JUMP_KEYS.includes(e.key)) {
    jumpPressed = false;
  }
}

function mainloop() {
  update(); // キャラ移動
  draw(); // キャラ描画
}

function update() {
  if (scene === Scenes.Title) {
    // タイトル画面
  } else if (scene === Scenes.GameMain) {
    // ゲーム実行中
    playGame();
  } else if ( scene === Scenes.GameOver) {
    // ゲームオーバー
    player.image.src = CharacterImages.chrgameover;
  }
}

function draw() {
  if (scene === Scenes.Title) {
    // タイトル画面
    drawTitle();
    return;
  } else if (scene === Scenes.GameMain) {
    // ゲーム実行中
    drawGame();
    return;
  } else if (scene === Scenes.GameOver) {
    // ゲームオーバー
    drawGameOver();
    return;
  }
}

function drawTitle() {
  g.fillStyle = "rgb(200,200,200)";
  g.fillRect(0, 0, GameConfig.CANVAS_WIDTH, GameConfig.CANVAS_HEIGHT);

  // タイトル
  g.fillStyle = "rgb(255,255,255)";  
  g.font = "24pt Arial Black";
  let titleLabel = "dino game";
  let titleLabelWidth = g.measureText(titleLabel).width;
  g.fillText(titleLabel, (GameConfig.CANVAS_WIDTH - titleLabelWidth) / 2, GameConfig.CANVAS_HEIGHT / 2 - 20);

  g.font = "16pt Arial Black";
  let startLabel = "スペースキーでスタート";
  let startLabelWidth = g.measureText(startLabel).width;
  g.fillText(startLabel, (GameConfig.CANVAS_WIDTH - startLabelWidth) / 2, GameConfig.CANVAS_HEIGHT / 2 + 20);
}

function drawGame() {
  // 背景描画
  g.fillStyle = "rgb(200,200,200)";
  g.fillRect(0, 0, GameConfig.CANVAS_WIDTH, GameConfig.CANVAS_HEIGHT);

  // キャラクタ描画
  player.draw(g);
  // 敵描画
  enemies.forEach(enemy => {
    enemy.draw(g);
  });
  //enemy.draw(g);

  // スコア描画
  g.fillStyle = "rgb(255,255,255)";
  g.font = "16pt Arial Black";
  let scoreLabel = "SCORE: " + score;
  let scoreLabelWidth = g.measureText(scoreLabel).width;
  g.fillText(scoreLabel, GameConfig.CANVAS_WIDTH - scoreLabelWidth - 20, 40); // 表示文言,位置指定(x,y)  
}

function drawGameOver() {
    // ゲームオーバー
    g.fillStyle = "rgb(255,255,255)";
    g.font = "24pt Arial Black";
    let gameOverLabel = "GAME OVER!!!";
    let gameOverLabelwidth = g.measureText(gameOverLabel).width;
    g.fillText(gameOverLabel, (GameConfig.CANVAS_WIDTH - gameOverLabelwidth) / 2, GameConfig.CANVAS_HEIGHT / 2);

    // キャラクタ描画
    player.draw(g);
}

function playGame() {
  // ゲーム実行中
  player.speed = player.speed + player.acceleration;
  player.posy = player.posy + player.speed;
  if (player.posy > GameConfig.GROUND_LEVEL) {
    player.posy = GameConfig.GROUND_LEVEL;
    player.speed = 0;
    player.acceleration = 0;
    jumpPressed = false;
  }

  // 敵の表示
  enemies.forEach((enemy) => {
    enemy.posx = enemy.posx - (enemy.speed + enemy.acceleration); // 敵の位置更新

    if (enemy.posx < 0) {
      const rand = Math.floor(Math.random() * ENEMY_SPAWN_TABLE.length);
      const enemyTypeKey = ENEMY_SPAWN_TABLE[rand];
      const enemyType = EnemyTypes[enemyTypeKey];

      enemy.type = enemyTypeKey;
      enemy.image.src = EnemyImages[enemyType.imageKey];
      enemy.posy = enemyType.posY;
      enemy.isAnimated = enemyType.isAnimated;

      if (enemyType.isAnimated) {
        const randIndex = Math.floor(Math.random() * enemyType.posYList.length);
        enemy.posy = enemyType.posYList[randIndex];
      }

      enemy.posx = GameConfig.CANVAS_WIDTH;
    }
/*
  // 敵表示
  enemy.posx = enemy.posx - (enemy.speed + enemy.acceleration); // 敵の位置更新

  // 敵が画面左端に行ったら画面右端に戻る
  if (enemy.posx < 0) {
    // ENEMY_SPAWN_TABLEから敵の種類をランダムに選択
    rand = Math.floor(Math.random() * ENEMY_SPAWN_TABLE.length);
    const enemyTypeKey = ENEMY_SPAWN_TABLE[rand];
    const enemyType = EnemyTypes[enemyTypeKey];

    enemy.type = enemyTypeKey;
    enemy.image.src = EnemyImages[enemyType.imageKey];
    enemy.posy = enemyType.posY;
    enemy.isAnimated = enemyType.isAnimated;
     // プテラノドンの場合は高さをランダムに設定
    if (enemyType.isAnimated) {
      const randIndex = Math.floor(Math.random() * enemyType.posYList.length);
      enemy.posy = enemyType.posYList[randIndex];
    }
    enemy.posx = GameConfig.CANVAS_WIDTH;
  */
  
    // 当たり判定
    const dx = player.posx - enemy.posx;
    const dy = player.posy - enemy.posy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < player.r + enemy.r) {
      // Hit!!!
      scene = Scenes.GameOver;
      enemy.speed = 0;
    }

    if (enemy.isAnimated && enemy.type === 'pteranodon') {
      enemy.image.src = frameCnt <= 5 ? EnemyImages.enemy04 : EnemyImages.enemy05;
    }
  });

  // スコアカウンタ
  scoreCount();
  // フレームカウンタ
  frameCounter();

  // dinoトコトコ
  if (player.posy < GameConfig.GROUND_LEVEL) {
    // jump
    player.image.src = CharacterImages.chrJump;
  } else {
    if (frameCnt <= 5) {
      player.image.src = CharacterImages.chrRun1;
    } else {
      player.image.src = CharacterImages.chrRun2;
    }
  }

  // トリ（プテラ）パタパタ
  if (enemy.isAnimated && enemy.type === 'pteranodon') { 
    if (frameCnt <= 5) {
        enemy.image.src = EnemyImages.enemy04;
    } else {
        enemy.image.src = EnemyImages.enemy05;
    }
  }
}

function scoreCount() {
  score++;
  // スコアが上がる毎に敵の速度を上げる
  enemy.acceleration = score / GameConfig.ENEMY_ACCEL_FACTOR;
  enemy.speed = enemy.speed + enemy.acceleration;
}


function frameCounter() {
  // フレームカウンタ
  frameCnt++;
  if (frameCnt > GameConfig.FRAME_COUNTER_RESET) {
    // 10fでリセット
    frameCnt = 0;
  }
}
