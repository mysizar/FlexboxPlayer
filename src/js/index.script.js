let audioList = [
  //   {
  //    author: "",
  //    name: "",
  //    src:""
  //   }
];

getSrcFromFile();

let currentSong = 0;
let lastPlayedSong = [];
let isRandom = false;

let audio = new Audio();
// let muted = false;
audio.volume = 0.25;
audio.type = "audio/mpeg";
// audio.src = audioList[currentSong].src;

function startPlay() {
  if (!audio.paused) {
    audio.pause();
    stopRotateImg();
    setIconPlay();
  } else {
    audio.play();
    setIconPause();
    audioNameOutput();
    rotateImg();
  }
}

function playNext() {
  lastPlayedSong.push(currentSong);
  // console.log(lastPlayedSong, currentSong);

  if (isRandom) {
    currentSong = Math.floor(Math.random() * audioList.length);
    if (currentSong == lastPlayedSong[lastPlayedSong.length - 1]) {
      currentSong = Math.floor(Math.random() * audioList.length);
    }
  } else {
    currentSong++;
  }

  if (currentSong == audioList.length) {
    currentSong = 0;
    stopRotateImg();
    audio.src = audioList[currentSong].src;
    startPlay();
    setTimeout(goRotateImg, 200);
  } else {
    stopRotateImg();
    audio.src = audioList[currentSong].src;
    startPlay();
    setTimeout(goRotateImg, 200);
  }
}

function playPrevious() {
  if (isRandom && lastPlayedSong.length == 0) {
    alert("No song has been played before!");
  } else if (lastPlayedSong.length > 0) {
    currentSong = lastPlayedSong[lastPlayedSong.length - 1];
    lastPlayedSong.pop();
    // console.log(currentSong);
  } else {
    currentSong--;
  }

  if (currentSong < 0) {
    currentSong = audioList.length - 1;
    stopRotateImg();
    audio.src = audioList[currentSong].src;
    startPlay();
    setTimeout(goRotateImg, 200);
  } else {
    stopRotateImg();
    audio.src = audioList[currentSong].src;
    startPlay();
    setTimeout(goRotateImg, 200);
  }
}

function playRandom() {
  if (!isRandom) {
    isRandom = true;
    document.getElementById("random").style.color = "darkturquoise";
  } else {
    isRandom = false;
    document.getElementById("random").style.color = "#4b4a4a";
  }
}

function localFiles() {
  let files = document.getElementById("localAudio").files;

  for (let i = 0; i < files.length; i++) {
    let obj = {};
    obj.src = URL.createObjectURL(files[i]);
    let filename = files[i].name.replace(/_/g, " ").slice(0, -4); // replace all '_'-symbol to 'space' and delete file-type '.mp3' from name
    obj.name = filename.substring(filename.indexOf("-") + 1); // find first '-' and delete all before
    obj.author = filename.slice(0, filename.indexOf("-")); // find first '-' and delete all after

    audioList.push(obj);
  }

  console.log(audioList);
}

function getSrcFromFile() {
  fetch("./src/playlist/list.txt")
    .then((resp) => resp.text())
    .then((data) => {
      let arr = data.split(/\r?\n/);
      // console.log(arr);
      for (i in arr) {
        let obj = {};
        obj.src = arr[i];
        audioList.push(obj);
        createAudioNameFromURL();
        audio.src = audioList[currentSong].src;
      }
      console.log(audioList);
    });
}

function createAudioNameFromURL() {
  // for (let i = 0; i < audioList.length; i++) {
  let url = audioList[i].src;

  if (url.indexOf("?") != -1) {
    url = url.slice(0, url.indexOf("?")); // if '?' exist => delete it and all after
  }

  let filename = url.substring(url.lastIndexOf("/") + 1); // find last '/' and delete all before
  filename = filename.replace(/_/g, " ").slice(0, -4); // replace all '_'-symbol to 'space' and then delete file-type '.mp3' from name

  audioList[i].name = filename.substring(filename.indexOf("-") + 1); // find first '-' and delete all before

  audioList[i].author = filename.slice(0, filename.indexOf("-")); // find first '-' and delete all after
  // }
}

function setPosition(currentPosition) {
  audio.currentTime = currentPosition;
}

function setVolume(currentValue) {
  audio.volume = currentValue;
}

function showVolume() {
  document.getElementById("volume").style.visibility = "visible";
  document.getElementById("volume").style.opacity = 1;
  setTimeout(() => {
    document.getElementById("volume").style.visibility = "hidden";
    document.getElementById("volume").style.opacity = 0;
  }, 5000);
}

function format(s) {
  let m = Math.floor(s / 60);
  m = m >= 10 ? m : "0" + m;
  s = Math.floor(s % 60);
  s = s >= 10 ? s : "0" + s;
  return m + ":" + s;
}

function audioNameOutput() {
  document.getElementById("audioName").innerHTML = audioList[currentSong].name;
  document.getElementById("author").innerHTML = audioList[currentSong].author;
}

function rotateImg() {
  document.getElementById("img").style.animation =
    "rotate 10s linear 0s running " + audio.duration / 10;
}

function stopRotateImg() {
  document.getElementById("img").style.animationPlayState = "paused";
}

function goRotateImg() {
  document.getElementById("img").style.animationPlayState = "running";
}

function setIconPlay() {
  document.getElementById("play-button").classList.remove("fa-pause");
  document.getElementById("play-button").classList.add("fa-play");
}

function setIconPause() {
  document.getElementById("play-button").classList.remove("fa-play");
  document.getElementById("play-button").classList.add("fa-pause");
}

//----- Event Listener -----

audio.addEventListener("timeupdate", function () {
  actualTime = parseInt(audio.currentTime, 10);
  document.getElementById("positions").max = audio.duration;
  document.getElementById("positions").value = actualTime;
  document.getElementById("timeOutput").innerHTML = format(actualTime);
  //   console.log(format(actualTime));
  if (audio.currentTime == audio.duration) {
    audio.pause();
    setIconPlay();
    stopRotateImg();
  }
});

audio.addEventListener("ended", playNext);
