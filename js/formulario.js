// Solo evita el envío real y permite probar la validación nativa del navegador.
const formulario = document.querySelector('form');
const resultado = document.querySelector('#resultado');
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  resultado.hidden = false;
});
formulario.querySelector('button[type="submit"]').disabled = false;
