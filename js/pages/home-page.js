import homeSection from '../cmps/home-section.js'

export default {
    props: [],
    template: `
        <main 
        class="home-page"
        >
            <home-section
            class="mail-container"
            :type="email"
            />


            <home-section
            class="keep-container"
            :type="keep"
            />
        </main>
    `,
    data() {
        return {
            email: {
                title: 'Meet your new Email inbox',
                p: 'New customizable tabs put you back in control so that you can see what’s new at a glance and decide which emails you want to read and when.',
                imgUrl: 'img/emails.jpeg',
                routerUrl: '/misterEmail'
            },
            keep: {
                title: 'New place to save your thoughts',
                p: 'Capture what’s on your mind. Add notes, lists, photos, and audio to Keep. Everything you add to Keep syncs across your devices so your important stuff is always with you.',
                imgUrl: 'img/notes.png',
                routerUrl: '/missKeep'
            }
        }
    },
    components: {
        homeSection
    },
}
