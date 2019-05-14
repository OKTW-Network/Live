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
  },async mounted () {
        const indexURL = "/record/"
        const videos =  await Promise.all((await (await fetch(indexURL)).json())
                        .filter(i => i.type === 'file' && i.size !== 0 && i.name.indexOf('.mp4') !== -1)
                        .map(async i => {
                            const metadata = await (await fetch(indexURL + i.name.substring(0, i.name.length - 3) + 'json')).json()
                            return {
                                streamer: i.name.substring(0, i.name.length - 15),
                                publishTime: new Date(parseInt(i.name.substring(i.name.length - 14, i.name.length - 4)) * 1000),
                                thumbSrc: indexURL + i.name.substring(0, i.name.length - 3) + 'png',
                                duration: metadata.format.duration,
                                src: indexURL + i.name
                            }
                        }))

        videos.sort((a, b) => a.publishTime > b.publishTime ? -1 : a.publishTime < b.publishTime ? 1 : 0)

        var streamers = {};
        videos.forEach((video) => {
            if (video.streamer in streamers) {
                streamers[video.streamer].records.push(video)
            } else {
                streamers[video.streamer] = {
                    name: video.streamer,
                    records: [video]
                }
            }
        })

        for(var streamerName in streamers){
            this.data.streamers.push(streamers[streamerName])
        }
  },
  methods: {
      streamClicked(type,eventData){
          if(type === "record"){
            this.data.playing.src = eventData.src;
            this.data.playing.title = eventData.streamer.name;
            this.data.playing.subtitle = eventData.publishTimeText;
            window.scrollTo(0,0);
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
