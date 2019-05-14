<template>
  <v-app id="inspire" dark>
    <v-navigation-drawer
      v-model="drawer"
      clipped
      fixed
      app
    >
      <v-list dense>
        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>記錄列表</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-for="user in users" :key="user" :to="`/user/${user}`">
          <v-list-tile-action>
            <v-icon>person</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{user}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/about">
          <v-list-tile-action>
            <v-icon>info</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>關於</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{ user || '非常母湯的直播紀錄' }}</v-toolbar-title>
    </v-toolbar>
    <v-content>
        <router-view/>
    </v-content>
    <v-footer app fixed>
      <span>母湯TW &copy; 2019</span>
    </v-footer>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-container fill-height style="background: #333; max-width: none;" class="pa-0 ma-0">
        <v-layout justify-center align-center column>
          <v-icon color="red" style="font-size: 10em">warning</v-icon>
          <div>以下含有 NSFW 內容，您是否已滿18歲？</div>

          <div style="display: flex; justify-contents: 0; flex-grow: 0">
              <v-btn color="red" href="http://google.com/">No</v-btn>
              <v-btn color="green" @click="dialog = false">Yes</v-btn>
          </div>
        </v-layout>
      </v-container>
    </v-dialog>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      dialog: true,
      drawer: null
    }),
    computed: {
      user () {
        return this.$route.params.user || null
      },
      items () {
        return this.$store.state.items
      },
      users () {
        const userMap = new Map()
        const items = this.items
        for (let item of items) {
          userMap.set(this.getUser(item), true)
        }

        return [...userMap.keys()]
      }
    },
    methods: {
      getUser(item) {
        return item.format.filename.replace(/^.+\/(.+)-\d+.flv$/, '$1')
      }
    },
    mounted () {
      this.$store.dispatch('getList')
    }
  }
</script>
