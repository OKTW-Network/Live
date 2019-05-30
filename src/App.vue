<template>
  <div id="app">
    <EighteenPlusWarning/>
    <RecordPlayer v-if="data.nowPlayer === 'record' " v-bind:video="data.recordPlayer"/>
    <LivePlayer v-if="data.nowPlayer === 'live' " v-bind:live="data.livePlayer"/>
    <Streamer
      v-on:click="streamerClicked"
      v-for="streamer in data.streamers"
      v-bind:streamer="streamer"
      :key="streamer.name"
    />
  </div>
</template>

<script>
import LivePlayer from "./components/LivePlayer.vue";
import RecordPlayer from "./components/RecordPlayer.vue";
import Streamer from "./components/Streamer.vue";
import EighteenPlusWarning from "./components/EighteenPlusWarning.vue";

export default {
  name: "app",
  components: {
    LivePlayer,
    RecordPlayer,
    Streamer,
    EighteenPlusWarning
  },
  async mounted() {
    const dirURL = "/record/";
    const videos = await Promise.all(
      (await (await fetch(dirURL + "/list.json")).json())
        .filter(
          i =>
            "format" in i &&
            i.format.format_name === "flv" &&
            i.format.size != 0
        )
        .map(async i => {
          const filename = i.format.filename.split("/").reverse()[0];
          return {
            streamer: filename.substring(0, filename.length - 15),
            publishTime: new Date(
              parseInt(
                filename.substring(filename.length - 14, filename.length - 4)
              ) * 1000
            ),
            thumbSrc:
              dirURL + filename.substring(0, filename.length - 3) + "png",
            duration: i.format.duration,
            src: dirURL + filename.substring(0, filename.length - 3) + "mp4"
          };
        })
    );

    videos.sort((a, b) =>
      a.publishTime > b.publishTime ? -1 : a.publishTime < b.publishTime ? 1 : 0
    );

    var streamers = {};
    videos.forEach(video => {
      if (video.streamer in streamers) {
        streamers[video.streamer].unloadRecords.push(video);
      } else {
        streamers[video.streamer] = {
          name: video.streamer,
          unloadRecords: [video],
          records: [],
          live: false
        };
      }
    });

    for (var streamerName in streamers) {
      streamers[streamerName].live = (await fetch(
        `/live/${streamerName}.m3u8`
      )).ok;
      this.data.streamers.push(streamers[streamerName]);
    }

    if ((await fetch(`/live/live.m3u8`)).ok) {
      this.data.streamers.unshift({
        name: "OKTW Live",
        unloadRecords: [],
        records: [],
        live: true
      });
    }
  },
  methods: {
    streamerClicked(type, eventData) {
      if (type === "record") {
        this.data.nowPlayer = "record";
        this.data.recordPlayer.src = eventData.src;
        this.data.recordPlayer.title = eventData.streamer.name;
        this.data.recordPlayer.subtitle = eventData.publishTimeText;
        window.scrollTo(0, 0);
      } else if (type === "streamer") {
        if (eventData.streamer.records.length == 0) {
          eventData.streamer.records = eventData.streamer.unloadRecords;
        } else {
          eventData.streamer.records = [];
        }
      } else if (type === "streamerLive") {
        this.data.nowPlayer = "live";
        this.data.livePlayer.title = eventData.streamer.name;
        this.data.livePlayer.src =
          eventData.streamer.unloadRecords.length === 0
            ? `/live/live.m3u8`
            : `/live/${eventData.streamer.name}.m3u8`;
        window.scrollTo(0, 0);
      }
    }
  },
  data() {
    var liveURL = window.location.hash
      ? `/live/${window.location.hash.substring(1)}.m3u8`
      : "/live/live.m3u8";
    var liveName = window.location.hash
      ? `${window.location.hash.substring(1)}`
      : "OKTW Live";
    return {
      data: {
        nowPlayer: "live",
        recordPlayer: {
          src: "",
          title: "Select streamer to get records , pls.",
          subtitle: ""
        },
        livePlayer: {
          src: liveURL,
          title: liveName,
          subtitle: ""
        },
        streamers: []
      }
    };
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Noto+Sans+TC");
* {
  font-family: "Noto Sans TC", sans-serif;
  font-weight: 100;
  color: white;
}
body {
  padding: 20px;
  padding-bottom: 100px;
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
