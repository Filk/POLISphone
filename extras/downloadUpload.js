let zip = new JSZip();
let uploadProject;

function prepareZip() {
  //loading animations
  document.querySelector("#myContainer").classList.add("hidden");
  document.querySelector(".fa-upload").classList.add("hidden");
  document.querySelector(".fa-download").classList.add("hidden");
  document.querySelector(".fa-square").classList.add("hidden");
  document.querySelector(".fa-play").classList.add("hidden");
  document.querySelector(".fa-floppy-o").classList.add("hidden");
  document.querySelector(".menuInferior").classList.add("hidden");
  document.querySelector("#abreModal").classList.add("hidden");
  document.querySelector(".fa-circle").classList.add("hidden");
  document.querySelector(".loadAnimation").classList.remove("hidden");

  //image map
  novoMapa.loadPixels();
  let image64 = split(novoMapa.canvas.toDataURL(), ",");
  zip.file("polisphone.jpg", image64[1], { base64: true });

  //creates new JSON files
  let meuNewJSON = {
    index: [],
    localizacaoX: [],
    localizacaoY: [],
    pathFile: [],
  };

  //sounds
  for (let j = 0; j < 8; j++) {
    meuNewJSON.index.push(j);
    meuNewJSON.localizacaoX.push(arraySonicSpots[j].positionX);
    meuNewJSON.localizacaoY.push(arraySonicSpots[j].positionY);

    if (arraySonicSpots[j].tenhoNovoSom) {
      //adds pathFile array in the JSON files
      meuNewJSON.pathFile.push("som" + j + "." + "wav");
      zip.file("som" + j + "." + "wav", mySounds[j].getBlob(), {
        type: "blob",
      });
    }
  }

  //converts JSON to string
  let meuJSONpreparar = JSON.stringify(meuNewJSON);
  //adds JSON file to the root of the zip files
  zip.file("dataPOLIS.json", meuJSONpreparar, { binary: false });
  startDownload();
}

function startDownload() {
  let nomeProjeto = prompt("Name for your POLISphone Project", "");
  if (nomeProjeto != null && nomeProjeto != "") {
    zip.generateAsync({ type: "blob" }).then(function (blob) {
      saveAs(blob, nomeProjeto + ".plp");
      //loading animations
      document.querySelector(".loadAnimation").classList.add("hidden");
      document.querySelector("#myContainer").classList.remove("hidden");
      whatToDisplay = 4;
    });
  } else if (nomeProjeto == "") {
    zip.generateAsync({ type: "blob" }).then(function (blob) {
      saveAs(blob, "myPolisphone.plp");
      //loading animations
      document.querySelector(".loadAnimation").classList.add("hidden");
      document.querySelector("#myContainer").classList.remove("hidden");
      whatToDisplay = 4;
    });
  } else if (nomeProjeto === null) {
    document.querySelector(".loadAnimation").classList.add("hidden");
    document.querySelector("#myContainer").classList.remove("hidden");
    whatToDisplay = 5;
  }
}

//start menu to get the click needed to start the audio
function newDownload() {
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
  text("Download Complete!", width / 2, height / 2);
}

//start menu to get the click needed to start the audio
function newCancel() {
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
  text("You canceled!", width / 2, height / 2);
}

//loads new sound for each specific sonic spot
function loadNewProject() {
  //gets the corresponding html element
  uploadProject = document.querySelector("#uploadProject");
  //simulates a click on an input html tag
  uploadProject.click();
}

function loadProject() {
  //loading animations
  document.querySelector("#myContainer").classList.add("hidden");
  document.querySelector(".fa-upload").classList.add("hidden");
  document.querySelector(".fa-download").classList.add("hidden");
  document.querySelector(".fa-square").classList.add("hidden");
  document.querySelector(".fa-play").classList.add("hidden");
  document.querySelector(".fa-floppy-o").classList.add("hidden");
  document.querySelector(".menuInferior").classList.add("hidden");
  document.querySelector("#abreModal").classList.add("hidden");
  document.querySelector(".fa-circle").classList.add("hidden");
  document.querySelector(".loadAnimation").classList.remove("hidden");

  let reader = new FileReader();
  const file = uploadProject.files[0];

  reader.addEventListener(
    "load",
    function () {
      //displays the contents of the file
      let upzip = reader.result;
      //trims garbage of the string to have only the data of the zip file
      let n = upzip.indexOf("base64,");
      let blobContent = upzip.substr(n + 7);
      //loads the data to the function and then performs the decoding
      JSZip.loadAsync(blobContent, { base64: true }).then(function (zip) {
        //decodes de JSON file - Uint8array to utf-8
        const byteArrayPos = new Uint8Array(
          zip.files["dataPOLIS.json"]._data.compressedContent //contents of the JSON file
        );
        let zipjsonToString = new TextDecoder("utf-8").decode(byteArrayPos);
        //parse Json
        let meuJsonUnzip = JSON.parse(zipjsonToString);
        //gets length
        let tamanho = meuJsonUnzip.localizacaoX.length;
        //updates position of sonic spots
        for (let i = 0; i < tamanho; i++) {
          arraySonicSpots[i].positionX = meuJsonUnzip.localizacaoX[i];
          arraySonicSpots[i].positionY = meuJsonUnzip.localizacaoY[i];
        }

        //get data of image
        const byteArrayMap = new Uint8Array(
          zip.files["polisphone.jpg"]._data.compressedContent
        );
        const blob = new Blob([byteArrayMap], { type: "image/*" });

        let binstr = Array.prototype.map
          .call(byteArrayMap, function (ch) {
            return String.fromCharCode(ch);
          })
          .join("");
        let data64 = btoa(binstr);
        let punchline = "data:image/png;base64,";
        let dataFinalImagem = punchline.concat(data64);

        let ficheiro = new File([blob], "polisphone.jpg", {
          type: "image/*",
        });
        let lala = new p5.File(ficheiro);
        lala.data = dataFinalImagem;
        gotMapaFile(lala);

        //load sounds
        for (let i = 0; i < quantosSonicSpots; i++) {
          let nomeSom = "som" + i + ".wav";
          if (zip.files[nomeSom]) {
            let indice = nomeSom.slice(3, 4);
            const byteArray = new Uint8Array(
              zip.files[nomeSom]._data.compressedContent
            );
            const blob = new Blob([byteArray], { type: "audio/wav" });
            let soundFile = new p5.SoundFile(blob);
            arraySonicSpots[indice].tamanhoCirculo = 0;
            arraySonicSpots[indice].localizacaoStatus = false;
            arraySonicSpots[indice].freezeSpot = false;
            mySounds[indice] = loadSound(soundFile);
            arraySonicSpots[indice].tenhoNovoSom = true;
            temporarySoundForSafari[indice] = soundFile;
          }
        }

        dataPolisphone = loadJSON;

        document.querySelector(".loadAnimation").classList.add("hidden");
        document.querySelector("#myContainer").classList.remove("hidden");
        whatToDisplay = 6;
      });
    },
    false
  );

  //reads the file
  if (file) reader.readAsDataURL(file);
}

//start menu to get the click needed to start the audio
function newProjectLoaded() {
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
  text("POLISphone loaded!", width / 2, height / 2);
}
