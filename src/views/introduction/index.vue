<template>
  <div class="app-container">
    <div class="wrapper">
      <el-row>
        <el-col :span="12" :offset="6">
          <p>Welcome – This is dAppBox, your email and distributed content organizer</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="6">
          <img
            class="welcome-img"
            src="../../assets/images/logo.png" 
            alt="logo"

          >
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<style scoped>
.app-container {
  color: #000;
  font-size:20px;
  padding: 100px 0;
}
.welcome-img{
    width: 500px;
}
</style>
