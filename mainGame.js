/*!
 * mainGame.js
 * Author: Lutz Kellen - http://lutzkellen.com/
 * Last Modified: 5-5-2016
 * Additional Authors: Marko Vehmas (4-25-2016)
 * Dungeon Delver Rodney Main Program Code
 */

/* TILE NUMBERS
0 = empty
1 = wall
2 = player
3 = monster (normal)
4 = gold
5 = potion
6 = prize (UNUSED - not created in map generation)
7 = stairs up (UNUSED not created in map generation)
8 = stairs down
*/

var CANVAS_GAME_ID    = "canvasID";
var WORLD_WIDTH 	  = 960;
var WORLD_HEIGHT	  = 640;
var MAX_ENEMIES 	  = 10;
var MAX_GOLD		  = 8;
var MAX_POTIONS		  = 5;
//Arrays
var rooms = []; //Value can be 0, 1, or 2. 0: Empty, not created. 1: 7x3 Room. 2: 4x3 Room
var map1 = []; //Stores all tiles, can be 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
var map2 = [];
var map3 = [];
var map4 = [];
var map5 = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]; //a row of walls for the last line so the bottom of the map won't be left open/empty
var cMap = [];
var enemyLocationsArray = [];
//In order: Empty, Wall, Player, Enemy, Gold, Potion, Prize, -Upstairs-, Downstairs, Doorway
//Image File Names
PLAYER_IMG_SRC  	= 'images/playerImg.png';
WALL_IMG_SRC 		= 'images/wall2Img.png';
ENEMY_IMG_SRC 	 	= 'images/enemyImg.png';
POTION_IMG_SRC 	 	= 'images/healthPotionImg.png';
GOLD_IMG_SRC 		= 'images/goldImg.png'; 		//currently unused
PRIZE_IMG_SRC 	 	= 'images/prizeImg.png';  		//currently unused
//UPSTAIRS_IMG_SRC 	= 'images/upStairsImg.png';
//CHEST_OPEN_IMG_SRC= 'images/openChestImg.png';
DOWNSTAIRS_IMG_SRC 	= 'images/downStairsImg.png';
HEALTHBAR_IMG_SRC	= 'images/statHealth.png';


/*
Instead of drawing the images, draw squares of same size. All different colors.
Capture this image. Same it as an image, examples might be online. This will give me an RGB Alpha array for every pixel.
x = 0;
y = 0;
for( i = 0; i < width; i+=32 ) {
	y = 0;
	for( j = 0; j < heightl j+=32 ) {
		if( data[i][j] == wallColor ) {
			newMap[x][y] = 1; //DO SOME MATH VOODOO FOR [][]
			//I AND J ARE GOING TO BE i+(j*w)
			//[x][y] are going to be X+Y*30
 		} else if( other color ) {
			
		} 
		y++;
	}
	x++;
}
*/

var Player = {
	name: 	"player",
	img:	PLAYER_IMG_SRC,
	pos:	0,
	health:	100,
	maxHealth: 100,
	
	//Player movement
	movePlayer: function(dir) {
		switch(dir) {
			case "left":
				cMap[this.pos] = 0;
				cMap[this.pos-1] = 2;
				this.pos -= 1;
				break;
			case "right":
				cMap[this.pos] = 0;
				cMap[this.pos+1] = 2;
				this.pos += 1;
				break;
			case "up":
				cMap[this.pos] = 0;
				cMap[this.pos-30] = 2;
				this.pos -= 30;
				break;
			case "down":
				cMap[this.pos] = 0;
				cMap[this.pos+30] = 2;
				this.pos += 30;
				break;
		}
	},
	
	//Collision detection
	collisionCheck : function(dir) {
		if( dir === "left" ) {
			switch( cMap[this.pos - 1] ) {
				case 0:
					return false;
				case 1:
					return true;
				case 3:
					//ATTACK
					theGame.KillEnemy(this.pos - 1);
					return true;
				case 4:
					//GET GOLD
					return false;
				case 5:
					//HEAL
					return false;
				case 7:
					return true;
				case 8:
					//GO DOWNSTAIRS (REGEN ROOM)
					enemyLocationsArray = []; //Empty the enemy locations array so unkilled enemies from last floor don't appear in the next floor.
					theGame.GenerateMap();
					theGame.GenerateActors();
					theGame.CombineMaps();
					//cMap[119] = 1;
					return true;
				default: console.info("ERROR: Collision Check Player Left"); break;
			}
		} else if( dir === "right" ) {
			switch( cMap[this.pos + 1] ) {
				case 0:
					return false;
				case 1:
					return true;
				case 3:
					//ATTACK
					theGame.KillEnemy(this.pos + 1);
					return true;
				case 4:
					//GET GOLD
					return false;
				case 5:
					//HEAL
					return false;
				case 7:
					return true;
				case 8:
					//GO DOWNSTAIRS (REGEN ROOM)
					enemyLocationsArray = []; //Empty the enemy locations array so unkilled enemies from last floor don't appear in the next floor.
					theGame.GenerateMap();
					theGame.GenerateActors();
					theGame.CombineMaps();
					//cMap[119] = 1;
					return true;
				default: console.info("ERROR: Collision Check Player Right"); break;
			}
		} else if( dir === "up" ) {
			switch( cMap[this.pos - 30] ) {
				case 0:
					return false;
				case 1:
					return true;
				case 3:
					//ATTACK
					theGame.KillEnemy(this.pos - 30);
					return true;
				case 4:
					//GET GOLD
					return false;
				case 5:
					//HEAL
					return false;
				case 7:
					return true;
				case 8:
					//GO DOWNSTAIRS (REGEN ROOM)
					enemyLocationsArray = []; //Empty the enemy locations array so unkilled enemies from last floor don't appear in the next floor.
					theGame.GenerateMap();
					theGame.GenerateActors();
					theGame.CombineMaps();
					//cMap[119] = 1;
					return true;
				default: console.info("ERROR: Collision Check Player Up"); break;
			}
		} else if( dir === "down" ) {			
			switch( cMap[this.pos + 30] ) {
				case 0:
					return false;
				case 1:
					return true;
				case 3:
					//ATTACK
					theGame.KillEnemy(this.pos + 30);
					return true;
				case 4:
					//GET GOLD
					return false;
				case 5:
					//HEAL
					return false;
				case 7:
					return true;
				case 8:
					//GO DOWNSTAIRS (REGEN ROOM)
					enemyLocationsArray = []; //Empty the enemy locations array so unkilled enemies from last floor don't appear in the next floor.
					theGame.GenerateMap();
					theGame.GenerateActors();
					theGame.CombineMaps();
					//cMap[119] = 1;
					return true;
				default:
					console.info("ERROR: Collision Check Player Down");
					break;
			}
		} else {
			console.info("ERROR: Collision Direction");
		}
		return true;
	},

	//NEEDS ATTACK FUNCTION
}

