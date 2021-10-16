module TSOS {

    export class MemoryAccessor {
        constructor() {}

        public sectionIndex(section) {
            //default to section 0 worry about in later projects
            return 0;

        }
        
        public readOneMemoryByteToDecimal(section: string, PC: number) {
            // returns a decimal representation of the next hex pair yet to be run/read
            var hex: string = "";
            // Reads the next byte in memory
            hex = _Memory.memoryArray[_Memory.getSectionBase(section) + PC];

            return Utils.hexToDecimal(hex);
        }

            // returns a decimal representation of two hex bytes
            public twoBytesToDecimal(section: string, PC: number){
            var hex: string = "";
            // we read the two bytes by reading the second code first
            hex = _Memory.memoryArray[_Memory.getSectionBase(section) + PC + 1];
            hex += _Memory.memoryArray[_Memory.getSectionBase(section) + PC];

            var index = Utils.hexToDecimal(hex) + _Memory.getSectionBase(section);

            //catch later if out of section
           return index;
            
        }
           
        public readMemoryHex(section: string, PC: number) {
            
            var hex: string = _Memory.memoryArray[this.sectionIndex(section) + PC];
            return hex;
        }

        

    }

}
