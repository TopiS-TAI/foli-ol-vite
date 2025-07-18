import * as olProj from 'ol/proj';
import allTrips from './test_data/trips.json'
import allRoutes from './test_data/routes.json'
import { LineString } from 'ol/geom';
import { Feature } from 'ol';

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
  const routeIds = new Set()
  const routeNames = new Set()
  for (const trip of trips) {
    routeIds.add(allTrips.find(t => t.trip_id === trip.trip_id)['route_id'])
  }
  for (const id of routeIds) {
    routeNames.add(allRoutes.find(r => r.route_id === id)['route_short_name'])
  }
  return [...routeNames]
}

export function getRouteVectorFeature(route, routeName) {
  const routeLine = new LineString(generateLine(route))
  return new Feature({
    geometry: routeLine,
    name: routeName,
  })
}