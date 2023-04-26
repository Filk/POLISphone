let whatToDisplay = 0; //switch case to display
let novoMapa; //image file for new map
const arraySonicSpots = []; //array for each sonic spot object
const quantosSonicSpots = 8; // how many sonic spots
let coordenadasIniciaisSpots = [
  //x and y initial coordinates of spots
  [620, 430], //batalha
  [347, 127], //bolhão
  [654, 79], //casa da música
  [56, 112], //metro
  [211, 357], //parque da cidade
  [45, 557], //riberi
  [555, 190], //santa catarina
  [330, 481], //serralves
];

//create array of sonic spots objects
for (let j = 0; j < quantosSonicSpots; j++) {
  //shallow copy of sonic spot object
  arraySonicSpots[j] = { ...sonicSpot };
  arraySonicSpots[j].indexSpot = j;
  arraySonicSpots[j].positionX = coordenadasIniciaisSpots[j][0];
  arraySonicSpots[j].positionY = coordenadasIniciaisSpots[j][1];
}

let mostraNaoMostra = false; //shows all sonic spots or not
let moveSonicSpot = false; //deals with freeze and unfreeze
let mySounds = []; //array for sounds

let inputSound; //simulates click on icon

//stuff to record sound and playback
let gravacao, recorder;
let aGravar = false;
let aTocar = false;

const soundFileNames = [
  "extras/Batalha.mp3",
  "extras/Bolhao.mp3",
  "extras/CasaMusica.mp3",
  "extras/Metro.mp3",
  "extras/parquedacidade.mp3",
  "extras/Ribeira.mp3",
  "extras/SantaCatarina.mp3",
  "extras/Serralves.mp3",
];

let temporarySoundForSafari = ["0", "1", "2", "3", "4", "5", "6", "7"];

//preload p5js stuff: image map and sounds
function preload() {
  novoMapa = loadImage("extras/sonodia.jpg");
  soundFormats("mp3");
  for (let i = 0; i < quantosSonicSpots; i++) {
    mySounds.push(loadSound(soundFileNames[i]));
    mySounds[i].playMode("restart");
    mySounds[i].setLoop(true);
  }
}

//p5js setup
function setup() {
  //ignores retina and pixels stuff
  pixelDensity(1);

  // mimics the autoplay policy
  getAudioContext().suspend();

  const myCanvas = createCanvas(800, 600);

  //puts everything 10% bellow the top margin
  let h = Math.round(window.Height * 0.1);
  let inn = document.getElementsByClassName("columnCima");
  for (var i = 0; i < inn.length; i++) {
    inn[i].style.marginTop = h + "px";
  }

  // puts myCanvas on the specific html container
  myCanvas.parent("myContainer");
  // triggers this function whenever something is dropped on the canvas
  myCanvas.drop(gotMapaFile);
  //creates a new p5sound file to be recorded
  gravacao = new p5.SoundFile();
  //callback function to be called when recording reaches the end
  gravacao.onended(parouTocarGravacao);
  recorder = new p5.SoundRecorder();
  //nothing inside setInput means all the sound emerging from the canvas
  recorder.setInput();
}

function draw() {
  switch (whatToDisplay) {
    case 0:
      StartButton(); //beggining
      break;
    case 1:
      newSoundUserAudio(); //new sound arrived
      break;
    case 2:
      //whileLoading sound
      background(136, 216, 176);
      fill(100);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("loading sound...", width / 2, height / 2);
      break;
    case 3:
      //polisphone below
      background(0);
      image(novoMapa, 0, 0, 800, 600); //image map
      stroke(0); //border
      strokeWeight(1); //border
      line(0, 0, width, 0); //border
      line(0, 0, 0, height); //border
      line(width, 0, width, height); //border
      line(0, height, width, height); //border
      noStroke();

      //deals with the sonic spot objects
      for (let i = 0; i < quantosSonicSpots; i++) {
        arraySonicSpots[i].desenhaCirculo();
        arraySonicSpots[i].sabeDistancia();
        arraySonicSpots[i].moveLocation();
        arraySonicSpots[i].playSound();
      }

      //deals with sonics spots to move
      if (mostraNaoMostra) {
        for (let i = 0; i < quantosSonicSpots; i++) {
          arraySonicSpots[i].tamanhoCirculo = 100;
          arraySonicSpots[i].freezeSpot = true;
        }
        //deals with freeze and unfreeze
        moveSonicSpot = true;
      } else if (!mostraNaoMostra && moveSonicSpot) {
        for (let i = 0; i < quantosSonicSpots; i++) {
          arraySonicSpots[i].freezeSpot = false;
          moveSonicSpot = false;
        }
      }
      break;
    case 4:
      newDownload(); //after downloading polisphoneproject
      break;
    case 5:
      newCancel(); //if cancel button is pressed
      break;
    case 6:
      newProjectLoaded(); //if polisphone project is loaded button is pressed
      break;
    case 7:
      playingRecordedMusic(); //if polisphone project is playing what one´s recorded
      break;
  }
}

