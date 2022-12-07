import test from 'tape';
import { XML } from '../index.js';

test('XML.from_geojson - point', (t) => {
    const geo = XML.from_geojson({
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [1.1, 2.2]
        }
    });

    t.equals(geo.raw.event._attributes.version, '2.0');
    t.equals(geo.raw.event._attributes.type, 'a-f-G');
    t.equals(geo.raw.event._attributes.how, 'm-g');
    t.equals(geo.raw.event._attributes.uid.length, 36);
    t.equals(geo.raw.event._attributes.time.length, 24);
    t.equals(geo.raw.event._attributes.start.length, 24);
    t.equals(geo.raw.event._attributes.stale.length, 24);

    t.deepEquals(geo.raw.event.point, {
        _attributes: { lat: 2.2, lon: 1.1, hae: 0, ce: 9999999, le: 9999999 }
    });

    t.deepEquals(geo.raw.event.detail, {
        contact: { _attributes: { callsign: 'UNKNOWN' } }
    });

    t.end();
});

test('XML.from_geojson - polygon', (t) => {
    const geo = XML.from_geojson({
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Polygon',
            coordinates: [[
                [ -108.587, 39.098 ],
                [ -108.587, 39.032 ],
                [ -108.505, 39.032 ],
                [ -108.505, 39.098 ],
                [ -108.587, 39.098 ]
            ]],
        }
    });

    t.equals(geo.raw.event._attributes.version, '2.0');
    t.equals(geo.raw.event._attributes.type, 'a-f-G');
    t.equals(geo.raw.event._attributes.how, 'm-g');
    t.equals(geo.raw.event._attributes.uid.length, 36);
    t.equals(geo.raw.event._attributes.time.length, 24);
    t.equals(geo.raw.event._attributes.start.length, 24);
    t.equals(geo.raw.event._attributes.stale.length, 24);

    t.deepEquals(geo.raw.event.point, {
        _attributes: { lat: 2.2, lon: 1.1, hae: 0, ce: 9999999, le: 9999999 }
    });

    t.deepEquals(geo.raw.event.detail, {
        contact: { _attributes: { callsign: 'UNKNOWN' } }
    });

    t.end();
});
