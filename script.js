let allsongDetails = {}

let playedPlaylist
let playedSongId
let playedSongInAllSongDetails
let playedSongLink
let songInPlaylistPlayedInDOM

let albumContainers = []

let audio = null

let renderLibSongs = function () {
    document.querySelector('#LibrarySongs').innerHTML = '';
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
        
            <div class="songPhoto w-[50px] h-[50px]">
               <img src="${e.songThumnail}" alt="" width="50px" class="rounded-md object-cover w-full h-full">
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
}

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

document.querySelector('.addToPlaylist').addEventListener('click', () => {
    if (playedPlaylist !== "LibrarySongs") {
        if (document.querySelector('.addToPlaylist').src.endsWith("svg/tick.svg")) {
            playedSongInAllSongDetails.added = false
            allsongDetails.LibrarySongs.songs = allsongDetails.LibrarySongs.songs.filter((song) => song.id != playedSongId)
            document.querySelector('.addToPlaylist').style.backgroundColor = ""
            document.querySelector('.addToPlaylist').src = "svg/plus.svg"
            renderLibSongs()
        } else {
            playedSongInAllSongDetails.added = true
            allsongDetails.LibrarySongs.songs.push(playedSongInAllSongDetails)
            document.querySelector('.addToPlaylist').style.backgroundColor = "yellow"
            document.querySelector('.addToPlaylist').src = "svg/tick.svg"
            renderLibSongs()
            if (songInPlaylistPlayedInDOM.querySelector('.playPause').src.endsWith("svg/pause.svg")) {
                document.querySelector('#LibrarySongs').lastElementChild.querySelector('.playPause').src = "svg/pause.svg"
            } else {
                document.querySelector('#LibrarySongs').lastElementChild.querySelector('.playPause').src = "svg/play.svg"
            }
            songInPlaylistPlayedInDOM.querySelector('.playPause').addEventListener('click', () => {
                if (songInPlaylistPlayedInDOM.querySelector('.playPause').src.endsWith("svg/pause.svg")) {
                    document.querySelector('#LibrarySongs').lastElementChild.querySelector('.playPause').src = "svg/pause.svg"
                } else {
                    document.querySelector('#LibrarySongs').lastElementChild.querySelector('.playPause').src = "svg/play.svg"
                }

            })
        }

    }
    else {
        let remainingSongs = []
        let ifSongInOtherPlaylist
        if (document.querySelector('.addToPlaylist').src.endsWith("svg/tick.svg")) {
            playedSongInAllSongDetails.added = false
            allsongDetails.LibrarySongs.songs = allsongDetails.LibrarySongs.songs.filter((song) => song.id != playedSongId)
            document.querySelector('.addToPlaylist').style.backgroundColor = ""
            document.querySelector('.addToPlaylist').src = "svg/plus.svg"
            songInPlaylistPlayedInDOM.style.display = "none"

            // storing the song if it is not present in other playlists

            for (const key in allsongDetails) {
                if (key == "deletedSongs" && key == "LibrarySongs") {
                    continue
                }
                allsongDetails[key].songs.forEach((song) => {
                    remainingSongs.push(song)
                })

            }
            ifSongInOtherPlaylist = remainingSongs.filter((song) => song == playedSongInAllSongDetails)
            if (ifSongInOtherPlaylist.length == 0) {
                allsongDetails["deletedSongs"].songs.push(playedSongInAllSongDetails)
            }



        } else {
            playedSongInAllSongDetails.added = true
            allsongDetails.LibrarySongs.songs.push(playedSongInAllSongDetails)
            document.querySelector('.addToPlaylist').style.backgroundColor = "yellow"
            document.querySelector('.addToPlaylist').src = "svg/tick.svg"
            songInPlaylistPlayedInDOM.style.display = "flex"
            allsongDetails["deletedSongs"].songs = allsongDetails["deletedSongs"].songs.filter((song) => song !== playedSongInAllSongDetails)
        }
    }


    document.querySelector('.NoOfLibSongs').innerHTML = `${allsongDetails.LibrarySongs.songs.length} songs`
})




