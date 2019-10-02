var drawObj = null;
var drawing = SVG('drawing').size(624, 513);
var selectedObjs = []; // For future multi-select
var selectedTitle = null;

drawing.on('mousedown', event=> {
  unselectAll();
  if(drawObj != null) {
    drawObj.draw('point', event);
  }
  if(drawObj != null && drawObj.type == "image") {
    drawObj.show();
  }
});

drawing.on('mousemove', event=> {
});

drawing.on('mouseup', event=> {
  if(drawObj != null) {
    drawObj.draw('stop', event);
    // Done with this drawObj. Create another
    drawObj = createDrawObject(drawObj.type, selectedTitle);
  }
});

document.addEventListener('keydown', function(event) {
    const key = event.key; // const {key} = event; ES6+
    if (key === "Delete") {
        deleteDrawObj();
    }
});

// Dynamic tools setup. It is to implement the flextibility to add/remove tool
// buttons on the tools panel. It can be put into database instead of hardcoding
const tools = [
  {
    "name": "Rect",
    "type": "rect",
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAB7ElEQVRIS+1U3UoCQRg9Uj2AV5JlRJIVRdRb9QLZrFSuRjtRmqYWEnQR9EIRXUQ/F5EIJv1DlDszMTu765qbixd11d58O7PfnvOd7y+EX35Cv4yPf4LADP9Zikg4HKaRSASAgBAqMJfdLwwhPTsf+V+j0cDT06MGYMuLkSaE6JRS0WI8xBgH4wKMczAmYMp3y7bvTaa+O/bT5IjHIoKuJ0P53I4OIONHgLf3zw5AzgVMxu27n+1HiyExHkUuS1DI9yBovrzDAZUqvODW2VZlRW8pUyo+TIbp8SiKmykUd3PdCjSN6IZBUWu+gQsF7AV0gL9bJ01SwczECPa3VrFX6EFwU39WBG7+nTr4WFuhDEQSzMZHUd1eQ7mY71aQ0oieNSgubh8gRGdRA9UwbhHMTcZwlE+jsudLoOlpw8D59b0i8ETnEjhp+265IpifjOG4mMF+ade/BqksxdlV3Wpwt4B2IYPqIQkWp8ZwUs7ioFTwadMVoid1itPLuzaBp89lp3D77NbHVsIFrJlYSCiCaqWbQF8hWnqTGq2L2uuQnEg1aO1hc94tZfa9bGc5zcqfIz423CptLA8dVgpyyKQKdxssAdgGMAiAebdE4DZrO0iuAQAmgCSAase66QOoL9c/26Z9RdWP87+CwGx9AbZaITchNUahAAAAAElFTkSuQmCC"
  },
  {
    "name": "Circle",
    "type": "ellipse",
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAD70lEQVRIS7WVf0wbZRjHv+316LVAFwpUYZjJhp2FxDQTQkkcCQRNAU1kEc2IyfyBXbQjoNM/zJIp0+hM/HNNXEBR/3H8sWy4KSETmSbdgrEENZroRGYlQX6UXmlL2+u975krtPb6g9U/vORyueee9/k87/N+n+dU+J8v1X+Mn/SXCl23K2BgYEDr9XqHCSGthBAzpdRICAGllBdF8TdKqTsSiZzxeDyBfMC8gJ6enkdFUbzAsqzKYrGs2Gw20tLcXMYWFancbrdv5usZ9fyPP1TyPM8RQo7Pzc19nAuSBejt7WVisdgEpbTTbrf/6nQ694FSBoRqIYoAIcB2gQQw6vjI2Ed/ukZG7hdF8SbHcY94PJ6tdFAWoLu7+yrLsu0ulytQXVVlgCjqQeh2YJFsP5M3lQCWiaxt8FudfU+xfCBwa2FhoTEvwG63d0mSdGV0dNRXs3dvZSLjVNAdSBaIAmoVeCEeOGTvKCGEOL1e7/kkJLUDh8PBLi4ubnR1dS0PDQ7WIC7qFNneCcRpYx9evHj71Pvv1bIsW7W0tLQhQ1KAtra2YZZlX5uampIgCPrtzNOyTpYll122UQoYSsMHH26P/722+vnm5uYxBaC1tfUbi8Vy7wcu112ICdpU9mIOSKJMOeyclvYPn14cn/wyHgqFLApAS0vLqsPhCD7T17cfUUF5mPkCZtoZBpdnb3iPvvpyRTQaLVYAmpqayPj4uL/WZCqHsCPHTNXIJcuyJdVFAUlCQKuJGG2NOkqpAUAwdQZWq5VevnTJv6/MaIQQ39lBHnnmA0lAWFcULWl+kANgBOBPARoaGtZPDg3xzz7x5AFEomkl2kWemZLVMLg67/E+NnjCBECnKJHZbHYfslqrPzs/Uo1QuOjfQ042VgEgPScdO/v2759+cUWObVYA6urqzrIajfOX2e/V8PP61FhQZJmhnPTekGVaURau7uyILK+vfwXgqAJQX19fwvP82kvP9/9xynmiFnxQ2WgpUJ7eKC0Wxq5NLjz31vB9APYD+EsBkF9MJtPThJBP5qdnfDUlpZXYiuTWe2azaTQIsJpgecdhHaH0DQDvZI2KpMFgMHyr1+ke+Gn6erxCyxUjsKlLSDOXPOVhp9fFApIYNR95XFj1+3wAEg2WFwCA4zjuOqW08c2hV35+/fiLBxAMc4hFmUQDyiC1CmAYCq4oMjYxcbv/3TMHKaW3ABwGIEN2BSQ/vgDgXNmePaH2Zttqr93O2G0P3c2q1erpmzeWL0xNCtPfzVasbPjKAZxOL0uhANlPbpZzAOQZf4+8u53FMQBLAOYAnEweaEF/tFxOaTYZyAJYuYNfQSUqNMaufv8A4yikN0E6FY8AAAAASUVORK5CYII="
  },
  {
    "name": "Img1",
    "type": "image",
    "icon": "data:image/png;base64,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"
  },
  {
    "name": "Img2",
    "type": "image",
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEvElEQVRIS62Va2wUVRTH/zOzO9vZ3S7tWuhrBVoobgPyEHkkLCURFcUmGhKMih9ESkh09TOJMSREEiWEYKSgtqYEIQQMQSO0xkeptIBtkCoUFbBa6WPb7mt2Z3dm53nN3AIpBKgG7qd53Dm/c/7/c88w+B+rIVxTwVpGFWE4k8typ9fva8tN9Dkz0YYb77dsATvbfEEpKpvGZ1IJiNHhsJJJNG369Gf5XjH+M6AxHHoluGDZwVlzF0FXFfSc6yBDfZf963e1iQ8E0BAOtdXUrlsxubgUDMOgvfkLjPb/U1u3t/3EAwF8Fq4xVr28iXMLHnBOJ1oOfYyUFJ+56aMzvfcNaHq7pso7qehK6Nm1ELz5YMDg+IHdWLe9ZUKJJ9xgZ9f4RujIjDmPrV0QehoAgaHp+LJpJxhirdqw58y3911B45uh+NInn/eXTasCCEE6Fcf3R/eBOPSSjR92jtwX4MBbS3ys4E+tXPMaWJalsYb7e9HZejxbV9/hnajNJ5SoMRw6OnthaE1lcC7I9d1/XfoFv50/3UcY9t0bgI272w/cCXZPQGN4+TLB421esfpFn905xLJojItdp9Df+8fdkyfM4bo97S/ZG+4KsA8Wz+ftX/pELVdQHIAmp6jBhDDoOtmMrCSibOoMCskvKMSkwiKYhg4pLeJqTzdUJUchDDYcIjanssiFg8tl/Hps+1aHkJ/g+bxdjy9/CkWBmdBzEgxNpcEIsXDy68MIzpmH/MIpmFwagJpTIHh9cLr90KRRiPEoTn1zDHX1HQyDz7sIJA3Bjm5cqB6C9c572tHNz/Hzl6zAQ+WVYDkHssmInTxM04Cpa/i9uxOz5szD0MAAhea53SgJVMJbVI6+S1242nN+XAX7uwiSMmb3xdCzsxYpUdF6T+zgS6YH4fIUIpMYgqHKNLCua8iIccRHR+ByexAdHoTDycPhcIBhOeqRodsyJWEZ1nWJbEAii+rLEVzc8QxGU4o22raXDwQXw9RzSI30wTJNmLqObFaCJCZoJazDhUcXLYOWU8CwLHhXHhx5+TA1BcloZJxEd6hg4Ifd/OSp1ZBi/chlUjB0DUo2AzmboR4IggeKqtMWyRM8cPI8NbmgpAIj167gwk8nb5PotgoS7Q08GEIztwwDiixTI+2APM9D13XEYzFomkZlcfA8nLzrHhKN8yAtKuqfX21zcSwHy25Ly6Ig22VbCpuSFpMQRRHBeYvgn1JKJXM6eXC8G5ahIhkdvk2icRVE04o60LLDZXcNy42NBnpYmOtHhgCRyCBM04TbWwBCCFyCgCmlD2NS8XRIYhSd3x0bJ1HTWYKEjEd6rqHz/ZWIpnNq+vQnLnsk28uyTy8DsAwDixD6s8lIGQxHBsEwLEzDoCP8lg4yzWt19R3TxpJr6KCAqvO9aN1Wg5ikqpGW7a6SsnK7CIoh9gW9A1iWgyRJiMWiqJ6/GG6vDw6HE0JBMYipIz709015xgD1P9I2nXHuKo5vXYK4pKmDJz5w+Xw+lJQFxiCUYoMIZFlGSkxCN3R4fX5aYaBiJoR8P9JiHBfOtt6UZwywcKvtHirKPTiyeT6Skp6zuvetljPyqzk19/rdJprdrpqqUYNvWeMGnf38X6bamDeSpjZpAAAAAElFTkSuQmCC"
  }

];

