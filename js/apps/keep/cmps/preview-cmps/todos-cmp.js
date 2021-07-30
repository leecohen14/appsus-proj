import { eventBus } from "../../../../services/event-bus.js"
export default {
    props: ['note'],
    template: `
        <section>
                <li @click.stop="addNewLine('li')" class="note-main-area">

                    <textarea class="note-title text-area-input"
                    v-model="note.info.title" 
                    @input="onSave"
                    name="note-input" 
                    cols="50" 
                    :rows="textRowsTitle"
                    placeholder="Title"
                    ></textarea>            

                    <br>
                    <div class="todos-container" v-for="(line, idx) in note.info.todos" > 
                        <span class="delete-todo" @click.stop="deleteTodo(idx)"><i class="fas fa-trash-alt"></i></span> 
                        <span :class="{'far fa-check-circle': line.isDone, 'far fa-circle': !line.isDone}" class="clickable" @click.stop="toggleIsDone(idx)"></span>

                        
                        <textarea class="note-txt txt-input text-area-input"
                        :class="{done: line.isDone}"
                        v-model="note.info.todos[idx].txt" 
                        @input.stop="addNewLine(idx); onSave(); textRows(idx);" 
                        name="note-input" 
                        cols="50" 
                        :rows="rowsNumbers[idx]"
                        placeholder="write your todo"
                        ></textarea>            



                        <!-- <input :class="{done: line.isDone}" class="txt-input"  type="text" v-model="note.info.todos[idx].txt"
                            @input.stop="addNewLine(idx),onSave()" placeholder="write your todo"/> -->
                    </div>
                </li>
        </section>
    `,
    data() {
        return {
            rowsNumbers: [1]
        }
    },
    methods: {
        isDone(todo) {
            return { done: todo.isDone }
        },
        toggleIsDone(todoIdx) {
            this.note.info.todos[todoIdx].isDone = !this.note.info.todos[todoIdx].isDone // taking with the dom because it the only way it works
            this.cleanLastLine()
        },
        onSave() {
            eventBus.$emit('onSaveNote', this.note)
        },
        addNewLine() {
            if (!this.checkIfLastLineIsEmpty()) this.note.info.todos.push({ txt: '', isDone: false })
        },
        cleanLastLine() {
            if (this.checkIfLastLineIsEmpty()) this.note.info.todos.pop()
            this.onSave()
        },
        deleteTodo(idx) {
            this.note.info.todos.splice(idx, 1)
            this.onSave()
        },
        checkIfLastLineIsEmpty() {
            if (this.note.info.todos.length === 0) return true
            return (this.note.info.todos[this.note.info.todos.length - 1].txt === '')
        },
        textRows(idx) {
            if (!this.note.info.todos[idx]) return 1
            const text = this.note.info.todos[idx].txt

            let numberOfLineBreaks = (text.match(/\n/g) || []).length
            let characterCount = text.length + numberOfLineBreaks

            this.rowsNumbers[idx] = numberOfLineBreaks + characterCount / 33.5 + 1
            this.note.info.todosRows = this.rowsNumbers
            this.onSave()
        },
    },
    computed: {
        textRowsTitle() {
            const text = this.note.info.title

            let numberOfLineBreaks = (text.match(/\n/g) || []).length
            let characterCount = text.length + numberOfLineBreaks

            return numberOfLineBreaks + characterCount / 35 + 1
        },
    },
    created() {
        document.addEventListener('click', this.cleanLastLine)
        this.rowsNumbers = (this.note.info.todosRows) ? this.note.info.todosRows : [1]
    },
    destroyed() {
        document.removeEventListener('click', this.cleanLastLine)
    },
}
