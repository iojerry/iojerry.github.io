// ---------- GLOBAL ----------
let photos = [];
let music, finalMusic, galleryMusic, birthdayExtra;
let decoys = [
    "images/decoy1.jpg",
    "images/decoy2.jpg",
    "images/decoy3.jpg"
];
for (let i = 1; i <= 9; i++) photos.push("images/" + i + ".jpg");

let input = "Arohi";

// ---------- SCREEN ----------
function show(id) {
    document.querySelectorAll(".screen").forEach(s => s.style.display = "none");
    document.getElementById(id).style.display = "flex";
}


// ---------- INIT ----------
window.onload = () => {
    music = document.getElementById("bgMusic");
    finalMusic = document.getElementById("finalMusic");
    galleryMusic = document.getElementById("galleryMusic");
    birthdayExtra = document.getElementById("birthdayExtra");
    birthdayExtra.volume = 1; // softer
    document.body.addEventListener("click", () => {
        ;
        if (finalMusic) {
            finalMusic.play().then(() => {
                finalMusic.pause();
                finalMusic.currentTime = 0;
            }).catch(() => { });
        }
    }, { once: true });
    music.volume = 1;
    galleryMusic.volume = 0.5;
    finalMusic.volume = 1;

    startIntro();
    document.addEventListener("click", function (e) {
        if (e.target.tagName === "BUTTON") {
        }
    });
    document.getElementById("nextBtn").onclick = () => show("login");

    document.getElementById("startBtn").onclick = () => {
        let userName = document.getElementById("nameInput").value;
        if (userName.trim() !== "") input = userName;
        switchTrack(music);
        startGame();
    };
};


// ---------- INTRO ----------
function startIntro() {
    show("intro");
    setTimeout(() => {
        characterSay("Hey... this is for you ❤️");
    }, 1800);
    let messages = [
        "Hello...",
        "I made something for you,",
        "Don't judge too fast 👀",
        "This is just for you ❤️"
    ];

    let i = 0;

    function next() {
        if (i < messages.length) {
            typeMessage(messages[i], () => {
                i++;
                setTimeout(next, 50);
            });
        } else {
            document.getElementById("nextBtn").style.display = "block";
        }
    }

    next();
}


// ---------- TYPE EFFECT ----------
function typeMessage(text, cb) {
    let box = document.getElementById("chatBox");

    let msg = document.createElement("div");
    msg.className = "msg";
    box.appendChild(msg);

    let i = 0;
    let currentText = "";

    let lastTime = 0;
    let delay = 0;

    let cursorVisible = true;

    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 500 + Math.random() * 800);

    function animate(time) {
        if (!lastTime) lastTime = time;

        let delta = time - lastTime;

        if (delta > delay) {
            currentText += text.charAt(i);
            i++;

            let char = text.charAt(i);

            if (char === "." || char === "," || char === "!" || char === "?") {
                delay = 300 + Math.random() * 200; // pause
            } else {
                delay = 30 + Math.random() * 70; // normal typing
            }

            lastTime = time;
        }

        if (Math.floor(time / 500) % 2 === 0) {
            msg.textContent = currentText + "|";
        } else {
            msg.textContent = currentText;
        }

        if (i < text.length) {
            requestAnimationFrame(animate);
        } else {
            msg.textContent = currentText; // remove cursor

            if (cb) {
                setTimeout(cb, 400); // small delay before next message
            }
        }
    }
}

// ---------- START GAME ----------
function startGame() {
    show("game");
    setCharacter("happy");
    characterSay("Let’s play");
    heartLevel(1);
}


// ---------- CLICK EFFECT ----------
function clickEffect(x, y) {
    let el = document.createElement("div");

    el.style.position = "fixed";
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.width = "20px";
    el.style.height = "20px";
    el.style.border = "2px solid hotpink";
    el.style.borderRadius = "50%";
    el.style.pointerEvents = "none";
    el.style.transform = "translate(-50%, -50%) scale(1)";

    document.body.appendChild(el);

    setTimeout(() => {
        el.style.transform = "translate(-50%, -50%) scale(2)";
        el.style.opacity = "0";
    }, 100);

    setTimeout(() => el.remove(), 400);
}


