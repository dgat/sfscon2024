export class Task {
    constructor(startTime, endTime, startPlace, endPlace, startStreet, endStreet, startCoordinates, endCoordinates) {
        this.startTime = new Date(startTime);
        this.endTime = new Date(endTime);
        this.startPlace = startPlace;
        this.endPlace = endPlace;
        this.startStreet = startStreet;
        this.endStreet = endStreet;
        this.startCoordinates = startCoordinates; // { lat: Number, lng: Number }
        this.endCoordinates = endCoordinates;     // { lat: Number, lng: Number }
    }

    // Getters and Setters for each property
    getStartTime() { return this.startTime; }
    setStartTime(startTime) { this.startTime = new Date(startTime); }

    getEndTime() { return this.endTime; }
    setEndTime(endTime) { this.endTime = new Date(endTime); }

    getStartPlace() { return this.startPlace; }
    setStartPlace(startPlace) { this.startPlace = startPlace; }

    getEndPlace() { return this.endPlace; }
    setEndPlace(endPlace) { this.endPlace = endPlace; }

    getStartStreet() { return this.startStreet; }
    setStartStreet(startStreet) { this.startStreet = startStreet; }

    getEndStreet() { return this.endStreet; }
    setEndStreet(endStreet) { this.endStreet = endStreet; }

    getStartCoordinates() { return this.startCoordinates; }
    setStartCoordinates(coords) { this.startCoordinates = coords; }

    getEndCoordinates() { return this.endCoordinates; }
    setEndCoordinates(coords) { this.endCoordinates = coords; }

    // Calculate travel time in minutes
    getTravelTime() {
        const durationMs = this.endTime - this.startTime;
        return Math.floor(durationMs / 60000); // convert ms to minutes
    }

    // Method to get a summary of the task
    getSummary() {
        return `
            Start Time: ${this.startTime.toLocaleString()}
            End Time: ${this.endTime.toLocaleString()}
            Duration: ${this.getTravelTime()} minutes
            Start Place: ${this.startPlace} (${this.startStreet})
            End Place: ${this.endPlace} (${this.endStreet})
            Start Coordinates: lat ${this.startCoordinates.lat}, lng ${this.startCoordinates.lng}
            End Coordinates: lat ${this.endCoordinates.lat}, lng ${this.endCoordinates.lng}
        `;
    }
}

function parse_task(task) {
    return new Task(
        `${task["Transportdatum"]} ${task["TRANHSTART"]}`,
        `${task["Transportdatum"]} ${task["tranhende"]}`,
        task["tranvonort"],
        task["tranbisort"],
        task["tranvonstrasse"],
        task["tranbisstrasse"],
        null, // task.startCoordinates
        null  // task.endCoordinates
    );
}

export function parse_tasks(task_list) {
    console.log(task_list);
    const tasks = [];
    task_list.forEach(task => {
        tasks.push(parse_task(task));
    });
    console.log(`Parsed ${tasks.length} tasks from CSV`);
    console.log(tasks);
    return tasks;
}