'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('chatmessages', 'chat_messages');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('chat_messages', 'chatmessages');
  }
};