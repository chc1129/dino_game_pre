let canvas, g;
let player;
let enemies = [];
let gameOverImg;

let frameCnt, score, rand;
let scene;
let jumpPressed = false;

let groundTiles = []; // 1画面分の地面画像配列
let groundTileWidth = 0; // 地面画像の幅

let clouds = []; // 雲の配列


// Spriteクラス
class Sprite {
  image = null;
  posx= 0;
  posy = 0;
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
  document.onkeyup = keyup;
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

  // ゲームオーバー用のキャラクタ画像を事前に読み込み
  gameOverImg = new Image();
  gameOverImg.src = CharacterImages.chrgameover;

  // 雲設定
  initClouds();

  // 地面タイル設定
  initGround();

  // ゲーム管理データ
  scene = Scenes.Title;
  // スコア初期化
  score = 0;
  // フレームカウンタ
  frameCnt = 0;
}


function initGround() {
  // ground初期化処理
  groundTiles = [];
  groundTileWidth = 40;

  // groundのキー一覧を配列化
  const groundKeys = Object.keys(GroundImages);

  // 1画面分(CANVAS_WIDTH)を埋めるタイル数を計算
  // 画面幅をタイル幅で割り、端数を切り上げて必要なタイル数を計算。
  // さらに、最低でも26タイルは必要（CANVAS_WIDTH=1024, groundTileWidth=40の場合）
  const tileCount = Math.max((Math.ceil(GameConfig.CANVAS_WIDTH / groundTileWidth) + 1), 26);  

  for (let i = 0; i < tileCount; i++) {
    const randkey = groundKeys[Math.floor(Math.random() * groundKeys.length)];
    const img = new Image();
    img.src = GroundImages[randkey];
    groundTiles.push({
      image: img,
      posx: i * groundTileWidth,
      posy: GameConfig.GROUND_LEVEL, // 地面の位置に合わせて調整
    });
  }
}


