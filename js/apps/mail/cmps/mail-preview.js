import mailSummery from './mail-summery.js'

export default {
    props: ['mail'],
    template: `

    <transition
        enter-active-class="animate__animated animate__fadeInDownBig"
        leave-active-class="animate__animated animate__fadeOutLeft"
        >

        <article 
            class="mail-preview"
            :class="boldText"
            @mouseover="onHover(true)"
            @mouseleave="onHover(false)"
            @click="openSummery"
            v-if="mail">

                <section
                class="small-prev-container"
                v-if="!summery">

                    <button title="Star" 
                    class="starred-mail-btn"
                    @click.stop="onStarMail"
                    :class="starredColor"
                    >
                    <i :class="starred"
                    ></i>
                    </button>

                    <span class="mail-info">
                        <span class="mail-to" v-if="isSentMail">{{mail.to}}</span>
                        <span class="mail-from" v-else>{{mail.sender}}</span>

                        <span class="mail-subject">{{mail.subject}}</span>
                    </span>

                        <div
                        class="body-to-show"
                        :class="{hovered: isHovered}"
                        >
                            {{mail.body}}
                        </div>

                        <span
                        v-if="!hoverBody"
                        >{{timeToShow}}</span>

                        <span
                        v-else
                        class="preview-btns-container"
                        >
                            <button title="Archive" 
                                class="clickable"
                                @click.stop="onSendToArchive">
                                <i class="fas fa-archive"></i>
                            </button>

                            <button :title="(this.mail.isRead)?'Read' : 'Unread'" 
                                class="clickable"
                                @click.stop="onToggleMarkAsRead"> 
                                <i :class="readButton"></i>
                            </button>
                            
                            <button title="Delete" 
                                class="clickable"
                                @click.stop="onDeleteMail"
                                >
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </span>
                </section>


                <mail-summery 
                    v-else
                    :mail="summery"
                    @existSummery="summery=null"
                />

        </article>

    </transition>

    `,
    data() {
        return {
            hoverBody: false,
            summery: null,
        }
    },
    methods: {
        onHover(hover) {
            this.hoverBody = hover
        },
        openSummery() {
            this.mail.isRead = true
            this.$emit('saveMail', this.mail)

            if (this.summery) {
                this.summery = null
                return
            }
            this.summery = this.mail
        },
        onToggleMarkAsRead() {
            this.mail.isRead = !this.mail.isRead
            this.$emit('saveMail', this.mail)
        },
        onDeleteMail() {
            this.$emit('removeMail', this.mail)
        },
        onSendToArchive() {
            this.$emit('archiveMail', this.mail)
        },
        onStarMail() {
            this.$emit('starMail', this.mail)
        },
    },
    computed: {
        boldText() {
            return { bold: !this.mail.isRead }
        },
        timeToShow() {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            const month = months[new Date(this.mail.sentAt).getMonth()]
            const res = `${month} ${new Date(this.mail.sentAt).getDay()}`

            return res
        },

        readButton() {
            if (this.mail.isRead) return 'fas fa-envelope-open-text'
            return 'fas fa-envelope-open'
        },
        isSentMail() {
            return this.mail.categories.includes('sent mails')
        },
        starred() {
            return (!this.mail.isStarred) ? 'far fa-star' : 'fas fa-star'
        },
        starredColor() {
            return { starred: this.mail.isStarred }
        },
        isHovered() {
            return this.hoverBody
        }
    },
    components: {
        mailSummery,
    },
}
