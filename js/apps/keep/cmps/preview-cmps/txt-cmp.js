import { eventBus } from '../../../../services/event-bus.js'
export default {
    props: ['note', 'bgc'],
    template: `
    <section >
        <li class="note-main-area" >
            <input class="title-input" v-model="note.info.title" type="text"@input.stop="onSave"  >
            <!-- <input class="txt-input" v-model="note.info.txt" type="text" @input.stop="onSave" > -->
            
            <textarea class="text-area-input"
            v-model="note.info.txt" 
            @input.stop="onSave"  
            name="note-input" 
            cols="50" 
            :rows="textRows"
            ></textarea>            

        </li>
    </section>
    `,
    methods: {
        onSave() {
            eventBus.$emit('onSaveNote', this.note)
        }
    },
    computed: {
        textRows() {
            const text = this.note.info.txt

            let numberOfLineBreaks = (text.match(/\n/g) || []).length
            let characterCount = text.length + numberOfLineBreaks

            return numberOfLineBreaks + characterCount / 50
        },
    },

}
