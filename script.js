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
                // if(e.key === 'ArrowUp'){ ['ArrowUp', 'ArrowUp'…上矢印の長押しに対応しない
                if((    (e.key === 'ArrowUp') ||
                        (e.key === 'ArrowDown')
                ) && this.game.keys.indexOf(e.key) === -1){
                    this.game.keys.push(e.key);
                // 入力操作にスペースを追加して攻撃
                } else if ( e.key === ' '){
                    this.game.player.shootTop();
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

    // レーザー攻撃:発射物の準備
    class Projectile {
        // 3つの引数が必要
        constructor(game, x, y){
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 3;
            this.speed = 3;
            this.markedForDeletion = false;
        }
        update(){
            this.x += this.speed;
            if (this.x > this.game.width * 0.8) this.markedForDeletion = true;
        }
        draw(context){
            context.fillStyle = 'yellow';
            context.fillRect(this.x, this.y, this.width, this.height);
        }
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
            // フィールドに置いた値をY速度に「this.maxSpeed」持っていくテクニック
            this.maxSpeed = 3;
            // 発射物の配列
            this.projectiles = [];
        }
        // プレイヤーの垂直方向のY速度
        update(){
            if (this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed;
            else if (this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed;
            else this.speedY = 0;
            this.y += this.speedY;
            // 発射物の配列を取り出す＞呼び出す
            this.projectiles.forEach(projectile => {
                projectile.update();
            });
            // filter()で通過するすべての要素に新しい配列を提供する
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
        }
        // context引数を外からもってくるやりかた＝ctx同じ
        draw(context){
            context.fillStyle = 'black';//プレイヤーの色
            context.fillRect(this.x, this.y, this.width, this.height);
            // 発射物の配列を取り出す＞呼び出す
            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            });
        }
        // 準備した発射物を攻撃できる
        shootTop(){
            // 弾薬を無制限で打てないようにする
            if (this.game.ammo > 0){
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30 ));
                console.log(this.projectiles);
                this.game.ammo--;
            }
            console.log(this.projectiles);
        }

    }

    // 敵キャラクター(親super)
    class Enemy {
        constructor(game){
            this.game = game;
            this.x = this.game.width;// 敵はX軸方向から来襲
            this.speedX = Math.random() * -1.5 -0.5;
            this.markedForDeletion = false;// レーザに当たるとfalse
        }
        update(){// 敵の水平X軸を調整する
            this.x += this.speedX;
            if(this.x + this.width < 0) this.markedForDeletion = true;
        }
        draw(context){
            context.fillStyle = 'red';
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    // 継承関係の敵キャラクター(子sub)オーバライド
    // 同メソッド再宣言して、継承されている場所を自動探し、コードの繰り返しを減らす
    class Angler1 extends Enemy {
        constructor(game){
            super(game);
            this.width = 228 * 0.2; //大きさは調整
            this.height = 169 * 0.2;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
        }

    }

    // 視差レイヤー
    class Layer {

    }

    // 全体をアニメーション化
    class Background {

    }

    // 弾薬数タイマーや点数表示
    class UI {
        constructor(game){
            // フィールド情報
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = 'Helvetica';
            this.color = 'yellow';
        }
        // 弾薬表示する座標
        draw(context){
            context.fillStyle = this.color;
            for (let i = 0; i < this.game.ammo; i++){
                // 弾薬表示の20の位置から5フォント大きさで「i個」
                context.fillRect( 20 + 5 * i, 50, 3, 20);
            }

        }

    }

    // すべてのクラスが呼び出される場所
    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler(this)

            this.ui = new UI(this);//UIの弾薬表示をオブジェクト化
            this.keys = [];//キーボード操作を配列に格納

            //敵の出現は同じもの使用する「弾薬の間隔」があるので
            this.enemies = [];// 敵クラスの配列を宣言
            this.enemyTimer = 0;// 敵の初期時間は0
            this.enemyInterval = 1000;// 敵のインターバル１秒


            this.ammo = 20;// 弾薬数初期値
            this.maxAmmo = 50; // 弾薬最大値
            this.ammoTimer = 0; // 弾薬タイマー
            this.ammoInterval = 500; // 弾薬インターバル

            this.gameOver = false;
        }
        update(deltaTime){
            this.player.update();
            // 弾薬の数が少ないときは回復する
            if (this.ammoTimer > this.ammoInterval){
                if (this.ammo < this.maxAmmo) this.ammo++
                // そうでなければタイマーは0にする
                this.ammoTimer = 0;
            } else {
                this.ammoTimer += deltaTime;
            }
            // 敵クラスとレーザーの関係
            this.enemies.forEach(enemy => {
                enemy.update();
            });
            // filterはレーザの攻撃で、敵がどうなったかフィルター、敵インターバル
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            if(this.enemyTimer > this.enemyInterval && !this.gameOver){
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
        }
        draw(context){
            // プレイヤーの呼び出し
            this.player.draw(context);
            // 弾薬表示の呼び出し
            this.ui.draw(context);
            // 敵クラスの呼び出し
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
        }
        // 親super敵クラスの子クラスを呼ぶnew
        addEnemy(){
            this.enemies.push(new Angler1(this));// このthisはGameを呼び出し
            console.log(this.enemies);
        }
    }
    // すべてのクラスが実行されるmainになる
    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;// 前回の弾薬補充カウント数

    // アニメーションループ
    function animate(timeStamp) {
        // 弾薬が前回から今回を差し引く
        const deltaTime = timeStamp - lastTime;
        // console.log(deltaTime);
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);// アニメーションがクリアされる
        game.update(deltaTime);// game.update()に引数deltaTimeを入れる
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(0);// animate(0)引数に「0」を入れる

});