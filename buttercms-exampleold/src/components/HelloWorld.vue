<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <a href="/customers">Customer directory</a>
  </div>
</template>

<script>
import { butter } from '@/buttercms'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js - Butter CMS App',
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
    fetchHeadline() {
      butter.content.retrieve(['homepage_headline'])
      .then((res) => {
        console.log('Headline from ButterCMS')
        console.log(res)
      })
    },
  },
  created() {
    // this.fetchHeadline()
    // this.fetchPosts()
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
