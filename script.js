let allsongDetails = {}

let playlistPlayedInDOM
let playedPlaylist
let playedPlaylistAllSongsInDOM
let playedSongId
let playedSongInAllSongDetails
let songInPlaylistPlayedInDOM
let playedSongIndexInAllSongDetails


let audio = null

let playSong = function () { }

document.querySelector(".popularSongsHeadingLeftArrow").addEventListener('click', () => {
    document.querySelector("#PopularSongs").scrollLeft -= 300
})

document.querySelector(".popularSongsHeadingRightArrow").addEventListener('click', () => {
    document.querySelector("#PopularSongs").scrollLeft += 300
})

document.querySelector(".popularArtistsHeadingLeftArrow").addEventListener('click', () => {
    document.querySelector("#popularArtistsCards").scrollLeft -= 300
})

document.querySelector(".popularArtistsHeadingRightArrow").addEventListener('click', () => {
    document.querySelector("#popularArtistsCards").scrollLeft += 300
})

document.querySelector('#seekbarPlayPause').addEventListener('click', () => {
    if (audio.paused) {
        audio.play()
        document.querySelector('#seekbarPlayPause').src = "svg/pause.svg"
        songInPlaylistPlayedInDOM.querySelector('.playPause').src = "svg/pause.svg"
    } else {
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
        } else {
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
    } else {
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
        } else {
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
    if (audio && playedSongInAllSongDetails < playlistPlayedInDOM.length) {
        playedSongInAllSongDetails = parseInt(playedSongInAllSongDetails) + 1
        playedSongIndexInAllSongDetails = parseInt(playedSongIndexInAllSongDetails) + 1
        playSong()
    }
}

document.querySelector('#next').addEventListener('click', (e) => {
    playNextSong()
})

document.querySelector('#previous').addEventListener('click', (e) => {
    if (audio && playedSongInAllSongDetails > 1) {
        playedSongInAllSongDetails = parseInt(playedSongInAllSongDetails) - 1
        playedSongIndexInAllSongDetails = parseInt(playedSongIndexInAllSongDetails) - 1
        playSong()
    }
})

document.querySelector('.lib-heading').addEventListener('click', (e) => {
    if (document.querySelector('.libPlaylistHeadingArrowBtn').src.endsWith('svg/downArrow.svg')) {
        document.querySelector('.libPlaylistHeadingArrowBtn').src = "svg/upArrow.svg"
        document.querySelector("#LibrarySongs").classList.remove('library-collapsed')
        document.querySelector("#LibrarySongs").classList.add('library-expanded')
    } else {
        document.querySelector('.libPlaylistHeadingArrowBtn').src = "svg/downArrow.svg"
        document.querySelector("#LibrarySongs").classList.remove('library-expanded')
        document.querySelector("#LibrarySongs").classList.add('library-collapsed')
    }
})


let folderlinks = []

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text()
    console.log(response)

    let div = document.createElement('div')
    div.innerHTML = response

    let as = div.querySelectorAll('a')
    console.log(as)

    for (let index = 0; index < as.length; index++) {
        const element = as[index]
        if (as[index].href.includes('songs')) {
            folderlinks.push(element)
        }
    }

    for (const link of folderlinks) {
        async function openfolders() {
            if (link.href.includes('Library')) {
                allsongDetails.LibrarySongs = {}

                let a = await fetch(link.href)
                let response = await a.text()

                let div = document.createElement('div')
                div.innerHTML = response

                let as = div.querySelectorAll('a')

                let songs = []
                for (let index = 0; index < as.length; index++) {
                    let song = {}
                    const element = as[index]
                    if (element.href.includes('.mp3')) {
                        song.name = element.innerHTML.split("-")[0].trim()
                        song.artist = element.innerHTML.split("-")[1].replace(".mp3", "").trim()
                        song.songLink = element.href
                        song.songThumnail = `http://127.0.0.1:3000/songs Thumbnail/LibraryThumbnail/${song.name} - ${song.artist}.jpg`
                        song.state = false
                        songs.push(song)
                    }
                }

                allsongDetails.LibrarySongs.songs = songs

            }

            else if (link.href.includes('Popular%20Songs')) {
                allsongDetails.PopularSongs = {}

                let a = await fetch(link.href)
                let response = await a.text()

                let div = document.createElement('div')
                div.innerHTML = response

                let as = div.querySelectorAll('a')

                let songs = []
                for (let index = 0; index < as.length; index++) {
                    let song = {}
                    const element = as[index]
                    if (element.href.includes('.mp3')) {
                        song.name = element.innerHTML.split("-")[0].trim()
                        song.artist = element.innerHTML.split("-")[1].replace(".mp3", "").trim()
                        song.songLink = element.href
                        song.songThumnail = `http://127.0.0.1:3000/songs Thumbnail/Popular SongsThumbnail/${song.name} - ${song.artist}.jpg`
                        song.state = false
                        songs.push(song)
                    }
                }

                allsongDetails.PopularSongs.songs = songs
            }

            else {
                let artistName = link.innerHTML.replace("/", "")
                allsongDetails[artistName] = {}
                let a = await fetch(link.href)
                let response = await a.text()

                let div = document.createElement('div')
                div.innerHTML = response

                let as = div.querySelectorAll('a')

                let songs = []
                for (let index = 0; index < as.length; index++) {
                    let song = {}
                    const element = as[index]
                    if (element.href.includes('.mp3')) {
                        song.name = element.innerHTML.split("-")[0].trim()
                        song.songLink = element.href
                        song.songThumnail = `http://127.0.0.1:3000/songs Thumbnail/${song.artist}Thumbnail/${song.name} - ${song.artist}.jpg`
                        song.state = false
                        songs.push(song)
                    }
                }

                allsongDetails[artistName].songs = songs
                allsongDetails[artistName].photo = `http://127.0.0.1:3000/ArtistPhotos/${link.innerHTML.replace("/", "")}.jpg`
            }
        }

        await openfolders()
    }

}

getSongs().then(() => {
    console.log("folder links are", folderlinks)

    let id = 1
    for (const key in allsongDetails) {
        allsongDetails[key].songs.forEach((song) => {
            song.id = id
            id++
        });
    }

    console.log("allsongDetails are", allsongDetails)
    console.table(allsongDetails);

    renderSongs()
    playPlaylistSongs()
})


function renderSongs() {
    document.querySelector('#LibrarySongs').innerHTML = '';
    document.querySelector('#PopularSongs').innerHTML = '';
    document.querySelector('#popularArtistsCards').innerHTML = '';
    let index = 1
    let LibrarySongs = allsongDetails["LibrarySongs"].songs
    console.table("LibrarySongs are", LibrarySongs);

    document.querySelector('.NoOfLibSongs').innerHTML = `${allsongDetails.LibrarySongs.songs.length} songs`
    LibrarySongs.forEach((e) => {
        let li = document.createElement('li')
        li.className = `librarySong song flex items-center gap-3 cursor-pointer hover:scale-105 hover:ease-in hover:duration-100 pb-2`
        li.id = e.id

        li.innerHTML = `
        <span class="font-bold text-lg">${index}</span>
    
        <div class="songPhoto w-[50px]">
           <img src="${e.songThumnail}" alt="" width="50px" class="rounded-md object-cover">
         </div>
    
        <div class="songDetails">
            <div class="songName font-bold text-lg">${e.name}</div>
            <div class="songArtist">${e.artist}</div>
        </div>
    
        <img src="svg/play.svg" alt="" class="playPause p-2 bg-white rounded-full play ml-auto pr-2 ">
        `
        index++

        document.querySelector('#LibrarySongs').appendChild(li)
    })

    let popularSongs = allsongDetails["PopularSongs"].songs
    console.table("popularSongs are", popularSongs);
    popularSongs.forEach((e) => {
        let li = document.createElement('li')
        li.className = `card song hover:bg-[#1e1d1d] ease-linear duration-100 min-w-[160px] rounded-lg p-3 cursor-pointer `
        li.id = e.id

        li.innerHTML = `<div class="imageBox relative  mb-2">
                                <div
                                    class="play bg-green-500 w-fit rounded-full p-3 absolute top-[100px] right-3 opacity-0">
                                    <img src="svg/play.svg" alt="">
                                </div>

                                <img src="${e.songThumnail}" alt=""
                                    class="rounded-full w-[145px] h-[145px] object-cover">
                            </div>
                            <div class="name text-base font-normal hover:underline text-center">
                                ${e.name}
                            </div>
                            <div class="profession text-[#b3b3b3] text-base font-normal text-center">
                                ${e.artist}
                            </div>`
        index++

        document.querySelector('#PopularSongs').appendChild(li)
    })

    for (const key in allsongDetails) {
        if (key != "LibrarySongs" && key != "PopularSongs") {
            let li = document.createElement('li')
            li.id = key
            li.className = `card album hover:bg-[#1e1d1d] ease-linear duration-100 min-w-[160px] rounded-lg p-3 cursor-pointer `

            li.innerHTML = `<div class="imageBox relative  mb-2">
                                <div
                                    class="play bg-green-500 w-fit rounded-full p-3 absolute top-[100px] right-3 opacity-0">
                                    <img src="svg/play.svg" alt="">
                                </div>

                                <img src = "${allsongDetails[key].photo}" alt=""
                                    class="rounded-full w-[145px] h-[145px] object-cover">
                            </div>
                            <div class="name text-base font-normal text-center hover:underline ">
                                ${key}
                            </div>
                            <div class="name text-sm font-normal text-center hover:underline ">
                                ${allsongDetails[key].songs.length} songs
                            </div>
                            `
            index++

            document.querySelector('#popularArtistsCards').appendChild(li)
        }
    }


}

function playPlaylistSongs() {
    document.querySelectorAll('.playlist').forEach((playlist) => {
        playlist.addEventListener('click', (e) => {
            if (!e.target.closest('li')) return;

            if (audio) {
                if (e.target.closest('li').id == playedSongInAllSongDetails) {
                    return

                }
            }

            playedSongId = e.target.id
            playedPlaylist = playlist.id
            playedPlaylistAllSongsInDOM = Array.from(playlist.children)
            playedSongInAllSongDetails = allsongDetails[playedPlaylist].songs.filter((song) => song.id == playedSongId)
            // playedSongIndexInAllSongDetails = allsongDetails.findIndex((song) => song.id == playedSongInAllSongDetails)

            console.log(playedPlaylist);
            console.log(playedPlaylistAllSongsInDOM);
            console.log(playedSongInAllSongDetails);

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
                playedPlaylistAllSongsInDOM.forEach((e) => {
                    e.querySelector('.playPause').src = "svg/play.svg"
                    e.querySelector('.songName').style.color = "white"
                })

                // playedSongIndexInAllSongDetails = allsongDetails.find((song) => song.id == playedSongInAllSongDetails)

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
        })


    })


}