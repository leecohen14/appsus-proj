import mailPreview from './mail-preview.js'

export default {
    props: ['mails'],
    template: `
        <section
        class="mail-list">

            <mail-preview
            class="clickable"
            v-for="mail in mails"
            :mail="mail" 
            :key="mail.id"


            @saveMail="saveMail"
            @removeMail="removeMail"
            
            @archiveMail="archiveMail"
            @starMail="starMail"
            />

        </section>
    `,
    methods: {
        saveMail(mail) {
            this.$emit('saveMail', mail)
        },
        removeMail(mail) {
            this.$emit('removeMail', mail)
        },
        archiveMail(mail) {
            this.$emit('archiveMail', mail)
        },
        starMail(mail) {
            this.$emit('starMail', mail)
        },

    },
    components: {
        mailPreview,
    },
}
