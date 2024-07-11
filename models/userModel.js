const Sequelize = require('sequelize');
const sequelize = require('../database/dbConnection');

const User = sequelize.define('t_user_v1', {
    username: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    firstname: {
      type: Sequelize.STRING,
    },
    lastname: {
      type: Sequelize.STRING,
    }
  },
  {
    freezeTableName: true
  });
  
  module.exports = User;