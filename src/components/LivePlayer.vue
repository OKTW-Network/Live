<template>
  <div class="LivePlayerDiv">
    <video-js ref="LivePlayer" controls class="LivePlayer vjs-default-skin vjs-big-play-centered">
      <source v-bind:src="live.src" type='application/x-mpegURL'/>
    </video-js>
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
import BulletScreenMessage from "./BulletScreenMessage.vue";
import "video.js/dist/video-js.css";
import videojs from 'video.js';
import 'videojs-contrib-quality-levels';
import 'videojs-hls-quality-selector';
import "videojs-hotkeys";
import 'videojs-mobile-ui/dist/videojs-mobile-ui.css';
import 'videojs-mobile-ui';

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
    return { username: "", bulletScreens: [], player: null };
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
    }
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  },
  mounted() {
    this.player = videojs(this.$refs.LivePlayer, {
      poster: this.live.poster,
      autoPlay: 'play',
      fluid: true,
      liveui: true,
      plugins: {
        hotkeys: {
          enableModifiersForNumbers: false
        },
      },
    });
    this.player.hlsQualitySelector({
      displayCurrentQuality: true,
    });

    this.player.mobileUi({
      fullscreen: {
        disabled: true
      },
      touchControls: {
        seekSeconds: 5,
      }
    })

    if (localStorage.username) {
      this.username = localStorage.username;
    }

    const createWSConnection = (that) => {
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

      ws.onclose = () => {
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
  overflow: hidden;
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

/* Overwrite default text color */
.vjs-selected > .vjs-menu-item-text {
  color: black;
}

.vjs-quality-selector {
  width: 6em !important;
}
</style>
