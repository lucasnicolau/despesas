
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/expenses', (req, res) => {
  const { category } = req.query;
  const query = category
    ? 'SELECT * FROM despesas WHERE categoria = ?'
    : 'SELECT * FROM despesas';
  const params = category ? [category] : [];
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/expenses', (req, res) => {
  const { valor, descricao, categoria } = req.body;
  const query = 'INSERT INTO despesas (valor, descricao, categoria) VALUES (?, ?, ?)';
  db.run(query, [valor, descricao, categoria], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

app.put('/expenses/:id', (req, res) => {
  const { id } = req.params;
  const { valor, descricao, categoria } = req.body;
  const query = 'UPDATE despesas SET valor = ?, descricao = ?, categoria = ? WHERE id = ?';
  db.run(query, [valor, descricao, categoria, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

app.delete('/expenses/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM despesas WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