// ---------- LEVEL COMPLETE ----------
function showLevelComplete(level, next) {
    firework(window.innerWidth / 2, window.innerHeight / 2);
    setCharacter("love");
    characterSay("You’re doing amazing ❤️");
    let game = document.getElementById("game");

    game.style.opacity = 0;

    setTimeout(() => {
        game.innerHTML = `
            <h2>Level ${level} Complete</h2>
            <button id="levelNextBtn">continue</button>
        `;
        game.style.opacity = 1;


        document.getElementById("levelNextBtn").onclick = () => {
            next();
        };

    }, 300);
}



// ---------- PHOTO TARGET GAME ----------
function heartLevel(level) {
    let score = 0;

    let target = 4 + level * 2;
    let baseLife = 2500 - level * 400;

    let game = document.getElementById("game");

    function updateUI() {
        let percent = (score / target) * 100;
        let hints = {
            1: "Tap the glowing photos",
            2: "Faster now! Tap quickly",
            3: "Only correct ones count!",
        };
        game.innerHTML = `
        <h2>Game Level ${level}</h2>
        <p class="hint">${hints[level]}</p>

        <div class="progress-container">
            <div class="progress-bar" style="width:${percent}%"></div>
        </div>

        <p>${score} / ${target}</p>
    `;
    }

    updateUI();

    function spawnTarget() {
        let img = document.createElement("img");
        let isCorrect = Math.random() > 0.3;

        if (isCorrect) {
            img.src = photos[Math.floor(Math.random() * photos.length)];
            img.dataset.correct = "true";

            img.style.boxShadow = "0 0 50px gold";

        } else {
            img.src = decoys[Math.floor(Math.random() * decoys.length)];
            img.dataset.correct = "false";
        }

        img.className = "photoTarget";

        let x = Math.random() * 80;
        let y = Math.random() * 80;
        img.style.left = x + "vw";
        img.style.top = y + "vh";
        let size = 1.0;
        let running = true;

        function animate() {
            if (!running) return;
            x += Math.sin(Date.now() / 1000) * 0.3;
            y += Math.cos(Date.now() / 1000) * .3;

            x = Math.max(0, Math.min(90, x));
            y = Math.max(0, Math.min(80, y));

            size -= 0.002;

            img.style.left = x + "vw";
            img.style.top = y + "vh";
            img.style.transform = `scale(${size})`;

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);


        img.addEventListener("pointerdown", (e) => {
            if (!running) return;
            running = false;
            let rect = img.getBoundingClientRect();
            let x = rect.left + rect.width / 2;
            let y = rect.top + rect.height / 2;

            clickEffect(x, y);
            heartBurst(x, y);


            explodeEffect(x, y);

            img.remove();

            if (img.dataset.correct === "true") {
                score += 2;
                setCharacter("happy");
                characterSay("Good job 💖");
            } else {
                score = Math.max(0, score - 1);
                setCharacter("sad");
                characterSay("Oops 😢");
            }

            updateUI();

            if (score >= target) {
                showLevelComplete(level, () => {
                    if (level < 3) {
                        heartLevel(level + 1);
                    } else {
                        memoryGame();
                    }
                });
            } else {
                spawnTarget();
            }
        });

        document.body.appendChild(img);
        setTimeout(() => {
            if (img.parentNode) {
                running = false;
                img.remove();
                spawnTarget();
            }
        }, baseLife);
    }

    spawnTarget();
}

