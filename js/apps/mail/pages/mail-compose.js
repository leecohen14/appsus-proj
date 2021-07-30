import { mailService } from "../services/mail-service.js"
import { eventBus } from "../../../services/event-bus.js"

export default {
    template: `
        <main
        class="mail-compose">

        <h4>New Message</h4>

            <form>
                <input v-model="to" type="text" placeholder="To:">
                <input type="text" placeholder="Cc:">
                <input type="text" placeholder="Bcc:">
                <input v-model="subject" type="text" placeholder="Subject:">
            
                <textarea 
                v-model="body" 
                name="mailBody" cols="30" 
                rows="10" placeholder="Your Message"
                >
                </textarea>




                <div class="compose-buttons-area">
                    <button title="Exit"
                        @click.prevent="onDeclareChanges"
                        >
                        <i class="fas fa-times"></i>
                    </button>


                    <button title="Send"
                    @click="onSendMail"
                    >
                    <i class="fas fa-paper-plane"></i>
                    </button>


                    <span>
                        <button title="Delete"
                        @click.prevent="onDeclareChanges"
                        >
                        <i class="fas fa-trash-alt"></i>
                        </button>

                        <button title="Draft"
                        @click="onSaveAsDraft"
                        >
                        <i class="fas fa-pencil-ruler"></i>
                        </button>
                    </span>
                </div>
            </form>
        </main> 
    `,
    data() {
        return {
            sender: 'You',
            to: '',
            subject: '',
            body: '',
            categories: ['sent mails'],
        }
    },
    methods: {
        onDeclareChanges() {
            if (confirm('Are you sure?')) this.$router.push('/misterEmail')
        },
        onSendMail() {
            const mail = this.createMail()

            // Set delay when sending mail
            setTimeout(() => {
                mailService.post(mail)
                    .then(() => {
                        eventBus.$emit('reloadMails')
                    })
            }, 2000)

            this.$router.push('/misterEmail')
        },
        onSaveAsDraft() {
            let mail = this.createMail()

            eventBus.$emit('saveAsDraft', mail)
            this.$router.push('/misterEmail')
        },
        createMail() {
            return mailService.createMail(
                this.sender,
                this.subject,
                this.body,
                this.categories,
                this.to,
            )
        },
    },
    watch: {
        '$route.query': {
            immediate: true,
            handler() {
                const query = this.$route.query
                if (query.edit) {
                    this.sender = query.sender
                    this.to = query.to
                    this.subject = query.subject
                    this.body = query.body
                } else if (query.reply) {
                    this.subject = query.subject
                    this.body =
                        `
                        \n\n
------------------------------------------
        ${query.subject}
        from: ${query.sender}
------------------------------------------
                        \n
${query.body}
`
                } else if (query.note) {
                    this.subject = query.subject
                    this.body = query.body
                }
            }
        }
    }
}
