// ============================================================
// cloud.js
// 雲の初期化・更新・描画処理
// ============================================================

// 雲の初期化
// 1つ目の雲はランダムなX座標に配置し、
// 2つ目以降は前の雲からinterval分ずらして配置する
function initClouds() {
    clouds = [];

    // 雲画像を事前ロード（全雲で共有）
    const cloudImg = new Image();
    cloudImg.onload = () => {};
    cloudImg.src = CloudImages.cloud1;

    // 1つ目の起点X座標をランダムに設定
    let currentPosX = Math.random() * GameConfig.CANVAS_WIDTH;

    // MAX_CLOUDS数の雲をランダムな位置に配置
    for (let i = 0; i < CloudConfig.MAX_CLOUDS; i++) {
        const interval = CloudConfig.MIN_INTERVAL +
            Math.random() * (CloudConfig.MAX_INTERVAL - CloudConfig.MIN_INTERVAL);

        // 出現y座標をランダムに設定
        const posy = CloudConfig.MIN_Y +
            Math.random() * (CloudConfig.MAX_Y - CloudConfig.MIN_Y);

        clouds.push({
        image:    cloudImg,
        posx:     currentPosX,
        posy:     posy,
        interval: interval,
        });

        // 次の雲は現在のX座標からinterval分右にずらす（重なり防止）
        currentPosX += interval;
    }
}


// 雲のスクロール更新
// 固定速度でスクロールし、画面外に出た雲を画面右端から再出現させる
function updateClouds() {
    clouds.forEach(cloud => {
        // 敵とは独立した固定速度でスクロール（視差効果）
        cloud.posx -= CloudConfig.SPEED;

        // 画像ロード完了済みの場合はwidthを使用、未ロード時は0として扱う
        const imageWidth = cloud.image.complete ? cloud.image.width : 0;

        // 雲が画面左端から完全に出たら、右端に新しい雲を追加
        if (cloud.posx + imageWidth < 0) {

        // 現在の雲の中で最も右にある雲を見つける
        const maxPosX = Math.max(...clouds.map(c => c.posx));

        // 出現間隔をランダムに再設定
        const interval = CloudConfig.MIN_INTERVAL +
            Math.random() * (CloudConfig.MAX_INTERVAL - CloudConfig.MIN_INTERVAL);

        // 再出現位置は画面右端から固定で出現
        cloud.posx = Math.max(maxPosX, GameConfig.CANVAS_WIDTH) + interval;

        // 出現y座標をランダムに設定
        cloud.posy = CloudConfig.MIN_Y +
            Math.random() * (CloudConfig.MAX_Y - CloudConfig.MIN_Y);

        // 次回の出現間隔を保持
        cloud.interval = interval;
        }
    });
}



// 雲の描画
// 画像ロード完了済みの雲のみ描画する
function drawClouds(g) {
    clouds.forEach(cloud => {
        if (cloud.image.complete) {
        g.drawImage(cloud.image, cloud.posx, cloud.posy);
        }
    });
}

