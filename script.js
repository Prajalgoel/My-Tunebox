let songs = []
let libSongs = document.querySelector('.libSongs')

let libSongDetails = []
let libSongThumnails = []

let playlist
let songInPlaylist
let playedSong
let playedSongId
let previousSongId
let playedSongIndex
let audio = null

let playSong = function () { }

document.querySelector(".popularSongsHeadingLeftArrow").addEventListener('click', () => {
    document.querySelector(".popularSongsCards").scrollLeft -= 300
})

document.querySelector(".popularSongsHeadingRightArrow").addEventListener('click', () => {
    document.querySelector(".popularSongsCards").scrollLeft += 300
})

document.querySelector(".popularArtistsHeadingLeftArrow").addEventListener('click', () => {
    document.querySelector(".popularArtistsCards").scrollLeft -= 300
})

document.querySelector(".popularArtistsHeadingRightArrow").addEventListener('click', () => {
    document.querySelector(".popularArtistsCards").scrollLeft += 300
})


document.querySelector('#seekbarPlayPause').addEventListener('click', () => {
    if (audio.paused) {
        audio.play()
        document.querySelector('#seekbarPlayPause').src = "svg/pause.svg"
        songInPlaylist.querySelector('.playPause').src = "svg/pause.svg"
    }
    else {
        audio.pause()
        document.querySelector('#seekbarPlayPause').src = "svg/play.svg"
        songInPlaylist.querySelector('.playPause').src = "svg/play.svg"
    }

})

let convertInFormat = function (totalseconds) {
    let min = Math.floor(totalseconds / 60)
    let seconds = Math.floor(totalseconds % 60)

    return `${min}:${seconds.toString().padStart(2, '0')}`
}


document.addEventListener('keydown', (e) => {
    if (e.code === "Space") {
        e.preventDefault()
        if (audio.paused) {
            audio.play()
            seekbarPlayPause.src = "svg/pause.svg"
            songInPlaylist.querySelector('.playPause').src = "svg/pause.svg"
        }
        else {
            audio.pause()
            seekbarPlayPause.src = "svg/play.svg"
            songInPlaylist.querySelector('.playPause').src = "svg/play.svg"
        }
    }
})

document.querySelector('#loop').addEventListener('click', () => {
    if (document.querySelector('#loop').src.endsWith("svg/loop.svg")) {
        audio.loop = true
        document.querySelector('#loop').src = "svg/noLoop.svg"
    }

    else {
        audio.loop = false
        document.querySelector('#loop').src = "svg/loop.svg"
    }
})

let seekBar = document.querySelector('.seekBar')
let seekBarCircle = document.querySelector('.seekBarCircle')

seekBar.addEventListener('click', (e) => {
    if (audio) {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        seekBarCircle.style.left = percent + "%"
        audio.currentTime = (audio.duration * percent) / 100
    }
})

let volumeBtn = document.querySelector('.volumeBtn')
let volumnSeekbar = document.querySelector('.volumnSeekbar')
let volumeSeekbarCircle = document.querySelector('.volumeSeekbarCircle')

volumeBtn.addEventListener('click', () => {
    if (audio) {
        if (volumeBtn.src.endsWith('svg/volumn.svg')) {
            audio.volume = 0
            volumeBtn.src = "svg/mute.svg"
            volumeSeekbarCircle.style.left = "0%"
        }
        else {
            audio.volume = 1
            volumeBtn.src = "svg/volumn.svg"
            volumeSeekbarCircle.style.left = "100%"
        }
    }
})

volumnSeekbar.addEventListener('click', (e) => {
    if (audio) {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        if (percent == 0) {
            volumeBtn.src = "svg/mute.svg"
        } else {
            volumeBtn.src = "svg/volumn.svg"
        }
        volumeSeekbarCircle.style.left = percent + "%"
        audio.volume = percent / 100

    }
})

let playNextSong = function () { 
    if (audio && playedSongId < playlist.length) {
        playedSongId = parseInt(playedSongId) + 1
        playedSongIndex = parseInt(playedSongIndex) + 1
        playSong()
    }
}

document.querySelector('#next').addEventListener('click', (e) => {
    playNextSong()
})

document.querySelector('#previous').addEventListener('click', (e) => {
    if (audio && playedSongId > 1) {
        playedSongId = parseInt(playedSongId) - 1
        playedSongIndex = parseInt(playedSongIndex) - 1
        playSong()
    }
})

