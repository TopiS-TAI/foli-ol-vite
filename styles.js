import Style from "ol/style/Style"
import Stroke from "ol/style/Stroke"
import Fill from "ol/style/Fill"

export const lineStyle = new Style({
  stroke: new Stroke({color: 'red', width: 4})
})

export const closestStopStyle = new Style({
  stroke: new Stroke({color: 'orange', width: 8})
})

export const clickPointStyle = new Style({
  stroke: new Stroke({color: 'blue', width: 4}),
  fill: new Fill({color: 'blue'})
})