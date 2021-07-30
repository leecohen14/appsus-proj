import { storageService } from "../../../services/async-storage-service.js"
import { utilService } from "../../../services/utils-service.js"

const MAILS_KEY = 'mails'

export const mailService = {
    query,
    get,
    getByFilter,
    getBySearch,
    post,
    postDraft,
    postMany,
    remove,
    getIndex,
    createMail,
    toggleArchive,
    toggleStar,
    createSimpleMail,
    createFirstMails,
    save,
}

function query() {
    return storageService.query(MAILS_KEY)
        .then(res => {
            if (!res || !res.length) {
                return postMany(createFirstMails())
                    .then(newMails => {
                        return newMails
                    })
            }
            return res
        })
}

function get(mailId) {
    return storageService.get(MAILS_KEY, mailId)
}

function getByFilter(mails, filterBy) {
    return mails.filter(mail => {
        return mail.categories.includes(filterBy) &&
            (filterBy === 'archived' || !mail.categories.includes('archived'))
    })
}

function getBySearch(mails, searchWord) {
    return mails.filter(mail => {
        return mail.sender.toLowerCase().includes(searchWord.toLowerCase()) ||
            mail.subject.toLowerCase().includes(searchWord.toLowerCase()) ||
            mail.to.toLowerCase().includes(searchWord.toLowerCase())
    })
}

function post(mail) {
    if (mail.to !== 'You') return sendMailToMe(mail)
    return storageService.post(MAILS_KEY, mail)
}

function postDraft(mail) {
    mail.categories = ['drafts']
    return storageService.post(MAILS_KEY, mail)
}

function sendMailToMe(mail) {
    let newMail = JSON.parse(JSON.stringify(mail))
    newMail.categories = ['inbox']
    newMail.to = 'You'

    mail.isRead = true
    mail.categories = ['sent mails']
    return storageService.post(MAILS_KEY, newMail)
        .then(() => {
            return storageService.post(MAILS_KEY, mail)
        })
}

function postMany(mails) {
    return storageService.postMany(MAILS_KEY, mails)
}

function remove(mail) {
    return storageService.remove(MAILS_KEY, mail.id)
        .then(() => query()
            .then(res => {
                return res
            })
        )
}

function toggleArchive(mailId) {
    return query()
        .then(res => {
            const targetMail = res.find(mail => mail.id === mailId)
            const idx = targetMail.categories.findIndex(c => c === 'archived')

            if (idx === -1) targetMail.categories.push('archived')
            else targetMail.categories.splice(idx, 1)

            save(targetMail)

            return res
        })
}

function toggleStar(mailId) {
    return query()
        .then(res => {
            const targetMail = res.find(mail => mail.id === mailId)
            targetMail.isStarred = !targetMail.isStarred

            const idx = targetMail.categories.findIndex(c => c === 'starred')

            if (idx === -1) targetMail.categories.push('starred')
            else targetMail.categories.splice(idx, 1)

            save(targetMail)

            return res
        })
}

function getIndex(mailId) {
    return query()
        .then(mails => {
            return mails.findIndex(mail => mail.id === mailId)
        })
}

function createMail(sender, subject, body, category, to = 'you', isRead = false, sentAt = Date.now()) {
    return {
        sender,
        subject,
        body,
        categories: [category],
        to,
        isRead,
        sentAt,
        isStarred: false
    }
}

function save(mail) {
    if (mail.id) {
        return storageService.put(MAILS_KEY, mail)
            .then(() => {
                return query()
                    .then(res => {
                        return res
                    })
            })
    } else {
        return storageService.post(MAILS_KEY, mail)
            .then(() => {
                return query()
                    .then(res => {
                        return res
                    })
            })
    }
}

function createSimpleMail() {
    return {
        sender: 'You',
        subject: 'Wassap?',
        body: utilService.makeLorem(200),
        categories: ['inbox'],
        to: 'you',
        isRead: false,
        sentAt: Date.now(),
        isStarred: false
    }
}

