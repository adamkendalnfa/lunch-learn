<template>
	<div class="section" id="customer-page">
		<div class="">
			<figure class="figure">
				<img class="image" :src="page.fields.logo">
			</figure>
			<h1 class="is-size-2">{{ page.fields.headline }}</h1>
			<h3 class="is-size-3">Testimonials</h3>
			<p>{{ page.fields.body }}</p>
			
			<div class="services">
				<h3>Services</h3>
				<div class="container">
					<div class="services__item" v-for="(service, index) in page.fields.services">
						<h3>{{ service.name }}</h3>
						<p>{{ service.body }}</p>
					</div>
				</div>
			</div>
			
		</div>
	</div>
</template>

<script>
import { butter } from '@/buttercms'
export default {
	name: 'customer-page',
	data() {
		return {
			slug: this.$route.params.slug,
			page: {
				slug: '',
				fields: {}
			}
		}
	},
	methods: {
		getPage() {
			butter.page.retrieve('customers', this.slug)
			.then((res) => {
			this.page = res.data.data
			}).catch((res) => {
				console.log(res)
			})
		}
	},
	created() {
		this.getPage()
	}
}
</script>
