var TSOS;
(function (TSOS) {
    class MemoryManager {
        constructor() { }
        load(input, index) {
            console.log(_MemoryAccessor.sectionIndex());
            var userCode = input.split(" ");
            for (var i = 0; i < userCode.length; i++) {
                _Memory.memoryArray[i] = userCode[i];
            }
        }
        clearMemory(startIndex, endIndex) {
            //clears memory wihtin a given range
            for (var i = startIndex; i < endIndex; i++) {
                _Memory.memoryArray[i] = "00";
            }
        }
        memorySection() {
            var section = "1";
            return section;
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map