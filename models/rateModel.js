const Sequelize = require('sequelize');
const sequelize = require('../database/dbConnection');

const Rate = sequelize.define('t_rate_v1', {
    item: {
      type: Sequelize.STRING,
      allowNull: false
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    freezeTableName: true
  });
  
  module.exports = Rate;