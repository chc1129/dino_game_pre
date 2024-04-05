var canvas, g;
var player;
var enemy;
var enemyPosX, enemyPosY, enemyImage, enemySpeed, enemyR, enemyAccel, enemyAccelCnt, rand;
var speed, acceleration;
var frameCnt, score;
var scene;



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
    g.drawImage (
      this.image,
      this.posx - this.image.width /2,
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
  player = new Sprite();
  player.image = new Image();
  player.image.src = chrImageArray.chrRun1;
  player.posx = 100; // スタート位置
  player.posy = 400;
  player.r = 16;
  player.speed = 0;
  player.acceleration = 0;

  // 敵設定
  enemyPosX = 720;
  enemyPosY = 400;
  enemyR = 25;
  enemyImage = new Image();
  enemyImage.src = enemyImageArray.enemy01;
  enemySpeed = 10;
  enemyAccel = enemyAccelCnt = 0;

  enemy = new Sprite();
  enemy.image = new Image();
  enemy.image.src = enemyImageArray.enemy01;
  enemy.posx = 720;
  enemy.posy = 480;
  enemy.r = 25;
  enemy.speed = 10;
  enemy.acceleration = 0;

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
    player.speed = -23;
    player.acceleration = 1.5;
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
    player.image.src = chrImageArray.chrgameover;
  }
}

function draw() {
  // 背景描画
  g.fillStyle = "rgb(200,200,200)";
  g.fillRect(0, 0, 720, 480);

  // キャラクタ描画
  g.drawImage(
    player.image,
    player.posx - player.image.width / 2,
    player.posy - player.image.height / 2
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
  player.speed = player.speed + player.acceleration;
  player.posy = player.posy + player.speed;
  if (player.posy > 400) {
    player.posy = 400;
    player.speed = 0;
    player.acceleration = 0;
  }

  // 敵表示
  enemyPosX = enemyPosX - (enemySpeed + enemyAccel);
  //enemy.posx = enemy.posx - (enemy.speed + enemy.acceleration);

  // 敵が画面左端に行ったら画面右端に戻る
  if (enemyPosX < 0) {
    // ランダムでサボテンかトリ（プテラ）を表示
    rand = Math.floor(Math.random() * 5)
    if (rand == 1) {
      // サボテン01
      enemyImage.src = enemyImageArray.enemy01;
      enemyPosY = 400;
    } else if (rand == 2) {
      // サボテン02
      enemyImage.src = enemyImageArray.enemy02;
      enemyPosY = 400;
    } else if (rand == 3) {
      // サボテン03
      enemyImage.src = enemyImageArray.enemy03;
      enemyPosY = 410;
    } else if (rand == 4) {
      // トリ（プテラ）
      var eAddPosY, eRand;
      eRand = Math.floor(Math.random() * 3)
      // トリ高さ設定
      switch (eRand) {
        case 1:
          eAddPosY = 0; break;
        case 2:
          eAddPosY = 50; break;
        default: 
          eAddPosY = 100; break;
      }
      enemyImage.src = enemyImageArray.enemy04;
      enemyPosY = 300 + eAddPosY;
    }

    enemyPosX = 720;
  }

  /*
  if (enemy.posx < 0) {
    // ランダムでサボテンかトリ（プテラ）を表示
    rand = Math.floor(Math.random() * 5)
    switch (rand) {
      case "1":
        // サボテン01
        enemy.image.src = enemyImageArray.enemy01;
        enemy.posy = 400;
        break;
      case "2":
        // サボテン02
        enemy.image.src = enemyImageArray.enemy02;
        enemy.posy = 400;
        break;
      case "3":
        // サボテン03
        enemy.image.src = enemyImageArray.enemy03;
        enemy.posy = 410;
        break;
      case "4":
        // トリ（プテラ）
        var eAddPosY, eRand;
        eRand = Math.floor(Math.random() * 3)
        // トリの高さ設定
        switch (eRand) {
          case 1:
            eAddPosY = 0;
            break;
          case 2:
            eAddPosY = 50;
            break;
          default:
            eAddPosY = 100;
            break;
        }
        break;
      default:
        enemy.image.src = enemyImageArray.enemy01;
        enemy.posy = 400;
        break;
    }
  }
  */

  // 当たり判定
  var dx = player.posx - enemyPosX;
  var dy = player.posy - enemyPosY;
  var dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < player.r + enemyR) {
    // Hit!!!
    scene = Scenes.GameOver;
    enemySpeed = 0;
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
    if (rand == 4) {
      enemyImage.src = enemyImageArray.enemy04;
    }
  } else {
    if (rand == 4) {
      enemyImage.src = enemyImageArray.enemy05;
    }
  }
}

function scoreCount() {
  // スコアカウンタ
  score++;
  // スコアが上がる毎に敵の速度を上げる
  enemyAccelCnt++;
  if (enemyAccelCnt > 200) {
    enemyAccelCnt = 0;
    enemyAccel++;
  }

  /*
  enemyAccelCnt++;
  if (enemyAccelCnt > 200) {
    enemyAccelCnt = 0;
    enemy.acceleration++;
  }
  */
}

function frameCounter() {
  // フレームカウンタ
  frameCnt++;
  if (frameCnt > 10) {
    // 10fでリセット
    frameCnt = 0;
  }
}
