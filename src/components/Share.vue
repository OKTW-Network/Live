<template>
  <div id="Share">
    <label for="ShareField">Link :</label>
    <input id="ShareField" v-model="link" />
    <button id="CopyButton" @click="shareCopy">Copy</button>
  </div>
</template>

<script>
export default {
  name: "Share",
  props: { data: Object },
  data() {
    return {
      link: ""
    };
  },
  watch: {
    data: {
      handler() {
        this.setLink();
      },
      deep: true
    }
  },
  methods: {
    shareCopy() {
      document.querySelector("#ShareField").select();
      try {
        alert(
          "Link was copied " +
            (document.execCommand("copy") ? "successful !" : "unsuccessful :(")
        );
      } catch (err) {
        alert("OOPS , unable to copy :(");
      }
    },
    setLink() {
      var hash = this.data.nowPlayer == "live" ? "#live/" : "#record/";
      hash = hash + (this.data.nowPlayer == "live" ? this.data.livePlayer.name : this.data.recordPlayer.name);
      window.location.hash =
        hash == "" ? window.location.hash : hash.substring(1);
      this.link = location.href;
    }
  }
};
</script>
 
<style>
#Share {
  width: 100%;
  margin: 0 0 0.5em 0;
}
#ShareField {
  background: #111;
  border: 0px;
  margin: 2px;
  border-radius: 5px;
}
#CopyButton {
  background: #111;
  border: 0px;
  margin: 2px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