var theGame = {
	STATE_PLAYING:       	 1,
	STATE_PROCESS_TURN:  	 2,
    STATE_GAMEOVER:   		999,
	
	gameState: 				0,
	isInitialized:  		0, // Has Init been called?
	
	gameHeight: WORLD_HEIGHT,
	gameWidth:  WORLD_WIDTH,
	//hasPrize: false,
	//curFloor: 1,
	imgX: 					0,
	imgY: 					0,
	onesPlace: 				0,
	wallImgLoaded: 			0,
	playerImgLoaded: 		0,
	enemyImgLoaded: 		0,
	goldImgLoaded: 			0,
	potionImgLoaded: 		0,
	prizeImgLoaded: 		0,
	//upstairsImgLoaded: 	0,
	downstairsImgLoaded: 	0,
	healthbarImgLoaded:		0,
	//playerInstance:		new Player("player", PLAYER_IMG_SRC, 0, 1, 100);
	score:  				0,
	
	Init : function() {
		theGame.gameState = theGame.STATE_PLAYING;
		var gameCanvas = document.getElementById(CANVAS_GAME_ID);
		var gameCTX = gameCanvas.getContext("2d");
		
		//Wall
		this.wallImg = new Image();
		this.wallImg.onload = function () { 	theGame.wallImgLoaded = 1; };
        this.wallImg.src = WALL_IMG_SRC;
		//Player
		this.playerImg = new Image();
		this.playerImg.onload = function () { 	theGame.playerImgLoaded = 1; };
        this.playerImg.src = PLAYER_IMG_SRC;
		//Enemy
		this.enemyImg = new Image();
		this.enemyImg.onload = function () { 	theGame.enemyImgLoaded = 1; };
        this.enemyImg.src = ENEMY_IMG_SRC;
		//Gold
		this.goldImg = new Image();
		this.goldImg.onload = function () { 	theGame.GoldImgLoaded = 1; };
        this.goldImg.src = GOLD_IMG_SRC;
		//Potion
		this.potionImg = new Image();
		this.potionImg.onload = function () { 	theGame.potionImgLoaded = 1; };
        this.potionImg.src = POTION_IMG_SRC;
		//Prize
		this.prizeImg = new Image();
		this.prizeImg.onload = function () { 	theGame.prizeImgLoaded = 1; };
        this.prizeImg.src = PRIZE_IMG_SRC;
		//Upstairs
		/*
		this.upstairsImg = new Image();
		this.upstairsImg.onload = function () { 	theGame.upstairsImgLoaded = 1; };
        this.upstairsImg.src = UPSTAIRS_IMG_SRC;
		*/
		//Downstairs
		this.downstairsImg = new Image();
		this.downstairsImg.onload = function () { 	theGame.downstairsImgLoaded = 1; };
        this.downstairsImg.src = DOWNSTAIRS_IMG_SRC;
		//Healthbar
		this.healthbarImg = new Image();
		this.healthbarImg.onload = function () {	theGame.healthbarImgLoaded = 1; };
		this.healthbarImg.src = HEALTHBAR_IMG_SRC;
		
		theGame.GenerateMap();
		theGame.GenerateActors();
		theGame.CombineMaps();
		//cMap[119] = 1;
		
		gameCanvas.style.display = 'inline';
		
		this.isInitialized = 1;
	},
	
	//Generate each room to each floor
	GenerateMap : function() {
		theGame.GenerateRooms();
		
		/*
		MAP[30][20];
##############################
#-------#-------#---G---#----#
#-U--------------------------# Due to uneven room size make one 4x3 big?
#-------#-------#-------#----# Make rest 7x3 big?
##########-###############-###
#-------#----#----G--#-------# Random placement of the 4 big room so that
#-E--------P-----------------# Only the 4 big room is a pivot. (Only 4 big has doorway up/down)
#-------#----#-------#---G---# 7x3 rooms only have doorways to other 7x3 rooms.
##-#######-################### 4x3 rooms have connections to from 7x3 to 7x3
#----#-------#-------#-------#
#----------------------------# This means there will always be a path from Up to Down.
#----#-E-----#-------#-------#
##-###############-###########
#-------#-------#----#----G--#
#----------------------------#
#-------#----D--#----#-------#
##############################
#----------------------------#
#----------------------------# PUT THE HEALTH AND SUCH HERE
##############################
		*/
		
		for( var z = 0; z < 150; z++ ) {
			map1[z] = 0;
			map2[z] = 0;
			map3[z] = 0;
			map4[z] = 0;
		}
		
		//console.info("Map at Index #" + ((mapIndexY*30)+mapIndexX) + " is " + map4[(mapIndexY*30)+mapIndexX]);
		var roomNum = 0;
		var previousRoom = 0;
		var mapIndexX = 0;
		var MapIndexY = 0;
		var pivotRoomMade = 0;
		
		//Generate the room layouts
		while(roomNum < 16) {
			switch( roomNum ) {
				case 0: //#####################BEGIN MAP 1
					// >v
					//PIVOT ROOM
					if(rooms[0] === 2) {
						pivotRoomMade = 1;
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								0######
								1#----#
								2#-----
								3#----#
								4##-###
								*/
								case 0:
									mapIndexY = 0;
									mapIndexX = 0;
									for( var i = 0; i < 6; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									mapIndexX = 0;
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									mapIndexX = 0;
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 5; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									break;
								case 3:
									mapIndexY = 3;
									mapIndexX = 0;
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									mapIndexX = 0;
									for( var i = 0; i < 2; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									map1[(mapIndexY*30)+mapIndexX] = 0;
									mapIndexX++;
									for( var i = 0; i < 3; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 1"); break;
							}
							//console.info(mapIndexX);
						}
					}
					//NORMAL ROOM
					if(rooms[0] === 1) {
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								0#########
								1#-------#
								2#--------
								3#-------#
								4#########
								*/
								case 0:
									mapIndexY = 0;
									mapIndexX = 0;
									for( var i = 0; i < 9; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									mapIndexX = 0;
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									mapIndexX = 0;
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 8; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									break;
								case 3:
									mapIndexY = 3;
									mapIndexX = 0;
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									mapIndexX = 0;
									for( var i = 0; i < 9; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 1"); break;
							}
							//console.info(mapIndexX);
						}
					}
					break;
				case 1:
					// <>v
					//PIVOT ROOM
					if(rooms[1] === 2) {
						pivotRoomMade = 1;
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								0######
								1#----#
								2------
								3#----#
								4##-###
								*/
								case 0:
									mapIndexY = 0;
									mapIndexX = 8;
									for( var i = 0; i < 6; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									mapIndexX = 8;
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									mapIndexX = 8;
									for( var i = 0; i < 6; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									break;
								case 3:
									mapIndexY = 3;
									mapIndexX = 8;
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									mapIndexX = 8;
									for( var i = 0; i < 2; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									map1[(mapIndexY*30)+mapIndexX] = 0;
									mapIndexX++;
									for( var i = 0; i < 3; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 2"); break;
							}
							//console.info(mapIndexX);
						}
					}
					//NORMAL ROOM
					if(rooms[1] === 1) {
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								0#########
								1#-------#
								2---------
								3#-------#
								4#########
								*/
								case 0:
									mapIndexY = 0;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 5;
									} else {
										mapIndexX = 8;
									}
									for( var i = 0; i < 9; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 5;
									} else {
										mapIndexX = 8;
									}
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 5;
									} else {
										mapIndexX = 8;
									}
									for( var i = 0; i < 9; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									break;
								case 3:
									mapIndexY = 3;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 5;
									} else {
										mapIndexX = 8;
									}
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 5;
									} else {
										mapIndexX = 8;
									}
									for( var i = 0; i < 9; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 2"); break;
							}
						}
					}
					break;
				case 2:
					// <>v
					//PIVOT ROOM
					if(rooms[2] === 2) {
						pivotRoomMade = 1;
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								0######
								1#----#
								2------
								3#----#
								4##-###
								*/
								case 0:
									mapIndexY = 0;
									mapIndexX = 16;
									for( var i = 0; i < 6; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									mapIndexX = 16;
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									mapIndexX = 16;
									for( var i = 0; i < 6; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									break;
								case 3:
									mapIndexY = 3;
									mapIndexX = 16;
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									mapIndexX = 16;
									for( var i = 0; i < 2; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									map1[(mapIndexY*30)+mapIndexX] = 0;
									mapIndexX++;
									for( var i = 0; i < 3; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 2"); break;
							}
						}
					}
					//NORMAL ROOM
					if(rooms[2] === 1) {
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								0#########
								1#-------#
								2---------
								3#-------#
								4#########
								*/
								case 0:
									mapIndexY = 0;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 13;
									} else {
										mapIndexX = 16;
									}
									for( var i = 0; i < 9; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 13;
									} else {
										mapIndexX = 16;
									}
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 13;
									} else {
										mapIndexX = 16;
									}
									for( var i = 0; i < 9; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									break;
								case 3:
									mapIndexY = 3;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 13;
									} else {
										mapIndexX = 16;
									}
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 13;
									} else {
										mapIndexX = 16;
									}
									for( var i = 0; i < 9; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 2"); break;
							}
						}
					}
					break;
				case 3:
					// <v
					//PIVOT ROOM
					if(rooms[3] === 2) {
						pivotRoomMade = 1;
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								0######
								1#----#
								2-----#
								3#----#
								4##-###
								*/
								case 0:
									mapIndexY = 0;
									mapIndexX = 24;
									for( var i = 0; i < 6; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									mapIndexX = 24;
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									mapIndexX = 24;
									for( var i = 0; i < 5; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 3:
									mapIndexY = 3;
									mapIndexX = 24;
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									mapIndexX = 24;
									for( var i = 0; i < 2; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									map1[(mapIndexY*30)+mapIndexX] = 0;
									mapIndexX++;
									for( var i = 0; i < 3; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 3"); break;
							}
						}
					}
					//NORMAL ROOM
					if(rooms[3] === 1) {
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								0#########
								1#-------#
								2--------#
								3#-------#
								4#########
								*/
								case 0:
									mapIndexY = 0;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 21;
									} else {
										mapIndexX = 24;
									}
									for( var i = 0; i < 9; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 21;
									} else {
										mapIndexX = 24;
									}
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 21;
									} else {
										mapIndexX = 24;
									}
									for( var i = 0; i < 8; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 3:
									mapIndexY = 3;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 21;
									} else {
										mapIndexX = 24;
									}
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map1[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 21;
									} else {
										mapIndexX = 24;
									}
									for( var i = 0; i < 9; i++ ) {
										map1[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 3"); break;
							}
						}
					}
					break;
				case 4: //#####################BEGIN MAP 2
					pivotRoomMade = 0;
					// ^>v
					//PIVOT ROOM
					if(rooms[4] === 2) {
						pivotRoomMade = 1;
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								5##-###
								6#----#
								7#-----
								8#----#
								9##-###
								*/
								case 0:
									mapIndexY = 0;
									mapIndexX = 0;
									for( var i = 0; i < 2; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 0;
									mapIndexX++;
									for( var i = 0; i < 3; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									mapIndexX = 0;
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									mapIndexX = 0;
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 5; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									break;
								case 3:
									mapIndexY = 3;
									mapIndexX = 0;
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									mapIndexX = 0;
									for( var i = 0; i < 2; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 0;
									mapIndexX++;
									for( var i = 0; i < 3; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 4"); break;
							}
						}						
					}
					//NORMAL ROOM
					if(rooms[4] === 1) {
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								0#########
								1#-------#
								2#--------
								3#-------#
								4#########
								*/
								case 0:
									mapIndexY = 0;
									mapIndexX = 0;
									for( var i = 0; i < 9; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									mapIndexX = 0;
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									mapIndexX = 0;
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 8; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									break;
								case 3:
									mapIndexY = 3;
									mapIndexX = 0;
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									mapIndexX = 0;
									for( var i = 0; i < 9; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 4"); break;
							}
						}
					}
					break;
				case 5:
					// <^>v
					//PIVOT ROOM
					if(rooms[5] === 2) {
						pivotRoomMade = 1;
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								5##-###
								6#----#
								7------
								8#----#
								9##-###
								*/
								case 0:
									mapIndexY = 0;
									mapIndexX = 8;
									for( var i = 0; i < 2; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 0;
									mapIndexX++;
									for( var i = 0; i < 3; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									mapIndexX = 8;
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									mapIndexX = 8;
									for( var i = 0; i < 6; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									break;
								case 3:
									mapIndexY = 3;
									mapIndexX = 8;
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									mapIndexX = 8;
									for( var i = 0; i < 2; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 0;
									mapIndexX++;
									for( var i = 0; i < 3; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 5"); break;
							}
						}
					}
					//NORMAL ROOM
					if(rooms[5] === 1) {
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								0#########
								1#-------#
								2---------
								3#-------#
								4#########
								*/
								case 0:
									mapIndexY = 0;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 5;
									} else {
										mapIndexX = 8;
									}
									for( var i = 0; i < 9; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 5;
									} else {
										mapIndexX = 8;
									}
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 5;
									} else {
										mapIndexX = 8;
									}
									for( var i = 0; i < 9; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									break;
								case 3:
									mapIndexY = 3;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 5;
									} else {
										mapIndexX = 8;
									}
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 5;
									} else {
										mapIndexX = 8;
									}
									for( var i = 0; i < 9; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 5"); break;
							}
						}
					}
					break;
				case 6:
					// <^>v
					//PIVOT ROOM
					if(rooms[6] === 2) {
						pivotRoomMade = 1;
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								5##-###
								6#----#
								7------
								8#----#
								9##-###
								*/
								case 0:
									mapIndexY = 0;
									mapIndexX = 16;
									for( var i = 0; i < 2; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 0;
									mapIndexX++;
									for( var i = 0; i < 3; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									mapIndexX = 16;
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									mapIndexX = 16;
									for( var i = 0; i < 6; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									break;
								case 3:
									mapIndexY = 3;
									mapIndexX = 16;
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									mapIndexX = 16;
									for( var i = 0; i < 2; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 0;
									mapIndexX++;
									for( var i = 0; i < 3; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 6"); break;
							}
						}
					}
					//NORMAL ROOM
					if(rooms[6] === 1) {
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								0#########
								1#-------#
								2---------
								3#-------#
								4#########
								*/
								case 0:
									mapIndexY = 0;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 13;
									} else {
										mapIndexX = 16;
									}
									for( var i = 0; i < 9; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 13;
									} else {
										mapIndexX = 16;
									}
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 13;
									} else {
										mapIndexX = 16;
									}
									for( var i = 0; i < 9; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									break;
								case 3:
									mapIndexY = 3;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 13;
									} else {
										mapIndexX = 16;
									}
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 13;
									} else {
										mapIndexX = 16;
									}
									for( var i = 0; i < 9; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 6"); break;
							}
						}
					}
					break;
				case 7:
					// <^v
					//PIVOT ROOM
					if(rooms[7] === 2) {
						pivotRoomMade = 1;
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								0##-###
								1#----#
								2-----#
								3#----#
								4##-###
								*/
								case 0:
									mapIndexY = 0;
									mapIndexX = 24;
									for( var i = 0; i < 2; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 0;
									mapIndexX++;
									for( var i = 0; i < 3; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									mapIndexX = 24;
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									mapIndexX = 24;
									for( var i = 0; i < 5; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 3:
									mapIndexY = 3;
									mapIndexX = 24;
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									mapIndexX = 24;
									for( var i = 0; i < 2; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 0;
									mapIndexX++;
									for( var i = 0; i < 3; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 7"); break;
							}
						}
					}
					//NORMAL ROOM
					if(rooms[7] === 1) {
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								0#########
								1#-------#
								2--------#
								3#-------#
								4#########
								*/
								case 0:
									mapIndexY = 0;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 21;
									} else {
										mapIndexX = 24;
									}
									for( var i = 0; i < 9; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 21;
									} else {
										mapIndexX = 24;
									}
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 21;
									} else {
										mapIndexX = 24;
									}
									for( var i = 0; i < 8; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 3:
									mapIndexY = 3;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 21;
									} else {
										mapIndexX = 24;
									}
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map2[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 21;
									} else {
										mapIndexX = 24;
									}
									for( var i = 0; i < 9; i++ ) {
										map2[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 7"); break;
							}
						}
					}
					break;
				case 8: //#####################BEGIN MAP 3
					pivotRoomMade = 0;
					// ^>v
					//PIVOT ROOM
					if(rooms[8] === 2) {
						pivotRoomMade = 1;
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								10##-###
								11#----#
								12#-----
								13#----#
								14##-###
								*/
								case 0:
									mapIndexY = 0;
									mapIndexX = 0;
									for( var i = 0; i < 2; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 0;
									mapIndexX++;
									for( var i = 0; i < 3; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									mapIndexX = 0;
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									mapIndexX = 0;
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 5; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									break;
								case 3:
									mapIndexY = 3;
									mapIndexX = 0;
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									mapIndexX = 0;
									for( var i = 0; i < 2; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 0;
									mapIndexX++;
									for( var i = 0; i < 3; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 8"); break;
							}
						}
					}
					//NORMAL ROOM
					if(rooms[8] === 1) {
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								0#########
								1#-------#
								2#--------
								3#-------#
								4#########
								*/
								case 0:
									mapIndexY = 0;
									mapIndexX = 0;
									for( var i = 0; i < 9; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									mapIndexX = 0;
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									mapIndexX = 0;
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 8; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									break;
								case 3:
									mapIndexY = 3;
									mapIndexX = 0;
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									mapIndexX = 0;
									for( var i = 0; i < 9; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 8"); break;
							}
						}
					}
					break;
				case 9:
					// <^>v
					//PIVOT ROOM
					if(rooms[9] === 2) {
						pivotRoomMade = 1;
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								5##-###
								6#----#
								7------
								8#----#
								9##-###
								*/
								case 0:
									mapIndexY = 0;
									mapIndexX = 8;
									for( var i = 0; i < 2; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 0;
									mapIndexX++;
									for( var i = 0; i < 3; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									mapIndexX = 8;
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									mapIndexX = 8;
									for( var i = 0; i < 6; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									break;
								case 3:
									mapIndexY = 3;
									mapIndexX = 8;
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									mapIndexX = 8;
									for( var i = 0; i < 2; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 0;
									mapIndexX++;
									for( var i = 0; i < 3; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 9"); break;
							}
						}
					}
					//NORMAL ROOM
					if(rooms[9] === 1) {
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								0#########
								1#-------#
								2---------
								3#-------#
								4#########
								*/
								case 0:
									mapIndexY = 0;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 5;
									} else {
										mapIndexX = 8;
									}
									for( var i = 0; i < 9; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 5;
									} else {
										mapIndexX = 8;
									}
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 5;
									} else {
										mapIndexX = 8;
									}
									for( var i = 0; i < 9; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									break;
								case 3:
									mapIndexY = 3;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 5;
									} else {
										mapIndexX = 8;
									}
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 5;
									} else {
										mapIndexX = 8;
									}
									for( var i = 0; i < 9; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 9"); break;
							}
						}
					}
					break;
				case 10:
					// <^>v
					//PIVOT ROOM
					if(rooms[10] === 2) {
						pivotRoomMade = 1;
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								5##-###
								6#----#
								7------
								8#----#
								9##-###
								*/
								case 0:
									mapIndexY = 0;
									mapIndexX = 16;
									for( var i = 0; i < 2; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 0;
									mapIndexX++;
									for( var i = 0; i < 3; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									mapIndexX = 16;
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									mapIndexX = 16;
									for( var i = 0; i < 6; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									break;
								case 3:
									mapIndexY = 3;
									mapIndexX = 16;
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									mapIndexX = 16;
									for( var i = 0; i < 2; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 0;
									mapIndexX++;
									for( var i = 0; i < 3; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 10"); break;
							}
						}
					}
					//NORMAL ROOM
					if(rooms[10] === 1) {
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								0#########
								1#-------#
								2---------
								3#-------#
								4#########
								*/
								case 0:
									mapIndexY = 0;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 13;
									} else {
										mapIndexX = 16;
									}
									for( var i = 0; i < 9; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 13;
									} else {
										mapIndexX = 16;
									}
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 13;
									} else {
										mapIndexX = 16;
									}
									for( var i = 0; i < 9; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									break;
								case 3:
									mapIndexY = 3;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 13;
									} else {
										mapIndexX = 16;
									}
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 13;
									} else {
										mapIndexX = 16;
									}
									for( var i = 0; i < 9; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 10"); break;
							}
						}
					}
					break;
				case 11:
					// <^v
					//PIVOT ROOM
					if(rooms[11] === 2) {
						pivotRoomMade = 1;
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								0##-###
								1#----#
								2-----#
								3#----#
								4##-###
								*/
								case 0:
									mapIndexY = 0;
									mapIndexX = 24;
									for( var i = 0; i < 2; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 0;
									mapIndexX++;
									for( var i = 0; i < 3; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									mapIndexX = 24;
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									mapIndexX = 24;
									for( var i = 0; i < 5; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 3:
									mapIndexY = 3;
									mapIndexX = 24;
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									mapIndexX = 24;
									for( var i = 0; i < 2; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 0;
									mapIndexX++;
									for( var i = 0; i < 3; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 11"); break;
							}
						}
					}
					//NORMAL ROOM
					if(rooms[11] === 1) {
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								0#########
								1#-------#
								2--------#
								3#-------#
								4#########
								*/
								case 0:
									mapIndexY = 0;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 21;
									} else {
										mapIndexX = 24;
									}
									for( var i = 0; i < 9; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 21;
									} else {
										mapIndexX = 24;
									}
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 21;
									} else {
										mapIndexX = 24;
									}
									for( var i = 0; i < 8; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 3:
									mapIndexY = 3;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 21;
									} else {
										mapIndexX = 24;
									}
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map3[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 21;
									} else {
										mapIndexX = 24;
									}
									for( var i = 0; i < 9; i++ ) {
										map3[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 11"); break;
							}
						}
					}
					break;
				case 12: //#####################BEGIN MAP 4
					pivotRoomMade = 0;
					// ^>
					//PIVOT ROOM
					if(rooms[12] === 2) {
						pivotRoomMade = 1;
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								15##-###
								16#----#
								17#-----
								18#----#
								19######
								*/
								case 0:
									mapIndexY = 0;
									mapIndexX = 0;
									for( var i = 0; i < 2; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									map4[(mapIndexY*30)+mapIndexX] = 0;
									mapIndexX++;
									for( var i = 0; i < 3; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									mapIndexX = 0;
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									mapIndexX = 0;
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 5; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									break;
								case 3:
									mapIndexY = 3;
									mapIndexX = 0;
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									mapIndexX = 0;
									for( var i = 0; i < 6; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 12"); break;
							}
						}
					}
					//NORMAL ROOM
					if(rooms[12] === 1) {
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								0#########
								1#-------#
								2#--------
								3#-------#
								4#########
								*/
								case 0:
									mapIndexY = 0;
									mapIndexX = 0;
									for( var i = 0; i < 9; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									mapIndexX = 0;
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									mapIndexX = 0;
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 8; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									break;
								case 3:
									mapIndexY = 3;
									mapIndexX = 0;
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									mapIndexX = 0;
									for( var i = 0; i < 9; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 12"); break;
							}
						}
					}
					break;
				case 13:
					// <^>
					//PIVOT ROOM
					if(rooms[13] === 2) {
						pivotRoomMade = 1;
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								5##-###
								6#----#
								7------
								8#----#
								9######
								*/
								case 0:
									mapIndexY = 0;
									mapIndexX = 8;
									for( var i = 0; i < 2; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									map4[(mapIndexY*30)+mapIndexX] = 0;
									mapIndexX++;
									for( var i = 0; i < 3; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									mapIndexX = 8;
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									mapIndexX = 8;
									for( var i = 0; i < 6; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									break;
								case 3:
									mapIndexY = 3;
									mapIndexX = 8;
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									mapIndexX = 8;
									for( var i = 0; i < 6; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 13"); break;
							}
						}
					}
					//NORMAL ROOM
					if(rooms[13] === 1) {
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								0#########
								1#-------#
								2---------
								3#-------#
								4#########
								*/
								case 0:
									mapIndexY = 0;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 5;
									} else {
										mapIndexX = 8;
									}
									for( var i = 0; i < 9; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 5;
									} else {
										mapIndexX = 8;
									}
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 5;
									} else {
										mapIndexX = 8;
									}
									for( var i = 0; i < 9; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									break;
								case 3:
									mapIndexY = 3;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 5;
									} else {
										mapIndexX = 8;
									}
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 5;
									} else {
										mapIndexX = 8;
									}
									for( var i = 0; i < 9; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 13"); break;
							}
						}
					}
					break;
				case 14:
					// <^>
					//PIVOT ROOM
					if(rooms[14] === 2) {
						pivotRoomMade = 1;
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								5##-###
								6#----#
								7------
								8#----#
								9######
								*/
								case 0:
									mapIndexY = 0;
									mapIndexX = 16;
									for( var i = 0; i < 2; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									map4[(mapIndexY*30)+mapIndexX] = 0;
									mapIndexX++;
									for( var i = 0; i < 3; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									mapIndexX = 16;
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									mapIndexX = 16;
									for( var i = 0; i < 6; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									break;
								case 3:
									mapIndexY = 3;
									mapIndexX = 16;
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									mapIndexX = 16;
									for( var i = 0; i < 6; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 14"); break;
							}
						}
					}
					//NORMAL ROOM
					if(rooms[14] === 1) {
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								0#########
								1#-------#
								2---------
								3#-------#
								4#########
								*/
								case 0:
									mapIndexY = 0;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 13;
									} else {
										mapIndexX = 16;
									}
									for( var i = 0; i < 9; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 13;
									} else {
										mapIndexX = 16;
									}
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 13;
									} else {
										mapIndexX = 16;
									}
									for( var i = 0; i < 9; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									break;
								case 3:
									mapIndexY = 3;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 13;
									} else {
										mapIndexX = 16;
									}
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 13;
									} else {
										mapIndexX = 16;
									}
									for( var i = 0; i < 9; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 14"); break;
							}
						}
					}
					break;
				case 15:
					// <^
					//PIVOT ROOM
					if(rooms[15] === 2) {
						pivotRoomMade = 1;
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								0##-###
								1#----#
								2-----#
								3#----#
								4######
								*/
								case 0:
									mapIndexY = 0;
									mapIndexX = 24;
									for( var i = 0; i < 2; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									map4[(mapIndexY*30)+mapIndexX] = 0;
									mapIndexX++;
									for( var i = 0; i < 3; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									mapIndexX = 24;
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									mapIndexX = 24;
									for( var i = 0; i < 5; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 3:
									mapIndexY = 3;
									mapIndexX = 24;
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 4; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									mapIndexX = 24;
									for( var i = 0; i < 6; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 15"); break;
							}
							//console.info(mapIndexX);
						}
					}
					//NORMAL ROOM
					if(rooms[15] === 1) {
						for( var layer = 0; layer < 5; layer++ ) {
							switch( layer ) {
								/*
								 0123456789...
								0#########
								1#-------#
								2--------#
								3#-------#
								4#########
								*/
								case 0:
									mapIndexY = 0;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 21;
									} else {
										mapIndexX = 24;
									}
									for( var i = 0; i < 9; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								case 1:
									mapIndexY = 1;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 21;
									} else {
										mapIndexX = 24;
									}
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 2:
									mapIndexY = 2;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 21;
									} else {
										mapIndexX = 24;
									}
									for( var i = 0; i < 8; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 3:
									mapIndexY = 3;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 21;
									} else {
										mapIndexX = 24;
									}
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									for( var i = 0; i < 7; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 0;
										mapIndexX++;
									}
									map4[(mapIndexY*30)+mapIndexX] = 1;
									mapIndexX++;
									break;
								case 4:
									mapIndexY = 4;
									if( pivotRoomMade === 1 ) {
										mapIndexX = 21;
									} else {
										mapIndexX = 24;
									}
									for( var i = 0; i < 9; i++ ) {
										map4[(mapIndexY*30)+mapIndexX] = 1;
										mapIndexX++;
									}
									break;
								default: console.info("ERROR: Room 15"); break;
							}
						}
					}
					break;
				default:
					console.info("ERROR: Map Generation (Rooms)");
					break;
			}
			roomNum++;
		}
	},
	
	//Builds the floors according to given numbers
	GenerateRooms : function() {
		var pivotMade = 0;
		var j = 0;
		var width = 4;
		for( var k = 0; k < 16; k++ ) {
			rooms[k] = 0;
		}
		for( var i = 0; i < 4; i++ ) {
			j = 0;
			pivotMade = 0;
			while( j < 4 ) {
				if( ((Math.floor(Math.random() * 100) + 1 ) < 75) ) {
					rooms[(i*width)+j] = 1;
				} else if( pivotMade != 1 ) {
					rooms[(i*width)+j] = 2;
					pivotMade = 1;
				} else {
					rooms[(i*width)+j] = 1;
				}
				j++;
			}
			if ( pivotMade === 0 ) {
				rooms[(i*width)+3] = 2;
			}
		}
	},
	
	GenerateActors : function() {
		//Map[] stores all tiles, can be 0, 1, 2, 3, 4, 5, 6, 7, 8,
		//In order: Empty, Wall, Player, Enemy, Gold, Potion, Prize, -Upstairs-, Downstairs
		//Generate Stairs
		//var placedStairs = 0;
		//var placedUpstairs = 0;
		var placedDownstairs = 0;
		var placedPlayer = 0
		while( placedDownstairs != 1 ) {
			var randNum = (Math.floor(Math.random() * 150) + 1);
			if( map4[randNum] === 0 && placedDownstairs === 0 ) {
				//PLACE DOWNSTAIRS
				map4[randNum] = 8;
				placedDownstairs = 1;
			}
			/*
			var randMapNum = (Math.floor(Math.random() * 2) + 1);
			switch( randMapNum ) {
				case 1:
					
					if( map1[randNum] === 0 && placedUpstairs === 0 ) {
						//PLACE UPSTAIRS
						map1[randNum] = 7;
						placedUpstairs = 1;
						if( map1[randNum+1] === 0 && placedPlayer === 0 ) {
							map1[randNum+1] = 2;
							Player.pos = randNum+1;
							Player.map = 1;
							placedPlayer = 1;
						} else if( map1[randNum-1] === 0 && placedPlayer === 0 ) {
							map1[randNum-1] = 2;
							Player.pos = randNum-1;
							Player.map = 1;
							placedPlayer = 1;
						} else {
							placedPlayer = 0;
						}
					}
					break;
				case 2:
					if( map4[randNum] === 0 && placedDownstairs === 0 ) {
						//PLACE DOWNSTAIRS
						map4[randNum] = 8;
						placedDownstairs = 1;
					}
					
					break;
				default: console.info("ERROR: Map Stairs"); break;
			}
			if( placedUpstairs === 1 && placedDownstairs === 1 ) {
				placedStairs = 1;
			}
			*/
		}
		//Generate Player
		if( placedPlayer === 0 ) {
			while( placedPlayer != 1 ) {
				var randNum = (Math.floor(Math.random() * 150) + 1);
				if( map1[randNum] === 0 ) {
					//PLACE PLAYER
					map1[randNum] = 2;
					Player.pos = randNum;
					placedPlayer = 1;
				}
			}
		}
		//Generate Enemies
		var placedEnemies = 0;
		while( placedEnemies < MAX_ENEMIES ) {
			var randNum = (Math.floor(Math.random() * 150) + 1);
			var randMapNum = (Math.floor(Math.random() * 4) + 1);
			switch( randMapNum ) {
				case 1:
					if( map1[randNum] === 0 ) {
						//PLACE ENEMY
						map1[randNum] = 3;
						enemyLocationsArray.push(randNum); // Add the enemy location to the array that tracks enemy locations
						placedEnemies++;
					}
					break;
				case 2:
					if( map2[randNum] === 0 ) {
						//PLACE ENEMY
						map2[randNum] = 3;
						enemyLocationsArray.push(randNum + 120); // Add the enemy location to the array that tracks enemy locations
						placedEnemies++;
					}
					break;
				case 3:
					if( map3[randNum] === 0 ) {
						//PLACE ENEMY
						map3[randNum] = 3;
						enemyLocationsArray.push(randNum + 240); // Add the enemy location to the array that tracks enemy locations
						placedEnemies++;
					}
					break;
				case 4:
					if( map4[randNum] === 0 ) {
						//PLACE ENEMY
						map4[randNum] = 3;
						enemyLocationsArray.push(randNum + 360); // Add the enemy location to the array that tracks enemy locations
						placedEnemies++;
					}
					break;
				default: console.info("ERROR: Map Enemies"); break;
			}
		}
		//Generate Gold
		var placedGold = 0;
		while( placedGold < MAX_GOLD ) {
			var randNum = (Math.floor(Math.random() * 150) + 1);
			var randMapNum = (Math.floor(Math.random() * 4) + 1);
			switch( randMapNum ) {
				case 1:
					if( map1[randNum] === 0 ) {
						//PLACE GOLD
						map1[randNum] = 4;
						placedGold++;
					}
					break;
				case 2:
					if( map2[randNum] === 0 ) {
						//PLACE GOLD
						map2[randNum] = 4;
						placedGold++;
					}
					break;
				case 3:
					if( map3[randNum] === 0 ) {
						//PLACE GOLD
						map3[randNum] = 4;
						placedGold++;
					}
					break;
				case 4:
					if( map4[randNum] === 0 ) {
						//PLACE GOLD
						map4[randNum] = 4;
						placedGold++;
					}
					break;
				default: console.info("ERROR: Map Gold"); break;
			}
		}
		//Generate Potions
		var placedPotions = 0;
		while( placedPotions < MAX_POTIONS ) {
			var randNum = (Math.floor(Math.random() * 150) + 1);
			var randMapNum = (Math.floor(Math.random() * 4) + 1);
			switch( randMapNum ) {
				case 1:
					if( map1[randNum] === 0 ) {
						//PLACE POTION
						map1[randNum] = 5;
						placedPotions++;
					}
					break;
				case 2:
					if( map2[randNum] === 0 ) {
						//PLACE POTION
						map2[randNum] = 5;
						placedPotions++;
					}
					break;
				case 3:
					if( map3[randNum] === 0 ) {
						//PLACE POTION
						map3[randNum] = 5;
						placedPotions++;
					}
					break;
				case 4:
					if( map4[randNum] === 0 ) {
						//PLACE POTION
						map4[randNum] = 5;
						placedPotions++;
					}
					break;
				default: console.info("ERROR: Map Potion"); break;
			}
		}
	},
	
	//COMBINE THE 4 ROOM "ROWS" TO MAKE ONE WHOLE MAP
	CombineMaps : function() {
		for( var i = 0; i < 510; i++ ) {
			if( i <= 119 ) {
				cMap[i] = map1[i];
			} else if(i == 120 || i == 239 || ((i > 120) && (i < 239))) {
				cMap[i] = map2[i-120]; //need to reduce the first value from 'i' to get the first value of the array which is under operation
			} else if(i == 240 || i == 359 || ((i > 240) && (i < 359))) {
				cMap[i] = map3[i-240];
			} else if(i == 360 || i == 479 || ((i > 360) && (i < 479))) {
				cMap[i] = map4[i-360];
			} else if(i == 480 || i == 510 || ((i > 480) && (i < 510))) {
				cMap[i] = map5[i-480];
			} else {
				console.info("ERROR: Combine Maps");
			}
		}
	},
	
	KillEnemy : function(enemyLocation) {
		//Iterate through the array until you find the right enemy location, then remove that enemy and turn the location square to 0 (empty square)
		var enemyLocationIndexInArray = enemyLocationsArray.indexOf(enemyLocation);
		if (enemyLocationIndexInArray > -1) {
			enemyLocationsArray.splice(enemyLocationIndexInArray, 1);
			cMap[enemyLocation] = 0;
		} else {
			console.info("ERROR: KillEnemy()");
		}
	},
	
	MoveEnemies : function() {
		//console.info("Move enemies...");
		//When the player has moved and possibly killed an enemy, move the enemies
		//Iterate through the enemyLocationsArray[] so every enemy gets a chance to move
		for (i = 0; i < enemyLocationsArray.length; i++) {
			//Generate a random number which will be translated to a direction (1, 2, 3, 4 = left, right, up, down)
			var intendedDirection = (Math.floor(Math.random() * 4) + 1);
			//Check for collisions
			var willEnemyCollide = this.CollisionCheckEnemies(enemyLocationsArray[i], intendedDirection);
			//If we can move, move. If we can't move, do nothing.
			if (willEnemyCollide === false) {
				//Move
				switch (intendedDirection) {
					case 1:
						//console.info("Moving enemy from " + enemyLocationsArray[i] + " to " + (enemyLocationsArray[i]-1));
						//console.info("cMap at enemy's location is " + cMap[enemyLocationsArray[i]]);
						cMap[(enemyLocationsArray[i] - 1)] = 3; //Draw enemy in new position
						cMap[enemyLocationsArray[i]] = 0; //Remove enemy from old position
						enemyLocationsArray[i] = enemyLocationsArray[i] - 1; //Update enemyLocationsArray[]
						break;
					case 2:
						//console.info("Moving enemy from " + enemyLocationsArray[i] + " to " + (enemyLocationsArray[i]+1));
						//console.info("cMap at enemy's location is " + cMap[enemyLocationsArray[i]]);
						cMap[(enemyLocationsArray[i] + 1)] = 3; //Draw enemy in new position
						cMap[enemyLocationsArray[i]] = 0; //Remove enemy from old position
						enemyLocationsArray[i] = enemyLocationsArray[i] + 1; //Update enemyLocationsArray[]
						break;
					case 3:
						//console.info("Moving enemy from " + enemyLocationsArray[i] + " to " + (enemyLocationsArray[i]-30));
						//console.info("cMap at enemy's location is " + cMap[enemyLocationsArray[i]]);
						cMap[(enemyLocationsArray[i] - 30)] = 3; //Draw enemy in new position
						cMap[enemyLocationsArray[i]] = 0; //Remove enemy from old position
						enemyLocationsArray[i] = enemyLocationsArray[i] - 30; //Update enemyLocationsArray[]
						break;
					case 4:
						//console.info("Moving enemy from " + enemyLocationsArray[i] + " to " + (enemyLocationsArray[i]+30));
						//console.info("cMap at enemy's location is " + cMap[enemyLocationsArray[i]]);
						cMap[(enemyLocationsArray[i] + 30)] = 3; //Draw enemy in new position
						cMap[enemyLocationsArray[i]] = 0; //Remove enemy from old position
						enemyLocationsArray[i] = enemyLocationsArray[i] + 30; //Update enemyLocationsArray[]
						break;
					default:
						console.info("ERROR: MoveEnemies()");
				}
				//cMap[enemyLocationsArray[i]] = 0;
			} else if (willEnemyCollide === true) {
				//Don't move
			} else {
				console.info("ERROR: MoveEnemies()");
			}
		}
		//console.info("cMap : " + cMap);
		theGame.IsPlayerNearEnemy()
		//Roll an attack chance
		//If attack goes through, roll the damage amount
		//Attack (deal damage to player, change the frame of the attacking enemy)
		//console.info("Check if monsters should attack here");
	},
	
	//Collision detection for enemies
	CollisionCheckEnemies : function (enemyLocation, intendedDirection) {
		//Generate a random direction (up, down, left, right)
		if( intendedDirection === 1 ) { //Left
			switch( cMap[enemyLocation - 1] ) {
				case 0:
					//EMPTY
					return false;
				case 1:
					//WALL
					return true;
				case 3:
					//ANOTHER ENEMY
					return true;
				case 4:
					//GOLD
					return true;
				case 5:
					//POTION
					return true;
				case 7:
					//DOWNSTAIRS
					return true;
				case 8:
					//DOWNSTAIRS
					return true;
				default: console.info("ERROR: Collision Check Enemy, this enemy location: " + enemyLocation); break;
			}
		} else if( intendedDirection === 2 ) { //Right
			switch( cMap[enemyLocation + 1] ) {
				case 0:
					//EMPTY
					return false;
				case 1:
					//WALL
					return true;
				case 3:
					//ANOTHER ENEMY
					return true;
				case 4:
					//GOLD
					return true;
				case 5:
					//POTION
					return true;
				case 7:
					//UPSTAIRS
					return true;
				case 8:
					//DOWNSTAIRS
					return true;
				default: console.info("ERROR: Collision Check Enemy, this enemy location: " + enemyLocation); break;
			}
		} else if( intendedDirection === 3 ) { //Up
			switch( cMap[enemyLocation - 30] ) {
				case 0:
					//EMPTY
					return false;
				case 1:
					//WALL
					return true;
				case 3:
					//ANOTHER ENEMY
					return true;
				case 4:
					//GOLD
					return true;
				case 5:
					//POTION
					return true;
				case 7:
					//UPSTAIRS
					return true;
				case 8:
					//DOWNSTAIRS
					return true;
				default: console.info("ERROR: Collision Check Enemy, this enemy location: " + enemyLocation); break;
			}
		} else if( intendedDirection === 4 ) { //Down			
			switch( cMap[enemyLocation + 30] ) {
				case 0:
					//EMPTY
					return false;
				case 1:
					//WALL
					return true;
				case 3:
					//ANOTHER ENEMY
					return true;
				case 4:
					//GOLD
					return true;
				case 5:
					//POTION
					return true;
				case 7:
					//UPSTAIRS
					return true;
				case 8:
					//DOWNSTAIRS
					return true;
				default:
					console.info("ERROR: Collision Check Enemy, this enemy location: " + enemyLocation);
					break;
			}
		} else {
			console.info("ERROR: Collision Direction");
		}
		return true;
	},
	
	IsPlayerNearEnemy : function () {
		//console.info("Player position: " + Player.pos);
		var playerSurroundingsArray = [];
		playerSurroundingsArray.push(Player.pos - 30); //Above the player
		playerSurroundingsArray.push(Player.pos - 1); //Left of the player
		playerSurroundingsArray.push(Player.pos + 1); //Right of the player
		playerSurroundingsArray.push(Player.pos + 30); //Under the player
		for (var i = 0; i < enemyLocationsArray.length; i++) {
			for (var j = 0; j < playerSurroundingsArray.length; j++) {
				if (enemyLocationsArray[i] === playerSurroundingsArray[j]) {
					//The player is near an enemy, it's the enemy's chance to strike
					theGame.EnemyAttackThePlayer (enemyLocationsArray[i])
				}
			}
		}
	},

	EnemyAttackThePlayer : function (enemyPosition) {
		var attackChance = Math.floor((Math.random() * 100) + 1);
		if (attackChance <= 75) {
			console.info("Enemy attacks the player");
			//Damage is 5 for now
			Player.health =- 5;
			theGame.AnimateActor("enemy", "attack", enemyPosition);
			//TODO: add an algorithm that increases the enemy damage as the player gets deeper in the dungeon
		}
	},

	AnimateActor : function (actorType, actorAnimation, mapIndexOfActor) {
		switch (actorType) {
			case "player":
				console.info("animate player here");
				break;
			case "enemy":
				console.info("animate enemy");
				switch (actorAnimation) {
					case "attack" :
						console.info("attacking");
						break;
				}
				break;
			default:
				console.info("ERROR: AnimateActor, actorType:" + actorType + ", actorAnimation:" + actorAnimation);
		}
	},

	//#TODO: Finish
	GameOver : function() {
		window.alert("YOU DIED!");
		theGame.gameState == theGame.STATE_GAMEOVER;
	},
	
	UpdateGame : function() {
		var gameCanvas = document.getElementById(CANVAS_GAME_ID);
		var gameCTX = gameCanvas.getContext("2d");
		this.DrawScreen(gameCTX);
	},
	
	ProcessTurn : function() {
		var gameCanvas = document.getElementById(CANVAS_GAME_ID);
		var gameCTX = gameCanvas.getContext("2d");
		this.DrawScreen(gameCTX);
		theGame.gameState = theGame.STATE_PLAYING;
	},
	
	CalculateCoords : function(idx, mapNum) {
		//CHECKED, THE Y WORKS PERFECTLY
		//30 INSTANCES OF 0 to 128. ( 128 is (640 / 4) - 32 )
		if( idx % 30 === 0 ) {
			theGame.imgY = 32 * (idx / 30) + (32 * 4 * mapNum); 
			theGame.imgX = 0;
			theGame.onesPlace++;
			if( theGame.onesPlace === 30 ) {
				theGame.onesPlace = 0;
			}
		}
		
		if( idx % 30 != 0 ) {
			theGame.imgX = 32 * theGame.onesPlace;
			theGame.onesPlace++;
			if( theGame.onesPlace === 30 ) {
				theGame.onesPlace = 0;
			}
		}
	},
	
	DrawScreen : function(ctx) {
		//Clear the Screen
		ctx.fillStyle = "#303030"; //The background colour
        ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
		//Print the map[]
		for( var i = 0; i < 120; i++ ) { //Draws the 1st row of rooms
			theGame.CalculateCoords(i, 0);
			switch( cMap[i] ) {
				case 0:
					ctx.fillRect(this.imgX, this.imgY, 32, 32);
					break;
				case 1:
					//Print WALL
					if( theGame.wallImgLoaded != 0 ) {
						ctx.drawImage(this.wallImg, 
									0, 0, this.wallImg.width, this.wallImg.height,
									this.imgX, this.imgY, this.wallImg.width, this.wallImg.height);
					}
					break;
				case 2:
					//Print PLAYER
					if( theGame.playerImgLoaded != 0 ) {
						ctx.drawImage(this.playerImg, 
									0, 0, this.playerImg.width, this.playerImg.height,
									this.imgX, this.imgY, this.playerImg.width, this.playerImg.height);
					}
					break;
				case 3:
					//Print ENEMY
					if( theGame.enemyImgLoaded != 0 ) {
						ctx.drawImage(this.enemyImg, 
									0, 0, this.enemyImg.width, this.enemyImg.height,
									this.imgX, this.imgY, this.enemyImg.width, this.enemyImg.height);
					}
					break;
				case 4:
					//Print GOLD
					if( theGame.goldImgLoaded != 0 ) {
						ctx.drawImage(this.goldImg, 
									0, 0, this.goldImg.width, this.goldImg.height,
									this.imgX, this.imgY, this.goldImg.width, this.goldImg.height);
					}
					break;
				case 5:
					//Print POTION
					if( theGame.potionImgLoaded != 0 ) {
						ctx.drawImage(this.potionImg, 
									0, 0, this.potionImg.width, this.potionImg.height,
									this.imgX, this.imgY, this.potionImg.width, this.potionImg.height);
					}
					break;
				case 6:
					//Print PRIZE
					if( theGame.prizeImgLoaded != 0 ) {
						ctx.drawImage(this.prizeImg, 
									0, 0, this.prizeImg.width, this.prizeImg.height,
									this.imgX, this.imgY, this.prizeImg.width, this.prizeImg.height);
					}
					break;
				/*
				case 7:
					//Print UPSTAIRS
					if( theGame.upstairsImgLoaded != 0 ) {
						ctx.drawImage(this.upstairsImg, 
									0, 0, this.upstairsImg.width, this.upstairsImg.height,
									this.imgX, this.imgY, this.upstairsImg.width, this.upstairsImg.height);
					}
					break;
				*/
				case 8:
					//Print DOWNSTAIRS
					if( theGame.downstairsImgLoaded != 0 ) {
						ctx.drawImage(this.downstairsImg, 
									0, 0, this.downstairsImg.width, this.downstairsImg.height,
									this.imgX, this.imgY, this.downstairsImg.width, this.downstairsImg.height);
					}
					break;
				default:
					console.info("ERROR: Map Drawing"); 
					break;
			}
		}
		theGame.onesPlace = 0;
		for( var i = 120; i < 240; i++ ) { //Draws the 2nd row of rooms
			theGame.CalculateCoords(i-120, 1);
			switch( cMap[i] ) {
				case 0:
					ctx.fillRect(this.imgX, this.imgY, 32, 32);
					break;
				case 1:
					//Print WALL
					if( theGame.wallImgLoaded != 0 ) {
						ctx.drawImage(this.wallImg, 
									0, 0, this.wallImg.width, this.wallImg.height,
									this.imgX, this.imgY, this.wallImg.width, this.wallImg.height);
					}
					break;
				case 2:
					//Print PLAYER
					if( theGame.playerImgLoaded != 0 ) {
						ctx.drawImage(this.playerImg, 
									0, 0, this.playerImg.width, this.playerImg.height,
									this.imgX, this.imgY, this.playerImg.width, this.playerImg.height);
					}
					break;
				case 3:
					//Print ENEMY
					if( theGame.enemyImgLoaded != 0 ) {
						ctx.drawImage(this.enemyImg, 
									0, 0, this.enemyImg.width, this.enemyImg.height,
									this.imgX, this.imgY, this.enemyImg.width, this.enemyImg.height);
					}
					break;
				case 4:
					//Print GOLD
					if( theGame.goldImgLoaded != 0 ) {
						ctx.drawImage(this.goldImg, 
									0, 0, this.goldImg.width, this.goldImg.height,
									this.imgX, this.imgY, this.goldImg.width, this.goldImg.height);
					}
					break;
				case 5:
					//Print POTION
					if( theGame.potionImgLoaded != 0 ) {
						ctx.drawImage(this.potionImg, 
									0, 0, this.potionImg.width, this.potionImg.height,
									this.imgX, this.imgY, this.potionImg.width, this.potionImg.height);
					}
					break;
				case 6:
					//Print PRIZE
					if( theGame.prizeImgLoaded != 0 ) {
						ctx.drawImage(this.prizeImg, 
									0, 0, this.prizeImg.width, this.prizeImg.height,
									this.imgX, this.imgY, this.prizeImg.width, this.prizeImg.height);
					}
					break;
				case 7:
					//Print UPSTAIRS
					if( theGame.upstairsImgLoaded != 0 ) {
						ctx.drawImage(this.upstairsImg, 
									0, 0, this.upstairsImg.width, this.upstairsImg.height,
									this.imgX, this.imgY, this.upstairsImg.width, this.upstairsImg.height);
					}
					break;
				case 8:
					//Print DOWNSTAIRS
					if( theGame.downstairsImgLoaded != 0 ) {
						ctx.drawImage(this.downstairsImg, 
									0, 0, this.downstairsImg.width, this.downstairsImg.height,
									this.imgX, this.imgY, this.downstairsImg.width, this.downstairsImg.height);
					}
					break;
				default:
					console.info("ERROR: Map Drawing");
					break;
			}
		}
		theGame.onesPlace = 0;
		for( var i = 240; i < 360; i++ ) { //Draws the 3rd row of rooms
			theGame.CalculateCoords(i-240, 2);
			switch( cMap[i] ) {
				case 0:
					ctx.fillRect(this.imgX, this.imgY, 32, 32);
					break;
				case 1:
					//Print WALL
					if( theGame.wallImgLoaded != 0 ) {
						ctx.drawImage(this.wallImg, 
									0, 0, this.wallImg.width, this.wallImg.height,
									this.imgX, this.imgY, this.wallImg.width, this.wallImg.height);
					}
					break;
				case 2:
					//Print PLAYER
					if( theGame.playerImgLoaded != 0 ) {
						ctx.drawImage(this.playerImg, 
									0, 0, this.playerImg.width, this.playerImg.height,
									this.imgX, this.imgY, this.playerImg.width, this.playerImg.height);
					}
					break;
				case 3:
					//Print ENEMY
					if( theGame.enemyImgLoaded != 0 ) {
						ctx.drawImage(this.enemyImg, 
									0, 0, this.enemyImg.width, this.enemyImg.height,
									this.imgX, this.imgY, this.enemyImg.width, this.enemyImg.height);
					}
					break;
				case 4:
					//Print GOLD
					if( theGame.goldImgLoaded != 0 ) {
						ctx.drawImage(this.goldImg, 
									0, 0, this.goldImg.width, this.goldImg.height,
									this.imgX, this.imgY, this.goldImg.width, this.goldImg.height);
					}
					break;
				case 5:
					//Print POTION
					if( theGame.potionImgLoaded != 0 ) {
						ctx.drawImage(this.potionImg, 
									0, 0, this.potionImg.width, this.potionImg.height,
									this.imgX, this.imgY, this.potionImg.width, this.potionImg.height);
					}
					break;
				case 6:
					//Print PRIZE
					if( theGame.prizeImgLoaded != 0 ) {
						ctx.drawImage(this.prizeImg, 
									0, 0, this.prizeImg.width, this.prizeImg.height,
									this.imgX, this.imgY, this.prizeImg.width, this.prizeImg.height);
					}
					break;
				case 7:
					//Print UPSTAIRS
					if( theGame.upstairsImgLoaded != 0 ) {
						ctx.drawImage(this.upstairsImg, 
									0, 0, this.upstairsImg.width, this.upstairsImg.height,
									this.imgX, this.imgY, this.upstairsImg.width, this.upstairsImg.height);
					}
					break;
				case 8:
					//Print DOWNSTAIRS
					if( theGame.downstairsImgLoaded != 0 ) {
						ctx.drawImage(this.downstairsImg, 
									0, 0, this.downstairsImg.width, this.downstairsImg.height,
									this.imgX, this.imgY, this.downstairsImg.width, this.downstairsImg.height);
					}
					break;
				default:
					console.info("ERROR: Map Drawing");
					break;
			}
		}
		theGame.onesPlace = 0;
		for( var i = 360; i <= 509; i++ ) { //Draws the 4th row of rooms
			theGame.CalculateCoords(i-360, 3);
			switch( cMap[i] ) {
				case 0:
					ctx.fillRect(this.imgX, this.imgY, 32, 32);
					break;
				case 1:
					//Print WALL
					if( theGame.wallImgLoaded != 0 ) {
						ctx.drawImage(this.wallImg, 
									0, 0, this.wallImg.width, this.wallImg.height,
									this.imgX, this.imgY, this.wallImg.width, this.wallImg.height);
					}
					break;
				case 2:
					//Print PLAYER
					if( theGame.playerImgLoaded != 0 ) {
						ctx.drawImage(this.playerImg, 
									0, 0, this.playerImg.width, this.playerImg.height,
									this.imgX, this.imgY, this.playerImg.width, this.playerImg.height);
					}
					break;
				case 3:
					//Print ENEMY
					if( theGame.enemyImgLoaded != 0 ) {
						ctx.drawImage(this.enemyImg, 
									0, 0, this.enemyImg.width, this.enemyImg.height,
									this.imgX, this.imgY, this.enemyImg.width, this.enemyImg.height);
					}
					break;
				case 4:
					//Print GOLD
					if( theGame.goldImgLoaded != 0 ) {
						ctx.drawImage(this.goldImg, 
									0, 0, this.goldImg.width, this.goldImg.height,
									this.imgX, this.imgY, this.goldImg.width, this.goldImg.height);
					}
					break;
				case 5:
					//Print POTION
					if( theGame.potionImgLoaded != 0 ) {
						ctx.drawImage(this.potionImg, 
									0, 0, this.potionImg.width, this.potionImg.height,
									this.imgX, this.imgY, this.potionImg.width, this.potionImg.height);
					}
					break;
				case 6:
					//Print PRIZE
					if( theGame.prizeImgLoaded != 0 ) {
						ctx.drawImage(this.prizeImg, 
									0, 0, this.prizeImg.width, this.prizeImg.height,
									this.imgX, this.imgY, this.prizeImg.width, this.prizeImg.height);
					}
					break;
				case 7:
					//Print UPSTAIRS
					if( theGame.upstairsImgLoaded != 0 ) {
						ctx.drawImage(this.upstairsImg, 
									0, 0, this.upstairsImg.width, this.upstairsImg.height,
									this.imgX, this.imgY, this.upstairsImg.width, this.upstairsImg.height);
					}
					break;
				case 8:
					//Print DOWNSTAIRS
					if( theGame.downstairsImgLoaded != 0 ) {
						ctx.drawImage(this.downstairsImg, 
									0, 0, this.downstairsImg.width, this.downstairsImg.height,
									this.imgX, this.imgY, this.downstairsImg.width, this.downstairsImg.height);
					}
					break;
				default:
					console.info("ERROR: Map Drawing. When i = " + i);
					break;
			}
		}
		theGame.onesPlace = 0;
		/*
		//Just for testing how the drawing works, it's commented so the game looks normal. -Dorover
		theGame.CalculateCoords(480-360, 3);
		ctx.drawImage(this.prizeImg, 0, 0, this.prizeImg.width, this.prizeImg.height, 30, 600, this.prizeImg.width, this.prizeImg.height);
		theGame.onesPlace = 0;
		*/
		//Draw the stats (health, score)
		if(this.healthbarImgLoaded != 0) {
			ctx.drawImage(this.healthbarImg, 0, 0, this.healthbarImg.width, this.healthbarImg.height, 20, 570, this.healthbarImg.width, this.healthbarImg.height);
		}
		//Health
		ctx.beginPath();
		ctx.rect(98, 582, (133 * (Player.health/Player.maxHealth)), 21);
		ctx.fillStyle = "Green";
		ctx.fill();
		ctx.beginPath();
		ctx.rect(97, 581, 135, 23);
		ctx.stroke();
		ctx.font = "20px Arial";
		ctx.fillStyle = "Green";
		ctx.textAlign = "left";
		ctx.fillText("Health", 30, 600);
		ctx.font = "20px Arial";
		ctx.fillStyle = "White";
		ctx.textAlign = "left";
		ctx.fillText(Player.health, 125, 600);
		ctx.fillText("/", 165, 600)
		ctx.fillText(Player.maxHealth, 175, 600);
		//Score
		if(this.healthbarImgLoaded != 0) {
			ctx.drawImage(this.healthbarImg, 0, 0, this.healthbarImg.width, this.healthbarImg.height, 713, 570, this.healthbarImg.width, this.healthbarImg.height);
		}
		ctx.font = "20px Arial";
		ctx.fillStyle = "Yellow";
		ctx.textAlign = "left";
		ctx.fillText("Score", 723, 600);
		ctx.font = "20px Arial";
		ctx.fillStyle = "White";
		ctx.textAlign = "left";
		ctx.fillText(this.score, 818, 600);

	},

	ProcessInput : function(event) {
		switch(event.keyCode) {
			//Left
            case 37:
				if( !Player.collisionCheck("left") ) {
					Player.movePlayer("left");
					theGame.MoveEnemies();
				}
				break;
            //Right
            case 39:
				if( !Player.collisionCheck("right") ) {
					Player.movePlayer("right");
					theGame.MoveEnemies();
				}
				break;
            //Up
            case 38:
				if( !Player.collisionCheck("up") ) {
					Player.movePlayer("up");
					theGame.MoveEnemies();
				}
				break;
            //Down
            case 40:
				if( !Player.collisionCheck("down") ) {
					Player.movePlayer("down");
					theGame.MoveEnemies();
				}
				break;
			default:
				break;
		}
	},
	
	UpdateState : function() {
		//If true Update Game
		if ( theGame.gameState == theGame.STATE_PLAYING ) {
            return;
		} else if( theGame.gameState == theGame.STATE_PROCESS_TURN ) {
			theGame.ProcessTurn();
		} else if( theGame.gameState == theGame.STATE_GAMEOVER ) {
			return; //MAY NOT BE A GOOD IDEA.
        } else {
			//ERROR
			console.info("ERROR: Update State");
		}
	},
};

//EVENT LISTENERS
window.addEventListener("keydown", doKeydown, false);


function doKeydown(e) {
	theGame.ProcessInput(e);
	//console.info("Enemy locations are: " + enemyLocationsArray);
}

window.onload = function() {	
	// Initialize the game
	theGame.Init();
	// Run the game (start the game loop)
	runGame();
};

function runGame() { 
	theGame.UpdateGame();
	//theGame.UpdateState();
	requestAnimationFrame(runGame);
};