"use strict";

var express = require('express');
var fs = require('fs');

var app = express();

app.use("/style", express.static(__dirname + '/views/style'));
app.use("/js", express.static(__dirname + '/views/js'));
app.use("/iframe", express.static(__dirname + '/views/'));
app.use("/exs", express.static(__dirname + '/exemplos/'));
app.use("/testes", express.static(__dirname + '/testes/'));

var rotas = function(_app, _endereco, _arquivo) {
   _app.get(_endereco, function (req, res) {
      var template = fs.readFileSync('views/base.html', 'utf8');
      var corpo = fs.readFileSync(__dirname + '/views' + _arquivo);
      template = template.replace('{{corpo}}', corpo);
      res.send(template);
   });
};

rotas(app, '/', '/index.html');
rotas(app, '/documentacao', '/documentacao.html');
rotas(app, '/comentarios', '/comentarios.html');
rotas(app, '/sobre', '/sobre.html');
rotas(app, '/exemplos', '/exemplos.html');

app.get('/plotz-iframe', function(req, res) {
   res.sendFile(__dirname + '/views/plotz-iframe.html');
});

var server = app.listen(process.env.PORT, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Plotz app listening at http://%s:%s", host, port)

})