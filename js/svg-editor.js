var drawing = SVG('drawing').size(624, 513)
var rect = drawing.rect();

drawing.on('mousedown', event=> {
  console.log("mousedown");
  //rect = draw.rect();
  rect = drawing.rect();
  rect.draw('point', event);
});

drawing.on('mousemove', event=> {

});

drawing.on('mouseup', event=> {

  rect.draw('stop', event);
});

function editor() {

}

editor();
