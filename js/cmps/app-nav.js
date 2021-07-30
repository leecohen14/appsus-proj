import appNavItem from './app-nav-item.js'

export default {
    props: [],
    template: `
        <nav
        class="app-nav"
        >

            <i class="menu-icon fas fa-th fa-lg"
            @click.stop="onToggleMenu" 
            ></i>
            
            <transition
            enter-active-class="animate__animated animate__fadeInRight"
            leave-active-class="animate__animated animate__fadeOutRight"
            >
            <!-- enter-active-class="animate__animated animate__bounceIn"
            leave-active-class="animate__animated animate__bounceOut" -->
            <!-- enter-active-class="animate__animated animate__fadeInTopRight"
            leave-active-class="animate__animated animate__fadeOutTopRight" -->
                <section 
                class="menu-container"
                @click="onToggleMenu"
                v-if="isNavOpen">
                
                <app-nav-item 
                v-for="item in items"
                :item="item"
                />
            </section>
            </transition>
            
        </nav>

    `,
    data() {
        return {
            isNavOpen: false,
            items: [{
                    icon: 'fas fa-envelope fa-2x',
                    title: 'Email',
                    routerUrl: '/misterEmail',
                    color: 'black'
                },
                {
                    icon: 'fas fa-sticky-note fa-2x',
                    title: 'Keep',
                    routerUrl: '/missKeep',
                    color: 'black'
                },
                {
                    icon: 'fas fa-info fa-2x',
                    title: 'About',
                    routerUrl: '/about',
                    color: 'black'
                },
                {
                    icon: 'fas fa-map-marker-alt fa-2x',
                    title: 'Maps',
                    color: '#bfbfbf'
                },
                {
                    icon: 'fas fa-calendar fa-2x',
                    title: 'Calendar',
                    color: '#bfbfbf'
                },
                {
                    icon: 'fab fa-youtube fa-2x',
                    title: 'Youtube',
                    color: '#bfbfbf'
                },
                {
                    icon: 'fas fa-user fa-2x',
                    title: 'Contacts',
                    color: '#bfbfbf'
                },
                {
                    icon: 'fas fa-images fa-2x',
                    title: 'Photos',
                    color: '#bfbfbf'
                },
                {
                    icon: 'fas fa-globe-americas fa-2x',
                    title: 'Earth',
                    color: '#bfbfbf'
                },

            ],

        }
    },
    methods: {
        onToggleMenu() {
            this.isNavOpen = !this.isNavOpen
        }
    },
    components: {
        appNavItem,
    },
    created() {
        document.addEventListener('click', () => { this.isNavOpen = false })
    },
}
