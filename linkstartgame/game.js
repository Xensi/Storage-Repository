
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.spritesheet('link', 'assets/FDspriteSheet_LnR.png', 75, 70);
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('bomb', 'assets/bomb.png', 20, 20);
    game.load.spritesheet('explosion, explosion.png', 92, 80);
    
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();
}

var player;

function create() {
    
    //camera settings and world size
    game.camera.follow(player);
    game.world.setBounds(0, 0, 800, 600);
    game.stage.smoothed=false;
    
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    var sky = game.add.sprite(0, 0, 'sky');
    sky.scale.setTo(2, 2);

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;
    
    ledge = platforms.create(-150, 300, 'ground');
    ledge.body.immovable = true;

    //The player and its settings
    
    player = game.add.sprite(200, game.world.height-250, 'link');
    player.scale.setTo(2, 2);
    //enabling physics on the player
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    
    //our run animation (with 6 frames and running at 10 fps)
    var runright = player.animations.add('runright', [1, 2, 3, 4, 5, 6], 10, true);
    
    var runleft = player.animations.add('runleft', [28, 27, 26, 25, 24, 23], 10, true);
    
    //  //Bomb group
    // bombs = game.add.group();
    // bombs.enableBody = true;

    //     //bombs you can pick up
    //     bombItem = bombs.create(70, 250, 'bomb');
    //     bombItem.body.gravity.y = 300;
    //     bombItem.body.bounce.y = 0.5;
    //     bombItem.scale.setTo(2, 2);
    //     bombItem.body.setSize(12, 12, 15, 14);
        
    //     heldBomb = bombs.create(player.body.x += 50, player.body.y, 'bomb');
    //     heldBomb.body.gravity.y = 300;
    //     heldBomb.scale.setTo(2, 2);
    //     heldBomb.body.setSize(18, 50, 7, 24);
    //     heldBomb.body.collideWorldBounds = true;

        
    //     thrownBomb = bombs.create(player.body.x, player.body.y, 'bomb');
    //     thrownBomb.scale.setTo(2, 2);
    //     thrownBomb.body.setSize(12, 12, 15, 14);
    //     thrownBomb.body.gravity.y = 300;
    //     thrownBomb.body.bounce.y = 0.5;
    
        
    // var bombSparks = thrownBomb.animations.add('fuse', [1, 2, 3], 10, true);
    // var bombExploding = thrownBomb.animations.add('fireinthehole', [4, 5, 6, 1, 2, 3], 10, true);
    

    
    // bombDisplay = game.add.text(16, 16, 'Bombs: 0', { fontSize: '32px', fill: '#000' });

    
    
         //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    this.wasd = {
                up: game.input.keyboard.addKey(Phaser.Keyboard.W),
                down: game.input.keyboard.addKey(Phaser.Keyboard.S),
                left: game.input.keyboard.addKey(Phaser.Keyboard.A),
                right: game.input.keyboard.addKey(Phaser.Keyboard.D),
                
                V: game.input.keyboard.addKey(Phaser.Keyboard.V),
            };
   
   
}

function update() {

    
    if (loadingframe == 0 && player.frame != 0){
        player.frame = 0;
        loadingframe = 1;
        player.body.setSize(18, 50, 57, 24);
        player.body.reset(player.x, player.y);
    }
    // game.physics.arcade.input(this.wasd.V.keyDown)
    
    // if (bombTimer > 200){
    // thrownBomb.animations.play('fuse');
    // }
    // else{
    // thrownBomb.animations.play('fireinthehole');
    // }
    // if (bombTimer == 0){
    //     thrownBomb.exists = false;
    //     bombTimer = 100;
    // }
    
    // bombTimer -= 1;
    
    
    
    
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.collide(bombs, platforms);
 //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, bombItem, collectBomb, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    heldBomb.body.velocity.x = 0;

    
    if (this.wasd.left.isDown && usingBomb == 0)
    {
        //  Move to the left
        movingl = 29;
        movingr = null;
        player.body.velocity.x = -350;
        player.animations.play('runleft');
        heldBomb.body.velocity.x = -350;
    }
    else if (this.wasd.right.isDown && usingBomb == 0)
    {
        
        //  Move to the right
        movingl = null;
        movingr = 0;
        player.body.velocity.x = 350;
        player.animations.play('runright');
        heldBomb.body.velocity.x = 350;
    }
    else
    {
        //  Stand still
        player.animations.stop();
        
        player.frame = movingl + movingr;
    
    }
    
    
    
    
    //  Allow the player to jump if they are touching the ground.
    if (this.wasd.up.isDown && player.body.touching.down) {
        
        player.body.velocity.y = -800;
        heldBomb.body.velocity.y = -800;
    }
    //  Modifying goingdownex causes the player to go down slower or higher. It also increases or decreases the arc of their jump,
    //  which wasn't intentional. I know an easy fix, but I'll do it later.
    var goingdownex = 0;
    
   if (player.body.velocity.y < 600){
      goingdownex += 30;
      
      player.body.velocity.y += goingdownex;
      heldBomb.body.velocity.y += goingdownex;
     
      
   }
   else (null);
}

// function collectBomb (player, bombItem) {
    
//     bombItem.exists = false;
//     bombNum += 1;
//     bombDisplay.text = 'Bombs: ' + bombNum;
// }

function render () {
    game.debug.body(player);
    // game.debug.body(heldBomb);
    //game.debug.body(bombItem);
    //game.debug.body(thrownBomb);
}