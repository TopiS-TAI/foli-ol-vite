import * as olProj from 'ol/proj';

export function routeTransformer(foliRoute) {
  return foliRoute.map( r => [r.lon, r.lat])
}

export function generateLine(coords) {
  return coords.map(c => olProj.transform(c, 'EPSG:4326', 'EPSG:3857'))
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