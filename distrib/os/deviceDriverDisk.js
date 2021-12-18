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
            let fileExist = this.tsbFileName(fileName);
            if (this.tsbFileName(fileName) == null) {
                var name;
                var tsbName = "";
                var tsbData = "";
                var data;
                //get name tsb
                for (var x = 0; x < _Disk.sectors; x++) {
                    for (var y = 1; y < _Disk.blocks; y++) {
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
                tsbNameArray[1] = tsbData[0];
                tsbNameArray[2] = tsbData[2];
                let truth = true;
                tsbNameArray[3] = tsbData[4];
                tsbDataArray[1] = "FF";
                tsbDataArray[2] = "FF";
                tsbDataArray[3] = "FF";
                // enters the fileName 
                let i = 0;
                while (i < fileName.length) {
                    //turns into hexadecimal
                    tsbNameArray[i + 4] = TSOS.Utils.decimalToHex(fileName.charCodeAt(i));
                    i++;
                }
                // save to session storage
                console.log(tsbName);
                let tsbNameJoin = tsbNameArray.join();
                let tsbDataJoin = tsbDataArray.join();
                sessionStorage.setItem(tsbName, tsbNameJoin);
                sessionStorage.setItem(tsbData, tsbDataJoin);
                console.log();
                console.log(sessionStorage);
                TSOS.Control.diskTableUpdate();
                return truth;
            }
            else {
                return false;
            }
        }
        deleteFile(fileName) {
            let i = 0;
            const max = 4;
            this.deleteFileData(fileName);
            //deletes name blockString
            var empty = new Array(64);
            while (i < empty.length) {
                if (i > max) {
                    empty[i] = "00";
                }
                else {
                    empty[i] = "0";
                }
                i++;
            }
            let emptyJoin = empty.join();
            sessionStorage.setItem(fileName, emptyJoin);
            TSOS.Control.diskTableUpdate();
        } //deleteFile
        deleteFileData(fileName) {
            let end = "FF:FF:FF";
            let tempName = sessionStorage.getItem(fileName);
            var name = tempName.split(",");
            var data = name[1] + ":" + name[2] + ":" + name[3];
            let tempData = sessionStorage.getItem(data);
            var dataBlock = tempData.split(",");
            var nextBlock = dataBlock[1] + ":" + dataBlock[2] + ":" + dataBlock[3];
            if (nextBlock != end) {
                this.deleteFileData(data);
            }
            var emptyBlock = new Array(64);
            let i = 0;
            while (i < emptyBlock.length) {
                if (i < 4) {
                    emptyBlock[i] = "0";
                }
                else {
                    emptyBlock[i] = "00";
                }
                i++;
            }
            let emptyJoin = emptyBlock.join();
            sessionStorage.setItem(data, emptyJoin);
        }
        //returns null if file not found
        tsbFileName(fileName) {
            var dataArray;
            var name;
            const max = 4;
            let temp;
            for (var x = 0; x < _Disk.sectors; x++) {
                for (var y = 0; y < _Disk.sectors; y++) {
                    temp = sessionStorage.getItem("0:" + x + ":" + y);
                    dataArray = temp.split(",");
                    //
                    name = "";
                    for (var z = max; z < dataArray.length; z++) {
                        if (dataArray[z] == "00") {
                            z = dataArray.length;
                            let w = true;
                        }
                        else {
                            name += String.fromCharCode(TSOS.Utils.hexToDecimal(dataArray[z]));
                        }
                    }
                    ///
                    if (name == fileName) {
                        return "0:" + x + ":" + y;
                    }
                }
            }
            return null;
        } //tsbFileName
        readFile(fileName) {
            let nameTemp = sessionStorage.getItem(fileName);
            const name = nameTemp.split(",");
            let dataTemp = sessionStorage.getItem(name[1] + ":" + name[2] + ":" + name[3]);
            const data = dataTemp.split(",");
            return this.readFileData(data);
        }
        readFileData(file) {
            let i = 4;
            const end = "FF:FF:FF";
            var data = null;
            while (i < file.length) {
                if (file[i] == "00") {
                    return data;
                }
                else {
                    data += String.fromCharCode(TSOS.Utils.hexToDecimal(data[i]));
                }
            }
            var nextBlockTSB = file[1] + ":" + file[2] + ":" + file[3];
            if (nextBlockTSB == end) {
                return data;
            }
            else {
                data += this.readFileData(sessionStorage.getItem(nextBlockTSB).split(","));
            }
        }
        writeFile(fileName, input, type) {
            this.deleteFileData(fileName);
            const one = "1";
            let tempaArr = sessionStorage.getItem(fileName); //
            var nameArray = tempaArr.split(",");
            var data = nameArray[1] + ":" + nameArray[2] + ":" + nameArray[3];
            const emptyArr = new Array(64);
            let i = 0;
            while (i < emptyArr.length) {
                if (i < 4) {
                    emptyArr[i] = "0";
                }
                else {
                    emptyArr[i] = "00";
                }
                i++;
            }
            emptyArr[0] = one;
            sessionStorage.setItem(data, emptyArr.join());
            if (type == "swap") {
                // Write the hex to disk
                this.writeBlocks(input.split(","), data);
            }
            else {
                var userDataArray = [];
                let i = 0;
                while (i < input.length) {
                    userDataArray[userDataArray.length] = TSOS.Utils.decimalToHex(input.charCodeAt(i));
                    i++;
                }
                // Write to the actual data blocks
                this.writeBlocks(userDataArray, data);
            }
        } //write
        writeBlocks(dataArray, dataBlock) {
            const maxLen = 60;
            if (dataArray.length > maxLen) {
                //finds next tsb
                let nextAvailableBlock = "";
                let nextAvailableBlockArr;
                for (var x = 1; x < _Disk.tracks; x++) {
                    for (var y = 0; y < _Disk.sectors; y++) {
                        for (var z = 0; z < _Disk.sectors; z++) {
                            nextAvailableBlockArr = sessionStorage.getItem(x + ":" + y + ":" + z).split(",");
                            if (nextAvailableBlockArr[0] == "0") {
                                nextAvailableBlock = x + ":" + y + ":" + z;
                                x = Number.MAX_VALUE;
                                y = Number.MAX_VALUE;
                                z = Number.MAX_VALUE;
                            }
                        }
                    }
                }
                //
                const max = 4;
                var emptyBlock = new Array(64);
                let l = 0;
                while (l < emptyBlock.length) {
                    if (l < max) {
                        emptyBlock[l] = "0";
                    }
                    else {
                        emptyBlock[l] = "00";
                    }
                    l++;
                }
                // and change used bit back to in use
                emptyBlock[0] = "1";
                let tempEmpt = emptyBlock.join();
                sessionStorage.setItem(nextAvailableBlock, tempEmpt);
                var newArray = dataArray.splice(0, maxLen);
                this.writeBlocks(dataArray, nextAvailableBlock);
                let blockOne = nextAvailableBlock[0];
                let blockTwo = nextAvailableBlock[2];
                let blockThree = nextAvailableBlock[4];
                var dataBlockArray = ["1", blockOne, blockTwo, blockThree];
                z = 0;
                while (z < maxLen) {
                    dataBlockArray[dataBlockArray.length] = newArray[z];
                    z++;
                }
                // and put it into session storage
                let tempArr = dataBlockArray.join();
                sessionStorage.setItem(dataBlock, tempArr);
            }
            else {
                let i = dataArray.length;
                while (i < maxLen) {
                    dataArray[dataArray.length] = "00";
                    i++;
                }
                var lastBlock = ["1", "FF", "FF", "FF"];
                let concatBlock = lastBlock.concat(dataArray);
                let joinBlock = concatBlock.join();
                sessionStorage.setItem(dataBlock, joinBlock);
            }
        } //writeToDatablocks
        readSwap(fileName) {
            var swapData = [];
            const end = "FF:FF:FF";
            let tempName = sessionStorage.getItem(fileName);
            var nameArray = tempName.split(",");
            let nameOne = nameArray[1];
            let nameTwo = nameArray[2];
            let nameThree = nameArray[3];
            var dataTSB = nameOne + ":" + nameTwo + ":" + nameThree;
            var dataTSBArray = sessionStorage.getItem(dataTSB).split(",");
            let i = 4;
            while (i < dataTSBArray.length) {
                swapData[swapData.length] = dataTSBArray[i];
                i++;
            }
            let dataOne = dataTSBArray[1];
            let dataTwo = dataTSBArray[2];
            let dataThree = dataTSBArray[3];
            var nextBlock = dataOne + ":" + dataTwo + ":" + dataThree;
            if (!(nextBlock == end)) {
                let swapFile = this.readSwap(dataTSB);
                swapData = swapData.concat(swapFile);
                return swapData;
            }
            else {
                return swapData;
            }
        }
        getRollInData(PID) {
            const max = 256;
            var rollInNameTSB = this.tsbFileName("SwapFile " + PID);
            var rollInData = this.readSwap(rollInNameTSB);
            // deletes the swap file from the disk
            this.deleteFile(rollInNameTSB);
            return rollInData.slice(0, max);
        }
        makeSwap(PID, inputArray) {
            // create a swap file name block
            if (this.createFile("SwapFile " + PID)) {
                // Add 00s onto the end to take up the necessary space
                let i = inputArray.length;
                while (i < 256) {
                    inputArray[inputArray.length] = "00";
                    i++;
                }
                let fileName = this.tsbFileName("SwapFile " + PID);
                let joinArr = inputArray.join();
                let swap = "swap";
                this.writeFile(fileName, joinArr, swap);
            }
            else {
                console.log("Error, swap file already exists.");
            }
        }
    } //DeviceDriverDisk
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=deviceDriverDisk.js.map