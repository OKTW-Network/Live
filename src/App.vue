<template>
  <div id="app">
    <EighteenPlusWarning @accept="Accept" />
    <RecordPlayer
      v-if="data.nowPlayer === 'record'  && data.eighteenPlus "
      v-bind:video="data.recordPlayer"
    />
    <LivePlayer
      v-if="data.nowPlayer === 'live' && data.eighteenPlus "
      v-bind:live="data.livePlayer"
      v-bind:liveChannel="data.liveChannel"
      v-on:liveUpdate="liveUpdate"
    />
    <Share v-bind:data="data" />
    <Streamer
      v-on:click="streamerClicked"
      v-for="streamer in data.streamers"
      v-bind:streamer="streamer"
      :key="streamer.name"
    />
  </div>
</template>

<script>
const LivePlayer = () => import("./components/LivePlayer.vue");
const RecordPlayer = () => import("./components/RecordPlayer.vue");
const Share = () => import("./components/Share.vue");
const Streamer = () => import("./components/Streamer.vue");
const EighteenPlusWarning = () => import("./components/EighteenPlusWarning.vue");

const dirURL = "/record/";
const liveURL = "/live/";

export default {
  name: "app",
  components: {
    LivePlayer,
    RecordPlayer,
    Share,
    Streamer,
    EighteenPlusWarning
  },
  async mounted() {
    const videos = await Promise.all(
      (await (await fetch(dirURL + "list.json")).json())
        .filter(
          i =>
            "format" in i &&
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
            src: dirURL + filename.substring(0, filename.length - 3) + "mp4",
            name: filename.substring(0, filename.length - 3) + "mp4"
          };
        })
    );

    videos.sort((a, b) =>
      a.publishTime > b.publishTime ? -1 : a.publishTime < b.publishTime ? 1 : 0
    );

    var streamers = new Map();
    videos.forEach(video => {
      if (streamers.has(video.streamer)) {
        streamers.get(video.streamer).unloadRecords.push(video);
      } else {
        streamers.set(video.streamer,{
          name: video.streamer,
          unloadRecords: [video],
          records: [],
          live: false
        })
      }
    });

    const pending = [];
    streamers.forEach((v,k) => {
      pending.push(
        fetch(`${liveURL}${k}.m3u8`)
          .then(res => v.live = res.ok)
          .catch(() => {})
      )
    })
    await Promise.allSettled(pending)
    streamers.forEach(i => this.data.streamers.push(i))

    if ((await fetch(`${liveURL}live.m3u8`)).ok) {
      this.data.streamers.unshift({
        name: "OKTW Live",
        unloadRecords: [],
        records: [],
        live: true
      });
    }
  },
  methods: {
    Accept() {
      this.data.eighteenPlus = true;
    },
    liveUpdate(data) {
      this.data.liveChannel = data;
    },
    streamerClicked(type, eventData) {
      if (type === "record") {
        this.data.nowPlayer = "record";
        this.data.recordPlayer.src = eventData.src;
        this.data.recordPlayer.name = eventData.name;
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
        this.data.livePlayer.name = eventData.streamer.name;
        this.data.livePlayer.src =
          eventData.streamer.unloadRecords.length === 0
            ? `${liveURL}live.m3u8`
            : `${liveURL}${eventData.streamer.name}.m3u8`;
        window.scrollTo(0, 0);
      }
    }
  },
  data() {
    var hashData = window.location.hash.substring(1).split("/");
    var mode = hashData.includes("record") ? "record" : "live";
    var tmpData = {
      eighteenPlus: localStorage.eighteenPlus
        ? localStorage.eighteenPlus
        : false,
      nowPlayer: mode,
      recordPlayer: {
        src: "",
        title: "Select streamer to get records , pls.",
        subtitle: ""
      },
      livePlayer: {
        src: "",
        title: "",
        name: "",
        subtitle: "",
        ws : null
      },
      liveChannel: {
        nowViewerCount: 0
      },
      streamers: []
    };
    if (tmpData["nowPlayer"] == "live") {
      tmpData["livePlayer"]["src"] =
        hashData.length == 2
          ? `${liveURL}${hashData[1]}.m3u8`
          : `${liveURL}live.m3u8`;
      tmpData["livePlayer"]["title"] =
        hashData.length == 2 ? `${hashData[1]}` : "OKTW Live";
      tmpData["livePlayer"]["name"] =
        hashData.length == 2 ? `${hashData[1]}` : "live";
    } else {
      tmpData["recordPlayer"]["src"] =
        hashData.length == 2 ? `${dirURL}${hashData[1]}` : "";
      tmpData["recordPlayer"]["name"] =
        hashData.length == 2 ? `${hashData[1]}` : "";
      tmpData["recordPlayer"]["title"] =
        hashData.length == 2
          ? `${hashData[1].split(".")[0].split("-")[0]}`
          : "";
      tmpData["recordPlayer"]["subtitle"] =
        hashData.length == 2
          ? (a => {
              function b(a) {
                return 1 == a.toString().length ? "0" + a : a;
              }
              var c = new Date(1e3 * parseInt(a));
              return `${b(c.getFullYear())}-${b(c.getMonth() + 1)}-${b(
                c.getDate()
              )} ${b(c.getHours())}:${b(c.getMinutes())}:${b(c.getSeconds())}`;
            })(`${hashData[1].split(".")[0].split("-")[1]}`)
          : "";
    }
    return {
      data: tmpData
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
  background: #222;
}
label {
  display: block;
}
#app {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 1280px;
  margin: 2vh auto 5vh auto;
}
</style>
