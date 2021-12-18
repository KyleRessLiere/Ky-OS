/* ------------
     Control.ts

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
//
// Control Services
//
var TSOS;
(function (TSOS) {
    class Control {
        static hostInit() {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.
            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = document.getElementById("display");
            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");
            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            TSOS.CanvasTextFunctions.enable(_DrawingContext); // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.
            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("taHostLog").value = "";
            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("btnStartOS").focus();
            //Gets the user code
            _UserCode = document.getElementById("taProgramInput");
            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
            //intiats the current date
        }
        static hostLog(msg, source = "?") {
            // Note the OS CLOCK.
            var clock = _OSclock;
            // Note the REAL clock in milliseconds since January 1, 1970.
            var now = new Date().getTime();
            // Build the log string.
            var str = "({ clock:" +
                clock +
                ", source:" +
                source +
                ", msg:" +
                msg +
                ", now:" +
                now +
                " })" +
                "\n";
            // Update the log console.
            var taLog = document.getElementById("taHostLog");
            taLog.value = str + taLog.value;
            // TODO in the future: Optionally update a log database or some streaming service.
        }
        //
        // Host Events
        //
        static hostBtnStartOS_click(btn) {
            // Disable the (passed-in) start button...
            btn.disabled = true;
            // .. enable the Halt and Reset buttons ...
            (document.getElementById("btnHaltOS")).disabled = false;
            document.getElementById("btnReset").disabled = false;
            // .. set focus on the OS console display ...
            document.getElementById("display").focus();
            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new TSOS.Cpu(); // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init(); //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            _Memory = new TSOS.Memory();
            _Memory.init();
            //creates a disk 
            _Disk = new TSOS.Disk();
            _MemoryAccessor = new TSOS.MemoryAccessor();
            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(TSOS.Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new TSOS.Kernel();
            _Kernel.krnBootstrap(); // _GLaDOS.afterStartup() will get called in there, if configured.
        }
        static hostBtnHaltOS_click(btn) {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }
        static hostBtnReset_click(btn) {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload();
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }
        //changes host status
        static hostStatus(status) {
            document.getElementById("status").textContent = status;
        }
        //displays current time and date
        static date() {
            var today = new Date();
            var date = today.getFullYear() +
                "-" +
                (today.getMonth() + 1) +
                "-" +
                today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + " " + time;
            document.getElementById("date").textContent = dateTime;
        }
        static crashDisplay(message) {
            document.getElementById("display").style.backgroundColor = "blue";
        }
        static zebraAttack() {
            document.getElementById("display").style.background = "url('distrib/images/zebraAnimal.jpeg')";
            document.body.style.background = "url('distrib/images/zebraAnimal.jpeg')";
        }
        //memory tables for
        static memoryUpdate() {
            this.memoryClear();
            for (var i = 0; i < _Memory.memoryArray.length; i++) {
                var entry = document.getElementById("memory" + i);
                entry.innerHTML = _Memory.memoryArray[i];
            }
        }
        static memoryClear() {
            for (var i = 0; i < _Memory.memoryArray.length; i++) {
                var entry = document.getElementById("memory" + i);
                entry.innerHTML = "00";
            }
        }
        static cpuUpdate() {
            this.cpuClear();
            var cpuPC = document.getElementById("PC");
            cpuPC.innerHTML = _CPU.PC.toString();
            var cpuIR = document.getElementById("IR");
            cpuIR.innerHTML = _CPU.IR.toString();
            var cpuACC = document.getElementById("ACC");
            cpuACC.innerHTML = _CPU.Acc.toString();
            var cpuX = document.getElementById("X");
            cpuX.innerHTML = _CPU.Xreg.toString();
            var cpuY = document.getElementById("Y");
            cpuY.innerHTML = _CPU.Yreg.toString();
            var cpuZ = document.getElementById("Z");
            cpuZ.innerHTML = _CPU.Zflag.toString();
        }
        static cpuClear() {
            var cpuPC = document.getElementById("PC");
            cpuPC.innerHTML = "-";
            var cpuIR = document.getElementById("IR");
            cpuIR.innerHTML = "-";
            var cpuACC = document.getElementById("ACC");
            cpuACC.innerHTML = "-";
            var cpuX = document.getElementById("X");
            cpuX.innerHTML = "-";
            var cpuY = document.getElementById("Y");
            cpuY.innerHTML = "-";
            var cpuZ = document.getElementById("Z");
            cpuZ.innerHTML = "-";
        }
        static processTableClear() {
            var processTable = document.getElementById("ProcessTable");
            // delete each row
            for (var i = processTable.rows.length; i > 1; i--) {
                processTable.deleteRow(i - 1);
            }
        }
        static processTableUpdate() {
            this.processTableClear();
            var processTable = document.getElementById("ProcessTable");
            for (var i = 0; i < _PCBList.length; i++) {
                // Insert a row with the appropriate data for each PCB
                var row = processTable.insertRow(i + 1);
                // PID Entry
                var cellPID = row.insertCell(0);
                cellPID.innerHTML = _PCBList[i].PID.toString();
                // PC Entry
                var cellPC = row.insertCell(1);
                cellPC.innerHTML = _PCBList[i].PC.toString();
                // IR Entry
                var cellIR = row.insertCell(2);
                cellIR.innerHTML = _PCBList[i].IR.toString();
                // ACC Entry
                var cellACC = row.insertCell(3);
                cellACC.innerHTML = _PCBList[i].ACC.toString();
                // Xreg Entry
                var cellXreg = row.insertCell(4);
                cellXreg.innerHTML = _PCBList[i].X.toString();
                // Yreg Entry
                var cellYreg = row.insertCell(5);
                cellYreg.innerHTML = _PCBList[i].Y.toString();
                // Zflag Entry
                var cellZflag = row.insertCell(6);
                cellZflag.innerHTML = _PCBList[i].Z.toString();
                // State Entry
                var cellState = row.insertCell(7);
                cellState.innerHTML = _PCBList[i].state.toString();
                // Location Entry
                var cellLocation = row.insertCell(8);
                cellLocation.innerHTML = _PCBList[i].location.toString();
            }
        }
        static diskTableUpdate() {
            //maybe clear the table??
            var diskTable = document.getElementById("diskTable");
            var dataArray;
            var rowNumber = 1; // Used to keep track of the rows in the html table, starts at 1 to not overwrite the first row
            // Add Header row
            var headerRow = diskTable.insertRow(0);
            headerRow.style.fontWeight = "bold";
            // TSB Cell
            var headerTSB = headerRow.insertCell(0);
            headerTSB.innerHTML = "T:S:B";
            // Used Cell
            var headerUsed = headerRow.insertCell(1);
            headerUsed.innerHTML = "Used";
            // Next Cell
            var headerNext = headerRow.insertCell(2);
            headerNext.innerHTML = "Next";
            // Data Cell
            var headerData = headerRow.insertCell(3);
            headerData.innerHTML = "Data";
            // Now add rows for each block on the disk
            for (var i = 0; i < _Disk.tracks; i++) {
                for (var j = 0; j < _Disk.sectors; j++) {
                    for (var k = 0; k < _Disk.blocks; k++) {
                        let data = sessionStorage.getItem(i + ":" + j + ":" + k);
                        dataArray = data.split(",");
                        var row = diskTable.insertRow(rowNumber);
                        rowNumber++;
                        var cellTSB = row.insertCell(0);
                        cellTSB.innerHTML = i + ":" + j + ":" + k;
                        let dataZero = dataArray[0];
                        var cellUsed = row.insertCell(1);
                        cellUsed.innerHTML = dataZero.valueOf();
                        let dataOne = dataArray[1];
                        let dataTwo = dataArray[2];
                        let dataThree = dataArray[3];
                        var cellNext = row.insertCell(2);
                        cellNext.innerHTML = dataOne + ":" + dataTwo + ":" + dataOne[3];
                        var cellData = row.insertCell(3);
                        var dataString = new String();
                        for (var w = 4; w < dataArray.length; w++) {
                            let dta = dataArray[w].valueOf();
                            dataString += dta;
                        }
                        cellData.innerHTML = dataString.valueOf();
                    }
                }
            }
        }
    }
    TSOS.Control = Control;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=control.js.map