import './style.css';
import * as olProj from 'ol/proj';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import { testSource } from './test_data/testData';
import { clickPointStyle, closestStopStyle, lineStyle } from './styles';
import foliStops from './test_data/stops.json';
import { Circle } from 'ol/geom';
import {Feature} from 'ol';
import { getRoutesByTrips, getRouteVectorFeature, routeTransformer, stopsTransform } from './utils';
import { getRouteShapes, getTripsByStops } from './api_service';
import VectorSource from 'ol/source/Vector';

var stopCircles = []
var routeFeatures = []
var clickPoint = null
const stops = stopsTransform(foliStops)
const kauppatori = olProj.transform([22.2676864, 60.4513536], 'EPSG:4326', 'EPSG:3857')
const stopsSource = new VectorSource()
const routesSource = new VectorSource()

function createClickCircle(lon, lat) {
  if (!!clickPoint) {
    stopsSource.removeFeature(clickPoint)
  }
  const clickCircle = new Circle([lon, lat], 12)
  const clickFeat = new Feature({ geometry: clickCircle, name: 'ClickPoint' })
  clickFeat.setStyle(clickPointStyle)
  stopsSource.addFeature(clickFeat)
  clickPoint = clickFeat
}

function createStopCircles(sortedStops) {
  if (stopCircles.length > 0) {
    stopsSource.removeFeatures(stopCircles)
  }

  stopCircles = []
  for (const stop of sortedStops) {
    const c = new Circle([stop.stop_lon, stop.stop_lat], 6)
    const f = new Feature({
      geometry: c,
      name: 'stop-' + stop.stop_code
    })
    if (sortedStops.indexOf(stop) === 0) {
      f.setStyle(closestStopStyle)
    }
    stopCircles.push(f)
  }
  stopsSource.addFeatures(stopCircles)
}

function getSortedNearStops(lon, lat) {
  const nearStops = []
  for (const key in stops) {
    if (
      Math.abs(lon - stops[key].stop_lon) < 250 &&
      Math.abs(lat - stops[key].stop_lat) < 250
    ) {
      nearStops.push(stops[key])
    }
  }
  const sortedStops = nearStops.toSorted((a,b) => {
    const aHyp = Math.sqrt((lon - a.stop_lon) ** 2 + (lat - a.stop_lat) ** 2)
    const bHyp = Math.sqrt((lon - b.stop_lon) ** 2 + (lat - b.stop_lat) ** 2)
    return aHyp - bHyp
  })
  console.log('sortedstops', sortedStops)
  return sortedStops
}

async function handleClick(e) {
  if (routeFeatures.length > 0) routesSource.removeFeatures(routeFeatures)
  const [lon, lat] = e.coordinate
  createClickCircle(lon, lat)
  const sortedStops = getSortedNearStops(lon, lat)
  createStopCircles(sortedStops)  
  const sortedStopNumbers = sortedStops.map(s => s.stop_code)
  console.log('stop numbers', sortedStopNumbers)
  const trips = await getTripsByStops(sortedStopNumbers)
  console.log('trips', trips)
  const routesPerStop = {}
  let routes = []
  for (const i in sortedStopNumbers) {
    const tripRoutes = getRoutesByTrips(trips[i])
    const routeObjects = tripRoutes.map(r => ({route_short_name: r}))
    routesPerStop[sortedStopNumbers[i]] = tripRoutes
    routes = [...routes, ...tripRoutes]
  }
  console.log('routesperstop', routesPerStop)
  let shapeIds = routes.map(r => r.shape_id)
  shapeIds = [... new Set(shapeIds)]
  let routeShapes = await getRouteShapes(shapeIds)
  routeShapes = routeShapes.map(rs => {
    return routeTransformer(rs)
  })
  routeFeatures = []
  for (const i in routeShapes) {
    routeFeatures.push(getRouteVectorFeature(routeShapes[i], routes[i]))
  }
  console.log('routefeatures', routeFeatures)
  routesSource.addFeatures(routeFeatures)
}

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    new VectorLayer({
      source: routesSource,
      style: lineStyle,
    }),
    new VectorLayer({
      source: stopsSource,
      style: lineStyle,
    }),
  ],
  view: new View({
    center: kauppatori,
    zoom: 12,
  })
});

map.on('click', handleClick)

console.log('map', map)
console.log('kauppatori', kauppatori)
console.log('olproj', olProj)

