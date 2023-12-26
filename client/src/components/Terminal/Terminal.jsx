import React, { useState } from 'react';

const Terminal = () => {
    const [input, setInput] = useState('');
    const [prevCommands, setTerminalCommands] = useState([]);

    const commandsOfTerminal = ["cd", "nexus", "ls", "cls", "exit"];
    const pagesOfNexus = ["home", "events", "team", "forms", "about", "contact"];

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleTerminalSubmit = (e) => {
        e.preventDefault();
        const output = terminalFunction(input);
        if (output == 0){
            setTerminalCommands([]);
        } else{
            setTerminalCommands((prevCommands) => [...prevCommands, { input, output }]);
        }
        setInput('');
    };

    const terminalFunction = (input) => {
        // splitting the input with to check whether it is correct command or not
        let arrayOfInputWords = input.split(' ');
        
        // iterating through commands whether it matches any of the commands in the list
        switch(arrayOfInputWords[0]){
            case '': // no input given
                break;
            case commandsOfTerminal[0]: // case for the cd
                // check if the command has less or more words
                if (arrayOfInputWords.length == 2 && pagesOfNexus.includes(arrayOfInputWords[1])){
                    return <div className='mt-0.5'><p className='decoration-red-950'>cd command to  {arrayOfInputWords[1]}</p></div>;
                    // redirect to the arrayOfInputWords[1] page
                } else if(arrayOfInputWords.length == 2){
                    return <div className='mt-0.5 decoration-red-950'><p>{arrayOfInputWords[1]} Doesn't exists</p></div>;
                } else{
                    return <div className='mt-0.5'><p>Wrong Command ask nexus help for commands</p></div>;
                }
                break;
            case commandsOfTerminal[1]: // case for the nexus
                return <div className='mt-0.5'><p>Nexus command</p></div>;
                break;
            case commandsOfTerminal[2]: // case for the ls
                // check if the command has more words other than ls
                if(arrayOfInputWords.length == 1){
                    return <div className='mt-0.5'><p>List of Pages Soon....</p></div>;;
                    // list all the pages of nexus 
                } else{
                    return <div className='mt-0.5'><p>Wrong Command</p></div>;
                }
                break;
            case commandsOfTerminal[3]: // case for the cls
                // check if the command has more words other than cls
                if(arrayOfInputWords.length == 1){
                    return 0;
                } else{
                    return <div className='mt-0.5'><p>Wrong Command</p></div>;
                }
                break;
            case commandsOfTerminal[4]: // case for the exit
                // check if the command has more words than required for exit
                if(arrayOfInputWords.length == 1){
                    window.close();
                } else{
                    return <div className='mt-0.5'><p>Wrong Command</p></div>;
                }
            default:
                return <div className='mt-0.5'><p>Wrong Command</p></div>;
                break;
        }
    };

    return (
        <div className='flex flex-col items-center justify-center gap-4 max-w-7xl mx-auto '>
        <h2 className='text-2xl font-semibold'>$ Nexus Terminal</h2>
        <p className='text-[1.25rem] text-gray-400'>Interact to know more about Nexus...</p>
        <div className="h-[70vh] md:h-[75vh] w-[90%] md:w-[70vw] bg-white rounded-2xl overflow-hidden text-black">
            <div className='bg-gray-300 h-10 flex items-center pl-6 list-none gap-2'>
            <li className='bg-red-800 h-4 w-4 rounded-full'></li>
            <li className='bg-yellow-400 h-4 w-4 rounded-full'></li>
            <li className='bg-green-800 h-4 w-4 rounded-full'></li>
            </div>
            {/* Existing terminal outputs */}
            {prevCommands.map((command, index) => (
            <div key={index} className="px-4 py-2 text-orange-500 font-semibold">
                <div className='mb-0.5'><p>SVNIT/CSE/Nexus/User:~${command.input}</p></div>
                {/* <div className='mt-0.5'><p>{command.output}</p></div> */}
                {command.output}
            </div>
            ))}

            {/* Form for new input */}
            <form onSubmit={handleTerminalSubmit}>
                <div className='px-4 py-2 text-orange-500 font-semibold flex '>
                    <p>SVNIT/CSE/Nexus/User:~$</p>
                    <input
                    type="text"
                    placeholder='info'
                    value={input}
                    onChange={handleInputChange}
                    className='outline-none border-none ml-1'
                    />
                </div>
            </form>
        </div>
        </div>
    );
}

export default Terminal