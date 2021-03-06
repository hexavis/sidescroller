﻿/**
* Author : Jacqueline Richard
* Javascript file for index.html
* This javascript is the main game code. It does everything. :D
* Last Modified by : Jacqueline Richard
* Date Last Modified :  Nov 15th, 2014
* Revision History: 1.0 Initial Commit, Nov 9th, 2014
*                   1.1 Main Functions
*                   1.2 Added Game Objects
*                   1.3 Added Start Screen, Instructions, GameOver Screen
*                   1.4 Fixed the lag
*                   2.0 Added animations (then took them out) Nov 13th, 2014
*                   2.1 Added Shooting
*                   3.0 Final version Nov 15th, 2014
*/
var stage;
var queue;

// Game Objects
var elf;
var forest;
var bunny;
var apple;
var clouds;
var scoreboard;
var arrow;
var arrowCount = 0;
var appleCount = 0;

// Cloud Array
var bushes = [];
var bunnies = [];
var apples = [];
var hearts = [];
var arrows = [];

// Game Constants
var BUSH_NUM = 3;
var BUNNY_NUM = 3;
var APPLE_NUM = 1;
var ARROW_NUM = 5;
var GAME_FONT = "40px Pacifico";
var FONT_COLOUR = "#660033";
var PLAYER_LIVES = 3;

var mainScreen;
var yay;
var playButt;
var instructionButt;
var insScreen;

var elfData;
var bunnyData;

var atlas;

var progressText = new createjs.Text("", "20px Arial", "#000000");

//preload all the things
function preload() {
    stage = new createjs.Stage(document.getElementById("canvas"));
    progressText.x = 300 - progressText.getMeasuredWidth() / 2;
    progressText.y = 20;
    stage.addChild(progressText);
    stage.update();
    queue = new createjs.LoadQueue();
    queue.on("progress", handleFileProgress);
    queue.installPlugin(createjs.Sound);
    queue.addEventListener("complete", init);

    queue.loadManifest([
        //{ id: "elf", src: "images/elf.gif" },
        { id: "spriteSheet", src: "images/sprite.png" },
        { id: "forest", src: "images/background.png" },
        { id: "bush", src: "images/bush1.png" },
        //{ id: "bunny", src: "images/bunny.gif" },
        { id: "apple", src: "images/apple.png" },
        { id: "clouds", src: "images/clouds.png" },
        { id: "arrow", src: "images/arrow.png" },
        { id: "mainScreen", src: "images/mainscreen.png" },
        { id: "playButton", src: "images/playButton.png" },
        { id: "playAgainButton", src: "images/playAgain.png" },
        { id: "instructions", src: "images/instructions.png" },
        { id: "instructionButton", src: "images/instructionButton.png" },
        { id: "yay", src: "images/gameover.png" },
        { id: "gameover", src: "images/gameoverscreen.png" },
        { id: "heart", src: "images/heart.png" },
        //sounds
        { id: "main", src: "sounds/piano.mp3" },
        { id: "bell", src: "sounds/bell.mp3" },
        { id: "appleCrunch", src: "sounds/apple.mp3" },
        { id: "leafHit", src: "sounds/leafHit.mp3" },
        { id: "arrowHit", src: "sounds/leather.mp3" },
        { id: "thud", src: "sounds/thud.mp3" }
    ]);
    queue.addEventListener("complete", handleComplete);
    this.atlas = new createjs.SpriteSheet(this.spriteSheetData);
}

//these should be the animations... fuck if they worked
function handleComplete() {
    var elf = ({
        images: ["images/sprite.png"],
        frames: [
            [2, 2, 82, 103],
            [86, 2, 82, 103],
            [170, 2, 82, 103]
        ],
        animations: {
            run: {
                frames: [3, 2, 1, 3],
                speed: 2
            }
        }
    });

    var bunny = ({
        images: ["images/sprite.png"],
        frames: [
            [254, 2, 83, 74],
            [339, 2, 83, 74],
            [424, 2, 83, 74]
        ],
        animations: {
            run: {
                frames: [0, 2, 1],
                speed: 2
            }
        }
    });

    elfData = new createjs.SpriteSheet(elf);
    bunnyData = new createjs.SpriteSheet(bunny);
}

//the function that the html file runs
function init() {
    gameStart();
}

