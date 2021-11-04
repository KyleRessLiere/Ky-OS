/* ------------
   Shell.ts
   The OS Shell - The "command line interface" (CLI) for the console.
    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
module TSOS {
  export class Shell {
    // Properties
    public promptStr = ">";
    public commandList = [];
    public curses =
      "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
    public apologies = "[sorry]";
    constructor() {}
    public init() {
      var sc: ShellCommand;
      //
      // Load the command list.
      // ver
      sc = new ShellCommand(
        this.shellVer,
        "ver",
        "- Displays the current version data."
      );
      this.commandList[this.commandList.length] = sc;
      // help
      sc = new ShellCommand(
        this.shellHelp,
        "help",
        "- This is the help command. Seek help."
      );
      this.commandList[this.commandList.length] = sc;
      // shutdown
      sc = new ShellCommand(
        this.shellShutdown,
        "shutdown",
        "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running."
      );
      this.commandList[this.commandList.length] = sc;
      // cls
      sc = new ShellCommand(
        this.shellCls,
        "cls",
        "- Clears the screen and resets the cursor position."
      );
      sc = new ShellCommand(this.shellRun,
        "run",
        "<PID> - Runs a process given PID.");
this.commandList[this.commandList.length] = sc;
      this.commandList[this.commandList.length] = sc;
      //date
      sc = new ShellCommand(this.shellDate, "date", "<date> - displays date");
      this.commandList[this.commandList.length] = sc;
      // man <topic>
      sc = new ShellCommand(
        this.shellMan,
        "man",
        "<topic> - Displays the MANual page for <topic>."
      );
      this.commandList[this.commandList.length] = sc;
      //status
      sc = new ShellCommand(
        this.shellStatus,
        "status",
        "<string> - Changes the current status."
      );
      this.commandList[this.commandList.length] = sc;
      //location
      sc = new ShellCommand(
        this.shellLocation,
        "whereami",
        "- Displays the user's current location."
      );
      this.commandList[this.commandList.length] = sc;
      //load
      sc = new ShellCommand(
        this.shellLoad,
        "load",
        "	validates the user code in the	HTML5 text area"
      );
      this.commandList[this.commandList.length] = sc;
      // trace <on | off>
      sc = new ShellCommand(
        this.shellTrace,
        "trace",
        "<on | off> - Turns the OS trace on or off."
      );
      this.commandList[this.commandList.length] = sc;
      // rot13 <string>
      sc = new ShellCommand(
        this.shellRot13,
        "rot13",
        "<string> - Does rot13 obfuscation on <string>."
      );
      this.commandList[this.commandList.length] = sc;
      // prompt <string>
      sc = new ShellCommand(
        this.shellPrompt,
        "prompt",
        "<string> - Sets the prompt."
      );
      this.commandList[this.commandList.length] = sc;
      // prompt <string>
      sc = new ShellCommand(
        this.shellZebra,
        "zebra",
        "Zebra swarm"
      );
      this.commandList[this.commandList.length] = sc;
      // Changes rr quantum
      sc = new ShellCommand(
        this.shellQuantum,
        "quantum",
        "<int>- changes the RR quauntum"
      );
      this.commandList[this.commandList.length] = sc;
      //crashes the OS
      sc = new ShellCommand(
        this.shellCrash,
        "bsod",
        "Crashes shelll and brings up BSOD MESSAGE"
      );
      this.commandList[this.commandList.length] = sc;
      // ps  - list the running processes and their IDs
      // kill <id> - kills the specified process id.
      // Display the initial prompt.
      this.putPrompt();
    }
    public putPrompt() {
      _StdOut.putText(this.promptStr);
    }
    public handleInput(buffer) {
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
      var index: number = 0;
      var found: boolean = false;
      var fn = undefined;
      while (!found && index < this.commandList.length) {
        if (this.commandList[index].command === cmd) {
          found = true;
          fn = this.commandList[index].func;
        } else {
          ++index;
        }
      }
      if (found) {
        this.execute(fn, args); // Note that args is always supplied, though it might be empty.
      } else {
        // It's not found, so check for curses and apologies before declaring the command invalid.
        if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {
          // Check for curses.
          this.execute(this.shellCurse);
        } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
          // Check for apologies.
          this.execute(this.shellApology);
        } else {
          // It's just a bad command. {
          this.execute(this.shellInvalidCommand);
        }
      }
    }
    // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
    public execute(fn, args?) {
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

    public parseInput(buffer: string): UserCommand {
      var retVal = new UserCommand();
      // 1. Remove leading and trailing spaces.
      buffer = Utils.trim(buffer);
      // 2. Lower-case it.
      buffer = buffer.toLowerCase();
      // 3. Separate on spaces so we can determine the command and command-line args, if any.
      var tempList = buffer.split(" ");
      // 4. Take the first (zeroth) element and use that as the command.
      var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript. See the Queue class.
      // 4.1 Remove any left-over spaces.
      cmd = Utils.trim(cmd);
      // 4.2 Record it in the return value.
      retVal.command = cmd;
      // 5. Now create the args array from what's left.
      for (var i in tempList) {
        var arg = Utils.trim(tempList[i]);
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
    public shellInvalidCommand() {
      _StdOut.putText("Invalid Command. ");
      if (_SarcasticMode) {
        _StdOut.putText("Unbelievable. You, [subject name here],");
        _StdOut.advanceLine();
        _StdOut.putText("must be the pride of [subject hometown here].");
      } else {
        _StdOut.putText("Type 'help' for, well... help.");
      }
    }
    public shellCurse() {
      _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
      _StdOut.advanceLine();
      _StdOut.putText("Bitch.");
      _SarcasticMode = true;
    }
    public shellApology() {
      if (_SarcasticMode) {
        _StdOut.putText("I think we can put our differences behind us.");
        _StdOut.advanceLine();
        _StdOut.putText("For science . . . You monster.");
        _SarcasticMode = false;
      } else {
        _StdOut.putText("For what?");
      }
    }
    //display current status
    public shellStatus(args: string[]) {
      var status = "";
      //checks for a non empty string
      if (args.length > 0) {
        for (var i = 0; i < args.length; i++) {
          status += " " + args[i];
        }
        Control.hostStatus(status);
        _StdOut.putText("Status updated to " + status);
      } else {
        _StdOut.putText("Missing argument for status command: status <arg>");
      }
    }
    
    // Although args is unused in some of these functions, it is always provided in the
    // actual parameter list when this function is called, so I feel like we need it.
    public shellVer(args: string[]) {
      _StdOut.putText(APP_NAME + " version " + APP_VERSION);
    }

    public shellHelp(args: string[]) {
      _StdOut.putText("Commands:");
      for (var i in _OsShell.commandList) {
        _StdOut.advanceLine();
        _StdOut.putText(
          "  " +
            _OsShell.commandList[i].command +
            " " +
            _OsShell.commandList[i].description
        );
      }
    }
    public shellShutdown(args: string[]) {
      _StdOut.putText("Shutting down...");
      // Call Kernel shutdown routine.
      _Kernel.krnShutdown();
      // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
    }
    public shellCls(args: string[]) {
      _StdOut.clearScreen();
      _StdOut.resetXY();
    }
    //displays current date
    public shellDate() {
      var today = new Date();
      var date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      var time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date + " " + time;
      _StdOut.putText("TODAYS DATE IS " + dateTime);
    }
    //Display "current" location
    public shellLocation(args: string[]) {
      _StdOut.putText("Hat verloren .. Perdida .. Hilang ");
    }
    //Provides descriptive details about shell commands
    public shellMan(args: string[]) {
      if (args.length > 0) {
        var topic = args[0];
        switch (topic) {
          case "help":
            _StdOut.putText(
              "Help displays a list of (hopefully) valid commands."
            );
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
            _StdOut.putText(
              "Simulates a crash to the system by crashing system and displaying BSOD message"
            );
            break;
            case "shutdown":
            _StdOut.putText(
              "Shuts down the OS requires reset to start again"
            );
            break;
            case "zebra":
            _StdOut.putText(
              "Scary Scary Zebras are attacking"
            );
            break;
            case "load":
            _StdOut.putText(
              "Validates and loads hexdecimal charcters"
            );
            break;
            case "ver":
            _StdOut.putText(
              "Displays the current name and version of KyOS"
            );
            break;
            case "run":
            _StdOut.putText(
              "Runs a program for a given PID"
            );
            break;
            case "cls":
            _StdOut.putText(
              "Wipes the current Screen Empty"
            );
            break;
            case "quantum": 
            _StdOut.putText(
              "Changes the RedRobin Quantum"
            );ß
            break;
          // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
          default:
            _StdOut.putText("No manual entry for " + args[0] + ".");
        }
      } else {
        _StdOut.putText("Usage: man <topic>  Please supply a topic.");
      }
    }
    public shellTrace(args: string[]) {
      
      if (args.length > 0) {
        var setting = args[0];
        switch (setting) {
          case "on":
            if (_Trace && _SarcasticMode) {
              _StdOut.putText("Trace is already on, doofus.");
            } else {
              _Trace = true;
              _StdOut.putText("Trace ON");
            }
            break;
          case "off":
            _Trace = false;
            _StdOut.putText("Trace OFF");
            break;
          default:
            _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
        }
      } else {
        _StdOut.putText("Usage: trace <on | off>");
      }
    }
    public shellZebra(){
     
      let zebra =  `       
      \\/),
      ,'.' /,
     (_)- / /,
        /\_/ |__..--,  *
       (\___/\ \ \ / ).'
        \____/ / (_ //
         \\_ ,'--'\_(
         )_)_/ )_/ )_)
    mrf (_(_.'(_.'(_.'
` ;
      for(let i = 0; i < zebra.length;i++){
        var match = /\r|\n/.exec(zebra[i]);
        _StdOut.putText(zebra[i])
        if(match){
          _StdOut.advanceLine();
        }
      }

    let zeb = ['The Zebras have Atacked']
    Control.zebraAttack();

    _StdOut.putText("Cant Escape")
     _StdOut.putText('The Zebras have Atacked');
    

  
      
      
    }
    //test when the kernel crashes
    public shellCrash(): void {
      _Kernel.krnTrapError("Test crash");
    }
    public shellRot13(args: string[]) {
      if (args.length > 0) {
        // Requires Utils.ts for rot13() function.
        _StdOut.putText(
          args.join(" ") + " = '" + Utils.rot13(args.join(" ")) + "'"
        );
      } else {
        _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
      }
    }
    public shellPrompt(args: string[]) {
      if (args.length > 0) {
        _OsShell.promptStr = args[0];
      } else {
        _StdOut.putText("Usage: prompt <string>  Please supply a string.");
      }
    }

    public shellRun(args: string[]) {
      if (args.length > 0 && !(isNaN(Number(args[0])))) { //checks for number
        var pid = Number(args[0]);
        // Checks to see if the PID exists and hasn't already been run or terminated
        if(pid < _PCBList.length && _PCBList[pid].state != "Terminated" && _PCBList[pid].state != "Complete") {
            
            _CurrentPCB = _PCBList[pid];  // 
            _PCBList[pid].state = "Running"; //change waiting next pro
          
            // make CPU.isExecuting to true
            _CPU.isExecuting = true;
        } else {
            _StdOut.putText("Invalid PID");
        }
    } else {
        _StdOut.putText("Please enter a PID number.");
       
      
  }}
    //	validates the user code in the	HTML5 text area
    public shellLoad() {
      var code = _UserCode.value;
            // remove and leading or trailing spaces
            code = code.replace(/\s+/g, "");
            code = code.toUpperCase();
            var valid = true;
            if(code == ""){
              valid = false;
            }
            for (var i =0; i< code.length; i++) {
                switch (code[i]){      
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
                  
                    default: console.log("invalid hex digits"); valid = false;
                }
            }
            //if not pairs of two then not valid
            if(code.length % 2 != 0)
              valid = false;
            //regex to seperate into array for every op code
            code = code.match(/.{1,2}/g)
            
            
            if (valid) {
                _StdOut.putText("Valid Code has been enterd");
                _StdOut.advanceLine();
                
                // create a PCB
                var PCB = new TSOS.PCB();
                PCB.section = _MemoryManager.memorySection();
                _PCBList[_PCBList.length] = PCB;
                
                if (_PCBList.length > 1 && _PCBList[PCB.PID - 1].state != "Complete") // If there is another PCB
                    _PCBList[_PCBList.length - 2].state = "Terminated";
                

                //clear all of memory 
                _MemoryManager.clearMemory(0,255);

                //use memory manager to load
                _MemoryManager.load(code,"1"); 
                                                      
                // PCB Update 
                PCB.IR = _MemoryAccessor.readMemoryHex(PCB.section, PCB.PC);

                // Update Memory GUI
                Control.memoryUpdate();


                // print out response
                _StdOut.putText("User code  hohohoho");
                _StdOut.advanceLine();
                _StdOut.putText("Process ID Number: " + PCB.PID);

            }
             else 
                _StdOut.putText("Invalid hex try again");  
}
  public shellQuantum(args: string[]): void {
    var validQuantum = true;
    // Check to see if the entered Quantum is vali
    if ((args.length != 1)){
      validQuantum = false;
}
    else if((isNaN(Number(args[0])))) { //Checks to see if the arg is there and is actually a number
      validQuantum = false;
  } 
  if(validQuantum == true) {
    _RoundRobinQuantum = parseInt(args[0]);
    _StdOut.putText("Quantum changed to " + _RoundRobinQuantum);

  }
  else {
    _StdOut.putText(args[0] + " is a invalid quantum quantums must be numbers") 
      
  }
  console.log(_RoundRobinQuantum);
  }

  
}

}

