var TSOS;
(function (TSOS) {
    class Memory {
        constructor() {
            this.memoryArray = new Array(768);
            this.memorySectionOneBase = 0;
            this.memorySectionOneEnd = 255;
            this.memorySectionTwoBase = 256;
            this.memorySectionTwoEnd = 511;
            this.memorySectionThreeBase = 512;
            this.memorySectionThreeEnd = 767;
        }
        init() {
            // initialize memory
            for (var i = 0; i < this.memoryArray.length; i++) {
                this.memoryArray[i] = "00";
            }
        }
        getSectionBase(section) {
            switch (section) {
                case "0":
                    return this.memorySectionOneBase;
                    break;
                case "1":
                    return this.memorySectionTwoBase;
                case "2":
                    return this.memorySectionThreeBase;
                case "3":
                    return this.memorySectionOneBase;
                    break;
                default:
                    console.log("Invalid section");
            }
        }
        getSectionEnd(section) {
            switch (section) {
                case "0":
                    return this.memorySectionOneEnd;
                    break;
                case "1":
                    return this.memorySectionTwoEnd;
                    break;
                case "2":
                    return this.memorySectionThreeEnd;
                    break;
                case "3":
                    return this.memorySectionThreeEnd;
                    break;
                default:
                    console.log("Invalid section number");
            }
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map