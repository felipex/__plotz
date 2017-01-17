/**
Estruturas utilizada:

* Font:
  - name
  - color
  - size
  
* AxisLabel:
    - text
    - font: Font
    
* Axis:
    - min
    - max
    - color
    - thickness
    - label: AxesLabel

* Config
    - canvasID
    - XAxis: Axis
    - yAxis: Axis
    - onlyPoints:  Boolean
    
* Layer
    - canvas
    - index
    - context
    - name    

**/
var PLOTZ = function(_config) {
    this.containerID = _config.containerID; 
//    this.container = document.getElementById(this.containerID); // ### Colocar o comando do JQuery.
    this.container = $("#"+this.containerID)[0]; 
    if (!this.containerID) {
        throw new Error("O elemento " + this.container + " não foi encontrado.");
    }
    $(this.container).empty();

    this.layers = [];
    this.width = _config.width;
    this.height = _config.height;
    
    this.drawContainer();
        
    this.XAxis = _config.XAxis;   
    this.YAxis = _config.YAxis;
    this.onlyPoints = _config.onlyPoints;
    
    this.unitsPerTick = 1;

    // constants
    this.axisColor = '#aaa';
    this.font = '6pt Calibri';
    this.tickSize = 4;

    if (_config.showConfig) {
        this.createConfig(_config);
    }
    // relationships
    this.initialize();
}

/* Camadas fixas */
PLOTZ.prototype.ziBacks = 10;
PLOTZ.prototype.ziAxes = 15;
PLOTZ.prototype.ziTicks = 20;
PLOTZ.prototype.ziGrid = 25;
PLOTZ.prototype.ziFirstLayerIndex = 50;

PLOTZ.prototype.canvasBacks = 'backs';
PLOTZ.prototype.canvasAxes = 'axes';
PLOTZ.prototype.canvasTicks = 'ticks';
PLOTZ.prototype.canvasGrid = 'grid';

PLOTZ.prototype.functions = [];

PLOTZ.prototype.getLayer =  function(_name) {
    for (var i = 0; i < this.layers.length; i++) {
        if (this.layers[i].name == _name) {
            return this.layers[i];
        }
    }
    return null;
}

PLOTZ.prototype.getFunction =  function(_name) {
    for (var i = 0; i < this.functions.length; i++) {
        if (this.functions[i].name == _name) {
            return this.functions[i];
        }
    }
    return null;
}


PLOTZ.prototype.createConfig = function(_config) {
    
var funcoes = $('<details> <summary>Funções</summary>  <table>  <tr><td><label for="funcao_id">Função</label></td><td><input type="text" name="funcao" id="funcao_id" style="width:9em;"></td></tr><tr><td></td><td><input name="cor" id="cor_id" type="color">  </td></tr><tr><td></td><td><button onclick="plot()">Desenha</button></td></tr><tr><td></td><td></td></tr></table></details>');
    
}

PLOTZ.prototype.initialize = function() {
    this.rangeX = this.XAxis.max - this.XAxis.min;
    this.rangeY = this.YAxis.max - this.YAxis.min;
    this.unitX = this.layers[0].canvas[0].width / this.rangeX;
    this.unitY = this.layers[0].canvas[0].height / this.rangeY;

    this.centerY = Math.round(Math.abs(this.YAxis.max / this.rangeY) * this.layers[0].canvas[0].height);
    this.centerX = Math.round(Math.abs(this.XAxis.min / this.rangeX) * this.layers[0].canvas[0].width);
    this.iteration = (this.XAxis.max - this.XAxis.min) / 2000;
    this.scaleX = this.layers[0].canvas[0].width / this.rangeX;
    this.scaleY = this.layers[0].canvas[0].height / this.rangeY;
    
    this.drawAxes();
    this.drawTicks();
    this.drawGrid();
        
    this.next_zindex = this.ziFirstLayerIndex;
    
}

