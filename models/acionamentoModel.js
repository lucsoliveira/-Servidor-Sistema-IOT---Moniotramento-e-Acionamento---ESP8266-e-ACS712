module.exports = function (Sequelize) {

  global.Acionamento = sequelize.define('acionamento', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    idDispositivo: {
      type: Sequelize.INTEGER,
    },
    comando: Sequelize.INTEGER,
    sync: Sequelize.INTEGER,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  });

}