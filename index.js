let canvas, g;
let player;
let enemy;
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
  player.image.src = chrImageArray.chrRun1;
  player.posx = GameConfig.PLAYER_START_X; // スタート位置
  player.posy = GameConfig.PLAYER_START_Y;
  player.r = GameConfig.PLAYER_RADIUS;
  player.speed = GameConfig.PLAYER_INITIAL_SPEED;
  player.acceleration = GameConfig.PLAYER_INITIAL_ACCEL;

  // 敵設定
  enemy = new Sprite();
  enemy.image = new Image();
  enemy.image.src = enemyImageArray.enemy01;
  enemy.posx = GameConfig.ENEMY_START_X; // スタート位置
  enemy.posy = GameConfig.GROUND_LEVEL;
  enemy.r = GameConfig.ENEMY_RADIUS;     // 敵の当たり判定半径
  enemy.speed = GameConfig.ENEMY_INITIAL_SPEED; // 敵の初期速度
  enemy.acceleration = GameConfig.ENEMY_ACCELERATION; // 敵の加速度

  // ゲーム管理データ
  scene = Scenes.GameMain;
  // スコア初期化
  score = 0;
  // フレームカウンタ
  frameCnt = 0;
}

function keydown(e) {
  // Space or "↑" or Enter 押下時（キーリピート防止）
  if (!jumpPressed && JUMP_KEYS.includes(e.key)) {
    jumpPressed = true;
    player.speed = GameConfig.PLAYER_JUMP_SPEED;
    player.acceleration = GameConfig.PLAYER_JUMP_ACCEL;
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
  if (scene === Scenes.GameMain) {
    // ゲーム実行中
    playGame();
  } else if ( scene === Scenes.GameOver) {
    // ゲームオーバー
    player.image.src = chrImageArray.chrgameover;
  }
}

function draw() {
  // 背景描画
  g.fillStyle = "rgb(200,200,200)";
  g.fillRect(0, 0, GameConfig.CANVAS_WIDTH, GameConfig.CANVAS_HEIGHT);

  // キャラクタ描画
  player.draw(g);
  // 敵描画
  enemy.draw(g);

  // スコア描画
  g.fillStyle = "rgb(255,255,255)";
  g.font = "16pt Arial Black";
  let scoreLabel = "SCORE: " + score;
  let scoreLabelWidth = g.measureText(scoreLabel).width;
  g.fillText(scoreLabel, 700 - scoreLabelWidth, 40); // 表示文言,位置指定(x,y)

  /*
  // DEBUG: フレームカウンタ表示
  let frameCntLabel = "Frame: " + frameCnt;
  let frameCntLabelWidth = g.measureText(frameCntLabel).width;
  g.fillText(frameCntLabel, 700 - frameCntLabelWidth, 60); // 表示文言,位置指定(x,y)
  */

  if (scene === Scenes.GameOver) {
    // ゲームオーバー
    g.fillStyle = "rgb(255,255,255)";
    g.font = "24pt Arial Black";
    let gameOverLabel = "GAME OVER!!!";
    g.fillText(gameOverLabel, GameConfig.GAME_OVER_POS, GameConfig.GAME_OVER_POS);
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

  // 敵表示
  enemy.posx = enemy.posx - (enemy.speed + enemy.acceleration); // 敵の位置更新

  // 敵が画面左端に行ったら画面右端に戻る
  if (enemy.posx < 0) {
    // ランダムでサボテンかトリ（プテラ）を表示
    rand = Math.floor(Math.random() * 5)
    if (rand <= 1) {
        enemy.image.src = enemyImageArray.enemy01;
        enemy.posy = GameConfig.GROUND_LEVEL;
    } else if (rand === 2) {
      // サボテン02
      enemy.image.src = enemyImageArray.enemy02;
      enemy.posy = GameConfig.GROUND_LEVEL;
    } else if (rand === 3) {
      // サボテン03
      enemy.image.src = enemyImageArray.enemy03;
      enemy.posy = GameConfig.GROUND_LEVEL + 10;
    } else if (rand === 4) {
      // トリ（プテラ）
      let eAddPosY, eRand;
      eRand = Math.floor(Math.random() * 3)
      // トリ高さ設定
      switch (eRand) {
        case 1: eAddPosY = 0; break;
        case 2: eAddPosY = 50; break;
        default: eAddPosY = 100; break;
      }
      enemy.image.src = enemyImageArray.enemy04;
      enemy.posy = 300 + eAddPosY;
    }

    enemy.posx = GameConfig.CANVAS_WIDTH;
  }


  // 当たり判定
  let dx = player.posx - enemy.posx;
  let dy = player.posy - enemy.posy;
  let dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < player.r + enemy.r) {
    // Hit!!!
    scene = Scenes.GameOver;
    enemy.speed = 0;
  }

  // スコアカウンタ
  scoreCount();
  // フレームカウンタ
  frameCounter();

  // dinoトコトコ
  if (player.posy < GameConfig.GROUND_LEVEL) {
    // jump
    player.image.src = chrImageArray.chrJump;
  } else {
    if (frameCnt <= 5) {
      player.image.src = chrImageArray.chrRun1;
    } else {
      player.image.src = chrImageArray.chrRun2;
    }
  }

  // トリ（プテラ）パタパタ
  if (enemy.isAnimated && enemy.type === 'pteranodon') { 
    if (frameCnt <= GameConfig.FRAME_ANIMATION_THRESHOLD) {
        enemy.image.src = EnemyImages['enemy04'];
    } else {
        enemy.image.src = EnemyImages['enemy05'];
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
