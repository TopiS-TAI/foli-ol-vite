import Style from "ol/style/Style"
import Stroke from "ol/style/Stroke"

export const lineStyle = new Style({
  stroke: new Stroke({color: 'red', width: 4})
})

export const outLineStyle = new Style({
  stroke: new Stroke({color: 'white', width: 8})
})