function explodeEffect(x, y) {
    let colors = ["#ff4d6d", "#ff85a1", "#ff99c8", "#ffd6e0", "#ffc300"];

    for (let i = 0; i < 12; i++) {
        let p = document.createElement("div");

        let size = 6 + Math.random() * 10;

        p.style.position = "fixed";
        p.style.left = x + "px";
        p.style.top = y + "px";
        p.style.width = size + "px";
        p.style.height = size + "px";

        let color = colors[Math.floor(Math.random() * colors.length)];
        p.style.background = color;

        p.style.borderRadius = "50%";
        p.style.pointerEvents = "none";


        p.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;

        // smooth animation
        p.style.transition = "transform 0.8s ease-out, opacity 0.5s";

        p.style.zIndex = "9999";

        document.body.appendChild(p);


        let angle = Math.random() * Math.PI * 2;
        let distance = 40 + Math.random() * 60;

        let dx = Math.cos(angle) * distance;
        let dy = Math.sin(angle) * distance;

        setTimeout(() => {
            p.style.transform = `
                translate(${dx}px, ${dy}px)
                scale(${0.3 + Math.random() * 0.3})
            `;
            p.style.opacity = "0";
        }, 10);

        setTimeout(() => p.remove(), 1000);
    }
}

function firework(x, y) {
    let colors = ["hotpink", "red", "yellow", "orange", "white"];

    for (let i = 0; i < 20; i++) {
        let p = document.createElement("div");

        p.style.position = "fixed";
        p.style.left = x + "px";
        p.style.top = y + "px";
        p.style.width = "6px";
        p.style.height = "6px";
        p.style.borderRadius = "50%";
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.pointerEvents = "none";
        p.style.zIndex = "9999";
        p.style.transition = "all 0.6s ease";

        document.body.appendChild(p);

        let dx = (Math.random() * 200 - 100);
        let dy = (Math.random() * 200 - 100);

        setTimeout(() => {
            p.style.transform = `translate(${dx}px, ${dy}px)`;
            p.style.opacity = "0";
        }, 100);

        setTimeout(() => p.remove(), 1000);
    }
}


function heartBurst(x, y) {
    for (let i = 0; i < 8; i++) {
        let p = document.createElement("div");

        p.innerText = "💖";
        p.style.position = "fixed";
        p.style.left = x + "px";
        p.style.top = y + "px";
        p.style.fontSize = "16px";
        p.style.pointerEvents = "none";
        p.style.zIndex = "9999";
        p.style.transition = "all 0.5s ease";

        document.body.appendChild(p);

        let dx = (Math.random() * 80 - 40);
        let dy = (Math.random() * 80 - 40);

        setTimeout(() => {
            p.style.transform = `translate(${dx}px, ${dy}px) scale(0.5)`;
            p.style.opacity = "0";
        }, 30);

        setTimeout(() => p.remove(), 500);
    }
}





function playSound(type) {
    let audio = new Audio();

    if (type === "flip") audio.src = "audio/flip.mp3";
    if (type === "match") audio.src = "audio/match.mp3";
    if (type === "wrong") audio.src = "audio/wrong.mp3";

    audio.volume = 0.1;
    audio.play().catch(() => { });
}



// ---------- MEMORY ----------
function memoryGame() {
    let game = document.getElementById("game");

    let images = [];

    for (let i = 1; i <= 10; i++) {
        let img = `images/${i}.jpg`;
        images.push(img, img);
    }

    images.sort(() => 0.5 - Math.random());

    game.innerHTML = `
        <h2>Memory Game</h2>
        <div id='grid'></div>
    `;

    let grid = document.getElementById("grid");

    let first = null;
    let lock = false;
    let match = 0;

    images.forEach(val => {
        let card = document.createElement("div");
        card.className = "card";
        card.dataset.value = val;

        card.innerHTML = `
        <div class="inner">
            <div class="front">A</div>
            <div class="back">
                <img src="${val}">
            </div>
        </div>
    `;

        card.onclick = () => {
            if (lock || card.classList.contains("open")) return;

            card.classList.add("open");

            playSound("flip");
            vibrate("flip");

            if (!first) {
                first = card;
            } else {
                lock = true;

                if (first.dataset.value === card.dataset.value) {
                    playSound("match");
                    vibrate("match");

                    let r1 = first.getBoundingClientRect();
                    let r2 = card.getBoundingClientRect();

                    let x1 = r1.left + r1.width / 2;
                    let y1 = r1.top + r1.height / 2;

                    let x2 = r2.left + r2.width / 2;
                    let y2 = r2.top + r2.height / 2;

                    explodeEffect(x1, y1);
                    explodeEffect(x2, y2);

                    card.classList.add("match");
                    first.classList.add("match");

                    first = null;
                    lock = false;
                    match++;

                    if (match === images.length / 2) {
                        setTimeout(() => showLevelComplete("Memory", boss), 600);
                    }

                } else {
                    playSound("wrong");
                    vibrate("wrong");

                    card.classList.remove("shake");
                    first.classList.remove("shake");

                    void card.offsetWidth;
                    void first.offsetWidth;

                    card.classList.add("shake");
                    first.classList.add("shake");

                    setTimeout(() => {
                        card.classList.remove("open", "shake");
                        first.classList.remove("open", "shake");

                        first = null;
                        lock = false;
                    }, 800);
                }
            }
        };

        grid.appendChild(card);
    });
}


