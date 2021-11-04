var TSOS;
(function (TSOS) {
    class MemoryManager {
        constructor() { }
        load(input, index) {
            //console.log(_MemoryAccessor.sectionIndex());
            let code = input;
            for (var i = 0; i < code.length; i++) {
                _Memory.memoryArray[i] = code[i];
            }
        }
        clearMemory(startIndex, endIndex) {
            //clears memory within a given range
            for (var i = startIndex; i < endIndex; i++) {
                _Memory.memoryArray[i] = "00";
            }
        }
        memorySection() {
            var sectionOne = "0";
            var sectionTwo = "1";
            var sectionThree = "2";
            var sectionOneStatus = true;
            var sectionTwoStatus = true;
            var sectionThreeStatus = true;
            for (var PCB of _PCBList) {
                switch (PCB.section) {
                    case "0":
                        sectionOneStatus = false;
                        break;
                    case "1":
                        sectionTwoStatus = false;
                        break;
                    case "2":
                        sectionThreeStatus = false;
                        break;
                    default: console.log("Sorry this is a invalid section");
                }
            }
            if (sectionOneStatus) {
                return sectionOne;
            }
            else if (sectionTwoStatus) {
                return sectionTwo;
            }
            else if (sectionThreeStatus) {
                return sectionThree;
            }
            else {
                console.log("Invalid section");
            }
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map