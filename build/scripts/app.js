var menu, gamezone, input;
var lazer,
    monsters = [],
    lazerImg = [],
    monstersImg = [],
    pewImg,
    pews = [],
    boomImg = [];
var frames,
    mframe,
    lvFrame,
    dir,
    globalLives = 3,
    score = 0,
    animate = true;
var crush, pewSound, boom, win, endGame;

class Menu {
    constructor() {
        let t = this;
        // $('#startgame').on('click tap', function() {
        //     t.start();
        // });
        $('#menu').on('click tap', function () {
            t.start();
        });
    }
    start() {
        $('#menu').fadeOut(function () {
            gamezone = new Gamezone(640, 480);
            init(function () {
                window.requestAnimationFrame(loop, gamezone.canvas);
            });
        });
    }
    end() {
        window.cancelAnimationFrame(loop, gamezone.canvas);
        animate = false;

        $('.game__start').removeClass('active');
        $('.game__youscore span').text(score);
        $('.game__end').addClass('active');
        $('#menu').fadeIn(function () {

            if (globalLives > 0) {
                win.play();
            } else {
                endGame.play();
            }
        });
    }
}

class Gamezone {
    constructor(width, height) {
        let t = this;
        t.canvas = document.createElement("canvas");
        t.context = t.canvas.getContext("2d");
        t.canvas.width = t.width = width;
        t.canvas.height = t.height = height;

        $("#gamezone").append(this.canvas);
    }
    draw(img, x, y) {
        this.context.drawImage(img.img, img.x, img.y, img.w, img.h, x, y, img.w, img.h);
    }
    drawPew(pew) {
        let t = this;

        if (pew.type === "alarm") {
            t.draw(pew.img, pew.x, pew.y);
        } else {
            t.context.fillStyle = "#00fc00";
            t.context.fillRect(pew.x, pew.y, pew.w, pew.h);
        }
    }
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }
}

class Img {
    constructor(img, x, y, w, h) {
        let t = this;
        t.img = img;
        t.x = x;
        t.y = y;
        t.w = w;
        t.h = h;
    }
}

