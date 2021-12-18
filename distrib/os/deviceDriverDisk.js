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
                tsbNameArray[3] = tsbData[4];
                tsbDataArray[1] = "FF";
                tsbDataArray[2] = "FF";
                tsbDataArray[3] = "FF";
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
                TSOS.Control.diskTableUpdate();
                return true;
            }
            else {
                return false;
            }
        }
        deleteFile(fileName) {
            let i = 0;
            this.deleteFileDataBlock(fileName);
            //deletes name blockString
            var empty = new Array(64);
            while (i < empty.length) {
                if (i < 4) {
                    empty[i] = "0";
                }
                else {
                    empty[i] = "00";
                }
                i++;
            }
            sessionStorage.setItem(fileName, empty.join());
            TSOS.Control.diskTableUpdate();
        } //deleteFile
        // deletes the block(s) that hold the file data
        deleteFileDataBlock(fileNameTSB) {
            var name = sessionStorage.getItem(fileNameTSB).split(",");
            var dataTsb = name[1] + ":" + name[2] + ":" + name[3];
            var dataBlockArray = sessionStorage.getItem(dataTsb).split(",");
            var nextBlockTSB = dataBlockArray[1] + ":" + dataBlockArray[2] + ":" + dataBlockArray[3];
            if (nextBlockTSB != "FF:FF:FF") {
                this.deleteFileDataBlock(dataTsb);
            }
            var emptyBlock = new Array(64);
            for (var i = 0; i < emptyBlock.length; i++) {
                if (i < 4) {
                    emptyBlock[i] = "0";
                }
                else {
                    emptyBlock[i] = "00";
                }
            }
            sessionStorage.setItem(dataTsb, emptyBlock.join());
        }
        //returns null if file not found
        tsbFileName(fileName) {
            var dataArray;
            var name;
            for (var j = 0; j < _Disk.sectors; j++) {
                for (var k = 0; k < _Disk.sectors; k++) {
                    dataArray = sessionStorage.getItem("0:" + j + ":" + k).split(",");
                    //
                    name = "";
                    for (var w = 4; w < dataArray.length; w++) {
                        if (dataArray[w] == "00") {
                            w = dataArray.length;
                        }
                        else {
                            name += String.fromCharCode(TSOS.Utils.hexToDecimal(dataArray[w]));
                        }
                    }
                    ///
                    if (name == fileName) {
                        return "0:" + j + ":" + k;
                    }
                }
            }
            return null;
        } //tsbFileName
        readFile(fileName) {
            const name = sessionStorage.getItem(fileName).split(",");
            const data = sessionStorage.getItem(name[1] + ":" + name[2] + ":" + name[3]).split(",");
            return this.readFileData(data);
        }
        readFileData(fileArray) {
            var fileData = null;
            for (var i = 4; i < fileArray.length; i++) {
                if (fileArray[i] == "00") {
                    return fileData;
                }
                else {
                    fileData += String.fromCharCode(TSOS.Utils.hexToDecimal(fileArray[i]));
                }
            }
            // Some fancy recursion
            var nextBlockTSB = fileArray[1] + ":" + fileArray[2] + ":" + fileArray[3];
            if (nextBlockTSB == "FF:FF:FF") {
                return fileData;
            }
            else {
                fileData += this.readFileData(sessionStorage.getItem(nextBlockTSB).split(","));
            }
        }
        writeFile(fileName, fileText, type) {
            this.deleteFileDataBlock(fileName);
            var nameArray = sessionStorage.getItem(fileName).split(",");
            var dataBlock = nameArray[1] + ":" + nameArray[2] + ":" + nameArray[3];
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
            // and change used bit back to in use
            emptyArr[0] = "1";
            sessionStorage.setItem(dataBlock, emptyArr.join());
            //if its a swap file, its already in hex so we dont need to convert it
            if (type == "swap") {
                // Write the hex to disk
                this.writeToDataBlocks(fileText.split(","), dataBlock);
            }
            else {
                // Create an array of hex pairs to add to the file
                var userDataArray = [];
                for (i = 0; i < fileText.length; i++) {
                    userDataArray[userDataArray.length] = TSOS.Utils.decimalToHex(fileText.charCodeAt(i));
                }
                // Write to the actual data blocks
                this.writeToDataBlocks(userDataArray, dataBlock);
            }
        } //write
        writeToDataBlocks(userDataArray, dataBlockTSB) {
            if (userDataArray.length > 60) {
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
                // claim that block so the other blocks know its being used
                // Create an empty block array
                var emptyBlock = new Array(64);
                for (var i = 0; i < emptyBlock.length; i++) {
                    if (i < 4) {
                        emptyBlock[i] = "0";
                    }
                    else {
                        emptyBlock[i] = "00";
                    }
                }
                // and change used bit back to in use
                emptyBlock[0] = "1";
                sessionStorage.setItem(nextAvailableBlock, emptyBlock.join());
                var newUserDataArray = userDataArray.splice(0, 60);
                this.writeToDataBlocks(userDataArray, nextAvailableBlock); // So much recursion! Very cool!
                // make the array of the data start with the used bit and the three digits of the next TSB
                var dataBlockArray = ["1", nextAvailableBlock[0], nextAvailableBlock[2], nextAvailableBlock[4]];
                // then add the data from the userDataArray
                for (var i = 0; i < 60; i++) {
                    dataBlockArray[dataBlockArray.length] = newUserDataArray[i];
                }
                // and put it into session storage
                sessionStorage.setItem(dataBlockTSB, dataBlockArray.join());
            }
            else { //this happens if we dont need another data block
                // we add 00s to the end of the userDataArray to make sure it is the correct length
                for (var i = userDataArray.length; i < 60; i++) {
                    userDataArray[userDataArray.length] = "00";
                }
                // we then make the used bit and next TSB array
                var lastBlockArray = ["1", "FF", "FF", "FF"]; // Used to add to the front of the userData
                // and store it in session storage by adding it to the front of the userData
                sessionStorage.setItem(dataBlockTSB, lastBlockArray.concat(userDataArray).join());
            }
        } //writeToDatablocks
        readSwapFileData(fileNameTSB) {
            var swapFileData = [];
            var nameTSBArray = sessionStorage.getItem(fileNameTSB).split(",");
            var dataTSB = nameTSBArray[1] + ":" + nameTSBArray[2] + ":" + nameTSBArray[3];
            var dataTSBArray = sessionStorage.getItem(dataTSB).split(",");
            // Add the data to the array
            for (var i = 4; i < dataTSBArray.length; i++) {
                swapFileData[swapFileData.length] = dataTSBArray[i];
            }
            // Check for another data block
            var nextBlockTSB = dataTSBArray[1] + ":" + dataTSBArray[2] + ":" + dataTSBArray[3];
            // if there is a next block, hit me up with that sweet recursion
            if (!(nextBlockTSB == "FF:FF:FF")) {
                swapFileData = swapFileData.concat(this.readSwapFileData(dataTSB));
                return swapFileData;
            }
            else {
                return swapFileData;
            }
        }
        getRollInData(PID) {
            // gets the data from the swap file
            //find name
            var rollInNameTSB = this.tsbFileName("SwapFile " + PID);
            var rollInData = this.readSwapFileData(rollInNameTSB);
            // deletes the swap file from the disk
            this.deleteFile(rollInNameTSB);
            return rollInData.slice(0, 256);
        }
        createSwap(PID, inputArray) {
            // create a swap file name block
            if (this.createFile("SwapFile " + PID)) {
                // Add 00s onto the end to take up the necessary space
                let i = inputArray.length;
                while (i < 256) {
                    inputArray[inputArray.length] = "00";
                    i++;
                }
                let fileName = this.tsbFileName("SwapFile " + PID);
                this.writeFile(fileName, inputArray.join(), "swap");
            }
            else {
                console.log("Error, swap file already exists.");
            }
        }
    } //DeviceDriverDisk
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=deviceDriverDisk.js.map