let playSong = function () {
    document.querySelectorAll('.playPause').forEach((btn) => {
        btn.src = "svg/play.svg"
    })

    document.querySelectorAll('.songName').forEach((btn) => {
        btn.style.color = "white"
    })

    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('playing');
    });

    for (const key in allsongDetails) {
        allsongDetails[key].songs.forEach((song) => {
            song.state = false
        })
    }

    songInPlaylistPlayedInDOM.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
    });

    if (audio) {
        audio.pause()
        audio.currentTime = 0
    }

    playedSongInAllSongDetails.state = true

    audio = new Audio(playedSongLink)
    audio.play()

    if (playedSongInAllSongDetails.added) {
        document.querySelector('.addToPlaylist').style.display = "block"
        document.querySelector('.addToPlaylist').src = "svg/tick.svg"
        document.querySelector('.addToPlaylist').style.backgroundColor = "yellow"
    } else {
        document.querySelector('.addToPlaylist').style.backgroundColor = ""
        document.querySelector('.addToPlaylist').src = "svg/plus.svg"
        document.querySelector('.addToPlaylist').style.display = "block"
    }

    songInPlaylistPlayedInDOM.querySelector('.playPause').src = "svg/pause.svg"
    songInPlaylistPlayedInDOM.querySelector('.songName').style.color = "yellow"
    songInPlaylistPlayedInDOM.classList.add('playing');

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
    document.querySelector('.playBarLeftSongPhoto').src = playedSongInAllSongDetails.songThumnail
    document.querySelector('.playBArLeftSongName').innerHTML = playedSongInAllSongDetails.name
    document.querySelector('.playBArLeftSongArtist').innerHTML = playedSongInAllSongDetails.artist
}

let playNextSong = function (randomIndex = null, randomIndexArray = null, playedPlaylistLength = null) {
    if (!songInPlaylistPlayedInDOM.parentNode.parentNode.firstElementChild.querySelector('.shuffle').style.backgroundColor) {
        if (audio && songInPlaylistPlayedInDOM.nextElementSibling) {
            document.querySelectorAll('.playPause').forEach((btn) => {
                btn.src = "svg/play.svg"
            })

            document.querySelectorAll('.songName').forEach((btn) => {
                btn.style.color = "white"
            })
            playedSongId = songInPlaylistPlayedInDOM.nextElementSibling.id
            playedSongInAllSongDetails = allsongDetails[playedPlaylist].songs.find((song) => song.id == playedSongId)
            songInPlaylistPlayedInDOM = songInPlaylistPlayedInDOM.nextElementSibling
            playedSongLink = allsongDetails[playedPlaylist].songs.find((song) => song.id == playedSongId).songLink
            playSong()



            audio.addEventListener('ended', () => {
                playNextSong()
            })
        } else {
            playedSongId = songInPlaylistPlayedInDOM.parentNode.firstElementChild.id
            playedSongInAllSongDetails = allsongDetails[playedPlaylist].songs.find((song) => song.id == playedSongId)
            songInPlaylistPlayedInDOM = songInPlaylistPlayedInDOM.parentNode.firstElementChild
            playedSongLink = allsongDetails[playedPlaylist].songs.find((song) => song.id == playedSongId).songLink


            document.querySelector('.currentTime').innerHTML = "0:00"
            seekBarCircle.style.left = "0%"
            playSong()
            audio.pause()
            songInPlaylistPlayedInDOM.querySelector('.playPause').src = "svg/play.svg"
            seekbarPlayPause.src = "svg/play.svg"

            audio.addEventListener('ended', () => {
                playNextSong()
            })

        }
    }
    else {
        if (document.querySelector('#loop').src.endsWith("svg/loop.svg")) {
            randomIndex = Math.floor(Math.random() * (playedPlaylistLength - 0 + 1)) + 0
            while (randomIndexArray.includes(randomIndex)) {
                randomIndex = Math.floor(Math.random() * (playedPlaylistLength - 0 + 1)) + 0
            }
            randomIndexArray.push(randomIndex)


            document.querySelectorAll('.playPause').forEach((btn) => {
                btn.src = "svg/play.svg"
            })

            document.querySelectorAll('.songName').forEach((btn) => {
                btn.style.color = "white"
            })

            playedSongId = Array.from(songInPlaylistPlayedInDOM.parentNode.children)[randomIndex].id
            playedSongInAllSongDetails = allsongDetails[playedPlaylist].songs.find((song) => song.id == playedSongId)
            songInPlaylistPlayedInDOM = Array.from(songInPlaylistPlayedInDOM.parentNode.children)[randomIndex]
            playedSongLink = allsongDetails[playedPlaylist].songs.find((song) => song.id == playedSongId).songLink


            playSong()

            audio.addEventListener('ended', () => {
                playNextSong()
            })

        }
    }

}

