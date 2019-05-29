/* eslint-disable */

<template>
    <div class="LivePlayerDiv">
        <video id="LivePlayer" controls class="LivePlayer" v-bind:src="live.src"/>
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
    'live': {
        handler(newVal) {
            console.log("HLS.JS source changed.")

            const url = this.live.src;
            const player = document.getElementById('LivePlayer')

            if(Hls.isSupported()) {
                this.liveHLS.destroy();
                setTimeout(()=>{
                    this.liveHLS = new Hls({liveDurationInfinity: true})
                    this.liveHLS.loadSource(url)
                    this.liveHLS.attachMedia(player)
                    this.liveHLS.on(Hls.Events.MANIFEST_PARSED, () => player.play())
                },100)
            }
            // Fuck you apple
            else if (player.canPlayType('application/vnd.apple.mpegurl')) {
                player.src = url
                player.addEventListener('loadedmetadata', () => player.play())
            }
        },
        deep: true
    }
  },
  mounted() {
    const player = document.getElementById('LivePlayer')
    const url = this.live.src;

    if(Hls.isSupported()) { // eslint-disable-line
        this.liveHLS = new Hls({liveDurationInfinity: true}) // eslint-disable-line

        this.liveHLS.loadSource(url)
        this.liveHLS.attachMedia(player)
        this.liveHLS.on(Hls.Events.MANIFEST_PARSED, () => player.play())
    }
    // Fuck you apple
    else if (player.canPlayType('application/vnd.apple.mpegurl')) {
        player.src = url
        player.addEventListener('loadedmetadata', () => player.play())
    }
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
            border: 3px solid #111;
        }
        50%{
            border: 3px solid #2f1111;
        }
        100%{
            border: 3px solid #111;
        }
    }
</style>
