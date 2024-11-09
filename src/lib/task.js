export class Task {
    id = null;
    date = null
    startTime = null;
    endTime = null;
    startPlace = null;
    endPlace = null;
    startStreet = null;
    endStreet = null;
    startCoordinates = null;
    endCoordinates = null;
    type = null;
    estimatedTime = null;



    constructor(id, date, startTime, endTime, startPlace, endPlace, startStreet, endStreet, startCoordinates, endCoordinates, type, estimatedTime) {
        this.id = id;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.startPlace = startPlace;
        this.endPlace = endPlace;
        this.startStreet = startStreet;
        this.endStreet = endStreet;
        if (this.startPlace == "BOZEN")
            this.startCoordinates = [11.331212, 46.486816]
        else
            this.startCoordinates = startCoordinates; // { lat: Number, lng: Number }
        if (this.endPlace == "BOZEN")
            this.endCoordinates = [11.331212, 46.486816]
        else
            this.endCoordinates = endCoordinates;     // { lat: Number, lng: Number }
        this.type = type;
        this.estimatedTime = estimatedTime;
    }

    isDate(date) {
        return this.date == date;
    }

    isHinfahrt() {
        return this.endStreet === "KRANKENHAUS" || this.endStreet === "BONVICINI" || this.endStreet === "NIERENZENTRUM" || this.endStreet === "BONVICINI-RADIO" || this.endStreet === "HYPERBARISCHES ZENTRUM" || this.endStreet === "OBJ - HYPERBARISCHE KAMMER" || this.endStreet === "KH . BOZEN" || this.endStreet === "NZ - NIERENZENTRUM";
    }

    toHumanEndTime() {
        return `${Math.floor(this.endTime / 60).toString().padStart(2, '0')}:${(this.endTime % 60).toString().padStart(2, '0')}`
    }
    toHumanStartTime() {
        return `${Math.floor(this.startTime / 60).toString().padStart(2, '0')}:${(this.startTime % 60).toString().padStart(2, '0')}`
    }

    getHinfahrtLatestStartTime() {
        return this.endTime - this.estimatedTime;
    }

    // Getters and Setters for each property
    getStartTime() { return this.startTime; }
    setStartTime(startTime) { this.startTime = startTime; }

    getEndTime() { return this.endTime; }
    setEndTime(endTime) { this.endTime = endTime; }

    getStartPlace() { return this.startPlace; }
    setStartPlace(startPlace) { this.startPlace = startPlace; }

    getType() { return this.type; }
    setType(type) { this.type = type; }

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

    getTravelTime() {
        const duration = this.endTime - this.startTime;
        return duration;
    }

    // Method to get a summary of the task
    getSummary() {
        return `
            Start Time: ${this.startTime}
            End Time: ${this.endTime}
            Duration: ${this.getTravelTime()} minutes
            Start Place: ${this.startPlace} (${this.startStreet})
            End Place: ${this.endPlace} (${this.endStreet})
            Start Coordinates: lat ${this.startCoordinates.lat}, lng ${this.startCoordinates.lng}
            End Coordinates: lat ${this.endCoordinates.lat}, lng ${this.endCoordinates.lng}
        `;
    }
}

function timeToMinutes(time) {
    let array = time.split(":");
    return parseInt(array[0]) * 60 + parseInt(array[1]);
}

function parse_task(task) {
    return new Task(
        task["Transportnummer"],
        task["Transportdatum"],
        timeToMinutes(task["TRANHSTART"]),
        timeToMinutes(task["tranhende"]),
        task["tranvonort"],
        task["tranbisort"],
        task["tranvonstrasse"],
        task["tranbisstrasse"],
        [parseFloat(task["start_longitude"]), parseFloat(task["start_latitude"])],
        [parseFloat(task["end_longitude"]), parseFloat(task["end_latitude"]),],
        task["Transportart"],
        task["estimated_time"],
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