document.querySelector('#next').addEventListener('click', (e) => {
    playNextSong()
})

document.querySelector('#previous').addEventListener('click', (e) => {
    if (audio && songInPlaylistPlayedInDOM.previousElementSibling) {
        document.querySelectorAll('.playPause').forEach((btn) => {
            btn.src = "svg/play.svg"
        })

        document.querySelectorAll('.songName').forEach((btn) => {
            btn.style.color = "white"
        })
        playedSongId = songInPlaylistPlayedInDOM.previousElementSibling.id
        playedSongInAllSongDetails = allsongDetails[playedPlaylist].songs.find((song) => song.id == playedSongId)
        songInPlaylistPlayedInDOM = songInPlaylistPlayedInDOM.previousElementSibling
        playedSongLink = allsongDetails[playedPlaylist].songs.find((song) => song.id == playedSongId).songLink
        playSong()
    }
})

document.querySelectorAll('.shuffle').forEach((shuffle) => {
    shuffle.addEventListener('click', (e) => {
        if (!shuffle.style.backgroundColor) {
            document.querySelectorAll('.shuffle').forEach((shuffle) => {
                shuffle.style.backgroundColor = ""
            })

            shuffle.style.backgroundColor = "yellow"
            e.stopPropagation()

            if (playedPlaylist == shuffle.parentNode.parentNode.parentNode.lastElementChild.id) {
                audio.addEventListener('ended', () => {
                    let randomIndexArray = []
                    let playedPlaylistLength = shuffle.parentNode.parentNode.parentNode.lastElementChild.children.length - 1
                    let randomIndex = Math.floor(Math.random() * (playedPlaylistLength - 0 + 1)) + 0
                    randomIndexArray.push(randomIndex)

                    console.log(randomIndex);

                    playedPlaylist = shuffle.parentNode.parentNode.parentNode.lastElementChild.id
                    playedSongId = Array.from(shuffle.parentNode.parentNode.parentNode.lastElementChild.children)[randomIndex].id

                    playedSongInAllSongDetails = allsongDetails[playedPlaylist].songs.find((song) => song.id == playedSongId)
                    songInPlaylistPlayedInDOM = Array.from(shuffle.parentNode.parentNode.parentNode.lastElementChild.children)[randomIndex]
                    playedSongLink = allsongDetails[playedPlaylist].songs.find((song) => song.id == playedSongId).songLink
                    playSong()

                    audio.addEventListener('ended', () => {
                        playNextSong(randomIndex, randomIndexArray, playedPlaylistLength)
                    })
                })
            }
            else {
                let randomIndexArray = []
                let playedPlaylistLength = shuffle.parentNode.parentNode.parentNode.lastElementChild.children.length - 1
                let randomIndex = Math.floor(Math.random() * (playedPlaylistLength - 0 + 1)) + 0
                randomIndexArray.push(randomIndex)

                playedPlaylist = shuffle.parentNode.parentNode.parentNode.lastElementChild.id
                playedSongId = Array.from(shuffle.parentNode.parentNode.parentNode.lastElementChild.children)[randomIndex].id

                playedSongInAllSongDetails = allsongDetails[playedPlaylist].songs.find((song) => song.id == playedSongId)
                songInPlaylistPlayedInDOM = Array.from(shuffle.parentNode.parentNode.parentNode.lastElementChild.children)[randomIndex]
                playedSongLink = allsongDetails[playedPlaylist].songs.find((song) => song.id == playedSongId).songLink
                playSong()

                audio.addEventListener('timeupdate', () => {
                    playNextSong(randomIndex, randomIndexArray, playedPlaylistLength)
                })
            }


        }

        else {
            shuffle.style.backgroundColor = ""
            e.stopPropagation()
            audio.addEventListener('ended', () => {
                playNextSong()
            })
        }

    })
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
                        song.added = true
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
                        song.added = false
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
                        song.artist = element.innerHTML.split("-")[1].replace(".mp3", "").trim()
                        song.songLink = element.href
                        song.songThumnail = `http://127.0.0.1:3000/songs Thumbnail/${song.artist}Thumbnail/${song.name} - ${song.artist}.jpg`
                        song.state = false
                        song.added = false
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

    allsongDetails["deletedSongs"] = {}
    allsongDetails["deletedSongs"].songs = []

    console.log("allsongDetails are", allsongDetails)
    console.table(allsongDetails);

    renderSongs()
    playPlaylistSongs()
})

