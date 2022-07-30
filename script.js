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
        constructor(game){
            this.game = game;
            window.addEventListener('keydown', e => {
                //if(e.key === 'ArrowUp'){ ['ArrowUp', 'ArrowUp'…上矢印の長押しに対応しない
                if((    (e.key === 'ArrowUp') ||
                        (e.key === 'ArrowDown')
                )&& this.game.keys.indexOf(e.key) === -1){
                    this.game.keys.push(e.key);
                }
                    console.log(this.game.keys);
                });
            //上記で「上矢印」で配列に格納されたArrowUpのみspliceで切り取る
            // ['ArrowUp', 'ArrowUp', 'ArrowUp', 'ArrowUp', …となってしまう]
            window.addEventListener('keyup', e =>{
                if(this.game.keys.indexOf(e.key) > -1){
                   this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }
                console.log(this.game.keys);
            });

        }

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
            this.speedY = 0;
            //フィールドに置いた値をY速度に「this.maxSpeed」持っていくテクニック
            this.maxSpeed = 2;
        }
        // プレイヤーの垂直方向のY速度
        update(){
            if (this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed;
            else if (this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed;
            else this.speedY = 0;
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
            this.input = new InputHandler(this)
            //キーボード操作を配列に格納
            this.keys = [];
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
        //アニメーションがクリアされる
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update();
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate();

});