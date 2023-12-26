commandsOfTerminal = ["cd", "nexus", "ls", "cls"]
pagesOfNexus = ["home", "events", "team", "forms", "about", "contact"]

// commands:
// 1. cd "Site Name" page of Nexus
// 2. nexus help
// 3. ls
// 4. cls


function terminalFunction(input){
    // splitting the input with to check whether it is correct command or not
    let arrayOfInputWords = input.split(' ');
    
    // iterating through commands whether it matches any of the commands in the list
    switch(arrayOfInputWords[0]){
        case commandsOfTerminal[0]: // case for the cd
            // check if the command has less or more words
            if (arrayOfInputWords.length == 2 && pagesOfNexus.includes(arrayOfInputWords[1])){
                console.log("cd command to " + arrayOfInputWords[1])
                // redirect to the arrayOfInputWords[1] page
            } else if(arrayOfInputWords.length == 2){
                console.log(arrayOfInputWords[1] + "Doesn't exists");
            } else{
                console.log("Wrong command ask nexus help for commands")
            }
            break;
        case commandsOfTerminal[1]: // case for the nexus
            console.log("nexus Command");
            break;
        case commandsOfTerminal[2]: // case for the ls
            // check if the command has more words other than ls
            if(arrayOfInputWords.length == 1){
                console.log("List Pages");
            } else{
                console.log("Wrong Command");
            }
            break;
        case commandsOfTerminal[3]: // case for the cls
            // check if the command has more words other than cls
            if(arrayOfInputWords.length == 1){
                console.log("Clear Screen");
            } else{
                console.log("Wrong Command");
            }
            break;
        default:
            console.log("wrong command")
            break;
    }
};

// main() fxn
// let userInput = prompt("INPUT:")
terminalFunction("cd home")