document.querySelector('.yourSongsHeading').addEventListener('click', (e) => {
    if (document.querySelector('.libPlaylistHeadingArrowBtn').src.endsWith('svg/downArrow.svg')) {
        document.querySelector('.libPlaylistHeadingArrowBtn').src = "svg/upArrow.svg"
        libSongs.classList.remove('library-collapsed')
        libSongs.classList.add('library-expanded')
    }else{
        document.querySelector('.libPlaylistHeadingArrowBtn').src = "svg/downArrow.svg"
        libSongs.classList.remove('library-expanded')
        libSongs.classList.add('library-collapsed')
        
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
    libSongs.innerHTML = '';
    let index = 1
    libSongDetails.forEach((e) => {
        let li = document.createElement('li')
        li.className = `flex items-center gap-3 cursor-pointer hover:scale-105 hover:ease-in hover:duration-100 pb-2`
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
    
        <img src="svg/play.svg" alt="" class="playPause p-2 bg-white rounded-full play ml-auto pr-2 ">
        `
        index++

        libSongs.appendChild(li)
    })
}

function playLibSongs() {
    libSongs.addEventListener('click', (e) => {
        if (!e.target.closest('li')) return;

        if (audio) {
            previousSongId = playedSongId
            if (e.target.closest('li').id == previousSongId) {
                return

            }
        }

        playlist = Array.from(libSongs.children)

        playedSongId = e.target.closest('li').id
        playedSongIndex = libSongDetails.findIndex((song) => song.id == playedSongId)

        let playPauseHandler = (e) => {
            if (songInPlaylist.querySelector('.playPause').src.endsWith("svg/pause.svg")) {
                audio.pause()
                songInPlaylist.querySelector('.playPause').src = "svg/play.svg"
                seekbarPlayPause.src = "svg/play.svg"
            }
            else {
                audio.play()
                songInPlaylist.querySelector('.playPause').src = "svg/pause.svg"
                seekbarPlayPause.src = "svg/pause.svg"
            }
        }

        playSong = function () {
            playlist.forEach((e) => {
                e.querySelector('.playPause').src = "svg/play.svg"
                e.querySelector('.songName').style.color = "white"
            })

            playedSong = libSongDetails.find((song) => song.id == playedSongId)

            libSongDetails.forEach((e) => {
                e.currentState = false
            })


            libSongDetails[playedSongIndex].currentState = true
            console.log(playedSong);
            console.log(libSongDetails);

            if (audio) {
                audio.pause()
                audio.currentTime = 0
            }

            audio = new Audio(playedSong.songLink)
            audio.play()

            songInPlaylist = playlist.find((e) => e.id == playedSongId)

            songInPlaylist.querySelector('.playPause').src = "svg/pause.svg"
            songInPlaylist.querySelector('.songName').style.color = "yellow"
            seekbarPlayPause.src = "svg/pause.svg"

            

            songInPlaylist.querySelector('.playPause').removeEventListener('click', playPauseHandler)

            songInPlaylist.querySelector('.playPause').addEventListener('click', playPauseHandler)

            audio.addEventListener('loadedmetadata', () => {
                document.querySelector('.duration').innerHTML = convertInFormat(audio.duration);
            });

            audio.addEventListener('timeupdate', () => {
                document.querySelector('.currentTime').innerHTML = convertInFormat(audio.currentTime)
                seekBarCircle.style.left = (audio.currentTime / audio.duration) * 100 + "%"
            })

            audio.addEventListener('play', () => {
                document.querySelectorAll('.wave').forEach((e) => {
                    e.classList.add('active')
                })
            })
            audio.addEventListener('pause', () => {
                document.querySelectorAll('.wave').forEach((e) => {
                    e.classList.remove('active')
                })
            })

            // change seekbar details
            document.querySelector('.playBarLeftSongPhoto').src = playedSong.libSongThumnail
            document.querySelector('.playBArLeftSongName').innerHTML = playedSong.name
            document.querySelector('.playBArLeftSongArtist').innerHTML = playedSong.Artist

            audio.addEventListener('timeupdate', () => {
                if (audio.duration === audio.currentTime) {
                    playNextSong()
                }
            })
        }

        playSong()

    })

}


