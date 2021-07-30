import { eventBus } from '../../../services/event-bus.js'
export default {
    template: `
    <section class="note-img">
            <img v-if="note.info.imgUrl" :src="note.info.imgUrl" alt="no img">
            <div v-else>
                <input  type="text" v-model="note.info.imgUrl" @input="reportVal"
                    placeholder="paste URL here"/>
                <input  type="file" ref="file"  @change="onFilePicked"/>
            </div>
    </section>
    `,
    data() {
        return {
            note: {
                id: null,
                type: 'noteImg',
                isPinned: false,
                info: {
                    title: '',
                    txt: '',
                    todos: [],
                    imgUrl: '',
                    videoUrl: '',
                },
                categories: ['photos', 'media'],
                bgc: '#ffff88'
            }
        }
    },
    methods: {
        reportVal() {
            this.$emit('setVal', this.note)

        },
        onFilePicked() {
            const file = event.target.files[0]
            const fileReader = new FileReader()

            fileReader.onload = () => {
                this.note.info.imgUrl = fileReader.result
                this.reportVal()
            }

            fileReader.readAsDataURL(file)
        },
        cleanInput() {
            this.note.info.imgUrl = ''
        }
    },
    created() {
        eventBus.$on('cleanInput', this.cleanInput)
    }
}