const { lojaSquare } = require('../config/config');
const axios = require('axios');

var Produtos;

async function getProducts () {
    if (Produtos) return Produtos;
    
    // Fazendo uma solicitação GET com o token de autorização
    await axios.get(lojaSquare.api + '/produtos', {
        headers: {
            'Authorization': `${lojaSquare.token}`,
        }
    })
        .then(function (response) {
            Produtos = response.data;
            return Produtos;
        })
        .catch(function (error) {
            // Manipular erros aqui
            console.error('Erro ao fazer a solicitação GET:', error);
        });
}

getProducts();

module.exports = { getProducts };