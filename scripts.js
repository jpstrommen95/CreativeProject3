window.Vue.component("poke-info", {
    props: ['info'],

    template: `
    <article class="message is-primary">

        <div class="message-header">
            <p class="title is-4">{{ info.name }}</p>
            <!-- <button class="delete" aria-label="delete"></button> -->
        </div>

        <div class="message-body">
            <figure class="image is-96x96">
                <img :src="info.sprites.front_default">
            </figure>
            
            
            <p class="subtitle">Types:</p>
            <ul class="tags">
                <li class="tag is-info" v-for="types in info.types">{{ types.type.name }}</li>
            </ul>
            
            <p class="subtitle">Moves:</p>
            <ul class="tags">
                <li class="tag is-info" v-for="moves in info.moves">{{ moves.move.name }}</li>
            </ul>
            
            <p class="subtitle">Stats:</p>
            <ul class="tags">
                <li class="tag is-info" v-for="stats in info.stats">
                    {{ stats.stat.name }}: {{ stats.base_stat }}
                </li>
            </ul>
            
        </div>

    </article>
    `,


});

window.Vue.component("page-nav", {

    template: `
    <nav class="pagination" role="navigation" aria-label="pagination">
      <a class="pagination-previous">Previous</a>
      <a class="pagination-next" @click="this.$root.getPokePage(this.$root.nextURL)">Next page</a>
      <ul class="pagination-list">
        <li>
          <a class="pagination-link is-current" aria-label="Goto page 1">1</a>
        </li>
        <li>
          <a class="pagination-link" aria-label="Goto page 2">2</a>
        </li>
        <li>
          <a class="pagination-link" aria-label="Goto page 3">3</a>
        </li>
        <li>
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li>
          <a class="pagination-link" aria-label="Goto page 45">45</a>
        </li>
        <li>
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li>
          <a class="pagination-link" aria-label="Goto page 86">86</a>
        </li>
      </ul>
    </nav>
    `,
});

window.Vue.component("poke-page", {
    props: ['detail-list'],

    template: `
    <div>
        <page-nav></page-nav>
        <br>
        <poke-info v-for="poke in detailList" :info="poke" :key="poke.name"></poke-info>
    </div>
    `,

});

let app = new window.Vue({

    el: "#root",

    data: {

        totalPokemon: 0,
        pokemonPerPage: 6,

        loading: false,

        currPage: 0,
        nextURL: "",

        pokelist: [],
        detailList: [],

    },

    computed: {

    },

    watch: {

    },

    created() {
        this.getPokePage("https://pokeapi.co/api/v2/pokemon?offset=0&limit=" + this.pokemonPerPage);
    },

    methods: {

        async getPokePage(URL) {
            try {
                this.loading = true;
                // const response = await window.axios.get('https://pokeapi.co/api/v2/pokemon');
                window.axios.get(URL)
                    .then(response => {
                        // If request is good...
                        console.log(response.data);
                        this.totalPokemon = response.data.count;
                        this.pokelist = response.data.results;
                        this.nextURL = response.data.next;
                        this.getPokeDetails();
                        this.loading = false;
                    })
                    .catch((error) => {
                        console.log('GetPage error is ' + error);
                    });

            }
            catch (error) {
                console.log('GetPage error is ' + error);
            }
        },

        getPokeDetails() {
            console.log("Entered getPokeDetails()");
            this.detailList = [];
            this.pokelist.forEach(pokemon => {
                console.log(pokemon.url);
                window.axios.get(pokemon.url)
                    .then(response => {
                        console.log(response.data);
                        this.detailList.push(response.data);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
        },


    },

});
