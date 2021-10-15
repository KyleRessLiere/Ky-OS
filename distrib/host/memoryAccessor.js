var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        constructor() { }
        sectionIndex(section) {
            var i;
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
        readMemoryToDecimal(section, PC, bytes) {
            // returns a decimal representation of the next hex pair yet to be run/read
            var hex = "";
            // we are reading two bytes (used to find places in memory entered as two bytes)
            if (bytes == 2) {
                // we read the second code first, because they get flipped around
                hex = _Memory.memoryArray[this.sectionIndex(section) + PC + 1];
                hex += _Memory.memoryArray[this.sectionIndex(section) + PC];
            }
            else {
                hex = _Memory.memoryArray[this.sectionIndex(section) + PC];
            }
            return TSOS.Utils.hexToDecimal(hex);
        }
        readMemoryHex(section, PC) {
            var hex = _Memory.memoryArray[this.sectionIndex(section) + PC];
            return hex;
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map