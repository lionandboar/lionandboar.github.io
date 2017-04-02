var nodecount = 0;
var nodescss = 'clip-path: polygon( ';

var shards = document.getElementsByClassName('shard');

for (let i=0; i<shards.length; i++){
  shards[i].style.width = 500 + "px";
  shards[i].style.height = 500 + "px";
}

for (var i=0; i<shards.length; i++){
  shards[i].style.zIndex = shards.length-i;
}

$('body').on('click', function (e){
  var mouseX = e.pageX;
  var mouseY = e.pageY;

  var shapesoffsetX = $('.polygon-wrap').offset().left;
  var shapesoffsetY = $('.polygon-wrap').offset().top;

  var polygonswidth=$('.polygon-wrap').width();
  var polygonsheight=$('.polygon-wrap').height();

  var shapesmouseX = mouseX - shapesoffsetX;
  var shapesmouseY = mouseY - shapesoffsetY;

  var mousepercentX = shapesmouseX / polygonswidth;
  var mousepercentY = shapesmouseY / polygonsheight;

  var finalmouseX = (mousepercentX) * 100. ;
  var finalmouseY = (mousepercentY) * 100. ;
  var normalisedX = parseFloat(finalmouseX).toFixed(2);
  var normalisedY = parseFloat(finalmouseY).toFixed(2);

  nodecount = nodecount+1;

  if (nodecount < 3) {
    nodescss = nodescss + normalisedX + '% ' + normalisedY + '% ,';
  } else  
  if (nodecount == 3) {
    nodescss = nodescss + normalisedX + '% ' + normalisedY + "% ); background-color: brown;";
    console.log(nodescss);
    nodescss = 'clip-path: polygon( ';
    nodecount = 0;
  }   
});

function getRandomPos(){
  var factorX = Math.random(); var factorY = Math.random();
  var randX = 200 * factorX;
  var randY = 200 * factorY;
  if (factorX < .5)
    randX = randX * -1;
  if (factorY < .5)
    randY = randY * -1;
  return "(" + randX + "px, " + randY + "px)";
}

function explode(animalID){
  var animal = document.getElementById(animalID);
  if(!warped)
    animal.classList.remove('rotate');
  var shards = animal.getElementsByClassName('shard');
  var pos;

  var i=0;
  var interval = setInterval(function(){
    if (i>=shards.length){
      clearInterval(interval);
      return;
    }
    explodeSingle(shards[i]);
    i++;
  }, 7);

  // for (var i=0; i<shards.length; i++){
  //   explodeSingle(shards[i]);
  // }
}

function restore(animalID){
  var animal = document.getElementById(animalID);
  if(!warped)
    animal.classList.add('rotate');
  var shards = animal.getElementsByClassName('shard');
  for (var i=0; i<shards.length; i++){
    shards[i].style.transform = "none";
    shards[i].style.width = 500 + "px";
    shards[i].style.height = 500 + "px";
    shards[i].classList.remove('hover');
  }
}

function explodeSingle(shard){
   pos = getRandomPos();
   shard.style.transform = "translate" + pos + "rotateY(" + getRandomRotation() + "deg) rotateX(" + getRandomRotation() + "deg)";
   // let curX = shard.style.width;
   // let curY = shard.style.height;
   // curX = curX.substring(0, curX.length-2);
   // curY = curY.substring(0, curY.length-2);
   // let factor = Math.random();
   // curX = curX * 2;
   // curY = curY * 2;
   // shard.style.width = curX + "px";
   // shard.style.height = curY + "px";
   shard.classList.add('hover');
}

function getRandomRotation(){
  var factor = Math.random()
  if (factor < .5)
     return factor * -200;
  return factor * 200;
}

function tackle(){
  var pos1; var pos2;
  var interval = setInterval(function(){
    pos1 = move('lion', 'left');
    pos2 = move('boar', 'right');
    if (pos2 -500< pos1 && !broken){
      explode('lion');
      explode('boar');
      broken = true;
    }
    if (pos2 + 1500 < pos1){
      clearInterval(interval);
    }
  }, 5);
}


function move(animalID, direction){
  var animal = document.getElementById(animalID);
  var left = animal.style.left;
  left = left.substring(0, left.length-2);
  left = Number(left);
  if (direction == 'right')
    left--;
  else
    left++;
  animal.style.left  = left + "vw";
  if (direction == 'left')
    return animal.getBoundingClientRect().right;
  else
     return animal.getBoundingClientRect().left;
}
//mouse events

window.addEventListener('mousemove', function(e){
  var arena = document.getElementById('arena');
  var percent = e.pageX/window.innerWidth;
  var percentY = e.pageY/window.innerHeight;
  percent = percent - .5;
  percentY = percentY - .5;
  let radians = percent*3.14159;
  let radiansY = percentY*3.14159;
  var rotateAmt = Math.sin(radians)*25;
  var rotateAmtY = Math.sin(radiansY)*15;
  arena.style.transform = "rotateY(" + rotateAmt + "deg) rotateX(" + rotateAmtY + "deg)";
});

var passed = false;

window.addEventListener('click', function(){
  var lion = document.getElementById('lion');
  var boar = document.getElementById('boar');
  if (!warped){
    lion.classList.add('warpLion');
    lion.classList.remove('rotate');
    lion.style.left = 0 + "vw";
    boar.classList.add('warpBoar');
    boar.classList.remove('rotateReverse');
    warped = true;
    return;
  }
  if (passed){
    lion.style.left = 0 +"vw";
    boar.style.left = 60 + "vw";
    lion.classList.remove('warpLion');
    boar.classList.remove('warpBoar');
    lion.classList.add('rotate');
    boar.classList.add('rotateReverse');
    warped = false;
    passed = false;
    return;
  }
  if (!broken){
    lion.style.transition = 'none';
    boar.style.transition = 'none';
  tackle();
  }
  else{
    lion.style.transition = "left " + .5 + "s ease-in-out";
    boar.style.transition = "left " + .5 + "s ease-in-out";
    restore('lion');
    document.getElementById('lion').style.left = 60 +"vw";
    restore('boar');
    document.getElementById('boar').style.left = 0 + "vw";
    broken = false;
    passed = true;
  }
});

//////

var broken = false;
var warped = false;

// document.getElementsByClassName('explode')[0].addEventListener('click', function(e){
//   e.stopPropagation();
//   var lion = document.getElementById('lion');
//   var boar = document.getElementById('boar');
//   if (!warped){
//     lion.classList.add('warpLion');
//     lion.classList.remove('rotate');
//     lion.style.left = 0 + "vw";
//     boar.classList.add('warpBoar');
//     boar.classList.remove('rotateReverse');
//     warped = true;
//     return;
//   }
//   tackle();
// });

// var lion = document.getElementById('lion');
// var lionShards = lion.getElementsByClassName('shard');
// var k=0;
// var interval = setInterval(function(){
//     if (k == 36){
//       k = 0;
//       return;
//     }
//     lionShards[k].classList.add('highlight');

//     setTimeout(function(){
//       lionShards[k].classList.remove('highlight');
//     }, 100);
//     k+=2;
// }, 200);