<template>
  <div class="RecordPlayerDiv">
    <video controls id="RecordPlayer" class="RecordPlayer" v-bind:src="video.src" v-bind:data-poster="video.poster"/>
    <h1>{{video.title}}</h1>
    <h3>{{video.subtitle}}</h3>
  </div>
</template>

<script>
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'

export default {
  name: "RecordPlayer",
  props: {
    video: Object
  },
  mounted() {
    const player = document.getElementById("RecordPlayer");
    new Plyr(player, {
      seekTime: 5,
      tooltips: { controls: true, seek: true },
      autoplay: true,
      invertTime: false,
      controls: ['play', 'current-time', 'progress', 'duration', 'mute', 'volume', 'settings', 'pip', 'fullscreen']
    });
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

.plyr__menu__container {
  background-color: rgba(0,0,0,0.5)
}

.plyr:not(:fullscreen) {
  box-shadow: 0 0 0 3px #111;
  border-radius: 10px;
  box-sizing: border-box;
}

.plyr:not(:fullscreen) .RecordPlayer {
  border-radius: 10px;
}

</style>
