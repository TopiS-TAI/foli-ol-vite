const stop_times = 'http://data.foli.fi/gtfs/v0/20250712-192745/stop_times/stop/'
const route_shapes = 'http://data.foli.fi/gtfs/v0/20250712-192745/shapes/'

export async function getTripsByStop(stop) {
    const res = await fetch(stop_times + stop)
    if (!res.ok) {
        console.log('res', res)
        return {status: res.status, statusText: res.statusText}
    }
    return res.json()
}

export async function getTripsByStops(stops) {
    const requests = []
    for (const stop of stops) {
        requests.push(
            fetch(stop_times + stop)
        )
    }
    const res = await Promise.all(requests)
    const trips = res.map(async r => {
        if (!r.ok) {
            return {status: r.status, statusText: r.statusText}
        }
        const data = await r.json()
        return data
    })
    return await Promise.all(trips)
}

export async function getRouteShapes(routes) {
    const requests = []
    for (const route of routes) {
        requests.push(
            fetch(route_shapes + route)
        )
    }
    const res = await Promise.all(requests)
    const shapes = res.map(async r => {
        if (!r.ok) {
            return {status: r.status, statusTest: r.statusText}
        }
        const data = await r.json()
        return data
    })
    return await Promise.all(shapes)
}