function renderSongs() {
    document.querySelector('#PopularSongs').innerHTML = '';
    document.querySelector('#popularArtistsCards').innerHTML = '';

    renderLibSongs()

    let index = 1
    let popularSongs = allsongDetails["PopularSongs"].songs
    console.table("popularSongs are", popularSongs);
    popularSongs.forEach((e) => {
        let li = document.createElement('li')
        li.className = `card song hover:bg-[#1e1d1d] ease-linear duration-100 min-w-[160px] rounded-lg p-3 cursor-pointer `
        li.id = e.id

        li.innerHTML = `<div class="imageBox relative  mb-2">
                                <div
                                    class="playBox bg-green-500 w-fit rounded-full p-3 absolute top-[95px] right-3 opacity-0">
                                    <img class = "playPause" src="svg/play.svg" alt="">
                                </div>

                                <img src="${e.songThumnail}" alt=""
                                    class="rounded-full w-[145px] h-[145px] ">
                            </div>
                            <div class="songName text-base font-normal hover:underline text-center">
                                ${e.name}
                            </div>
                            <div class="profession text-[#b3b3b3] text-base font-normal text-center">
                                ${e.artist}
                            </div>`
        index++

        document.querySelector('#PopularSongs').appendChild(li)
    })

    for (const key in allsongDetails) {
        if (key != "LibrarySongs" && key != "PopularSongs" && key != "deletedSongs") {
            let li = document.createElement('li')
            li.id = key
            li.className = `card album hover:bg-[#1e1d1d] ease-linear duration-100 min-w-[160px] rounded-lg p-3 cursor-pointer `

            li.innerHTML = `<div class="imageBox relative  mb-2">
                                <div
                                    class="playBox bg-green-500 w-fit rounded-full p-3 absolute top-[95px] right-3 opacity-0">
                                    <img class = "playPause" src="svg/play.svg" alt="">
                                </div>

                                <img src = "${allsongDetails[key].photo}" alt=""
                                    class="rounded-full w-[145px] h-[145px] object-cover">
                            </div>
                            <div class="name text-base font-normal text-center hover:underline ">
                                ${key}
                            </div>
                            <div class="noOfAlbumSongs text-sm font-normal text-center hover:underline ">
                                ${allsongDetails[key].songs.length} songs
                            </div>
                            `
            index++

            document.querySelector('#popularArtistsCards').appendChild(li)
        }
    }

    document.querySelectorAll('.album').forEach((album) => {
        let div = document.createElement('div')
        div.className = `${album.id}Container albumContainer flex flex-col h-fit bg-[#2a1f1f] rounded-md mb-4`
        div.innerHTML = `
            <div class="album-heading flex gap-3 items-center w-full  p-3  cursor-pointer">
                <img src="ArtistPhotos/${album.id}.jpg" alt="" class="h-[40px] w-[40px]">
                <div class="font-semibold text-lg text-white ease-in-out duration-100">
                    ${album.id}</div>
                <div class="NoOfAlbumSongs">${allsongDetails[album.id].songs.length} songs</div>
                <div class="ml-auto flex items-center gap-2">
                    <img src="svg/shuffle.svg"
                        class="shuffle rounded-full p-2 hover:bg-red-500 transition-all" alt="">
                    <img src="svg/cross.svg" class="albumCross" alt="">
                    <img src="svg/upArrow.svg" width="30px" class="albumHeadingArrowBtn ml-auto">
                </div>
            </div>

            <ul id="${album.id}"
                class="playlist flex flex-col gap-3 px-3 mt-3 overflow-y-auto library-expanded">
            </ul>
            `
        let index = 1
        let albumSongs = allsongDetails[album.id].songs

        albumSongs.forEach((e) => {
            let li = document.createElement('li')
            li.className = `song flex items-center gap-3 cursor-pointer hover:scale-105 hover:ease-in hover:duration-100 pb-2`
            li.id = e.id

            li.innerHTML = `
                <span class="font-bold text-lg">${index}</span>
            
                <div class="songPhoto w-[50px] h-[50px]">
                <img src="${e.songThumnail}" alt="" width="50px" class="rounded-md object-cover w-full h-full">
                </div>
            
                <div class="songDetails">
                    <div class="songName font-bold text-lg">${e.name}</div>
                    
                </div>
            
                <img src="svg/play.svg" alt="" class="playPause p-2 bg-white rounded-full play ml-auto pr-2 ">
        `
            index++

            div.querySelector('.playlist').appendChild(li)
        })

        albumContainers.push(div)

    })


}

