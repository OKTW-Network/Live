<template>
    <div class="PlayerDiv">
        <video controls class="Player" v-bind:src="video.src"/>
        <h1>{{video.title}}</h1>
        <h3>{{video.subtitle}}</h3>
    </div>
</template>

<script>
export default {
  name: 'Player',
  props:{
    video : Object
  }
}
</script>

<style>
    .PlayerDiv{
        width: 80%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column;
    }
    .Player{
        width: 100%;
        border: 3px solid #111;
        border-radius: 10px;
    }
</style>