PLOTZ.prototype.nextZIndex = function() {
    this.next_zindex += this.next_zindex;    
    return this.next_zindex;
}

/* Só está precisando passar o _index por causa das Layers que não são funções
   como eixos e ticks, por exemplo. */
PLOTZ.prototype.createLayer = function(_index, _name) {
    var canvas = this.createCanvas(_index);
    var context = canvas[0].getContext('2d');
    
    var layer = {'canvas': canvas, 'index': _index, 'context': context, 'name': _name};
    this.layers[this.layers.length] = layer;
    return layer;
}

PLOTZ.prototype.createFunction = function(_name, _expression, _color) {
    var next = this.functions.length;
    var function_ = {expression: _expression, color: _color, name: _name};
    this.functions[next] = function_;
    return function_;
}

PLOTZ.prototype.createCanvas = function(_index) {
    var s = '<canvas id="canvas_canvasid_" ></canvas>';
    s = s.replace('_canvasid_', _index);
    $(this.container).append(s);
    var id = 'canvas_canvasid_'.replace('_canvasid_', _index);
    var id_ = '#'+id;

    var canvas = $(id_);
    canvas.attr("width", this.width);
    canvas.attr("height", this.height);
    canvas.attr("style", "position: absolute; top: 0; left: 0;");
//    canvas.attr("style", "border: solid 1px; position: absolute; top: 0; left: 0;");
    canvas.attr("z-index", _index);
    return canvas;
}

/* #### Depois de mais testes pode ser removida. A função acima está funcionando bem. */
PLOTZ.prototype._createCanvas = function(_index) {
    var s = '<canvas id="canvas_canvasid_" width="_width_" height="_height_" style="border: solid 1px; position: absolute; top: 0; left: 0;" z-index=_index_></canvas>';
    s = s.replace('_canvasid_', _index)
         .replace('_width_', this.width)
         .replace('_height_', this.height)
         .replace('_index_', _index);
    $(this.container).append(s);
    var id = 'canvas_canvasid_'.replace('_canvasid_', _index);
    var id_ = '#'+id;

    var canvas = $(id_);
    return canvas;
}

PLOTZ.prototype.drawContainer = function() {
    var layer = this.getLayer(this.canvasBacks);
    if (layer == null) {
        layer = this.createLayer(this.ziBacks, this.canvasBacks);
    }
    
    var h = parseInt(layer.canvas.attr("height"));
    var w = parseInt(layer.canvas.attr("width"));
    
    //layer.context.fillStyle = "#eaeaea";
    layer.context.fillStyle = "#ffffff";
    layer.context.fillRect(0,0,w,h);
}

PLOTZ.prototype.drawAxes = function() {
    var layer = this.getLayer(this.canvasAxes);
    if (layer == null) {
        layer = this.createLayer(this.ziAxes, this.canvasAxes);
    } else {
        var context = layer.context;
        context.save();
        this.transformContext(context);
        context.beginPath();
        context.clearRect(this.XAxis.min, this.YAxis.min, Math.abs(this.rangeX), Math.abs(this.rangeY));
        context.stroke();
        context.restore();
    }
    this.drawXAxis(layer);
    this.drawYAxis(layer);
}

PLOTZ.prototype.toggleAxes =  function() {
    var layer = this.getLayer(this.canvasAxes);
    var id = '#canvas'+layer.index;
    $(id).toggle();
}

PLOTZ.prototype.toggleFunction =  function(_name) {
    var layer = this.getLayer(_name);
    var id = '#canvas'+layer.index;
    $(id).toggle();
}

PLOTZ.prototype.setXAxis = function(_min, _max) {
    this.XAxis.min = parseFloat(_min);
    this.XAxis.max = parseFloat(_max);
    this.plotAll();
}

PLOTZ.prototype.setYAxis = function(_min, _max) {
    this.YAxis.min = parseFloat(_min);
    this.YAxis.max = parseFloat(_max);
    this.plotAll();
}

