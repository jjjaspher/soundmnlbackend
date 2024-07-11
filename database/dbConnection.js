const Sequelize = require('sequelize');

// const sequelize = new Sequelize('react_booking', 'root', '' , {
//   host : 'localhost',
//   dialect : 'mysql',
//   logging: false
// })
const sequelize = new Sequelize(process.env.DB_NAME, process.env.MYSQL_USERNAME, process.env.MYSQL_PW , {
  host : process.env.MYSQL_HOST,
  dialect : 'mysql',
  logging: false
})

sequelize.authenticate()
.then(() => {
  console.log('connected')

})
.catch(err => {
  console.log(err)
})

module.exports = sequelize