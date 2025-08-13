const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 2158;

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(cors({
  origin: 'https://schultz-family-tree.netlify.app'
}));

// Tratar todas as requisições OPTIONS antes das rotas
app.options('*', cors({
  origin: 'https://schultz-family-tree.netlify.app'
}), (req, res) => {
  console.log('Recebido OPTIONS (preflight) para:', req.originalUrl);
  res.sendStatus(204);
});

app.use(express.json({limit: '2mb'}));

app.post('/api/salvar-pessoa', (req, res) => {
  let pessoa = req.body;
  if (!pessoa || !pessoa.nome) {
    return res.status(400).json({erro: 'Nome é obrigatório'});
  }
  // Remove campos vazios (string, array ou objeto vazio)
  function limpar(obj) {
    if (Array.isArray(obj)) {
      return obj.filter(item => {
        if (typeof item === 'object' && item !== null) return Object.keys(limpar(item)).length > 0;
        if (typeof item === 'string') return item.trim() !== '';
        return !!item;
      }).map(item => (typeof item === 'object' && item !== null ? limpar(item) : item));
    } else if (typeof obj === 'object' && obj !== null) {
      const novo = {};
      for (const k in obj) {
        const v = limpar(obj[k]);
        if (
          (typeof v === 'string' && v.trim() !== '') ||
          (Array.isArray(v) && v.length > 0) ||
          (typeof v === 'object' && v !== null && Object.keys(v).length > 0) ||
          (typeof v === 'number' && !isNaN(v)) ||
          (typeof v === 'boolean')
        ) {
          novo[k] = v;
        }
      }
      return novo;
    }
    return obj;
  }
  // Mapeia o objeto do formulário para o formato do family-data.js
  function mapearParaFamilyData(pessoa) {
    const out = {};
    // Campos diretos
    const camposDiretos = [
      'nome', 'singleName', 'born', 'death', 'hometown', 'photo', 'spouse', 'conjuge', 'education', 'religion', 'phone', 'email', 'height', 'weight', 'grave', 'description', 'fathers', 'children', 'profession', 'nicknames', 'hobbies', 'events', 'homes', 'documents', 'quotes', 'exSpouses'
    ];
    camposDiretos.forEach(c => {
      if (pessoa[c] !== undefined) out[c] = pessoa[c];
    });
    // Pai e mãe como fathers (array)
    if (pessoa.pai || pessoa.mae) {
      out.fathers = [];
      if (pessoa.pai) out.fathers.push(pessoa.pai);
      if (pessoa.mae) out.fathers.push(pessoa.mae);
    }
    // Apelidos
    if (pessoa['apelido[]']) out.nicknames = Array.isArray(pessoa['apelido[]']) ? pessoa['apelido[]'] : [pessoa['apelido[]']];
    // Profissões
    if (pessoa['profissao[]']) out.profession = Array.isArray(pessoa['profissao[]']) ? pessoa['profissao[]'] : [pessoa['profissao[]']];
    // Hobbies
    if (pessoa['hobby[]']) out.hobbies = Array.isArray(pessoa['hobby[]']) ? pessoa['hobby[]'] : [pessoa['hobby[]']];
    // Ex-cônjuges
    if (pessoa['exconjuge_nome[]']) out.exSpouses = Array.isArray(pessoa['exconjuge_nome[]']) ? pessoa['exconjuge_nome[]'] : [pessoa['exconjuge_nome[]']];
    // Children
    if (pessoa.children && Array.isArray(pessoa.children) && pessoa.children.length > 0) {
      out.children = pessoa.children.map(f => f.nome).filter(Boolean);
    } else if (pessoa['filho_nome[]']) {
      out.children = Array.isArray(pessoa['filho_nome[]']) ? pessoa['filho_nome[]'] : [pessoa['filho_nome[]']];
    }
    // Siblings
    if (pessoa.siblings && Array.isArray(pessoa.siblings) && pessoa.siblings.length > 0) {
      out.siblings = pessoa.siblings.map(f => f.nome).filter(Boolean);
    } else if (pessoa['irmao_nome[]']) {
      out.siblings = Array.isArray(pessoa['irmao_nome[]']) ? pessoa['irmao_nome[]'] : [pessoa['irmao_nome[]']];
    }
    // Eventos
    if (pessoa.events && Array.isArray(pessoa.events) && pessoa.events.length > 0) {
      out.events = pessoa.events.map(e => e.descricao ? (e.data ? `${e.descricao} em ${e.data}` : e.descricao) : null).filter(Boolean);
    } else if (pessoa['evento_desc[]']) {
      const descs = Array.isArray(pessoa['evento_desc[]']) ? pessoa['evento_desc[]'] : [pessoa['evento_desc[]']];
      const datas = Array.isArray(pessoa['evento_data[]']) ? pessoa['evento_data[]'] : [pessoa['evento_data[]']];
      out.events = descs.map((d, i) => d ? (datas[i] ? `${d} em ${datas[i]}` : d) : null).filter(Boolean);
    }
    // Moradias
    if (pessoa.homes && Array.isArray(pessoa.homes) && pessoa.homes.length > 0) {
      out.homes = pessoa.homes.map(m => m.descricao ? (m.link ? `${m.descricao}: ${m.link}` : m.descricao) : null).filter(Boolean);
    } else if (pessoa['moradia_desc[]']) {
      const descs = Array.isArray(pessoa['moradia_desc[]']) ? pessoa['moradia_desc[]'] : [pessoa['moradia_desc[]']];
      const links = Array.isArray(pessoa['moradia_link[]']) ? pessoa['moradia_link[]'] : [pessoa['moradia_link[]']];
      out.homes = descs.map((d, i) => d ? (links[i] ? `${d}: ${links[i]}` : d) : null).filter(Boolean);
    }
    // Quotes
    if (pessoa['quotes']) out.quotes = Array.isArray(pessoa['quotes']) ? pessoa['quotes'] : [pessoa['quotes']];
    // Documents
    if (pessoa['documents']) out.documents = Array.isArray(pessoa['documents']) ? pessoa['documents'] : [pessoa['documents']];
    // Limpa campos vazios
    return limpar(out);
  }
  pessoa = mapearParaFamilyData(pessoa);
  // Gera nome de arquivo seguro
  const nomeBase = pessoa.nome.replace(/[^a-zA-Z0-9-_]/g, '_').substring(0, 30);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `${nomeBase}_${timestamp}.json`;
  const dir = path.join(__dirname);
  const filePath = path.join(dir, fileName);
  fs.writeFile(filePath, JSON.stringify(pessoa, null, 2), (err) => {
    if (err) {
      return res.status(500).json({erro: 'Erro ao salvar arquivo'});
    }
    res.json({ok: true, arquivo: fileName});
  });
});

app.listen(2158, () => console.log('Bot ouvindo na porta 2158'));