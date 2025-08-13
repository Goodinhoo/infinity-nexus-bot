const { playerController } = require('../../hooks/PlayerController.js');

module.exports = async (client, queue, song) => {
    playerController(client, queue, song)
}