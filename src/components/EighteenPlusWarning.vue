<template>
  <div v-bind:style="EighteenPlusWarningClassObject" id="EighteenPlusWarning">
    <img src="img/18.svg" id="EighteenPlusWarningLogo"></img>
    <button v-bind:style="AcceptButtonClassObject" class="EighteenPlusWarningButton" id="AcceptButton" @click="Accept">接受 Accept</button>
    <button class="EighteenPlusWarningButton" id="DeclinedButton" @click="Declined">拒絕 Declined</button>
  </div>
</template>

<script>
export default {
  name: 'EighteenPlusWarning',
  methods: {
    Accept(){
      if(Math.round(this.data.acceptScale * 10) != 10){
        this.data.acceptScale -= 0.2;
      }else{
        this.data.accepted = true;
      }
    },
    Declined(){
      this.data.acceptScale += 0.2;
    }
  },
  data(){
    return {
      data : {
        acceptScale : 1,
        accepted: false
      }
    }
  },
  computed: {
    AcceptButtonClassObject: function () {
      return {
        'transform': `scale(${this.data.acceptScale})`
      }
    },
    EighteenPlusWarningClassObject: function () {
      return {
        'height': this.data.accepted ? "0%" : "100%",
        'top': this.data.accepted ? "-100%" : "0",
      }
    }
  },
  props:{}
}
</script>

<style>
  #EighteenPlusWarning{
    width:100%;
    height:100%;

    background:#000;
    
    transition:1s;
    z-index:999;

    display:flex;
    justify-content:center;
    align-items: center;
    flex-direction: column;

    position:fixed;
    top:0;
    left:0;
  }
  
  .EighteenPlusWarningButton{
    cursor:pointer;
    transition:0.2s;

    margin:0.5em;
    border-radius:10px;

    font-size:40px;

    display:flex;
    justify-content:center;
    align-items: center;
  }

  #AcceptButton{
    background:#00cc66;
    color:black;
  }
  
  #DeclinedButton{
    background:#ff531a;
    color:black;
  }

  @media (min-width: 768px) { 
    #EighteenPlusWarningLogo{
      width:500px;
    }

    #AcceptButton{
      width:500px;
      height:70px;
    }

    #DeclinedButton{
      width:500px;
      height:70px;
    }
  }
  @media (max-width: 768px) {
    #EighteenPlusWarningLogo{
      width:80vw;
    }

    #AcceptButton{
      width:80vw;
      height:70px;
    }

    #DeclinedButton{
      width:80vw;
      height:70px;
    }
  }
</style>
