<template>
  <div class="LivePlayerDiv">
    <video ref="LivePlayer" controls class="LivePlayer">
      <source v-bind:src="live.src" type='application/x-mpegURL'/>
    </video>-->
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
import Hls from 'hls.js'
import fluidPlayer from 'fluid-player';

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
    return { username: "", bulletScreens: [], player: undefined };
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
  beforeDestory() {
    if (this.player) this.player.destroy()
  },
  watch: {
    username(newName) {
      this.live.ws.send(JSON.stringify({ method: "setName", name: this.username }));
      localStorage.username = newName;
    }
  },
  mounted() {
    this.player = fluidPlayer(this.$refs.LivePlayer, {
      modules: {
        configureHls: (options) => ({
          liveSyncDurationCount: 0,
          fetchSetup: context => new Request(context.url),
          ...options,
        }),
        onAfterInitHls: (hls) => {
          hls.on(Hls.Events.ERROR, (event, data) => { 
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR: 
                  // try to recover network error
                  console.log('fatal network error encountered, try to recover');
                  this.liveHLS.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR: 
                  console.log('fatal media error encountered, try to recover');
                  this.liveHLS.recoverMediaError();
                  break;
                default:
                  // cannot recover
                  this.liveHLS.destroy();
                  break;
              }
            }
          });

          // source https://github.com/fluid-player/fluid-player/issues/437
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            const instance = this.$refs.LivePlayer.id;

            this.player.videoSources = hls.levels.map((source, index) => {
              return {
                title: source.height ? `${source.height}p` : 'Source',
                index,
                isHD: source.height >= 720,
              };
            });

            if (this.player.videoSources.length !== 0) {
              this.player.videoSources.push({
                title: 'Auto',
                index: -1,
                isHD: false,
              })
            }

            this.player.videoSources.reverse();
            console.log(this.player.videoSources)

            const sourceChangeButton = document.querySelector(
              `#${instance}_fluid_control_video_source`
            );
            sourceChangeButton.style.display = 'inline-block';
            
            let appendSourceChange = false;
            const sourceChangeList = document.createElement('div');
            sourceChangeList.id = `${instance}_fluid_control_video_source_list`;
            sourceChangeList.classList.add('fluid_video_sources_list');
            sourceChangeList.style.display = 'none';

            this.player.videoSources.forEach((source) => {
              const sourceSelected =
                source.index === hls.currentLevel ? 'source_selected' : '';
              const hdElement = source.isHD
                ? '<sup style="color:#28B8ED" class="fp_hd_source"></sup>'
                : '';

              const sourceChangeDiv = document.createElement('div');
              sourceChangeDiv.id = `source_${instance}_${source.title}`;
              sourceChangeDiv.classList.add('fluid_video_source_list_item');
              sourceChangeDiv.innerHTML =
                `<span class="source_button_icon ${sourceSelected}"></span>${source.title}${hdElement}`;

              sourceChangeDiv.addEventListener('click', (event) => {
                event.stopPropagation();
                hls.nextLevel = source.index;
                this.player.openCloseVideoSourceSwitch();
              });

              sourceChangeList.appendChild(sourceChangeDiv);
              appendSourceChange = true;

            });
            
            if (appendSourceChange) {
              sourceChangeButton.appendChild(sourceChangeList);
              sourceChangeButton.addEventListener('click', () => {
                this.player.openCloseVideoSourceSwitch();
              });
            } else {
              document.querySelector(
                '.fluid_button_video_source'
              ).style.display = 'none';
            }
          });

          hls.on('hlsLevelSwitched', () => {
            const instance = this.$refs.LivePlayer.id;

            document
              .querySelector('.source_button_icon.source_selected')
              .classList.remove('source_selected');

            const currentLevelTitle = this.$refs.LivePlayer.videoSources.filter(
              (source) => source.index === hls.currentLevel
            )[0].title;
           
            document
              .querySelector(
                `#source_${instance}_${currentLevelTitle} .source_button_icon`
              )
              .classList.add('source_selected');
          });
        }
      },
      layoutControls: {
        primaryColor: "#28B8ED",
        fillToContainer: true,
        title: this.live.title,
        allowTheatre: false
      }
    });

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
@import "~fluid-player/src/css/fluidplayer.css";

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
