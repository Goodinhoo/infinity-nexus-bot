const mongoose = require('mongoose');
const config = require('../config/config.js');
const Schema = mongoose.Schema;

mongoose.connect(config.mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(function () {
    console.log('\x1b[32m[ BANCO DE DADOS ] \x1b[0mBanco de dados foi ligado');
}).catch(function (err) {
    console.log('\x1b[31m[ BANCO DE DADOS ] \x1b[0mBanco de dados desligado por erro\n' + err);
});

const Users = new Schema({
    _id: String,
    warns: { type: Array, default: [] },
    mute: { type: Number, default: 0 },
    ban: {
        status: { type: Boolean, default: false },
        date: { type: Date, default: null },
        username: { type: String, default: null },
        reason: { type: String, default: null },
    },
});

const Tickets = new Schema({
    user: { type: String, require: true },
    nickname: { type: String, default: null },
    reason: { type: String },
    closedBy: { type: String },
    claimed: { type: String },
    stars: { type: Number },
    data: { type: Number },
    transcript: { type: String, default: '' },
})

module.exports = {
    Users: mongoose.model('Users', Users),
    Tickets: mongoose.model('Tickets', Tickets),
};

// 1 2 3
/*
Tempo duração:
1: 1 Semana
2: 1 Mês
3: Sim
*/

/*
() Level 1 (Warns 4)
1:
- Apenas um Aviso

2:
- Mute 1 Dia

3:
- Mute 3 Dias

4:
- Mute 7 Dias

5:
- Ban (Permanente)

() Level 2
1: Mute 1 Dia

2: Mute 3 Dias
*/