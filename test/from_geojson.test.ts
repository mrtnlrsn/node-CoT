import test from 'tape';
import CoT from '../index.js';

test('CoT.from_geojson - Point', (t) => {
    const geo = CoT.from_geojson({
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
        _attributes: { lat: '2.2', lon: '1.1', hae: '0.0', ce: '9999999.0', le: '9999999.0' }
    });

    t.deepEquals(geo.raw.event.detail, {
        contact: { _attributes: { callsign: 'UNKNOWN' } }
    });

    t.end();
});

test('CoT.from_geojson - Polygon', (t) => {
    const geo = CoT.from_geojson({
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Polygon',
            coordinates: [[
                [-108.587, 39.098],
                [-108.587, 39.032],
                [-108.505, 39.032],
                [-108.505, 39.098],
                [-108.587, 39.098]
            ]]
        }
    });

    t.equals(geo.raw.event._attributes.version, '2.0');
    t.equals(geo.raw.event._attributes.type, 'u-d-r');
    t.equals(geo.raw.event._attributes.how, 'm-g');
    t.equals(geo.raw.event._attributes.uid.length, 36);
    t.equals(geo.raw.event._attributes.time.length, 24);
    t.equals(geo.raw.event._attributes.start.length, 24);
    t.equals(geo.raw.event._attributes.stale.length, 24);

    t.deepEquals(geo.raw.event.point, {
        _attributes: { lat: '39.065', lon: '-108.54599999999999', hae: '0.0', ce: '9999999.0', le: '9999999.0' }
    });

    t.deepEquals(geo.raw.event.detail, {
        contact: { _attributes: { callsign: 'UNKNOWN' } },
        link: [
            { _attributes: { point: '39.098,-108.587' } },
            { _attributes: { point: '39.032,-108.587' } },
            { _attributes: { point: '39.032,-108.505' } },
            { _attributes: { point: '39.098,-108.505' } }
        ],
        labels_on: { _attributes: { value: 'false' } },
        tog: { _attributes: { enabled: '0' } },
        strokeColor: { _attributes: { value: '16776960' } },
        strokeWeight: { _attributes: { value: '3' } },
        strokeStyle: { _attributes: { value: 'solid' } },
        fillColor: { _attributes: { value: '16776960' } },
        remarks: { _attributes: {}, _text: '' }
    });

    t.end();
});

test('CoT.from_geojson - LineString', (t) => {
    const geo = CoT.from_geojson({
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: [
                [-108.587, 39.098],
                [-108.587, 39.032],
                [-108.505, 39.032],
                [-108.505, 39.098],
                [-108.587, 39.098]
            ]
        }
    });

    t.equals(geo.raw.event._attributes.version, '2.0');
    t.equals(geo.raw.event._attributes.type, 'u-d-f');
    t.equals(geo.raw.event._attributes.how, 'm-g');
    t.equals(geo.raw.event._attributes.uid.length, 36);
    t.equals(geo.raw.event._attributes.time.length, 24);
    t.equals(geo.raw.event._attributes.start.length, 24);
    t.equals(geo.raw.event._attributes.stale.length, 24);

    t.deepEquals(geo.raw.event.point, {
        _attributes: { lat: '39.098', lon: '-108.505', hae: '0.0', ce: '9999999.0', le: '9999999.0' }
    });

    t.deepEquals(geo.raw.event.detail, {
        contact: { _attributes: { callsign: 'UNKNOWN' } },
        link: [
            { _attributes: { point: '39.098,-108.587' } },
            { _attributes: { point: '39.032,-108.587' } },
            { _attributes: { point: '39.032,-108.505' } },
            { _attributes: { point: '39.098,-108.505' } },
            { _attributes: { point: '39.098,-108.587' } }
        ],
        labels_on: { _attributes: { value: 'false' } },
        tog: { _attributes: { enabled: '0' } },
        strokeColor: { _attributes: { value: '16776960' } },
        strokeWeight: { _attributes: { value: '3' } },
        strokeStyle: { _attributes: { value: 'solid' } },
        remarks: { _attributes: {}, _text: '' }
    });

    t.end();
});

