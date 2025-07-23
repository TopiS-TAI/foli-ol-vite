import * as olProj from 'ol/proj';
import allTrips from './test_data/trips.json'
import allRoutes from './test_data/routes.json'
import { LineString } from 'ol/geom';
import { Feature } from 'ol';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';

export function routeTransformer(foliRoute) {
  try {
    const route = foliRoute.map( r => [r.lon, r.lat])
    return route
  } catch {
    []
  }
}

export function generateLine(coords) {
  try {
    const line = coords.map(c => olProj.transform(c, 'EPSG:4326', 'EPSG:3857'))
    return line
  } catch {
    return []
  }
}

export function stopsTransform(foliStops) {
  for (const key in foliStops) {
    const coords = [foliStops[key].stop_lon, foliStops[key].stop_lat]
    const tCoords = olProj.transform(coords, 'EPSG:4326', 'EPSG:3857')
    foliStops[key] = {
      ...foliStops[key],
      stop_lat: tCoords[1],
      stop_lon: tCoords[0],
    }
  }

  return foliStops
}

export function getRoutesByTrips(trips) {
  let tripsWithRoute = new Set()
  let routes = new Set()
  for (const trip of trips) {
    tripsWithRoute.add(allTrips.find(t => t.trip_id === trip.trip_id))
  }
  for (const route of tripsWithRoute) {
    routes.add(allRoutes.find(r => r.route_id === route.route_id))
  }
  tripsWithRoute = tripsWithRoute.values().map(t => ({
    ...t, 
    route_color: routes.values().find(r => r.route_id === t.route_id).route_color,
    route_text_color: routes.values().find(r => r.route_id === t.route_id).route_text_color,
  }))
  console.log('routes', routes)
  console.log('tripswithroute', tripsWithRoute)
  return [...tripsWithRoute]
}

// export function get

export function getRouteVectorFeature(route, routeName) {
  const routeLine = new LineString(generateLine(route))
  const f = new Feature({
    geometry: routeLine,
    name: routeName,
  })
  f.setStyle(
    [new Style({ stroke: new Stroke({color: 'white', width: 8}) }),
    new Style({ stroke: new Stroke({color: '#' + routeName.route_color, width: 4}) })]
  )
  return f
}