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
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map