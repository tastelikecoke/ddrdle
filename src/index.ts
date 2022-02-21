import 'phaser';

let beatlength = 3200;
let offset = 1633;
let globalPressEvent = 0;
let globalShareText = "";
let beats = [
	{time: offset, dir: 1},
	{time: offset+beatlength*1, dir: 2},
	{time: offset+beatlength*2, dir: 4},
	{time: offset+beatlength*3, dir: 8},
	{time: offset+beatlength*4, dir: 1},
	{time: offset+beatlength*5, dir: 2},
	{time: offset+beatlength*6, dir: 4},
	{time: offset+beatlength*7, dir: 8}
]

class FirstScene extends Phaser.Scene {
  private timeOffset: number = 0;
  private musicOffset: number = 0;
  private hasPopup: boolean = false;
  private shareString: string = "";
  private score: number = 0;
  private maxScore: number = 0;
  private leftgrey: any;
  private downgrey: any;
  private upgrey: any;
  private rightgrey: any;
  private left: any;
  private down: any;
  private up: any;
  private right: any;
  private timeText: any;
  private soundmaker: any;
  private started: boolean = false;
  private pressEvent: any;
  private currentBeats: any;
  private unhit: boolean = false;
	constructor() {
		super({
			key: 'FirstScene'
		});
	}
  preload(): void {
		this.load.image('blank', 'img/blank.png');
		this.load.image('arrowgrey', 'img/arrowgrey.png');
		this.load.image('arrow', 'img/arrow.png');
		this.load.audio('mainaudio', 'audio/resaruto1.mp3');
  }
  create(): void {
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
		
		this.timeText = this.add.text(100, 180, 'PRESS TO START', {font: '32px Arial', color: '#999999'});
		this.musicOffset = 0;
	
		this.soundmaker = this.sound.add('mainaudio');

		var startFunc = function(scene): Function{
			return function(){
				if(scene.started) return;
				scene.started = true;
				scene.soundmaker.play();
				scene.timeText.x = 1000;
			}
		}(this);
		this.pressEvent = 0;

		this.input.on('pointerdown', startFunc);
		this.input.keyboard.on('keydown', function(scene){
			return function(event: Phaser.Input.Keyboard.Key){
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
  }
  update(time: number, delta: number): void {
		if(this.soundmaker.seek * 1000 > offset+beatlength*9 && !this.hasPopup)
		{
			this.hasPopup = true;
			this.shareString = "DDRdle " + this.score.toString() + "/" + this.maxScore.toString() + "\n" + this.shareString;
			this.shareString += "\ntastelikecoke.github.io/ddrdle";
      document.getElementById("modal")!.style.display = "block";
      document.getElementById("result")!.innerHTML = this.score.toString() + "/" + this.maxScore.toString();
			//document.getElementById("result").innerHTML = this.shareString.replaceAll("\n","<br />");
			globalShareText = this.shareString;
		}
		if(this.currentBeats.length == 0) return;
		var currentBeatDistance = this.soundmaker.seek*1000 - this.currentBeats[0].time;
		if(globalPressEvent != 0)
		{
			this.pressEvent = globalPressEvent;
			globalPressEvent = 0;
		}
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

		function colorButtons(scene: FirstScene, color: string) {
			var square = "⬜";
			if(color == "green") square = "🟩";
			if(color == "yellow") square = "🟨";
			if(color == "grey") square = "⬛";
			document.getElementById("left")!.style.backgroundColor = "white";
			document.getElementById("down")!.style.backgroundColor = "white";
			document.getElementById("up")!.style.backgroundColor = "white";
			document.getElementById("right")!.style.backgroundColor = "white";
			if(scene.currentBeats[0].dir % 2 == 1)
			{
				document.getElementById("left")!.style.backgroundColor = color;
				scene.shareString += square;
			}
			else
			{
				scene.shareString += "⬜";
			}
			if(Math.floor(scene.currentBeats[0].dir / 2) % 2 == 1)
			{
				document.getElementById("down")!.style.backgroundColor = color;
				scene.shareString += square;
			}
			else
			{
				scene.shareString += "⬜";
			}
			if(Math.floor(scene.currentBeats[0].dir / 4) % 2 == 1)
			{
				document.getElementById("up")!.style.backgroundColor = color;
				scene.shareString += square;
			}
			else
			{
				scene.shareString += "⬜";
			}
			if(Math.floor(scene.currentBeats[0].dir / 8) % 2 == 1)
			{
				document.getElementById("right")!.style.backgroundColor = color;
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
					this.unhit = false;
					this.pressEvent = 0;
					colorButtons(this, "grey");
				}
			}
			if(30 < Math.abs(currentBeatDistance) && Math.abs(currentBeatDistance) < 100)
			{
				if(this.pressEvent == this.currentBeats[0].dir)
				{
					this.unhit = false;
					this.pressEvent = 0;
					this.score += 50;
					colorButtons(this, "yellow");
				}
				else if(this.pressEvent != 0)
				{
					this.unhit = false;
					this.pressEvent = 0;
					colorButtons(this, "grey");
				}
			}
			if(0 < Math.abs(currentBeatDistance) && Math.abs(currentBeatDistance) < 30)
			{
				if(this.pressEvent == this.currentBeats[0].dir)
				{
					this.unhit = false;
					this.pressEvent = 0;
					this.score += 100;
					colorButtons(this, "green");
				}
				else if(this.pressEvent != 0)
				{
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
}

class DdrdleGame {
	constructor() {
		var config: Phaser.Types.Core.GameConfig = {
			type: Phaser.AUTO,
			width: 480,
			height: 360,
			parent: "phaser-game",
			physics: {
				default: 'arcade',
			},
			scene: [FirstScene,]
		};
		var game = new Phaser.Game(config);
	}
}

var buttonPress = function(number: number){
  return function(){
    globalPressEvent = globalPressEvent | number;
  }
}
var share = function()
{
  document.getElementById("input-hidden")!.innerHTML = globalShareText;
  var copyText = document.querySelector("#input-hidden");
  //copyText!.select();
  document.execCommand("copy");
  document.getElementById("share")!.innerText = "Copied!";
  setInterval(function(){
    document.getElementById("share")!.innerText = "Share";
  },1000);
}
var infoPop = function()
{
  document.getElementById("modal-2")!.style.display = "block";
}
var infoHide = function()
{
  document.getElementById("modal-2")!.style.display = "none";
}
var resize = function()
{
  var mainWidth = document.getElementById("phaser-game")!.offsetWidth;
  console.log(mainWidth);
  var maxedWidth = Math.min(mainWidth, 480);
  var canvasElement = document.getElementsByTagName('canvas');
  if(canvasElement != null) {
    var canvasElementFirstItem = canvasElement.item(0);
    if(canvasElementFirstItem != null)
      canvasElementFirstItem.style.transform = "scale("+ (maxedWidth/480).toString() + ") translateX(" + ((maxedWidth - 480)/1.5).toString() + "px)";
  }
}

window.onload = () => {
	var game = new DdrdleGame();
  window.addEventListener("DOMContentLoaded", resize);
  window.addEventListener("resize", resize);
  document.getElementById("up")!.onclick = buttonPress(4);
  document.getElementById("left")!.onclick = buttonPress(1);
  document.getElementById("right")!.onclick = buttonPress(8);
  document.getElementById("down")!.onclick = buttonPress(2);
  document.getElementById("share")!.onclick = share;
  document.getElementById("infoHide")!.onclick = infoHide;

}
