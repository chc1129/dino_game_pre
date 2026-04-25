let canvas, g;
let player;
let enemies = [];
let frameCnt, score, rand;
let scene;
let jumpPressed = false;
let grounds = []; // 地面画像の配列
let currentGroundIndex = 0; // 現在選択されている地面のインデックス
let groundScrollX = 0; // 地面のスクロール位置（X座標）

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
  player.image = new Image();
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
    GameConfig.ENEMY_START_X, // 1体目の敵の開始x座標
    GameConfig.ENEMY_START_X + 400, // 2体目の敵の開始x座標
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
    enemy.interval = 400; // 出現間隔の基準値
    enemies.push(enemy);
  });

    // ゲーム地面設定（3種類を配列で管理）
  const groundKeys = ['ground1', 'ground2', 'ground3'];
  groundKeys.forEach(key => {
    const ground = new Sprite();
    ground.image = new Image();
    ground.image.src = GroundImages[key];
    ground.posx = 0;
    ground.posy = GameConfig.GROUND_LEVEL + 20;
    // 地面も敵と同じ速度で移動（スクロール用）
    ground.speed = GameConfig.ENEMY_INITIAL_SPEED;
    ground.acceleration = GameConfig.ENEMY_ACCELERATION;
    grounds.push(ground);
  });

  // ゲーム開始時に地面をランダムで1つ選択
  currentGroundIndex = Math.floor(Math.random() * grounds.length);
  // スクロール位置を初期化
  groundScrollX = 0;


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

  // 地面描画
  drawGround();

  // キャラクタ描画
  player.draw(g);
  // 敵描画
  enemies.forEach(enemy => {
    enemy.draw(g);
  });

  // スコア描画
  g.fillStyle = "rgb(255,255,255)";
  g.font = "16pt Arial Black";
  let scoreLabel = "SCORE: " + score;
  let scoreLabelWidth = g.measureText(scoreLabel).width;
  g.fillText(scoreLabel, GameConfig.CANVAS_WIDTH - scoreLabelWidth - 20, 40); // 表示文言,位置指定(x,y)  
}

function drawGameOver() {
    // ゲームオーバー用のキャラクタ画像を事前に読み込み
    const gameOverImg = new Image();
    gameOverImg.src = CharacterImages.chrgameover;
    
    // ゲームオーバー画面描画
    g.fillStyle = "rgb(255,255,255)";
    g.font = "24pt Arial Black";
    let gameOverLabel = "GAME OVER!!!";
    let gameOverLabelwidth = g.measureText(gameOverLabel).width;
    g.fillText(gameOverLabel, (GameConfig.CANVAS_WIDTH - gameOverLabelwidth) / 2, GameConfig.CANVAS_HEIGHT / 2);

    // ゲームオーバー用のキャラクタ画像を描画
    player.image = gameOverImg;
    player.draw(g);
}

function drawGround() {
  // 選択された地面を使用
  const currentGround = grounds[1];
  // 画面幅を埋める所需的画像枚数を計算（+2で两端の切れ目をカバー）
  const tileCount = Math.ceil(GameConfig.CANVAS_WIDTH / currentGround.image.width) + 2;

  // スクロール位置から開始して、画面幅分以上描画
  for (let i = 0; i < tileCount; i++) {
    g.drawImage(
      currentGround.image,
      // X座標: スクロール位置 + (画像幅 × 何枚目か)
      groundScrollX + (i * currentGround.image.width),
      // Y座標: 地面の位置 - 画像高さの半分（中心基準のため）
      currentGround.posy - currentGround.image.height / 2
    );

  }
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

  // 地面のスクロール更新（敵と同じ速度で左に移動）
  const currentGround = grounds[currentGroundIndex];
  // 地面の位置を左にスクロール（敵と同じ速度計算）
  groundScrollX -= (currentGround.speed + currentGround.acceleration);
  // 画面幅分以上スクロールしたらリセット（ループ効果）
  if (groundScrollX <= -currentGround.image.width) {
    groundScrollX = 0;
  }


  enemies.forEach((enemy) => {
    enemy.posx = enemy.posx - (enemy.speed + enemy.acceleration); // 敵の位置更新

    if (enemy.posx < 0) {
      // 出現間隔をランダムに選択（300, 400, 600）
      const intervals = [300, 400, 600];
      enemy.interval = intervals[Math.floor(Math.random() * intervals.length)];

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

      // 画面右端から出現（他の敵が画面外にいる場合はその位置からinterval分後）
      const otherEnemy = enemies.find(e => e !== enemy);
      if (otherEnemy && otherEnemy.posx > GameConfig.CANVAS_WIDTH) {
        enemy.posx = otherEnemy.posx + enemy.interval;
      } 
      else {
        enemy.posx = GameConfig.CANVAS_WIDTH;
      }
    }
  
    // 当たり判定
    const dx = player.posx - enemy.posx;
    const dy = player.posy - enemy.posy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < player.r + enemy.r) {
      // Hit!!!
      scene = Scenes.GameOver;
      enemy.speed = 0;
      enemy.acceleration = 0;

      player.speed = 0;
      player.acceleration = 0;
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
  enemies.forEach(enemy => {
    if (enemy.isAnimated && enemy.type === 'pteranodon') { 
      if (frameCnt <= 5) {
          enemy.image.src = EnemyImages.enemy04;
      } else {
          enemy.image.src = EnemyImages.enemy05;
      }
    }
  });
}

function scoreCount() {
  score++;
  // スコアが上がる毎に敵の速度を上げる（上限あり）
  enemies.forEach(enemy => {
    enemy.acceleration = score / GameConfig.ENEMY_ACCEL_FACTOR;
    enemy.speed = enemy.speed + enemy.acceleration;
    // 速度が上限を超えないように制限
    if (enemy.speed > GameConfig.ENEMY_MAX_SPEED) {
      enemy.speed = GameConfig.ENEMY_MAX_SPEED;
    }
  });

  // 地面も敵と同じ速度で更新
  const currentGround = grounds[currentGroundIndex];
  currentGround.acceleration = score / GameConfig.ENEMY_ACCEL_FACTOR;
  currentGround.speed = currentGround.speed + currentGround.acceleration;
  // 地面も速度上限を適用
  if (currentGround.speed > GameConfig.ENEMY_MAX_SPEED) {
    currentGround.speed = GameConfig.ENEMY_MAX_SPEED;
  }
}


function frameCounter() {
  // フレームカウンタ
  frameCnt++;
  if (frameCnt > GameConfig.FRAME_COUNTER_RESET) {
    // 10fでリセット
    frameCnt = 0;
  }
}
