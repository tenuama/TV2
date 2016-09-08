var screen, input, frames, spFrame, lvFrame;
var mSprite, lSprite;
var monsters, dir, lazer, bullets;

class Menu {
    constructor() {
        let t = this;
        $('#startgame').on('click', function () {
            t.close();
        });
    }
    close() {
        $('#menu').fadeOut(function () {
            main();
        });
    }
}

class Screen {
    constructor(width, height) {
        let t = this;
        t.canvas = document.createElement("canvas");
        t.context = t.canvas.getContext("2d");
        t.canvas.width = t.width = width;
        t.canvas.height = t.height = height;

        document.getElementById("gamezone").appendChild(this.canvas);
    }
    drawSprite(sp, x, y) {
        this.context.drawImage(sp.img, sp.x, sp.y, sp.w, sp.h, x, y, sp.w, sp.h);
    }
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }
    drawBullet() {
        let t = this;
        t.context.fillStyle = bullet.color;
        t.context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
}

class InputHandeler {
    constructor() {
        let t = this;
        t.down = {};
        t.pressed = {};

        document.addEventListener("keydown", function (e) {
            t.down[e.keyCode] = true;
        });
        document.addEventListener("keyup", function (e) {
            delete t.down[e.keyCode];
            delete t.pressed[e.keyCode];
        });
    }
    isDown(code) {
        return this.down[code];
    }
    isPressed(code) {
        let t = this;
        if (t.pressed[code]) {
            return false;
        } else if (t.down[code]) {
            return t.pressed[code] = true;
        }
        return false;
    }
}

class Sprite {
    constructor(img, x, y, w, h) {
        let t = this;
        t.img = img;
        t.x = x;
        t.y = y;
        t.w = w;
        t.h = h;
    }
};

class Bullet {
    constructor(x, y, vely, w, h, color) {
        let t = this;
        t.x = x;
        t.y = y;
        t.vely = vely;
        t.width = w;
        t.height = h;
        t.color = color;
    }
    update() {
        let t = this;
        t.y += t.vely;
    }
};

function init() {
    frames = 0;
    spFrame = 0;
    lvFrame = 60;
    dir = 1;

    lazer = {
        sprite: lSprite,
        x: (screen.width - lSprite.w) / 2,
        y: screen.height - (30 + lSprite.h)
    };

    bullets = [];

    monsters = [];
    var rows = [0, 1, 1, 2, 2];

    for (var i = 0, len = rows.length; i < len; i++) {
        for (var j = 0; j < 10; j++) {
            var a = rows[i];
            monsters.push({
                sprite: mSprite[a],
                x: 30 + j * 30,
                y: 30 + i * 30,
                w: mSprite[a][0].w,
                h: mSprite[a][0].h
            });
        }
    }
};

function run() {
    var loop = function () {
        update();
        render();
        window.requestAnimationFrame(loop, screen.canvas);
    };
    window.requestAnimationFrame(loop, screen.canvas);
};

function update() {

    if (input.isDown(37)) {
        //left
        lazer.x -= 4;
    }
    if (input.isDown(39)) {
        //right
        lazer.x += 4;
    }

    lazer.x = Math.max(Math.min(lazer.x, screen.width - (30 + lSprite.w)), 30);

    frames++;
    if (frames % lvFrame === 0) {
        spFrame = (spFrame + 1) % 2;

        var _max = 0,
            _min = screen.width;

        for (var i = 0, len = monsters.length; i < len; i++) {
            var a = monsters[i];
            a.x += 30 * dir;

            _max = Math.max(_max, a.x + a.w);
            _min = Math.min(_min, a.x);
        }

        if (_max > screen.width - 28 || _min < 28) {
            dir *= -1;
            for (var i = 0, len = monsters.length; i < len; i++) {
                monsters[i].x += 30 * dir;
                monsters[i].y += 30;
            }
        }
    }
};

function render() {
    // screen.drawSprite(mSprite[0][0], 10, 10);

    screen.clear();

    for (var i = 0, len = monsters.length; i < len; i++) {
        var a = monsters[i];
        screen.drawSprite(a.sprite[spFrame], a.x, a.y);
    }

    screen.context.save();
    for (var i = 0, len = bullets.length; i < len; i++) {
        screen.drawBullet(bullets[i]);
    }
    screen.context.restore();

    screen.drawSprite(lazer.sprite, lazer.x, lazer.y);
};

function main() {
    screen = new Screen(640, 480);
    input = new InputHandeler();

    var img = new Image();
    img.addEventListener("load", function () {

        mSprite = [[new Sprite(this, 0, 0, 28, 20), new Sprite(this, 0, 20, 28, 20)], [new Sprite(this, 29, 0, 28, 20), new Sprite(this, 29, 20, 28, 20)], [new Sprite(this, 57, 0, 28, 20), new Sprite(this, 57, 20, 28, 20)]];

        lSprite = new Sprite(this, 85, 0, 30, 20);

        init();
        run();
    });
    img.src = "./images/sprite-small.png";
};

$(document).ready(function () {
    var menu = new Menu();
    // main();
});
//# sourceMappingURL=app.js.map