function dynamicTools() {
  var toolsPanel = document.getElementById("tools");
  for(var i = 0; i < tools.length; i++) {
    var oneTool = document.createElement('img');
    oneTool.src = tools[i].icon;
    oneTool.setAttribute('class', 'tool-button');
    oneTool.setAttribute('onclick', 'toolBtnClick(event);');
    oneTool.id = tools[i].name;
    oneTool.title = tools[i].name;
    oneTool.alt = tools[i].name;
    oneTool.name = tools[i].type;
    var textTool = document.createTextNode(" " + tools[i].name);
    toolsPanel.appendChild(oneTool);
    toolsPanel.appendChild(textTool);
  }
};

function createDrawObject(obj, title)  {
  const option = {
    stroke: 'blue',
    'stroke-width': 2,
    'fill-opacity': 0,
  };
  const style = {
    'cursor': 'pointer',
  };

  let drawObj = null;
  switch (obj) {
    case 'rect':
      drawObj = drawing.rect();
      break;
    case 'ellipse':
      drawObj = drawing.ellipse();
      break;
    case 'image':
      drawObj = drawing.image();
      // Load the image with title
      for(var i = 0; i < tools.length; i++) {
        if(tools[i].name == title) {
          drawObj.load(tools[i].icon).hide();
          break;
        }
      }
      break;
    default:
      drawObj = null;
  }
  if (drawObj) {
    drawObj
    .attr(option)
    .style(style)
    .draggable()
    .click(clickHandler);
  }

  return drawObj;
};

