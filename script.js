let libSongs = document.querySelector('.libSongs')

let allPlaylistsDOM = Array.from(document.querySelectorAll('.playlist'))
let allPlaylistsNames = Array.from(document.querySelectorAll('.playlist')).map((element) => element.id)
let allsongDetails = []

let LibrarySongs = []

let playlistPlayedInDOM
let playedPlaylistAllSongs
let songInPlaylistPlayedInDOM
let playedSongIndexInAllSongDetails
let playedSongId

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
        songInPlaylistPlayedInDOM.querySelector('.playPause').src = "svg/pause.svg"
    }
    else {
        audio.pause()
        document.querySelector('#seekbarPlayPause').src = "svg/play.svg"
        songInPlaylistPlayedInDOM.querySelector('.playPause').src = "svg/play.svg"
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
            songInPlaylistPlayedInDOM.querySelector('.playPause').src = "svg/pause.svg"
        }
        else {
            audio.pause()
            seekbarPlayPause.src = "svg/play.svg"
            songInPlaylistPlayedInDOM.querySelector('.playPause').src = "svg/play.svg"
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
    if (audio && playedSongId < playlistPlayedInDOM.length) {
        playedSongId = parseInt(playedSongId) + 1
        playedSongIndexInAllSongDetails = parseInt(playedSongIndexInAllSongDetails) + 1
        playSong()
    }
}

document.querySelector('#next').addEventListener('click', (e) => {
    playNextSong()
})

document.querySelector('#previous').addEventListener('click', (e) => {
    if (audio && playedSongId > 1) {
        playedSongId = parseInt(playedSongId) - 1
        playedSongIndexInAllSongDetails = parseInt(playedSongIndexInAllSongDetails) - 1
        playSong()
    }
})

document.querySelector('.lib-heading').addEventListener('click', (e) => {
    if (document.querySelector('.libPlaylistHeadingArrowBtn').src.endsWith('svg/downArrow.svg')) {
        document.querySelector('.libPlaylistHeadingArrowBtn').src = "svg/upArrow.svg"
        libSongs.classList.remove('library-collapsed')
        libSongs.classList.add('library-expanded')
    } else {
        document.querySelector('.libPlaylistHeadingArrowBtn').src = "svg/downArrow.svg"
        libSongs.classList.remove('library-expanded')
        libSongs.classList.add('library-collapsed')

    }
})

let id = 1
allPlaylistsNames.forEach((playlistName) => {
    let songs = []
    let playlistSongDetails = []
    let playlistSongThumnails = []

    async function getSongs() {
        let url = `http://127.0.0.1:3000/songs/${playlistName}/`

        let a = await fetch(url)
        let response = await a.text()
        // console.log(response);

        let div = document.createElement('div')
        div.innerHTML = response

        let as = div.querySelectorAll('a')
        console.log(as);

        for (let index = 0; index < as.length; index++) {
            if (as[index].href.endsWith('.mp3')) {
                songs.push(as[index].href)
            }
        }

        async function getThumbnails() {
            let a = await fetch(`http://127.0.0.1:3000/songsThumbnail/${playlistName}Thumnail/`)
            let response = await a.text()
            // console.log(response);

            let div = document.createElement('div')
            div.innerHTML = response

            let as = div.querySelectorAll('a')
            console.log(as);

            for (let index = 0; index < as.length; index++) {
                const element = as[index];
                if (element.href.endsWith('.jpg')) {
                    playlistSongThumnails.push(element.href)
                }
            }
            

        }

        getThumbnails().then(() => {
            console.log("playlistSongThumnails are", playlistSongThumnails);
        })

        await getThumbnails()

        songs.forEach((song) => {
            const modifiedSong = song
                .replace(/%20/g, " ")
                .split(`/songs/${playlistName}/`)[1]
                .replace(".mp3", "")
                .split('-')

            allsongDetails.push({ name: modifiedSong[0], Artist: modifiedSong[1] });
        })

        let index = 0

        allsongDetails.forEach((e) => {
            e.libSongThumnail = playlistSongThumnails[index]
            e.songLink = songs[index]
            e.currentState = false
            index++
            e.id = id
            id++
            e.album = playlistName
        })
        

        renderLibSongs()
        playPlaylistSongs()

    }

    getSongs().then(() => {
        console.log("songs links are", songs);
        console.log("allsongDetails are", allsongDetails);
        console.log("LibrarySongs are", LibrarySongs);

    })
})



function renderLibSongs() {
    libSongs.innerHTML = '';
    let index = 1

    LibrarySongs = allsongDetails.filter((song) => song.album === "Library")
    LibrarySongs.forEach((e) => {
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

function playPlaylistSongs() {

    allPlaylistsDOM.forEach((playlist) => {
        playlist.addEventListener('click', (e) => {

            if (playlist.parentNode.classList.contains('dynamicAlbums')) {
                // to be continued
            }

            else {

                if (!e.target.closest('li')) return;

                if (audio) {
                    if (e.target.closest('li').id == playedSongId) {
                        return

                    }
                }

                playedPlaylistAllSongs = Array.from(playlist.children)
                playedSongId = e.target.closest('li').id
                playedSongIndexInAllSongDetails = allsongDetails.findIndex((song) => song.id == playedSongId)

                let playPauseHandler = (e) => {
                    if (songInPlaylistPlayedInDOM.querySelector('.playPause').src.endsWith("svg/pause.svg")) {
                        audio.pause()
                        songInPlaylistPlayedInDOM.querySelector('.playPause').src = "svg/play.svg"
                        seekbarPlayPause.src = "svg/play.svg"
                    }
                    else {
                        audio.play()
                        songInPlaylistPlayedInDOM.querySelector('.playPause').src = "svg/pause.svg"
                        seekbarPlayPause.src = "svg/pause.svg"
                    }
                }

                playSong = function () {
                    playedPlaylistAllSongs.forEach((e) => {
                        e.querySelector('.playPause').src = "svg/play.svg"
                        e.querySelector('.songName').style.color = "white"
                    })

                    playedSongIndexInAllSongDetails = allsongDetails.find((song) => song.id == playedSongId)

                    allsongDetails.forEach((e) => {
                        e.currentState = false
                    })


                    allsongDetails[playedSongIndexInAllSongDetails].currentState = true
                    console.log(playedSongIndexInAllSongDetails);

                    if (audio) {
                        audio.pause()
                        audio.currentTime = 0
                    }

                    audio = new Audio(allsongDetails(playedSongIndexInAllSongDetails).songLink)
                    audio.play()

                    songInPlaylistPlayedInDOM = e.target.closest('li')

                    songInPlaylistPlayedInDOM.querySelector('.playPause').src = "svg/pause.svg"
                    songInPlaylistPlayedInDOM.querySelector('.songName').style.color = "yellow"
                    seekbarPlayPause.src = "svg/pause.svg"

                    songInPlaylistPlayedInDOM.querySelector('.playPause').removeEventListener('click', playPauseHandler)

                    songInPlaylistPlayedInDOM.querySelector('.playPause').addEventListener('click', playPauseHandler)

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
                    document.querySelector('.playBarLeftSongPhoto').src = playedSongIndexInAllSongDetails.libSongThumnail
                    document.querySelector('.playBArLeftSongName').innerHTML = playedSongIndexInAllSongDetails.name
                    document.querySelector('.playBArLeftSongArtist').innerHTML = playedSongIndexInAllSongDetails.Artist

                    audio.addEventListener('timeupdate', () => {
                        if (audio.duration === audio.currentTime) {
                            playNextSong()
                        }
                    })
                }

                playSong()
            }

        })
    })

}


