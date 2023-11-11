<template>
  <div class="LivePlayerDiv">
    <video id="LivePlayer" controls class="LivePlayer"  v-bind:src="live.src"/>
    <div class="QualityButtons" v-if="qualityList.length > 1">
      <button class="QualityButton" value="-1" :disabled="selectedQuality == -1" @click="changeQuality">Auto</button>
      <button class="QualityButton" v-for="(quality, index) in qualityList" :key="quality" :value="index"
        :disabled="selectedQuality == index" @click="changeQuality">{{quality}}</button>
    </div>
    <BulletScreenMessage
      v-for="bulletScreen in bulletScreens"
      v-bind:bulletScreen="bulletScreen"
      v-on:deleteMessage="deleteMessage"
      :key="bulletScreen.uuid"
    />
    <div class="LivePlayerCols">
      <div class="LivePlayerRow">
        <h1>{{live.title}}</h1>
        <h3>{{live.subtitle}}</h3>
      </div>
      <div class="LivePlayerRow">
        <h3>Viewer Count : {{liveChannel.nowViewerCount}}</h3>
        <div class="BulletInput">
          <label for="ViewerName">Your Name :</label>
          <input id="ViewerName" v-model="username" type="text">
        </div>
        <div class="BulletInput">
          <label for="BulletScreenMessage">Bullet Screen :</label>
          <input id="BulletScreenMessage" ref="BulletScreenMessage" @keyup.enter="sendBulletScreen" type="text">
          <button id="BulletScreenButton" @click="sendBulletScreen">Send</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const BulletScreenMessage = () => import("./BulletScreenMessage.vue");

