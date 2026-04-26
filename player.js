// ============================================================
// player.js
// プレイヤーの初期化・更新・アニメーション処理
// ============================================================
/*
// プレイヤーの初期化
// @param {Sprite} player - プレイヤーのSpriteオブジェクト
function initPlayer(player) {
    player.image = new Image();

    player.image.src    = CharacterImages.chrRun1;
    player.posx         = GameConfig.PLAYER_START_X;
    player.posy         = GameConfig.PLAYER_START_Y;
    player.r            = GameConfig.PLAYER_RADIUS;
    player.speed        = GameConfig.PLAYER_INITIAL_SPEED;
    player.acceleration = GameConfig.PLAYER_INITIAL_ACCEL;

    return player;
}
*/

// プレイヤーの移動・着地処理
// @param {Sprite} player - プレイヤーのSpriteオブジェクト
// @returns {boolean} 着地したかどうか
function updatePlayer(player) {
    // 速度に加速度を加算（重力による落下）
    player.speed += player.acceleration;
    player.posy  += player.speed;

    // GROUND_LEVELを超えたら着地処理
    if (player.posy > GameConfig.GROUND_LEVEL) {
        player.posy = GameConfig.GROUND_LEVEL;
        player.speed = 0;
        player.acceleration = 0;
        //jumpPressed = false;
        return true; // 着地した
    }
    return false; // 空中にいる
}

// プレイヤーのアニメーション更新(dinoトコトコ)
// ジャンプ中・走り中でそれぞれ画像を切り替える
// @param {Sprite} player  - プレイヤーのSpriteオブジェクト
// @param {number} frameCnt - フレームカウンタ
function updatePlayerAnimation(player, frameCnt) {
    if (player.posy < GameConfig.GROUND_LEVEL) {
        // 空中（ジャンプ中）はジャンプ画像を表示
        player.image.src = CharacterImages.chrJump;
    } else {
        // 地面では走りアニメーションを交互に切り替え
        if (frameCnt <= GameConfig.FRAME_ANIMATION_THRESHOLD) {
            player.image.src = CharacterImages.chrRun1;
        } else {
            player.image.src = CharacterImages.chrRun2;
        }
    }
}


// プレイヤーのSpriteインスタンス生成と初期化を一本化
// @returns {Sprite} 初期化済みのプレイヤーSpriteオブジェクト
function createPlayer() {
    // Spriteインスタンスの生成もplayer.js内で完結させる
    const player = new Sprite();

    player.image = new Image();

    // srcのセット前にonloadを定義
    player.image.onload = () => {
        player.imageLoaded = true;
    };

    player.image.src    = CharacterImages.chrRun1;
    player.posx         = GameConfig.PLAYER_START_X;
    player.posy         = GameConfig.PLAYER_START_Y;
    player.r            = GameConfig.PLAYER_RADIUS;
    player.speed        = GameConfig.PLAYER_INITIAL_SPEED;
    player.acceleration = GameConfig.PLAYER_INITIAL_ACCEL;
    player.imageLoaded  = false; // 画像ロード完了フラグ

    return player; // 生成したインスタンスを返す
}
