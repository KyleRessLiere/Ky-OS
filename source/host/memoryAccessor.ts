module TSOS {

    export class MemoryAccessor {
        constructor() {}

        public sectionIndex(section) {
            var i: number;
            switch (section) {
                case "1":
                    i = 0;
                    break;
                case "2":
                    i = 256;
                    break;
                case "3":
                    i = 512;
                    break;
                default:
                    console.log("Invalid section");
            }
            return i;

        }
        public readMemoryToDecimal(section: string, PC: number, bytes: number) {
            // returns a decimal representation of the next hex pair yet to be run/read
            var hex: string = "";
            // we are reading two bytes (used to find places in memory entered as two bytes)
            if (bytes == 2) {
                // we read the second code first, because they get flipped around
                hex = _Memory.memoryArray[this.sectionIndex(section) + PC + 1];
                hex += _Memory.memoryArray[this.sectionIndex(section) + PC];
            } else {
                hex = _Memory.memoryArray[this.sectionIndex(section) + PC];
            }
         

            return Utils.hexToDecimal(hex);
        }
        public readMemoryHex(section: string, PC: number) {
            
            var hex: string = _Memory.memoryArray[this.sectionIndex(section) + PC];
            return hex;
        }

        

    }

}
