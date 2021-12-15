var TSOS;
(function (TSOS) {
    class MemoryManager {
        constructor() { }
        load(input, section) {
            //console.log(_MemoryAccessor.sectionIndex());
            let code = input;
            for (var i = 0; i < code.length; i++) {
                _Memory.memoryArray[i + _Memory.getSectionBase(section)] = code[i];
            }
        }
        isMemoryAvailable() {
            let available = false;
            if (_PCBList.length < 3) {
                available = true;
            }
            return available;
        } //isMemoryAvailable
        clearMemory(memSection) {
            //clears memory within a given range
            let startIndex = _Memory.getSectionBase(memSection);
            let endIndex = _Memory.getSectionEnd(memSection);
            //clears memory 
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
        } //memorySection
        getPCB(pid) {
            for (var PCB of _PCBList) {
                if (PCB.PID == pid) {
                    return PCB;
                }
            }
        }
        isResident(pid) {
            for (let PCB of _PCBList)
                if (PCB.PID == pid)
                    return true;
        } //isResident
        //finds the index in the pcb list given pid
        pidIndex(list, givenPID) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].PID == givenPID) {
                    return i;
                }
            } //pid index
        }
        PCBisReady(givenPID) {
            for (var PCB of _ReadyPCBList) {
                if (PCB.PID == givenPID) {
                    return true;
                }
            }
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map