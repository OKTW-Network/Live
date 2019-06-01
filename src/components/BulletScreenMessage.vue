<template>
  <div
    id="FloatingMessage"
    ref="Message"
  >{{bulletScreen.sentFrom}} : {{bulletScreen.msg}}</div>
</template>

<script>
export default {
  name: "BulletScreenMessage",
  props: { bulletScreen: Object },
  mounted() {
    function getRandom(min,max){
      return(Math.floor(Math.random() * (max - min + 1) + min));
    }
      this.$refs.Message.style.top = getRandom(0, 80) + "%";
      this.$refs.Message.style.left = "100%";
      this.$refs.Message.style.fontSize = (getRandom(10, 40) / 10) + "em";
      this.$refs.Message.style.transition = "25s";
      this.$refs.Message.style.whiteSpace = "nowrap";
      setTimeout(()=>{
        this.$refs.Message.style.left = "-200%";
      },100)
      setTimeout(()=>{
        this.$emit("deleteMessage",this.bulletScreen.uuid)
      },25000)
  }
};
</script>
 
<style>
#FloatingMessage {
  position: fixed;
  font-size: 2em;
  text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000,
    2px 2px 0 #000;
}
</style>
