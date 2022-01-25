

var Music = {
	init: function(scene)
	{
	},
	play: function()
	{
		this.sound.play();
	}
}

var beatlength = 3200;
var offset = 1633;
var globalPressEvent = 0;
var globalShareText = "";
var beats = [
	{time: offset, dir: 1},
	{time: offset+beatlength*1, dir: 2},
	{time: offset+beatlength*2, dir: 4},
	{time: offset+beatlength*3, dir: 8},
	{time: offset+beatlength*4, dir: 1},
	{time: offset+beatlength*5, dir: 2},
	{time: offset+beatlength*6, dir: 4},
	{time: offset+beatlength*7, dir: 8}
]

var Scene1 = new Phaser.Class({
	initialize: function Scene1()
	{

	},
	preload: function()
	{
		this.load.image('blank', 'img/blank.png');
		this.load.image('arrowgrey', 'img/arrowgrey.png');
		this.load.image('arrow', 'img/arrow.png');
		this.load.audio('mainaudio', 'audio/resaruto1.mp3');
	},
	
	create: function()
	{
		this.add.image(0, 0, "blank").setOrigin(0,0).setScale(20, 15);
		var rectsize = 64; 
		var margin = (480-rectsize*4)/2 + rectsize/2;
	
		this.leftgrey = this.add.image(margin + rectsize*0, 48, "arrowgrey").setScale(0.5);
		this.leftgrey.angle = 0;
		this.downgrey = this.add.image(margin + rectsize*1, 48, "arrowgrey").setScale(0.5);
		this.downgrey.angle = 270;
		this.upgrey = this.add.image(margin + rectsize*2, 48, "arrowgrey").setScale(0.5);
		this.upgrey.angle = 90;
		this.rightgrey = this.add.image(margin + rectsize*3, 48, "arrowgrey").setScale(0.5);
		this.rightgrey.angle = 180;
		
		var farDistance = 1000;
		this.left = this.add.image(margin + rectsize*0, farDistance, "arrow").setScale(0.5);
		this.left.angle = 0;
		this.down = this.add.image(margin + rectsize*1, farDistance, "arrow").setScale(0.5);
		this.down.angle = 270;
		this.up = this.add.image(margin + rectsize*2, farDistance, "arrow").setScale(0.5);
		this.up.angle = 90;
		this.right = this.add.image(margin + rectsize*3, farDistance, "arrow").setScale(0.5);
		this.right.angle = 180;
		
		this.timeText = this.add.text(100, 180, 'PRESS TO START', {font: '32px Arial', fill: '#999999'});
		this.musicOffset = 0;
	
		this.sound = this.sound.add('mainaudio');

		var startFunc = function(scene){
			return function(){
				if(scene.started) return;
				scene.started = true;
				scene.sound.play();
				scene.timeText.x = 1000;
			}
		}(this);
		this.pressEvent = 0;

		this.input.on('pointerdown', startFunc);
		this.input.keyboard.on('keydown', function(scene){
			return function(event){
				if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.LEFT)
				{
					scene.pressEvent = scene.pressEvent | 1;
				}
				if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.DOWN)
				{
					scene.pressEvent = scene.pressEvent | 2;
				}
				if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.UP)
				{
					scene.pressEvent= scene.pressEvent | 4;
				}
				if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.RIGHT)
				{
					scene.pressEvent= scene.pressEvent | 8;
				}
			}
		}(this));

		this.currentBeats = beats;
		this.unhit = true;
		this.shareString = "";
		this.score = 0;
		this.maxScore = this.currentBeats.length * 100;
		this.hasPopup = false;
	},
	buttonPress: function(number)
	{
		this.pressEvent = this.pressEvent | number;
	},
	
	update: function (time, delta)
	{
		this.time = time;
		if(this.sound.seek*1000 > offset+beatlength*9 && !this.hasPopup)
		{
			this.hasPopup = true;
			this.shareString = "DDRdle " + this.score.toString() + "/" + this.maxScore.toString() + "\n" + this.shareString;
			this.shareString += "\ntastelikecoke.github.com/ddrdle"
			document.getElementById("modal").style.display = "block";
			document.getElementById("result").innerHTML = this.score.toString() + "/" + this.maxScore.toString();
			//document.getElementById("result").innerHTML = this.shareString.replaceAll("\n","<br />");
			globalShareText = this.shareString;
		}
		if(this.currentBeats.length == 0) return;
		var currentBeatDistance = this.sound.seek*1000 - this.currentBeats[0].time;
		if(globalPressEvent != 0)
		{
			this.pressEvent = globalPressEvent;
			globalPressEvent = 0;
		}
		console.log(this.pressEvent);
		if(this.currentBeats[0].dir % 2 == 1)
		{
			this.left.y = 48 + (-currentBeatDistance) / 2.5;
			if(!this.unhit) this.left.y = 1000;
		}
		if(Math.floor(this.currentBeats[0].dir / 2) % 2 == 1)
		{
			this.down.y = 48 + (-currentBeatDistance) / 2.5;
			if(!this.unhit) this.down.y = 1000;
		}
		if(Math.floor(this.currentBeats[0].dir / 4) % 2 == 1)
		{
			this.up.y = 48 + (-currentBeatDistance) / 2.5;
			if(!this.unhit) this.up.y = 1000;
		}
		if(Math.floor(this.currentBeats[0].dir / 8) % 2 == 1)
		{
			this.right.y = 48 + (-currentBeatDistance) / 2.5;
			if(!this.unhit) this.right.y = 1000;
		}

		function colorButtons(scene, color)
		{
			var square = "⬜";
			if(color == "green") square = "🟩";
			if(color == "yellow") square = "🟨";
			if(color == "grey") square = "⬛";
			document.getElementById("left").style.backgroundColor = "white";
			document.getElementById("down").style.backgroundColor = "white";
			document.getElementById("up").style.backgroundColor = "white";
			document.getElementById("right").style.backgroundColor = "white";
			if(scene.currentBeats[0].dir % 2 == 1)
			{
				document.getElementById("left").style.backgroundColor = color;
				scene.shareString += square;
			}
			else
			{
				scene.shareString += "⬜";
			}
			if(Math.floor(scene.currentBeats[0].dir / 2) % 2 == 1)
			{
				document.getElementById("down").style.backgroundColor = color;
				scene.shareString += square;
			}
			else
			{
				scene.shareString += "⬜";
			}
			if(Math.floor(scene.currentBeats[0].dir / 4) % 2 == 1)
			{
				document.getElementById("up").style.backgroundColor = color;
				scene.shareString += square;
			}
			else
			{
				scene.shareString += "⬜";
			}
			if(Math.floor(scene.currentBeats[0].dir / 8) % 2 == 1)
			{
				document.getElementById("right").style.backgroundColor = color;
				scene.shareString += square;
			}
			else
			{
				scene.shareString += "⬜";
			}
			scene.shareString += "\n";
		}

		if(this.unhit)
		{
			if(100 < Math.abs(currentBeatDistance) && Math.abs(currentBeatDistance) < 400)
			{
				if(this.pressEvent != 0)
				{
					console.log("miss");
					this.unhit = false;
					this.pressEvent = 0;
					colorButtons(this, "grey");
				}
			}
			if(30 < Math.abs(currentBeatDistance) && Math.abs(currentBeatDistance) < 100)
			{
				if(this.pressEvent == this.currentBeats[0].dir)
				{
					console.log("hit");
					this.unhit = false;
					this.pressEvent = 0;
					this.score += 50;
					colorButtons(this, "yellow");
				}
				else if(this.pressEvent != 0)
				{
					console.log("miss");
					this.unhit = false;
					this.pressEvent = 0;
					colorButtons(this, "grey");
				}
			}
			if(0 < Math.abs(currentBeatDistance) && Math.abs(currentBeatDistance) < 30)
			{
				if(this.pressEvent == this.currentBeats[0].dir)
				{
					console.log("perfect");
					this.unhit = false;
					this.pressEvent = 0;
					this.score += 100;
					colorButtons(this, "green");
				}
				else if(this.pressEvent != 0)
				{
					console.log("miss");
					this.unhit = false;
					this.pressEvent = 0;
					colorButtons(this, "grey");
				}
			}
		}
		if(currentBeatDistance > 1000)
		{
			this.currentBeats.shift();
			if(this.unhit)
			{
				colorButtons(this, "white");
			}
			this.unhit = true;
			this.left.setScale(0.5);
		}
		this.pressEvent = 0;
	}
	
});

var config = {
	type: Phaser.AUTO,
	width: 480,
	height: 360,
	parent: document.getElementById("phaser-game"),
	physics: {
		default: 'arcade',
	},
	scene: [Scene1,]
}

var buttonPress = function(number){
	console.log("pressed");
	globalPressEvent = globalPressEvent | number;
	return function(){
	}
}

var share = function()
{
	navigator.clipboard.writeText(globalShareText);
	var popup = document.getElementById("myPopup");
	popup.classList.toggle("show");
}

var game = new Phaser.Game(config);