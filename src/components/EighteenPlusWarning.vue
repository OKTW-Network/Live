<template>
  <div v-bind:style="EighteenPlusWarningClassObject" id="EighteenPlusWarning">
    <img src="img/18.svg" id="EighteenPlusWarningLogo" />
    <button
      v-bind:style="AcceptButtonClassObject"
      class="EighteenPlusWarningButton"
      id="AcceptButton"
      @click="Accept"
    >進入 Enter</button>
    <button class="EighteenPlusWarningButton" id="DeclinedButton" @click="Declined">母湯 Nope</button>
  </div>
</template>

<script>
export default {
  name: "EighteenPlusWarning",
  methods: {
    Accept() {
      if (Math.round(this.acceptScale * 10) != 10) {
        this.acceptScale -= 0.2;
      } else {
        localStorage.eighteenPlus = true;
        this.accepted = true;
      }
    },
    Declined() {
      this.acceptScale += 0.2;
    }
  },
  data() {
    return {
      acceptScale: 1,
      accepted: (localStorage.eighteenPlus) ? (localStorage.eighteenPlus) : false
    };
  },
  computed: {
    AcceptButtonClassObject: function() {
      return {
        transform: `scale(${this.acceptScale})`
      };
    },
    EighteenPlusWarningClassObject: function() {
      return {
        height: this.accepted ? "0%" : "100%",
        top: this.accepted ? "-100%" : "0"
      };
    }
  },
  props: {}
};
</script>

<style>
#EighteenPlusWarning {
  width: 100%;
  height: 100%;

  background: #000;

  transition: 1s;
  z-index: 999;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  overflow: auto;

  position: fixed;
  top: 0;
  left: 0;
}

.EighteenPlusWarningButton {
  cursor: pointer;
  transition: 0.2s;

  margin-top: 1em;
  border-radius: 10px;

  font-size: 40px;

  display: flex;
  justify-content: center;
  align-items: center;
}

#AcceptButton {
  background: #00cc66;
  color: black;
}

#DeclinedButton {
  background: #ff531a;
  color: black;
}

@media (min-width: 768px) {
  #EighteenPlusWarningLogo {
    width: 500px;
  }

  #AcceptButton {
    width: 500px;
    height: 70px;
  }

  #DeclinedButton {
    width: 500px;
    height: 70px;
  }
}
@media (max-width: 768px) {
  #EighteenPlusWarningLogo {
    width: 80vw;
  }

  #AcceptButton {
    width: 80vw;
    height: 70px;
  }

  #DeclinedButton {
    width: 80vw;
    height: 70px;
  }
}
</style>
