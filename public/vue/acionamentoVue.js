//linha do tempo dos acionamentos
Vue.component('timeline-acionamentos', {
  props: {
    uid: String
  },
  data: function () {
    return {

      loading: false,
      error: false,
      device: [],
      pubRoute: '',
      subRoute: '',

      //timeline
      ligarComando: 1,
      desligarComando: 0,
      itensTimeLine: [],
      intervaloAtualizacao: 3000,

    }
  },

  mounted() {

    this.getHistoricoComandos();


  },

  created() {

  },

  methods: {

    formatarData: function (valor) {

      let data = new Date(valor);
      let dataFormatada = (data.getHours() + ":" + ((data.getMinutes())) + ":" + (data.getSeconds()));

      return dataFormatada;
    },

    getHistoricoComandos: function () {

      let vm = this;

      setInterval(function () {

        axios.get('/api/acionamentos/' + vm.uid + '/hoje').then(function (response) {

          if (response.data) {

            vm.itensTimeLine = response.data.acionamentos;
            //console.log(vm.itensTimeLine)

          }
        })
          .catch(function (error) {
            // handle error
            vm.error = true;
          })
          .then(function () {

          });




      }, vm.intervaloAtualizacao);



    },

    getDiaAtual: function () {
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      var today = new Date();
      return today.toLocaleDateString("pt-BR", options);
    }

  }

  ,

  template:
    `
    <div>

        <div class="d-flex justify-content-center mt-70 mb-70">
        <!-- linha do tempo-->
            <h4 style="margin:15px;">{{ getDiaAtual() }}</h4>
                <div class="main-card mb-3 card" style="height:300px;width:auto;overflow:auto;">

                    <div class="card-body">
                   
                    <div class="ui feed">

                    <div class="event" v-for="item in itensTimeLine">


                      <div class="label" v-if="item.comando == ligarComando" >
                      <i class="icon circle" style="color:green;"></i> 
                      </div>
                      
                      <div class="label" v-else>
                      <i class="icon circle" style="color:red;"></i> 
                      </div>


                      <div class="content" v-if="item.comando == ligarComando" >
                        <div class="date">
                        {{ formatarData(item.createdAt) }}
                        </div>
                        <div class="summary">
                        Dispositivo ligado. 
                        <span v-if="item.sync == 1">
                        Sincronizado em <span class="text-success">{{ formatarData(item.updatedAt) }}</span>.
                        </span>
                        </div>
                      </div>

                      
                      <div class="content" v-else>
                        <div class="date">
                        {{ formatarData(item.createdAt) }}
                        </div>
                        <div class="summary">
                        
                        Dispositivo desligado. 
                        <span v-if="item.sync == 1">
                        Sincronizado em <span class="text-success">{{ formatarData(item.updatedAt) }}</span>.
                        </span>
                        </div>
                      </div>


                    </div>


                  <div class="event">
                  <div class="label">
                  <i class="icon circle" style="color:grey;"></i> 
                  </div>
                  <div class="content">
                    <div class="date">
                    Histórico total
                    </div>
                    <div class="summary">
                    Clique <a href="#">aqui</a> para ver o histórico total de comandos.
                    </div>

                 </div>
             </div>
           </div>
          </div>
       </div>
      </div>
      </div>
      `,
})