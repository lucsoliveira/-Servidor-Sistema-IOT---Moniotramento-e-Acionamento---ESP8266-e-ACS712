/* Buttons Select groupBy component */
Vue.component('buttons-select-group-by', {
	data: function () {
		return {
			today: true,
			week: false,
			month: false,
			year: false,

		}
	}
	,
	created: function () {

	},

	methods: {

		buttonsStyle: function (today, week, month, year) {
			this.today = today;
			this.week = week;
			this.month = month;
			this.year = year;
		},

		btnClick: function (type) {
			//Type : 1 - Today ; 2 - Month; 3 - Year
			if (type == 1) {
				this.buttonsStyle(true, false, false, false);
				//faz a emissão pro state global

				store.commit('setGroupBy', 'day')

			}
			if (type == 2) {

				store.commit('setGroupBy', 'week')
				this.buttonsStyle(false, true, false, false);
			}
			if (type == 3) {

				store.commit('setGroupBy', 'month')
				this.buttonsStyle(false, false, true, false);
			}
			if (type == 4) {
				store.commit('setGroupBy', 'year')
				this.buttonsStyle(false, false, false, true);
			}
		},
	},

	template: `

	
	<div class="btn-group">
		<button type="button" v-on:click="btnClick(1)" class="btn" :class="{ 'btn-success': today, 'btn-default' : !today  }">Hoje</button>
		<button type="button" v-on:click="btnClick(2)" class="btn" :class="{ 'btn-success': week, 'btn-default' : !week }">Semana</button>
		<button type="button" v-on:click="btnClick(3)" class="btn" :class="{ 'btn-success': month, 'btn-default' : !month }">Mês</button>
		<button type="button" v-on:click="btnClick(4)" class="btn" :class="{ 'btn-success': year, 'btn-default' : !year   }">Ano</button>
  	</div>

	`,


});

/* Loading component */
Vue.component('loading', {

	props: {
		values: Array,
	},
	created: function () {
	}
	,

	template: `
	<div class="overlay">
	  <i class="fa fa-refresh fa-spin"></i>
	</div>
	<!-- end loading -->
	`,


});


Vue.component('message', {

	props: {
		title: String,
		desc: String,
		icon: String
	},

	//Types: danger, info, warning, success

	template: `
	<div class="alert alert-dismissible">
	<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
	<h4><i class="icon fa fa-check"></i>{{ title }}</h4>
	{{ desc }}
	</div>
	`,


});

/* End Message Componentes */
const store = new Vuex.Store({
	state: {

		groupBy: 'day', //value initial
		sector: -1, //value initial
		paramaters: [], //value initial
        
	},
	mutations: {


		setGroupBy(state, groupBy) { state.groupBy = groupBy }, //necessary for Reports
		setSector(state, sector) { state.sector = sector }, //necessary for Reports

		//ncessary for the parameters chart on ViewDevice
		setParameters(state, paramaters) { state.paramaters.push(paramaters); }, //necessary for View Device
		popParameters(state, paramaters) { state.paramaters.pop(); }, //necessary for View Device
		spliceParameters(state, position) {
			state.paramaters.splice(position, 1);
		}, //necessary for View Device


	},

	getters: {
		getGroupBy: state => { return state.groupBy },
		getSector: state => { return state.sector },
		getParameters: state => { return state.paramaters }
	}
})

var app = new Vue({
	el: '#app',

	store: store,


	methods: {

		//função para pegar o horário atual
		getTimeNow: function () {
			var currentDate = new Date();
			return currentDate;
		}

	}
})