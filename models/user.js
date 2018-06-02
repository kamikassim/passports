const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://postgres@localhost:5432/passportblog')

const User = sequelize.define('user', {
    username: Sequelize.STRING,
    password: Sequelize.STRING, 
    github_id: Sequelize.STRING,
  });

  User.sync();

  module.exports = User;