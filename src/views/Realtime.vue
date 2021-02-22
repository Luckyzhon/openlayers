<template>
    <div class="realtime">
        <div id="map"></div>
    </div>
</template>

<script>
import "ol/css";
import { Map,View } from "ol";
import {Tile, Vector as VectorLayer} from "ol/layer";
import {OSM, Vector as VectorSource} from "ol/source";
import Feature from "ol/Feature";
import {Style, Stroke, Image,Fill, Circle,Text} from "ol/style";
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
            this.vectorLayer = new VectorSource({
                wrapX:false
            });
            //创建矢量图
            this.vectorLayer = new VectorLayer({
                surce:this.vectorSource,
                style: new Style({
                    fill: new Fill({
                        color:"rgba(225,225,225,0.5)"
                    }),
                    stroke: new Stroke({
                        color:"#DC143C", //图层颜色
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
              source:new OSM()
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
    created(){
        this.initMap();

    },
    mounted(){

    }
}
</script>

<style lang="scss">

</style>