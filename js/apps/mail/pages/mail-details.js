import { mailService } from "../services/mail-service.js"
import { eventBus } from "../../../services/event-bus.js"

export default {
    template: `
        <main
        class="mail-details"
        v-if="mail"
        >

            <aside class="details-buttons-area">
                <button title="Draft" 
                v-if="draftEdit"
                class="clickable"
                @click="onEditDraft"
                >
                <i class="fas fa-edit"></i>
                </button>


                <button title="Reply" 
                v-else
                class="clickable"
                @click="onReply"
                >
                <i class="fas fa-reply"></i>
                </button>

                <button title="Delete" 
                class="clickable"
                @click="onDeleteMail(mail)"
                >
                <i class="fas fa-trash-alt"></i>
                </button>


                <button title="Exit Full Screen" 
                class="clickable"
                @click="onExitFullSize"
                >
                <i class="fas fa-inbox"></i>
                </button>

            </aside>


            <h1 class="details-title">
                {{mail.subject}}
            </h1>

            <h4 class="details-sender">
                <i class="fas fa-user-circle"></i>
                {{sender}}
            </h4>

            <span class="details-to">
                To: {{mailTo}}
            </span>

            <p class="details-body">
                {{mail.body}}
            </p>

        </main>
    `,
    data() {
        return {
            mail: null
        }
    },
    methods: {
        onDeleteMail(mail) {
            eventBus.$emit('removeMail', mail)
            this.onExitFullSize()
        },
        onExitFullSize() {
            this.$router.push('/misterEmail')
        },
        onEditDraft() {
            const url = `/misterEmail/newMail/?edit=true&sender=${this.mail.sender}&to=${this.mail.to}&subject=${this.mail.subject}&body=${this.mail.body}`
            this.$router.push(url)
        },
        onReply() {
            const url = `/misterEmail/newMail/?reply=true&sender=${this.mail.sender}&to=${this.mail.to}&subject=RE: ${this.mail.subject}&body=${this.mail.body}`
            this.$router.push(url)
        }
    },
    computed: {
        draftEdit() {
            return this.mail.categories.includes('drafts')
        },
        sender() {
            if (!this.mail.sender.includes('@')) return `${this.mail.sender} <${this.mail.sender.replaceAll(' ', '')}@gmail.com>`
            return this.mail.sender
        },
        mailTo() {
            if (this.mail.to.toLowerCase() === 'you') return 'Me'
            return this.mail.to
        }
    },
    watch: {
        '$route.params.id': {
            immediate: true,
            handler() {
                const id = this.$route.params.id
                mailService.get(id)
                    .then(mail => this.mail = mail)
            }
        },
    },
}
