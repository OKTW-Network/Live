<template>
  <div id="Share">
    Link : 
    <input id="ShareField" v-model="shareLink">
    <button id="CopyButton">Copy</button>
  </div>
</template>

<script>
export default {
  name: "Divider",
  props: { data: Object },
  computed: {
    shareLink() {
      var hash = this.data.nowPlayer == "live" ? "#Live/" : "#Record/"
      hash = hash + this.data.nowPlayer == "live" ? this.data["livePlayer"]["name"] : this.data["recordPlayer"]["src"];
      window.location.hash = hash.substring(1);
      return(location.href + hash)
    }
  }
};
</script>
 
<style>
#Share{
  
  width:80%;
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
