<template>
  <div class="shape">
    <div class="selectShape">
      <el-select v-model="selectVal" @change="changeSelect">
        <el-option value="Circle" label="圆">圆</el-option>
        <el-option value="LineString" label="线">线</el-option>
        <!-- <el-option value="Polygon" label="多边形">多边形</el-option> -->
        <el-option value="Square" label="矩形">矩形</el-option>
        <el-option value="Box" label="正方形">正方形</el-option>
        <el-option value="None" label="None">None</el-option>
      </el-select>
      <el-button class="clear-feature" type="danger" size="mini" @click="clearLayer">
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
import {LineString} from "ol/geom";
import Polygon from "ol/geom";
import {Style, Stroke,Image,Fill,Circle,Text} from "ol/style";
import Icon from "ol/style/Icon";

export default {
  data(){
    return{
      vectorSource:null,
      vectorLayer:null,
      map:null,
      mapView:null,
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
        logo:false,
        target:"map",
        layers:[TileLayer,this.vectorLayer],
        view: this.mapView,
        
      });
      //给地图添加交互行为
      this.addInteractionMy();

    },
    addInteractionMy(){ //绘制图形
     if(this.selectVal !== "None"){
       if(this.vectorSource == null){
         this.vectorSource = new VectorSource({
           wrapX:false
         });
         this.vectorLayer.setSource(this.vectorSource);
       }
       var geometryFunction , maxPoints;
       if(this.selectVal === "Square"){ //矩形
         this.selectVal = "Circle";
         geometryFunction = createBox();
       }
       else if(this.selectVal === "Box"){  //正方形
          this.selectVal = "Circle";
          geometryFunction = createRegularPolygon(4); //正变形的边数，默认为4
       }
      //  else if(this.selectVal === "Polygon"){ //多边形
        //    this.selectVal = "LineString";
        //  maxPoints = 2;
        //  geometryFunction =function(coordinates,geometry){
        //    if(!geometry){
        //      geometry = new Polygon(null);
        //    }
        //    var start = coordinates[0];
        //    var end = coordinates[1];
        //    geometry.setCoordinates([
        //      [start,[start[0],end[1]],end,[end[0],start[1]],start]
        //    ]);
        //    return geometry;
        //  };
      //      this.selectVal = "Polygon";
      //      geometryFunction = Polygon();
      //  }
       //绘制多边形不成功，下次调试
       this.draw = new Draw({
         type:this.selectVal, //图形的类型
         source: this.vectorSource,  //绘制到哪个数据源
         geometryFunction: geometryFunction, //几何信息变更时调用函数
         maxPoints: maxPoints,  //最多可以绘制多少个点
       });
       this.map.addInteraction(this.draw);
     }
    },
    drawPolygon(){
     this.draw = new Draw({
       type:"Polygon",
       source:this.vectorSource
     })
     this.map.addInteraction(this.draw);
     this.map.addLayer(this.vectorSource);

    },
    changeSelect(){ //下拉框选中
     this.map.removeInteraction(this.draw);
     this.addInteractionMy();

    //  this.selectDraw();

    //this.newDrawshape();

    },
    clearLayer(){ //清除图层'
        //  清空绘制图形
       this.vectorSource = null;
       this.vectorLayer.setSource(this.vectorSource)
    },

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
  .selectShape{
    position: absolute;
    z-index: 2;
    right: 10px;
    margin-top: 3px;
    .el-select{
      width: 115px;
    }
    .el-button--mini{
      padding: 12px 8px;
      margin-left: 5px;
    }
  }
  #map{
    width: 100%;
    height: 800px;
    position: relative;
  }
}


</style>