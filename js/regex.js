function exec(event) {
  event.preventDefault();

  clearResults();
  let valores = handleValues();

  let resultados = execRegex(valores);

  resultadosInput(resultados);
  highlightResultados(resultados, valores.target);
}

function execRegex(valores) {
  let textoPattern = valores.pattern; //dateFormat();
  let textoTarget = valores.target;
  let mostrarIndex = valores.mostrarIndex;
  let mostrarGrupos = valores.mostrarGrupos;

  let resultados = [];
  let resultado = null;

  let objetoRegex = new RegExp(textoPattern, 'g');

  while ((resultado = objetoRegex.exec(textoTarget))) {
    if (resultado[0] === '') {
      throw Error('Regex retorno un valor vacio.');
    }

    console.log('Resultado: ' + resultado[0]);

    resultados.push(
      result(
        mostrarGrupos ? resultado.join(' ||| ') : resultado[0],
        resultado.index,
        objetoRegex.lastIndex,
        mostrarIndex
      )
    );
  }

  timeExec(textoPattern, textoTarget);

  return resultados;
}

function result(resultado, index, lastIndex, mostrarIndex) {
  let textoIndex = mostrarIndex ? ' [' + index + '-' + lastIndex + ']' : '';

  return {
    resultado: resultado + textoIndex,
    index: index,
    lastIndex: lastIndex,
  };
}

function timeExec(textoPattern, textoTarget) {
  let pObjetoRegex = new RegExp(textoPattern, 'g');
  let ini = performance.now();
  pObjetoRegex.test(textoTarget);
  let fim = performance.now();
  console.log('Tiempo de ejecución (ms) ' + (fim - ini));
}

function resultadosInput(resultados) {
  let inputResultado = document.querySelector('#resultado');
  let labelResultado = document.querySelector('#labelResultados');

  labelResultado.innerHTML = resultados.length + ' Matches (resultados)';

  let resultadosComoArray = resultados.map(function (item) {
    return item.resultado;
  });

  labelResultado.innerHTML =
    resultadosComoArray.length + ' Matches (resultados)';

  if (resultadosComoArray.length > 0) {
    inputResultado.value = resultadosComoArray.join(' | ');
    inputResultado.style.borderStyle = 'solid';
    inputResultado.style.borderColor = 'lime'; //verde
  } else {
    inputResultado.placeholder = 'Sin resultados';
    inputResultado.value = '';
    inputResultado.style.borderStyle = 'solid';
    inputResultado.style.borderColor = 'red';
  }
}

function highlightResultados(resultados, texto) {
  let item = null;
  let indexBegin = 0;
  let conteudo = '';

  while ((item = resultados.shift()) != null) {
    conteudo += sinHighlight(
      escapeHtml(texto.substring(indexBegin, item.index))
    );
    conteudo += conHighlight(
      escapeHtml(texto.substring(item.index, item.lastIndex))
    );
    indexBegin = item.lastIndex;
  }

  //¿Quedó algún texto?
  if (texto.length - indexBegin > 0) {
    conteudo += sinHighlight(
      escapeHtml(texto.substring(indexBegin, texto.length))
    );
  }

  document.querySelector('#highlightText').innerHTML = conteudo;
}

function sinHighlight(texto) {
  return texto;
  //return "<s>" + texto + "</s>";
}

function conHighlight(texto) {
  return "<span class='bg-primary'>" + texto + '</span>';
}

function escapeHtml(string) {
  return string
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function handleValues() {
  let inputTarget = document.querySelector('#target');
  let inputPattern = document.querySelector('#pattern');
  inputPattern.focus();

  let checkboxIndex = document.querySelector('#mostrarIndex');
  let checkboxGroups = document.querySelector('#mostrarGrupos');

  _verificarInputs(inputTarget, inputPattern);

  console.log('Target:  ' + inputTarget.value);
  console.log('Pattern: ' + inputPattern.value.trim());

  return {
    target: inputTarget.value.trim(),
    pattern: inputPattern.value,
    mostrarIndex: checkboxIndex.checked,
    mostrarGrupos: checkboxGroups.checked,
  };
}

function _verificarInputs(inputTarget, inputPattern) {
  if (!inputTarget.value) {
    inputTarget.placeholder = 'Ingresa un target';
  }

  if (!inputPattern.value) {
    inputPattern.placeholder = 'Ingresa un pattern';
  }

  if (!inputTarget.value || !inputPattern.value) {
    throw Error('Valores inválidos');
  }
}

function clearResults() {
  console.clear();
  document.querySelector('#labelResultados').innerHTML =
    '0 Matches (resultados)';
  document.querySelector('#resultado').value = '';
  document.querySelector('#resultado').placeholder = 'No hay ningún resultado';
  document.querySelector('#highlightText').innerHTML =
    '<em>No hay ningún resultado</em>';
}

function dateFormat() {
  let DIA = '[0123]?\\d';
  let _DE_ = '\\s+(de )?\\s*';
  let MES = '[A-Za-z][a-z]{3,8}';
  let ANIO = '[12]\\d{3}';
  return DIA + _DE_ + MES + _DE_ + ANIO;
}
