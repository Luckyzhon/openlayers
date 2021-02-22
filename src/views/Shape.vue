<template>
  <div class="shape">
    <div class="selectShape">
      <el-select v-model="selectVal" @change="changeSelect">
        <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label">
        </el-option>
      </el-select>
      <el-button class="clear-feature" type="warning" size="mini" @click="clearLayer">
       清除图层
      </el-button>

    </div>
    <div id="map">

    </div>
  </div>
</template>

<script>
import "ol/css";
import { Map, View } from "ol";
import { Tile, Vector as VectorLayer} from "ol/layer";
import {OSM, Vector as VectorSource} from "ol/source";
import {Draw} from "ol/interaction";
import {createRegularPolygon , createBox} from "ol/interaction/Draw";
import Feature from "ol/Feature";
import {Polygon,LineString} from "ol/geom";
import {Style, Stroke,Image,Fill,Circle,Text} from "ol/style";
import Icon from "ol/style/Icon";
import circle from "ol/geom/Circle";

export default {
  data(){
    return{
      vectorSource:null,
      vectorLayer:null,
      map:null,
      mapView:null,
      options:[{
        value:'Circle',
        label:'圆'
      },
      {
        value:'LineString',
        label:'线'
      },
      {
        value:'Polygon',
        label:'多边形'
      },
      {
        value:'Square',
        label:"矩形"
      },
      {
        value:'Box',
        label:"正方形"
      },
      {
        value:'None',
        label:"None"
      }
      ],
      selectVal:'None', 
      draw:null,
      circleCenter:'', //圆心坐标
      circleRadius:'', //圆半径
      coordinates:[], //绘制图的半径
      rectangleArr:[], //保存绘制的矩形
      circleArr:[], //保存绘制的圆


    }
  },
  methods:{
    initMap(){
      this.vectorSource = new VectorSource({
        wrapX: false
      });
      //创建矢量图
      this.vectorLayer = new VectorLayer({
        source: this.vectorSource,
        style: new Style({
          fill: new Fill ({
             color:"rgba(225,225,225,0.5)"
          }),
          stroke: new Stroke({
            color:"#DC143C",  //图层颜色
            width:2
          }),
          image: new Circle({
            radius:7,
            fill: new Fill({
              color:"#ffcc33"
            })
          })
        })
      });
      //创建地图图层
      const TileLayer = new Tile({ //设置地图源
       source: new OSM()
      });
      this.mapView = new View({
        center:[12680743.277306, 2590053.322889],
        zoom:10
      }),
      //创建地图
      this.map = new Map({
        target:"map",
        layers:[TileLayer,this.vectorLayer],
        view: this.mapView,
      });
      //给地图添加交互行为
      this.addInteractionMy();

    },
    addInteractionMy(){ //绘制图形
     var value = this.selectVal;
     if(this.selectVal !== "None"){
       if(this.vectorSource == null){
         this.vectorSource = new VectorSource({
           wrapX:false
         });
         this.vectorLayer.setSource(this.vectorSource);
       }
       var geometryFunction , maxPoints;
       if(this.selectVal === "Square"){ //矩形
        //  this.selectVal = "Circle";
             value = "LineString";
         geometryFunction = createBox();
       }
       else if(this.selectVal === "Box"){  //正方形
          value = "Circle";
          geometryFunction = createRegularPolygon(4); //正变形的边数，默认为4
       }else if(this.selectVal === "Polygon"){ //多边形
           value = "LineString";
         maxPoints = 2;
         geometryFunction = (coordinates,geometry)=>{
           if(!geometry){ //多边形
             geometry = new Polygon(null);
           }
           var start = coordinates[0];
           var end = coordinates[1];
           geometry.setCoordinates([
             [start,[start[0],end[1]],end,[end[0],start[1]],start]
           ]);
           return geometry;
         };
       }
       this.draw = new Draw({
         type:this.selectVal, //图形的类型
         source: this.vectorSource,  //绘制到哪个数据源
         geometryFunction: geometryFunction, //几何信息变更时调用函数
         maxPoints: maxPoints,  //最多可以绘制多少个点
       });
       this.map.addInteraction(this.draw);

     }else{  //selectVal = null
       this.vectorSource = null;
      //  清空绘制图形
       this.vectorLayer.setSource(this.vectorSource)
     }
      


    },
    //绘制电子围栏
    circle_fence(){ //画圆
      this.map.removeInteraction(this.draw); //切换图形的时候移除之前的互动
      this.selectVal = "Circle";
      this.addInteractionMy();
    },
    rectangle_fence(){ //画矩形
     this.map.removeInteraction(this.draw);
     this.selectVal = "LineString";
     this.addInteractionMy();

    },
    polygn_fence(){ //画多边形
     this.map.removeInteraction(); //切换图形的时候移除之前的互动
     this.selectVal = "Box";
     this.addInteractionMy();
    },
    polyline_fence(){
      this.map.removeInteraction(); //切换图形的时候移除之前的互动
      this.selectVal = "Box";
      this.addInteractionMy();
    },
    changeSelect(){ //下拉框选中
     this.map.removeInteraction();
     this.addInteractionMy();
      

    },
    clearLayer(){ //清除图层

    }


  },
  created(){

  },
  mounted(){
    this.initMap();
     

  }

  
}
</script>

<style lang='scss'>
.shape{
  margin-left: 200px;;
  height: 100%;
  #map{
    width: 100%;
    height: 800px;
  }
}


</style>