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
            console.log(block);
            console.log(sessionStorage)
        }//diskFormat
        
    }//DeviceDriverDisk
}//TSOS