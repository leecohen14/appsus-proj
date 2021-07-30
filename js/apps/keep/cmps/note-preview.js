import txtCmp from '../cmps/preview-cmps/txt-cmp.js'
import todosCmp from '../cmps/preview-cmps/todos-cmp.js'
import imgCmp from '../cmps/preview-cmps/img-cmp.js'
import videoCmp from '../cmps/preview-cmps/video-cmp.js'
import { eventBus } from "../../../services/event-bus.js"
export default {
    components: {
        txtCmp,
        todosCmp,
        imgCmp,
        videoCmp
    },
    props: ['note'],
    template: `
        <transition
            enter-active-class="animate__animated animate__fadeInDownBig"
            leave-active-class="animate__animated animate__fadeOut"
            >
                <section 
                class="note-preview" 
                :class="note.type"
                :style="{backgroundColor: bgc}"
                draggable="true">
                
                    <button title="Delete" @click="deleteNote">
                        <i class="fas fa-trash-alt"></i>
                    </button>

                    <button title="Pin" @click="pinNote">
                        <i class="fas fa-thumbtack" :style="pinNoteColor"></i>
                    </button>

                    <button title="Share" @click="shareNote">
                        <i class="fas fa-share-alt"></i>
                    </button>

                    <i class="fas fa-palette color-btn" title="Color" @mouseover="showColors" @mouseleave="hideColors">
                        <!-- <input v-model="bgc" type="color"> -->
                        <div class="color-btns" v-if="isShowingColors">
                            <span class="color-opt" style="background-color: rgb(255, 136, 136);" @click="setColor('rgb(255, 136, 136)')"></span>
                            <span class="color-opt" style="background-color: rgb(255, 204, 136);" @click="setColor('rgb(255, 204, 136)')"></span>
                            <span class="color-opt" style="background-color: rgb(204, 255, 153);" @click="setColor('rgb(204, 255, 153)')"></span>
                            <span class="color-opt" style="background-color: rgb(170, 255, 238);" @click="setColor('rgb(170, 255, 238)')"></span>
                            <span class="color-opt" style="background-color: rgb(136, 187, 255);" @click="setColor('rgb(136, 187, 255)')"></span>
                            <span class="color-opt" style="background-color: rgb(255, 255, 136);" @click="setColor('rgb(255, 255, 136)')"></span>
                            <span class="color-opt" style="background-color: rgb(255, 255, 255);" @click="setColor('rgb(255, 255, 255)')"></span>
                        </div>
                    </i>

                    <component :note="note" :bgc="bgc" :is="cmp" @offEditMode="offEdit"/>
                </section>

        </transition>
        `,
    data() {
        return {
            cmp: 'txtCmp',
            editMode: false,
            bgc: 'rgb(255,255,136)',
            isShowingColors: false
        }
    },
    methods: {
        deleteNote() {
            eventBus.$emit('deleteNote', this.note.id)
            const msg = {
                txt: `Note deleted`,
                type: 'success',
                action: 'remove note',
            }
            eventBus.$emit('show-msg', msg)
        },
        onEditNote() {
            this.editMode = !this.editMode
        },
        offEdit() {
            this.editMode = false
        },
        pinNote() {
            eventBus.$emit('pinNote', this.note)
        },
        shareNote() {
            const url = `/misterEmail/newMail/?note=true&type=${this.note.type}&subject=${this.note.info.title}&body=${this.setShareBody()}`
            this.$router.push(url)
        },
        setShareBody() { //Share Note with Email
            const note = this.note.info
            let str = ''

            switch (this.note.type) {
                case 'noteTxt':
                    str = `${note.txt}`
                    break

                case 'noteTodos':
                    let todosStr = ''
                    note.todos.forEach(todo => {
                        todosStr += 'O' + todo.txt + '\n'
                    })
                    str = `${todosStr}`
                    break

                case 'noteImg':
                    str = `${note.imgUrl}`
                    break

                case 'noteVideo':
                    str = `${note.videoUrl}`
                    break

                default:
                    str = `${note.txt}`
                    break
            }

            return str
        },
        showColors() {
            this.isShowingColors = true
        },
        hideColors() {
            this.isShowingColors = false
        },
        setColor(color) {
            this.bgc = color
        },
        updateFilterByColor() {
            const currColorIdx = this.note.categories.findIndex(category => category.includes('color'))
            if (currColorIdx !== -1) this.note.categories.splice(currColorIdx, 1)

            let filter = 'general'
            switch (this.bgc) {
                case 'rgb(255, 255, 136)':
                    filter = 'general'
                    break
                case 'rgb(255, 136, 136)':
                    filter = 'work'
                    break
                case 'rgb(255, 204, 136)':
                    filter = 'cars'
                    break
                case 'rgb(204, 255, 153)':
                    filter = 'insurance'
                    break
                case 'rgb(170, 255, 238)':
                    filter = 'health'
                    break
                case 'rgb(136, 187, 255)':
                    filter = 'family'
                    break
                case 'rgb(255, 255, 255)':
                    filter = 'diet'
                    break

                default:
                    break
            }

            this.note.categories.push(`${filter}:color`)
        }
    },
    computed: {
        onUpdateColor(ev) {
            this.bgc = ev.value
        },
        pinNoteColor() {
            if (this.note.isPinned) return 'color: #0092ff; -webkit-text-stroke: 2px black;'
        }
    },

    created() {
        switch (this.note.type) {
            case 'noteTxt':
                this.cmp = 'txtCmp'
                break
            case 'noteTodos':
                this.cmp = 'todosCmp'
                break
            case 'noteImg':
                this.cmp = 'imgCmp'
                break
            case 'noteVideo':
                this.cmp = 'videoCmp'
                break
        }
        this.bgc = this.note.bgc
    },
    destroyed() {

    },
    watch: {
        bgc() {
            this.note.bgc = this.bgc
            eventBus.$emit('onUpdateColor', this.note)
            this.updateFilterByColor()
        }
    }
}
