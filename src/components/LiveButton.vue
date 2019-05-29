<template>
<div class="LiveButton"><span class="LiveButtonCircle">●</span>&nbsp;Live</div>
</template>

<script>
export default {
  name: 'LiveButton',
  props:{}
}
</script>

<style>
    .LiveButton{
        width: 100px;
        height: 20px;
        background: #222;
        color:white;
        animation-name: LiveButton;
        animation-duration: 2s;
        animation-iteration-count: infinite;
    }
    .LiveButtonCircle{
        color: red;
    }
    @keyframes LiveButton{
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
