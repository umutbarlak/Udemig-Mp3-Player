const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const audio = document.getElementById("audio");
const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const playlistButton = document.getElementById("playlist");
const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");
const progressBar = document.getElementById("progress-bar");
const playlistContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playlistSongs = document.getElementById("playlist-songs");
const currentProgress = document.getElementById("current-progress");

// index sarki için
let index;

//dongu
let loop = true;

//kaıştırıcı
let isShuffleActive = false


//sarki listesi
const songsList = [

  {
    name: "Dönece",
    link: "assets/Donence.mp3",
    artist: "Barış Manço",
    image: "assets/barıs-manco.jpeg",
  },
  {
    name: "Çöpçüler",
    link: "assets/Copculer.mp3",
    artist: "Erkin Koray",
    image: "assets/erkin-koray1.jpeg",
  },
  {
    name: "Düşünme Kaybolursun",
    link: "assets/Kaybolursun.mp3",
    artist: "No Land",
    image: "assets/no-land.jpeg",
  },
  {
    name: "Öyle Bir Geçer Zaman Ki",
    link: "assets/oyle-bir-gecer-zaman-ki.mp3",
    artist: "Erkin Koray",
    image: "assets/erkin-koray2.jpeg",
  },
  {
    name: "Dinle",
    link: "assets/seni-her-gordugumde.mp3",
    artist: "Erkin Koray",
    image: "assets/erkin-koray3.jpeg",
  },
];

//zaman formatı ayarlama

const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return `${minute}.${second}`;
};

//sarki atama

const playAudio = () => {
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
};

const setSong = (arrayIndex) => {
  if (loop == true && isShuffleActive == true){
    arrayIndex = Math.floor(Math.random()*100) % 5
  }

  let { name, link, artist, image } = songsList[arrayIndex];
  audio.src = link;
  songName.innerHTML = name;
  songArtist.innerHTML = artist;
  songImage.src = image;

  audio.onloadedmetadata = () => {
    maxDuration.innerText = timeFormatter(audio.duration);
  };

  playlistContainer.classList.add("hide");

  playAudio();
};

// sıradakini çal

const nextSong = () => {
  if (loop) {
    if (index == songsList.length - 1) {
      index = 0;
    } else {
      index += 1;
    }
    setSong(index);
  } else {
    let randIndex = Math.floor(Math.random() * songsList.length);
    setSong(randIndex);
  }
};

playlistButton.addEventListener("click", () => {
  playlistContainer.classList.remove("hide");
});

closeButton.addEventListener("click", () => {
  playlistContainer.classList.add("hide");
});

const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide");
  playButton.classList.remove("hide");
};

setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
  currentProgress.style.width =
    (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
}, 1000);

progressBar.addEventListener("click", (event) => {
  let coordStart = progressBar.getBoundingClientRect().left;

  let coordEnd = event.clientX;
  let progress = (coordEnd - coordStart) / progressBar.offsetWidth;

  currentProgress.style.width = progressBar * 100 + "%";

  audio.currentTime = progress * audio.duration;
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

const previousSong = () => {
  if (index > 0) {
    index -= 1;
  } else {
    index = songsList.length - 1;
  }
  setSong(index);
};

// tıklama yaklama

//fonsiyonu içinde yazdık
repeatButton.addEventListener("click", () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active");
    audio.loop = false;
  } else {
    repeatButton.classList.add("active");
    audio.loop = true;
  }
});

shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    isShuffleActive = false
    shuffleButton.classList.remove("active");
    audio.loop = true;
  } else {
    isShuffleActive = true
    shuffleButton.classList.add("active"); 
    audio.loop = false;
  }
});

const initializePlaylist = () => {
  for (let i in songsList) {
    playlistSongs.innerHTML += `<li class="playlistSong" onclick="setSong(${i})">
        <div class="playlist-image-container">
            <img src="${songsList[i].image}">
        </div>
        <div class="playlist-song-details">
            <p id="playlist-song-name">
            ${songsList[i].name}
            </p>
            <p id="playlist-song-artist">
            ${songsList[i].artist}
            </p>
        </div>
        </li>`;
  }
};

// burada tıklama fonksiyonu atayıp yukarıda fonksiyonu yazdık
nextButton.addEventListener("click", nextSong);

pauseButton.addEventListener("click", pauseAudio);

playButton.addEventListener("click", playAudio);

prevButton.addEventListener("click", previousSong);

//sarkı bitişini yakala

audio.onended = () => {
  nextSong();
};

audio.addEventListener("timeupdate", () => {
  currentTimeRef.innerText = timeFormatter(audio.currentTime);
});

// ekaran ilk yüklenildiğinde

window.onload = () => {
  index = 0;
  setSong(index);

  pauseAudio();
  initializePlaylist();
};
