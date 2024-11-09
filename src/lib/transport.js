export class Transport {
    tasks = [];
    vehicleType = "";

    constructor(vehicleType, tasks) {
        this.vehicleType = vehicleType;
        this.tasks = tasks;
    }
    getRollstuhleCount() {
        let counter = 0;
        this.tasks.forEach(t => {
            if (t.type == "STUHL") counter++;
        });
        return counter;
    }
    getGehenCount() {
        let counter = 0;
        this.tasks.forEach(t => {
            if (t.type == "KANN GEHEN") counter++;
        });
        return counter;
    }

    getLiegenCount() {
        let counter = 0;
        this.tasks.forEach(t => {
            if (t.type == "LIEGE") counter++;
        });
        return counter;
    }

    getMaxRollstuhleCount() {
        switch (this.vehicleType) {
            case "KTW":
                return 1;
            case "MFF1":
                return 1;
            case "MFF2":
                return 2;
            case "PKW":
                return 0;
            default:
                return "?";
        }
    }
    getMaxLiegenCount() {
        switch (this.vehicleType) {
            case "KTW":
                return 1;
            case "MFF1":
                return 0;
            case "MFF2":
                return 0;
            case "PKW":
                return 0;
            default:
                return "?";
        }
    }

    getMaxGehenCount() {
        switch (this.vehicleType) {
            case "KTW":
                return 2;
            case "MFF1":
                return 4;
            case "MFF2":
                return 3;
            case "PKW":
                return 4;
            default:
                return "?";
        }
    }
}


