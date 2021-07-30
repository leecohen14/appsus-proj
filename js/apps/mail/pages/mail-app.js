import mailPreview from '../cmps/mail-preview.js'
import progressBar from '../cmps/progress-bar.js'
import mailList from '../cmps/mail-list.js'
import sideBar from '../../../cmps/side-bar.js'
import { mailService } from "../services/mail-service.js"
import { eventBus } from "../../../services/event-bus.js"

export default {
    template: `
        <main class="mail-app">
            <div
            class="mail-side-bar-container"
            >   


                <button title="New Mail"
                class="mail-compose-btn"
                >
                    <router-link
                    to="/misterEmail/newMail"
                    >
                        <img :key="'img'" src="img/compose.png" class="inline"
                        >
                    </router-link>
                </button>

                <side-bar
                class="mail-side-bar"
                :categories="categories"
                :mainCounter="unreadMails"
                :mainCounterIdx="1"
                @setFilter="setFilter"
                />

                <progress-bar
                v-if="mails"
                :ratio="readRatio"
                />
            </div>

            <mail-list 
            :mails="mailsToShow"
            @saveMail="saveMail"
            @removeMail="removeMail"
            @archiveMail="archiveMail"
            @starMail="starMail"
            v-if="mails"
            />

        </main>
    `,
    data() {
        return {
            mails: null,
            categories: [{
                    text: 'all',
                    icon: 'fas fa-mail-bulk'
                },
                {
                    text: 'inbox',
                    icon: 'fas fa-inbox'
                },
                {
                    text: 'sent mails',
                    icon: 'fas fa-paper-plane'
                },
                {
                    text: 'starred',
                    icon: 'fas fa-star'
                },
                {
                    text: 'archived',
                    icon: 'fas fa-archive'
                },
                {
                    text: 'drafts',
                    icon: 'fas fa-pencil-ruler'
                }
            ],
            filterBy: 'inbox',
            searchBy: '',
            unreadMails: 0,
        }
    },
    methods: {
        loadMails() {
            mailService.query()
                .then((res) => {
                    this.mails = res
                })
        },
        removeMail(mail) {
            if (!confirm('Are you sure you want to DELETE that mail?')) return
            mailService.remove(mail)
                .then((res) => {
                    this.mails = res
                    const msg = {
                        txt: `Mail deleted`,
                        type: 'success',
                        action: 'remove mail',
                    }
                    eventBus.$emit('show-msg', msg)
                })

        },
        archiveMail(mail) {
            mailService.toggleArchive(mail.id)
                .then((res) => {
                    this.mails = res
                })
        },
        starMail(mail) {
            mailService.toggleStar(mail.id)
                .then((res) => {
                    this.mails = res
                })
        },
        saveDraft(mail) {
            mailService.postDraft(mail)
                .then(() => {
                    this.loadMails()
                })
        },
        saveMail(mail) {
            mailService.save(mail)
                .then((res) => {
                    this.mails = res
                })
        },
        setFilter(filter) {
            this.filterBy = filter
        },
        onSearch(val) {
            this.searchBy = val
        },
        searchMails(mails) {
            return mailService.getBySearch(mails, this.searchBy)
        },
        getMailsByFilter(filter = this.filterBy) {
            if (filter === 'all') {
                return this.mails
            }
            return mailService.getByFilter(this.mails, filter)
        },
        updateUnreadCounter() {
            const currMails = this.searchMails(this.getMailsByFilter('inbox'))

            let counter = 0
            currMails.forEach(mail => {
                if (!mail.isRead) counter++
            })

            this.unreadMails = counter
        },
    },
    computed: {
        mailsToShow() {
            return this.searchMails(this.getMailsByFilter())
        },
        readRatio() {
            this.updateUnreadCounter()
            const currMails = this.searchMails(this.getMailsByFilter())

            let counter = 0
            currMails.forEach(mail => {
                if (mail.isRead) counter++
            })

            if (!this.mailsToShow.length) {
                return 100
            }

            return counter / this.mailsToShow.length * 100
        },
    },
    created() {
        eventBus.$on('reloadMails', this.loadMails)

        eventBus.$on('saveAsDraft', this.saveDraft)
        eventBus.$on('removeMail', this.removeMail)
        eventBus.$on('searchInMail', this.onSearch)

        this.loadMails()
    },
    destroyed() {
        eventBus.$off('reloadMails')

        eventBus.$off('saveDraft', this.saveDraft)
        eventBus.$off('removeMail', this.removeMail)
        eventBus.$off('searchInMail')
    },
    components: {
        mailPreview,
        mailList,
        sideBar,
        progressBar
    },
}
