<template>
  <div class="errPage-container">
    <!--error code-->
    <err-code/>
    <!--error code-->
    <h3>Please click on the bug chart in the upper right corner</h3>
    <code>
      The current management background is basically in the form of spa, which enhances the user experience, but at the same time it will increase the possibility of page problems, and a small negligence will lead to the deadlock of the entire page. Fortunately, Vue official website provides a way to capture processing exceptions.
    </code>
    <a href="#">
      <img src='../../../documentImg/code1.png'>
    </a>
  
  </div>
</template>
<script>
import errCode from './errcode';
// import code1Img from
export default {
  components: { errCode },
  data() {
    return {

    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    }
  }
};
</script>
<style scoped>
.errPage-container {
  padding: 30px;
}
</style>
