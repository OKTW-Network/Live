<template>
  <perfect-scrollbar class="RecordListDiv" ref="viewBox">
    <Record
      v-for="record in records"
      v-on:click="emitClick"
      v-bind:record="record"
      :key="record.src"
    />
  </perfect-scrollbar>
</template>

<script>
import Record from "./Record.vue";
import { PerfectScrollbar } from "vue2-perfect-scrollbar";

export default {
  name: "RecordList",
  components: {
    Record,
    PerfectScrollbar,
  },
  methods: {
    emitClick(type, data) {
      this.$emit("click", type, data);
    },
    mousemove(event) {
      const viewBox = this.$refs.viewBox.$el;
      const viewBox_width = viewBox.scrollWidth - viewBox.clientWidth;
      if (event.deltaY < 0) {
        this.step = -100;
      } else {
        this.step = 100;
      }
      viewBox.scrollLeft += this.step;
      if (viewBox.scrollLeft == 0) {
        return;
      } else if (viewBox.scrollLeft == viewBox_width) {
        return;
      }
      // event.preventDefault();
    },
  },
  mounted() {
    this.$refs.viewBox.$el.addEventListener("wheel", this.mousemove);
    this.$refs.viewBox.ps.update();
  },
  props: {
    records: Array,
  },
};
</script>

<style>
.RecordListDiv {
  width: 100%;
  overflow: hidden;
  /* overflow-x: auto; */
  /* overflow-y: hidden; */
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: row;
  position: relative;
  /* scrollbar-color: #555 #f5f5f5;
  scrollbar-width: thin; */
}
/*
.RecordListDiv::-webkit-scrollbar {
  height: 10px;
  border-radius: 10px;
  background-color: #f5f5f5;
}
.RecordListDiv::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}
.RecordListDiv::-webkit-scrollbar-thumb {
  background-color: rgb(109, 104, 104);
}
*/
</style>
<style src="vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"/>