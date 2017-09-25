var myTank;
var myTanks = [];
var myObstacles = [];
var myScore;
var enemyBullets = [];
var bullet = [];
var enemyTanks = [];
var background;

// types:
// 0 - empty
// 1 - brick
// 2 - concrete
// 3 - grass

var map = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
        [0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
        [0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
        [0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
        [0,0,1,1,0,0,1,1,0,0,1,1,2,2,1,1,0,0,1,1,0,0,1,1,0,0],
        [0,0,1,1,0,0,1,1,0,0,1,1,2,2,1,1,0,0,1,1,0,0,1,1,0,0],
        [0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
        [0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0],
        [0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0],
        [1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1,1],
        [2,2,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,2,2],
        [0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,0,0,1,1,0,0,1,1,1,1,1,1,0,0,1,1,0,0,1,1,0,0],
        [0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
        [0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
        [0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
        [0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0],
        [0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0],
        [0,0,1,1,0,0,1,1,0,0,0,1,1,1,1,0,0,0,1,1,0,0,1,1,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0]
]


var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.leftBorder = 100;
        this.rightBorder = 490;
        this.topBorder = 100;
        this.bottomBorder = 490;
        this.workSpaceX = 390;
        this.workSpaceY = 390;
        this.enemyCount = 10;
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
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    },
    generateMap : function (mapSource) { 
        for (var i = 0; i < mapSource.length; i++) {
            var row = mapSource[i];
            for (var j = 0; j < row.length; j++) {
                var element = row[j];
                switch (element) {
                    case 0:
                    
                        break;
                    case 1:
                        myObstacles.push(new Obstacle(15, 15, "images/wall_brick.png", myGameArea.leftBorder + j*15, myGameArea.topBorder + i*15, 1))
                        break;
                    case 2:
                        myObstacles.push(new Obstacle(15, 15, "images/wall_concrete.png", myGameArea.leftBorder + j*15, myGameArea.topBorder + i*15, 2))
                        break;
                    default:
                        break;
                }
                
                
            }
            
        }
     }
}

function BackgroundAndScores(x, y, width, height) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function (livesCount = 3) {
        ctx = myGameArea.context;
        ctx.fillStyle = "#423C3C";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.font = "16px Arial";
        ctx.fillText("Lives: " + livesCount, x + width + 5,  y + height - 5)
        ctx.fillText("Enemies: " + myGameArea.enemyCount, x + width + 5,  y + 15)
    };
}

//PLAYER PLAYER PLAYER PLAYER PLAYER PLAYER PLAYER PLAYER PLAYER PLAYER
function PlayerTank(width, height, image, x, y, type) {
    this.type = type;
    this.lives = 3;
    this.image = new Image();
    this.image.src = image;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.direction = "up";
    this.update = function () {
        ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    this.newPos = function () {
        this.speedX = 0;
        this.speedY = 0;

        if (myGameArea.keys && myGameArea.keys[37]) { this.speedX = -1; this.image.src = "images/tank_player1_left_c0_t1.png"; this.direction = "left" };
        if (myGameArea.keys && myGameArea.keys[39]) { this.speedX = 1; this.image.src = "images/tank_player1_right_c0_t1.png"; this.direction = "right" };
        if (myGameArea.keys && myGameArea.keys[38]) { this.speedY = -1; this.image.src = "images/tank_player1_up_c0_t1.png"; this.direction = "up" };
        if (myGameArea.keys && myGameArea.keys[40]) { this.speedY = 1; this.image.src = "images/tank_player1_down_c0_t1.png"; this.direction = "down" };
        if (myGameArea.keys && myGameArea.keys[32]) { if (!this.fired) { this.shoot() }; };


        this.x += this.speedX;
        this.y += this.speedY;
        // this.hitBottom();
        // this.hitTop();
        // this.hitLeft();
        // this.hitRight();
        this.borderCheck();
    };
    this.borderCheck = function () {
        var borderBottom = myGameArea.bottomBorder - this.height;
        var borderTop = myGameArea.topBorder;
        var borderLeft = myGameArea.leftBorder;
        var borderRight = myGameArea.rightBorder - this.width;
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
function EnemyTank(width, height, image, position, type, startFrame) {
    switch (position) {
        case 0:
            this.x = myGameArea.leftBorder;
            this.y = myGameArea.topBorder;
            break;
        case 1:
            this.x = (myGameArea.leftBorder + myGameArea.rightBorder)/2 - width/2 ;
            this.y = myGameArea.topBorder;
            break;
        case 2:
            this.x = myGameArea.rightBorder - width;
            this.y = myGameArea.topBorder;
            break;
        default:
            this.x = myGameArea.leftBorder;
            this.y = myGameArea.topBorder;
            break;
    }
    this.type = type;
    this.startFrame = startFrame;
    this.image = new Image();
    this.image.src = image;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.direction = "none";
    this.update = function () {
        ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    this.newPos = function (col) {
        
        switch (this.direction) {
            case "none":
                this.startMove(myGameArea.frameNo);
                break;
            case "up":
                this.speedX = 0;
                this.speedY = -1;
                // this.speedY = 0;
                break;
            case "down":
                this.speedX = 0;
                this.speedY = 1;
                // this.speedY = 0;
                break;
            case "left":
                this.speedX = -1;
                // this.speedX = 0;
                this.speedY = 0;
                break;
            case "right":
                this.speedX = 1;
                // this.speedX = 0;
                this.speedY = 0;
                break;
            default:
                this.speedX = 0;
                this.speedY = 0;
                break;
        }
        if (this.direction != "none") {
            if (!this.fired) {
                this.shoot()
            };

        }

        // this.speedY = 1;
        if (col != "collided") {
            this.x += this.speedX;
            this.y += this.speedY;
        }
        // this.hitBottom();
        // this.hitTop();
        // this.hitLeft();
        // this.hitRight();
        // this.borderCheck();
    };
    this.borderCheck = function (object, i) {
        var borderBottom = myGameArea.bottomBorder - this.height;
        var borderTop = myGameArea.topBorder;
        var borderLeft = myGameArea.leftBorder;
        var borderRight = myGameArea.rightBorder - this.width;
        if (this.y > borderBottom) {
            this.y = borderBottom;
            this.speedX = 0;
            this.speedY = 0;
            this.defineDirection(this.direction );
            return "collided";
        } else if (this.y < borderTop) {
            this.y = borderTop;
            this.speedX = 0;
            this.speedY = 0;
            this.defineDirection(this.direction);
            return "collided";
        } else if (this.x < borderLeft) {
            this.x = borderLeft;
            this.speedX = 0;
            this.speedY = 0;
            this.defineDirection(this.direction);
            return "collided";
        } else if (this.x > borderRight) {
            this.x = borderRight;
            this.speedX = 0;
            this.speedY = 0;
            this.defineDirection(this.direction);
            return "collided";
        }

        for (var i = 0; i < object.length; i++) {
            if (typeof object[i] != "undefined") {
                if ((this.y < object[i].y + object[i].height) &&
                    (this.y + this.height > object[i].y) &&
                    (this.x + this.width > object[i].x) &&
                    (this.x < object[i].x + object[i].width)) {
                        this.speedX = 0;
                        this.speedY = 0;
                        this.defineDirection(this.direction);


                        return "collided";
                    }
                }
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
        enemyBullets.push(new Bullet(this));
        this.fired = true;
    }
    this.defineDirection = function (dir) {

        var dirNum;
        if (dir == "up") {
            dirNum = 0;
            
            (this.y != myGameArea.topBorder) && (this.y += 1);
        } else if (dir == "right") {
            dirNum = 1;
            this.x -= 1  
        } else if (dir == "down") {
            dirNum = 2;
            this.y -= 1;
        } else if (dir == "left") {
            dirNum = 3;
            this.x += 1;
        }

        do {
            var y = Math.floor(Math.random() * (4));
            
        } while (y == dirNum);


        
        switch (y) {
            case 0:
                this.direction = "up";
                this.image.src = "images/tank_basic_up_c0_t1.png";
                this.speedX = 0;
                
                this.speedY = -1;
                break;
            case 1:
                this.direction = "right";
                this.image.src = "images/tank_basic_right_c0_t1.png";
                this.speedX = 1;
                this.speedY = 0;
                break;
            case 2:
                this.direction = "down";
                this.image.src = "images/tank_basic_down_c0_t1.png";
                this.speedX = 0;
                this.speedY = 1;
                break;
            case 3:
                this.direction = "left";
                this.image.src = "images/tank_basic_left_c0_t1.png";
                this.speedX = -1;
                this.speedY = 0;
                break;
        }
    }
    this.startMove = function (currentFrame) {
        // if ((myGameArea.frameNo / n) % 1 == 0) {
        //     this.direction = "down";
        // }
        if ((currentFrame - this.startFrame) > 80) {
            this.direction = "down"
            this.speedY = 1;
        }
    }

}

//BULLET BULLET BULLET BULLET BULLET BULLET BULLET BULLET BULLET
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
            this.x = sender.x + (sender.width - this.width) / 2;
            this.y = sender.y;
            this.speedX = 0;
            this.speedY = -2;
            break;
        case "down":
            this.x = sender.x + (sender.width - this.width) / 2;
            this.y = sender.y + sender.height;
            this.speedX = 0;
            this.speedY = 2;
            break;
        case "left":
            this.x = sender.x;
            this.y = sender.y + (sender.height - this.height) / 2;
            this.speedX = -2;
            this.speedY = 0;
            break;
        case "right":
            this.x = sender.x + sender.width;
            this.y = sender.y + (sender.height - this.height) / 2;
            this.speedX = 2;
            this.speedY = 0;
            break;
        default:
            // this.x = sender.x + sender.width/2;
            // this.y = sender.y + sender.height;
            this.speedX = 0;
            this.speedY = -2;
            break;
    }
    this.update = function () {
        ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    this.newPos = function (object) {
        this.x += this.speedX;
        this.y += this.speedY;
        // // this.hitBottom();
        // // this.hitTop();
        // // this.hitLeft();
        // // this.hitRight();
        this.borderCheck(object);
    };
    this.borderCheck = function (i) {
        var borderBottom = myGameArea.bottomBorder - this.height;
        var borderTop = myGameArea.topBorder + this.height;
        var borderLeft = myGameArea.leftBorder + this.width;
        var borderRight = myGameArea.rightBorder - this.width;


        if (this.y > borderBottom) {
            (sender.type == "player") ? bullet.pop() : delete enemyBullets[i];
            sender.fired = false;
        } else if (this.y < borderTop) {
            (sender.type == "player") ? bullet.pop() : delete enemyBullets[i];
            sender.fired = false;
        } else if (this.x < borderLeft) {
            (sender.type == "player") ? bullet.pop() : delete enemyBullets[i];
            sender.fired = false;
        } else if (this.x > borderRight) {
            (sender.type == "player") ? bullet.pop() : delete enemyBullets[i];
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
    //переписать чтобы выдавал тру фолс и удалять на уровне апдейта экрана
    this.collisionCheck = function (object, number) {
        for (var i = 0; i < object.length; i++) {
            if (typeof object[i] != "undefined") {
                if ((this.y < object[i].y + object[i].height) &&
                    (this.y + this.height > object[i].y) &&
                    (this.x + this.width > object[i].x) &&
                    (this.x < object[i].x + object[i].width)) {
                    if (object[i].type == "enemy") {
                        bullet.pop();
                        sender.fired = false;
                        delete object[i];
                        myGameArea.enemyCount--;
                        if (myGameArea.enemyCount == 0) {
                            alert("YOU WIN");
                            document.location.reload();
                        }
                    } else if (object[i].type == "player") {
                        delete enemyBullets[number];
                        sender.fired = false;
                        object[i].lives--;
                        object[i].x = myGameArea.leftBorder + 160;
                        object[i].y = myGameArea.bottomBorder - object[i].height;
                        if (object[i].lives == 0) {
                            alert("GAME OVER");
                            document.location.reload();
                        }
                    } else if (object[i].type == "1" || object[i].type == "2") {
                        (sender.type == "player") ? bullet.pop() : delete enemyBullets[number];
                        sender.fired = false;
                        (object[i].type == "1" ) && delete object[i];

                    }
                }
            }
        }
    }

    // for (var i = 0; i < object.length; i++) {
    //     if (typeof object[i] != "undefined") {
    //         if ((this.y < object[i].y + object[i].height) &&
    //             (this.y > object[i].y) &&
    //             (this.x > object[i].x) &&
    //             (this.x < object[i].x + object[i].width)) {
    //             bullet.pop();
    //             sender.fired = false;
    //             delete object[i];
    //         }

    //     }       
    // }  


}

//OBSTACLES OBSTACLES OBSTACLES OBSTACLES OBSTACLES OBSTACLES 
function Obstacle(width, height, image, x, y, type) {
    this.type = type;
    this.image = new Image();
    this.image.src = image;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
}




function startGame() {
    myGameArea.start();
    myGameArea.generateMap(map);
    background = new BackgroundAndScores(myGameArea.leftBorder, myGameArea.topBorder, myGameArea.workSpaceX, myGameArea.workSpaceY);
    //myTank = new PlayerTank(30, 30, "images/tank_player1_up_c0_t1.png", 170, 470, "player")
    myTanks.push(new PlayerTank(29, 29, "images/tank_player1_up_c0_t1.png", myGameArea.leftBorder + 120, myGameArea.bottomBorder - 30, "player"))
    setTimeout(function () {
        for (var i = 0; i < 3; i++) {
            // enemyTanks.push(new EnemyTank(30, 30, "images/tank_basic_down_c0_t1.png", i*200, 0));

            if (typeof enemyTanks[i] == "undefined") {
                enemyTanks[i] = new EnemyTank(29, 29, "images/tank_basic_down_c0_t1.png", i, "enemy", myGameArea.frameNo);

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
    background.update(myTanks[0].lives);
    myGameArea.frameNo += 1;

    for (var i = 0; i < myObstacles.length; i++) {
        if (typeof myObstacles[i] != "undefined") {
            myObstacles[i].update();
        }
        
        
    }


    //myTank.newPos();
    //myTank.update();
    for (var i = 0; i < myTanks.length; i++) {
        myTanks[i].newPos();
        myTanks[i].update();
    }

    for (var i = 0; i < bullet.length; i++) {
        if (typeof bullet[i] != "undefined") {
            bullet[i].update();
            bullet[i].collisionCheck(myObstacles, i);
            
            if (typeof bullet[i] != "undefined") {
                bullet[i].newPos();
            }
        }
    }

    for (var i = 0; i < enemyBullets.length; i++) {
       
        if (typeof enemyBullets[i] != "undefined") {
            enemyBullets[i].update();
            enemyBullets[i].collisionCheck(myTanks, i);
            (typeof enemyBullets[i] != "undefined") && enemyBullets[i].collisionCheck(myObstacles, i);
            if (typeof enemyBullets[i] != "undefined") {
                enemyBullets[i].newPos(i);
            }

            
        }
    }



    for (var i = 0; i < enemyTanks.length; i++) {
        if (typeof enemyTanks[i] != "undefined") {
            enemyTanks[i].update();
            enemyTanks[i].newPos();
            enemyTanks[i].borderCheck(myObstacles);

            // (enemyTanks[i].borderCheck(myObstacles) != "collided") && enemyTanks[i].newPos();
            //enemyTanks[i].startMove(myGameArea.frameNo);
        } else {
            enemyTanks[i] = new EnemyTank(29, 29, "images/tank_basic_down_c0_t1.png", i, "enemy", myGameArea.frameNo)
        }
        for (var j = 0; j < bullet.length; j++) {
            bullet[j].collisionCheck(enemyTanks, j)
        }
    }
}