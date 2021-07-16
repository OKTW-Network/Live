<template>
  <div @click="emitClick" class="RecordDiv">
    <img class="RecordThumb" loading="lazy" v-bind:src="record.thumbSrc">
    <div class="RecordDuration">{{getDuration}}</div>
    <div class="RecordPublishTime">{{getPublishTime}}</div>
  </div>
</template>

<script>
export default {
  name: "Record",
  props: {
    record: Object
  },
  methods: {
    emitClick() {
      this.record.publishTimeText = this.getPublishTime;
      this.record.durationText = this.getDuration;
      this.$emit("click", "record", this.record);
    }
  },
  computed: {
    getPublishTime() {
      function twoNum(num) {
        if (num.toString().length == 1) {
          return "0" + num;
        } else {
          return num;
        }
      }
      return `${twoNum(this.record.publishTime.getFullYear())}-${twoNum(
        this.record.publishTime.getMonth() + 1
      )}-${twoNum(this.record.publishTime.getDate())} ${twoNum(
        this.record.publishTime.getHours()
      )}:${twoNum(this.record.publishTime.getMinutes())}:${twoNum(
        this.record.publishTime.getSeconds()
      )}`;
    },
    getDuration() {
      var sec_num = parseInt(this.record.duration);
      var hours = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - hours * 3600) / 60);
      var seconds = sec_num - hours * 3600 - minutes * 60;
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      return hours + ":" + minutes + ":" + seconds;
    }
  }
};
</script>

<style>
.RecordDiv {
  cursor: pointer;
  margin: 10px;
  border: #111 solid 3px;
  border-radius: 5px;
}

.RecordDuration {
  background: #444;
  text-align: center;
  color: white;
  font-size: 30px;
}

.RecordPublishTime {
  text-align: center;
  color: white;
  font-size: 15px;
}

.RecordThumb {
  width: 100%;
}

@media screen and (orientation: portrait) {
  .RecordDiv {
    min-width: 60%;
    width: 60%;
  }
}

@media screen and (orientation: landscape) {
  .RecordDiv {
    min-width: 15%;
    width: 15%;
  }
}
</style>
