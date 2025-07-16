import * as olProj from 'ol/proj';

export function routeTransformer(foliRoute) {
  return foliRoute.map( r => [r.lon, r.lat])
}

export function generateLine(coords) {
  return coords.map(c => olProj.transform(c, 'EPSG:4326', 'EPSG:3857'))
}