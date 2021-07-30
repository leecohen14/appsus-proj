export default {
    props: ['item'],
    template: `
        <article
        class="app-nav-item"
        v-if="item"
        >
            <router-link
            :to="route"
            :style="color"
            >
                <i :class="item.icon"
                class="item-icon"
                ></i>
                <h3>
                    {{item.title}}
                </h3>
            </router-link>

        </article>
    `,
    computed: {
        color() {
            if (!this.item.routerUrl) return 'color: ' + this.item.color + '!important'
            return 'color: ' + this.item.color
        },
        route() {
            if (this.item.routerUrl)
                return this.item.routerUrl
            return ''
        }
    },
}
