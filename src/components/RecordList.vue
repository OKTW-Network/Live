<template>
  <div class="RecordListDiv" ref="viewBox">
    <Record
      v-for="record in records"
      v-on:click="emitClick"
      v-bind:record="record"
      :key="record.src"
    />
  </div>
</template>

<script>
import Record from "./Record.vue";

export default {
  name: "RecordList",
  components: {
    Record
  },
  methods: {
    emitClick(type, data) {
      this.$emit("click", type, data);
    },
    mousemove(event) {
      const viewBox = this.$refs.viewBox;
      const detail = event.wheelDelta || event.detail;
      if (detail > 0) {
        this.step = -100;
      } else {
        this.step = 100;
      }
      viewBox.scrollLeft += this.step;
      event.preventDefault();
    }
  },
  mounted() {
    this.$refs.viewBox.addEventListener('wheel', this.mousemove);
  },
  props: {
    records: Array
  }
};
</script>

<style>
.RecordListDiv {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: row;
  scrollbar-color: #555 #f5f5f5;
  scrollbar-width: thin;
}
.RecordListDiv::-webkit-scrollbar {
  height: 10px;
  border-radius: 10px;
  background-color: #f5f5f5;
}
.RecordListDiv::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}
.RecordListDiv::-webkit-scrollbar-thumb {
  background-color: #555;
}
</style>
