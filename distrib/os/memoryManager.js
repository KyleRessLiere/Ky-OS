var TSOS;
(function (TSOS) {
    class MemoryManager {
        constructor() { }
        load(input, index) {
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
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map