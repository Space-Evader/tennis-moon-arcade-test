const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('ball', 'assets/ball.png');
    this.load.image('paddle', 'assets/paddle.png');
    this.load.image('background', 'assets/background.png');
    this.load.image('speedBoost', 'assets/speedBoost.png');
    this.load.image('shield', 'assets/shield.png');
    this.load.image('multiBall', 'assets/multiBall.png');
    this.load.image('enemy', 'assets/enemy.png');
}

function create() {
    this.add.image(400, 300, 'background');

    // Ball setup
    this.ball = this.physics.add.image(400, 300, 'ball');
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1);
    this.ball.setVelocity(150, 150);

    // Paddle setup
    this.paddle1 = this.physics.add.image(50, 300, 'paddle').setImmovable();
    this.paddle2 = this.physics.add.image(750, 300, 'paddle').setImmovable();
    this.paddle1.body.collideWorldBounds = true;
    this.paddle2.body.collideWorldBounds = true;

    // Input setup
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({ 
        up: Phaser.Input.Keyboard.KeyCodes.W, 
        down: Phaser.Input.Keyboard.KeyCodes.S 
    });

    // Collisions
    this.physics.add.collider(this.ball, this.paddle1);
    this.physics.add.collider(this.ball, this.paddle2);

    // Add enemies
    this.enemies = this.physics.add.group({
        key: 'enemy',
        repeat: 5,
        setXY: { x: 200, y: 100, stepX: 100 }
    });

    this.physics.add.collider(this.ball, this.enemies, hitEnemy, null, this);

    // Add power-ups
    this.powerUps = this.physics.add.group();
    this.time.addEvent({
        delay: 5000,
        callback: addPowerUp,
        callbackScope: this,
        loop: true
    });

    this.physics.add.collider(this.ball, this.powerUps, collectPowerUp, null, this);
}

function update() {
    // Paddle movement
    if (this.cursors.up.isDown) {
        this.paddle2.setVelocityY(-300);
    } else if (this.cursors.down.isDown) {
        this.paddle2.setVelocityY(300);
    } else {
        this.paddle2.setVelocityY(0);
    }

    if (this.wasd.up.isDown) {
        this.paddle1.setVelocityY(-300);
    } else if (this.wasd.down.isDown) {
        this.paddle1.setVelocityY(300);
    } else {
        this.paddle1.setVelocityY(0);
    }
}

function hitEnemy(ball, enemy) {
    enemy.destroy();
}

function addPowerUp() {
    const x = Phaser.Math.Between(100, 700);
    const y = Phaser.Math.Between(100, 500);
    const powerUpType = Phaser.Math.Between(1, 3);

    let powerUp;
    if (powerUpType === 1) {
        powerUp = this.powerUps.create(x, y, 'speedBoost');
    } else if (powerUpType === 2) {
        powerUp = this.powerUps.create(x, y, 'shield');
    } else {
        powerUp = this.powerUps.create(x, y, 'multiBall');
    }
}

function collectPowerUp(ball, powerUp) {
    powerUp.destroy();
    // Apply power-up effect
}
