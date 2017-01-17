"use strict";

class InaSecao {
  
  set titulo(value) {
    this._titulo = value;
  }
  get titulo() {
    return this._titulo;
  }
}

class InaRoteiro {

  constructor() {
    let valor = "teste";
    this._titulo = "Sem título";
    this._secoes = [];
  }
  
  set titulo(value) {
    this._titulo = value;
  }  
  get titulo() {
    return this._titulo;
  }
  
  get secoes() {
    return this._secoes;
  }
  set secoes(value){
    this._secoes = value;
  }
  
  parseSecao = function(secao) {
    let s = new InaSecao();
    //s.titulo = secao.
    //this.secoes.push(s);
    //console.log(this._secoes);
  }
  
  parseSecoes = function(secoes) {
    Array.from(secoes).map(this.parseSecao);
  }
  
  parse(xml) {
    /* global DOMParser */
    let _parser = new DOMParser();
    let xmlDoc = _parser.parseFromString(xml,"text/xml");

    this.titulo = xmlDoc.getElementsByTagName("titulo")[0].childNodes[0].nodeValue;
    
    // Seções
    let secoes = xmlDoc.getElementsByTagName("secao");
    this.parseSecoes(secoes);
    
  }

}

class InaRoteiroHTML5 {
  constructor(inaRoteiro, iddiv) {
    this.createDoc(inaRoteiro, iddiv);
  }
  
  createDoc(inaRoteiro, iddiv) {
    let roteirodiv = document.getElementById(iddiv);
    
    let titulo = document.createElement('h1');
    titulo.innerHTML = inaRoteiro.titulo;

    roteirodiv.appendChild(titulo);
    
    for (let s in inaRoteiro.secoes) {
      let secao = document.createElement('<secao>');
      secao.innerHTML = s.titulo;
    }
  }
}

let getxml = function () {
  let xml = "<ina-roteiro>"+
    "<titulo>TICs no ensino de matemática</titulo>"+
    "<secao titulo='Seção 1'>"+
      "<paragrafo>"+
        "Este é o conteúdo do primeiro parágrafo da seção. Vamos ver o que vai acontecer."+
      "</paragrafo>"+
      "<paragrafo>"+
        "Este aqui já é outro prágrafo. Este é o conteúdo do primeiro parágrafo da seção. Vamos ver o que vai acontecer."+
      "</paragrafo>"+
    "</secao>"+
    "<secao titulo='Seção 2'>"+
      "<paragrafo>"+
        "Este é o conteúdo do primeiro parágrafo da seção. Vamos ver o que vai acontecer."+
      "</paragrafo>"+
    "</secao>"+
    "</ina-roteiro>";
  
  return xml;
}

var inicio = function() {
  let ina = new InaRoteiro();
  let xml = getxml();
  ina.parse(xml);   
  
  let Html5 = new InaRoteiroHTML5(ina, "roteiro1");
  
}
