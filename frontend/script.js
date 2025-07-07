
const API = 'http://localhost:3000/expenses';
const form = document.getElementById('expense-form');
const lista = document.getElementById('lista-despesas');
const filtro = document.getElementById('filtro-categoria');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const valor = document.getElementById('valor').value;
  const descricao = document.getElementById('descricao').value;
  const categoria = document.getElementById('categoria').value;

  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ valor, descricao, categoria })
  });

  form.reset();
  carregarDespesas();
});

filtro.addEventListener('change', () => {
  carregarDespesas(filtro.value);
});

async function carregarDespesas(categoria = '') {
  const res = await fetch(categoria ? `${API}?category=${categoria}` : API);
  const despesas = await res.json();
  lista.innerHTML = '';
  despesas.forEach(d => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${d.descricao} - R$ ${d.valor} [${d.categoria}]
      <button onclick="editarDespesa(${d.id}, '${d.descricao}', ${d.valor}, '${d.categoria}')">Editar</button>
      <button onclick="excluirDespesa(${d.id})">Excluir</button>
    `;
    lista.appendChild(li);
  });
}

async function excluirDespesa(id) {
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  carregarDespesas(filtro.value);
}

async function editarDespesa(id, descricao, valor, categoriaAtual) {
  const novaDescricao = prompt('Nova descrição:', descricao);
  const novoValor = prompt('Novo valor:', valor);

  if (!novaDescricao || !novoValor) return;

  const categorias = ['Alimentação', 'Transporte', 'Lazer', 'Contas'];
  const novaCategoria = prompt(
    `Categoria (atual: ${categoriaAtual})\nEscolha uma das opções: ${categorias.join(', ')}`,
    categoriaAtual
  );

  if (!categorias.includes(novaCategoria)) {
    alert('Categoria inválida. Escolha uma das opções listadas.');
    return;
  }

  await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      descricao: novaDescricao,
      valor: novoValor,
      categoria: novaCategoria
    })
  });

  carregarDespesas(filtro.value);
}

carregarDespesas();