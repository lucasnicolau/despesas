
const API = 'https://despesas-api.onrender.com';
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

  const texto = document.createElement('span');
  texto.textContent = `${d.descricao} - R$ ${d.valor} [${d.categoria}]`;

  const actions = document.createElement('div');
  actions.classList.add('actions');

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Editar';
  editBtn.classList.add('edit-btn');
  editBtn.onclick = () => editarDespesa(d.id, d.descricao, d.valor, d.categoria);

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Excluir';
  deleteBtn.classList.add('delete-btn');
  deleteBtn.onclick = () => excluirDespesa(d.id);

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(texto);
  li.appendChild(actions);

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