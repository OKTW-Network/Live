<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm6 lg4 v-for="item in items" :key="item.format.filename">
        <v-card
          @click="play(item)"
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
    <v-dialog v-model="dialog" :content-class="isMobile ? 'dynamic-wrap mobile' : 'dynamic-wrap'" transition="dialog-bottom-transition">
      <v-card style="display: inline-block" v-if="dialog">
        <a :href="videoSrc" class="open-in-new-window" :class="{mobile: isMobile}">
          <v-icon large style="vertical-align: middle">open_in_new</v-icon>
        </a>
        <div @click="dialog = false" v-if="isMobile" class="close">
          <v-icon large style="vertical-align: middle">close</v-icon>
        </div>
        <video controls :src="videoSrc" class="my-video" :class="{mobile: isMobile}"></video>
      </v-card>
    </v-dialog>
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
      dialog: false,
      base: 'https://live.oktw.one/record/',
      videoSrc: ''
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
    },
    isMobile () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return true
        case 'sm': 
        case 'md': 
        case 'lg': 
        case 'xl': 
          return this.$vuetify.breakpoint.height < 450
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
    },
    play(item) {
      const url = this.getLink(item)
      this.videoSrc = url
      this.dialog = true
    }
  }
}
</script>
<style>
.dynamic-wrap {
  width: auto;
}
.dynamic-wrap.mobile {
  max-height: none;
  margin: 0;
}
</style>
<style scoped>
.open-in-new-window, .close {
  position: absolute;
  display: block;
  right: 0;
  top: 0;
  width: 48px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  background: rgba(32, 32, 32, 0.2);
  cursor: pointer;
}

.open-in-new-window.mobile {
  right: 48px;
}

.my-video {
  max-height: 90vh;
  max-width:90vw;
  vertical-align: middle;
}
.my-video.mobile {
  max-height: 100vh;
  height: 100vh;
  max-width:100vw;
  width: 100vw;
  vertical-align: middle;
}
</style>