function clickHandler(event) {
  unselectAll();
  this.selectize();
  this.resize();
  selectedObjs[0] = this;
  $('#menu-delete').show();
};

function unselectAll() {
  for(var i = 0; i < selectedObjs.length; i++) {
    selectedObjs[i].resize('stop');
    selectedObjs[i].selectize(false);
  }
  $('#menu-delete').hide();
};

function toolBtnClick(e) {
  e = e || window.event;
  var target = e.target || e.srcElement;
  $('.tool-button-selected').removeClass('tool-button-selected').addClass('tool-button');
  $('#'+target.id).addClass('tool-button-selected');
  drawObj = createDrawObject(target.name, target.title);
  selectedTitle = target.title;
};

// Because of the way the draw.obj was created, it will have hidden objects
// everytime the [shape] tool is clicked. This is to remove those hidden objects.
function removeHiddenObjs() {
  var elems = drawing.children();
  for(var i = 0; i < elems.length; i++) {
    switch(elems[i].type) {
      case "image":
        if(elems[i].node.style.display == 'none') {
          elems[i].node.parentNode.removeChild(elems[i].node);
        }
        break;
      case "rect":
        if(elems[i].node.width.baseVal.value == 0 && elems[i].node.height.baseVal.value == 0) {
          elems[i].node.parentNode.removeChild(elems[i].node);
        }
        break;
      case "ellipse":
        if(elems[i].node.rx.baseVal.value == 0 && elems[i].node.ry.baseVal.value == 0) {
          elems[i].node.parentNode.removeChild(elems[i].node);
        }
        break;
    }

  }
};

function save() {
  removeHiddenObjs();
  unselectAll();
  var a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(drawing.svg()));
  a.setAttribute('download', 'simple.svg');
  if (document.createEvent) {
      var event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      a.dispatchEvent(event);
  }
  else {
      a.click();
  }
};

function deleteDrawObj() {
  for(var i = 0; i < selectedObjs.length; i++) {
    selectedObjs[i].resize('stop');
    selectedObjs[i].selectize(false).remove();
    selectedObjs.splice(i,1);
  }
  unselectAll();
};

function newPage() {
  unselectAll();
  drawing.clear();
};

function editor() {
  dynamicTools();
};

editor();
