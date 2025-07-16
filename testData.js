import { LineString } from "ol/geom"
import { Feature } from "ol"
import VectorSource from "ol/source/Vector"
import route from './route_1.json'
import {generateLine, routeTransformer} from './utils'

const routeLine = new LineString(generateLine(routeTransformer(route)))

const testFeature = new Feature({
  geometry: routeLine,
  name: 'Test Feature',
})

export const testSource = new VectorSource()
testSource.addFeature(testFeature)