function vibrate(type) {
    if (!navigator.vibrate) return;

    if (type === "flip") {
        navigator.vibrate(20);
    }

    if (type === "match") {
        navigator.vibrate([30, 20, 30]);
    }

    if (type === "wrong") {
        navigator.vibrate([100, 50, 100]);
    }
}

// ---------- BOSS ----------
function boss() {
    let score = 0;
    let time = 5;
    let targetScore = 5;
    let game = document.getElementById("game");

    function updateUI() {
        let percent = (score / targetScore) * 100;

        game.innerHTML = `  
    <h2>Final Game</h2>  
    <p class="hint">Tap the character ${targetScore} times within the time</p>

    <div class="progress-container">  
        <div class="progress-bar" style="width:${percent}%"></div>  
    </div>  

    <p>${time}s left</p>  
`;
    }

    updateUI();

    let t = document.createElement("img");

    t.src = "images/char_love.gif";
    t.style.position = "fixed";
    t.style.width = "70px";
    t.style.cursor = "pointer";
    t.style.zIndex = "1000";
    t.style.transition = "transform 0.15s ease";

    let x = Math.random() * 80;
    let y = Math.random() * 70;

    function move() {
        x = Math.random() * 80;
        y = Math.random() * 70;

        t.style.left = x + "vw";
        t.style.top = y + "vh";
    }

    move();

    t.onclick = (e) => {
        clickEffect(e.clientX, e.clientY);

        score++;
        updateUI();
        move();

        if (score >= targetScore) {
            clearInterval(timer);
            t.remove();

            showLevelComplete("Final", showGallery);
        }
    };

    document.body.appendChild(t);

    let timer = setInterval(() => {
        time--;
        updateUI();

        if (time <= 0) {
            clearInterval(timer);
            t.remove();

            game.innerHTML = `  
            <h2>Try Again</h2>  
            <button onclick="boss()">Retry</button>  
        `;
        }

    }, 1000);

}


// ---------- GALLERY ----------
function showGallery() {
    show("gallery");
    fadeOut(music, 500).then(() => {
        fadeIn(galleryMusic, 1590);
    });
    let container = document.getElementById("photoGrid");
    container.innerHTML = "";

    let cols = 3;
    let rows = 3;

    let cellWidth = 100 / cols;
    let cellHeight = 80 / rows;

    let positions = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            positions.push({
                x: c * cellWidth,
                y: r * cellHeight
            });
        }
    }


    positions.sort(() => Math.random() - 0.5);

    photos.forEach((src, index) => {
        if (index >= positions.length) return;

        let pos = positions[index];

        let card = document.createElement("div");
        card.className = "photoCard";

        let img = document.createElement("img");
        img.src = src;

        card.appendChild(img);
        container.appendChild(card);


        card.style.left = (pos.x + 15) + "%";
        card.style.top = (pos.y + 15) + "%";

        setTimeout(() => {
            card.classList.add("show");
        }, index * 600);
    })


    let btn = document.getElementById("finalBtn");
    let timerEl = document.getElementById("galleryTimer");

    btn.style.display = "none";
    timerEl.style.visibility = "hidden";

    setTimeout(() => {

        timerEl.style.visibility = "visible";

        let time = 3;

        let countdown = setInterval(() => {
            timerEl.innerText = time;
            time--;

            if (time < 0) {
                clearInterval(countdown);

                let texts = ["Wait...", "Not yet...", "Almost...", "Now!"];
                let i = 0;

                function nextText() {
                    if (i < texts.length) {

                        timerEl.style.opacity = 0;

                        setTimeout(() => {
                            timerEl.innerText = texts[i];
                            timerEl.style.opacity = 1;

                            i++;
                            setTimeout(nextText, 900);

                        }, 300);

                    } else {
                        timerEl.style.visibility = "hidden";
                        btn.style.display = "block";
                    }
                }

                nextText();
            }

        }, 1000);

    }, photos.length * 600 + 300);

    btn.onclick = () => {
        finalMusic.currentTime = 0;
        finalMusic.volume = 0;
        fadeIn(finalMusic);

        showDateReveal();
    };


    setTimeout(() => {
        container.appendChild(btn);
    }, photos.length * 300 + 500);

}


