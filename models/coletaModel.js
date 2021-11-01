module.exports = function (Sequelize) {

  global.Coleta = sequelize.define('coleta', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    idDispositivo: {
      type: Sequelize.INTEGER,
    },
    corrente: Sequelize.FLOAT,
    carga: Sequelize.FLOAT,
  });

}