class InputHandeler {
    constructor() {
        let t = this;
        t.down = {};
        t.pressed = {};

        window.addEventListener("keydown", function (e) {
            t.down[e.keyCode] = true;
        });
        window.addEventListener("keyup", function (e) {
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

class Pew {
    constructor(type, x, y, v) {
        let t = this;
        t.type = type;
        t.x = x;
        t.y = y;
        t.v = v;
        t.wasted = false;
        t.w = 2;
        t.h = 6;

        if (t.type === "alarm") {
            t.img = pewImg;
            t.w = 12;
            t.h = 16;
        }
    }
    update() {
        let t = this;
        t.y += t.v;
    }
}

var loop = function () {
    updateAll();
    drawAll();
    if (animate) {
        window.requestAnimationFrame(loop, gamezone.canvas);
    }
};

function init(callback) {

    frames = 0;
    mframe = 0;
    lvFrame = 50;
    dir = 1;

    input = new InputHandeler();

    crush = new Audio();
    crush.src = "./crush.mp3";
    pewSound = new Audio();
    pewSound.src = "./pew.mp3";
    boom = new Audio();
    boom.src = "./boom.mp3";
    win = new Audio();
    win.src = "./win.mp3";
    endGame = new Audio();
    endGame.src = "./endgame.mp3";

    var sprite = new Image();
    sprite.src = "./images/sprite-small2.png";
    sprite.addEventListener("load", function () {

        lazerImg = [new Img(this, 85, 0, 30, 20), new Img(this, 85, 20, 30, 20)];
        monstersImg = [[new Img(this, 0, 0, 28, 20), new Img(this, 0, 20, 28, 20)], [new Img(this, 29, 0, 28, 20), new Img(this, 29, 20, 28, 20)], [new Img(this, 57, 0, 28, 20), new Img(this, 57, 20, 28, 20)]];
        boomImg = [new Img(this, 0, 40, 28, 20), new Img(this, 0, 40, 28, 20)];

        lazer = {
            img: lazerImg[0],
            lives: globalLives,
            x: (gamezone.width - lazerImg[0].w) / 2,
            y: gamezone.height - 30,
            w: 28,
            h: 20,
            active: true
        };

        pewImg = new Img(this, 32, 45, 12, 16);

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 10; j++) {
                monsters[j + 10 * i] = {
                    img: monstersImg[i],
                    type: i + 1,
                    x: 30 + 40 * j,
                    y: 30 + 30 * i,
                    w: 28,
                    h: 30
                };
            }
        }

        callback();
    });
}

function drawAll() {
    gamezone.clear();
    gamezone.draw(lazer.img, lazer.x, lazer.y);

    $.each(monsters, function (index, value) {
        gamezone.draw(value.img[mframe], value.x, value.y);
    });

    gamezone.context.save();
    for (var i = 0, len = pews.length; i < len; i++) {
        gamezone.drawPew(pews[i]);
    }
    gamezone.context.restore();
}

function updateAll() {

    if (lazer.active) {
        if (input.isDown(37)) {
            //left
            lazer.x -= 4;
        }
        if (input.isDown(39)) {
            //right
            lazer.x += 4;
        }

        if (input.isPressed(32)) {
            //space
            pews.push(new Pew("", lazer.x + lazer.w / 2, lazer.y + 2, -8));
            pewSound.play();
        }

        if (Math.random() < 0.02 && monsters.length > 0) {
            var a = monsters[Math.round(Math.random() * (monsters.length - 1))];
            pews.push(new Pew("alarm", a.x + 15, a.y + 15 + 30, 4));
        }

        $('#gamezone').on('tap', function () {
            pews.push(new Pew("", lazer.x + lazer.w / 2, lazer.y + 2, -8));
            pewSound.play();
        });
    }

    $.each(pews, function (index, value) {

        if (value) {
            value.update();

            if (value.y < 0 || value.y > screen.height || value.wasted) {
                pews.splice(index, 1);
            }
        }
    });

    lazer.x = Math.max(Math.min(lazer.x, gamezone.width - (30 + lazerImg[0].w)), 30);

    frames++;
    if (frames % lvFrame === 0) {

        mframe = (mframe + 1) % 2;

        var _max = 0,
            _min = gamezone.width;

        for (var i = 0, len = monsters.length; i < len; i++) {
            var a = monsters[i];
            a.x += 30 * dir;

            _max = Math.max(_max, a.x + 28);
            _min = Math.min(_min, a.x);
        }

        if (_max > gamezone.width - 30 || _min < 30) {

            dir *= -1;
            for (var i = 0, len = monsters.length; i < len; i++) {
                monsters[i].x += 30 * dir;
                monsters[i].y += 30;
            }
        }
    }

    $.each(pews, function (index, pew) {
        if (pew.type === "alarm" && lazer.active && checkHurt(lazer, pew)) {
            pew.wasted = true;
            globalLives -= 1;
            lazer.img = lazerImg[1];

            if (globalLives > 0) {

                lazer.active = false;
                boom.play();

                setTimeout(function () {
                    init(function () {});
                }, 2000);
            } else {
                boom.play();
                setTimeout(function () {
                    menu.end();
                }, 2000);
            }
        }

        $.each(monsters, function (i, monster) {
            if (monster && pew.type === "" && checkHurt(monster, pew)) {
                score += monster.type * 10;
                pew.wasted = true;
                monster.img = boomImg;
                crush.play();

                setTimeout(function () {
                    monsters.splice(i, 1);
                    if (monsters.length === 0) {
                        menu.end();
                    }
                }, 100);
            }
        });
    });
}

function checkHurt(object, danger) {

    return !danger.wasted && danger.x >= object.x - danger.w && danger.x <= object.x + object.w + danger.w / 2 && danger.y >= object.y && danger.y + danger.h <= object.y + object.h;
}

$(document).ready(function () {
    menu = new Menu();
});
//# sourceMappingURL=app.js.map
