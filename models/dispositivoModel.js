module.exports = function (Sequelize) {

  global.Dispositivo = sequelize.define('dispositivo', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    idUsuario: {
      type: Sequelize.INTEGER
    },
    uid: {
      type: Sequelize.STRING,
      unique: true,
    },
    nome: Sequelize.STRING,
    ultimaColeta: Sequelize.DATE,
  });


}