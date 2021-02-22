<template>
    <div class="mouseposition">
      <div id="map"></div>

    </div>
</template>

<script>
import "ol/css";
import { Map, View } from "ol";
import { Tile,Vector as VectorLayer} from "ol/layer";
import {OSM,Vector as VectorSource} from "ol/source";
import Feature from "ol/Feature";
import {Style, Stroke,Image,Fill,Circle,Text} from "ol/style";
export default {
  data(){
    return{
      vectorSource:null,
      vectorLayer:null,
      map:null,
      mapView:null,


    }
  },
  methods:{
    initMap(){
      this.vectorSource = new VectorSource({
        wrapX: false
      });
      //创建矢量图
      this.vectorLayer = new VectorLayer({
        source:this.vectorSource,
      });
      //创建地图图层
      const TileLayer = new Tile({ //设置地图源
       source: new OSM(),
      });
      this.mapView = new View({
        center:[12680743.277306, 2590053.322889],
        zoom:10
      }),
      //创建地图
      this.map = new Map({
        target:"map",
        layers:[TileLayer,this.vectorLayer],
        view: this.mapView
      });
      
      
    }

  },
  mounted(){
    this.initMap();


  }
}
</script>

<style lang="scss">
.mouseposition{
  height: 100%;
  margin-left: 200px;
  #map{
    width: 100%;
    height: 800px;
  }
}

</style>