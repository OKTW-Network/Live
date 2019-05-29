<template>
    <div class="LivePlayerDiv">
        <video ref="player" controls class="LivePlayer" v-bind:src="live.src"/>
        <h1>{{live.title}}</h1>
        <h3>{{live.subtitle}}</h3>
    </div>
</template>

<script>
export default {
  name: 'LivePlayer',
  props:{
    live : Object
  },
  watch: {
    '$props':{
      handler: function (val, oldVal) { 
        console.log('watch', val); // eslint-disable-line
        console.log('watchold', oldVal); // eslint-disable-line
      },
      deep: true
    }
  },
  mounted() {
    var hls = new Hls(); // eslint-disable-line
    hls.loadSource(this.live.src);
    hls.attachMedia(this.player);
  },
}
</script>

<style>
    .LivePlayerDiv{
        width: 80%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column;
    }
    .LivePlayer{
        width: 100%;
        border-radius: 10px;
        animation-name: LivePlayer;
        animation-duration: 2s;
        animation-iteration-count: infinite;
    }
    @keyframes LivePlayer{
        0% {
            border: 3px solid transparent;
        }
        50%{
            border: 3px solid #ff4444;
        }
        100%{
            border: 3px solid transparent;
        }
    }
</style>
