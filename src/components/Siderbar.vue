<template>
  <div class="siderbar">
        <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse" background-color="#545c64" select="handSelect" :default-active="$route.path" router>
            <template v-for="item in tabData">
                <el-menu-item :index="item.router" :key="item.id">
                    <i :class="item.icon"></i>
                    <span slot="title">{{item.name}}</span>
                    <!-- <router-link to="/reset"></router-link> -->
                    <!-- <router-link :to="item.router"></router-link> -->
                </el-menu-item>            
            </template>
        </el-menu>    
  </div>
</template>

<script>

export default {
  name:"Siderbar",
    data() {
      return {
        isCollapse: false, //默认不折叠
        tabData:[
            {
                icon:'el-icon-unlock',
                id:1,
                name:'电子围栏',
                router:'/shape'
            },
            {
                icon:'el-icon-bicycle',
                id:2,
                name:'回放轨迹',
                router:'/trajctory'
            },
            {
                icon:'el-icon-truck',
                id:3,
                name:'实时轨迹',
                router:'/realtime'
            },
            {
                icon:'el-icon-set-up',
                id:4,
                name:'回显围栏',
                router:'/reset'
            },
            {
                icon:'el-icon-mouse',
                id:5,
                name:'鼠标位置',
                router:'/mouseposition'
            },
            {
                icon:'el-icon-link',
                id:6,
                name:'测量距离',
                router:'/measure'
            },                                                            

        ]

      };
    },
    methods: {
      handSelect(key,path){
        console.log(key,"--key--",path,"===path===");
        


      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }    
}
</script>

<style lang="scss">
  .siderbar{
    display: block;
    position: absolute;
    left: 0;
    top: 60px;
    bottom: 0;
    overflow-y: scroll;
    width: 200px;
     background-color:#545C64;
     // hover #444B52
    .el-menu-vertical-demo{
      background-color: #545C64;
      padding-top: 20px;
    }
    .sidebar::-webkit-scrollbar {
        width: 0;
    }
    .el-menu-item{
      color: #ffffff;
      height: 70px;
    }
    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 250px;
    }
    .sidebar > ul {
        height: 100%;
    }    
    
  }

</style>