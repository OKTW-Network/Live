<template>
  <div class="StreamerDiv">
    <Divider/>
    <div class="StreamerTitle">
      <h2 class="StreamerName" @click="emitClick('streamer',{})">
        <div class="triangle" :class="(streamer.records.length === 0)?'rotate':''">▼</div>
        &nbsp; {{streamer.name}}
      </h2>
      <!-- <h2 class="StreamerName" v-if="streamer.records.length === 0" @click="emitClick('streamer',{})">{{streamer.name}} &nbsp; ►</h2>
      <h2 class="StreamerName" v-if="streamer.records.length !== 0" @click="emitClick('streamer',{})">{{streamer.name}} &nbsp; ▼</h2>-->
      <LiveButton v-if="streamer.live" v-on:click="emitClick"/>
    </div>
    <RecordList v-on:click="emitClick" v-bind:records="streamer.records"/>
  </div>
</template>

<script>
const RecordList = () => import("./RecordList.vue");
const Divider = () => import("./Divider.vue");
const LiveButton = () => import("./LiveButton.vue");

export default {
  name: "Streamer",
  components: {
    RecordList,
    Divider,
    LiveButton
  },
  methods: {
    emitClick(type, data) {
      data.streamer = this.streamer;
      this.$emit("click", type, data);
    }
  },
  props: {
    streamer: Object
  }
};
</script>

<style>
.StreamerDiv {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
}
.StreamerName {
  cursor: pointer;
  margin-right: 1em;
}
.StreamerName .triangle {
  transition-duration: 250ms;
  display: inline-block;
}
.StreamerName .triangle.rotate {
  transform: rotate(-90deg);
}
.StreamerTitle {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
}
</style>
