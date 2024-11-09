export async function getRoute(coordinates) {
    // Construct the base URL
    const baseUrl = "http://127.0.0.1:5000/route/v1/driving/";

    let duration = 0;
    let route = {
        type: "Feature",
        geometry: null,
        properties: {}
    };

    for (let i = 0; i < coordinates.length; i++) {
        // Format coordinates as required by the API
        const coordinatesParam = coordinates[i].map(coord => coord.join(',')).join(';');
        // Construct the full URL with query parameters
        const url = `${baseUrl}${coordinatesParam}?steps=false&geometries=geojson`;

        try {
            const response = await fetch(url);

            // Check if the response is OK
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            // Parse and return JSON data
            const data = await response.json();
            duration += data.routes[0].duration;
            let geometry = data.routes[0].geometry;
            if (route.geometry === null) {
                route.geometry = geometry;
            }
            else {
                route.geometry.coordinates = route.geometry.coordinates.concat(geometry.coordinates);
            }
        } catch (error) {
            console.error("Failed to fetch route:", error);
            return null;
        }
    }
    return {duration, route}
}

export async function getTrip(coordinates) {
    // Construct the base URL
    const baseUrl = "http://127.0.0.1:5000/trip/v1/driving/";

    let duration = 0;
    let route = {
        type: "Feature",
        geometry: null,
        properties: {}
    };

    // Format coordinates as required by the API
    const coordinatesParam = coordinates.map(coord => coord.join(',')).join(';');
    // Construct the full URL with query parameters
    const url = `${baseUrl}${coordinatesParam}?geometries=geojson`;
    try {
        const response = await fetch(url);
        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        // Parse and return JSON data
        const data = await response.json();
        let duration = data.routes[0].duration;
        route.geometry = geometry;
        return {duration, route};
    } catch (error) {
        console.error("Failed to fetch route:", error);
        return null;
    }
}

export async function getTripWithEnd(coordinates, end) {
    let {duration, route} = await getTrip(coordinates);
    let endPoint = route.geometry.coordinates[route.geometry.coordinates.length - 1];
    let {duration2, route2} = await getRoute([endPoint, end]);
    duration += duration2;
    route.geometry.coordinates = route.geometry.coordinates.concat(route2.geometry.coordinates);
    return {duration, route}
}


