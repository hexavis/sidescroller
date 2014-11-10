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

// Game Constants
var BUSH_NUM: number = 3;
var BUNNY_NUM: number = 3;
var APPLE_NUM: number = 1;
var GAME_FONT: string = "40px Consolas";//change
var FONT_COLOUR: string = "#FFFF00";//change
var PLAYER_LIVES: number = 3;

function preload(): void {
    queue = new createjs.LoadQueue();
    queue.installPlugin(createjs.Sound);
    queue.addEventListener("complete", init);
    queue.loadManifest([
        { id: "elf", src: "images/elf.gif" },
        { id: "forest", src: "images/background.png" },
        { id: "bush", src: "images/bush1.png" },
        { id: "bunny", src: "images/bunny.gif" },
        { id: "apple", src: "images/apple.png" },
        { id: "clouds", src: "images/clouds.png" },
        //sounds
        { id: "main", src: "sounds/piano.mp3" },
        { id: "leafHit", src: "sounds/leafHit.wav" },
        { id: "arrowHit", src: "sounds/leather.wav" },
        { id: "thud", src: "sounds/thud.wav" }
    ]);
}

function init(): void {
    stage = new createjs.Stage(document.getElementById("canvas"));
    stage.enableMouseOver(20);
    stage.cursor = 'none';

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", gameLoop);
    gameStart();
}

// Game Loop
function gameLoop(event): void {
    forest.update();
    clouds.update();
    elf.update();

    if (bushes.length > 3) {
        bushes.pop();
    }
    if (bunnies.length > 3) {
        bunnies.pop();
    }
    if (apples.length > 3) {
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
    image: createjs.Bitmap;
    width: number;
    height: number;
    constructor() {
        this.image = new createjs.Bitmap(queue.getResult("elf"));
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
    image: createjs.Bitmap;
    width: number;
    height: number;
    dy: number;
    dx: number;
    constructor() {
        this.image = new createjs.Bitmap(queue.getResult("bunny"));
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

    var bush: Bush = new Bush();

    bush = hitBush;

    point1.x = elf.image.x;
    point1.y = elf.image.y;
    point2.x = bush.image.x;
    point2.y = bush.image.y;
    if (distance(point1, point2) < ((elf.width * 0.5) + (bush.width * 0.5))) {
        createjs.Sound.play("leafHit");//the bush thud
        scoreboard.lives -= 1;
        bush.reset();
    }
}

// Check Collision between elfAndBunny
function elfAndBunny(hitBunny: Bunny) {
    var point1: createjs.Point = new createjs.Point();
    var point2: createjs.Point = new createjs.Point();
    var bunny: Bunny = new Bunny();

    bunny = hitBunny;

    point1.x = elf.image.x;
    point1.y = elf.image.y;
    point2.x = bunny.image.x;
    point2.y = bunny.image.y;
    if (distance(point1, point2) < ((elf.width * 0.5) + (bunny.width * 0.5))) {
        createjs.Sound.play("thud");
        scoreboard.lives -= 1;
        scoreboard.score -= 50;
        bunny.reset();
    }
}

// Check Collision between elfAndApple
function elfAndApple(hitApple: Apple) {
    var point1: createjs.Point = new createjs.Point();
    var point2: createjs.Point = new createjs.Point();
    var apple: Apple = new Apple();

    apple = hitApple;

    point1.x = elf.image.x;
    point1.y = elf.image.y;
    point2.x = apple.image.x;
    point2.y = apple.image.y;
    if (distance(point1, point2) < ((elf.width * 0.5) + (apple.width * 0.5))) {
        createjs.Sound.play("leafHit");
        scoreboard.score += 30;
        apple.reset();
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


class Scoreboard {
    label: createjs.Text;
    labelString: string = "";
    lives: number = PLAYER_LIVES;
    score: number = 0;
    width: number;
    height: number;
    constructor() {
        this.label = new createjs.Text(this.labelString, GAME_FONT, FONT_COLOUR);
        this.update();
        this.width = this.label.getBounds().width;
        this.height = this.label.getBounds().height;

        stage.addChild(this.label);
    }

    update() {
        this.labelString = "Lives: " + this.lives.toString() + " Score: " + this.score.toString();
        this.label.text = this.labelString;
    }

}

// Main Game Function
function gameStart(): void {

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

    var mainTune = createjs.Sound.play("main", { loop: 1000 });
    mainTune.addEventListener("loop", handleLoop);
    mainTune.volume = mainTune.volume * 0.2;

    function handleLoop(event) {
      //loop the music
    }
}