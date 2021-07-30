export default {
    props: ['type'],
    template: `
        <section> 

            <router-link
            :to="type.routerUrl"
            class="router-link"
            >
                <h1 class="title">
                    {{type.title}}
                </h1>
            </router-link>

            <p> 
                {{type.p}}
            </p>
    
            <router-link
            :to="type.routerUrl"
            class="router-link"
            >
                <img :src="type.imgUrl" alt="">
            </router-link>

            
        </section>

    `,
}
