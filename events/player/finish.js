const { playerController } = require('../../hooks/PlayerController.js');

module.exports = async (client, queue) => {
    playerController(client, queue)
}