// Main Game Screen : has a play button and the instruction button
function gameStart() {
    stage.cursor = 'default';

    //add the main screen
    mainScreen = new createjs.Bitmap(queue.getResult("mainScreen"));
    this.stage.addChild(mainScreen);
    mainScreen.x = 0;
    mainScreen.y = 0;

    //add the play button
    playButt = new createjs.Bitmap(queue.getResult("playButton"));
    this.stage.addChild(playButt);
    playButt.x = 80;
    playButt.y = 390;
    playButt.addEventListener("click", mainGameStart);

    //add the instructions button
    instructionButt = new createjs.Bitmap(queue.getResult("instructionButton"));
    this.stage.addChild(instructionButt);
    instructionButt.x = 80;
    instructionButt.y = 310;
    instructionButt.addEventListener("click", showInstructions);

    var mainTune = createjs.Sound.play("main", { loop: 1000 });
    mainTune.addEventListener("loop", handleLoop);
    mainTune.volume = mainTune.volume * 0.2;

    function handleLoop(event) {
        //loop the music
    }
    stage.update();
}

//shows the instructions so people know how to play the game
function showInstructions(e) {
    stage.removeAllChildren();

    //add the main screen
    insScreen = new createjs.Bitmap(queue.getResult("instructions"));
    this.stage.addChild(insScreen);
    insScreen.x = 0;
    insScreen.y = 0;

    //add the play button
    playButt = new createjs.Bitmap(queue.getResult("playButton"));
    this.stage.addChild(playButt);
    playButt.x = 80;
    playButt.y = 390;
    playButt.addEventListener("click", mainGameStart);

    stage.update();
}

//the game's score board wooooo~
var Scoreboard = (function () {
    function Scoreboard() {
        this.labelString = "";
        this.lives = PLAYER_LIVES;
        this.score = 0;
        this.hx = 5;
        this.label = new createjs.Text(this.labelString, GAME_FONT, FONT_COLOUR);
        this.update();
        this.width = this.label.getBounds().width;
        this.height = this.label.getBounds().height;

        stage.addChild(this.label);
    }
    Scoreboard.prototype.update = function () {
        if (this.score < 0) {
            this.score = 0;
            this.update();
        }
        if (this.lives == 0) {
            stage.removeAllChildren();
            gameOver();
        } else {
            this.labelString = "Lives: " + this.lives.toString() + " Score: " + this.score.toString();
            this.label.text = this.labelString;
        }
    };
    return Scoreboard;
})();

//the game over screen
function gameOver() {
    stage.cursor = 'default';

    createjs.Ticker.removeEventListener("tick", gameLoop);
    stage.removeAllChildren();

    //add the main screen
    mainScreen = new createjs.Bitmap(queue.getResult("gameover"));
    this.stage.addChild(mainScreen);
    mainScreen.x = 0;
    mainScreen.y = 0;

    //add the little elf
    yay = new createjs.Bitmap(queue.getResult("yay"));
    this.stage.addChild(yay);
    yay.x = 90;
    yay.y = 150;

    //add the play button
    playButt = new createjs.Bitmap(queue.getResult("playAgainButton"));
    this.stage.addChild(playButt);
    playButt.x = 280;
    playButt.y = 390;
    playButt.addEventListener("click", mainGameStart);

    var label;
    var labelString = "";

    label = new createjs.Text(this.labelString, GAME_FONT, FONT_COLOUR);
    labelString = "Score: " + scoreboard.score.toString();
    label.text = labelString;
    stage.addChild(label);
    label.x = 300;
    label.y = 200;

    stage.update();
}

//the loader precentage thing
function handleFileProgress(event) {
    progressText.text = (queue.progress * 100 | 0) + " % Loaded";
    stage.update();
}

// Game Loop
function gameLoop(event) {
    console.log('tick');
    stage.update(event);

    forest.update();
    clouds.update();
    elf.update();

    for (var count = 0; count < BUSH_NUM; count++) {
        bushes[count].update();
    }

    for (var count = 0; count < BUNNY_NUM; count++) {
        bunnies[count].update();
    }

    for (var count = 0; count < APPLE_NUM; count++) {
        apples[count].update();
    }

    for (var count = 0; count < arrows.length; count++) {
        arrows[count].update(count);
    }

    collisionCheck();
    scoreboard.update();
    stage.update();
}

// Elf Class
var Elf = (function () {
    function Elf() {
        this.image = new createjs.BitmapAnimation(elfData, "elf");
        this.image.framerate = 3;
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;
        this.image.y = 430;

        stage.addChild(this.image);
    }
    Elf.prototype.run = function () {
        this.image.gotoAndPlay("run");
    };

    Elf.prototype.update = function () {
        this.image.x = stage.mouseX;
        this.image.y = stage.mouseY;
    };
    return Elf;
})();

