<template>
  <div class="RecordPlayerDiv">
    <video controls autoplay ref="RecordPlayer" class="RecordPlayer video-js vjs-default-skin vjs-big-play-centered" v-bind:data-poster="video.poster">
      <source src="https://live.oktw.one/record/james58899-1662217396.mp4" type='video/mp4'/>
      <!-- <source v-bind:src="video.src" type='video/mp4'/> -->
    </video>
    <h1>{{video.title}}</h1>
    <h3>{{video.subtitle}}</h3>
  </div>
</template>

<script>
import "video.js/dist/video-js.css";
import videojs from 'video.js';

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
    this.player = videojs(this.$refs.RecordPlayer, { fluid: true });
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
</style>
