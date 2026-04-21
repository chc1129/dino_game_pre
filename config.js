const GameConfig = {
  CANVAS_WIDTH: 720,
  CANVAS_HEIGHT: 480,
  GROUND_LEVEL: 400,
  PLAYER_START_X: 100,
  PLAYER_START_Y: 400,
  PLAYER_RADIUS: 16,
  PLAYER_INITIAL_SPEED: 0,
  PLAYER_INITIAL_ACCEL: 0,
  PLAYER_JUMP_SPEED: -23,
  PLAYER_JUMP_ACCEL: 1.5,
  ENEMY_START_X: 720,
  ENEMY_RADIUS: 25,
  ENEMY_INITIAL_SPEED: 10,
  ENEMY_ACCELERATION: 0,
  ENEMY_ACCEL_FACTOR: 100000,
  FRAME_COUNTER_RESET:10,
  FRAME_ANIMATION_THRESHOLD:5,
  GAME_OVER_POS:250,
};

// Enemy types
const EnemyTypes = {
  cactus1: {
    name: 'サボテン1',
    imageKey: 'enemy01',
    posY:400,
    isAnimated: false,
  },
  cactus2: {
    name: 'サボテン2',
    imageKey: 'enemy02',
    posY:400,
    isAnimated: false,
  },
  cactus3: {
    name: 'サボテン3',
    imageKey: 'enemy03',
    posY:410,
    isAnimated: false,
  },
  putera: {
    name: 'プテラノドン',
    imageKey: 'enemy04',
    animImageKeys: 'enemy05',
    posYList: [300, 350, 400],
    isAnimated: true,
  }
};

// 敵スポーン確率テーブル（0-4の5段階、cactus1が2段階）
const ENEMY_SPAWN_TABLE = [
  'cactus1', 'cactus1',  // rand=0,1: サボテン1（確率40%）
  'cactus2',             // rand=2: サボテン2（確率20%）
  'cactus3',             // rand=3: サボテン3（確率20%）
  'pteranodon'           // rand=4: プテラ（確率20%）
];

// キャラクター画像を配列に格納
const CharacterImages = {
  chrRun1: "./img/dino01.png",
  chrRun2: "./img/dino02.png",
  chrJump: "./img/dino_jump.png",
  chrgameover: "./img/dino_gameover.png",
};

// 敵キャラクター画像を配列に格納
const EnemyImages = {
  enemy01: "./img/saboten01.png",
  enemy02: "./img/saboten02.png",
  enemy03: "./img/saboten03.png",
  enemy04: "./img/putera01.png",
  enemy05: "./img/putera02.png",
};

const JUMP_KEYS = [" ", "ArrowUp", "Enter"];
