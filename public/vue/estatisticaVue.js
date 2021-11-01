//Histórico de consumo dos dados armazenados no banco
Vue.component('estatistica-de-consumo', {
  props: {
    uid: String
  },
  data: function () {
    return {

      loading: false,
      error: false,
      device: [],

      valorTarifa: 0.42991, //https://www.copel.com/hpcweb/copel-distribuicao/taxas-tarifas/?menu4 Acesso em: 29/10/2021
      valorTensao: 127,
      dispositivo: [],
      acumuladoCorrente: 0,
      acumuladoPotencia: 0,
      diferencaEmHoras: 0,

      casasDecimais: 4

    }
  },

  mounted() {

    this.getDispositivo();
    setInterval(() => this.calcularEstatisticas(), 2000);

  },

  created() {

  },

  methods: {

    calcularEstatisticas: function () {

      this.obterAcumuladoCorrente();
      this.obterPeriodoAmostragem();

    },

    formatarData: function (valor) {

      let data = new Date(valor);
      let dataFormatada = data.getUTCDay() + '/' + data.getUTCMonth() + '/' + data.getUTCFullYear() + ' - ' +
        (data.getUTCHours() + ":" + ((data.getUTCMinutes())) + ":" + (data.getUTCSeconds()));

      return dataFormatada;
    },


    getDiaAtual: function () {
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      var today = new Date();
      return today.toLocaleDateString("pt-BR", options);
    },

    obterPeriodoAmostragem: function () {

      let vm = this;

      axios.get('/api/historico/' + vm.uid + '/acumulado/periodo')
        .then(function (response) {
          // handle success

          //console.log(response)
          vm.loading = false;

          vm.diferencaEmHoras = vm.calculaDiferenca(response.data.primeiraColeta, response.data.ultimaColeta)

        })
        .catch(function (error) {
          // handle error

          console.log(error)
          vm.error = true;
        })
        .then(function () {
          // always executed
        });

    },

    calculaDiferenca(d1, d2) {

      let dateOneObj = new Date(d1);
      let dateTwoObj = new Date(d2);
      let milliseconds = Math.abs(dateTwoObj - dateOneObj);

      let hours = milliseconds / 36e5;

      return hours;

    },

    obterAcumuladoCorrente: function () {

      let vm = this;

      axios.get('/api/historico/acumulado/?uid=' + vm.uid + '&valorTensao=' + this.valorTensao)
        .then(function (response) {

          vm.acumuladoCorrente = response.data.acumuladoCorrente;


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

    },

    getCustoConsumo: function (carga, corrente, segundos, tarifa) {

      let tensaoMedia = carga * corrente;
      let potenciaMedia = tensaoMedia * corrente;

      let potenciaKW = potenciaMedia / 1000;


      let potenciaKWh = potenciaKW * (segundos / 3600);

      let custo = potenciaKWh * tarifa;

      return custo;


    },

    formatahhmmss: function (s) {
      return new Date(s * 1000).toISOString().substr(11, 8);
    },


    getDispositivo: function () {
      // Make a request for a user with a given ID
      let vm = this;

      axios.get('/api/dispositivo/?uid=' + vm.uid)
        .then(function (response) {
          // handle success

          vm.dispositivo = response.data.dispositivo;


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

    },


  }

  ,

  template:
    `
    <div>

      <div class="ui form">
      <center>

      <div class="inline field">
        <label>Tarifa por kWh (R$): </label>
        <input type="text" placeholder="Valor numérico" v-model="valorTarifa">
      </div>

      <!--
      <div class="inline field">
      <label>Tensão Média da Rede (V): </label>
      <input type="hidden" placeholder="Valor numérico" v-model="valorTensao">
     </div>
-->

     <div style="margin:20px;">
       <button class="ui primary button" v-on:click="calcularEstatisticas()">
       <i class="icon redo alternate"></i>
       Atualizar Estatísticas
       </button>
     </div>

      </center>
      </div>

      <table class="ui celled table">
  <thead>
    <tr><th>Dia</th>
    <th>Corrente Média (A)</th>
    <th>Carga Média (Ω)</th>
    <th>Tensão Média (V)</th>
    <th>Potência Instantânea Média (W)</th>
    <th>Tempo Ligado</th>
    <th>Estimativa de Custo (R$)</th>
  </tr></thead>
  <tbody>

    <tr v-for="item in acumuladoCorrente">
      <td data-label="dia">{{ item.day }}</td>
      <td data-label="acumulado">{{ (item.mediaCorrente).toFixed(casasDecimais) }}</td>
      <td data-label="">{{ (item.mediaCarga).toFixed(casasDecimais) }}</td>
      <td data-label="">{{ (item.mediaCarga * item.mediaCorrente).toFixed(2) }}</td>
      <td data-label="">{{ ( (item.mediaCarga * item.mediaCorrente) * item.mediaCorrente ).toFixed(2) }}</td>
      
      <td data-label="custoDia">{{ formatahhmmss(item.count) }}</td>

      <td data-label="">{{ getCustoConsumo(item.mediaCarga, item.mediaCorrente, item.count, valorTarifa).toFixed(4) }}</td>
      
    </tr>

  </tbody>
</table>

    </div>
      `,
})

//Histórico de consumo dos dados armazenados no banco
Vue.component('historico-consumo', {
  props: {
    uid: String
  },
  data: function () {
    return {

      loading: false,
      error: false,
      device: [],

      coletas: [],
      limit: 1000, //limite de coletas a serem mostradas na tabela,
      valorTensao: 127

    }
  },

  mounted() {

    this.getHistoricoConsumo();
  },

  created() {

  },

  methods: {

    formatarData: function (valor) {

      //console.log("entrou aqui")

      let data = new Date(valor);

      return data.toLocaleString();
    },

    getHistoricoConsumo: function () {


      let vm = this;


      axios.get('/api/historico/' + vm.uid + '/' + vm.limit).then(function (response) {


        if (response.data) {


          vm.coletas = response.data.coleta;

        }

      })
        .catch(function (error) {
          // handle error
          vm.error = true;
        })
        .then(function () {

        });


    },


    atualizarTabela: function () {

      this.getHistoricoConsumo();
      $('#tabela-historico').DataTable(); //referente a tabela de histórico de consumo

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

    <div style="margin:20px;">

    <center>

   
    <div class="ui form">
    <div class="inline field">
    <input type="hidden" placeholder="Valor numérico" v-model="valorTensao">


   </div>

      <button class="ui primary button" v-on:click="atualizarTabela()">
      <i class="icon redo alternate"></i>
      Atualizar Tabela
      </button>
    </div>
    </center>

    </div>

    <table id="tabela-historico" class="ui striped table" style="width:100%">
        <thead>
            <tr>
                <th>Data</th>
                <th>Corrente (A)</th>
                <th>Carga (Ω)</th>
                <th>Potência (W)</th>
            </tr>
        </thead>

        <tbody>

            <tr v-for="item in coletas">
                <td>{{ formatarData(item.createdAt) }}</td>
                <td>{{ (item.corrente).toFixed(3) }}</td>
                <td>{{ (item.carga).toFixed(3) }}</td>
                <td>{{ (item.corrente * valorTensao).toFixed(3) }}</td>
            </tr>

        </tbody>

        <tfoot>
            <tr>
            <th>Data</th>
            <th>Corrente (A)</th>
            <th>Carga (Ω)</th>
            <th>Potência (W)</th>
            </tr>
        </tfoot>

    </table>

    <script type="application/javascript">
    $(document).ready(function () {
      setTimeout(function(){ 
        
        $('#tabela-historico').DataTable(); //referente a tabela de histórico de consumo
        
       }, 3000);

    
    });
    </script>
      </div>
      `,
})