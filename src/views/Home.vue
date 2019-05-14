<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm6 lg4 v-for="item in items" :key="item.format.filename">
        <v-card
          :href="getLink(item)"
        >
          <v-img
            :src="`${base}${item.format.filename.replace(/^.+\/(.+).flv$/, '$1')}.png`"
            :aspect-ratio="16 / 9"
          ></v-img>

          <v-card-title primary-title style="position: relative">
            <div>
              <h3 class="headline mb-0">{{getTime(item)}}</h3>
              <div> By {{ getUser(item) }} </div>
            </div>
            <div style="position: absolute; right: 1em; bottom: 1em;">
              {{getLength(item)}}
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  data () {
    return {
      base: 'https://live.oktw.one/record/'
    }
  },
  components: {
    HelloWorld
  },
  computed: {
    user () {
      return this.$route.params.user || null
    },
    items () {
      var items = this.$store.state.items

      if (this.user != null) {
        return items.map(i => {
          return {
            item: i,
            user: this.getUser(i)
          }
        }).filter(i => i.user == this.user).map(i => i.item)
      } else {
        return items
      }
    }
  },
  methods: {
    getTime(item) {
      return new Date(parseInt(item.format.filename.replace(/^.+-(.+).flv$/, '$1')) * 1000).toLocaleString()
    },
    getUser(item) {
      return item.format.filename.replace(/^.+\/(.+)-\d+.flv$/, '$1')
    },
    getLink(item) {
      return `${this.base}${item.format.filename.replace(/^.+\/(.+).flv$/, '$1')}.mp4`
    },
    getLength(item) {
      const totalSec = Math.floor(parseFloat(item.format.duration))
      const pad = (str) => ("00" + str).slice(-2)
      const sec = pad(totalSec % 60)
      const min = pad(~~((totalSec % 3600) / 60))
      const hour = ~~(totalSec / 3600)

      return `${hour}:${min}:${sec}`
    }
  }
}
</script>
