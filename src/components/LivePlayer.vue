<template>
  <div class="LivePlayerDiv">
    <video id="LivePlayer" controls class="LivePlayer"  v-bind:src="live.src"/>
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
        <h4>
          Your Name :
          <input id="ViewerName" v-model="username" type="text">
        </h4>
        <h4>
          Bullet Screen :
          <input id="BulletScreenMessage" ref="BulletScreenMessage" @keyup.enter="sendBulletScreen" type="text">
          <button id="BulletScreenButton" @click="sendBulletScreen">發送</button>
        </h4>
      </div>
    </div>
  </div>
</template>

<script>
import BulletScreenMessage from "./BulletScreenMessage.vue";

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
    return { username: "", bulletScreens: [] };
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
    }
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
            this.liveHLS = new Hls({ liveDurationInfinity: true, liveSyncDurationCount: 0, liveMaxLatencyDurationCount: 3 }); // eslint-disable-line
            this.liveHLS.loadSource(url);
            this.liveHLS.attachMedia(player);
            this.liveHLS.on(Hls.Events.MANIFEST_PARSED, () => player.play()); // eslint-disable-line
          }, 100);
        }
        // Fuck you apple
        else if (player.canPlayType("application/vnd.apple.mpegurl")) {
          player.src = url;
          player.addEventListener("loadedmetadata", () => player.play());
        }
      },
      deep: true
    }
  },
  mounted() {
    const player = document.getElementById("LivePlayer");
    const url = this.live.src;

    if (Hls.isSupported()) { // eslint-disable-line
      this.liveHLS = new Hls({ liveDurationInfinity: true }); // eslint-disable-line

      this.liveHLS.loadSource(url);
      this.liveHLS.attachMedia(player);
      this.liveHLS.on(Hls.Events.MANIFEST_PARSED, () => player.play()); // eslint-disable-line
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
      const ws = (this.live.ws) ? this.live.ws : new WebSocket(wsServer);
      this.live.ws = ws;

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
        setTimeout(() => createWSConnection(that),2000);
      };
    }

    createWSConnection(this);
  }
};
</script>

<style>
.LivePlayerDiv {
  width: 80%;
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
@keyframes LivePlayer {
  0% {
    border: 3px solid #111;
  }
  50% {
    border: 3px solid #2f1111;
  }
  100% {
    border: 3px solid #111;
  }
}
</style>
