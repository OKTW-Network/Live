<template>
  <div class="RecordPlayerDiv">
    <video controls ref="RecordPlayer" class="RecordPlayer"  v-bind:data-poster="video.poster">
      <source v-bind:src="video.src" type='video/mp4'/>
    </video>
    <h1>{{video.title}}</h1>
    <h3>{{video.subtitle}}</h3>
  </div>
</template>

<script>
import fluidPlayer from 'fluid-player';

export default {
  name: "RecordPlayer",
  props: {
    video: Object
  },
  mounted() {
    this.player = fluidPlayer(this.$refs.RecordPlayer, {
      layoutControls: {
        primaryColor: "#28B8ED",
        fillToContainer: true,
        title: this.video.title,
        playbackRateEnabled: true,
        allowTheatre: false,
      }
    });
  },
  data() {
    return { player: undefined }
  }
};
</script>

<style>
@import "~fluid-player/src/css/fluidplayer.css";

.RecordPlayerDiv {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
}

.fluid_video_wrapper:not(:fullscreen) {
  box-shadow: 0 0 0 3px #111;
  border-radius: 10px;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
