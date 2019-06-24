<template>
  <div id="Share">
    Link :
    <input id="ShareField" v-model="shareLink">
    <button id="CopyButton" @click="shareCopy">Copy</button>
  </div>
</template>

<script>
export default {
  name: "Divider",
  props: { data: Object },
  methods: {
    shareCopy() {
      document.querySelector("#ShareField").select();
      try {
        alert(
          "Link was copied " + document.execCommand("copy")
            ? "successful !"
            : "unsuccessful :("
        );
      } catch (err) {
        alert("OOPS , unable to copy :(");
      }
    }
  },
  computed: {
    shareLink() {
      var hash = this.data.nowPlayer == "live" ? "#live/" : "#record/";
      hash =
        hash + this.data.nowPlayer == "live"
          ? this.data["livePlayer"]["name"]
          : this.data["recordPlayer"]["src"];
      console.log(hash);
      window.location.hash =
        hash == "" ? window.location.hash : hash.substring(1);
      return location.href;
    }
  }
};
</script>
 
<style>
#Share {
  width: 80%;
  display: flex;
  justify-content: start;
  align-items: flex-start;
  flex-direction: row;
}
#ShareField {
  background: #111;
  border: 0px;
  margin: 2px;
  border-radius: 5px;
  width: 50%;
}
#CopyButton {
  background: #111;
  border: 0px;
  margin: 2px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