function initClouds() {
  // 雲初期化処理
  clouds = [];

  // 雲画像のロード
  const cloudImg = new Image();
  cloudImg.src = CloudImages.cloud1;

  // 1つ目の雲のx座標をランダムに設定
  let currentPosX = Math.random() * GameConfig.CANVAS_WIDTH;

  // MAX_CLOUDS数の雲をランダムな位置に配置
  for (let i = 0; i < CloudConfig.MAX_CLOUDS; i++) {
    // 出現位置をランダムに設定
    const interval = CloudConfig.MIN_INTERVAL +
      Math.random() * (CloudConfig.MAX_INTERVAL - CloudConfig.MIN_INTERVAL);

    // 初期X座標は画面内にランダム配置
    const posx = Math.random() * GameConfig.CANVAS_WIDTH;

    // 出現y座標をランダムに設定
    const posy = CloudConfig.MIN_Y +
      Math.random() * (CloudConfig.MAX_Y - CloudConfig.MIN_Y);

    clouds.push({
      image: cloudImg,
      posx: currentPosX, // 初期X座標は画面内にランダム配置
      posy: posy,
      interval: interval,
    });
    // 次の雲のX座標は現在のX座標からinterval分ズラす
    currentPosX += interval;
  }
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
    if (!jumpPressed &&
        player.posy >= GameConfig.GROUND_LEVEL &&
        JUMP_KEYS.includes(e.key)) {
      
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
    // 一度ゲーム実行画面を描画してから
    // ゲームオーバー画面を描画し、player画像のズレを防ぐ
    drawGame();
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

  // 雲描画
  drawClouds();
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
  // 地面タイルを描画
  groundTiles.forEach(tile => {
    // 画像が読み込まれているか確認
    if (tile.image.complete) {
      g.drawImage(tile.image, 
        tile.posx, 
        tile.posy
      );
    }
  });
}

function updateGround() {
  // groundのキー一覧を配列化
  const groundKeys = Object.keys(GroundImages);

  groundTiles.forEach(tile => {
    // enemyと同じ速度で地面タイルをスクロール
    const scrollSpeed = enemies[0].speed + enemies[0].acceleration; // 敵の速度を取得
    tile.posx -= scrollSpeed;

    // タイルが画面左端から完全に出たら、右端に新しいタイルを追加
    if (tile.posx + groundTileWidth < 0) {
      // 現在のタイルの中で最も右にあるタイルを見つける
      const maxPosX = Math.max(...groundTiles.map(t => t.posx));
      // 最右端のタイルの右隣りに新しいタイルを配置
      tile.posx = maxPosX + groundTileWidth;
      // 新しいタイルをランダムで選択
      const randkey = groundKeys[Math.floor(Math.random() * groundKeys.length)];
      tile.image = new Image();
      tile.image.src = GroundImages[randkey];
    }
  });
}


function drawClouds() {
  clouds.forEach(cloud => {
    // 画像が読み込まれているか確認
    if (cloud.image.complete) {
      g.drawImage(cloud.image, 
        cloud.posx, 
        cloud.posy
      );
    }
  });
}


function updateClouds() {
  clouds.forEach(cloud => {
    // 雲をスクロール（固定速度）
    cloud.posx -= CloudConfig.SPEED;

    // 画像ロード完了済みの場合はwidthを使用、未ロード時は0として扱う
    const imageWidth = cloud.image.complete ? cloud.image.width : 0;

    // 雲が画面左端から完全に出たら、右端に新しい雲を追加
    if (cloud.posx + cloud.image.width < 0) {

      // 現在の雲の中で最も右にある雲を見つける
      const maxPosX = Math.max(...clouds.map(c => c.posx));

      // 出現間隔をランダムに再設定
      const interval = CloudConfig.MIN_INTERVAL +
        Math.random() * (CloudConfig.MAX_INTERVAL - CloudConfig.MIN_INTERVAL);

      // 再出現位置は画面右端から固定で出現
      cloud.posx = Math.max(maxPosX + interval, GameConfig.CANVAS_WIDTH) + interval;

      // 出現y座標をランダムに設定
      cloud.posy = CloudConfig.MIN_Y +
        Math.random() * (CloudConfig.MAX_Y - CloudConfig.MIN_Y);

      // 次回の出現間隔を保持
      cloud.interval = interval;
    }
  });
}




function playGame() {
  // ゲーム実行中

  // プレイヤーの移動
  player.speed = player.speed + player.acceleration;
  player.posy = player.posy + player.speed;
  if (player.posy > GameConfig.GROUND_LEVEL) {
    player.posy = GameConfig.GROUND_LEVEL;
    player.speed = 0;
    player.acceleration = 0;
    jumpPressed = false;
  }

  // 敵の出現、移動、当たり判定
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

  });

  // dinoトコトコ
  if (player.posy < GameConfig.GROUND_LEVEL) {
    // player is jumping
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
    // enemy.isAnimatedがtrueで、enemy.typeがpteranodonの場合にアニメーションを切り替える
    if (enemy.isAnimated && enemy.type === 'pteranodon') { 
      if (frameCnt <= GameConfig.FRAME_ANIMATION_THRESHOLD) {
          enemy.image.src = EnemyImages.enemy04;
      } else {
          enemy.image.src = EnemyImages.enemy05;
      }
    }
  });

  // 雲の更新
  updateClouds();
  // 地面の更新
  updateGround();


  // スコアカウンタ
  scoreCount();
  // フレームカウンタ
  frameCounter();


}

// サウンド再生の共通処理
function playSound(soundSrc) {
  // Audioオブジェクトを生成し、サウンド再生
  const audio = new Audio(soundSrc);

  // 再生開始
  audio.play().catch(e => {
    // ブラウザのAutoPlay制限などで再生できない場合はコンソールに出力
    console.error("サウンド再生エラー", e);
  });
}

function scoreCount() {
  score++;

  // scoreがSCORE_UP_INTERVALの倍数になったタイミングでサウンドを再生
  if (score % SoundConfig.SCORE_UP_INTERVAL === 0) {
    playScoreUp();
  }

  // スコアが上がる毎に敵の速度を上げる（上限あり）
  enemies.forEach(enemy => {
    enemy.acceleration = score / GameConfig.ENEMY_ACCEL_FACTOR;
    
    // 速度が上限を超えないように制限
    if (enemy.speed > GameConfig.ENEMY_MAX_SPEED) {
      enemy.speed = GameConfig.ENEMY_MAX_SPEED;
    }
  });
}

// スコアアップ時のサウンド再生処理
function playScoreUp() {
  // 共通サウンド再生関数を経由して再生
  playSound(SoundFiles.scoreUp);
}


function frameCounter() {
  // フレームカウンタ
  frameCnt++;
  if (frameCnt > GameConfig.FRAME_COUNTER_RESET) {
    // 10fでリセット
    frameCnt = 0;
  }
}
