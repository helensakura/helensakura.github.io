let video;
let handpose;
let leftHand = [];
let rightHand = [];

function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  handpose = ml5.handpose(video, modelReady);
  handpose.on("predict", gotHandPoses);
}

function modelReady() {
  console.log("Model loaded");
}

function gotHandPoses(results) {
  leftHand = [];
  rightHand = [];

  for (let i = 0; i < results.length; i++) {
    let hand = results[i];
    let landmarks = hand.landmarks;

    let handSide = getHandSide(landmarks);

    if (handSide === "left") {
      leftHand.push(hand);
    } else if (handSide === "right") {
      rightHand.push(hand);
    }
  }
}

function getHandSide(landmarks) {
  let leftmostIndex = 0;
  let rightmostIndex = 0;

  for (let i = 1; i < landmarks.length; i++) {
    if (landmarks[i][0] < landmarks[leftmostIndex][0]) {
      leftmostIndex = i;
    }

    if (landmarks[i][0] > landmarks[rightmostIndex][0]) {
      rightmostIndex = i;
    }
  }

  let handSide = "";
  if (
    landmarks[leftmostIndex][0] < width / 2 &&
    landmarks[rightmostIndex][0] < width / 2
  ) {
    handSide = "left";
  } else if (
    landmarks[leftmostIndex][0] > width / 2 &&
    landmarks[rightmostIndex][0] > width / 2
  ) {
    handSide = "right";
  }

  return handSide;
}

function draw() {
  image(video, 0, 0, width, height);

  for (let i = 0; i < leftHand.length; i++) {
    let hand = leftHand[i];
    let landmarks = hand.landmarks;

    let thumb = landmarks[1];
    let index = landmarks[2];
    let distance = calculateDistance(thumb, index);

    if (distance > 50) {
      fill(255, 0, 0);
      textSize(32);
      textAlign(CENTER, CENTER);
      text("flower", width / 4, height / 2);
    }

    for (let j = 0; j < landmarks.length; j++) {
      let [x, y, z] = landmarks[j];
      fill(255, 0, 0);
      ellipse(x, y, 10, 10);
    }
  }

  for (let i = 0; i < rightHand.length; i++) {
    let hand = rightHand[i];
    let landmarks = hand.landmarks;

    let thumb = landmarks[1];
    let index = landmarks[2];
    let distance = calculateDistance(thumb, index);

    if (distance > 50) {
      fill(0, 0, 255);
      textSize(32);
      textAlign(CENTER, CENTER);
      text("flower", (3 * width) / 4, height / 2);
    }

    for (let j = 0; j < landmarks.length; j++) {
      let [x, y, z] = landmarks[j];
      fill(0, 0, 255);
      ellipse(x, y, 10, 10);
    }
  }
}

function calculateDistance(pointA, pointB) {
  let [xA, yA, zA] = pointA;
  let [xB, yB, zB] = pointB;

  return dist(xA, yA, xB, yB);
}
