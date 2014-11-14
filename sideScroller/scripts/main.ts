var stage: createjs.Stage;
var queue;

// Game Objects
var elf: Elf;
var forest: Forest;
var bunny: Bunny;
var apple: Apple;
var clouds: Clouds;
var scoreboard: Scoreboard; 

// Cloud Array
var bushes = [];
var bunnies = [];
var apples = [];
var hearts = [];

// Game Constants
var BUSH_NUM: number = 3;
var BUNNY_NUM: number = 3;
var APPLE_NUM: number = 1;
var GAME_FONT: string = "40px Consolas";//change
var FONT_COLOUR: string = "#FFFF00";//change
var PLAYER_LIVES: number = 3;

var mainScreen;
var yay;
var playButt;
var instructionButt;
var insScreen;

var elfData;
var bunnyData;

var atlas: createjs.SpriteSheet;

var progressText = new createjs.Text("", "20px Arial", "#000000");

function preload(): void {
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
        { id: "appleCrunch", src: "sounds/apple.wav" },
        { id: "leafHit", src: "sounds/leafHit.wav" },
        { id: "arrowHit", src: "sounds/leather.wav" },
        { id: "thud", src: "sounds/thud.wav" }
    ]);
    queue.addEventListener("complete", handleComplete);
    this.atlas = new createjs.SpriteSheet(this.spriteSheetData);
}

function handleComplete() {
    var elf = ({
        "images": ["images/sprite.png"],
        "frames": [
            [2, 2, 82, 103],
            [86, 2, 82, 103],
            [170, 2, 82, 103]
        ],
        "animations": {
            "run": [3, 2, 1, 3],
            frequency: 300
        },
    });

    var bunny = ({
        "images": ["images/sprite.png"],
        "frames": [
            [254, 2, 83, 74],
            [339, 2, 83, 74],
            [424, 2, 83, 74],
        ],
        "animations": {
            "run": [0, 2, 1],         
        },
    });

    elfData = new createjs.SpriteSheet(elf);
    bunnyData = new createjs.SpriteSheet(bunny);

}

function init(): void {
    gameStart();
}

