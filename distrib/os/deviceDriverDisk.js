/*  ----------------------------------
    deviceDriverDisk.ts
    Disk Driver for file system
    ----------------------------------  */
var TSOS;
(function (TSOS) {
    class DeviceDriverDisk extends TSOS.DeviceDriver {
        constructor() {
            super();
            this.driverEntry = this.diskDriverEntry;
        }
        init() {
        }
        diskDriverEntry() {
            this.status = "loaded";
        } //diskDriverEntry
        diskFormat() {
            const block = new Array(64);
            //sets all blocks to 0
            for (var i = 0; i < block.length; i++) {
                if (i > 4) {
                    block[i] = "00";
                }
                else {
                    block[i] = "0";
                }
            } //for
            //turns arrays into string 
            let blockString = block.join();
            //formatting is as easy as x,y and z
            for (var x = 0; x < _Disk.tracks; x++) {
                for (var y = 0; y < _Disk.sectors; y++) {
                    for (var z = 0; z < _Disk.blocks; z++) {
                        sessionStorage.setItem(x + ":" + y + ":" + z, blockString);
                    }
                }
            } //for
        } //diskFormat
        createFile(fileName) {
            // W TODO Check for duplicate file names by using findFile function
            var name;
            var tsbName = "";
            var tsbData = "";
            var data;
            //get name tsb
            for (var x = 0; x < _Disk.sectors; x++) {
                for (var y = 1; y < _Disk.blocks; y++) { // We start at one to not override the Master Boot Record, which doesnt do anything in out OS but good practice to not override it
                    name = sessionStorage.getItem("0:" + x + ":" + y).split(",");
                    if (name[0] == "0") {
                        console.log(name);
                        console.log("0:" + x + ":" + y);
                        tsbName = "0:" + x + ":" + y;
                        x = Number.MAX_VALUE;
                        y = Number.MAX_VALUE;
                    }
                }
            }
            //data
            for (var x = 1; x < _Disk.tracks; x++) {
                for (var y = 0; y < _Disk.sectors; y++) {
                    for (var z = 0; z < _Disk.sectors; z++) {
                        data = sessionStorage.getItem(x + ":" + y + ":" + z).split(",");
                        if (data[0] == "0") {
                            tsbData = x + ":" + y + ":" + z;
                            x = Number.MAX_VALUE;
                            y = Number.MAX_VALUE;
                            z = Number.MAX_VALUE;
                        }
                    }
                }
            }
            console.log(tsbName, tsbData);
            let tempName = sessionStorage.getItem(tsbName);
            let tempData = sessionStorage.getItem(tsbData);
            let tsbNameArray = tempName.split(",");
            let tsbDataArray = tempData.split(",");
            // Assign their used bits to 1 to show they are being used
            tsbNameArray[0] = "1";
            tsbDataArray[0] = "1";
            tsbDataArray[1] = "FF";
            tsbDataArray[2] = "FF";
            tsbDataArray[3] = "FF";
            tsbNameArray[1] = tsbData[0];
            tsbNameArray[2] = tsbData[2];
            tsbNameArray[3] = tsbData[4];
            // enters the fileName 
            for (var i = 0; i < fileName.length; i++) {
                //turns into hexadecimal
                tsbNameArray[i + 4] = TSOS.Utils.decimalToHex(fileName.charCodeAt(i));
            }
            // save to session storage
            console.log(tsbName);
            sessionStorage.setItem(tsbName, tsbNameArray.join());
            sessionStorage.setItem(tsbData, tsbDataArray.join());
            console.log();
            console.log(sessionStorage);
            // Control.diskTableUpdate();
        }
    } //DeviceDriverDisk
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=deviceDriverDisk.js.map