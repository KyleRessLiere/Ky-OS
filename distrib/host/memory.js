var TSOS;
(function (TSOS) {
    class Memory {
        constructor() {
            this.memoryArray = new Array(0x100);
        }
        init() {
            // initialize memeory
            for (var i = 0; i < this.memoryArray.length; i++) {
                this.memoryArray[i] = "00";
            }
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map