function playPlaylistSongs() {
    document.querySelectorAll('.playlist').forEach((playlist) => {
        playlist.addEventListener('click', (e) => {
            if (!e.target.closest('li')) return;

            if (audio) {
                if (e.target.closest('li').id == playedSongId) {
                    return

                }
            }

            document.querySelectorAll(".shuffle").forEach((shuffle) => {
                shuffle.style.backgroundColor = ""
            })

            playedPlaylist = playlist.id
            playedSongId = e.target.closest('li').id
            playedSongInAllSongDetails = allsongDetails[playedPlaylist].songs.find((song) => song.id == playedSongId)
            songInPlaylistPlayedInDOM = e.target.closest('li')
            playedSongLink = allsongDetails[playedPlaylist].songs.find((song) => song.id == playedSongId).songLink

            console.log(playedPlaylist);
            console.log(playedSongId);
            console.log(playedSongInAllSongDetails);
            console.log(songInPlaylistPlayedInDOM);

            playSong()

            audio.addEventListener('ended', () => {
                playNextSong()
            })

        })
    })

    document.querySelectorAll('.album').forEach((album) => {
        album.addEventListener('click', (e) => {

            if (document.querySelector('.sidebarPlaylists').querySelector('.albumContainer')) {
                document.querySelector('.sidebarPlaylists').querySelectorAll('.albumContainer').forEach((container) => {
                    if (playedPlaylist !== container.lastElementChild.id) {
                        container.remove()
                    }
                })

            }

            albumContainers.forEach((container) => {
                if (container.className.includes(`${e.target.closest('li').id}Container`)) {
                    document.querySelector('.sidebarPlaylists').appendChild(container)
                    container.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });

                    container.querySelector('.albumCross').addEventListener('click', () => {
                        container.remove()
                        if (playedPlaylist == container.querySelector('.playlist').id) {
                            audio.pause()
                            audio.currentTime = 0
                            document.querySelector('.playBArLeftSongName').innerHTML = ""
                            document.querySelector('.playBArLeftSongArtist').innerHTML = ""
                            document.querySelector('#seekbarPlayPause').src = "svg/play.svg"
                            document.querySelector('.playBarLeftSongPhoto').src = "black.jpg"
                        }
                    })

                    container.querySelector('.album-heading').addEventListener('click', (e) => {
                        if (container.querySelector('.albumHeadingArrowBtn').src.endsWith('svg/downArrow.svg')) {
                            container.querySelector('.albumHeadingArrowBtn').src = "svg/upArrow.svg"
                            container.querySelector("ul").classList.remove('library-collapsed')
                            container.querySelector("ul").classList.add('library-expanded')
                        } else {
                            container.querySelector('.albumHeadingArrowBtn').src = "svg/downArrow.svg"
                            container.querySelector("ul").classList.remove('library-expanded')
                            container.querySelector("ul").classList.add('library-collapsed')
                        }
                    })

                }
            })

            playPlaylistSongs()
        })
    })


}