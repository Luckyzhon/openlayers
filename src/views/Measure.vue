<template>
  <div class="box1">
    <div id="mymap"></div>
  </div>
</template>

<script>
import "ol/ol.css";
import { Map, View, Overlay } from "ol";
import { Tile, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { Style, Fill, Stroke, Circle } from "ol/style";
import Feature from "ol/Feature";
import { Point, Polygon, LineString } from "ol/geom";
import { Draw } from "ol/interaction";
import { getArea, getLength } from "ol/sphere";

export default {
  data() {
    return {
      map: null, // 地图实例
      layersArr: [], // 存储图层
      featureArr: [], // 存储数据源中要素
      sourceArr: [], // 存储图层数据源
      draw: null, // 绘制
      helpTooltipElement: null, // 帮助工具提示元素
      helpTooltipOverlay: null, // 帮助工具提示覆盖层
      measureTooltipElement: null, // 测量工具提示函数
      measureTooltipOverlay: null, // 测量工具提示覆盖层
      listener: null,
      sketch: null,
      helpMsg: '点击开始绘制'  // 帮助提示工具的提示信息
    };
  },
  methods: {
    // 初始化地图的函数
    initMap() {
      this.createLayer();
      this.map = new Map({
        target: "mymap",
        view: new View({
          center: [0, 0],
          zoom: 5
        }),
        layers: this.layersArr
      });
      this.addInteraction();
      this.addEvent();
      this.createHelpTooltip();
      this.createMeasureTooltip();
    },

    // 创建图层的函数
    createLayer() {
      this.createSource();
      // 创建基础的瓦片图层
      let tileLayer = new Tile({
        source: this.sourceArr[0]
      });
      // 创建一层覆盖的矢量图层
      let vectorLayer = new VectorLayer({
        source: this.sourceArr[1],
        style: new Style({
          image: new Circle({
            radius: 7,
            fill: new Fill({
              color: "#ffcc33"
            })
          }),
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.2)"
          }),
          stroke: new Stroke({
            color: "#ffcc33",
            width: 2
          })
        })
      });
      this.layersArr.push(tileLayer, vectorLayer);
    },

    // 创建图层的数据源
    createSource() {
      let osmSource = new OSM();
      let vectorSource = new VectorSource();
      this.sourceArr.push(osmSource, vectorSource);
    },

    // 给地图添加交互行为
    addInteraction() {
      let draw = new Draw({
        type: "LineString",
        source: this.sourceArr[1],
        style: new Style({
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.2)"
          }),
          stroke: new Stroke({
            color: "rgba(0, 0, 0, 0.5)",
            lineDash: [10, 10],
            width: 2
          }),
          image: new Circle({
            radius: 5,
            stroke: new Stroke({
              color: "rgba(0, 0, 0, 0.7)"
            }),
            fill: new Fill({
              color: "rgba(255, 255, 255, 0.2)"
            })
          })
        })
      });
      this.map.addInteraction(draw);
      this.draw = draw;
    },

    // 给地图添加事件的函数
    addEvent() {
      // 添加指针移动事件，指针移动时，显示提示信息
      this.map.on("pointermove", this.pointerMoveHandler);
      this.map.getViewport().addEventListener(
        "mouseout",
        () => {
          this.helpTooltipElement.classList.add("hidden");
        },
        false
      );

      // 监听绘制开始事件
      this.draw.on("drawstart", this.handleDrawstart);

      // 监听绘制结束事件
      this.draw.on("drawend", this.handleDrawend);
    },

    // 指针移动时的处理函数
    pointerMoveHandler(event) {
      // 判断当前地图位置是否移动, 如果当前地图移动了，说明用户在拖动地图，而不是需要测量距离
      if (event.dragging) {
        return;
      }
      this.helpTooltipOverlay.setPosition(event.coordinate);
      this.helpTooltipElement.classList.remove("hidden");
    },

    // 绘制开始事件的处理函数
    handleDrawstart(event) {

      this.createMeasureTooltip();


      this.helpMsg = "点击继续绘制";
      this.sketch = event.feature;
      let tooltipCoord = event.coordinate;

      this.listener = this.sketch.getGeometry().on("change", event => {
        let geom = event.target;
        let output;
        if (geom instanceof Polygon) {
          output = this.formatArea(geom);
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof LineString) {
          output = this.formatLength(geom);
          tooltipCoord = geom.getLastCoordinate();
        }
        this.measureTooltipElement.innerHTML = output;
        this.measureTooltipOverlay.setPosition(tooltipCoord);
      });
    },

    // 绘制结束事件的处理函数
    handleDrawend(event) {},

    // 计算绘制图形的长度或者面积
    formatLength(line) {
      var length = getLength(line);
      var output;
      if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + " " + "km";
      } else {
        output = Math.round(length * 100) / 100 + " " + "m";
      }
      return output;
    },

    // 创建测量提示的函数
    createMeasureTooltip() {
      if (this.measureTooltipElement) {
        this.measureTooltipElement.parentNode.removeChild(
          this.measureTooltipElement
        );
      }
      this.measureTooltipElement = document.createElement("div");
      this.measureTooltipElement.className = "tooltip tooltip-measure";
      this.measureTooltipElement.innerHTML = "我是显示测量结果的元素";
      this.measureTooltipOverlay = new Overlay({
        element: this.measureTooltipElement,
        offset: [0, -15],
        positioning: "bottom-center",
        position: [10, 10]
      });
      this.map.addOverlay(this.measureTooltipOverlay);
    },

    // 创建帮助提示的函数
    createHelpTooltip() {
      // 如果提示元素已经存在，则删除掉
      if (this.helpTooltipElement) {
        this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
      }
      this.helpTooltipElement = document.createElement("div");
      this.helpTooltipElement.innerHTML = this.helpMsg;
      this.helpTooltipElement.className = "tooltip hidden";
      // 创建帮助工具提示覆盖物
      this.helpTooltipOverlay = new Overlay({
        element: this.helpTooltipElement,
        offset: [15, 0],
        positioning: "center-left",
        position: [0, 0]
      });
      this.map.addOverlay(this.helpTooltipOverlay);
    }
  },

  mounted() {
    this.initMap();
  }
};
</script>

<style lang="scss">
.box1{
  height: 100%;
  margin-left: 200px;
  #mymap{
    width: 100%;
    height: 800px;

  }
  .tooltip {
  position: relative;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  color: white;
  padding: 4px 8px;
  opacity: 0.7;
  white-space: nowrap;
}
.tooltip-measure {
  opacity: 1;
  font-weight: bold;
}
.tooltip-static {
  background-color: #ffcc33;
  color: black;
  border: 1px solid white;
}
.tooltip-measure:before,
.tooltip-static:before {
  border-top: 6px solid rgba(0, 0, 0, 0.5);
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
  content: "";
  position: absolute; 
  bottom: -6px;
  margin-left: -7px;
  left: 50%;
}
.tooltip-static:before {
  border-top-color: #ffcc33;
}
.hidden {
  display: none;
}

}

</style>
