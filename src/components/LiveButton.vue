<template>
    <div class="LiveButton" @click="emitClick" >
        <span class="LiveButtonCircle">●</span>&nbsp;&nbsp;Live
    </div>
</template>

<script>
export default {
  name: 'LiveButton',
  props:{},
  methods: {
      emitClick(){
          this.$emit('click', 'streamerLive', {}) 
      }
  }
}
</script>

<style>
    .LiveButton{
        cursor: pointer;

        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;

        width: 80px;
        height: 30px;

        background: #222;
        color: #fff;

        border-radius: 10px;

        animation-name: LiveButton;
        animation-duration: 2s;
        animation-iteration-count: infinite;
    }
    .LiveButtonCircle{
        color: red;
    }
    @keyframes LiveButton{
        0% {
            border: 2px solid transparent;
        }
        50%{
            border: 2px solid red;
        }
        100%{
            border: 2px solid transparent;
        }
    }
</style>
