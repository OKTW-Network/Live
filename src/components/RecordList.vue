<template>
    <div class="RecordListDiv">
        <Record v-for="record in records" v-on:click="emitClick" v-bind:record="record" :key="record.src"/>
    </div>
</template>

<script>
import Record from './Record.vue'

export default {
  name: 'RecordList',
  components: {
      Record
  },
  methods: {
      emitClick(type,data){
          this.$emit('click', type, data)
      }
  },
  props:{
    records : Array
  }
}
</script>

<style>
    .RecordListDiv{
        width: 100%;
        overflow-x: scroll;
        overflow-y: hidden;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: row;
    }
    .RecordListDiv::-webkit-scrollbar
    {
        height: 20px;
        border-radius: 10px;
        background-color: #F5F5F5;
    }
    .RecordListDiv::-webkit-scrollbar-track
    {
        border-radius: 10px;
        background-color: #F5F5F5;
    }
    .RecordListDiv::-webkit-scrollbar-thumb
    {
        border-radius: 10px;
        background-color: #555;
    }
</style>