//start menu to get the click needed to start the audio
function StartButton() {
  background(136, 216, 176);
  rectMode(CENTER);
  const buttonWidth = 200;
  const buttonHeight = 40;

  // find the start button position
  if (
    mouseX >= width / 2 - buttonWidth / 2 &&
    mouseX <= width / 2 + buttonWidth / 2 &&
    mouseY <= height / 2 + buttonHeight / 2 &&
    mouseY >= height / 2 - buttonHeight / 2
  ) {
    fill(20);
    stroke(255);
    strokeWeight(2);
    rect(width / 2, height / 2, buttonWidth, buttonHeight, 10);
    cursor("pointer");
    if (mouseIsPressed) startSomWebsite();
  } else {
    fill(20);
    stroke(30, 20, 100, 200);
    strokeWeight(2);
    rect(width / 2, height / 2, buttonWidth, buttonHeight, 10);
    cursor("default");
  }
  noStroke();
  fill(136, 216, 176);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("start", width / 2, height / 2);
}

//after accepting polisphone to start (to activate sound)
function startSomWebsite() {
  userStartAudio();
  document.querySelector(".fa-upload").classList.remove("hidden");
  document.querySelector(".fa-download").classList.remove("hidden");
  document.querySelector(".fa-circle").classList.remove("hidden");
  document.querySelector(".fa-square").classList.remove("hidden");
  document.querySelector(".fa-play").classList.remove("hidden");
  document.querySelector(".fa-floppy-o").classList.remove("hidden");
  document.querySelector("#abreModal").classList.remove("hidden");
  document.querySelector(".menuInferior").classList.remove("hidden");
  whatToDisplay = 3;
}

//function to deal with drop image events
function gotMapaFile(file) {
  if (file.type === "image") {
    background(255);

    let tempMImagem = loadImage(file.data, (img) => {
      tempMImagem.resize(800, 600);
      novoMapa.loadPixels();
      tempMImagem.loadPixels();
      for (let y = 0; y < novoMapa.height; y++) {
        for (let x = 0; x < novoMapa.width; x++) {
          let index = (x + y * novoMapa.width) * 4;
          let r = tempMImagem.pixels[index + 0];
          let g = tempMImagem.pixels[index + 1];
          let b = tempMImagem.pixels[index + 2];
          let bb = tempMImagem.pixels[index + 3];

          let novosPixeis = color(r, g, b);

          novoMapa.pixels[index + 0] = red(novosPixeis);
          novoMapa.pixels[index + 1] = green(novosPixeis);
          novoMapa.pixels[index + 2] = blue(novosPixeis);
          novoMapa.pixels[index + 3] = 255;
        }
      }
      tempMImagem.updatePixels();
      novoMapa.updatePixels();
    });
  } else alert("This is not an image file!");
}

//freeze sonic spots if clicked
function mouseClicked() {
  for (let i = 0; i < quantosSonicSpots; i++) {
    if (
      arraySonicSpots[i].localizacaoStatus &&
      arraySonicSpots[i].tamanhoCirculo > 40 &&
      !mostraNaoMostra
    )
      arraySonicSpots[i].freezeSpot = !arraySonicSpots[i].freezeSpot;
  }
}

//change sonic spots location when double clicked and changed location is true
function doubleClicked() {
  if (mostraNaoMostra) {
    for (let i = 0; i < quantosSonicSpots; i++) {
      if (arraySonicSpots[i].localizacaoStatus) {
        arraySonicSpots[i].changeLocation = !arraySonicSpots[i].changeLocation;
        break;
      }
    }
  }
}

//loads new sound for each specific sonic spot
function loadNewSound(index) {
  let nomeIndexIconSom = "#inputNovoSom" + index; //creates the appropriate string + the index given (see html)
  inputSound = document.querySelector(nomeIndexIconSom); //gets the corresponding html element
  inputSound.click(); //simulates a click on an input html tag
}

