import platform from '../img/platform.png';
import hills from '../img/hills.png';
import background from '../img/background.png';
import platformSmallTall from '../img/platformSmallTall.png';


import spriteRunLeft from '../img/spriteRunLeft.png';
import spriteRunRight from '../img/spriteRunRight.png';
import spriteStandLeft from '../img/spriteStandLeft.png';
import spriteStandRight from '../img/spriteStandRight.png';

const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

function updateSize(obj, {
    height,
    width
}) {
    obj.height = height;
    obj.width = width;
}

updateSize(canvas, {
    height: innerHeight,
    width: innerWidth
});

const gravity = 1.0;
class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.width = 66;
        this.height = 150;
        this.speed = 6;
        this.jumpCount = 0;
        this.image = createImage(spriteStandRight);
        this.frames = 0;
        this.sprites = {
            stand: {
                right: createImage(spriteStandRight),
                left: createImage(spriteStandLeft),
                cropWidth: 177,
                width: 66
            },
            run: {
                right: createImage(spriteRunRight),
                left: createImage(spriteRunLeft),
                cropWidth: 341,
                width: 127.875
            }
        };

        this.currentSprite = this.sprites.stand.right;
        this.currentCropWidth = this.sprites.stand.cropWidth;
    };

    draw() {
        c.drawImage(
            this.currentSprite,
            this.currentCropWidth * this.frames,
            0,
            this.currentCropWidth,
            400,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    };

    update() {
        this.frames++;
        if (this.frames > 59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left)){
            this.frames = 0;
        }
        else if (this.frames > 29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left)){
            this.frames = 0;
        };

        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity;
        };
    };
};

class Platform {
    constructor({
        x,
        y,
        image
    }) {
        this.position = {
            x,
            y
        }

        this.image = image;

        this.width = this.image.width;
        this.height = this.image.height;
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class GenericObject {
    constructor({
        x,
        y,
        image
    }) {
        this.position = {
            x,
            y
        }

        this.image = image;

        this.width = this.image.width;
        this.height = this.image.height;
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
    }
}

class Background {
    constructor({
        x,
        y,
        image
    }) {
        this.position = {
            x,
            y
        }

        this.image = image;

        this.width = (innerWidth * 10);
        this.height = innerHeight;
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.width = (canvas.width * 10);
        this.height = canvas.height;

        this.draw();
    }
}

function createImage(imgSrc) {
    const image = new Image();
    image.src = imgSrc;
    return image
}

let platformImage = createImage(platform);
let hillsImage = createImage(hills);
let platformSmallTallImage = createImage(platformSmallTall);

let backgroundObj = new Background({
    x: -2,
    y: 0,
    image: createImage(background)
});

let genericObjects = [];

let player = new Player();

let platforms = [];


function init() {
    backgroundObj = new Background({
        x: -2,
        y: 0,
        image: createImage(background)
    });

    genericObjects = [new GenericObject({
        x: -1,
        y: (innerHeight - (hillsImage.height - 10)),
        image: hillsImage
    })];

    player = new Player();

    platforms = [
        new Platform({
            x: platformImage.width * 4 + 298 + platformImage.width - platformSmallTallImage.width,
            y: canvas.height - (platformSmallTallImage.height * 1.5),
            image: platformSmallTallImage
        }),
        new Platform({
            x: -1,
            y: canvas.height - platformImage.height,
            image: platformImage
        }),
        new Platform({
            x: platformImage.width - 3,
            y: canvas.height - platformImage.height,
            image: platformImage
        }),
        new Platform({
            x: platformImage.width * 2 + 100,
            y: canvas.height - platformImage.height,
            image: platformImage
        }),
        new Platform({
            x: platformImage.width * 3 + 300,
            y: canvas.height - platformImage.height,
            image: platformImage
        }),
        new Platform({
            x: platformImage.width * 4 + 298,
            y: canvas.height - platformImage.height,
            image: platformImage
        }),
        new Platform({
            x: platformImage.width * 5 + 698,
            y: canvas.height - platformImage.height,
            image: platformImage
        })
    ];
};


let lastKey;
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
};

let scrollOffset = 0;

function animate() {
    requestAnimationFrame(animate);

    updateSize(canvas, {
        height: innerHeight,
        width: innerWidth
    });

    c.clearRect(0, 0, canvas.width, canvas.height);

    backgroundObj.update();

    genericObjects.forEach((obj) => {
        obj.draw();
    });



    platforms.forEach((platform) => {
        platform.draw();
    })

    player.update();

    if (keys.right.pressed && player.position.x < (canvas.height / 2)) {
        player.velocity.x = player.speed;
    } else if ((keys.left.pressed && player.position.x >= 100) ||
               (keys.left.pressed  && scrollOffset === 0 && player.position.x > 0)) {
        player.velocity.x = -player.speed;
    } else {
        player.velocity.x = 0;

        //movimento do mapa
        if (keys.right.pressed) {
            scrollOffset += 5;
            platforms.forEach((platform) => {
                platform.position.x -= player.speed;
            });
            genericObjects.forEach((obj) => {
                obj.position.x -= player.speed * 0.66;
            });

            backgroundObj.position.x -= player.speed * 0.66;;
        } else if (keys.left.pressed  && scrollOffset > 0 ) {
            scrollOffset -= 5;
            platforms.forEach((platform) => {
                platform.position.x += player.speed;
            });
            genericObjects.forEach((obj) => {
                obj.position.x += player.speed * 0.66;
            });

            backgroundObj.position.x -= player.speed * 0.66;
        }
    }

    platforms.forEach((platform) => {
        //collisão com a plataforma
        if (player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0;
            player.jumpCount = 0;
        }
    });

    if (keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.run.right){
        //player.frames = 1;
        player.currentSprite = player.sprites.run.right;
        player.currentCropWidth = player.sprites.run.cropWidth;
        player.width = player.sprites.run.width;
    } else if (keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.run.left){
        //player.frames = 1;
        player.currentSprite = player.sprites.run.left;
        player.currentCropWidth = player.sprites.run.cropWidth;
        player.width = player.sprites.run.width;
    } else if (!keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.stand.left){
        player.frames = 1;
        player.currentSprite = player.sprites.stand.left;
        player.currentCropWidth = player.sprites.stand.cropWidth;
        player.width = player.sprites.stand.width;
    } else if (!keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.stand.right){
        player.frames = 1;
        player.currentSprite = player.sprites.stand.right;
        player.currentCropWidth = player.sprites.stand.cropWidth;
        player.width = player.sprites.stand.width;
    };

    // condição para caso o jogador ganhar
    if (scrollOffset > 2000) {
        console.log('you win');
    }

    //condição caso o jogador perca
    if (player.position.y > canvas.height) {
        console.log('you lose!');
        init();
    }
};

init();
animate();

addEventListener('keydown', ({
    keyCode
}) => {
    switch (keyCode) {
        case 65:
            console.log('left');
            keys.left.pressed = true;
            lastKey = 'left';
            break;
        case 83:
            console.log('down');
            break;
        case 68:
            console.log('right');
            keys.right.pressed = true;
            lastKey = 'right';
            break;
        case 87:
            console.log('up');
            if(player.jumpCount < 2) {
                player.velocity.y = -20;
                player.jumpCount += 1;
            };
            break;
    }
});

addEventListener('keyup', ({
    keyCode
}) => {
    switch (keyCode) {
        case 65:
            console.log('left');
            keys.left.pressed = false;
            break;
        case 83:
            console.log('down');
            break;
        case 68:
            console.log('right');
            keys.right.pressed = false;
            break;
        case 87:
            console.log('up');
            break;
    }
});