// bunny Class this allows for one bunny at a time.
var Bunny = (function () {
    function Bunny() {
        this.image = new createjs.BitmapAnimation(bunnyData, "bunny");
        this.image.framerate = 3;
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;
        stage.addChild(this.image);
        this.reset();
    }
    Bunny.prototype.run = function () {
        this.image.gotoAndPlay("run");
    };

    Bunny.prototype.reset = function () {
        this.image.framerate = 3;
        this.image.x = 750;
        this.image.y = Math.floor(Math.random() * stage.canvas.height);
        this.dy = Math.floor(Math.random() * 4 - 2);
        this.dx = Math.floor(Math.random() * 5 + 5);
    };

    Bunny.prototype.update = function () {
        this.image.y += this.dy;
        this.image.x -= this.dx;
        if (this.image.x <= (this.width - 700)) {
            this.reset();
        }
    };
    return Bunny;
})();

// Bush Class
var Bush = (function () {
    function Bush() {
        this.image = new createjs.Bitmap(queue.getResult("bush"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;
        stage.addChild(this.image);
        this.reset();
    }
    Bush.prototype.reset = function () {
        this.image.x = 750;
        this.image.y = Math.floor(Math.random() * stage.canvas.height);
        this.dx = 3;
    };

    Bush.prototype.update = function () {
        // this.image.y += this.dy;
        this.image.x -= this.dx;
        if (this.image.x <= (this.width - 700)) {
            this.reset();
        }
    };
    return Bush;
})();

//create the arrow
var Arrow = (function () {
    function Arrow() {
        this.image = new createjs.Bitmap(queue.getResult("arrow"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;
        stage.addChild(this.image);
        this.image.x = 750;
        this.image.y = 550;
    }
    Arrow.prototype.reset = function () {
        this.image.x = elf.image.x;
        this.image.y = elf.image.y;
        this.dx = 3;
    };

    Arrow.prototype.update = function () {
        this.image.x += 3;
        if (this.image.x <= (this.width - 700)) {
        }
    };

    Arrow.prototype.hide = function () {
        this.image.x = 750;
    };
    return Arrow;
})();

//this class creates the apple item
var Apple = (function () {
    function Apple() {
        this.image = new createjs.Bitmap(queue.getResult("apple"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;
        stage.addChild(this.image);
        this.reset();
    }
    Apple.prototype.reset = function () {
        this.image.x = 750;
        this.image.y = Math.floor(Math.random() * stage.canvas.height);
        this.dx = 3;
    };

    Apple.prototype.update = function () {
        // this.image.y += this.dy;
        this.image.x -= this.dx;
        if (this.image.x <= (this.width - 700)) {
            this.reset();
        }
    };
    return Apple;
})();

// Forest Class
var Forest = (function () {
    function Forest() {
        this.image = new createjs.Bitmap(queue.getResult("forest"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.dx = 3;
        stage.addChild(this.image);
        this.reset();
    }
    Forest.prototype.reset = function () {
        this.image.x = 0;
    };

    Forest.prototype.update = function () {
        this.image.x -= this.dx;
        if (this.image.x <= -800) {
            this.reset();
        }
    };
    return Forest;
})();

// Clouds Class
var Clouds = (function () {
    function Clouds() {
        this.image = new createjs.Bitmap(queue.getResult("clouds"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.dx = 2;
        stage.addChild(this.image);
        this.reset();
    }
    Clouds.prototype.reset = function () {
        this.image.x = 0;
    };

    Clouds.prototype.update = function () {
        this.image.x -= this.dx;
        if (this.image.x <= -800) {
            this.reset();
        }
    };
    return Clouds;
})();

// The Distance Utility Function
function distance(p1, p2) {
    var firstPoint;
    var secondPoint;
    var theXs;
    var theYs;
    var result;

    firstPoint = new createjs.Point();
    secondPoint = new createjs.Point();

    firstPoint.x = p1.x;
    firstPoint.y = p1.y;

    secondPoint.x = p2.x;
    secondPoint.y = p2.y;

    theXs = secondPoint.x - firstPoint.x;
    theYs = secondPoint.y - firstPoint.y;

    theXs = theXs * theXs;
    theYs = theYs * theYs;

    result = Math.sqrt(theXs + theYs);

    return result;
}

// Check Collision between elfAndBush
function elfAndBush(hitBush) {
    var point1 = new createjs.Point();
    var point2 = new createjs.Point();

    //var bush: Bush = new Bush();
    //bush = hitBush;
    point1.x = elf.image.x;
    point1.y = elf.image.y;
    point2.x = hitBush.image.x;
    point2.y = hitBush.image.y;
    if (distance(point1, point2) < ((elf.width * 0.5) + (hitBush.width * 0.5))) {
        createjs.Sound.play("leafHit"); //the bush thud
        scoreboard.lives -= 1;
        hitBush.reset();
    }
}

// Check Collision between elfAndBunny
function elfAndBunny(hitBunny) {
    var point1 = new createjs.Point();
    var point2 = new createjs.Point();

    point1.x = elf.image.x;
    point1.y = elf.image.y;
    point2.x = hitBunny.image.x;
    point2.y = hitBunny.image.y;
    if (distance(point1, point2) < ((elf.width * 0.5) + (hitBunny.width * 0.5))) {
        createjs.Sound.play("thud");
        scoreboard.lives -= 1;
        scoreboard.score -= 50;
        hitBunny.reset();
    }
}

// Check Collision between elfAndApple
function elfAndApple(hitApple) {
    var point1 = new createjs.Point();
    var point2 = new createjs.Point();

    point1.x = elf.image.x;
    point1.y = elf.image.y;
    point2.x = hitApple.image.x;
    point2.y = hitApple.image.y;
    if (distance(point1, point2) < ((elf.width * 0.5) + (hitApple.width * 0.5))) {
        createjs.Sound.play("appleCrunch");
        scoreboard.score += 30;
        hitApple.reset();
        appleCount++;
        if (appleCount >= 20) {
            createjs.Sound.play("bell");
            scoreboard.lives += 1;
            appleCount = 0;
        }
    }
}

//collision between arrow and bunny
function arrowAndBunny(hitBunny, hitArrow) {
    var point1 = new createjs.Point();
    var point2 = new createjs.Point();

    point1.x = hitArrow.image.x;
    point1.y = hitArrow.image.y;
    point2.x = hitBunny.image.x;
    point2.y = hitBunny.image.y;

    if (distance(point1, point2) < ((hitArrow.width * 0.5) + (hitBunny.width * 0.5))) {
        createjs.Sound.play("arrowHit");
        scoreboard.score += 50;
        hitBunny.reset();
        hitArrow.hide();
    }
}

// Collision Check Utility Function
function collisionCheck() {
    for (var count = 0; count < BUSH_NUM; count++) {
        elfAndBush(bushes[count]);
    }

    for (var count = 0; count < BUNNY_NUM; count++) {
        elfAndBunny(bunnies[count]);
    }

    for (var count = 0; count < BUNNY_NUM; count++) {
        arrowAndBunny(bunnies[count], arrows[0]);
        arrowAndBunny(bunnies[count], arrows[1]);
        arrowAndBunny(bunnies[count], arrows[2]);
        arrowAndBunny(bunnies[count], arrows[3]);
        arrowAndBunny(bunnies[count], arrows[4]);
    }

    for (var count = 0; count < APPLE_NUM; count++) {
        elfAndApple(apples[count]);
    }
}

//the listener event that shoots the arrows - only 5 allowed
function shoot(e) {
    if (arrowCount < 5) {
        arrows[arrowCount].reset();
        arrowCount++;
    } else {
        arrowCount = 0;
    }
}

//starts the main part of the game
function mainGameStart(e) {
    //createjs.Ticker.setFPS(60);
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", gameLoop);

    stage.enableMouseOver(60);
    stage.mouseChildren = true;
    stage.cursor = 'none';
    stage.addEventListener("stagemousedown", shoot);

    stage.removeAllChildren();
    appleCount = 0;

    forest = new Forest();

    for (var count = 0; count < BUSH_NUM; count++) {
        bushes[count] = new Bush();
    }
    for (var count = 0; count < BUNNY_NUM; count++) {
        bunnies[count] = new Bunny();
        bunnies[count].run();
    }

    for (var count = 0; count < APPLE_NUM; count++) {
        apples[count] = new Apple();
    }

    for (var count = 0; count < ARROW_NUM; count++) {
        arrows[count] = new Arrow();
    }

    elf = new Elf();

    //elf.run();
    clouds = new Clouds();

    scoreboard = new Scoreboard();
    scoreboard.lives = PLAYER_LIVES;
    scoreboard.score = 0;
}
//# sourceMappingURL=main.js.map
