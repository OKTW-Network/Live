<template>
    <div class="LivePlayerDiv">
        <video controls class="LivePlayer" v-bind:src="live.src"/>
        <h1>{{live.title}}</h1>
        <h3>{{live.subtitle}}</h3>
    </div>
</template>

<script>
export default {
  name: 'LivePlayer',
  props:{
    live : Object
  }
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
        border: 3px solid #111;
        border-radius: 10px;
    }
</style>
