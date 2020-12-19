function prepareRecording() {
  aGravar = true;
  //loading animations
  document.querySelector(".fa-upload").classList.add("hidden");
  document.querySelector(".fa-download").classList.add("hidden");
  document.querySelector(".menuInferior").classList.add("hidden");
  document.querySelector("#abreModal").classList.add("hidden");
  document.querySelector("#botaoPlay").classList.add("hidden");
  document.querySelector(".fa-floppy-o").classList.add("hidden");
  document.querySelector(".fa-circle").classList.add("aGravarSom");

  //records sound
  recorder.record(gravacao);
}

//if stop button is pressed
document.querySelector("#botaoStop").addEventListener("click", function () {
  document.querySelector(".fa-upload").classList.remove("hidden");
  document.querySelector(".fa-download").classList.remove("hidden");
  document.querySelector(".menuInferior").classList.remove("hidden");
  document.querySelector("#abreModal").classList.remove("hidden");
  document.querySelector("#botaoPlay").classList.remove("hidden");
  document.querySelector(".fa-circle").classList.remove("aGravarSom");
  document.querySelector(".fa-play").classList.remove("aTocarSom");
  document.querySelector(".fa-floppy-o").classList.remove("hidden");

  if (aGravar) {
    recorder.stop();
    aGravar = false;
  } else if (aTocar) {
    aTocar = false;
    gravacao.stop();
    whatToDisplay = 3;
  }
});

//if play button is pressed
document.querySelector("#botaoPlay").addEventListener("click", function () {
  aTocar = true;
  document.querySelector(".fa-circle").classList.remove("aGravarSom");
  if (!aGravar && gravacao.duration() > 0) {
    document.querySelector(".fa-play").classList.add("aTocarSom");
    gravacao.play();
    whatToDisplay = 7;
  }
});

function playingRecordedMusic() {
  background(136, 216, 176);
  fill(100);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("playing...", width / 2, height / 2);
}

//if download track button is pressed
document
  .querySelector("#botaoDownloadTrack")
  .addEventListener("click", function () {
    if (gravacao.duration() > 0) {
      save(gravacao, "polisphoneMusic");
    }
  });

//if recorded music gets to the end
function parouTocarGravacao() {
  document.querySelector(".fa-play").classList.remove("aTocarSom");
  whatToDisplay = 3;
}
