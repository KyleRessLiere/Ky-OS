/* ------------
   Shell.ts
   The OS Shell - The "command line interface" (CLI) for the console.
    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    class Shell {
        constructor() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        init() {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            sc = new TSOS.ShellCommand(this.shellRun, "run", "<PID> - Runs a process given PID.");
            this.commandList[this.commandList.length] = sc;
            this.commandList[this.commandList.length] = sc;
            //date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "<date> - displays date");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            //status
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Changes the current status.");
            this.commandList[this.commandList.length] = sc;
            //location
            sc = new TSOS.ShellCommand(this.shellLocation, "whereami", "- Displays the user's current location.");
            this.commandList[this.commandList.length] = sc;
            //load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "	validates the user code in the	HTML5 text area");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // ps 
            sc = new TSOS.ShellCommand(this.shellPs, "ps", "Prints all the current processes");
            this.commandList[this.commandList.length] = sc;
            // ps 
            sc = new TSOS.ShellCommand(this.shellRunAll, "runall", "Runs all current processes");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellZebra, "zebra", "Zebra swarm");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellGetSchedule, "getschedule", "Gets the current scheduling algo");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellFormatDisk, "format", "—	Initialize	all	blocks	in	all	sectors	in	all	tracks	and	display	a	message	denoting	success	or	failure.	");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellCreateFile, "create", "Creates a file given a entered name");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellKill, "kill", "kills a process");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.setSchedule, "setschedule", "Changes the program execution shceduling RR = round robin, fcfs = first come first serve and priority for priority queue");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellKillAll, "killall", "kills all the  process");
            this.commandList[this.commandList.length] = sc;
            // Changes rr quantum
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "<int>- changes the RR quauntum");
            this.commandList[this.commandList.length] = sc;
            // Changes rr quantum
            sc = new TSOS.ShellCommand(this.shellClearMem, "clearmem", "Clears all the memory");
            this.commandList[this.commandList.length] = sc;
            //crashes the OS
            sc = new TSOS.ShellCommand(this.shellCrash, "bsod", "Crashes shelll and brings up BSOD MESSAGE");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            // Display the initial prompt.
            this.putPrompt();
        }
        putPrompt() {
            _StdOut.putText(this.promptStr);
        }
        handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args); // Note that args is always supplied, though it might be empty.
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) {
                    // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
                    // Check for apologies.
                    this.execute(this.shellApology);
                }
                else {
                    // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }
        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        execute(fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }
        parseInput(buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }
        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }
        shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }
        shellApology() {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        }
        //display current status
        shellStatus(args) {
            var status = "";
            //checks for a non empty string
            if (args.length > 0) {
                for (var i = 0; i < args.length; i++) {
                    status += " " + args[i];
                }
                TSOS.Control.hostStatus(status);
                _StdOut.putText("Status updated to " + status);
            }
            else {
                _StdOut.putText("Missing argument for status command: status <arg>");
            }
        }
        // Although args is unused in some of these functions, it is always provided in the
        // actual parameter list when this function is called, so I feel like we need it.
        shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }
        shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " +
                    _OsShell.commandList[i].command +
                    " " +
                    _OsShell.commandList[i].description);
            }
        }
        shellShutdown(args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }
        shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }
        //displays current date
        shellDate() {
            var today = new Date();
            var date = today.getFullYear() +
                "-" +
                (today.getMonth() + 1) +
                "-" +
                today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + " " + time;
            _StdOut.putText("TODAYS DATE IS " + dateTime);
        }
        //Display "current" location
        shellLocation(args) {
            _StdOut.putText("Hat verloren .. Perdida .. Hilang ");
        }
        //Provides descriptive details about shell commands
        shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    case "date":
                        _StdOut.putText("Date display the current date and time");
                        break;
                    case "whereami":
                        _StdOut.putText("Displays current location");
                        break;
                    case "load":
                        _StdOut.putText("validates the user code in the	HTML5 text area");
                        break;
                    case "status":
                        _StdOut.putText("Updates status in Host Log");
                        break;
                    case "bsod":
                        _StdOut.putText("Simulates a crash to the system by crashing system and displaying BSOD message");
                        break;
                    case "shutdown":
                        _StdOut.putText("Shuts down the OS requires reset to start again");
                        break;
                    case "zebra":
                        _StdOut.putText("Scary Scary Zebras are attacking");
                        break;
                    case "load":
                        _StdOut.putText("Validates and loads hexdecimal charcters");
                        break;
                    case "ver":
                        _StdOut.putText("Displays the current name and version of KyOS");
                        break;
                    case "run":
                        _StdOut.putText("Runs a program for a given PID");
                        break;
                    case "runall":
                        _StdOut.putText("run all programs in memory");
                        break;
                        break;
                    case "cls":
                        _StdOut.putText("Wipes the current Screen Empty");
                    case "killall":
                        _StdOut.putText("Destroys all running process");
                        break;
                    case "kill":
                        _StdOut.putText("Kills the current process");
                        break;
                        break;
                    case "quantum":
                        _StdOut.putText("Changes the RedRobin Quantum");
                        break;
                    case "clearmem":
                        _StdOut.putText("Clears all partions of memory");
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }
        shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid argument.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }
        shellZebra() {
            let zebra = `       
      \\/),
      ,'.' /,
     (_)- / /,
        /\_/ |__..--,  *
       (\___/\ \ \ / ).'
        \____/ / (_ //
         \\_ ,'--'\_(
         )_)_/ )_/ )_)
    mrf (_(_.'(_.'(_.'
`;
            for (let i = 0; i < zebra.length; i++) {
                var match = /\r|\n/.exec(zebra[i]);
                _StdOut.putText(zebra[i]);
                if (match) {
                    _StdOut.advanceLine();
                }
            }
            let zeb = ['The Zebras have Atacked'];
            TSOS.Control.zebraAttack();
            _StdOut.putText("Cant Escape");
            _StdOut.putText('The Zebras have Atacked');
        }
        //test when the kernel crashes
        shellCrash() {
            _Kernel.krnTrapError("Test crash");
        }
        shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(" ") + " = '" + TSOS.Utils.rot13(args.join(" ")) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }
        shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }
        shellRun(args) {
            // Check to see if the entered PID is valid
            if ((args.length = 1) && !(isNaN(Number(args[0])))) { //Checks to see if the arg is there and is actually a number
                var enteredPID = Number(args[0]);
                // Checks to see if the PID is loaded into memory
                if (_MemoryManager.isResident(enteredPID)) {
                    // change the PCB status to waiting
                    //console.log(_MemoryManager.pidIndex(_PCBList,enteredPID) + "index")
                    _PCBList[_MemoryManager.pidIndex(_PCBList, enteredPID)].state = "Waiting";
                    // add the process to the ready queue
                    _ReadyPCBList[_ReadyPCBList.length] = _MemoryManager.getPCB(enteredPID);
                    _Scheduler.currentProcess();
                }
                else {
                    _StdOut.putText("Ensure the entered PID number is valid.");
                }
            }
            else {
                _StdOut.putText("Please enter a PID number.");
            }
        }
        //	validates the user code in the	HTML5 text area
        shellLoad() {
            var code = _UserCode.value;
            // remove and leading or trailing spaces
            code = code.replace(/\s+/g, "");
            code = code.toUpperCase();
            var valid = true;
            if (code == "") {
                valid = false;
            }
            for (var i = 0; i < code.length; i++) {
                switch (code[i]) {
                    case " ": break;
                    case "0": break;
                    case "1": break;
                    case "2": break;
                    case "3": break;
                    case "4": break;
                    case "5": break;
                    case "6": break;
                    case "7": break;
                    case "8": break;
                    case "9": break;
                    case "A": break;
                    case "B": break;
                    case "C": break;
                    case "D": break;
                    case "E": break;
                    case "F": break;
                    default:
                        console.log("invalid hex ");
                        valid = false;
                }
            }
            //if not pairs of two then not valid
            if (code.length % 2 != 0)
                valid = false;
            //regex to separate into array for every op code
            code = code.match(/.{1,2}/g);
            if (valid) {
                _StdOut.putText("Valid Code has been entered");
                _StdOut.advanceLine();
                if (_MemoryManager.isMemoryAvailable() == true) {
                    // create a PCB
                    var PCB = new TSOS.PCB();
                    // give it a PID
                    PCB.PID = _ProcessCounter;
                    _ProcessCounter++; // Increment to prevent duplicate PIDs
                    // Assign it a section in memory
                    PCB.section = _MemoryManager.memorySection();
                    //Add it to global list of Resident PCBs
                    _PCBList[_PCBList.length] = PCB;
                    _MemoryManager.clearMemory(PCB.section);
                    //use memory manager to load
                    _MemoryManager.load(code, PCB.section);
                    // Update the PCB's IR
                    PCB.IR = _MemoryAccessor.readMemoryHex(PCB.section, PCB.PC); //Changed to load beter kyle
                    console.log(_Memory.memoryArray);
                    console.log(PCB);
                    console.log(PCB.IR);
                    // Update Memory GUI
                    TSOS.Control.memoryUpdate();
                    TSOS.Control.processTableUpdate();
                    // print out response
                    _StdOut.putText("User code  hohohoho");
                    _StdOut.advanceLine();
                    _StdOut.putText("Process ID Number: " + PCB.PID);
                }
                else {
                    _StdOut.putText("No space in memory is available consider clearning memory");
                }
            }
            else
                _StdOut.putText("Invalid hex try again");
        }
        shellQuantum(args) {
            var validQuantum = true;
            // Check to see if the entered Quantum is vali
            if ((args.length != 1)) {
                validQuantum = false;
            }
            else if ((isNaN(Number(args[0])))) { //Checks to see for number
                validQuantum = false;
            }
            if (validQuantum == true) {
                _RoundRobinQuantum = parseInt(args[0]);
                _StdOut.putText("Quantum changed to " + _RoundRobinQuantum);
            }
            else {
                _StdOut.putText(args[0] + " is a invalid quantum quantum must be numbers");
            }
            console.log(_RoundRobinQuantum);
        } //shellQuantum
        shellClearMem() {
            //clears all of memory
            if (_CPU.isExecuting == true) {
                _StdOut.putText("Memory can only be cleared when their are no running processes");
            }
            else {
                _PCBList = [];
                _ReadyPCBList = [];
                _MemoryManager.clearMemory("3");
                TSOS.Control.memoryUpdate();
            }
        } //clearmem
        shellPs() {
            if (_PCBList.length > 0) {
                for (let i = 0; i < _PCBList.length; i++) {
                    _StdOut.putText("Process ID: " + _PCBList[i].PID + "State: " + _PCBList[i].state + "   ");
                }
            }
            else {
                _StdOut.putText("No current process");
            }
        } //shellPs
        shellRunAll(args) {
            console.log("Running all");
            for (var i = 0; i < _PCBList.length; i++) {
                // if the process is resident (and not running or waiting) ...
                console.log(_PCBList[i]);
                if (_PCBList[i].state = "Resident") {
                    // Make the process Waiting
                    _PCBList[i].state = "Waiting";
                    // Add it to the ready queue
                    _ReadyPCBList[_ReadyPCBList.length] = _PCBList[i];
                    console.log(_ReadyPCBList);
                }
            }
            _Scheduler.currentProcess();
        }
        shellKill(args) {
            var pid = -1;
            if (args.length > 0 && !(isNaN(Number(args[0])))) { //checks for number
                pid = Number(args[0]);
                // Checks to see if the PID exists and hasn't already been run or terminated
                if (_MemoryManager.isResident(pid) == true) {
                    if (_CurrentPCB != null) {
                        if (_CurrentPCB.PID == pid) {
                            _CurrentPCB = null;
                        }
                    }
                    _MemoryManager.clearMemory(_MemoryManager.getPCB(pid).section);
                    _PCBList.splice(_MemoryManager.pidIndex(_PCBList, pid), 1);
                    TSOS.Control.processTableUpdate;
                    TSOS.Control.cpuUpdate();
                    TSOS.Control.memoryUpdate();
                    _Scheduler.nextProcess();
                }
                else {
                    _StdOut.putText("Invalid pid");
                }
            }
        } //shellkill
        shellKillAll(args) {
            _CPU.isExecuting = false;
            _StdOut.putText("All process have been eliminated");
            _CurrentPCB = null;
            _PCBList = [];
            _MemoryManager.clearMemory("3");
            TSOS.Control.cpuUpdate();
            TSOS.Control.memoryUpdate();
            TSOS.Control.processTableUpdate();
        } //killall
        setSchedule(args) {
            let valid = true;
            var scheduler = args[0];
            switch (scheduler.toLowerCase()) {
                case "rr":
                    if (_ScheduleAlgo != "RR") {
                        _ScheduleAlgo = "RR";
                        _RoundRobinQuantum = _QuantumStore;
                        _StdOut.putText("The algorithm is now set to " + _ScheduleAlgo);
                    }
                    else {
                        _StdOut.putText("CURRENT ALGORITHM IS ALREADY ROUND ROBING LOL xd");
                    }
                    break;
                case "fcfs":
                    if (_ScheduleAlgo != "FCFS") {
                        _ScheduleAlgo = "FCFS";
                        _QuantumStore = _RoundRobinQuantum;
                        _RoundRobinQuantum = Number.MAX_VALUE;
                        _StdOut.putText("The algorithm is now set to " + _ScheduleAlgo);
                    }
                    else {
                        _StdOut.putText("CURRENT ALGORITHM IS ALREADY First Come First Server LOL xd");
                    }
                    break;
                case "priority":
                    if (_ScheduleAlgo != "PRIORITY") {
                        _ScheduleAlgo = "PRIORITY";
                        _StdOut.putText("The algorithm is now set to " + _ScheduleAlgo);
                    }
                    else {
                        _StdOut.putText("CURRENT ALGORITHM IS ALREADY PRIORITY LOL xd");
                    }
                    break;
                default: _StdOut.putText("Invalid algorithm the valid algos are rr,fcfs and priority");
            } //switch
        } //setSchedule
        shellGetSchedule() {
            _StdOut.putText("The current algorithm is set to " + _ScheduleAlgo);
        } //setSchedule
        shellFormatDisk() {
            if (!_DiskFormatStatus && !_CPU.isExecuting) {
                _diskDriver.diskFormat();
                _DiskFormatStatus = true;
                _StdOut.putText("Disk Formatted !!! :)");
            }
            else if (_CPU.isExecuting) {
                _StdOut.putText("Cant format while executing");
            }
            else {
                _StdOut.putText("Oppsie Disk is already formatted");
            }
        } //shellFormatDisk
        shellCreateFile(args) {
            if (!_DiskFormatStatus) {
                _StdOut.putText("Cant create a file until disk is formatted");
            }
            else if (_DiskFormatStatus && args.length > 0 && args[0].length < 64) {
                _diskDriver.createFile(args[0]);
                _StdOut.putText("File name " + args[0] + " has been created");
            }
            else {
                _StdOut.putText("Invalid File name");
            }
        } //shellCreateFile
    }
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=shell.js.map