PLOTZ.prototype.drawXAxis = function(layer) {
    
    var context = layer.context;
    context.save();
    context.beginPath();
    context.moveTo(0, this.centerY);
    context.lineTo(layer.canvas[0].width, this.centerY);
    context.strokeStyle = this.axisColor;
    context.lineWidth = 2;
    context.stroke();
  
    context.restore();
};

PLOTZ.prototype.drawYAxis = function(layer) {
    
    var context = layer.context;
    context.save();
    context.beginPath();
    context.moveTo(this.centerX, 0);
    context.lineTo(this.centerX, layer.canvas[0].height);
    context.strokeStyle = this.axisColor;
    context.lineWidth = 2;
    context.stroke();

    context.restore();
};

PLOTZ.prototype.drawTicks = function() {
    var layer = this.getLayer(this.canvasTicks);
    if (layer == null) {
        layer = this.createLayer(this.ziTicks, this.canvasTicks);
    } else {
        var context = layer.context;
        context.save();
        this.transformContext(context);
        context.beginPath();
        context.clearRect(this.XAxis.min, this.YAxis.min, Math.abs(this.rangeX), Math.abs(this.rangeY));
        context.stroke();
        context.restore();
    }
    this.drawXTicks(layer);
    this.drawYTicks(layer);
}

PLOTZ.prototype.toggleTicks =  function() {
    var layer = this.getLayer(this.canvasTicks);
    var id = '#canvas'+layer.index;
    $(id).toggle();
}

PLOTZ.prototype.drawXTicks = function(layer) {
    
    var context = layer.context;
    context.save();

    // draw tick marks
    var xPosIncrement = this.unitsPerTick * this.unitX;
    var xPos, unit;
    context.font = this.font;
    context.textAlign = 'center';
    context.textBaseline = 'top';

    // draw left tick marks
    xPos = this.centerX - xPosIncrement;
    unit = -1 * this.unitsPerTick;

    while(xPos > 0) {
        context.moveTo(xPos, this.centerY - this.tickSize / 2);
        context.lineTo(xPos, this.centerY + this.tickSize / 2);
        context.strokeStyle = '#a0a0a0';
        context.lineWidth = 0.1;
        context.stroke();
        context.fillText(unit, xPos, this.centerY + this.tickSize / 2 + 3);
        unit -= this.unitsPerTick;
        xPos = Math.round(xPos - xPosIncrement);
    }

    // draw right tick marks
    xPos = this.centerX + xPosIncrement;
    unit = this.unitsPerTick;
    while(xPos < this.layers[0].canvas[0].width) {
        context.moveTo(xPos, this.centerY - this.tickSize / 2);
        context.lineTo(xPos, this.centerY + this.tickSize / 2);
        context.stroke();
        context.fillText(unit, xPos, this.centerY + this.tickSize / 2 + 3);
        unit += this.unitsPerTick;
        xPos = Math.round(xPos + xPosIncrement);
    }
    
    context.restore();
};

PLOTZ.prototype.drawYTicks = function(layer) {
    
    var context = layer.context;
    context.save();

    // draw tick marks
    var yPosIncrement = this.unitsPerTick * this.unitY;
    var yPos, unit;
    context.font = this.font;
    context.textAlign = 'right';
    context.textBaseline = 'middle';

    // draw top tick marks
    yPos = this.centerY - yPosIncrement;
    unit = this.unitsPerTick;
    while(yPos > 0) {
        context.moveTo(this.centerX - this.tickSize / 2, yPos);
        context.lineTo(this.centerX + this.tickSize / 2, yPos);
        context.stroke();
        context.fillText(unit, this.centerX - this.tickSize / 2 - 3, yPos);
        unit += this.unitsPerTick;
        yPos = Math.round(yPos - yPosIncrement);
    }

    // draw bottom tick marks
    yPos = this.centerY + yPosIncrement;
    unit = -1 * this.unitsPerTick;
    while(yPos < layer.canvas[0].height) {
        context.moveTo(this.centerX - this.tickSize / 2, yPos);
        context.lineTo(this.centerX + this.tickSize / 2, yPos);
        context.stroke();
        context.fillText(unit, this.centerX - this.tickSize / 2 - 3, yPos);
        unit -= this.unitsPerTick;
        yPos = Math.round(yPos + yPosIncrement);
    }
    context.restore();
};

