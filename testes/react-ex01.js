ReactDOM.render(
  <h1>Olá, mundo!</h1>,
  document.getElementById('root')
);

// Create a component named MessageComponent
var MessageComponent = React.createClass({
  render: function() {
    let style = {color: "blue"};
    return (
      <div style={style}>{this.props.message}</div>
    );
  }
});

function oninput(event) {
  //alert(target.target.name);
  let namestr = event.target.getAttribute("name");
  let destinostr = namestr.substr(0, namestr.indexOf("-edit"));
  let destino = document.getElementsByName(destinostr)[0];
  destino.innerHTML = event.target.value;
  /* global MathJax */
  //MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});
}

function editar(a){
  let formEditor = document.createElement("form");
  formEditor.style = "border: 1px dashed gray";
  document.body.insertBefore(formEditor, a);
  
  let editor = document.createElement("textarea");
  editor.rows = 2;
  editor.cols = 100;
  editor.style = "border: 1px dashed gray";
  editor.value = a.innerHTML;
  editor.name = a.getAttribute("name") + "-edit";
  editor.oninput = oninput;
  
  formEditor.appendChild(editor);

  formEditor.appendChild(document.createElement("br"));

  let botaoSalvar = document.createElement("button");
  botaoSalvar.textContent = "Salvar";
  formEditor.appendChild(botaoSalvar);
} 
  
  function novo(){
    let root2 = document.getElementById('root2');
    ReactDOM.render(<MessageComponent message="Jim Sproch" />, root2);

    let pp = document.createElement("p");
    pp.id = "p02-id";
    pp.setAttribute("name", "p02");
    pp.className = "editavel";
    pp.innerHTML = "Escreva seu texto";
    pp.addEventListener("dblclick", (a) => editar(pp));
    document.body.appendChild(pp);
  }

