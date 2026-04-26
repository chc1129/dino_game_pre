// ============================================================
// ground.js
// 地面タイルの初期化・更新・描画処理
// ============================================================

// 地面タイルの初期化
// CANVAS_WIDTHを埋めるタイル数を計算し、ランダムな地面画像を配置する
function initGround() {
    groundTiles     = [];
    groundTileWidth = 40;

    const groundKeys = Object.keys(GroundImages);

    // 1画面分(CANVAS_WIDTH)を埋めるタイル数を計算
    // 画面幅をタイル幅で割り、端数を切り上げて必要なタイル数を計算。
    // さらに、最低でも26タイルは必要（CANVAS_WIDTH=1024, groundTileWidth=40の場合）
    const tileCount = Math.max(
        (Math.ceil(GameConfig.CANVAS_WIDTH / groundTileWidth) + 1), 26
    ); 

    for (let i = 0; i < tileCount; i++) {
        const randkey = groundKeys[Math.floor(Math.random() * groundKeys.length)];
        const img = new Image();
        img.onload = () => {};
        img.src = GroundImages[randkey];
        groundTiles.push({
            image: img,
            posx: i * groundTileWidth,        // タイルを横に並べる
            posy: GameConfig.GROUND_LEVEL,    // 地面の位置に合わせて調整
        });
    }
}


// 地面タイルのスクロール更新
// 敵と同じ速度でスクロールし、画面外に出たタイルを右端に再配置する
// @param {number} scrollSpeed - 地面のスクロール速度（呼び出し元から渡す）
function updateGround(scrollSpeed) {
    // groundのキー一覧を配列化
    const groundKeys = Object.keys(GroundImages);

    groundTiles.forEach(tile => {
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
        tile.image.onload = () => {};
        tile.image.src = GroundImages[randkey];
        }
    });
}



function drawGround(g) {
    groundTiles.forEach(tile => {
        if (tile.image.complete) {
            g.drawImage(tile.image, tile.posx, tile.posy);
        }
    });
}