PLOTZ.prototype.drawGrid = function() {
    var layer = this.getLayer(this.canvasGrid);
    var context = null;

    if (layer == null) {
        layer = this.createLayer(this.ziGrid, this.canvasGrid);
    } else {
        context = layer.context;
        context.save();
        this.transformContext(context);
        context.beginPath();
        context.clearRect(this.XAxis.min, this.YAxis.min, Math.abs(this.rangeX), Math.abs(this.rangeY));
        context.stroke();
        context.restore();
    }
    context = layer.context;
    
    context.save();

    // draw tick marks
    var xPosIncrement = this.unitsPerTick * this.unitX;
    var xPos, unit;

    // draw left tick marks
    xPos = this.centerX - xPosIncrement;
    unit = -1 * this.unitsPerTick;

    context.lineWidth = 0.1;

    while(xPos > 0) {
        context.moveTo(xPos, 0);
        context.lineTo(xPos, layer.canvas[0].height);
        unit -= this.unitsPerTick;
        xPos = Math.round(xPos - xPosIncrement);
    }
    context.strokeStyle = '#a0a0a0';
    context.stroke();

    // draw right tick marks
    xPos = this.centerX + xPosIncrement;
    unit = this.unitsPerTick;
    while(xPos < this.layers[0].canvas[0].width) {
        context.moveTo(xPos, 0);
        context.lineTo(xPos, layer.canvas[0].height);
        unit += this.unitsPerTick;
        xPos = Math.round(xPos + xPosIncrement);
    }
    context.strokeStyle = '#a0a0a0';
    context.setLineDash([5,2]);

    context.stroke();
    
    // draw tick marks
    var yPosIncrement = this.unitsPerTick * this.unitY;
    var yPos;

    // draw top tick marks
    yPos = this.centerY - yPosIncrement;
    unit = this.unitsPerTick;
    while(yPos > 0) {
        context.moveTo(0, yPos);
        context.lineTo(layer.canvas[0].width, yPos);
        unit += this.unitsPerTick;
        yPos = Math.round(yPos - yPosIncrement);
    }
    context.stroke();

    // draw bottom tick marks
    yPos = this.centerY + yPosIncrement;
    unit = -1 * this.unitsPerTick;
    while(yPos < layer.canvas[0].height) {
        context.moveTo(0, yPos);
        context.lineTo(layer.canvas[0].width, yPos);
        unit -= this.unitsPerTick;
        yPos = Math.round(yPos + yPosIncrement);
    }
    context.stroke();
    
    context.restore();
}

PLOTZ.prototype.toggleGrid =  function() {
    var layer = this.getLayer(this.canvasGrid);
    var id = '#canvas'+layer.index;
    $(id).toggle();
}

PLOTZ.prototype.toggleOnlyPoints =  function() {
    this.onlyPoints = !this.onlyPoints;
    this.plotAllFunction();
}

PLOTZ.prototype.transformContext = function(_context) {
    var context = _context;

    // move context to center of canvas
    context.translate(this.centerX, this.centerY);

    /*
     * stretch grid to fit the canvas window, and
     * invert the y scale so that that increments
     * as you move upwards
     */
    context.scale(this.scaleX, -this.scaleY);
};


