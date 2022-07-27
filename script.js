//全体をロードするイベントリスナー
window.addEventListener('load', function(){
    // canvas1の設定
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    // cssで固定画面サイズに対応させている
    canvas.width = 500;
    canvas.height = 500;

    // キーボード操作入力
    class InputHandler {

    }

    // レーザー攻撃:発射物
    class Projectile {

    }

    // 粒子
    class Particle {

    }

    // プレイヤー
    class Player {
        constructor(game){
            this.game = game;
            // プレイヤーの大きさ
            this.width = 120;
            this.height = 190;
            // プレイヤー位置
            this.x = 20;
            this.y = 100;
            // プレイヤー垂直速度初期値
            this.speedY = -1;
        }
        // プレイヤーの垂直方向のY速度
        update(){
            this.y += this.speedY;
        }
        // context引数を外からもってくるやりかた＝ctx同じ
        draw(context){
            context.fillRect(this.x, this.y, this.width, this.height);
        }

    }

    // 敵キャラクター
    class Enemy {

    }

    // 視差レイヤー
    class Layer {

    }

    // 全体をアニメーション化
    class Background {

    }

    // タイマーや点数表示
    class UI {

    }

    // すべてのクラスが呼び出される場所
    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.Player = new Player(this);
        }
        update(){
            this.Player.update();
        }
        draw(context){
            this.Player.draw(context);
        }
    }
    // すべてのクラスが実行されるmainになる
    const game = new Game(canvas.width, canvas.height);

    // アニメーションループ
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update();
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate();

});