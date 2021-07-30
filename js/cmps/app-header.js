import searchBar from './search-bar.js'
import appNav from './app-nav.js'

export default {
    template: `
        <header class="app-header">
            <div class="container">

                <router-link
                to="/"
                >
                    <div title="Home" class="logo">
                        <img src="img/logo.gif" alt="no img">
                    </div>
                </router-link>

                <search-bar
                class="search-bar"
                />
                
                <app-nav />
            </div>
        </header>
    `,
    components: {
        searchBar,
        appNav,
    },
}
