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

const EnemyTypes = {
  cactus1: { imageKey: 'enemy01', posY: 400 },
  cactus2: { imageKey: 'enemy02', posY: 400 },
  cactus3: { imageKey: 'enemy03', posY: 410 },
  pteranodon: { imageKey: 'enemy04', posY: [300, 350, 400] },
};

const JUMP_KEYS = [" ", "ArrowUp", "Enter"];
