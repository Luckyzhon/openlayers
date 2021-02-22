<template>
  <div class="trajectory">
    <div id="map" ref="map" class="map">
    </div>
    <div class="tools">
      <label for="speed">速度: &nbsp; <input type="range" v-model="speedVal" min="10" max="999" step="10" value="60"></label>
      <el-checkbox v-model="trajectoryPoint">显示轨迹点</el-checkbox>
      <el-button type="primary" size="small" @click="animationClick">
        {{animationFalg ? "开始回放" : "结束回放"}}
      </el-button>
    </div>    
  </div>
</template>

<script>
import "ol/ol.css";
import {Map,View} from "ol";
import {Tile,Vector as VectorLayer} from "ol/layer";
import {OSM,Vector as  VectorSource} from "ol/source";
import Feature from "ol/Feature";
import {Polygon,LineString,MultiPoint} from "ol/geom";
import {Style,Stroke,Image,Fill,Circle,Text,Icon} from "ol/style";
import Projection from "ol/proj/Projection";
import {transfrom} from "ol/proj";
import Point from "ol/geom/Point";
import {getVectorContext} from "ol/render"

export default {
  data(){
    return{
      trajectoryPoint:false, //是否显示轨迹点
      animationFalg:true, //控制回放按钮
      speedVal:450, //回放速度
      vectorSource:null,
      vectorLayer:'', //图层
      map:null, 
      route:'', //轨迹
      routeLength:0, 
      routeFeature:'', //轨迹图层
      geoMarker:'', //移动点
      startMarker:'', //起点
      endMarker:'', //终点
      pointMarker:'', //轨迹点
      styles:null, //轨迹样式
      trajectoryLayer:'', //轨迹图层
      animation:false, //标记运动状态
      reTime:"", //保存上次运动时间
      elapsdTime:0, //用过的时间
      nowTime:null,

    }
  },
  methods:{
    animationClick(){
     this.animationFalg ? this.startAnimation() : this.stopAnimation();
    },
    initMap(){
      this.vectorSource = new VectorSource({
        wrapX:false
      });

      //创建矢量图层
      this.vectorLayer = new VectorLayer({
        source: this.vectorSource,
        Style:new Style({
          fill: new Fill({
            color:"rgba(225,225,225,0.2)"
          }),
          strokr: new Stroke({
            color:"#ffcc33",
            width:2
          }),
          image: new Circle({
            redius:7,
            fill: new Fill({
              color:"#ffcc33"
            })
          })
        })
      });
      const TileLayer = new Tile({ //设置地图源
        source: new OSM()

      });

      //创建地图
      this.map = new Map({
        target:"map",
        loadTilesWhileAnimating:true,
        layers:[TileLayer,this.vectorLayer],
        view: new View({
          //center:[12680743.277306, 2590053.322889],
           center:[-28480226.95, 4254221.52],
          zoom:4,
        })
      });
    },
    getTrajectory(){ //绘制轨迹
     //先判断有没有图层，有的话就清除
       console.log("绘制轨迹");
       
        var Coordinates = new Array();
        for (var i = 0; i < 600000; i += 5000) {
            Coordinates.push([(-30322402) + i, 5444359 - i]);
        }
        for (var j = 0; j < 600000; j += 5000) {
            Coordinates.push([(-30322402) + 600000 + j, 5444359 - 600000]);
        }
        for (var k = 0; k < 600000; k += 5000) {
            Coordinates.push([(-30322402) + 1200000 + k, 5444359 - 600000 - k]);
        }
        for (var h = 0; h < 600000; h += 5000) {
            Coordinates.push([(-30322402) + 1800000 + h, 5444359 - 1200000]);
        }
        //将离散点构建成一条折线
        this.route = new LineString(Coordinates); 
        this.routeLength = Coordinates.length;
        this.routeFeature = new Feature({
          type:"route",
          geometry:this.route
        });
        this.geoMarker = new Feature({ //移动点
          type:"geoMarker",
          geometry:new Point(this.route.getCoordinateAt(0))
        });
        this.startMarker = new Feature({ //起点
          type:"icon",
          geometry:new Point(this.route.getCoordinateAt(0))
        });
        this.endMarker = new Feature({ //终点
          type:"icon",
          geometry:new Point(this.route.getCoordinateAt(1))
        });
        var pointArr = new Array();
        for(var i=0;i<this.routeLength;i++){
          pointArr.push(new Feature({
            type:"point",
            geometry:new Point(Coordinates[i])
          }))
        }
        this.pointMarker = pointArr;
        this.styles = {
          "route": new Style({  //线的样式
           strokr: new Stroke({
             width:6,
             color:"#0075FF"
           })
          }),
          "icon":new Style({ //起点，终点的样式
           image: new Icon({
             anchor:[0.5,1],
             scale:0.7, //控制图片大小
             src:require("./images/point.png")
           })
          }),
          "geoMarker":new Style({ //移动的轨迹点
            image: new Circle({
              radius:7,
              snapToPixel:false,
              fill:new Fill({
                color:"#DC143C",
              }),
              strokr: new Stroke({
                color:"white",
                width:2
              })
            })
          }),
          "point": new Style({
            image:new Circle({
              redius:4,
              fill:new Fill({
                color:"#FF7F50",
              })
            })
          })
        };
        if(this.trajectoryLayer === ""){ //先判断当前是否有轨迹图层
         this.trajectoryLayer = new VectorLayer({
           source : new VectorSource({
             feature:[this.routeFeature,this.geoMarker,this.startMarker,this.endMarker,...this.pointMarker]
           }),
           style:(feature)=>{ //如果动画是激活的就隐藏geoMarker
           if(this.animation && feature.get("type") === "geoMarker"){
             return null
           }
           return this.styles[feature.get("type")]
           }
         });
         this.map.addLayer(this.trajectoryLayer);
        }else{
          this.map.removeLayer(this.trajectoryLayer); //先删除之前的轨迹图层
          this.trajectoryLayer = new VectorLayer({
            source: new VectorSource({
              features:[this.routeFeature,this.geoMarker,this,startMarker,this.endMarker]
            }),
            style:(feature) =>{ //如果动画是激活的就隐藏geometry
             if(this.animation && feature.get("type") === "geoMarker"){
                return null
             }
                return this.styles[feature.get("type")]
            }
          });
          this.map.addLayer(this.trajectoryLayer);
        }
    },
    moveFeature(event){ //轨迹动画
     var vectorContext = getVectorContext(event);
     var frameState = event.frameState;
     var speed = this.speedVal;
     if(this.animation){
       var elapsdTime = frameState.time - this.nowTime;
       var distance = (speed * elapsdTime) / 1e6
     }

     if(distance >=1){
       this.stopAnimation(true);
       return;
     }
     var currentPoint = new Point(this.route.getCoordinateAt(distance));
     var feature = new Feature(currentPoint);
     vectorContext.drawFeature(feature,this.styles.geoMarker);
     this.map.render()
    },
    startAnimation(){ //开始回放
    if(this.animation){
      this.stopAnimation(false)
    }else{
      this.animation = true;
      this.nowTime = new Date().getTime();
      this.geoMarker.changed();
      this.map.getView().setCenter(this.map.getView().getCenter());
      this.trajectoryLayer.on('postrender',this.moveFeature);
      this.map.render();
    }
     this.animationFalg = false;

    },
    stopAnimation(ended){ //结束回放
    this.animation = false;
    var coord = this.route.getCoordinateAt(ended ? 1 : 0);
    this.trajectoryLayer.un('postrender',this.moveFeature);
    this.animationFalg = true;
    },
    clearLayer(){ //删除图层
     this.map.removeLayer(this.trajectoryLayer);

    },
    clearFeature(params){ //是否显示轨迹点
    if(!params){
      for(var i=0;i<this.routeLength;i++){
        this.trajectoryLayer.getSource().removeFeature(this.pointMarker[i])
      }
    }else{
      for(var i=0; i<this.routeLength;i++){
        
      }
    }
     

    }

  },
  created(){

  },
  mounted(){
    this.initMap();
    this.getTrajectory();
  }
}
</script>

<style lang='scss'>
  .trajectory{
    margin-left: 200px;
    height: 100%;
    #map{
      width: 100%;
      // height: 90%;
      height: 800px;
      // background-color: pink;
    }
  }

</style>

