<template>
  <div id="app">
    <EighteenPlusWarning/>
    <RecordPlayer v-bind:video="data.playing"/>
    <Streamer v-on:click="streamerClicked" v-for="streamer in data.streamers" v-bind:streamer="streamer" :key="streamer.name"/>
  </div>
</template>

<script>
import RecordPlayer from './components/RecordPlayer.vue'
import Divider from './components/Divider.vue'
import Streamer from './components/Streamer.vue'
import EighteenPlusWarning from './components/EighteenPlusWarning.vue'

export default {
  name: 'app',
  components: {
    RecordPlayer,
    Streamer,
    Divider,
    EighteenPlusWarning
  },async mounted () {
        const dirURL = "/record/"
        const videos =  await Promise.all((await (await fetch(dirURL + "/list.json")).json())
                        .filter(i => "format" in i && i.format.format_name === 'flv' && i.format.size != 0)
                        .map(async i => {
                            const filename = i.format.filename.split("/").reverse()[0];
                            return {
                                streamer: filename.substring(0, filename.length - 15),
                                publishTime: new Date(parseInt(filename.substring(filename.length - 14, filename.length - 4)) * 1000),
                                thumbSrc: dirURL + filename.substring(0, filename.length - 3) + 'png',
                                duration: i.format.duration,
                                src: dirURL + filename.substring(0, filename.length - 3) + 'mp4'
                            }
                        }))

        videos.sort((a, b) => a.publishTime > b.publishTime ? -1 : a.publishTime < b.publishTime ? 1 : 0)

        var streamers = {};
        videos.forEach((video) => {
            if (video.streamer in streamers) {
                streamers[video.streamer].unloadRecords.push(video)
            } else {
                streamers[video.streamer] = {
                    name: video.streamer,
                    unloadRecords: [video],
                    records: []
                }
            }
        })

        for(var streamerName in streamers){
            this.data.streamers.push(streamers[streamerName])
        }
  },
  methods: {
      streamerClicked(type,eventData){
          if(type === "record"){
            this.data.playing.src = eventData.src;
            this.data.playing.title = eventData.streamer.name;
            this.data.playing.subtitle = eventData.publishTimeText;
            window.scrollTo(0,0);
          }else if(type === "streamer"){
            eventData.streamer.records = eventData.streamer.unloadRecords
          }
      }
  },data() {
    return {
      data : {
        "playing" : {
          "src" : "",
          "title" : "Select streamer to get records , pls.",
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
