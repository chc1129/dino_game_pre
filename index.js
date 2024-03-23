var canvas, g;
var characterPosX, characterPosY, characterImage, charcterR;
var enemyPosX, enemyPosY, enemyImage, enemySpeed, enemyR, enemyAccel, enemyAccelCnt;
var speed, acceleration;
var frameCnt;
var score;
var scene;

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

onload = function () {
  // 描画コンテキストの取得
  canvas = document.getElementById("gamecanvas");
  g = canvas.getContext("2d");
  // 初期化
  init();
  // 入力処理の指定
  document.onkeydown = keydown;
  // ゲームループの設定 60FPS(16ms)
  setInterval("mainloop()", 16);
};

function init() {
  // 自キャラ設定
  characterPosX = 100; // スタート位置
  characterPosY = 400;
  charcterR = 16;
  characterImage = new Image();
  characterImage.src = chrImageArray.chrRun1;
  speed = 0;
  acceleration = 0;

  // 敵設定
  enemyPosX = 720;
  enemyPosY = 400;
  enemyR = 25;
  enemyImage = new Image();
  enemyImage.src = enemyImageArray.enemy01;
  enemySpeed = 10;
  enemyAccel = enemyAccelCnt = 0;

  // ゲーム管理データ
  scene = Scenes.GameMain;
  // スコア初期化
  score = 0;
  // フレームカウンタ
  frameCnt = 0;
}

function keydown(e) {
  // Space or "↓" or Enter 押下時
  if ((e.keyCode == 32) || (e.keyCode == 38) || (e.keyCode == 13)) {
    speed = -23; // Y軸の移動速度
    acceleration = 1.5; // 重力加速度  
  }
}

function mainloop() {
  update(); // キャラ移動
  draw(); // キャラ描画
}

function update() {
  if (scene == Scenes.GameMain) {
    // ゲーム実行中
    playGame();
  } else if ( scene == Scenes.GameOver) {
    // ゲームオーバー
    characterImage.src = chrImageArray.chrgameover;
  }
}

function draw() {
  // 背景描画
  g.fillStyle = "rgb(200,200,200)";
  g.fillRect(0, 0, 720, 480);

  // キャラクタ描画
  g.drawImage(
    characterImage,
    characterPosX - characterImage.width / 2,
    characterPosY - characterImage.height / 2
  );

  // 敵描画
  g.drawImage(
    enemyImage,
    enemyPosX - enemyImage.width / 2,
    enemyPosY - enemyImage.height / 2
  );

  // スコア描画
  g.fillStyle = "rgb(255,255,255)";
  g.font = "16pt Arial Black";
  var scoreLabel = "SCORE: " + score;
	var scoreLabelWidth = g.measureText(scoreLabel).width;
	g.fillText(scoreLabel, 700 - scoreLabelWidth, 40); // 表示文言,位置指定(x,y)

  if (scene == Scenes.GameOver) {
    // ゲームオーバー
    g.fillStyle = "rgb(255,255,255)";
    g.font = "24pt Arial Black";
    var gameOverLabel = "GAME OVER!!!";
    g.fillText(gameOverLabel, 250, 250);
  }
}

function playGame() {
  // ゲーム実行中
  speed = speed + acceleration;
  characterPosY = characterPosY + speed;
  if (characterPosY > 400) {
    characterPosY = 400;
    speed = 0;
    acceleration = 0;
  }

  // 敵表示
  enemyPosX = enemyPosX - (enemySpeed + enemyAccel);

  // 敵が画面左端に行ったら画面右端に戻る
  if (enemyPosX < 0) {
    // ランダムでサボテンかトリ（プテラ）を表示
    var rand = Math.floor(Math.random() * 5)
    if (rand == 1) {
      enemyImage.src = enemyImageArray.enemy01;
    } else if (rand == 2) {
      enemyImage.src = enemyImageArray.enemy02;
    } else if (rand == 3) {
      enemyImage.src = enemyImageArray.enemy03;
    } else if (rand == 4) {
      enemyImage.src = enemyImageArray.enemy04;
    }

    enemyPosX = 720;
  }

  // 当たり判定
  var dx = characterPosX - enemyPosX;
  var dy = characterPosY - enemyPosY;
  var dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < charcterR + enemyR) {
    // Hit!!!
    scene = Scenes.GameOver;
    enemySpeed = 0;
  }

  // フレームカウンタ
  frameCnt++;
  if (frameCnt > 10) {
    frameCnt = 0;
  }

  // スコアカウンタ
  score++;

  // スコアが上がる毎に敵の速度を上げる
  enemyAccelCnt++;
  if (enemyAccelCnt > 200) {
    enemyAccelCnt = 0;
    enemyAccel++;
  }

  if (frameCnt <= 5) {
    if (characterPosY >= 400) {
      characterImage.src = chrImageArray.chrRun1;
    } else {
      // jump中
      characterImage.src = chrImageArray.chrJump;
    }

    if (enemyImage.src == enemyImageArray.enemy05) {
      enemyImage.src = enemyImageArray.enemy04;
    }

  } else if (frameCnt <= 10) {
    if (characterPosY >= 400) {
      characterImage.src = chrImageArray.chrRun2;
    } else {
    // jump中
    characterImage.src = chrImageArray.chrJump;
    }

    if (enemyImage.src == enemyImageArray.enemy04) {
      enemyImage.src = enemyImageArray.enemy05;
    }

  }
}
