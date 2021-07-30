import homePage from './pages/home-page.js'
import aboutPage from './pages/about-page.js'
// 
import misterEmail from './apps/mail/pages/mail-app.js'
import mailDetails from './apps/mail/pages/mail-details.js'
import mailCompose from './apps/mail/pages/mail-compose.js'
// 
import missKeep from './apps/keep/pages/keep-app.js'

const routes = [{
        path: '/',
        component: homePage
    },
    {
        path: '/misterEmail',
        component: misterEmail
    },
    {
        path: '/misterEmail/newMail',
        component: mailCompose
    },
    {
        path: '/misterEmail/:id?',
        component: mailDetails
    },
    {
        path: '/missKeep',
        component: missKeep
    },
    {
        path: '/about',
        component: aboutPage
    },
]

export const router = new VueRouter({ routes })
