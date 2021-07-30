import noteTxt from './note-txt.js'
import noteImg from './note-img.js'
import noteVideo from './note-video.js'
import noteTodos from './note-todos.js'
import { eventBus } from '../../../services/event-bus.js'

export default {
    components: {
        noteTxt,
        noteTodos,
        noteImg,
        noteVideo
    },
    props: [],
    template: `
        <section class="note-add">
            <div class="modes-btns-container">

                <button title="Note" @click = "cmp = 'noteTxt'">
                    <i class="far fa-sticky-note"></i>
                </button>

                <button title="Todo" @click = "cmp = 'noteTodos'">
                    <i class="fas fa-list"></i>
                </button>
                
                <button title="Photo" @click = "cmp = 'noteImg'">
                    <i class="fas fa-image"></i>
                </button>
                
                <button title="Video" @click = "cmp = 'noteVideo'">
                    <i class="fab fa-youtube"></i>
                </button>
            </div>

            <form @submit.prevent="save">

                <component :is="cmp" @setVal="setAns"/>

                <button title="Save" class="save-btn">
                    <i class="fas fa-save"></i>    
                </button>
                
            </form>
        </section>
    `,
    data() {
        return {
            note: {
                type: '',
                isPinned: false,
                info: {
                    title: '',
                    txt: '',
                    todos: [],
                    imgUrl: '',
                    videoUrl: '',
                },
                categories: ['notes', 'general:color']
            },
            cmp: 'noteTxt'
        }
    },
    methods: {
        save() {
            if (this.note.type === 'noteTodos') this.note.info.todos.pop() //remove last empty line
            this.$emit('save', this.note)
            eventBus.$emit('cleanInput')

            const msg = {
                txt: `New note added`,
                type: 'success',
                action: 'add note',
            }
            eventBus.$emit('show-msg', msg)
        },
        setAns(val) {
            this.note = JSON.parse(JSON.stringify(val))
        },
    },
    watch: {
        '$route.query': {
            immediate: true,
            handler() {
                const query = this.$route.query
                if (query.mail) {
                    this.note.type = 'noteTxt'
                    this.note.info.title = query.subject
                    this.note.info.txt = "Sender: " + query.sender + " | " + "To: " + query.to + " | " + query.body
                    this.save()
                    this.$router.push('/missKeep')
                }
            }
        }
    },
}
