"use strict";

const browserDetect = navigator.userAgent.toLowerCase();
let browser = "";

if (browserDetect.indexOf("safari") != -1) {
  if (browserDetect.indexOf("chrome") > -1) {
    browser = "chrome"; // Chrome
  } else {
    browser = "safari"; // Safari
  }
}

//template for sonic spot
const sonicSpot = {
  indexSpot: 0,
  positionX: 0,
  positionY: 0,
  distanciaParaTrigar: 30,
  localizacaoStatus: false,
  freezeSpot: false,
  thresholdMouseMovementGrow: 3,
  tamanhoCirculo: 200,
  tamanhoMaximoCirculo: 150,
  amountToGrow: 1,
  amountToShrink: 0.7,
  changeLocation: false,
  sabeDistancia: function () {
    let distancia = int(dist(mouseX, mouseY, this.positionX, this.positionY));
    this.localizacaoStatus =
      distancia < this.distanciaParaTrigar ? true : false;
    this.paraToca = true;
    return this.localizacaoStatus;
  },
  desenhaCirculo: function () {
    if (this.localizacaoStatus && !this.freezeSpot) {
      let movimentoMouse = abs(mouseX - pmouseX) + abs(mouseY - pmouseY); //calculates mouse speed
      // if speed ok and not paused then grows
      if (movimentoMouse > this.thresholdMouseMovementGrow) {
        this.tamanhoCirculo = this.tamanhoCirculo + this.amountToGrow;
        this.amountToGrow = 1.1 * sqrt(this.amountToGrow * 2.25);
        // defines max size
        if (this.tamanhoCirculo > this.tamanhoMaximoCirculo)
          this.tamanhoCirculo = this.tamanhoMaximoCirculo;
        movimentoMouse = 0;
      }
      //if mouse movement is not enough then decrease
      else if (movimentoMouse < this.thresholdMouseMovementGrow) {
        this.tamanhoCirculo = this.tamanhoCirculo - this.amountToShrink;
        if (this.tamanhoCirculo < 5) this.tamanhoCirculo = 0;
      }
      fill(5, 50);
      stroke(0);
      ellipse(
        this.positionX,
        this.positionY,
        this.tamanhoCirculo,
        this.tamanhoCirculo
      );
      fill(255);
      ellipse(
        this.positionX,
        this.positionY,
        this.tamanhoCirculo * 0.3 + random(-2, 2),
        this.tamanhoCirculo * 0.3 + random(-2, 2)
      );
      fill(0);
      ellipse(
        this.positionX,
        this.positionY,
        this.tamanhoCirculo * 0.05,
        this.tamanhoCirculo * 0.05
      );
      noFill();
      stroke(90);
      strokeWeight(6);
      ellipse(
        this.positionX,
        this.positionY,
        this.tamanhoCirculo * 0.4,
        this.tamanhoCirculo * 0.4
      );
      strokeWeight(0.2);
      ellipse(
        this.positionX,
        this.positionY,
        this.tamanhoCirculo,
        this.tamanhoCirculo
      );
      stroke(100);
      strokeWeight(1);
      noFill();
      ellipse(
        this.positionX,
        this.positionY,
        this.tamanhoCirculo * 0.35,
        this.tamanhoCirculo * 0.35
      );
      ellipse(
        this.positionX,
        this.positionY,
        this.tamanhoCirculo * 0.6,
        this.tamanhoCirculo * 0.6
      );
      push();
      translate(this.positionX, this.positionY);
      rotate(radians(frameCount) * 2);
      fill(0);
      textSize(map(this.tamanhoCirculo, 0, this.tamanhoMaximoCirculo, 0, 17));
      text(
        str(this.indexSpot + 1),
        map(this.tamanhoCirculo, 0, this.tamanhoMaximoCirculo, 0, -3),
        map(this.tamanhoCirculo, 0, this.tamanhoMaximoCirculo, 0, 18)
      );
      pop();
    }
    // freezed
    else if (
      (this.localizacaoStatus && this.freezeSpot) ||
      (!this.localizacaoStatus && this.freezeSpot)
    ) {
      fill(5, 50);
      stroke(0);
      ellipse(
        this.positionX,
        this.positionY,
        this.tamanhoCirculo,
        this.tamanhoCirculo
      );
      fill(255);
      ellipse(
        this.positionX,
        this.positionY,
        this.tamanhoCirculo * 0.3 + random(-2, 2),
        this.tamanhoCirculo * 0.3 + random(-2, 2)
      );
      fill(0);
      ellipse(
        this.positionX,
        this.positionY,
        this.tamanhoCirculo * 0.05,
        this.tamanhoCirculo * 0.05
      );
      noFill();
      stroke(90);
      strokeWeight(6);
      ellipse(
        this.positionX,
        this.positionY,
        this.tamanhoCirculo * 0.4,
        this.tamanhoCirculo * 0.4
      );
      strokeWeight(0.2);
      ellipse(
        this.positionX,
        this.positionY,
        this.tamanhoCirculo,
        this.tamanhoCirculo
      );
      stroke(100);
      strokeWeight(1);
      noFill();
      ellipse(
        this.positionX,
        this.positionY,
        this.tamanhoCirculo * 0.35,
        this.tamanhoCirculo * 0.35
      );
      ellipse(
        this.positionX,
        this.positionY,
        this.tamanhoCirculo * 0.6,
        this.tamanhoCirculo * 0.6
      );
      push();
      translate(this.positionX, this.positionY);
      rotate(radians(frameCount) * 2);
      fill(0);
      textSize(map(this.tamanhoCirculo, 0, this.tamanhoMaximoCirculo, 0, 17));
      text(
        str(this.indexSpot + 1),
        map(this.tamanhoCirculo, 0, this.tamanhoMaximoCirculo, 0, -4),
        map(this.tamanhoCirculo, 0, this.tamanhoMaximoCirculo, 0, 18)
      );
      pop();
    }
    // left sound spot
    else if (!this.localizacaoStatus && !this.freezeSpot) {
      if (this.tamanhoCirculo > 0.9) {
        this.tamanhoCirculo = this.tamanhoCirculo - this.amountToShrink;
        fill(5, 50);
        stroke(0);
        ellipse(
          this.positionX,
          this.positionY,
          this.tamanhoCirculo,
          this.tamanhoCirculo
        );
        fill(255);
        ellipse(
          this.positionX,
          this.positionY,
          this.tamanhoCirculo * 0.3,
          this.tamanhoCirculo * 0.3
        );
        fill(0);
        ellipse(
          this.positionX,
          this.positionY,
          this.tamanhoCirculo * 0.05,
          this.tamanhoCirculo * 0.05
        );
        noFill();
        stroke(90);
        strokeWeight(6);
        ellipse(
          this.positionX,
          this.positionY,
          this.tamanhoCirculo * 0.4,
          this.tamanhoCirculo * 0.4
        );
        strokeWeight(0.2);
        ellipse(
          this.positionX,
          this.positionY,
          this.tamanhoCirculo,
          this.tamanhoCirculo
        );
        stroke(100);
        strokeWeight(1);
        noFill();
        ellipse(
          this.positionX,
          this.positionY,
          this.tamanhoCirculo * 0.35,
          this.tamanhoCirculo * 0.35
        );
        ellipse(
          this.positionX,
          this.positionY,
          this.tamanhoCirculo * 0.6,
          this.tamanhoCirculo * 0.6
        );
        push();
        translate(this.positionX, this.positionY);
        rotate(radians(frameCount) * 2);
        fill(0);
        textSize(map(this.tamanhoCirculo, 0, this.tamanhoMaximoCirculo, 0, 17));
        text(
          str(this.indexSpot + 1),
          map(this.tamanhoCirculo, 0, this.tamanhoMaximoCirculo, 0, -4),
          map(this.tamanhoCirculo, 0, this.tamanhoMaximoCirculo, 0, 18)
        );
        pop();
      }
      if (this.tamanhoCirculo <= 0.9) this.tamanhoCirculo = 0;
    }
  },
  moveLocation: function () {
    //if changing location
    if (this.changeLocation) {
      fill(30, 200, 20, 127);
      stroke(2);
      strokeWeight(10);
      ellipse(
        this.positionX,
        this.positionY,
        this.tamanhoCirculo,
        this.tamanhoCirculo
      );
      this.positionX = mouseX;
      this.positionY = mouseY;
      noFill();
      noStroke();
      strokeWeight(1);
    }
  },
  paraToca: true,
  tenhoNovoSom: false,
  playSound: function () {
    //entered sonic spot
    if (
      this.localizacaoStatus &&
      !this.freezeSpot &&
      mySounds[this.indexSpot].isLoaded() &&
      this.paraToca
    ) {
      mySounds[this.indexSpot].setVolume(
        pow(map(this.tamanhoCirculo, 0, this.tamanhoMaximoCirculo, 0.0, 1.0), 3)
      );
      if (!mySounds[this.indexSpot].isPlaying()) {
        mySounds[this.indexSpot].play();
      }
    } else if (!this.localizacaoStatus && !this.freezeSpot) {
      mySounds[this.indexSpot].setVolume(
        pow(map(this.tamanhoCirculo, 0, this.tamanhoMaximoCirculo, 0.0, 1.0), 3)
      );
      if (
        this.tamanhoCirculo < 0.9 &&
        this.paraToca &&
        mySounds[this.indexSpot].isPlaying()
      ) {
        if (browser != "safari") {
          mySounds[this.indexSpot].stop();
          this.paraToca = false;
        }
        if (browser == "safari") {
          if (!arraySonicSpots[this.indexSpot].tenhoNovoSom) {
            mySounds[this.indexSpot].stop();
            mySounds[this.indexSpot] = loadSound(
              soundFileNames[this.indexSpot]
            );
            mySounds[this.indexSpot].playMode("restart");
            mySounds[this.indexSpot].setLoop(true);
            this.paraToca = false;
          } else if (arraySonicSpots[this.indexSpot].tenhoNovoSom) {
            mySounds[this.indexSpot].stop();
            mySounds[this.indexSpot] = loadSound(
              temporarySoundForSafari[this.indexSpot]
            );
            mySounds[this.indexSpot].playMode("restart");
            mySounds[this.indexSpot].setLoop(true);
            this.paraToca = false;
          }
        }
      }
    }
  },
};
