<template>
  <div id="customers-home">
    <h1>{{ page_title }}</h1>
    <div class="container">
      <div v-for="(page,index) in pages" :key="page.slug + '_' + index">
        <router-link :to="'/customers/' + page.slug">
          <div>
            <img class="image" :src="page.fields.logo" alt="">
            <h2>{{ page.fields.headline }}</h2>
          </div>
        </router-link>
      </div>
    </div>
   
  </div>
</template>

<script>
  // import ButterCMS from 
  import { butter } from '@/buttercms'
  export default {
    name: 'customers-home',
    data() {
      return {
        page_title: 'Customers',
        // Create array to hold the pages from ButterCMS API
        pages: []
      }
    },
    methods: {
      // Get List of Customer Pages
      getPages() {
        butter.page.list('customers')
          .then((res) => {
            console.log(res.data.data) // Check the results in the console
            this.pages = res.data.data
          })
      },
    },
    created() {
      // Fire on page creation
      this.getPages()
    }
  }
</script>