let dreamyParticles = [];
let dreamyRunning = false;

const dreamyEmojis = ["🌸", "🌺", "🌷", "✨", "💮"];

function startDreamyBackground() {
    dreamyRunning = true;

    function createParticle() {
        if (!dreamyRunning) return;

        let el = document.createElement("div");

        el.innerText = dreamyEmojis[Math.floor(Math.random() * dreamyEmojis.length)];

        let x = Math.random() * 100;
        let size = 10 + Math.random() * 10;
        let speed = 0.1 + Math.random() * 0.5;
        let drift = (Math.random() * 0.4 - 0.2);

        el.style.position = "fixed";
        el.style.left = x + "vw";
        el.style.top = "-5vh";
        el.style.fontSize = size + "px";
        el.style.opacity = 0.75;
        el.style.pointerEvents = "none";

        el.style.textShadow = `
            0 0 6px #ffb6c1,
            0 0 12px #ff69b4,
            0 0 20px #fff
        `;

        document.body.appendChild(el);

        dreamyParticles.push({
            el,
            x,
            y: -5,
            speed,
            drift,
            rotate: Math.random() * 360
        });
    }


    let spawn = setInterval(() => {
        if (!dreamyRunning) {
            clearInterval(spawn);
            return;
        }
        createParticle();
    }, 800);


    function animate() {
        if (!dreamyRunning) return;

        dreamyParticles.forEach((p, i) => {
            p.y += p.speed;
            p.x += p.drift;
            p.rotate += 0.5;

            p.el.style.top = p.y + "vh";
            p.el.style.left = p.x + "vw";
            p.el.style.transform = `rotate(${p.rotate}deg)`;

            if (p.y > 105) {
                p.el.remove();
                dreamyParticles.splice(i, 1);
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
}

function funnyIntro(next) {
    let final = document.getElementById("final");

    final.innerHTML = `
        <h2>Arre ruko ruko...</h2>
        <p>Tum Arohi hi ho ??</p>
        <button id="yesBtn">Haan 😇</button>
        <button id="noBtn">Bhad me jao 😈</button>
    `;

    document.getElementById("yesBtn").onclick = () => {
        funnyStage2(next);
    };

    document.getElementById("noBtn").onclick = () => {
        final.innerHTML = `
        <h2>Fir tumare liye nhi hai 😐</h2>
        <p>Only Arohi allowed</p>
        <button id="retryBtn">Wese dubara try kr skte ho</button>
    `;

        document.getElementById("retryBtn").onclick = () => {
            funnyIntro(next);
        };
    };
}
function funnyStage2(next) {
    let final = document.getElementById("final");

    final.innerHTML = `
        <h2>Then prove kro 😂</h2>
        <p>Bandariya wale character hai ?</p>
        <button id="cuteYes">Haan hai 🙈</button>
        <button id="cuteNo">Shayad 😶</button>
    `;

    document.getElementById("cuteYes").onclick = () => {
        funnyStage3(next);
    };

    document.getElementById("cuteNo").onclick = () => {
        final.innerHTML = `
            <h2>Shayad wayad kuch nhi confirm kro 😂</h2>
            <p>Chlo chlo confirm kro</p>
            <button id="retryBtn">Haan kr rhi 🙃</button>
        `;

        document.getElementById("retryBtn").onclick = () => {
            funnyStage2(next);
        };
    };
}

function funnyStage3(next) {
    let final = document.getElementById("final");

    final.innerHTML = `
        <h2>Achha majak nhi ab</h2>
        <p>Do you deserve this surprise? 🎁</p>
        <button id="deserveYes">Obviously 😌</button>
        <button id="deserveNo">Maybe 🤨</button>
    `;

    document.getElementById("deserveYes").onclick = () => {
        next()
    };

    document.getElementById("deserveNo").onclick = () => {
        final.innerHTML = `
            <h2>Ohh khud pr believe krne wali ladki</h2>
            <p>Mujhe lgta hai glti se select ho gaya hoga</p>
            <button id="retryBtn">Dubara try kro 🙈</button>
        `;

        document.getElementById("retryBtn").onclick = () => {
            funnyStage3(next);
        };
    };
}

function showDateReveal() {
    fadeOut(music, 500);
    fadeOut(galleryMusic, 500);
    fadeOut(finalMusic, 500);
    fadeOut(birthdayExtra, 500);
    show("dateReveal");

    let canvas = document.getElementById("cinemaCanvas");
    let ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let cx = canvas.width / 2;
    let cy = canvas.height / 2;

    let progress = 0;
    let phase = 0;

    let beat = 1;
    setInterval(() => {
        beat = beat === 1 ? 1.08 : 1;
    }, 600);

    let smoke = [];
    let sparks = [];

    function spawnSmoke() {
        smoke.push({
            x: Math.random() * canvas.width,
            y: canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: -Math.random() * 1.2,
            life: 1
        });
    }

    function drawSmoke() {
        smoke.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.005;

            ctx.fillStyle = `rgba(255,255,255,${p.life * 0.05})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
            ctx.fill();
        });

        smoke = smoke.filter(p => p.life > 0);
    }

    function spawnSparks() {
        for (let i = 0; i < 3; i++) {
            sparks.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (cx - Math.random() * canvas.width) * 0.002,
                vy: (cy - Math.random() * canvas.height) * 0.002,
                life: 1
            });
        }
    }

    function drawSparks() {
        sparks.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.01;

            ctx.fillStyle = `rgba(255,105,180,${p.life})`;
            ctx.fillRect(p.x, p.y, 2, 2);
        });

        sparks = sparks.filter(p => p.life > 0);
    }

    function drawText() {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(beat, beat);

        ctx.textAlign = "center";

        let alpha = Math.min(1, progress);

        ctx.globalAlpha = alpha;

        ctx.font = "bold 90px Arial";

        ctx.fillStyle = "white";
        ctx.fillText("28", 0, 0);

        ctx.strokeStyle = "hotpink";
        ctx.lineWidth = 3;
        ctx.strokeText("28", 0, 0);

        ctx.globalAlpha = 1;

        if (progress > 2) {
            let marchAlpha = Math.min(1, progress - 2);

            ctx.globalAlpha = marchAlpha;

            ctx.font = "bold 40px Arial";
            ctx.fillStyle = "white";
            ctx.fillText("MARCH", 0, 70);

            ctx.globalAlpha = 1;
        }

        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        spawnSmoke();
        spawnSparks();

        drawSmoke();
        drawSparks();
        drawText();

        progress += 0.01;

        if (progress > 2 && phase === 0) {
            phase = 1;

            firework(cx, cy);
        }

        if (progress > 4) {
            document.getElementById("dateHint").style.opacity = 1;
        }

        requestAnimationFrame(animate);
    }

    animate();

    canvas.onclick = () => {
        showFinal();
    };
}




// ---------- FINAL ----------
function showFinal() {
    show("final");

    if (music) {
        music.pause();
        music.currentTime = 0;
    }

    if (galleryMusic) {
        galleryMusic.pause();
        galleryMusic.currentTime = 0;
    }

    funnyIntro(() => {
        if (birthdayExtra) {
            birthdayExtra.currentTime = 0;
            birthdayExtra.volume = 1;

            let p = birthdayExtra.play();

            if (p !== undefined) {
                p.then(() => {
                    fadeIn(birthdayExtra, 1200);
                }).catch(err => {
                    console.log("Audio blocked:", err);
                });
            }
        }
        
        fadeOut(finalMusic, 800).then(() => {
            birthdayExtra.play();
        });
        document.getElementById("final").innerHTML = `
<div class="finalContent">

    <h2 class="mainText">Happy Birthday</h2>
    <h1 id="magicText">${input}</h1>

    <div class="cakeScene">

        <img src="images/cake.png" class="cake half left" id="cakeLeft">

        <img src="images/cake.png" class="cake half right" id="cakeRight">

        <div class="knife" id="knife"></div>

    </div>

    <button id="cutBtn">Cut the Cake</button>

</div>
`;

        let btn = document.getElementById("cutBtn");
        let knife = document.getElementById("knife");
        let left = document.getElementById("cakeLeft");
        let right = document.getElementById("cakeRight");

        btn.onclick = () => {

            knife.style.opacity = 1;
            knife.style.left = "80px";
            knife.style.top = "30px";
            knife.style.transition = "0.4s ease";
            setTimeout(() => {
                showEmotionalScreen();
            }, 5000);
            
            setTimeout(() => {

                left.style.transform = "translateX(-40px) rotate(-10deg)";
                right.style.transform = "translateX(40px) rotate(10deg)";

                explodeEffect(window.innerWidth / 2, window.innerHeight / 2);
                heartBurst(window.innerWidth / 2, window.innerHeight / 2);

            }, 500);


            setTimeout(() => {
                knife.style.opacity = 0;
                characterSay("Happy Birthday ❤️");
            }, 2000);
        };


        function showEmotionalScreen() {

            show("emotionalScreen");

            let messages = [
                "Wait...",
                "I want to say something...",
                "You are not just special...",
                "You are the reason behind so many smiles 💖",
                "And honestly...",
                "You mean more than you think ❤️",
                " ",
                " ",
                " ",
                "Again....",
                "HAPPY BIRTHDAY",
                "Stay safe stay happy"
            ];

            playStackMessages(messages, 0);
        }


        function playStackMessages(messages, index) {

            if (index >= messages.length) return;

            let box = document.getElementById("emotionalText");

            let line = document.createElement("div");
            line.className = "msgLine";
            line.innerText = messages[index];

            box.appendChild(line);

            // animate in
            setTimeout(() => {
                line.classList.add("show");

                box.scrollTop = box.scrollHeight;

            }, 700);

            setTimeout(() => {
                playStackMessages(messages, index + 1);
            }, 1800);
        }


        function startHearts() {

            setInterval(() => {

                let h = document.createElement("div");

                h.innerText = "💖";

                h.style.position = "fixed";
                h.style.left = Math.random() * 100 + "vw";
                h.style.top = "100vh";
                h.style.fontSize = (12 + Math.random() * 10) + "px";
                h.style.opacity = 0.8;
                h.style.pointerEvents = "none";

                h.style.transition = "transform 4s linear, opacity 4s";

                document.body.appendChild(h);

                setTimeout(() => {
                    h.style.transform = `translateY(-120vh)`;
                    h.style.opacity = "0";
                }, 50);

                setTimeout(() => h.remove(), 4000);

            }, 300);
        }

        function startFinalCinematic() {

            document.getElementById("emotionalScreen").style.opacity = 0;

            setTimeout(() => {

                let cine = document.getElementById("finalCinematic");
                let line = document.getElementById("finalLine");

                cine.style.opacity = 1;
                cine.style.pointerEvents = "auto";

                let text = `Happy Birthday ${input} ❤️`;

                typeFinal(line, text);

                if (birthdayExtra) {
                    birthdayExtra.volume = 0.3;
                    birthdayExtra.play().catch(() => { });
                }

            }, 1200);
        }
        function typeFinal(el, text) {

            let i = 0;

            function type() {

                if (i < text.length) {

                    el.innerText += text[i];

                    el.style.transform = "scale(1.1)";

                    setTimeout(() => {
                        el.style.transform = "scale(1)";
                    }, 150);

                    i++;
                    setTimeout(type, 80);

                } else {

                    setInterval(() => {
                        el.style.textShadow =
                            "0 0 20px hotpink, 0 0 40px deeppink";

                        setTimeout(() => {
                            el.style.textShadow =
                                "0 0 10px hotpink, 0 0 20px pink";
                        }, 500);

                    }, 1000);
                }
            }

            type();
        }


    })
}


function startTextParticles() {
    let el = document.getElementById("magicText");
    if (!el) return;

    let rect = el.getBoundingClientRect();

    setInterval(() => {
        let p = document.createElement("div");

        let emojis = ["💖", "✨", "💕", "💫"];
        p.innerText = emojis[Math.floor(Math.random() * emojis.length)];

        p.className = "particle";


        let x = rect.left + Math.random() * rect.width;
        let y = rect.top + Math.random() * rect.height;

        p.style.left = x + "px";
        p.style.top = y + "px";

        document.body.appendChild(p);

        let dx = (Math.random() * 60 - 30);
        let dy = - (Math.random() * 80 + 20);

        setTimeout(() => {
            p.style.transform = `translate(${dx}px, ${dy}px) scale(0.5)`;
            p.style.opacity = "0";
        }, 30);

        setTimeout(() => p.remove(), 1000);

    }, 150);
}

function glowClick(el) {
    el.style.textShadow = "0 0 30px hotpink";
    setTimeout(() => {
        el.style.textShadow = "";
    }, 300);
}

function setCharacter(mood) {
    let char = document.getElementById("char");

    if (mood === "idle") char.src = "images/char_idle.gif";
    if (mood === "happy") char.src = "images/char_happy.gif";
    if (mood === "sad") char.src = "images/char_sad.gif";
    if (mood === "love") char.src = "images/char_love.gif";

    char.style.transform = "scale(1.1)";
    setTimeout(() => char.style.transform = "scale(1)", 200);
}



function characterSay(text) {
    let bubble = document.getElementById("charBubble");

    bubble.innerText = text;
    bubble.style.display = "block";

    setTimeout(() => {
        bubble.style.display = "none";
    }, 2500);
}

function characterSpeak(text, callback) {
    let speech = document.getElementById("speech");
    speech.innerText = "";

    let i = 0;

    function type() {
        if (i < text.length) {
            speech.innerText += text[i];
            i++;
            setTimeout(type, 40);
        } else if (callback) {
            setTimeout(callback, 800);
        }
    }

    type();
}

function fadeOut(audio, duration = 2000) {
    if (!audio) return Promise.resolve();

    return new Promise(resolve => {
        let interval = 50;
        let steps = duration / interval;
        let step = audio.volume / steps;

        let fade = setInterval(() => {
            audio.volume = Math.max(0, audio.volume - step);

            if (audio.volume <= 0.01) {
                audio.volume = 0;
                audio.pause();
                clearInterval(fade);
                resolve();
            }
        }, interval);
    });
}

function fadeIn(audio, duration = 2000) {
    if (!audio) return;

    audio.volume = 0;
    audio.play().catch(() => { });

    let interval = 50;
    let steps = duration / interval;
    let step = 1 / steps;

    let fade = setInterval(() => {
        audio.volume = Math.min(1, audio.volume + step);

        if (audio.volume >= 0.99) {
            audio.volume = 1;
            clearInterval(fade);
        }
    }, interval);
}


let currentMusic = null;

function switchTrack(nextAudio, duration = 800) {
    if (currentMusic === nextAudio) return;

    let out = currentMusic ? fadeOut(currentMusic, duration) : Promise.resolve();

    out.then(() => {
        currentMusic = nextAudio;

        if (nextAudio) {
            nextAudio.currentTime = 0;
            fadeIn(nextAudio, duration);
        }
    });
}

