<template>
  <div class="meature">
    <div id="map"></div>
    
  </div>
</template>

<script>
import "ol/css";
import {Map,View,Overlay } from "ol";
import {Tile,Vector as VectorLayer} from "ol/layer";
import {OSM ,Vector as VectorSource} from "ol/source";
import {Style ,Fill ,Stroke ,Circle} from "ol/style";
import Feature from "ol/Feature";
import {Point , Polgon , LineString} from "ol/geom";
import {Draw } from "ol/interaction";
import {getArea , getLength } from "ol/sphere";

export default {
  data(){
    return{
      vectorSource:null,
      vectorLayer:null,
      map:null,
      mapView:null,
      sourceArr:[], //存储图层数据源
      draw:null, //绘制
      layersArr:[],  //存储图层
      featureArr:[], // 存储数据源中的要素
      heleTooltipElement:null,  //帮助工具提示元素
      helpTooltipOverlay:null,  //帮助工具提示覆盖层
      measureTooltipElement:null,  //测量工具提示函数
      measureTooltipOverlay:null,  //测量工具提示覆盖层
      helpMsg:'点击开始绘制',
      sketch: null, 
    }
  },
  methods:{
    initMap(){
      //初始化地图的函数
      this.createLayer();
      this.map = new Map({
        target:"map",
        view: new View({
          center:[0,0],
          zoom:5
        }),
        layers:this.layersArr
      });
      this.addInteraction();
      this.addEvent();
      this.createHelpTooltip();
      this.createMeasureTooltip();
    },
    createLayer(){ //创建图层的函数
      this.createSource();
      //创建基础的瓦片图层
      let tileLayer = new Tile({
        source: this.sourceArr[0]
      });
      //创建一层覆盖的矢量图层
      let vectorLayer = new VectorLayer({
        source: this.sourceArr[1],
        style: new Style({
          image: new Circle({
            radius:7,
            fill: new Fill({
              color:"#ffcc33"
            })
          }),
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.2)"
          }),
          stroke: new Stroke({
            color:"ffcc33",
            width:2
          })
        })
      })
     

    },
    createSource(){ //创建图层的数据源
     

    },

    addInteraction(){ //给地图添加交互行为
     let draw = new Draw({
       type:"LineString",
       source
     })

    },
    addEvent(){ //给地图添加事件的函数
      //添加指针移动事件，指针移动时，显示提示信息
      
    },
    pointerMoveHandler(event){
      //判断当前地图位置是否移动，如果当前地图移动，说明用户在拖动地图，而不需要测量距离
      if(event.dragging){
        return;
      }
      this.helpTooltipOverlay.setPosition(event.coordinate);
      this.helpTooltipElement.classList.remove("hidden");
    },
    handleDrawstart(event){  //绘制开始事件的处理函数
     this.createMeasureTooltip();

    }, 
    handleDrawend(){ //绘制结束事件的处理函数

    },
    formatLength(line){ //计算绘制图形的长度或者面积
       var length = getLength(line);

    },
    createMeasureTooltip(){ //创建测量提示的函数
     

    },
    createHelpTooltip(){ //创建帮助提示的函数

    }



  },
  mounted(){
    this.initMap();

  }
}
</script>

<style scoped lang="scss">
 .meature{
   height: 100%;
   margin-left: 200px;
   #map{
     width: 100%;
     height: 800px;
   }
 }

</style>