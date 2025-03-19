let songs = []
let libSongs = document.querySelector('.libSongs')

let libSongDetails = []
let libSongThumnails = []

let playedSong
let playedSongId
let previousSongId
let playedSongIndex
let audio = null

let popularSongsCards = document.querySelector(".popularSongsCards")
let popularSongsHeadingLeftArrow = document.querySelector(".popularSongsHeadingLeftArrow")
let popularSongsHeadingRightArrow = document.querySelector(".popularSongsHeadingRightArrow")

let popularArtistsCards = document.querySelector(".popularArtistsCards")
let popularArtistsHeadingLeftArrow = document.querySelector(".popularArtistsHeadingLeftArrow")
let popularArtistsHeadingRightArrow = document.querySelector(".popularArtistsHeadingRightArrow")

popularSongsHeadingLeftArrow.addEventListener('click', () => {
    popularSongsCards.scrollLeft -= 300
})

popularSongsHeadingRightArrow.addEventListener('click', () => {
    popularSongsCards.scrollLeft += 300
})

popularArtistsHeadingLeftArrow.addEventListener('click', () => {
    popularArtistsCards.scrollLeft -= 300
})

popularArtistsHeadingRightArrow.addEventListener('click', () => {
    popularArtistsCards.scrollLeft += 300
})

let seekbarPlayPause = document.querySelector('#seekbarPlayPause')

seekbarPlayPause.addEventListener('click', () => {
    if (audio.paused) {
        audio.play()
        seekbarPlayPause.src = "svg/pause.svg"
    }
    else {
        audio.pause()
        seekbarPlayPause.src = "svg/play.svg"
    }

})

let convertInFormat = function (totalseconds) {
    let min = Math.floor(totalseconds / 60)
    let seconds = Math.floor(totalseconds % 60)

    return `${min}:${seconds.toString().padStart(2, '0')}`
}


document.addEventListener('keydown', (e) => {
    e.preventDefault()
    if (e.code === "Space") {
        if (audio.paused) {
            audio.play()
            seekbarPlayPause.src = "svg/pause.svg"
        }
        else {
            audio.pause()
            seekbarPlayPause.src = "svg/play.svg"
        }
    }
})

let loop = document.querySelector('#loop')

loop.addEventListener('click', () => {
    if (loop.src.endsWith("svg/loop.svg")) {
        audio.loop = true
        loop.src = "svg/noLoop.svg" 
    }

    else{
        audio.loop = false
        loop.src = "svg/loop.svg"
    }
})

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/LibSongs/")
    let response = await a.text()
    // console.log(response);

    let div = document.createElement('div')
    div.innerHTML = response

    let as = div.getElementsByTagName('a')
    console.log(as);

    for (let index = 0; index < as.length; index++) {
        if (as[index].href.endsWith('.mp3')) {
            songs.push(as[index].href)

        }

    }

    async function getThumbnails() {
        let a = await fetch("http://127.0.0.1:3000/songsThumbnail/LibSongsThumnail/")
        let response = await a.text()
        // console.log(response);

        let div = document.createElement('div')
        div.innerHTML = response

        let as = div.getElementsByTagName('a')
        console.log(as);


        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith('.jpg')) {
                libSongThumnails.push(element.href)
            }
        }
    }

    getThumbnails().then(() => {
        console.log("libSongThumnails are", libSongThumnails);
    })

    await getThumbnails()

    songs.forEach((song) => {
        const modifiedSong = song
            .replace(/%20/g, " ")
            .split("/songs/LibSongs/")[1]
            .replace(".mp3", "")
            .split('-')

        libSongDetails.push({ name: modifiedSong[0], Artist: modifiedSong[1] });
    })

    let index = 0
    let id = 1

    libSongDetails.forEach((e) => {
        e.libSongThumnail = libSongThumnails[index]
        e.songLink = songs[index]
        e.currentState = false
        index++
        e.id = id
        id++
    })

    renderLibSongs()
    playLibSongs()

}

getSongs().then(() => {
    console.log("songs links are", songs);
    console.log("libSongDetails are", libSongDetails);

})

function renderLibSongs() {
    // libSongs.innerHTML = '';
    let index = 1
    libSongDetails.forEach((e) => {
        let li = document.createElement('li')
        li.className = `flex items-center gap-3 cursor-pointer hover:scale-105 hover:ease-in hover:duration-100`
        li.id = e.id

        li.innerHTML = `
        <span class="font-bold text-lg">${index}</span>
    
        <div class="songPhoto w-[50px]">
           <img src="${e.libSongThumnail}" alt="" width="50px" class="rounded-md object-cover">
         </div>
    
        <div class="songDetails">
            <div class="songName font-bold text-lg">${e.name}</div>
            <div class="songArtist">${e.Artist}</div>
        </div>
    
         <div class="play ml-auto pr-2" id= "playPause">
             <img src="svg/play.svg" alt="" class="p-2 bg-white rounded-full  ">
        </div>
        `
        index++

        libSongs.appendChild(li)
    })
}

function playLibSongs() {
    libSongs.addEventListener('click', (e) => {
        if (audio) {
            previousSongId = playedSongId
            if (e.target.closest('li').id == previousSongId) {
                return

            }
        }

        seekbarPlayPause.src = "svg/pause.svg"

        libSongDetails.forEach((e) => {
            e.currentState = false
        })
        playedSongId = e.target.closest('li').id
        playedSongIndex = libSongDetails.findIndex((song) => song.id == playedSongId)
        playedSong = libSongDetails.find((song) => song.id == playedSongId)

        libSongDetails[playedSongIndex].currentState = true
        console.log(playedSong);
        console.log(libSongDetails);

        if (audio) {
            audio.pause()
            audio.currentTime = 0
        }

        audio = new Audio(playedSong.songLink)
        audio.play()

        let currentTime = document.querySelector('.currentTime')
        let duration = document.querySelector('.duration')

        let seekBar = document.querySelector('.seekBar')
        let seekBarCircle = document.querySelector('.seekBarCircle')

        audio.addEventListener('loadedmetadata', () => {
            duration.innerHTML = convertInFormat(audio.duration);
        });

        audio.addEventListener('timeupdate', () => {
            currentTime.innerHTML = convertInFormat(audio.currentTime)
            seekBarCircle.style.left = (audio.currentTime / audio.duration) * 100 + "%"
        })

        // change seekbar details
        let playBarLeftSongPhoto = document.querySelector('.playBarLeftSongPhoto')
        let playBArLeftSongName = document.querySelector('.playBArLeftSongName')
        let playBArLeftSongArtist = document.querySelector('.playBArLeftSongArtist')

        playBarLeftSongPhoto.src = playedSong.libSongThumnail
        playBArLeftSongName.innerHTML = playedSong.name
        playBArLeftSongArtist.innerHTML = playedSong.Artist

        seekBar.addEventListener('click', (e) => {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
            seekBarCircle.style.left = percent + "%"
            audio.currentTime = (audio.duration * percent) / 100
        })


    })

}


