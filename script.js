const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQpkAm41y7ZSsJvoH3JBlpl79vjGaM2tq2WBGy03MQWdAfBNq5CuAyURuPAAb3f8c-D5gXO0CvUlp42/pub?gid=0&single=true&output=csv';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('produtos');

  const contadorEl = document.createElement('div');
  contadorEl.style.textAlign = 'center';
  contadorEl.style.color = '#4B5563';
  contadorEl.style.marginTop = '1rem';
  contadorEl.style.fontSize = '0.875rem';
  container.insertAdjacentElement('afterend', contadorEl);

  let segundosRestantes = 30;

  function atualizarContador() {
    contadorEl.textContent = `Atualizando em: ${segundosRestantes} segundo${segundosRestantes !== 1 ? 's' : ''}...`;
    segundosRestantes--;

    if (segundosRestantes < 0) {
      carregarProdutos();
      segundosRestantes = 30;
    }
  }

  async function carregarProdutos() {
    try {
      const resposta = await fetch(sheetURL + '&cachebust=' + new Date().getTime());
      const texto = await resposta.text();
      const linhas = texto.trim().split('\n').map(l => l.split(','));

      const cabecalhos = linhas[0];
      const dados = linhas.slice(1);
      container.innerHTML = '';

      dados.forEach((linha) => {
        if (linha.length === 0 || linha.every(campo => campo.trim() === '')) return;

        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-lg p-4 border border-pink-200 hover:shadow-xl transition duration-200 mb-4';

        cabecalhos.forEach((cab, i) => {
          if (linha[i]) {
            const p = document.createElement('p');
            p.className = 'text-sm text-gray-700 mb-1';
            p.innerHTML = `<strong>${cab.trim()}:</strong> ${linha[i].trim()}`;
            card.appendChild(p);
          }
        });

        const botao = document.createElement('button');
        botao.textContent = 'COMPRE';
        botao.className = 'mt-3 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition';
        card.appendChild(botao);

        container.appendChild(card);
      });
    } catch (erro) {
      console.error('Erro ao carregar os dados:', erro);
    }
  }

  carregarProdutos();
  atualizarContador();
  setInterval(atualizarContador, 1000);
});