// Main Game Screen : has a play button and the instruction button
function gameStart(): void {
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
function showInstructions(e): void {
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
class Scoreboard {
    label: createjs.Text;
    labelString: string = "";
    lives: number = PLAYER_LIVES;
    score: number = 0;
    width: number;
    height: number;
    hx: number = 5;
    constructor() {
        this.label = new createjs.Text(this.labelString, GAME_FONT, FONT_COLOUR);
        this.update();
        this.width = this.label.getBounds().width;
        this.height = this.label.getBounds().height;

        stage.addChild(this.label);
    }

    update() {
        if (this.score < 0) {
            this.score = 0;
            this.update()
        }
        if (this.lives == 0) {
            stage.removeAllChildren();
            gameOver();
        }
        else {
            this.labelString = "Lives: " + this.lives.toString() + " Score: " + this.score.toString();
            this.label.text = this.labelString;
        }
    }

}

//the game over screen
function gameOver(): void {

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

    var label: createjs.Text;
    var labelString: string = "";

    label = new createjs.Text(this.labelString, GAME_FONT, FONT_COLOUR);
    labelString = "Score: " + scoreboard.score.toString();
    label.text = labelString;
    stage.addChild(label);
    label.x = 300;
    label.y = 200;

    stage.update();
}



function handleFileProgress(event) {
    progressText.text = (queue.progress * 100 | 0) + " % Loaded";
    stage.update();
}

// Game Loop
function gameLoop(event): void {
    forest.update();
    clouds.update();
    elf.update();

    while (bushes.length > 3) {
        bushes.pop();
    }
    while (bunnies.length > 3) {
        bunnies.pop();
    }
    while (apples.length > 3) {
        apples.pop();
    }

    for (var count = 0; count < BUSH_NUM; count++) {
        bushes[count].update();
    }

    for (var count = 0; count < BUNNY_NUM; count++) {
        bunnies[count].update();
    }

    for (var count = 0; count < APPLE_NUM; count++) {
        apples[count].update();
    }


    collisionCheck();

    scoreboard.update();

    stage.update();
}

// Elf Class
class Elf {
    image: createjs.BitmapAnimation;
    width: number;
    height: number;
    constructor() {
        this.image = new createjs.BitmapAnimation(elfData, "elf");
        this.image.gotoAndPlay("run");
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;
        this.image.y = 430;

        stage.addChild(this.image);

    }

    update() {
        this.image.x = stage.mouseX;
        this.image.y = stage.mouseY;
    }
}

// bunny Class this allows for one bunny at a time. 
class Bunny {
    image: createjs.Sprite;
    width: number;
    height: number;
    dy: number;
    dx: number;
    constructor() {
        this.image = new createjs.Sprite(bunnyData);
        this.image.gotoAndPlay("run");
        this.image.framerate = 1;
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;
        stage.addChild(this.image);
        this.reset();
    }

    reset() {
        this.image.x = 750;
        this.image.y = Math.floor(Math.random() * stage.canvas.height);
        this.dy = Math.floor(Math.random() * 4 - 2);
        this.dx = Math.floor(Math.random() * 5 + 5);
    }

    update() {
        this.image.y += this.dy;
        this.image.x -= this.dx;
        if (this.image.x <= (this.width - stage.canvas.width)) {
            this.reset();
        }
    }
}

// Bush Class
class Bush {
    image: createjs.Bitmap;
    width: number;
    height: number;
    dy: number;
    dx: number;
    constructor() {
        this.image = new createjs.Bitmap(queue.getResult("bush"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;
        stage.addChild(this.image);
        this.reset();
    }

    reset() {
        this.image.x = 750;
        this.image.y = Math.floor(Math.random() * stage.canvas.height);
        this.dx = 3;
    }

    update() {
       // this.image.y += this.dy;
        this.image.x -= this.dx;
        if (this.image.x <= (this.width - stage.canvas.width)) {
            this.reset();
        }
    }
}

class Apple {
    image: createjs.Bitmap;
    width: number;
    height: number;
    dy: number;
    dx: number;
    constructor() {
        this.image = new createjs.Bitmap(queue.getResult("apple"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;
        stage.addChild(this.image);
        this.reset();
    }

    reset() {
        this.image.x = 750;
        this.image.y = Math.floor(Math.random() * stage.canvas.height);
        this.dx = 3;
    }

    update() {
        // this.image.y += this.dy;
        this.image.x -= this.dx;
        if (this.image.x <= (this.width - stage.canvas.width)) {
            this.reset();
        }
    }
}

// Forest Class
class Forest {
    image: createjs.Bitmap;
    width: number;
    height: number;
    dx: number;
    constructor() {
        this.image = new createjs.Bitmap(queue.getResult("forest"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.dx = 3;
        stage.addChild(this.image);
        this.reset();
    }

    reset() {
        this.image.x = 0;//this needs to be changed
    }

    update() {
        this.image.x -= this.dx;
        if (this.image.x <= -800) {
            this.reset();
        }
    }
}

// Clouds Class
class Clouds {
    image: createjs.Bitmap;
    width: number;
    height: number;
    dx: number;
    constructor() {
        this.image = new createjs.Bitmap(queue.getResult("clouds"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.dx = 2;
        stage.addChild(this.image);
        this.reset();
    }

    reset() {
        this.image.x = 0;//this needs to be changed
    }

    update() {
        this.image.x -= this.dx;
        if (this.image.x <= -800) {
            this.reset();
        }
    }
}

// The Distance Utility Function
function distance(p1: createjs.Point, p2: createjs.Point): number {
    var firstPoint: createjs.Point;
    var secondPoint: createjs.Point;
    var theXs: number;
    var theYs: number;
    var result: number;

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
function elfAndBush(hitBush: Bush) {
    var point1: createjs.Point = new createjs.Point();
    var point2: createjs.Point = new createjs.Point();

    //var bush: Bush = new Bush();

    //bush = hitBush;

    point1.x = elf.image.x;
    point1.y = elf.image.y;
    point2.x = hitBush.image.x;
    point2.y = hitBush.image.y;
    if (distance(point1, point2) < ((elf.width * 0.5) + (hitBush.width * 0.5))) {
        createjs.Sound.play("leafHit");//the bush thud
        scoreboard.lives -= 1;
        hitBush.reset();
    }
}

// Check Collision between elfAndBunny
function elfAndBunny(hitBunny: Bunny) {
    var point1: createjs.Point = new createjs.Point();
    var point2: createjs.Point = new createjs.Point();

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
function elfAndApple(hitApple: Apple) {
    var point1: createjs.Point = new createjs.Point();
    var point2: createjs.Point = new createjs.Point();


    point1.x = elf.image.x;
    point1.y = elf.image.y;
    point2.x = hitApple.image.x;
    point2.y = hitApple.image.y;
    if (distance(point1, point2) < ((elf.width * 0.5) + (hitApple.width * 0.5))) {
        createjs.Sound.play("appleCrunch");
        scoreboard.score += 30;
        hitApple.reset();
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

    for (var count = 0; count < APPLE_NUM; count++) {
        elfAndApple(apples[count]);
    }
}





function mainGameStart(e): void {
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", gameLoop);

    stage.enableMouseOver(20);
    stage.cursor = 'none';

    stage.removeAllChildren();

    var point1: createjs.Point = new createjs.Point();
    var point2: createjs.Point = new createjs.Point();

    forest = new Forest();

    for (var count = 0; count < BUSH_NUM; count++) {
        bushes[count] = new Bush();
    }
    for (var count = 0; count < BUNNY_NUM; count++) {
        bunnies[count] = new Bunny();
    }

    for (var count = 0; count < APPLE_NUM; count++) {
        apples[count] = new Apple();
    }

    elf = new Elf();
    clouds = new Clouds();

    scoreboard = new Scoreboard();
    scoreboard.lives = PLAYER_LIVES;
    scoreboard.score = 0;
}