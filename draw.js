// ============================================================
// draw.js
// 各シーンの描画処理
// ============================================================

// タイトル画面の描画
function drawTitle(g) {
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


// ゲームプレイ中の描画
// 背景→雲→地面→キャラ・敵→スコアの順に描画する（手前のものを後に描く）
function drawGame(g, player, enemies, score) {
    // 背景クリア
    g.fillStyle = "rgb(200,200,200)";
    g.fillRect(0, 0, GameConfig.CANVAS_WIDTH, GameConfig.CANVAS_HEIGHT);

    // 雲（最背面）
    drawClouds(g);
    // 地面
    drawGround(g);

    // キャラクタ描画
    player.draw(g);

    // 敵描画
    // enemiesがnull・undefinedの場合に備えてガード処理を追加
    if (enemies && enemies.length > 0) {
        enemies.forEach(enemy => enemy.draw(g));
    }

    // スコア（最前面）
    g.fillStyle = "rgb(255,255,255)";
    g.font = "16pt Arial Black";
    const scoreLabel      = "SCORE: " + score;

    const scoreLabelWidth = g.measureText(scoreLabel).width;
    g.fillText(scoreLabel, GameConfig.CANVAS_WIDTH - scoreLabelWidth - 20, 40);

}


function drawGameOver(g, player, gameOverImg) {
    // ゲームオーバー画面描画
    g.fillStyle = "rgb(255,255,255)";
    g.font = "24pt Arial Black";

    let gameOverLabel = "GAME OVER!!!";
    let gameOverLabelwidth = g.measureText(gameOverLabel).width;

    g.fillText(gameOverLabel,
        (GameConfig.CANVAS_WIDTH - gameOverLabelwidth) / 2,
        GameConfig.CANVAS_HEIGHT / 2);

    // ゲームオーバー用のキャラクタ画像を描画
    if (gameOverImg && gameOverImg.complete) {
        g.drawImage(
            gameOverImg,
            player.posx - gameOverImg.width  / 2, // playerの座標に合わせて描画
            player.posy - gameOverImg.height / 2
        );
    }
}


