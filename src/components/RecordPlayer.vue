<template>
  <div class="RecordPlayerDiv">
    <video controls autoplay ref="RecordPlayer" class="RecordPlayer video-js vjs-default-skin vjs-big-play-centered">
      <source v-bind:src="video.src" type='video/mp4'/>
    </video>
    <h1>{{video.title}}</h1>
    <h3>{{video.subtitle}}</h3>
  </div>
</template>

<script>
import "video.js/dist/video-js.css";
import videojs from 'video.js';
import "videojs-hotkeys";
import 'videojs-mobile-ui/dist/videojs-mobile-ui.css';
import 'videojs-mobile-ui';

export default {
  name: "RecordPlayer",
  props: {
    video: Object
  },
  data() {
    return {
      player: null
    }
  },
  mounted() {
    this.player = videojs(this.$refs.RecordPlayer, {
      poster: this.video.poster,
      fluid: true,
      playbackRates: [0.25, 0.5, 1, 1.5, 2, 4],
      plugins: {
        hotkeys: {
          enableModifiersForNumbers: false
        },
      },
    });

    this.player.mobileUi({
      fullscreen: {
        disabled: true
      },
      touchControls: {
        seekSeconds: 5,
      }
    })
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
};
</script>

<style>
.RecordPlayerDiv {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
}
.RecordPlayer {
  max-width: 100%;
}
.RecordPlayer:not(:fullscreen) {
  box-shadow: 0 0 0 3px #111;
  border-radius: 10px;
  box-sizing: border-box;
  overflow: hidden;
}

/* Use positive time display */
.RecordPlayer > .vjs-control-bar > .vjs-time-control.vjs-current-time {
  display: block;
}
.RecordPlayer > .vjs-control-bar > .vjs-time-control.vjs-time-divider {
  display: block;
}
.RecordPlayer > .vjs-control-bar > .vjs-time-control.vjs-duration {
  display: block;
}
.RecordPlayer > .vjs-control-bar > .vjs-time-control.vjs-remaining-time {
  display: none;
}
</style>
