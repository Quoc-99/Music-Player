/**
 * 1. Render Song
 * 2. Scroll Top
 * 3. Play/ pause/ seek
 * 4. CD rotate
 * 5. Next / previous 
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when clicked
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const playlist = $('.playlist');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');

const playBtn = $('.btn-toggle-play');
const player = $('.player');

const progress = $('#progress');

const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');

const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs : [
        {
            name: 'Save Your Tears',
            singer: 'The Weekend',
            path: './assets/music/Save-Your-Tears-The-Weeknd.mp3',
            image: './assets/img/SaveYourTears.jpg',
        },
        {
            name: 'At My Worst',
            singer: 'Pink Sweat',
            path: './assets/music/At-My-Worst-Pink-Sweat_.mp3',
            image: './assets/img/At My Worst.jpg',
        },
        {
            name: 'Happy',
            singer: 'Pharrell Williams',
            path: './assets/music/Happy-Pharrell-Williams.mp3',
            image: './assets/img/Happy.jpg',
        },
        {
            name: 'I Feel It Comming',
            singer: 'The Weeknd_Daft Punk',
            path: './assets/music/I-Feel-It-Coming-The-Weeknd_-Daft-Punk.mp3',
            image: './assets/img/I Feel It Coming.jpg',
        },
        {
            name: 'Love Me Like You Do',
            singer: 'Ellie Goulding',
            path: './assets/music/Love-Me-Like-You-Do-Ellie-Goulding.mp3',
            image: './assets/img/Love Me Like You Do.jpg',
        },
        {
            name: 'Starboy',
            singer: 'The Weeknd_Daft Punk',
            path: './assets/music/Starboy-The-Weeknd_-Daft-Punk.mp3',
            image: './assets/img/StarBoy.jpg',
        },
        {
            name: 'Thank U, Next',
            singer: 'Ariana Grande',
            path: './assets/music/Thank-U-Next_Ariana-Grande.mp3',
            image: './assets/img/Thank U, Next.jpg',
        },
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handelEvents: function () {
        const cdWidth = cd.offsetWidth;
        const _this = this;

        // X??? l?? cd quay

        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, // 10 seconds
            iterations: Infinity // L???p v?? h???n
        })
        cdThumbAnimate.pause();

        // X??? l?? ph??ng to thu nh??? cd khi scroll
        document.onscroll = function () {

            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // X??? l?? khi click play
        playBtn.onclick = function () {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Khi song ???????c play
        audio.onplay = function () {

            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        // Khi song b??? paused
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Khi ti???n ????? b??i h??t thay ?????i
        audio.ontimeupdate = function () {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // X??? l?? khi tua b??i h??t 
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // Khi next song 
        nextBtn.onclick = function () {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        // Khi prev song 
        prevBtn.onclick = function () {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
        }

        // Khi click n??t random
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // X??? l?? next song khi audio ended
        audio.onended = function () {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // X??? l?? khi nh???n n??t repeat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // X??? l?? l???ng nghe khi click v??o playlist 
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')) {
                
                // X??? l?? khi click v??o song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // X??? l?? khi click v??o song option
                if(e.target.closest('.option')) {

                }
            }
        }

    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }

        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }

        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while(newIndex === this.currentIndex)

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollToActiveSong: function() {
        setTimeout(function () {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        }, 300)
    },
    start: function() {

        // G??n c???u h??nh t??? config v??o ???ng d???ng
        this.loadConfig();

        // ?????nh ngh??a c??c thu???c t??nh cho Object
        this.defineProperties();

        // L???ng nghe / x??? l?? c??c s??? ki???n (DOM Events)
        this.handelEvents();

        // T???i th??ng tin b??i h??t ?????u ti??n v??o UI khi ch???y ???ng d???ng
        this.loadCurrentSong();

        // Render playlist
        this.render();

        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}

app.start();

