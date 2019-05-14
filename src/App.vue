<template>
  <div id="app">
    <Player v-bind:video="data.playing"/>
    <Divider />
    <Streamer v-on:click="streamClicked" v-for="streamer in data.streamers" v-bind:streamer="streamer" :key="streamer.name"/>
  </div>
</template>

<script>
import Player from './components/Player.vue'
import Divider from './components/Divider.vue'
import Streamer from './components/Streamer.vue'

export default {
  name: 'app',
  components: {
    Player,
    Streamer,
    Divider
  },
  methods: {
      streamClicked(type,eventData){
          if(type === "record"){
            this.data.playing.src = eventData.src;
            this.data.playing.title = eventData.streamer.name;
            this.data.playing.subtitle = eventData.publishTimeText;
          }
      }
  },data() {
    return {
      data : {
        "playing" : {
          "src" : "",
          "title" : "Select a video , pls.",
          "subtitle" : "Plssssssssssss"
        },
        "streamers" : [
          {"name":"jikchen5209","records":[ { "duration" : 8787 , "publishTime" : new Date() , "thumbSrc" : "https://cdn.discordapp.com/attachments/276631300390125579/577814092505546752/unknown.png" , "src" : "1" } ]}
        ]
      }
    }
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Noto+Sans+TC");
* {
    font-family: "Noto Sans TC", sans-serif;
    font-weight: 100;
    color:white;
}
body{
    padding: 20px;
    background: #222;
}
#app {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
