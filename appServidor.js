/*
    Projeto: TCC - Smart Home
    Nome: Arquivo Node.JS referente à aplicação Dashboard
    Autor: Lucas de Oliveira Pereira
    Descrição: código fonte da aplicação web referente ao painel de controle elaborado para o trabalho de 
    conclusão de curso para o curso de Engenharia Eletrônica para a Universidade Tecnológica Federal do Paraná
    Campus Campo Mourão.

    */

const express = require('express'); //Biblioteca necessária para o roteamento de paginas
const { Sequelize, DataTypes } = require('sequelize'); //Biblioteca necesária para manipulação do banco de dados
const Op = Sequelize.Op;
const bodyParser = require('body-parser');//BIBLIOTECA PARA PASSAR CONTEUDO ENTRE PAGINAS
const axios = require('axios').default; //Biblioteca para facilitar requisições

/* Configurações do roteamento */
const app = express();
const path = require('path');
app.use(express.static('public')); //Pasta onde conterá as bibliotecas JS, CSS e imagens publicas
app.set('view engine', 'ejs'); //Seta o engine das paginas html
app.set('views', path.join(__dirname, '/views'));
const serverURL = 'http://localhost:3000';
const port = 3000;
/* Fim Configurações do roteamento */

app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json());

var configuracaoIniciao = false; //Se for setada esta variavel, o sistema criará as tabelas no banco pela primeira vez

/* Configurações do Banco de Dados */
const sequelizeMySql = new Sequelize('bancodedados', 'usuario', 'senha', {
  host: 'seuservidor.com.br',
  dialect: 'mysql',
  operatorsAliases: false,
  logging: true,
  pool: {
    max: 100,
    min: 0,
    acquire: 60000,
    idle: 10000
  }
});

global.sequelize = sequelizeMySql;

//Importação dos modelos das tabelas
require('./models/usuarioModel')(Sequelize);
require('./models/dispositivoModel')(Sequelize);
require('./models/acionamentoModel')(Sequelize);
require('./models/coletaModel')(Sequelize);

if (configuracaoIniciao) {
  (async () => {
    await sequelize.sync({ force: true });
  })();
}

/* Fim Configurações do Banco de Dados */


/* Rotas de Navegação da aplicação */

//home
app.get('/', (req, res) => {

  res.render('index');
});

//inicio - dashboard
app.get('/dashboard', (req, res) => {

  res.render('dashboard');

});

//estatisticas - dashboard
app.get('/dashboard/estatisticas', (req, res) => {

  res.render('dashboard');

});

//monitorar - dashboard
app.get('/dashboard/monitorar/:uid', (req, res) => {

  var parametroUid = req.params.uid;
  res.render('monitoramento', {
    uid: parametroUid
  });

});


/* Fim Rotas de Navegação da aplicação */

/* APIs REST da Aplicação */

//funções gerais da API
function obterDispositivo(uid) {

  let response = axios.get(serverURL + '/api/dispositivo?uid=' + uid)
    .then((response) => response.data)
    .catch(function (e) {
      console.log(e);

    });;

  return response
}

//API - Dispositivo
// Dispositivo: por UID
app.get('/api/dispositivo', function (req, res) {

  if (!req.query.uid || req.query.uid == 'undefined') {

    res.status(404).send();

  } else {
    Dispositivo.findOne({
      where: {
        uid: req.query.uid
      }
    }
    ).then(dispositivo => {

      if (!dispositivo) {

        res.status(404).send();

      } else {

        res.send({
          dispositivo: dispositivo
        })

      }

    }).catch(err => console.log(err));
  }



});

// Dispositivo: listar todos
app.get('/api/dispositivo/todos', function (req, res) {

  Dispositivo.findAll().then(dispositivos => {

    if (!dispositivos) {

      res.status(404).send();

    } else {


      res.send({
        dispositivos: dispositivos
      })

    }

  });

});

//usuario - get
app.get('/api/usuario', function (req, res) {

  Usuario.findOne({
    where: {
      email: req.query.username,
      senha: req.query.password,
    }
  }
  ).then(usuario => {

    if (!usuario) {

      res.status(404).send();

    } else {

      res.send({
        usuario: usuario
      })

    }

  });

});

//put - acionamento - sync
app.put('/api/acionamento/sync', function (req, res) {

  obterDispositivo(req.body.dispositivoUid)
    .then(data => {

      if (data.dispositivo) {

        //
        Acionamento.create({

          comando: req.body.comando,
          sync: 0,
          idDispositivo: data.dispositivo.id

        }).then(acionamento => {

          if (!acionamento) {

            res.status(400).send();

          } else {

            res.json({ acionamento: acionamento });
          }
        }
        ).catch(function (err) {

          console.log('erro do acionamento sync put');
          console.log(err);

        });

      } else {

        res.status(400).send()

      }

    })



});

