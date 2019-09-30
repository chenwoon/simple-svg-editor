var drawing = SVG('drawing').size(624, 513)
var rect = drawing.rect();

drawing.on('mousedown', event=> {
  console.log("mousedown");
  rect = drawing.rect();
  rect.draw('point', event);
});

drawing.on('mousemove', event=> {

});

drawing.on('mouseup', event=> {

  rect.draw('stop', event);
});

// Dynamic tools setup. It is to implement the flextibility to add/remove tool
// buttons to the tools panel. It can be put into database instead of hardcoding
const tools = [
  {
    "name": "Rect",
    "type": "rect",
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAB7ElEQVRIS+1U3UoCQRg9Uj2AV5JlRJIVRdRb9QLZrFSuRjtRmqYWEnQR9EIRXUQ/F5EIJv1DlDszMTu765qbixd11d58O7PfnvOd7y+EX35Cv4yPf4LADP9Zikg4HKaRSASAgBAqMJfdLwwhPTsf+V+j0cDT06MGYMuLkSaE6JRS0WI8xBgH4wKMczAmYMp3y7bvTaa+O/bT5IjHIoKuJ0P53I4OIONHgLf3zw5AzgVMxu27n+1HiyExHkUuS1DI9yBovrzDAZUqvODW2VZlRW8pUyo+TIbp8SiKmykUd3PdCjSN6IZBUWu+gQsF7AV0gL9bJ01SwczECPa3VrFX6EFwU39WBG7+nTr4WFuhDEQSzMZHUd1eQ7mY71aQ0oieNSgubh8gRGdRA9UwbhHMTcZwlE+jsudLoOlpw8D59b0i8ETnEjhp+265IpifjOG4mMF+ade/BqksxdlV3Wpwt4B2IYPqIQkWp8ZwUs7ioFTwadMVoid1itPLuzaBp89lp3D77NbHVsIFrJlYSCiCaqWbQF8hWnqTGq2L2uuQnEg1aO1hc94tZfa9bGc5zcqfIz423CptLA8dVgpyyKQKdxssAdgGMAiAebdE4DZrO0iuAQAmgCSAase66QOoL9c/26Z9RdWP87+CwGx9AbZaITchNUahAAAAAElFTkSuQmCC",
    "pos": 1
  },
  {
    "name": "Circle",
    "type": "ellipse",
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAD70lEQVRIS7WVf0wbZRjHv+316LVAFwpUYZjJhp2FxDQTQkkcCQRNAU1kEc2IyfyBXbQjoNM/zJIp0+hM/HNNXEBR/3H8sWy4KSETmSbdgrEENZroRGYlQX6UXmlL2+u975krtPb6g9U/vORyueee9/k87/N+n+dU+J8v1X+Mn/SXCl23K2BgYEDr9XqHCSGthBAzpdRICAGllBdF8TdKqTsSiZzxeDyBfMC8gJ6enkdFUbzAsqzKYrGs2Gw20tLcXMYWFancbrdv5usZ9fyPP1TyPM8RQo7Pzc19nAuSBejt7WVisdgEpbTTbrf/6nQ694FSBoRqIYoAIcB2gQQw6vjI2Ed/ukZG7hdF8SbHcY94PJ6tdFAWoLu7+yrLsu0ulytQXVVlgCjqQeh2YJFsP5M3lQCWiaxt8FudfU+xfCBwa2FhoTEvwG63d0mSdGV0dNRXs3dvZSLjVNAdSBaIAmoVeCEeOGTvKCGEOL1e7/kkJLUDh8PBLi4ubnR1dS0PDQ7WIC7qFNneCcRpYx9evHj71Pvv1bIsW7W0tLQhQ1KAtra2YZZlX5uampIgCPrtzNOyTpYll122UQoYSsMHH26P/722+vnm5uYxBaC1tfUbi8Vy7wcu112ICdpU9mIOSKJMOeyclvYPn14cn/wyHgqFLApAS0vLqsPhCD7T17cfUUF5mPkCZtoZBpdnb3iPvvpyRTQaLVYAmpqayPj4uL/WZCqHsCPHTNXIJcuyJdVFAUlCQKuJGG2NOkqpAUAwdQZWq5VevnTJv6/MaIQQ39lBHnnmA0lAWFcULWl+kANgBOBPARoaGtZPDg3xzz7x5AFEomkl2kWemZLVMLg67/E+NnjCBECnKJHZbHYfslqrPzs/Uo1QuOjfQ042VgEgPScdO/v2759+cUWObVYA6urqzrIajfOX2e/V8PP61FhQZJmhnPTekGVaURau7uyILK+vfwXgqAJQX19fwvP82kvP9/9xynmiFnxQ2WgpUJ7eKC0Wxq5NLjz31vB9APYD+EsBkF9MJtPThJBP5qdnfDUlpZXYiuTWe2azaTQIsJpgecdhHaH0DQDvZI2KpMFgMHyr1+ke+Gn6erxCyxUjsKlLSDOXPOVhp9fFApIYNR95XFj1+3wAEg2WFwCA4zjuOqW08c2hV35+/fiLBxAMc4hFmUQDyiC1CmAYCq4oMjYxcbv/3TMHKaW3ABwGIEN2BSQ/vgDgXNmePaH2Zttqr93O2G0P3c2q1erpmzeWL0xNCtPfzVasbPjKAZxOL0uhANlPbpZzAOQZf4+8u53FMQBLAOYAnEweaEF/tFxOaTYZyAJYuYNfQSUqNMaufv8A4yikN0E6FY8AAAAASUVORK5CYII=",
    "pos": 2
  }
];
function dynamicTools() {
  var toolsPanel = document.getElementById("tools");
  for(var i = 0; i < tools.length; i++) {
    var oneTool = document.createElement('img');
    oneTool.src = tools[i].icon;
    oneTool.setAttribute('class', 'tool-button');
    oneTool.id = 'tool-' + tools[i].type;
    oneTool.title = tools[i].name;
    oneTool.alt = tools[i].name;
    var textTool = document.createTextNode(" " + tools[i].name);
    toolsPanel.appendChild(oneTool);
    toolsPanel.appendChild(textTool);
  }
};

function editor() {
  dynamicTools();
};

editor();