// ============================================================
// sprite.js
// ゲームオブジェクトの基底クラス
// プレイヤー・敵など全キャラクターの共通プロパティと描画処理を定義
// ============================================================

class Sprite {
    image        = null;  // 表示画像
    posx         = 0;     // X座標
    posy         = 0;     // Y座標
    r            = 0;     // 当たり判定の半径
    speed        = 0;     // 速度
    acceleration = 0;     // 加速度
    imageLoaded  = false; // 画像ロード完了フラグ

    // キャラクターの描画処理
    // 画像の中心座標が posx, posy になるように描画する
    // @param {CanvasRenderingContext2D} g - 描画コンテキスト
    draw(g) {
        // 画像ロード未完了の場合は描画をスキップしてエラーを防ぐ
        if (!this.image || !this.image.complete) return;

        g.drawImage(
        this.image,
        this.posx - this.image.width  / 2, // 中心X座標に補正
        this.posy - this.image.height / 2  // 中心Y座標に補正
        );
    }
}