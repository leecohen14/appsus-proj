import { eventBus } from "../services/event-bus.js"
import { utilService } from "../services/utils-service.js"

export default {
    props: [],
    template: `
        <div 
        v-if="siteName"
        :class="className"
        >
            <input type="text" 
            :placeholder="placeHolder"
            ref="input"
            v-model="searchTxt"
            >
            <img src="img/loupe.png">
        </div>
    `,
    data() {
        return {
            siteName: '',
            searchTxt: ''
        }
    },
    methods: {
        search() {
            const eventName = 'searchIn' + this.siteName
            eventBus.$emit(eventName, this.searchTxt)
        }
    },
    computed: {
        placeHolder() {
            return 'Search ' + this.siteName
        },
        className() {
            return `search-bar-${this.siteName.toLowerCase()} `

        }
    },
    mounted() {
        if (!this.siteName) return
        this.$refs.input.addEventListener(
            'input', utilService.debounce(this.search, 1000))
    },
    watch: {
        '$route.path': {
            immediate: true,
            deep: true,
            handler() {
                const root = this.$route.path
                this.searchTxt = ''
                if (root.includes('Email')) this.siteName = 'Mail'
                else if (root.includes('Keep')) this.siteName = 'Keep'
                else this.siteName = ''
            }
        }
    },
}
