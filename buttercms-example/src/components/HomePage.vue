<template>
	<div class="home">
		<img :src="page.fields.hero" alt="">
		<h1>{{ page.fields.headline }}</h1>
		<h2>Essential Links</h2>
		<a href="/customers">Customer directory</a>

		<div class="services">
			<h2>Services</h2>

			<div class="container">
				<div v-for="(service, index) in services" class="services__item">
					<h3>{{ service.name }}</h3>
					<p>{{ service.body }}</p>
				</div>
			</div>
		</div>
		
	</div>
</template>

<script>
import { butter } from '@/buttercms'

export default {
  name: 'HomePage',
  data () {
    return {
      msg: 'Welcome to Your Vue.js - Butter CMS App',
      page: {
      	fields: {}
      },
      services: [],
    }
  },
  methods: {
    fetchPosts() {
      butter.post.list({
        page: 1,
        page_size: 10
      })
      .then((res) => {
        console.log('Content from ButterCMS')
        console.log(res)
      })
    },
    fetchServices(){
      butter.content.retrieve(['services'])
      .then((res) => {
        this.services = res.data.data.services
      })
    },
    fetchPage() {
    	butter.page.retrieve('*', 'home')
    	.then((res) => {
    	this.page = res.data.data
    	}).catch((res) => {
    		console.log(res)
    	})
    }
  },
  created() {
    this.fetchServices()
    this.fetchPage()
    // this.fetchHeadline()
    // this.fetchPosts()
  },
}
</script>

