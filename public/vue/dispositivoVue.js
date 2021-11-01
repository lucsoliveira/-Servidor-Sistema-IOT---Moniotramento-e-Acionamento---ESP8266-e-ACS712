//Componente MQTT
Vue.component('smart-home-mqtt', {
  props: {
    uid: String,
    usuario: String,
    senha: String
  },
  data: function () {
    return {

      hostMqtt: 'localhost',
      portMqtt: 21500,
      userMqtt: 'userBrowser',
      passMqtt: 'passBrowser',
      loading: false,
      error: false,
      device: [],

      pubRoute: '',
      subRoute: '',

      online: 0,

      lastCollect: 0,
      powerLastCollect: 0,

      checkLigaDispositivo: [],


    }
  },

  mounted() {

    this.loading = true;
    this.verificaUltimoAcionamento();
    this.getDispositivo()

  },

  created() {

  },

  methods: {

    //Verifica o ultimo tipo de acionamento
    verificaUltimoAcionamento: function () {

      //aciona o get time-line


      let vm = this;

      axios.get('/api/acionamentos/' + vm.uid + '/hoje').then(function (response) {

        if (response.data) {

          if (response.data.acionamentos[0].comando == 1) {

            vm.checkLigaDispositivo = ["ligaDispositivo"]

          } else {

            vm.checkLigaDispositivo = []
          }

        }
      })
        .catch(function (error) {
          // handle error
          // vm.error = true;
        })
        .then(function () {

        });



    },

    /* Para o MQTT */

    configMqtt: function () {

      console.log('entrou aqui')

      var vm = this;

      var mqtt;
      var reconnectTimeout = 2000;

      var subRoute = vm.uid + "/corrente";


      function onConnect() {
        // Once a connection has been made, make a subscription and send a message.

        console.log("Connected ");

        mqtt.subscribe(subRoute);
        //message = new Paho.MQTT.Message("Hello World");
        // message.destinationName = subRoute;
        // mqtt.send(message);

      }

      function doFail(e) {
        console.log(e);
      }
      function onConnectionLost(responseObject) {

        vm.online = 0;

        if (responseObject.errorCode !== 0) {
          console.log("onConnectionLost:" + responseObject.errorMessage);
        }
      }
      function onMessageArrived(message) {

        vm.online = 1;

        //let objAux = message.payloadString;
        //console.log(message.payloadString)

        vm.lastCollect = Number(JSON.parse(message.payloadString).corrente).toFixed(2);
        vm.powerLastCollect = (vm.lastCollect * 127).toFixed(2);

        //console.log(objAux)

      }
      function MQTTconnect() {

        mqtt = new Paho.MQTT.Client(vm.hostMqtt, vm.portMqtt, 'clienteBrowser');
        mqtt.onConnectionLost = onConnectionLost;
        mqtt.onMessageArrived = onMessageArrived;

        var options = {
          timeout: 3,
          onSuccess: onConnect,
          onFailure: doFail,
          userName: 'clienteBrowser',
          password: 'senhaBrowser',
        };
        mqtt.connect(options); //connect

      }

      MQTTconnect();


    },

    gravaComandoDB: function (comando) {
      // Make a request for a user with a given ID
      let vm = this;


      axios.put('/api/acionamento/sync', {
        comando: comando,
        sync: 0,
        dispositivoUid: vm.uid
      })
        .then(function (response) {
          // console.log(response);
        })
        .catch(function (error) {
          //console.log(error);
        });

    },

    pubLigaDevice: function () {

      let vm = this;
      let clienteId = this.deviceUid + '_' + Math.floor(Math.random() * 100) + '_bw';


      if (this.checkLigaDispositivo.length > 0) {

        this.publishMqtt(vm.uid + "/pincmd", "desliga", {
          host: vm.hostMqtt,
          port: vm.portMqtt,
          clientId: 'clientBrowser',
          username: vm.userMqtt,
          password: vm.passMqtt
        })

        //grava o comando no banco de dados
        this.gravaComandoDB(0)

      } else {

        this.publishMqtt(vm.uid + "/pincmd", "liga", {
          host: vm.hostMqtt,
          port: vm.portMqtt,
          clientId: 'clientBrowser',
          username: vm.userMqtt,
          password: vm.passMqtt
        })


        //grava o comando no banco de dados
        this.gravaComandoDB(1)

      }


    },

    publishMqtt: function (topic, msg, config) {

      var vm = this;

      var mqtt;


      function onConnect() {

        //ao conectar enviará o comando passado pela função
        message = new Paho.MQTT.Message(msg);
        message.destinationName = topic;
        mqtt.send(message);

      }

      function doFail(e) {

      }
      function onConnectionLost(responseObject) {


      }
      function MQTTconnect() {


        mqtt = new Paho.MQTT.Client(config.host, config.port, config.clientId);
        mqtt.onConnectionLost = onConnectionLost;
        // mqtt.onMessageArrived = onMessageArrived;

        var options = {
          timeout: 3,
          onSuccess: onConnect,
          onFailure: doFail,
          userName: config.username,
          password: config.password,
        };
        mqtt.connect(options);

      }

      MQTTconnect();
    },
    /* fim mqtt */

    getDispositivo: function () {
      // Make a request for a user with a given ID
      let vm = this;

      axios.get('/api/dispositivo/?uid=' + vm.uid)
        .then(function (response) {
          // handle success

          vm.device = response.data.dispositivo;

          vm.pubRoute = vm.device.uid + '/pub'
          vm.subRoute = vm.device.uid + '/corrente/sub'

          console.log('entrou no timeout')

          vm.configMqtt();

          vm.loading = false;

        })
        .catch(function (error) {
          // handle error
          console.log(error)
          vm.error = true;
        })
        .then(function () {
          // always executed
        });

    }

  }

  ,

  template:
    `
      <div v-if="!error">
      <!-- Widget: user widget style 1 -->
      <div class="box box-widget widget-user-2">

         <loading v-if="loading"></loading>


         <div class="box-tools pull-right" style="margin-top:10px;">
         
         <div class="ui middle aligned divided list">
            <div class="item">
              <div class="right floated content">

                 <div class="ui tiny ten statistics">
            <div class="statistic" style="margin:10px;">
              <div class="value">
                {{ lastCollect }}
              </div>
              <div class="label">
                A
              </div>
            </div>
            
            <div class="statistic" style="margin:10px;">
              <div class="value">
                {{ powerLastCollect }}
              </div>
              <div class="label">
                W
              </div>
            </div>

            <div class="statistic">           
            
            <label class="switch" style="margin:10px">
            <input v-on:click="pubLigaDevice" name="ligaDispositivo"  value="ligaDispositivo" v-model="checkLigaDispositivo" type="checkbox">
            <span class="slider round"></span>
             </label>
            </div>
            
                </div>
              </div>

              <div class="content">
              

              <div class="ui tiny horizontal statistic">
              <div class="value">
              {{ device.nome }}
              </div>
              <div class="label">
              {{ device.uid }}
              </div>
            </div>
              </div>
            </div>

            <a style="padding:5px; color:red;" v-if="online == 0">Offline</a>
            <a style="padding:5px; color:green;" v-if="online == 1">Online</a>
           
          </div>

         </div>
         <!-- uma cor legal é a bg-navy, acrescenter após a classe abaixo -->

      </div>

      <script type="application/javascript" src="https://unpkg.com/mqtt/dist/mqtt.min.js"></script>

   </div>

   <div class="col-md-12"  v-else>
      <message class="alert-warning" title="Dispositivo não encontrado" desc="O dispositivo com o numero de série informado não foi encontrado. Tente novamente mais tarde ou cadastre um novo dispositivo. Se os problemas persistirem, entre em contato com a equipe em Suporte."></message>
   </div>
   <!-- /.widget-user -->    `,
})
//Tabela onde listará todos os dispositivos cadastrados
Vue.component('dispositivos-listar', {

  template:
    `
      <!-- Devices List -->
    <section class="content">
    <div class="row">
  
  
    <div class="col-xs-12">
    <div class="box">
    <loading v-if="loading" />
    <div class="box-header">
    <h3 class="box-title">Meus Dispositivos</h3>
  
    <div class="box-tools pull-right">
  
    <!--
    <a href="/dashboard/device/add">
      <button class="ui green compact labeled icon button">
      <i class="add icon"></i>
      Adicionar Dispositivo
    </button>
    </a>
  -->
    </div>
  
    </div>
    <!-- /.box-header -->
    <div class="box-body" v-if="items.length" >

    <table class="ui sortable table table-bordered table-hover" id="tableDevices">
    <thead>
    <tr>
    <th class="sorted ascending">Número de Série</th>
    <th>Identificação</th>
    <th>Ações</th>
    </tr>
    </thead>
    <tbody>
  
    <tr v-for="item in items">
  
    <td>{{ item.uid }}</td>
    <td>{{ item.nome }}</td>

  
    <td>
    
    <center>
  
  <a  :href="'/dashboard/monitorar/' + item.uid">
  <button class="ui compact labeled icon button">
  <i class="chart line icon"></i>
    Controle e Monitoramento
  </button>
  </a>
  
    </center>
  
    </td>
    </tr>
    </tbody>
  
  
    </table>
    </div>
    <div class="box-body"  v-else>
    <message class="alert-info" title="Opss!" desc="Você ainda não cadastrou nenhum dispositivo. Clique no botão acima para cadastrar."></message>
  
    </div>
    <!-- /.box-body -->
    </div>
    <!-- /.box -->
  
    </div>
    <!-- /.col -->
    </div>
    <!-- /.row -->

    </section>
  
    <!-- /end component listDevices .content -->
  
    `,
  data: function () {
    return {
      items: [],
      timeParaComparar: '',
      loading: true
    }
  },

  mounted() {
    this.getDispositivos();
  },

  created() {

  },

  methods: {

    getDispositivos: function () {
      var vm = this;

      axios.get('/api/dispositivo/todos').then(function (response) {

        vm.items = response.data.dispositivos;

      });

    },

    timeSince: function (date) {

      var dateFormated = new Date(date);
      if (typeof date !== 'object') {
        date = new Date(date);
      }

      var seconds = Math.floor((new Date() - dateFormated) / 1000);
      var intervalType;

      var interval = Math.floor(seconds / 31536000);
      if (interval >= 1) {
        intervalType = 'ano';
      } else {
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
          intervalType = 'mes';
        } else {
          interval = Math.floor(seconds / 86400);
          if (interval >= 1) {
            intervalType = 'dia';
          } else {
            interval = Math.floor(seconds / 3600);
            if (interval >= 1) {
              intervalType = "hora";
            } else {
              interval = Math.floor(seconds / 60);
              if (interval >= 1) {
                intervalType = "minuto";
              } else {
                interval = seconds;
                intervalType = "segundo";
              }
            }
          }
        }
      }

      if (interval > 1 || interval === 0) {
        intervalType += 's';
      }

      return interval + ' ' + intervalType;
    },


    diminuirTempo: function () {

      var dataComparacao = app.getTimeNow();

      dataComparacao.setMinutes(dataComparacao.getMinutes() - 5);

      return dataComparacao;
    }

  }

})