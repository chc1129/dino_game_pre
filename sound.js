// ============================================================
// sound.js
// サウンド再生処理
// 新しいサウンドを追加する場合は playXxx 関数を追加し
// playSound() を呼び出すだけで対応できる
// ============================================================

// サウンド再生の共通処理
// @param {string} soundSrc - 再生するサウンドファイルのパス
function playSound(soundSrc) {
    const audio = new Audio(soundSrc);
    // ブラウザのAutoPlay制限で再生できない場合はコンソールに出力
    audio.play().catch(e => console.error("サウンド再生エラー:", e));
}

// スコアアップ時のサウンド再生
function playScoreUp() {
    playSound(SoundFiles.scoreUp);
}