test('CoT.from_geojson - Start', (t) => {
    const geo = CoT.from_geojson({
        type: 'Feature',
        properties: {
            // 1hr in the future
            start: new Date(+new Date() + 60 * 60 * 1000)
        },
        geometry: {
            type: 'Point',
            coordinates: [1.1, 2.2]
        }
    });

    // Approx +/- 100ms + 1hr ahead of Now
    t.ok(+new Date(geo.raw.event._attributes.start) > +new Date() + 60 * 60 * 1000 - 100);
    t.ok(+new Date(geo.raw.event._attributes.start) < +new Date() + 60 * 60 * 1000 + 100);

    // Approx +/- 100ms ahead of Now
    t.ok(+new Date(geo.raw.event._attributes.time) > +new Date() - 100);
    t.ok(+new Date(geo.raw.event._attributes.time) < +new Date() + 100);

    // Approx +/- 100ms +1hr20s ahead of now
    t.ok(+new Date(geo.raw.event._attributes.stale) > +new Date(geo.raw.event._attributes.start) - 100 + 20 * 1000);
    t.ok(+new Date(geo.raw.event._attributes.stale) < +new Date(geo.raw.event._attributes.start) + 100 + 20 * 1000);

    t.end();
});

test('CoT.from_geojson - Start/Stale', (t) => {
    const geo = CoT.from_geojson({
        type: 'Feature',
        properties: {
            // 1hr in the future
            start: new Date(+new Date() + 60 * 60 * 1000),
            stale: 60 * 1000
        },
        geometry: {
            type: 'Point',
            coordinates: [1.1, 2.2]
        }
    });

    // Approx +/- 100ms + 1hr ahead of Now
    t.ok(+new Date(geo.raw.event._attributes.start) > +new Date() + 60 * 60 * 1000 - 100);
    t.ok(+new Date(geo.raw.event._attributes.start) < +new Date() + 60 * 60 * 1000 + 100);

    // Approx +/- 100ms ahead of Now
    t.ok(+new Date(geo.raw.event._attributes.time) > +new Date() - 100);
    t.ok(+new Date(geo.raw.event._attributes.time) < +new Date() + 100);

    // Approx +/- 100ms +1hr60s ahead of now
    t.ok(+new Date(geo.raw.event._attributes.stale) > +new Date(geo.raw.event._attributes.start) - 100 + 60 * 1000);
    t.ok(+new Date(geo.raw.event._attributes.stale) < +new Date(geo.raw.event._attributes.start) + 100 + 60 * 1000);

    t.end();
});

test('CoT.from_geojson - Icon', (t) => {
    const geo = CoT.from_geojson({
        type: 'Feature',
        properties: {
            icon: '66f14976-4b62-4023-8edb-d8d2ebeaa336/Public Safety Air/EMS_ROTOR.png'
        },
        geometry: {
            type: 'Point',
            coordinates: [1.1, 2.2]
        }
    });

    t.deepEquals(geo.raw.event.detail, {
        contact: { _attributes: { callsign: 'UNKNOWN' } },
        usericon: { _attributes: { iconsetpath: '66f14976-4b62-4023-8edb-d8d2ebeaa336/Public Safety Air/EMS_ROTOR.png' } }
    });

    t.end();
});

test('CoT.from_geojson - Height Above Earth', (t) => {
    t.deepEquals(CoT.from_geojson({
        type: 'Feature',
        properties: {
        },
        geometry: {
            type: 'Point',
            coordinates: [1.1, 2.2]
        }
    }).raw.event.point._attributes, {
        lat: '2.2',
        lon: '1.1',
        hae: '0.0',
        ce: '9999999.0',
        le: '9999999.0'
    }, 'default hae');

    t.deepEquals(CoT.from_geojson({
        type: 'Feature',
        properties: {
        },
        geometry: {
            type: 'Point',
            coordinates: [1.1, 2.2, 101]
        }
    }).raw.event.point._attributes, {
        lat: '2.2',
        lon: '1.1',
        hae: '101',
        ce: '9999999.0',
        le: '9999999.0'
    }, 'custom hae (meters)');

    t.end();
});

test('CoT.from_geojson - Course & Speed', (t) => {
    t.deepEquals(CoT.from_geojson({
        type: 'Feature',
        properties: {
            course: 260,
            speed: 120
        },
        geometry: {
            type: 'Point',
            coordinates: [1.1, 2.2]
        }
    }).raw.event.detail.track, {
        _attributes: {
            'course': '260',
            'speed': '120'
        }
    }, 'track');

    t.end();
});

test('CoT.from_geojson - Remarks', (t) => {
    t.deepEquals(CoT.from_geojson({
        type: 'Feature',
        properties: {
            course: 260,
            speed: 120,
            remarks: 'Test'
        },
        geometry: {
            type: 'Point',
            coordinates: [1.1, 2.2]
        }
    }).raw.event.detail.track, {
        _attributes: {
            'course': '260',
            'speed': '120'
        }
    }, 'track');

    t.end();
});
