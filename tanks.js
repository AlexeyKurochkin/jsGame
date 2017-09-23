var myTank;
var myObstacles = [];
var myScore;
var enemyBullets = [];
var bullet = [];
var enemyTanks = [];

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width =400;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        document.addEventListener("keydown", function (e) { 
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
            this.fired = true;
            
         });
        document.addEventListener("keyup", function (e) {
            myGameArea.keys[e.keyCode] = false;
            this.fired = false;
         });
        document.addEventListener("mousedown", function (e) {
            // myGamePiece.gravity = -0.2;
         });
        document.addEventListener("mouseup", function (e) {
            // myGamePiece.gravity = 0.1;
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

//PLAYER PLAYER PLAYER PLAYER PLAYER PLAYER PLAYER PLAYER PLAYER PLAYER
function PlayerTank(width, height, image, x, y, type) {
    this.type = type;
    this.image = new Image();
    this.image.src = image;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.direction = "up";
    this.update = function() { 
        ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    this.newPos = function() { 
        this.speedX = 0;
        this.speedY = 0;

        if (myGameArea.keys && myGameArea.keys[37]) {this.speedX = -1; this.image.src = "images/tank_player1_left_c0_t1.png"; this.direction = "left"};
        if (myGameArea.keys && myGameArea.keys[39]) {this.speedX = 1; this.image.src = "images/tank_player1_right_c0_t1.png"; this.direction = "right"};
        if (myGameArea.keys && myGameArea.keys[38]) {this.speedY = -1; this.image.src = "images/tank_player1_up_c0_t1.png"; this.direction = "up"};
        if (myGameArea.keys && myGameArea.keys[40]) {this.speedY = 1; this.image.src = "images/tank_player1_down_c0_t1.png"; this.direction = "down"};
        if (myGameArea.keys && myGameArea.keys[32]) {if (!this.fired) {this.shoot()};};
            

        this.x += this.speedX;
        this.y += this.speedY;
        // this.hitBottom();
        // this.hitTop();
        // this.hitLeft();
        // this.hitRight();
        this.borderCheck();
    };
    this.borderCheck = function() { 
        var borderBottom = myGameArea.canvas.height - this.height;
        var borderTop = 0;
        var borderLeft = 0;
        var borderRight = myGameArea.canvas.width - this.width;
        if (this.y > borderBottom) {
           this.y = borderBottom; 
        } else if (this.y < borderTop) {
            this.y = borderTop;
        } else if (this.x < borderLeft) {
            this.x = borderLeft;
        } else if (this.x > borderRight) {
            this.x = borderRight;
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
    this.shoot = function () { 
        bullet.push(new Bullet(this));
        this.fired = true;
     }
}

//ENEMY ENEMY ENEMY ENEMY ENEMY ENEMY ENEMY ENEMY ENEMY ENEMY ENEMY ENEMY
function EnemyTank(width, height, image, position, type) {
    switch (position) {
        case 0:
            this.x = 0;
            this.y = 0;
            break;
        case 1:
            this.x = (myGameArea.canvas.width - width)/2;
            this.y = 0;
            break;
        case 2:
            this.x = myGameArea.canvas.width - width;
            this.y = 0;
            break;
        default:
            this.x = 0;
            this.y = 0;
            break;
    }
    this.type = type;
    this.image = new Image();
    this.image.src = image;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.direction = "down";
    this.update = function() { 
        ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    this.newPos = function() { 
        switch (this.direction) {
            case "up":
                this.speedX = 0;
                this.speedY = -1;
                break;
            case "down":
                this.speedX = 0;
                this.speedY = 1;
                break;
            case "left":
                this.speedX = -1;
                this.speedY = 0;
                break;
            case "right":
                this.speedX = 1;
                this.speedY = 0;
                break;
            default:
                this.speedX = 0;
                this.speedY = -1;
                break;
        }
        // this.speedY = 1;

        this.x += this.speedX;
        this.y += this.speedY;
        // this.hitBottom();
        // this.hitTop();
        // this.hitLeft();
        // this.hitRight();
        this.borderCheck();
    };
    this.borderCheck = function() { 
        var borderBottom = myGameArea.canvas.height - this.height;
        var borderTop = 0;
        var borderLeft = 0;
        var borderRight = myGameArea.canvas.width - this.width;
        if (this.y > borderBottom) {
           this.y = borderBottom; 
           this.defineDirection();
        } else if (this.y < borderTop) {
            this.y = borderTop;
            this.defineDirection();
        } else if (this.x < borderLeft) {
            this.x = borderLeft;
            this.defineDirection();
        } else if (this.x > borderRight) {
            this.x = borderRight;
            this.defineDirection();
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
    this.shoot = function () { 
        bullet.push(new Bullet(this));
        this.fired = true;
     }
    this.defineDirection = function () { 
        var x = Math.floor(Math.random() * (3));
            switch (x) {
                case 0:
                    this.direction = "up";
                    this.image.src = "images/tank_basic_up_c0_t1.png"
                    break;
                case 1:
                    this.direction = "right";
                    this.image.src = "images/tank_basic_right_c0_t1.png"
                    break;
                case 2:
                    this.direction = "down";
                    this.image.src = "images/tank_basic_down_c0_t1.png"
                    break;
                case 3:
                    this.direction = "left";
                    this.image.src = "images/tank_basic_left_c0_t1.png"
                    break;
            }
     }
}

function Bullet(sender) {
    this.type = sender.type;
    this.image = new Image();
    this.image.src = "images/tank_player1_up_c0_t1.png";
    this.width = 4;
    this.height = 4;
    this.x = sender.x;
    this.y = sender.y;
    this.speedX = 0;
    this.speedY = -2;
    this.direction = sender.direction;
    switch (this.direction) {
        case "up":
            this.x = sender.x + sender.width/2;
            this.y = sender.y;
            this.speedX = 0;
            this.speedY = -2;
            break;
        case "down":
            this.x = sender.x + sender.width/2;
            this.y = sender.y + sender.height;
            this.speedX = 0;
            this.speedY = 2;
            break;
        case "left":
            this.x = sender.x;
            this.y = sender.y + sender.height/2;
            this.speedX = -2;
            this.speedY = 0;
            break;
        case "right":
            this.x = sender.x + sender.width;
            this.y = sender.y + sender.height/2;
            this.speedX = 2;
            this.speedY = 0;
            break;
        default:
            this.speedX = 0;
           this.speedY = -2;
            break;
    }
    this.update = function() { 
        ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    this.newPos = function() { 
        this.x += this.speedX;
        this.y += this.speedY;
        // // this.hitBottom();
        // // this.hitTop();
        // // this.hitLeft();
        // // this.hitRight();
        this.borderCheck();
    };
    this.borderCheck = function() { 
        var borderBottom = myGameArea.canvas.height - this.height;
        var borderTop = 0 + this.height;
        var borderLeft = 0 + this.width;
        var borderRight = myGameArea.canvas.width - this.width;
        if (this.y > borderBottom) {
            bullet.pop();
            sender.fired = false;
        } else if (this.y < borderTop) {
            bullet.pop();
            sender.fired = false;
        } else if (this.x < borderLeft) {
            bullet.pop();
            sender.fired = false;
        } else if (this.x > borderRight) {
            bullet.pop();
            sender.fired = false;
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





function startGame() {
    myGameArea.start();
    myTank = new PlayerTank(30, 30, "images/tank_player1_up_c0_t1.png", 170, 470)

    setTimeout(function() {
        for (var i = 0; i < 3; i++) {
            // enemyTanks.push(new EnemyTank(30, 30, "images/tank_basic_down_c0_t1.png", i*200, 0));

            if (typeof enemyTanks[i] == "undefined") {
                enemyTanks[i] = new EnemyTank(30, 30, "images/tank_basic_down_c0_t1.png", i);
            }
            
        }
    }, 1000);

    
    // enemyTank1 = new EnemyTank(30, 30, "images/tank_basic_down_c0_t1.png", 1, 1)

    // myGamePiece = new Component(30, 30, "red", 10, 120);
    // myGamePiece = new Component(30, 30, "tank_player1_right_c0_t1.png", 10, 120, "image");
    // myObstacle = new Component(10, 200, "green", 300, 120);
    // myScore = new Component("30px", "Consolas", "black", 280, 40, "text");
}

function updateGameArea() {
    myGameArea.clear();
    myTank.newPos();
    myTank.update();
    for (var i = 0; i < bullet.length; i++) {
        bullet[i].update();
        bullet[i].newPos();
        
    }

    for (var i = 0; i < enemyTanks.length; i++) {
        enemyTanks[i].update();
        enemyTanks[i].newPos();
    }   
    

    if (typeof enemyTank1 != "undefined") {
        enemyTank1.newPos();
        enemyTank1.update();
        
    }

}