// ============================================================
// enemy.js
// 敵の初期化・更新・当たり判定処理
// ============================================================

// 敵の初期化
// @param {number} startX - 敵の初期X座標
// @returns {Sprite} 初期化済みの敵Spriteオブジェクト
function createEnemy(startX) {
    const enemy = new Sprite();
    enemy.image = new Image();
    enemy.image.onload = () => {};

    enemy.image.src    = EnemyImages.enemy01;
    enemy.posx         = startX;
    enemy.posy         = GameConfig.GROUND_LEVEL;
    enemy.r            = GameConfig.ENEMY_RADIUS;
    enemy.speed        = GameConfig.ENEMY_INITIAL_SPEED;
    enemy.acceleration = GameConfig.ENEMY_ACCELERATION;
    enemy.type         = 'cactus1';
    enemy.isAnimated   = false;
    enemy.interval     = 400;

    return enemy;
}



// 画面外に出た敵を再配置する
// 敵種類・出現位置・アニメーションフラグをランダムに再設定する
// @param {Sprite} enemy    - 再配置する敵
// @param {Sprite[]} enemies - 全敵の配列（最右端座標の取得に使用）
function respawnEnemy(enemy, enemies) {
    // 出現間隔をランダムに選択
    const intervals = [300, 400, 600];
    enemy.interval = intervals[Math.floor(Math.random() * intervals.length)];

    // 敵スポーン確率テーブルからランダムに敵種類を選択
    const enemyTypeKey = ENEMY_SPAWN_TABLE[Math.floor(Math.random() * ENEMY_SPAWN_TABLE.length)];
    const enemyType = EnemyTypes[enemyTypeKey];

    enemy.type = enemyTypeKey;
    enemy.image.onload = () => {};
    enemy.image.src = EnemyImages[enemyType.imageKey];
    enemy.posy = enemyType.posY;
    enemy.isAnimated = enemyType.isAnimated;

    // アニメーションありの敵(プテラ)はposYリストからランダムに高さを選択
    if (enemyType.isAnimated === true) {
        enemy.posy = enemyType.posYList[Math.floor(Math.random() * enemyType.posYList.length)];
    }
    
    // 画面右端から出現（他の敵が画面外にいる場合はその位置からinterval分後）
    const otherEnemy = enemies.find(e => e !== enemy);
    if (otherEnemy && otherEnemy.posx > GameConfig.CANVAS_WIDTH) {
        enemy.posx = otherEnemy.posx + enemy.interval;
    } else {
        enemy.posx = GameConfig.CANVAS_WIDTH;
    }
}


// 敵のアニメーション更新（プテラのパタパタ）
// @param {Sprite[]} enemies - 全敵の配列
// @param {number} frameCnt  - フレームカウンタ
function updateEnemyAnimation(enemies, frameCnt) {
    enemies.forEach(enemy => {
        // アニメーションフラグがtrueかつプテラの場合
        if (enemy.isAnimated && enemy.type === 'pteranodon') {
            enemy.image = new Image();
            enemy.image.onload = () => {};

            // フレームカウンタで画像を交互に切り替え
            if (frameCnt <= GameConfig.FRAME_ANIMATION_THRESHOLD) {
                enemy.image.src = EnemyImages.enemy04;
            } else {
                enemy.image.src = EnemyImages.enemy05;
            }
        }
    });
}


// 敵の移動・再配置・当たり判定をまとめて更新
// @param {Sprite[]} enemies - 全敵の配列
// @param {Sprite}   player  - プレイヤーのSpriteオブジェクト
// @returns {boolean} プレイヤーと敵が衝突したかどうか
function updateEnemies(enemies, player) {
    let isHit = false;

    enemies.forEach((enemy) => {
        // 敵の位置更新
        enemy.posx = enemy.posx - (enemy.speed + enemy.acceleration);

        // 画面左端を超えたら再配置
        if (enemy.posx < 0) {
            respawnEnemy(enemy, enemies);
            return;
        }

        // 当たり判定処理
        // 円形で当たり判定（2点間距離が半径の合計より小さければ衝突）
        const dx = player.posx - enemy.posx;
        const dy = player.posy - enemy.posy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < player.r + enemy.r) {
            // Hit!!!!
            isHit = true;
        }
    });

    return isHit;
}


// スコアに応じて敵の速度を更新する
// @param {Sprite[]} enemies - 全敵の配列
// @param {number}   score   - 現在のスコア
function updateEnemySpeed(enemies, score) {
    enemies.forEach(enemy => {
        // スコアに比例して加速度を増加
        enemy.acceleration = score / GameConfig.ENEMY_ACCEL_FACTOR;
        // accelerationをspeedに加算して実際の速度を更新
        enemy.speed += enemy.acceleration;

        // 最大速度を超えないように制限
        if (enemy.speed > GameConfig.ENEMY_MAX_SPEED) {
            enemy.speed = GameConfig.ENEMY_MAX_SPEED;
            enemy.acceleration = 0; // 最大速度到達時はaccelも0にリセット
        }
    });
}


