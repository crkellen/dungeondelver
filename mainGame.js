/*!
 * mainGame.js
 * Author: Lutz Kellen - http://lutzkellen.com/
 * Last Modified: 5-5-2016
 * Additional Authors: Marko Vehmas (4-25-2016)
 * Dungeon Delver Rodney Main Program Code
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
//In order: Empty, Wall, Player, Enemy, Gold, Potion, Prize, -Upstairs-, Downstairs, Doorway
//Image File Names
PLAYER_IMG_SRC  	= 'playerImg.png';
WALL_IMG_SRC 		= 'wall2Img.png';
ENEMY_IMG_SRC 	 	= 'enemyImg.png';
POTION_IMG_SRC 	 	= 'healthPotionImg.png';
GOLD_IMG_SRC 		= 'goldImg.png'; 		//exists because of Marko
PRIZE_IMG_SRC 	 	= 'prizeImg.png';  		//exists because of Marko
//UPSTAIRS_IMG_SRC 	= 'upStairsImg.png';
DOWNSTAIRS_IMG_SRC 	= 'downStairsImg.png';

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
	
	collisionCheck : function(dir) {
		if( dir === "left" ) {
			switch( cMap[this.pos - 1] ) {
				case 0:
					return false;
					break;
				case 1:
					return true;
					break;
				case 3:
					//ATTACK
					cMap[this.pos - 1] = 0;
					return true;
					break;
				case 4:
					//GET GOLD
					return false;
					break;
				case 5:
					//HEAL
					return false;
					break;
				case 7:
					return true;
					break;
				case 8:
					//GO DOWNSTAIRS (REGEN ROOM)
					theGame.GenerateMap();
					theGame.GenerateActors();
					theGame.CombineMaps();
					cMap[119] = 1;
					return false;
					break;
				default: console.log("ERROR: Collision Check"); break;
			}
		} else if( dir === "right" ) {
			switch( cMap[this.pos + 1] ) {
				case 0:
					return false;
					break;
				case 1:
					return true;
					break;
				case 3:
					//ATTACK
					cMap[this.pos + 1] = 0;
					return true;
					break;
				case 4:
					//GET GOLD
					return false;
					break;
				case 5:
					//HEAL
					return false;
					break;
				case 7:
					return true;
					break;
				case 8:
					//GO DOWNSTAIRS (REGEN ROOM)
					theGame.GenerateMap();
					theGame.GenerateActors();
					theGame.CombineMaps();
					cMap[119] = 1;
					return false;
					break;
				default: console.log("ERROR: Collision Check"); break;
			}
		} else if( dir === "up" ) {
			switch( cMap[this.pos - 30] ) {
				case 0:
					return false;
					break;
				case 1:
					return true;
					break;
				case 3:
					//ATTACK
					cMap[this.pos - 30] = 0;
					return true;
					break;
				case 4:
					//GET GOLD
					return false;
					break;
				case 5:
					//HEAL
					return false;
					break;
				case 7:
					return true;
					break;
				case 8:
					//GO DOWNSTAIRS (REGEN ROOM)
					theGame.GenerateMap();
					theGame.GenerateActors();
					theGame.CombineMaps();
					cMap[119] = 1;
					return false;
					break;
				default: console.log("ERROR: Collision Check"); break;
			}
		} else if( dir === "down" ) {			
			switch( cMap[this.pos + 30] ) {
				case 0:
					return false;
					break;
				case 1:
					return true;
					break;
				case 3:
					//ATTACK
					cMap[this.pos + 30] = 0;
					return true;
					break;
				case 4:
					//GET GOLD
					return false;
					break;
				case 5:
					//HEAL
					return false;
					break;
				case 7:
					return true;
					break;
				case 8:
					//GO DOWNSTAIRS (REGEN ROOM)
					theGame.GenerateMap();
					theGame.GenerateActors();
					theGame.CombineMaps();
					cMap[119] = 1;
					return false;
					break;
				default:
					console.log("ERROR: Collision Check");
					break;
			}
		} else {
			console.log("ERROR: Collision Direction");
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
		
		theGame.GenerateMap();
		theGame.GenerateActors();
		theGame.CombineMaps();
		cMap[119] = 1;
		
		gameCanvas.style.display = 'inline';
		
		this.isInitialized = 1;
	},
	
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
		
		//console.log("Map at Index #" + ((mapIndexY*30)+mapIndexX) + " is " + map4[(mapIndexY*30)+mapIndexX]);
		var roomNum = 0;
		var previousRoom = 0;
		var mapIndexX = 0;
		var MapIndexY = 0;
		var pivotRoomMade = 0;
		
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
								default: console.log("ERROR: Room 1"); break;
							}
							//console.log(mapIndexX);
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
								default: console.log("ERROR: Room 1"); break;
							}
							//console.log(mapIndexX);
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
								default: console.log("ERROR: Room 2"); break;
							}
							//console.log(mapIndexX);
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
								default: console.log("ERROR: Room 2"); break;
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
								default: console.log("ERROR: Room 2"); break;
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
								default: console.log("ERROR: Room 2"); break;
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
								default: console.log("ERROR: Room 3"); break;
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
								default: console.log("ERROR: Room 3"); break;
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
								default: console.log("ERROR: Room 4"); break;
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
								default: console.log("ERROR: Room 4"); break;
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
								default: console.log("ERROR: Room 5"); break;
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
								default: console.log("ERROR: Room 5"); break;
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
								default: console.log("ERROR: Room 6"); break;
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
								default: console.log("ERROR: Room 6"); break;
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
								default: console.log("ERROR: Room 7"); break;
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
								default: console.log("ERROR: Room 7"); break;
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
								default: console.log("ERROR: Room 8"); break;
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
								default: console.log("ERROR: Room 8"); break;
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
								default: console.log("ERROR: Room 9"); break;
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
								default: console.log("ERROR: Room 9"); break;
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
								default: console.log("ERROR: Room 10"); break;
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
								default: console.log("ERROR: Room 10"); break;
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
								default: console.log("ERROR: Room 11"); break;
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
								default: console.log("ERROR: Room 11"); break;
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
								default: console.log("ERROR: Room 12"); break;
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
								default: console.log("ERROR: Room 12"); break;
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
								default: console.log("ERROR: Room 13"); break;
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
								default: console.log("ERROR: Room 13"); break;
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
								default: console.log("ERROR: Room 14"); break;
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
								default: console.log("ERROR: Room 14"); break;
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
								default: console.log("ERROR: Room 15"); break;
							}
							//console.log(mapIndexX);
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
								default: console.log("ERROR: Room 15"); break;
							}
						}
					}
					break;
				default:
					console.log("ERROR: Map Generation (Rooms)");
					break;
			}
			roomNum++;
		}
	},
	
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
				default: console.log("ERROR: Map Stairs"); break;
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
						placedEnemies++;
					}
					break;
				case 2:
					if( map2[randNum] === 0 ) {
						//PLACE ENEMY
						map2[randNum] = 3;
						placedEnemies++;
					}
					break;
				case 3:
					if( map3[randNum] === 0 ) {
						//PLACE ENEMY
						map3[randNum] = 3;
						placedEnemies++;
					}
					break;
				case 4:
					if( map4[randNum] === 0 ) {
						//PLACE ENEMY
						map4[randNum] = 3;
						placedEnemies++;
					}
					break;
				default: console.log("ERROR: Map Enemies"); break;
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
				default: console.log("ERROR: Map Gold"); break;
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
				default: console.log("ERROR: Map Potion"); break;
			}
		}
	},
	
	//FIX THE MATH - (It's done. -Dorover)
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
				console.log("ERROR: Combine Maps");
			}
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
		ctx.fillStyle = "#333333";
        ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
		//Print the map[]
		for( var i = 0; i < 120; i++ ) {
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
					//console.log("ERROR: Map Drawing"); 
					break;
			}
		}
		theGame.onesPlace = 0;
		for( var i = 120; i < 240; i++ ) {
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
					console.log("ERROR: Map Drawing");
					break;
			}
		}
		theGame.onesPlace = 0;
		for( var i = 240; i < 360; i++ ) {
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
					console.log("ERROR: Map Drawing");
					break;
			}
		}
		theGame.onesPlace = 0;
		for( var i = 360; i <= 509; i++ ) {
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
					console.log("ERROR: Map Drawing. When i = " + i);
					break;
			}
		}
		theGame.onesPlace = 0;
		
	},

	ProcessInput : function(event) {
		switch(event.keyCode) {
			//Left
            case 37:
				if( !Player.collisionCheck("left") ) {
					Player.movePlayer("left");	
				}
				break;
            //Right
            case 39:
				if( !Player.collisionCheck("right") ) {
					Player.movePlayer("right");	
				}
				break;
            //Up
            case 38:
				if( !Player.collisionCheck("up") ) {
					Player.movePlayer("up");	
				}
				break;
            //Down
            case 40:
				if( !Player.collisionCheck("down") ) {
					Player.movePlayer("down");	
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
			console.log("ERROR: Update State");
		}
	},
};

//EVENT LISTENERS
window.addEventListener("keydown", doKeydown, false);


function doKeydown(e) {
	theGame.ProcessInput(e);
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