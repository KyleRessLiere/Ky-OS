/*  ----------------------------------
    deviceDriverDisk.ts
    Disk Driver for file system
    ----------------------------------  */

module TSOS {

    export class DeviceDriverDisk extends DeviceDriver {

        constructor() {
            super();
            this.driverEntry = this.diskDriverEntry;
        }
        public init(): void {
        
        } 

        public diskDriverEntry() {
         
            this.status = "loaded";
            
        }//diskDriverEntry

        public diskFormat(){
            const block: string[] = new Array(64);
            //sets all blocks to 0
            for (var i = 0; i < block.length; i++) {
                if (i > 4) {
                    block[i] = "00";
                } else {
                    block[i] = "0"
                }
            }//for
            //turns arrays into string 
            let blockString:string = block.join();
            
            //formatting is as easy as x,y and z
            for (var x = 0; x < _Disk.tracks; x++) {
                for (var y = 0; y < _Disk.sectors; y++) {
                    for (var z = 0; z < _Disk.blocks; z++) {
                        sessionStorage.setItem(x + ":" + y + ":" + z,blockString);
                    }
                }
            }//for
            
        }//diskFormat


        public createFile(fileName: String) {
            

            var name: string[];
            var tsbName:string = "";
            var tsbData: string = "";
            var data: string[];
           

            //get name tsb
            for (var x = 0; x < _Disk.sectors; x++) {
                for (var y = 1; y < _Disk.blocks; y++) {   
                    name = sessionStorage.getItem("0:" + x + ":" + y).split(",");
                    if (name[0] == "0") {
                        console.log(name)
                        console.log("0:" + x + ":" + y);
                        tsbName =  "0:" + x + ":" + y;
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
                            x  =Number.MAX_VALUE;
                            y  =Number.MAX_VALUE;
                            z =Number.MAX_VALUE;
                        }
                    }
                }
            }

            console.log(tsbName, tsbData)
            let tempName:string = sessionStorage.getItem(tsbName);
            let tempData:string = sessionStorage.getItem(tsbData);
            let tsbNameArray: string[] = tempName.split(",");
            let tsbDataArray: string[] = tempData.split(",");

            // Assign their used bits to 1 to show they are being used
            tsbNameArray[0] = "1"
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
                tsbNameArray[i + 4] = Utils.decimalToHex(fileName.charCodeAt(i));
            }
           
            // save to session storage
            console.log(tsbName);
            sessionStorage.setItem(tsbName, tsbNameArray.join());
            sessionStorage.setItem(tsbData, tsbDataArray.join());

            console.log()
            
            console.log(sessionStorage)
            Control.diskTableUpdate();
        }

        public deleteFile(fileName: string){
            let i = 0;
            this.deleteFileDataBlock(fileName);
            //deletes name blockString
            var empty: String[] = new Array(64);
            while(i < empty.length) {
                if (i < 4) {
                    empty[i] = "0";
                } else {
                    empty[i] = "00"
                }
                i++;
            }
            sessionStorage.setItem(fileName, empty.join());

           

            

            Control.diskTableUpdate();
            


        }//deleteFile

          // deletes the block(s) that hold the file data
          public deleteFileDataBlock(fileNameTSB: string) {
            var name = sessionStorage.getItem(fileNameTSB).split(",");
            var dataTsb = name[1] + ":" + name[2] + ":" + name[3];
            var dataBlockArray = sessionStorage.getItem(dataTsb).split(",");
            var nextBlockTSB = dataBlockArray[1] + ":" + dataBlockArray[2] + ":" + dataBlockArray[3];
            if (nextBlockTSB != "FF:FF:FF"){
                this.deleteFileDataBlock(dataTsb);  
            }
            var emptyBlock: String[] = new Array(64);
            for (var i = 0; i < emptyBlock.length; i++) {
                if (i < 4) {
                    emptyBlock[i] = "0";
                } else {
                    emptyBlock[i] = "00"
                }
            }
            sessionStorage.setItem(dataTsb, emptyBlock.join());

        }


        //returns null if file not found
        public tsbFileName(fileName: String) {
            var dataArray: string[];
            var name: string;
            for (var j = 0; j < _Disk.sectors; j++) {
                for (var k = 0; k < _Disk.sectors; k++) {
                    dataArray = sessionStorage.getItem("0:" + j + ":" + k).split(",");

                    //
                    name = "";
                    for(var w = 4; w < dataArray.length; w++) {
                        if (dataArray[w] == "00"){
                            w =  dataArray.length;
                        } else {
                            name += String.fromCharCode(Utils.hexToDecimal(dataArray[w]));
                        }
                    }
                    ///
                    if (name == fileName) {
                        return "0:" + j + ":" + k;
                    }
                }
            }
           
            return null;
        }//tsbFileName

    


    }//DeviceDriverDisk
}//TSOS