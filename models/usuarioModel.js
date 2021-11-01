module.exports = function (Sequelize) {

    global.Usuario = sequelize.define('usuario', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        senha: {
            type: Sequelize.STRING
        }
    });

}