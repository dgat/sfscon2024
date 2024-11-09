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
