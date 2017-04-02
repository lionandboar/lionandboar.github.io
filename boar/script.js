var nodecount = 0;
var nodescss = 'clip-path: polygon( ';

var shards = document.getElementsByClassName('shard');

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