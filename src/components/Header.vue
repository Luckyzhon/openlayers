<template>
  <div class="header">
    <div class="header-left">
      <div class="header-icon" @click="changSize">
        <i :class=" iconFalg ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'"></i>
      </div>
      <div class="header-title">
        <span><h3>Openlayers</h3></span>
      </div>
 
    </div>
    <div class="header-right">
      <ul>
        <li @click="fullscreenClick"><i class="el-icon-rank"></i></li>
      </ul>

    </div>
  </div>
</template>

<script>
export default {
  name:"Header",
  data(){
    return{
      iconFalg:true,


    }
  },
  methods:{
    changSize(){
      this.iconFalg = !this.iconFalg;

    },
    fullscreenClick(){
      console.log("点击全屏");
      
    }

  }
}
</script>

<style lang="scss">
 .header{
   position: relative;
   box-sizing: border-box;
   width: 100%;
   height: 60px;
   font-size: 22px;
   color: #ffffff;
   display:flex;
   justify-content: space-between;
   background-color:#1790ff;
   line-height: 60px;
   padding: 0 15px;
   .header-left{
     .header-icon{
       display: inline-block;
       width: 50px;

     }
     .header-title{
       display:inline-block;

     }


   }
   .header-right{

   }

 }


</style>