export class Transport {
    tasks = [];
    vehicleType = "";

    constructor(vehicleType, tasks) {
        this.vehicleType = vehicleType;
        this.tasks = tasks;
    }
}