const { playerController } = require('../../hooks/PlayerController.js');

module.exports = async (client, queue, playlist) => {
    playerController(client, queue)
}
