export default {
    props: ['ratio'],
    template: `
        <div class=progress-bar>
            <span class="ratio-number">
                {{ratioForDisplay}}%
            </span>
            <div :style="setWidth" class="inner-progress">

            </div>
        </div>
    `,
    data() {
        return {

        }
    },
    methods: {

    },
    computed: {
        setWidth() {
            return { width: `${this.ratio}%` }
        },
        ratioForDisplay() {
            return Math.floor(this.ratio)
        }
    },
    watch: {
        data: {
            immediate: true,
            deep: true,
            handler(newValue, oldValue) {

            }
        }
    },
}