//acionamento - post - updateAt
app.post('/api/acionamento/sync', function (req, res, next) {


  obterDispositivo(req.query.dispositivoUid)
    .then(data => {


      if (data.dispositivo) {

        //
        Acionamento.findOne({

          where: {
            idDispositivo: data.dispositivo.id
          },
          order: [
            ['createdAt', 'Desc']
          ]

        }).then(acionamento => {

          if (!acionamento) {

            res.status(400).send();

          } else {

            let dataAtual = new Date();


            Acionamento.update(
              { updatedAt: dataAtual, sync: 1 },
              {
                where: { id: acionamento.id }

              }).then(acionamentoAtualizado => {


                if (!acionamentoAtualizado) {

                  res.status(400).send();

                } else {

                  res.json({ acionamento: acionamentoAtualizado });
                }


              })
              .catch(next)

          }
        }
        ).catch(function (err) {
          console.log(err);
        });

      } else {

        res.status(400).send()

      }

    })




});


//acionamento - listar todos - hoje
app.get('/api/acionamentos/:uid/hoje', function (req, res) {

  obterDispositivo(req.params.uid)
    .then(data => {


      if (data.dispositivo) {

        Acionamento.findAll({
          where: {
            idDispositivo: data.dispositivo.id,
            createdAt: {
              [Op.lt]: new Date(),
              [Op.gt]: new Date().setHours(0, 0, 0, 0)
            }
          },
          order: [

            ['id', 'DESC'],
          ]
        }).then(acionamentos => {

          if (!acionamentos) {

            res.status(404).send();

          } else {


            res.send({
              acionamentos: acionamentos
            })

          }

        });


      } else {

        res.status(400).send()

      }

    })



  //


});

//corrente - PUT
app.put('/api/corrente', function (req, res) {

  obterDispositivo(req.body.uid)
    .then(data => {


      if (data.dispositivo) {

        //
        Coleta.create({

          idDispositivo: data.dispositivo.id,
          corrente: req.body.corrente,
          carga: req.body.carga,

        }).then(corrente => {

          if (!corrente) {

            res.status(400).send();

          } else {

            res.json({ corrente: corrente });
          }
        }
        ).catch(function (err) {
          console.log(err);
        });

      } else {

        res.status(400).send()

      }

    })



  //



});

//Histórico Consumo - Listar - Com Limitação
app.get('/api/historico/:uid/:limit', function (req, res) {

  obterDispositivo(req.params.uid)
    .then(data => {


      if (data.dispositivo) {

        //

        Coleta.findAll({
          where: {
            idDispositivo: data.dispositivo.id,
          },
          order: [
            ['id', 'DESC'],
          ],
          limit: parseInt(req.params.limit)
        }).then(coleta => {

          if (!coleta) {

            res.status(404).send();

          } else {

            res.send({
              coleta: coleta
            })

          }

        });

      } else {

        res.status(400).send()

      }

    })



  //




});

//Histórico Consumo - Acumulado de Corrente
app.get('/api/historico/acumulado', function (req, res) {

  let segundosColeta = 2; //intervalo de cada coleta
  let valorTensao;

  if (req.query.valorTensao) {
    valorTensao = req.query.valorTensao;
  } else {
    valorTensao = 127;
  }

  obterDispositivo(req.query.uid)
    .then(data => {


      if (data.dispositivo) {

        //
        //necessário para obter o intervalo de um mes

        let date = new Date();

        let primeiroDia =
          new Date(date.getFullYear(), date.getMonth(), 1);

        let ultimoDia =
          new Date(date.getFullYear(), date.getMonth() + 1, 0);



        Coleta.findAll({
          attributes: [[
            sequelize.fn('DAY', sequelize.col('createdAt')), 'day'],
          [sequelize.fn('count', sequelize.col('corrente')), 'count'],
          [sequelize.fn('sum', sequelize.col('corrente')), 'sum'],
          [sequelize.fn('min', sequelize.col('corrente')), 'min'],
          [sequelize.fn('max', sequelize.col('corrente')), 'max'],
          [sequelize.fn('avg', sequelize.col('corrente')), 'avg'],
          [sequelize.fn('avg', sequelize.col('carga')), 'mediaCarga'],
          [sequelize.fn('avg', sequelize.col('corrente')), 'mediaCorrente'],
          ],
          where: {
            idDispositivo: data.dispositivo.id,
            corrente: {
              [Op.gt]: 0
            }
            //createdAt: { [Op.between]: [primeiroDia, ultimoDia] }
          },
          group: [sequelize.literal(`DATE("createdAt")`), "day"],
        }).then(acumuladoCorrente => {

          if (!acumuladoCorrente) {

            res.status(404).send();

          } else {

            res.send({
              acumuladoCorrente: acumuladoCorrente
            })

          }

        });

      } else {

        res.status(400).send()

      }

    })






  //




});

//Histórico Consumo - Listar - Com Limitação
app.get('/api/historico/:uid/acumulado/periodo', function (req, res) {

  obterDispositivo(req.params.uid)
    .then(data => {

      if (data.dispositivo) {

        //
        Coleta.findAll({
          where: {
            idDispositivo: data.dispositivo.id,
          },
          order: [
            ['id', 'ASC'],
          ]
        }).then(coleta => {

          if (!coleta) {

            res.status(404).send();

          } else {

            //Busca o primeiro e o ultimo para calcular o intervalo de tempo de amostragem

            res.send({
              primeiraColeta: coleta[0].createdAt,
              ultimaColeta: coleta[coleta.length - 1].createdAt,
            })

          }

        });

      } else {

        res.status(400).send()

      }

    })






  //

  //

});



/* Fim APIs REST da Aplicação */

app.listen(port, () => {
  console.log(`Aplicação rodando em: http://localhost:${port}`)
})