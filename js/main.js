import { router } from './router.js'
import appHeader from './cmps/app-header.js'
import userMsg from './cmps/user-msg.js';

const options = {
    el: '#app',
    router,
    template: `
        <main>
            <app-header :class="headerClass"/>
            <user-msg/>
            <router-view />
        </main>
    `,
    computed: {
        headerClass() {
            if (this.$route.path === "/")
                return 'app-header-home'
        }
    },
    components: {
        appHeader,
        userMsg
    },
}

new Vue(options)