<template>
    <div class="StreamerDiv">
        <Divider/>
        <h2 class="StreamerName" @click="emitClick('streamer',{})">{{streamer.name}}</h2>
        <RecordList v-on:click="emitClick" v-bind:records="streamer.records"/>
    </div>
</template>

<script>
import RecordList from './RecordList.vue'
import Divider from './Divider.vue'

export default {
  name: 'Streamer',
  components: {
      RecordList,
      Divider
  },
  methods: {
      emitClick(type,data){
          data.streamer = this.streamer;
          this.$emit('click', type, data)
      }
  },
  props:{
    streamer : Object
  }
}
</script>

<style>
    .StreamerDiv{
        width: 80%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column;
    }
    .StreamerName{
        cursor: pointer;
    }
</style>
