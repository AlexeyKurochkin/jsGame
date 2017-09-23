var myGamePiece;
var myObstacles = [];
var myScore;


var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        document.addEventListener("keydown", function (e) { 
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;   
         });
        document.addEventListener("keyup", function (e) {
            myGameArea.keys[e.keyCode] = false;
            
         });
        document.addEventListener("mousedown", function (e) {
            myGamePiece.gravity = -0.2;
         });
        document.addEventListener("mouseup", function (e) {
            myGamePiece.gravity = 0.1;
         });

        // window.addEventListener("mousemove", function (e) { 
        //     //надо добавить оффсеты
        //     myGameArea.x = e.pageX - myGameArea.canvas.offsetLeft;
        //     myGameArea.y = e.pageY - myGameArea.canvas.offsetTop;
        //  });
    },
    clear: function() { 
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function() { 
        clearInterval(this.interval);
    }
}

function Component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    //Gravity
    this.gravity = 0.05;
    this.gravitySpeed = 0;
    this.update = function() { 
        // this.newPos();
        ctx = myGameArea.context;
        if (type == "image") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);    
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
    this.newPos = function() { 
        //Gravity
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();

    };
    this.hitBottom = function() { 
        var rockBottom = myGameArea.canvas.height - this.height;
        if (this.y > rockBottom) {
           this.y = rockBottom; 
        }
     }
    this.crashWith = function (otherObj) { 
        var myLeft = this.x;
        var myRight = this.x + this.width;
        var myTop = this.y;
        var myBottom = this.y + this.height;
        var otherLeft = otherObj.x;
        var otherRight = otherObj.x + otherObj.width;
        var otherTop = otherObj.y;
        var otherBottom = otherObj.y + otherObj.height;
        var crash = true;
        if ((myBottom < otherTop) || 
            (myTop > otherBottom) ||
            (myLeft > otherRight) ||
            (myRight < otherLeft)) {
            crash = false;
        }
        return crash;
     }
}

function everyInterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0)  {
        return true;
    }
    return false;
}

function startGame() {
    myGameArea.start();
    // myGamePiece = new Component(30, 30, "red", 10, 120);
    myGamePiece = new Component(30, 30, "tank_player1_right_c0_t1.png", 10, 120, "image");
    myObstacle = new Component(10, 200, "green", 300, 120);
    myScore = new Component("30px", "Consolas", "black", 280, 40, "text");
}

function updateGameArea() {
    var x, y, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (var i = 0; i < myObstacles.length; i++) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();      
            return;
        } 
    }
    myGameArea.clear();

    // myGamePiece.x += 1;
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyInterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight - minHeight + 1) + minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap - minGap + 1) + minGap);
        y = myGameArea.canvas.height - 200;
        myObstacles.push(new Component(10, height, "green", x, 0));
        myObstacles.push(new Component(10, x - height - gap, "blue", x, height + gap));
    }
    for (var i = 0; i < myObstacles.length; i++) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
        
    }
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    // if (myGameArea.x && myGameArea.y) {
    //     myGamePiece.x = myGameArea.x;
    //     myGamePiece.y = myGameArea.y;
    // }
    if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -1; myGamePiece.image.src = "tank_player1_left_c0_t1.png"}
    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 1; myGamePiece.image.src = "tank_player1_right_c0_t1.png"}
    if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY = -1;}
    if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 1;}
    
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();
   
    myGamePiece.newPos();
    myObstacle.x += -1;

    myGamePiece.update();
    myObstacle.update();

    
}






