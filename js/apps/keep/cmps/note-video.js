import { eventBus } from '../../../services/event-bus.js'

export default {

    props: [],
    template: `
    <section class="note-video">
        <iframe v-if="note.info.videoUrl" 
            width="200" height="100" 
            :src="'https://www.youtube.com/embed/'+note.info.videoUrl" 
            title="YouTube video player" frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
        ></iframe>

        <input v-else type="text" v-model="note.info.videoUrl" 
            @change="reportVal"placeholder="paste URL here"/>
    </section>
    
    `,
    data() {
        return {
            note: {
                id: null,
                type: 'noteVideo',
                isPinned: false,
                info: {
                    title: '',
                    txt: '',
                    todos: [],
                    imgUrl: '',
                    videoUrl: ''
                },
                categories: ['videos', 'media'],
                bgc: '#ffff88'
            }
        }
    },
    methods: {
        reportVal() {
            this.note.info.videoUrl = this.note.info.videoUrl.split('=')[1].split('&')[0]
            this.$emit('setVal', this.note)
        },
        cleanInput() {
            this.note.info.videoUrl = ''
        }
    },
    created() {
        eventBus.$on('cleanInput', this.cleanInput)
    }
}
