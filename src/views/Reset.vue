<template>
  <div class="reset">
    <div id="map">
    </div>
    <div class="reset-foot">
      <el-button @click="showCircle" size="mini" type="primary">显示圆</el-button>
      <el-button @click="showLine" size="mini" type="primary">显示线</el-button>
      <el-button @click="showPolygon" size="mini" type="primary">显示多边形</el-button>
      <el-button @click="showSquare" size="mini" type="primary">显示矩形</el-button>
      <el-button @click="showBox" size="mini" type="primary">显示正方形</el-button>
    </div>
  </div>
</template>

<script>
import "ol/ol.css";
import { Map , View } from "ol";
import { OSM ,Vector as VectorSource} from "ol/source";
import {Tile,Vector as VectorLayer} from "ol/layer";
import Feature from "ol/Feature";
import {Stroke, Style, Image,Fill, Circle,Text} from "ol/style";
import Icon from 'ol/style/Icon';
import {Polygon,LineString} from "ol/geom";
import circle from 'ol/geom/Circle';
export default {
  data(){
    return{
      vectorSource:null,
      vectorLayer:null,
      mapView:null,
      map:null,
      myfeature:null,
      myCoordinates:[    //矩形坐标
              [5843318.552114485, 3874972.7021225346],
              [6246906.061460215, 3874972.7021225346],
              [6246906.061460215, 4033961.720955701],
              [5843318.552114485, 4033961.720955701],
              [5843318.552114485, 3874972.7021225346]
      ],     
      // myRadius: 120946.335,   //圆半径
      myRadius:1200,
      myCenter:[6246906.061, 4033961.720],  //圆心坐标       

    }
  },
  methods:{
    initMap(){  //初始化地图
     this.vectorSource = new VectorSource({
       wrapX:false
     });
     //创建矢量图层
     this.vectorLayer = new VectorLayer({
       source: this.vectorSource,
       style: new Style({
         fill: new Fill({
           color: "rgba(225,225,225,0.2)"
         }),
         stroke: new Stroke({
           color:"#ffcc33",
           width:2
         }),
         image: new Circle({
           radius:7,
           fill : new Fill({
             color:"#ffcc33"
           })
         })
       })
     });
     //创建图层
     const TileLayer = new Tile({ //设置地图源
       source: new OSM()
     });
     this.mapView = new View({
      //  projection:'EPSG:4326',
      //  center:[115,37],
       center:[12680743.277306, 2590053.322889],
       zoom:6
     })

     //创建地图
     this.map = new Map({
       target:"map",
       layers:[TileLayer,this.vectorLayer],
       view: this.mapView,
     });
    },
    elastic(t){ //动画效果
      return (Math.pow(2,-10 * t) * Math.sin(((t-0.075) * (2 * Math.PI)) / 0.3) +1)
    },
    showCircle(){ //回显圆
       console.log("显示圆");
       this.mapView.animate({ //动态定位到目标位置
         center:this.myCenter,
         duration: 2000,
         zoom:15
       })
      this.myfeature = new Feature({
        type:'circle',
        geometry:new circle(this.myCenter,this.myRadius)
      });
      this.myfeature.setStyle(
        new Style({
          stroke: new Stroke({
            width:1,
            color:"rgba(248,172,166,1)"
          }),
          fill: new Fill({
            color:[248,172,166,0.6]
          }),
          image: new Circle({
            stroke: new Stroke({
              color:"rgba(255,0,0,0.5)",
              size:2
            }),
            fill: new Fill({
              color:[248,172,166,0.6]
            }),
          }),
          text: new Text({
            text:"这是圆"
          })
        })
      )
      let circleSource = new VectorSource({
        features:[this.myfeature]
      });
      let circleLayer = new VectorLayer({
        source:circleSource
      });
      this.map.addLayer(circleLayer)

    }, 
    showLine(){ //回显线
      console.log("显示线");
       this.mapView.animate({ //动态定位到目标位置
         center:[6246906.061460215, 3874972.7021225346],
         duration: 2000,
         zoom:8,
         easing:this.elastic
       })      
      this.myfeature = new Feature({  //创建一条线
       type:"route",
       geometry: new LineString(this.myCoordinates)
      });
      this.myfeature.setStyle(  //设置线的样式
        new Style({
          stroke: new Stroke({
            width:3,
            color:"rgba(255,0,0,0.5)"
          }),
          text: new Text({
            text:"这是线"
          })
        })
      );
      let lineSource = new VectorSource({ //实例化一个矢量图层
           features:[this.myfeature]
      });
      let LineLayer = new VectorLayer({
        source: lineSource
      });
      this.map.addLayer(LineLayer);

    },
    showPolygon(){ //回显多边形
     console.log("显示多边形");
     

    },
    showSquare(){ //回显矩形
    console.log("显示矩形");
       this.mapView.animate({ //动态定位到目标位置
         center:[6246906.061460215, 3874972.7021225346],
         duration: 2000,
         zoom:8
       })     
      this.myfeature = new Feature({
        type:"polygon",
        geometry: new Polygon([this.myCoordinates])
      });
      this.myfeature.setStyle(
        new Style({
          stroke: new Stroke({
            width:1,
            color:"rgba(255,255,0,0.5s)"
          }),
          fill: new Fill({
            color:[248,172,166,0.6]
          }),
          text: new Text({
            text:"这是围栏"

          })
        })
      )
    },
    showBox(){ //回显正方形
      console.log("显示正方形");
      
      this.myfeature = new Feature({
        type:"polygon",
        geometry: new Polygon([this.myCoordinates])
      });
      this.myfeature.setStyle(
        new Style({
          stroke: new Stroke({
            width:1,
            color:"rgba(255,255,0,0.5s)"
          }),
          fill: new Fill({
            color:[248,172,166,0.6]
          }),
          text: new Text({
            text:"这是围栏"
          })
        })
      )    

    },



    
    
  },
  created(){
    

  },
  mounted(){
    this.initMap();

  }
}
</script>

<style lang="scss">
.reset{
  height: 100%;
  margin-left: 200px;
  #map{
   widows: 100%;
   height: 800px;
  }

}

</style>