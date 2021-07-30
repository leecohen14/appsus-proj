import noteList from '../cmps/note-list.js'
import noteAdd from '../cmps/note-add.js'
import sideBar from '../../../cmps/side-bar.js'
import { keepService } from '../services/keep-service.js'
import { eventBus } from "../../../services/event-bus.js"

export default {
    props: [],
    template: `
        <section 
        class="keep-app">
            <side-bar 
            class="keep-side-bar"
            :categories="categories"
            :isHovered="true"
            @setFilter="setFilter"
            />
            <main>
                <note-add @save="saveNote"/>
                
                <note-list :notes="notesToShow"
                v-if="pinnedNotes"
                /> 
            </main>
        </section>
    `,
    data() {
        return {
            notes: [],
            searchBy: '',
            filterBy: '',
            categories: [{
                    text: 'all',
                    icon: 'fas fa-mail-bulk'
                },
                {
                    text: 'notes',
                    icon: 'far fa-sticky-note'
                },
                {
                    text: 'todos',
                    icon: 'fas fa-list'
                },
                {
                    text: 'photos',
                    icon: 'fas fa-image'
                },
                {
                    text: 'videos',
                    icon: 'fab fa-youtube'
                },
                {
                    text: 'media',
                    icon: 'fas fa-photo-video'
                },
                {
                    text: 'general',
                    icon: 'fas fa-circle general'
                },
                {
                    text: 'work',
                    icon: 'fas fa-circle work'
                },
                {
                    text: 'family',
                    icon: 'fas fa-circle family'
                },
                {
                    text: 'cars',
                    icon: 'fas fa-circle cars'
                },
                {
                    text: 'insurance',
                    icon: 'fas fa-circle insurance'
                },
                {
                    text: 'health',
                    icon: 'fas fa-circle health'
                },
                {
                    text: 'diet',
                    icon: 'fas fa-circle diet'
                },

            ],
        }
    },
    methods: {
        loadNotes() {
            keepService.query()
                .then(res => {
                    this.notes = res
                })
        },
        saveNote(note) {
            keepService.save(note)
                .then(() => this.loadNotes())
        },
        setFilter(filter) {
            this.filterBy = filter
        },
        setSearch(searchStr) {
            this.searchBy = searchStr
        },
        toggleIsDone({ noteId, todoIdx }) {
            keepService.toggleIsDone({ noteId, todoIdx })
                .then(res => this.notes = res)
        },
        deleteNote(noteId) {
            keepService.remove(noteId)
                .then(() => this.loadNotes())
        },
        pinNote(note) {
            keepService.togglePinNode(note)
                .then((res) => this.notes = res)
        },

    },
    computed: {
        pinnedNotes() {
            if (!this.notes) return
            return this.notes.filter(note => note.isPinned)
        },
        restNotes() {
            if (!this.notes) return
            return this.notes.filter(note => !note.isPinned)
        },
        notesToShow() {
            return keepService.getNotesToShow(this.notes, this.searchBy, this.filterBy)
        }
    },
    created() {
        this.notes = this.loadNotes()
        eventBus.$on('toggleIsDone', this.toggleIsDone)
        eventBus.$on('deleteNote', this.deleteNote)
        eventBus.$on('searchInKeep', this.setSearch)
        eventBus.$on('onSaveNote', this.saveNote)
        eventBus.$on('pinNote', this.pinNote)
        eventBus.$on('onUpdateColor', this.saveNote)

    },
    destroyed() {
        eventBus.$off('toggleIsDone', this.toggleIsDone)
        eventBus.$off('deleteNote', this.deleteNote)
        eventBus.$off('searchInKeep', this.setSearch)

    },
    components: {
        noteList,
        noteAdd,
        sideBar
    },
}
