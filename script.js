onload = () => {
 let decline = document.querySelector("#decline")
 let accept = document.querySelector("#accept")
 let next = document.querySelector(".next")
 let next2 = document.querySelector(".next2")
 let pfinal = document.querySelector(".pfinal")
 let final = document.querySelector(".final")
 let main = document.querySelector(".main")
 let yup = document.querySelector("#yup")
 let go = document.querySelector("#pfinal")
 let nope = document.querySelector("#nope")
const acc = new Audio("/audio/jaan.mp3")
const dec = new Audio("/audio/dec.mp3")
const sec = new Audio("/audio/sec.mp3")
const jaan = new Audio("/audio/acc.mp3")
dec.volume = 0.5
dec.playbackRate = 2


const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let url="/audio/dil.mp3";
    let source=audioCtx.createBufferSource();

fetch(url)
.then(response=>response.arrayBuffer())
.then(arrayBuffer=>audioCtx.decodeAudioData(arrayBuffer))
.then(audioBuffer=>{
    source.buffer=audioBuffer;
    source.connect(audioCtx.destination);
    source.start();

})



accept.onclick = () =>{
  acc.play()
 final.style.display = "flex"
 main.style.display = "none"
 source.stop()
}

decline.onclick = () =>{
  dec.play()
 acc.pause() 
 sec.play()
 source.stop()
 main.style.display = "none"
 next.style.display = "flex"
}

yup.onclick = () => {
 next.style.display = "none"
 pfinal.style.display = "flex"
 sec.pause()
 jaan.play()
}

nope.onHover = () => {
 randomBtn()
}
nope.onclick = () => {
 randomBtn()
 dec.play()
}
go.onclick = () => {
 final.style.display = "flex"
 pfinal.style.display = "none"
 acc.play()
 sec.pause()
 jaan.pause()
}
let randomBtn = () => {
 const x = Math.random() * (window.innerWidth - nope.offsetWidth);
 const y = Math.random() * (window.innerHeight - nope.offsetHeight);
 nope.style.left = `${x}px`;
 nope.style.top = `${y}px`;
}


let createSnowflakes = num => {
   for (let i = 1; i <= num; i++) {
   const snowflake = document.createElement('div');
   snowflake.classList.add('snow');
   let rm = (Math.random() * 5 + 5)
   snowflake.style.left = Math.random() * 100 + '%';
   snowflake.style.animationDuration = (Math.random() * 3 + 5) + 's';
   snowflake.style.animationDelay = Math.random() * 10 + 's';
   snowflake.style.height = rm+ "px"
   snowflake.style.width = rm+ "px"
   final.appendChild(snowflake);
            }
        }
   createSnowflakes(20);

var fireworks = [];
var showArray = [];
var ctx, c;
var typeArray = ['ring','ball','rainbowRing','rainbowBall', 'twoColorRing', 'threeColorRing', 'twoColorBall', 'threeColorBall', 'trippleRing', 'doubleRing', 'streamerRing', 'streamerBall'];
var type = 'random';
var size = 'med';
var auto = true;
var show = false;
var timeShow = 0;
var autoTime = {time:0, nextTime:0};
var timeDif;
var timeLast;
var EXPLOSION0 = "";
var EXPLOSION1 = "";
var EXPLOSION2 = "";
var EXPLOSION3 = "";
var exp = [EXPLOSION0, EXPLOSION1, EXPLOSION2, EXPLOSION3];
var volumeInput = 0.5;
var timeAdjustment = 1000;
  
  c = document.querySelector("canvas");
  ctx = c.getContext('2d');
  c.width = window.innerWidth;
  c.height = window.innerHeight - 60;
  window.addEventListener('resize', function () {
    c.width = window.innerWidth;
    c.height = window.innerHeight - 60;
  }, false);
  buildFireworkShow();
  
  window.requestAnimationFrame(draw);

function buildFireworkShow(){
    var x;
    var time;
    var xPos;
    var yPos;
    var showType;
    var launched;
    var firework;
    for( x = 0; x < 5; x++){
        time = x + 1.5;
        xPos = (x + 1)/6;
        yPos = 1-(x + 1)/6;
        showType = typeArray[x];
        launched = 0;
        firework = {time:time,xPos:xPos,yPos:yPos,type:showType,launched:launched};
        showArray.push(firework);
    }
    for( x = 0; x < 5; x++){
        time = x + 2;
        xPos = 1-(x + 1)/6;
        yPos = 1-(x + 1)/6;
        showType = typeArray[x];
        launched = 0;
        firework = {time:time,xPos:xPos,yPos:yPos,type:showType,launched:launched};
        showArray.push(firework);
    }
}

function timeAdjust(newTimeAdjustment){
    timeAdjustment = newTimeAdjustment;
}

function draw(timeCurrent) {

  if(!timeLast){
      timeLast=timeCurrent;
  }
  timeDif = timeCurrent - timeLast;
  timeLast = timeCurrent;
  timeDif /= timeAdjustment;

  if(auto){autoFireworks(timeDif);}
  if(show){playFireworkShow(timeDif);}

  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = "transparent";
//  ctx.fillStyle = 'hsla(0,0%,0%, '+ 8 * timeDif+')';
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.globalCompositeOperation = 'source-over';

  fireworks.forEach(function (firework) {

    if (firework.lifeTime < firework.time) {
      fireworks.splice(firework, 1);
    }else{

        var twinkle;
        var emberXPos;
        var emberYPos;
        var grd;

        if(firework.time > 1 && !firework.soundPlayed){
            //playSound(firework.sound);
            firework.soundPlayed = 1;
        }
        if(firework.time < 0){
            twinkle = Math.random();
            emberXPos = firework.xPosStart - firework.time *(c.width / 2 - firework.xPosStart);
            emberYPos = firework.yPosStart + (Math.pow(-firework.time,2))*(c.height - firework.yPosStart);
            grd = ctx.createRadialGradient(emberXPos, emberYPos, 0, emberXPos, emberYPos, twinkle * 15);
            grd.addColorStop(0,  'hsla(45,100%,30%,0.65)');
            grd.addColorStop(0.2,  'hsla(45,100%,10%,0.5)');
            grd.addColorStop(0.4,  'hsla(45,100%,5%,0.2)');
            grd.addColorStop(1,  'hsla(0,0%,0%,0)');
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(emberXPos,
                emberYPos,
                twinkle* 15,
                0,
                Math.PI * 2);
            ctx.fill();
        }else{
            firework.embers.forEach(function (ember){
                twinkle = Math.random();
                emberXPos = (Math.sin(ember.angle - ember.phaseAngle)*(ember.distance *(1-ember.aspectFactor)) - Math.cos(ember.angle + ember.phaseAngle)*(ember.distance *(ember.aspectFactor)))*(firework.time/firework.lifeTime) * 1.6 + firework.xPosStart;
                emberYPos = -(Math.cos(ember.angle + ember.phaseAngle)*(ember.distance *(ember.aspectFactor)) + Math.sin(ember.angle - ember.phaseAngle)*(ember.distance *(1-ember.aspectFactor)))*(firework.time/firework.lifeTime) * 1.6 + firework.yPosStart + Math.pow(firework.time*2,3.5);
                grd = ctx.createRadialGradient(emberXPos, emberYPos, 0, emberXPos, emberYPos, twinkle * ember.emberSize);
                grd.addColorStop(0,  'hsla('+ember.color+','+ember.saturation+'%,80%,'+(firework.lifeTime - firework.time)/firework.lifeTime * 2+')');
                grd.addColorStop(0.1,  'hsla('+ember.color+','+ember.saturation+'%,50%,'+(firework.lifeTime - firework.time)/firework.lifeTime * 1+')');
                grd.addColorStop(0.2,  'hsla('+ember.color+','+ember.saturation+'%,50%,'+(firework.lifeTime - firework.time)/ firework.lifeTime * 0.3+')');
                grd.addColorStop(1,  'hsla(0,0%,0%,0)');
                ctx.fillStyle = grd;
                ctx.beginPath();
                ctx.arc(emberXPos,
                    emberYPos,
                    twinkle* ember.emberSize,
                    0,
                    Math.PI * 2);
                ctx.fill();
            });
        }

        firework.time += timeDif;
    }
  });
  window.requestAnimationFrame(draw);
}
function playFireworkShow(timeDif){
    timeShow += timeDif;
    showArray.forEach(function (firework){
        if(timeShow < 0.05){
            firework.launched = 0;
        }
        if((firework.time - timeShow) < -1 && !firework.launched){
            startFirework(firework.xPos,firework.yPos,firework.type);
            firework.launched = 1;
        }
    });
}
function manualFireworkStart(event){
    if(manual){
        var x = event.clientX / c.width;
        var y = event.clientY / c.height;
        startFirework(x,y); 
    }
}

function startFirework(x,y,style){
    if(style){type = style}
    x *= c.width;
    y *= c.height;
    var sound = exp[Math.floor(Math.random() * exp.length)];
    var soundPlayed = 0;
    var time = -1;
    var lifeTime = 1.5;
    var embers = makeEmbers();
    var firework ={xPosStart:x,yPosStart:y,embers:embers,lifeTime:lifeTime,time:time,sound:sound,soundPlayed:soundPlayed};
    fireworks.push(firework);
}

function fireworkType(select){
    if(select === null){
        return type;
    }else{
        type = select;
    }
}

function fireworkSize(select){
    if(select === null){
        return size;
    }else{
        size = select;
    }
}

function makeEmbers(){
    var embers =[];
    var totalEmbers;
    var phaseShift;
    var distance;
    var ember;
    var angle;
    var color;
    var color1;
    var color2;
    var color3;
    var phaseAngle;
    var aspectFactor;
    var typeHold;
    var emberSize = Math.random() * 30 + 10;
    var saturation = 100;

    switch(type){
    case 'streamerRing':
        phaseAngle = Math.PI * 2 * (Math.random() - 0.5);
        aspectFactor = 0.5 - 3.9*(Math.pow(Math.random() - 0.5,3));
        totalEmbers = 20;
        phaseShift = Math.random() * Math.PI;
        for(var streamerTales = 1; streamerTales < 2000; streamerTales *= 5){
            distance = 150 / Math.pow(streamerTales,0.2);
            emberSize = 5 +50 / streamerTales;
            if(streamerTales == 1){
                color = Math.random() * 360;
            }else{
                color = 35;
            }
            for(ember = (streamerTales - 1)* totalEmbers; ember < totalEmbers * streamerTales; ember++){
                if(streamerTales == 1){
                    angle = phaseShift + 2 * Math.PI * ember / totalEmbers;
                }else{
                    angle = embers[ember % totalEmbers].angle
                    saturation = 70;
                }
                embers[ember] = {angle:angle, phaseShift:phaseShift, distance:distance, color:color, phaseAngle:phaseAngle, aspectFactor:aspectFactor, emberSize:emberSize, saturation:saturation};
            }
        }
        break;
    case 'ring':
        phaseAngle = Math.PI * 2 * (Math.random() - 0.5);
        aspectFactor = 0.5 - 3.9*(Math.pow(Math.random() - 0.5,3));
        totalEmbers = 20;
        distance = 100;
        color = Math.random() * 360;
        phaseShift = Math.random() * Math.PI;
        for(ember = 0; ember < totalEmbers; ember++){
            angle = phaseShift + 2 * Math.PI * ember / totalEmbers;
            embers[ember] = {angle:angle, phaseShift:phaseShift, distance:distance, color:color, phaseAngle:phaseAngle, aspectFactor:aspectFactor, emberSize:emberSize, saturation:saturation};
        }
        break;
    case 'twoColorRing':
        phaseAngle = Math.PI * 2 * (Math.random() - 0.5);
        aspectFactor = 0.5 - 3.9*(Math.pow(Math.random() - 0.5,3));
        totalEmbers = 20;
        distance = 100;
        color1 = Math.random() * 360;
        color2 = Math.random() * 360;
        phaseShift = Math.random() * Math.PI;
        for(ember = 0; ember < totalEmbers; ember++){
            color = ember % 2;
            if(color == 0){
                color = color1;
            }else{
                color = color2;
            }
            angle = phaseShift + 2 * Math.PI * ember / totalEmbers;
            embers[ember] = {angle:angle, phaseShift:phaseShift, distance:distance, color:color, phaseAngle:phaseAngle, aspectFactor:aspectFactor, emberSize:emberSize, saturation:saturation};
        }
        break;
    case 'threeColorRing':
        phaseAngle = Math.PI * 2 * (Math.random() - 0.5);
        aspectFactor = 0.5 - 3.9*(Math.pow(Math.random() - 0.5,3));
        totalEmbers = 20;
        distance = 100;
        color1 = Math.random() * 360;
        color2 = Math.random() * 360;
        color3 = Math.random() * 360;
        phaseShift = Math.random() * Math.PI;
        for(ember = 0; ember < totalEmbers; ember++){
            color = ember % 3;
            if(color == 0){
                color = color1;
            }else if(color == 1){
                color = color2;
            }else{
                color = color3;
            }
            angle = phaseShift + 2 * Math.PI * ember / totalEmbers;
            embers[ember] = {angle:angle, phaseShift:phaseShift, distance:distance, color:color, phaseAngle:phaseAngle, aspectFactor:aspectFactor, emberSize:emberSize, saturation:saturation};
        }
        break;
    case 'rainbowRing':
        phaseAngle = Math.PI * 2 * (Math.random() - 0.5);
        aspectFactor = 0.5 - 3.9*(Math.pow(Math.random() - 0.5,3));
        totalEmbers = 20;
        distance = 100;
        phaseShift = Math.random() * Math.PI * 2;
        for(ember = 0; ember < totalEmbers; ember++){
            color = ember * 360 / totalEmbers;
            angle = phaseShift + 2 * Math.PI * ember / totalEmbers;
            embers[ember] = {angle:angle, phaseShift:phaseShift, distance:distance, color:color, phaseAngle:phaseAngle, aspectFactor:aspectFactor, emberSize:emberSize, saturation:saturation};
        }
        break;

    case'doubleRing':
        typeHold = type;
        type = 'ring';
        embers = makeEmbers();
        embers.push.apply(embers, makeEmbers());
        type = typeHold;
        break;
    case'trippleRing':
        typeHold = type;
        type = 'ring';
        embers = makeEmbers();
        embers.push.apply(embers, makeEmbers());
        embers.push.apply(embers, makeEmbers());
        type = typeHold;
        break;
    case 'streamerBall':
        phaseAngle = 0;
        aspectFactor = 0.5;
        totalEmbers = 50;
        color = Math.random() * 360;
        for(ember = 0; ember < totalEmbers; ember++){
            emberSize = 50;
            distance = Math.random() * 200;
            phaseShift = Math.random() * Math.PI / 4;
            angle = phaseShift + 2 * Math.PI * ember / totalEmbers;
            embers[ember] = {angle:angle, phaseShift:phaseShift, distance:distance, color:color, phaseAngle:phaseAngle, aspectFactor:aspectFactor, emberSize:emberSize, saturation:saturation};
        }
        for(var streamerTales = 2; streamerTales < 150; streamerTales *=9){
            
            emberSize = 10+ 50 / streamerTales;
            color = 35;
            saturation = 70;
            for(ember = (streamerTales - 1)* totalEmbers; ember < totalEmbers * streamerTales; ember++){
                distance = embers[ember % totalEmbers].distance / Math.pow(streamerTales,0.2);
                angle = embers[ember % totalEmbers].angle;
                embers[ember] = {angle:angle, phaseShift:phaseShift, distance:distance, color:color, phaseAngle:phaseAngle, aspectFactor:aspectFactor, emberSize:emberSize, saturation:saturation};
            }
        }
        break;

    case'ball':
        phaseAngle = 0;
        aspectFactor = 0.5;
        color = Math.random() * 360;
        totalEmbers = 100;
        for(ember = 0; ember < totalEmbers; ember++){
            distance = Math.random() * 200;
            phaseShift = Math.random() * Math.PI / 4;
            angle = phaseShift + 2 * Math.PI * ember / totalEmbers;
            embers[ember] = {angle:angle, phaseShift:phaseShift, distance:distance, color:color, phaseAngle:phaseAngle, aspectFactor:aspectFactor, emberSize:emberSize, saturation:saturation};
        }
        break;
    case 'twoColorBall':
        phaseAngle = 0;
        aspectFactor = 0.5;
        color1 = Math.random() * 360;
        color2 = Math.random() * 360;
        totalEmbers = 100;
        for(ember = 0; ember < totalEmbers; ember++){
            color = ember % 3;
            if(color == 0){
                color = color1;
            }else{
                color = color2;
            }
            distance = Math.random() * 200;
            phaseShift = Math.random() * Math.PI / 4;
            angle = phaseShift + 2 * Math.PI * ember / totalEmbers;
            embers[ember] = {angle:angle, phaseShift:phaseShift, distance:distance, color:color, phaseAngle:phaseAngle, aspectFactor:aspectFactor, emberSize:emberSize, saturation:saturation};
        }
        break;
    case 'threeColorBall':
        phaseAngle = 0;
        aspectFactor = 0.5;
        color1 = Math.random() * 360;
        color2 = Math.random() * 360;
        color3 = Math.random() * 360;
        totalEmbers = 100;
        for(ember = 0; ember < totalEmbers; ember++){
            color = ember % 3;
            if(color == 0){
                color = color1;
            }else if(color == 1){
                color = color2;
            }else{
                color = color3;
            }
            distance = Math.random() * 200;
            phaseShift = Math.random() * Math.PI / 4;
            angle = phaseShift + 2 * Math.PI * ember / totalEmbers;
            embers[ember] = {angle:angle, phaseShift:phaseShift, distance:distance, color:color, phaseAngle:phaseAngle, aspectFactor:aspectFactor, emberSize:emberSize, saturation:saturation};
        }
        break;
    case 'rainbowBall':
        phaseAngle = 0;
        aspectFactor = 0.5;
        totalEmbers = 100;
        for(ember = 0; ember < totalEmbers; ember++){
            distance = Math.random() * 200;
            color = ember * 360 / totalEmbers;
            phaseShift = Math.random() * Math.PI * 2;
            angle = phaseShift + 2 * Math.PI * ember / totalEmbers;
            embers[ember] = {angle:angle, phaseShift:phaseShift, distance:distance, color:color, phaseAngle:phaseAngle, aspectFactor:aspectFactor, emberSize:emberSize, saturation:saturation};
        }
        break;
    default:
        type = typeArray [Math.floor(Math.random() * typeArray.length)];
        embers = makeEmbers ();
        type = 'random';
    
    }
    return embers;
    
}

function autoFireworks(timeDif){
    if(autoTime.time > autoTime.nextTime){
        autoTime.time = 0;
        autoTime.nextTime = Math.random() * 1.5 + 0.5;
        var x = ((c.width - 150) * Math.random() + 75) / c.width;
        var y = ((c.height - 225)* Math.random() + 100) / c.height;
        startFirework(x,y);
    }
    autoTime.time += timeDif;
}

function playSound(sound) {
    var soundEfect = new Audio();
    soundEfect.src = sound;
    soundEfect.volume = volumeInput;
    soundEfect.play();
}







}