PLOTZ.prototype.translate = function (_expression) {
    
    // Não precisa colocar o Math.sin porque estamos utilizando
    // a biblioteca mathjs.
    var expression = _expression.replace(/sen/g, 'sin');
    expression = expression.replace(/raiz/g, 'sqrt');
    expression = expression.replace(/cos/g, 'cos');
    expression = expression.replace(/pi/g, 'pi');
//    expression = expression.replace(/ln/ig, 'log');
//    expression = expression.replace(/e/ig, 'E');
    
    return expression;
}


PLOTZ.prototype.drawFunction = function(equation, color, thickness, name, layer) {

    var dx = ((this.XAxis.max-this.XAxis.min)/layer.canvas.width());
    var step = 0;
    // ### Esta ainda não foi a melhor solução, mas funciona.
    if (this.onlyPoints) {
        if ((this.XAxis.max-this.XAxis.min) < (this.YAxis.max-this.YAxis.min)) {
            step = (this.XAxis.max-this.XAxis.min) / 40;
        } else {
            step = (this.YAxis.max-this.YAxis.min) / 40;
        }
    }
    
    
    var context = layer.context;
    context.save();
    this.transformContext(context);
    context.beginPath();
    context.clearRect(this.XAxis.min, this.YAxis.min, Math.abs(this.rangeX), Math.abs(this.rangeY));


    try {
        context.moveTo(this.XAxis.min, equation(this.XAxis.min));
        context.fillStyle = color;
        
        var x0 = this.XAxis.min;
        var y0 = equation(x0);
        var x_anterior = this.XAxis.min;
        for(var x = this.XAxis.min; x <= this.XAxis.max; x += dx) {
          var y = equation(x);
          if (this.onlyPoints) {
              if (Math.abs(x - x_anterior) > step) {
                  context.moveTo(x0,y0);
                  context.arc(x, y, 0.1*step, 0, 2 * Math.PI);
                  //context.fill();
                  x_anterior = x;
              }
          } else {
              context.moveTo(x0,y0);
              context.lineTo(x,y);
          }
          x0 = x;
          y0 = y;
        }
    }catch(err){
      alert(err.message)
    }

    context.restore();
    context.lineJoin = 'round';
    context.lineWidth = thickness;
    context.strokeStyle = color;
    context.stroke();
    context.restore();
    return name;
};

PLOTZ.prototype.nextFunctionName = function() {
    var zindex = this.nextZIndex();
    return 'equation'+ zindex.toString();
}

PLOTZ.prototype.plot = function(_expression, _color, _name) {
    var name =_name;
    var layer;
    var function_;

    if (_name == null) {
        name = this.nextFunctionName();
        var zindex = this.nextZIndex();
        layer = this.createLayer(zindex, name);
        function_ = this.createFunction(name, _expression, _color);
    } else {
        layer = this.getLayer(name);// Se name == null então getLayer também retornará null.
        function_ = this.getFunction(_name);// Se name == null então getFunction também retornará null.
        
    }
    
    var expression = this.translate(_expression);
    
    funcao = function(x) {
        var scope = {x: x}
        return math.eval(expression, scope);
    }
    
    this.drawFunction(funcao, _color, 2, name, layer); 

    return name;    
}

PLOTZ.prototype.plotAllFunction = function() {
    for (var i = 0; i < this.functions.length; i++) {
        if (this.functions[i]) {
            this.plot(this.functions[i].expression, this.functions[i].color, this.functions[i].name);
        }
    }
}

PLOTZ.prototype.plotAll = function() {
    this.initialize();
    this.plotAllFunction();
}


PLOTZ.prototype.save = function() {
    var allCanvas = document.createElement("canvas");
    allCanvas.width = this.width;
    allCanvas.height = this.height;
    
    var allContext = allCanvas.getContext('2d');
    
    for (var i = 0; i < this.layers.length; i++) {
        allContext.drawImage(this.layers[i].canvas[0], 0,0);
    }
    allCanvas.toBlob(function(blob) {
        saveAs(blob, "output.png");
    }, "image/png");

}