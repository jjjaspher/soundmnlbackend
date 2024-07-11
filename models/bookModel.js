const Sequelize = require('sequelize');
const sequelize = require('../database/dbConnection');

const Book = sequelize.define('t_book_v1', {
    bookdate: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    time_start: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    time_end: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    ref_code: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    rate_cost: {
        type: Sequelize.INTEGER
    },
    user_id: {
        type: Sequelize.INTEGER,
        references: {
            model: 't_user_v1',
            key: 'id'
        }
    }
  },
  {
    freezeTableName: true
  });
  
  module.exports = Book;
