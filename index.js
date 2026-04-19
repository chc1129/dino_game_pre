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

// キャラクター画像を配列に格納
const chrImageArray = {
  chrRun1: "./img/dino01.png",
  chrRun2: "./img/dino02.png",
  chrJump: "./img/dino_jump.png",
  chrgameover: "./img/dino_gameover.png",
};

// 敵キャラクター画像を配列に格納
const enemyImageArray = {
  enemy01: "./img/saboten01.png",
  enemy02: "./img/saboten02.png",
  enemy03: "./img/saboten03.png",
  enemy04: "./img/putera01.png",
  enemy05: "./img/putera02.png",
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
  player.posx = 100; // スタート位置
  player.posy = 400;
  player.r = 16;
  player.speed = 0;
  player.acceleration = 0;

  // 敵設定
  enemy = new Sprite();
  enemy.image = new Image();
  enemy.image.src = enemyImageArray.enemy01;
  enemy.posx = 720; // スタート位置
  enemy.posy = 400;
  enemy.r = 25;     // 敵の当たり判定半径
  enemy.speed = 10; // 敵の初期速度
  enemy.acceleration = 0; // 敵の加速度

  // ゲーム管理データ
  scene = Scenes.GameMain;
  // スコア初期化
  score = 0;
  // フレームカウンタ
  frameCnt = 0;
}

function keydown(e) {
  // Space or "↑" or Enter 押下時（キーリピート防止）
  if (!jumpPressed && (e.key === " " || e.key === "ArrowUp" || e.key === "Enter")) {
    jumpPressed = true;
    player.speed = -23;
    player.acceleration = 1.5;
  }
}

function keyup(e) {
  // Space or "↑" or Enter 離上時
  if (e.key === " " || e.key === "ArrowUp" || e.key === "Enter") {
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
  } else if ( scene == Scenes.GameOver) {
    // ゲームオーバー
    player.image.src = chrImageArray.chrgameover;
  }
}

function draw() {
  // 背景描画
  g.fillStyle = "rgb(200,200,200)";
  g.fillRect(0, 0, 720, 480);

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
    g.fillText(gameOverLabel, 250, 250);
  }
}

function playGame() {
  // ゲーム実行中
  player.speed = player.speed + player.acceleration;
  player.posy = player.posy + player.speed;
  if (player.posy > 400) {
    player.posy = 400;
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
        enemy.posy = 400;
    } else if (rand === 2) {
      // サボテン02
      enemy.image.src = enemyImageArray.enemy02;
      enemy.posy = 400;
    } else if (rand === 3) {
      // サボテン03
      enemy.image.src = enemyImageArray.enemy03;
      enemy.posy = 410;
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

    enemy.posx = 720;
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
  if (player.posy < 400) {
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
  if (frameCnt <= 5) {
    if (rand === 4) {
      enemy.image.src = enemyImageArray.enemy04;
    }
  } else {
    if (rand === 4) {
      enemy.image.src = enemyImageArray.enemy05;
    }
  }
}

function scoreCount() {
  score++;
  // スコアが上がる毎に敵の速度を上げる
  enemy.acceleration = score / 100000;
  enemy.speed = enemy.speed + enemy.acceleration;
}


function frameCounter() {
  // フレームカウンタ
  frameCnt++;
  if (frameCnt > 10) {
    // 10fでリセット
    frameCnt = 0;
  }
}
