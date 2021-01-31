<template>
  <div class="RecordPlayerDiv">
    <video controls class="RecordPlayer" v-bind:src="video.src"/>
    <h1>{{video.title}}</h1>
    <h3>{{video.subtitle}}</h3>
  </div>
</template>

<script>

export default {
  name: "RecordPlayer",
  props: {
    video: Object
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
  align-self: center;
}
.RecordPlayer:not(:fullscreen) {
  border: 3px solid #111;
  border-radius: 10px;
}
</style>