export default {
  name: "LivePlayer",
  props: {
    live: Object,
    liveChannel: Object
  },
  components: {
    BulletScreenMessage
  },
  data() {
    return { username: "", bulletScreens: [], qualityList: [], selectedQuality: -1 };
  },
  methods: {
    sendBulletScreen() {
      if (this.$refs.BulletScreenMessage.value !== "") {
        this.live.ws.send(
          JSON.stringify({
            method: "sendBulletMessage",
            msg: this.$refs.BulletScreenMessage.value
          })
        );
      }
      this.$refs.BulletScreenMessage.value = "";
    },
    deleteMessage(uuid) {
      this.bulletScreens = this.bulletScreens.filter(i => i.uuid != uuid);
    },
    changeQuality(quality) {
      this.selectedQuality = parseInt(quality.target.value);
    }
  },
  beforeDestory(){
    if(this.liveHLS)
      this.liveHLS.destroy();
  },
  watch: {
    username(newName) {
      this.live.ws.send(JSON.stringify({ method: "setName", name: this.username }));
      localStorage.username = newName;
    },
    live: {
      handler(newVal) { // eslint-disable-line
        const url = this.live.src;
        const player = document.getElementById("LivePlayer");

        this.live.ws.send(
          JSON.stringify({ method: "joinChannel", channelName: this.live.name })
        );

        if (Hls.isSupported()) { // eslint-disable-line
          this.liveHLS.destroy();
          setTimeout(() => {
            this.liveHLS = new Hls({ liveSyncDurationCount: 0, fetchSetup: context => new Request(context.url)}); // eslint-disable-line
            this.liveHLS.on(Hls.Events.ERROR, (event, data) => { // eslint-disable-line
              if (data.fatal) {
                switch (data.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR: // eslint-disable-line
                    // try to recover network error
                    console.log('fatal network error encountered, try to recover');
                    this.liveHLS.startLoad(); // eslint-disable-line
                    break;
                  case Hls.ErrorTypes.MEDIA_ERROR: // eslint-disable-line
                    console.log('fatal media error encountered, try to recover');
                    this.liveHLS.recoverMediaError(); // eslint-disable-line
                    break;
                  default:
                    // cannot recover
                    this.liveHLS.destroy(); // eslint-disable-line
                    break;
                }
              }
            });

            // Workaround firefox codec test fail
            let origListener = this.liveHLS.listeners(Hls.Events.BUFFER_CODECS);
            this.liveHLS.removeAllListeners([Hls.Events.BUFFER_CODECS]);
            this.liveHLS.on(Hls.Events.BUFFER_CODECS, (event, data) => {
              if (data.video && data.video.container === "video/mp4" && data.video.codec && !MediaSource.isTypeSupported(`${data.video.container};codecs=${data.video.codec}`)) {
                data.video.codec = "avc1.640034"; // Override level to 5.2
              }
            });
            origListener.forEach(f => this.liveHLS.on(Hls.Events.BUFFER_CODECS, f));

            this.liveHLS.loadSource(url);
            this.liveHLS.attachMedia(player);
            this.liveHLS.on(Hls.Events.MANIFEST_PARSED, (_, manifest) => { // eslint-disable-line
              player.play()
              this.qualityList = manifest.levels.map(i => i.height ? `${i.height}p (${i.bitrate / 1000}kbps)` : "Source")
              if (localStorage.quality) this.selectedQuality = localStorage.quality
            });
          }, 100);
        }
        // Fuck you apple
        else if (player.canPlayType("application/vnd.apple.mpegurl")) {
          player.src = url;
          player.addEventListener("loadedmetadata", () => player.play());
        }
      },
      deep: true
    },
    selectedQuality(newQuality) {
      if (this.liveHLS.levels.length > newQuality) {
        localStorage.quality = newQuality;
        this.liveHLS.nextLevel = parseInt(newQuality);
      }
    }
  },
  mounted() {
    const player = document.getElementById("LivePlayer");
    const url = this.live.src;

    if (Hls.isSupported()) { // eslint-disable-line
      this.liveHLS = new Hls({ liveSyncDurationCount: 0, fetchSetup: context => new Request(context.url)}); // eslint-disable-line
      this.liveHLS.on(Hls.Events.ERROR, (event, data) => { // eslint-disable-line
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR: // eslint-disable-line
              // try to recover network error
              console.log('fatal network error encountered, try to recover');
              this.liveHLS.startLoad(); // eslint-disable-line
              break;
            case Hls.ErrorTypes.MEDIA_ERROR: // eslint-disable-line
              console.log('fatal media error encountered, try to recover');
              this.liveHLS.recoverMediaError(); // eslint-disable-line
              break;
            default:
              // cannot recover
              this.liveHLS.destroy(); // eslint-disable-line
              break;
          }
        }
      });

      // Workaround firefox codec test fail
      let origListener = this.liveHLS.listeners(Hls.Events.BUFFER_CODECS);
      this.liveHLS.removeAllListeners([Hls.Events.BUFFER_CODECS]);
      this.liveHLS.on(Hls.Events.BUFFER_CODECS, (event, data) => {
        if (data.video && data.video.container === "video/mp4" && data.video.codec && !MediaSource.isTypeSupported(`${data.video.container};codecs=${data.video.codec}`)) {
          data.video.codec = "avc1.640034"; // Override level to 5.2
        }
      });
      origListener.forEach(f => this.liveHLS.on(Hls.Events.BUFFER_CODECS, f));

      this.liveHLS.loadSource(url);
      this.liveHLS.attachMedia(player);
      this.liveHLS.on(Hls.Events.MANIFEST_PARSED, (_, manifest) => { // eslint-disable-line
        const play = player.play()
        if (play) play.catch((error) => {
          if (error.name === "NotAllowedError") {
            player.muted = true;
            player.play();
          }
        });
        this.qualityList = manifest.levels.map(i => i.height ? `${i.height}p (${i.bitrate / 1000}kbps)` : "Source")
        if (localStorage.quality) this.selectedQuality = localStorage.quality
      });
    }
    // Fuck you apple
    else if (player.canPlayType("application/vnd.apple.mpegurl")) {
      player.src = url;
      player.addEventListener("loadedmetadata", () => player.play());
    }

    if (localStorage.username) {
      this.username = localStorage.username;
    }

    function createWSConnection(that) {
      const wsServer = "wss://live.oktw.one/ws";
      const ws = (that.live.ws == null) ? new WebSocket(wsServer) : that.live.ws;
      that.live.ws = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({ method: "setName", name: that.username }));
        ws.send(
          JSON.stringify({ method: "joinChannel", channelName: that.live.name })
        );
      };

      ws.onmessage = e => {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case "channelData":
            that.$emit("liveUpdate", data);
            break;
          case "bulletScreenMessage":
            that.bulletScreens.push(data);
            break;
          default:
            break;
        }
      };

      ws.onclose = () => { // eslint-disable-line
        that.live.ws = null;
        setTimeout(() => createWSConnection(that),2000);
      };
    }

    createWSConnection(this);
  }
};
</script>

<style>
.LivePlayerDiv {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
}
.LivePlayerCols {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  flex-direction: row;
}
.LivePlayerRow {
  width: 100%;
}
.LivePlayer {
  max-width: 100%;
}
.LivePlayer:not(:fullscreen) {
  border-radius: 10px;
  animation-name: LivePlayer;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  box-sizing: border-box;
}
.QualityButtons {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.QualityButton {
  color: #111;
  flex: 1;
}
#ViewerName {
  background: #111;
  border: 0px;
  margin: 2px;
  border-radius: 5px;
}
#BulletScreenMessage {
  background: #111;
  border: 0px;
  margin: 2px;
  border-radius: 5px;
}
#BulletScreenButton {
  background: #111;
  border: 0px;
  margin: 2px;
  border-radius: 5px;
  cursor: pointer;
}
.BulletInput {
    margin: 0.5em 0;
}
@keyframes LivePlayer {
  0% {
    box-shadow: 0 0 0 3px #111;
  }
  50% {
    box-shadow: 0 0 0 3px #2f1111;
  }
  100% {
    box-shadow: 0 0 0 3px #111;
  }
}
</style>