function createFirstMails() {
    const mails = [{
            id: utilService.makeId(),
            sender: 'iCloud',
            subject: 'Your iCloud storage is full?',
            body: 'Hello Sir, Your iCloud storage is full. Because you have exceeded your storage plan, your documents, contacts, and device data are no longer backing up to iCloud and your photos and videos are not uploading to iCloud Photos. iCloud Drive and iCloud-enabled apps are not updating across your devices.',
            categories: ['inbox'],
            to: 'you',
            isRead: true,
            sentAt: Date.now(),
            isStarred: false
        },
        {
            id: utilService.makeId(),
            sender: 'Google Cloud',
            subject: 'Your Google Cloud ',
            body: 'Hello Google Cloud Customer, We are sending this message to let you know about the following updates to the Google Cloud platform',
            categories: ['inbox'],
            to: 'you',
            isRead: true,
            sentAt: Date.now(),
            isStarred: false
        },
        {
            id: utilService.makeId(),
            sender: 'Yaron Biton',
            subject: 'Your Sprint grade',
            body: 'Hello guys, I am sorry to tell you that your sprint was very bad, hope to see some better things in sprint 4',
            categories: ['inbox'],
            to: 'you',
            isRead: false,
            sentAt: Date.now(),
            isStarred: false
        },
        {
            id: utilService.makeId(),
            sender: 'Stav Partush',
            subject: 'Team leader message',
            body: 'Hello guys, please do not forget to upload everything to dropBox (except of git), and also upload everything to GitHub pages!',
            categories: ['inbox'],
            to: 'you',
            isRead: false,
            sentAt: Date.now(),
            isStarred: false
        },
        {
            id: utilService.makeId(),
            sender: 'Rotem Carmon',
            subject: 'DropBox',
            body: 'Hi everyone, DO NOT forget to leave git folder out of my amazing and clean DropBox',
            categories: ['inbox', 'starred'],
            to: 'you',
            isRead: false,
            sentAt: Date.now(),
            isStarred: true
        },
        {
            id: utilService.makeId(),
            sender: 'Yaron Biton',
            subject: 'Your Sprint grade',
            body: 'Hello guys, I am sorry to tell you that your sprint was very bad, hope to see some better things in sprint 4',
            categories: ['inbox'],
            to: 'you',
            isRead: false,
            sentAt: Date.now(),
            isStarred: false
        },
        {
            id: utilService.makeId(),
            sender: 'Stav Partush',
            subject: 'Team leader message',
            body: 'Hello guys, please do not forget to upload everything to dropBox (except of git), and also upload everything to GitHub pages!',
            categories: ['inbox', 'starred'],
            to: 'you',
            isRead: true,
            sentAt: Date.now(),
            isStarred: true
        },
        {
            id: utilService.makeId(),
            sender: 'iCloud',
            subject: 'Your iCloud storage is full?',
            body: 'Hello Sir, Your iCloud storage is full. Because you have exceeded your storage plan, your documents, contacts, and device data are no longer backing up to iCloud and your photos and videos are not uploading to iCloud Photos. iCloud Drive and iCloud-enabled apps are not updating across your devices.',
            categories: ['inbox'],
            to: 'you',
            isRead: true,
            sentAt: Date.now(),
            isStarred: false
        },
        {
            id: utilService.makeId(),
            sender: 'Google Cloud',
            subject: 'Your iCloud storage is full?',
            body: 'Hello Google Cloud Customer, We are sending this message to let you know about the following updates to the Google Cloud platform',
            categories: ['inbox'],
            to: 'you',
            isRead: false,
            sentAt: Date.now(),
            isStarred: false
        },
        {
            id: utilService.makeId(),
            sender: 'Yaron Biton',
            subject: 'Your Sprint grade',
            body: 'Hello guys, I am sorry to tell you that your sprint was very bad, hope to see some better things in sprint 4',
            categories: ['inbox'],
            to: 'you',
            isRead: false,
            sentAt: Date.now(),
            isStarred: false
        },
        {
            id: utilService.makeId(),
            sender: 'Stav Partush',
            subject: 'Team leader message',
            body: 'Hello guys, please do not forget to upload everything to dropBox (except of git), and also upload everything to GitHub pages!',
            categories: ['inbox'],
            to: 'you',
            isRead: true,
            sentAt: Date.now(),
            isStarred: false
        },
        {
            id: utilService.makeId(),
            sender: 'Rotem Carmon',
            subject: 'DropBox',
            body: 'Hi everyone, DO NOT forget to leave git folder out of my amazing and clean DropBox',
            categories: ['inbox'],
            to: 'you',
            isRead: false,
            sentAt: Date.now(),
            isStarred: false
        },
        {
            id: utilService.makeId(),
            sender: 'Me',
            subject: 'Yassss',
            body: 'Hello my friend, how are you we goi',
            categories: ['drafts'],
            to: 'Rotem Carmon',
            isRead: false,
            sentAt: Date.now(),
            isStarred: false
        },
        {
            id: utilService.makeId(),
            sender: 'Rotem Carmon',
            subject: 'DropBox',
            body: 'Hi everyone, DO NOT forget to leave git folder out of my amazing and clean DropBox',
            categories: ['inbox', 'archived'],
            to: 'you',
            isRead: false,
            sentAt: Date.now(),
            isStarred: false
        },
        {
            id: utilService.makeId(),
            sender: 'Me',
            subject: 'Yassss',
            body: 'Hello my friend, how ar',
            categories: ['inbox', 'archived'],
            to: 'Rotem Carmon',
            isRead: false,
            sentAt: Date.now(),
            isStarred: false
        },

    ]

    return mails
}