function choseNewSound(index) {
  //runs as soon as a sound is choosen
  let soundFile = new p5.SoundFile(inputSound.files[0]);
  if (soundFile.file.type === "audio/mpeg") {
    //safari things
    try {
      if (browser.indexOf("safari") > -1) {
        mySounds[index].pause();
        mySounds[index].paraToca = false;
        temporarySoundForSafari[index] = soundFile;
      }
      arraySonicSpots[index].tamanhoCirculo = 0;
      arraySonicSpots[index].localizacaoStatus = false;
      arraySonicSpots[index].freezeSpot = false;
      arraySonicSpots[index].tenhoNovoSom = true;
      whatToDisplay = 2;
      mySounds[index] = loadSound(
        soundFile,
        //the settimeout is two seconds because whileLoading native p5sound function does not work
        setTimeout(terminouLoadingSom, 2000),
        erroLoadSom,
        loadingNewSound
      );
    } catch (err) {
      alert("Audio file too long...?");
    }
  } else {
    alert("This is not an mp3 file!");
  }
}

function loadingNewSound(total) {
  //console.log(total);
}

function erroLoadSom() {
  alert("There is some problem with your soundfile!");
}

//triggers when sound is loadede
function terminouLoadingSom() {
  whatToDisplay = 1;
  newSoundUserAudio();
}

//start menu to get the click needed to start the audio
function newSoundUserAudio() {
  background(136, 216, 176);
  rectMode(CENTER);
  const buttonWidth = 200;
  const buttonHeight = 40;

  // find the start button position
  if (
    mouseX >= width / 2 - buttonWidth / 2 &&
    mouseX <= width / 2 + buttonWidth / 2 &&
    mouseY <= height / 2 + buttonHeight / 2 &&
    mouseY >= height / 2 - buttonHeight / 2
  ) {
    fill(50);
    stroke(0, 100);
    strokeWeight(2);
    rect(width / 2, height / 2, buttonWidth, buttonHeight, 10);
    cursor("pointer");
    if (mouseIsPressed) startSomWebsite();
  } else {
    fill(180, 20);
    stroke(0, 100);
    strokeWeight(2);
    rect(width / 2, height / 2, buttonWidth, buttonHeight, 10);
    cursor("default");
  }
  noStroke();
  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("new sound!", width / 2, height / 2);
}

//loads new map
function loadNewMap() {
  let inputMapa = document.querySelector("#inputNovoMapa");
  inputMapa.click(); //simulates a click on an input html tag
  inputMapa.addEventListener("change", function () {
    //create a reader to read the contents of the File
    let reader = new FileReader();
    //makes the File become raw data (blob)
    const blob = new Blob([inputMapa.files[0]], { type: "image/*" });
    //reads the blob as Data URL (specific for images)
    reader.readAsDataURL(blob);

    reader.onload = function () {
      //creates a p5 File from the original File
      let mImagem = new p5.File(inputMapa.files[0]);
      //adds data to the data property of the p5 File
      mImagem.data = reader.result;
      //loads the image
      gotMapaFile(mImagem);
    };
  });
}

//query to choose map favicon to change location sonic spots
document.querySelector(".fa-map-marker").addEventListener("click", function () {
  mostraNaoMostra = !mostraNaoMostra;
  if (mostraNaoMostra)
    //adds this class to the favicon element if map favicon clicked
    document.querySelector(".fa-map-marker").classList.add("changeLocation");
  if (!mostraNaoMostra)
    //removes this class to the favicon element if map favicon clicked
    for (let i = 0; i < quantosSonicSpots; i++) {
      mySounds[i].setVolume(0);
      arraySonicSpots[i].tamanhoCirculo = 0;
      arraySonicSpots[i].localizacaoStatus = false;
    }
  document.querySelector(".fa-map-marker").classList.remove("changeLocation");
});

//selects the element with class modal and stores it on the variable
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

//when polishone help icon is pressed
const abreModal = document
  .querySelector("#abreModal")
  .addEventListener("click", function () {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
  });

//when the button to close the modal window is clicked
const btnCloseModal = document
  .querySelector(".close-modal")
  .addEventListener("click", function () {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  });

//function to close modal window if user clicks on overlay
overlay.addEventListener("click", function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
});

function displayTip(textToTip) {
  document.getElementById("tip").innerHTML = textToTip;
}
