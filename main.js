import './style.css';
import * as olProj from 'ol/proj';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import { testSource } from './testData';
import { lineStyle } from './styles';

const kauppatori = olProj.transform([22.269133, 60.452370], 'EPSG:4326', 'EPSG:3857')

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    new VectorLayer({
      source: testSource,
      style: lineStyle,
    })
  ],
  view: new View({
    center: kauppatori,
    zoom: 12,
  })
});

map.on('click', (e) => console.log('click', e.coordinate))

console.log('map', map)
console.log('kauppatori', kauppatori)
console.log('olproj', olProj)

