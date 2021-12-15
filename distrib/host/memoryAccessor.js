var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        constructor() { }
        sectionIndex(section) {
            let index;
            index = parseInt(section, 16);
            console.log(index);
            return index;
        }
        readOneMemoryByteToDecimal(section, PC) {
            // returns a decimal representation of the next hex pair yet to be run/read
            var hex = "";
            // Reads the next byte in memory
            hex = _Memory.memoryArray[_Memory.getSectionBase(section) + PC];
            return TSOS.Utils.hexToDecimal(hex);
        }
        // returns a decimal representation of two hex bytes
        twoBytesToDecimal(section, PC) {
            var hex = "";
            // we read the two bytes by reading the second code first
            hex = _Memory.memoryArray[_Memory.getSectionBase(section) + PC + 1];
            hex += _Memory.memoryArray[_Memory.getSectionBase(section) + PC];
            var index = TSOS.Utils.hexToDecimal(hex) + _Memory.getSectionBase(section);
            //catch later if out of section
            return index;
        }
        readMemoryHex(section, PC) {
            var hex = _Memory.memoryArray[_Memory.getSectionBase(section) + PC];
            return hex;
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map