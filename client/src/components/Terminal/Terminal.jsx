import React, { useState } from 'react';
import { useRef, useEffect } from 'react';

const Terminal = () => {
    const [input, setInput] = useState('');
    const [prevCommands, setTerminalCommands] = useState([]);
    const [count, setCount] = useState(0);

    const incrementCount = () => {
        setCount(count + 1);
    };

    const commandsOfTerminal = ["cd", "nexus", "ls", "cls", "exit", "register"];
    const pagesOfNexus = ["home", "events", "team", "forms", "about", "contact"];
    const nexusCommands = ["--help", "about"]
    const scrollContainerRef = useRef();

    useEffect(() => {
        // Scroll to the bottom when the component mounts or when new content is added
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }, [prevCommands]); // Assuming prevCommands is the array of terminal outputs


    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleTerminalSubmit = (e) => {
        e.preventDefault();
        const output = terminalFunction(input);
        incrementCount();
        if (output === 0) {
            setTerminalCommands([]);
        } else {
            setTerminalCommands((prevCommands) => [...prevCommands, { input, output }]);
        }
        setInput('');
    };

    const terminalFunction = (input) => {
        // splitting the input with to check whether it is correct command or not
        let arrayOfInputWords = input.split(' ');

        // iterating through commands whether it matches any of the commands in the list
        switch (arrayOfInputWords[0]) {
            case '': // no input given
                break;
            case commandsOfTerminal[0]: // case for the cd
                // check if the command has less or more words
                if (arrayOfInputWords.length === 2 && pagesOfNexus.includes(arrayOfInputWords[1])) {
                    return <div className='mt-0.5'><p className='text-red-900'>cd command to  {arrayOfInputWords[1]}</p></div>;
                    // redirect to the arrayOfInputWords[1] page
                } else if (arrayOfInputWords.length === 2) {
                    return <div className='mt-0.5 text-red-900'><p>{arrayOfInputWords[1]} Doesn't exists</p></div>;
                } else {
                    return <div className='mt-0.5 text-red-900'><p>Wrong Command ask nexus help for commands</p></div>;
                }

            case commandsOfTerminal[1]: // case for the nexus commands
                switch (arrayOfInputWords[1]) {
                    case nexusCommands[0]: // nexus --help
                        return <div className='mt-0.5 flex gap-8'>
                            <div >
                                <div className='text-teal-300'>cd home</div>
                                <div className='text-teal-300'>cd team</div>
                                <div className='text-teal-300'>cd events</div>
                                <div className='text-teal-300'>cd about</div>
                                <div className='text-teal-300'>cd forms</div>
                                <div className='text-teal-300'>cd contactus</div>
                                <div className='text-teal-300'>ls</div>
                            </div>
                            <div>
                                <div>Redirect to Home Page</div>
                                <div>Redirect to Team Page</div>
                                <div>Redirect to Events Page</div>
                                <div>Redirect to About Page</div>
                                <div>Redirect to Forms Page</div>
                                <div>Redirect to ContactUs Page</div>
                                <div>List all the pages available</div>
                            </div>
                        </div>;
                        break;
                    case nexusCommands[1]: // nexus about
                        return <div className='mt-0.5'><p>Nexus About</p></div>;
                        break;
                }
                break;
            case commandsOfTerminal[2]: // case for the ls
                // check if the command has more words other than ls
                if (arrayOfInputWords.length === 1) {
                    return <div className='mt-0.5'><p>List of Pages Soon....</p></div>;;
                    // list all the pages of nexus 
                } else {
                    return <div className='mt-0.5 text-red-900'>Wrong Command</div>;
                }
                break;
            case commandsOfTerminal[3]: // case for the cls
                // check if the command has more words other than cls
                if (arrayOfInputWords.length === 1) {
                    return 0;
                } else {
                    return <div className='mt-0.5 text-red-900'><p>Wrong Command</p></div>;
                }
                break;
            case commandsOfTerminal[4]: // case for the exit
                // check if the command has more words than required for exit
                if (arrayOfInputWords.length === 1) {
                    window.close();
                } else {
                    return <div className='mt-0.5 text-red-900'><p>Wrong Command</p></div>;
                }
                break;
            case commandsOfTerminal[5]: // case for the register
                // check if the command is correct 
                if (arrayOfInputWords.length == 2) {
                    // check if the event name exists in the database or not
                    // else if the event is there but not accepting registrations
                    return <div className='mt-0.5 text-red-900'><p>Event ${arrayOfInputWords[1]} is not accepting</p></div>;
                    // else if the event is not found
                    return <div className='mt-0.5 text-red-900'><p>Event ${arrayOfInputWords[1]} is not found</p></div>;
                } else {
                    return <div className='mt-0.5 text-red-900'><p>Wrong Command</p></div>;
                }
            default:
                return <div className='mt-0.5 text-red-900'><p>Wrong Command</p></div>;

        }
    };

    return (
        <div className='flex flex-col items-center justify-center gap-4 max-w-7xl mx-auto '>
            <h2 className='text-2xl font-semibold'>$ Nexus Terminal</h2>
            <p className='text-[1.25rem] text-gray-400'>Interact to know more about Nexus...</p>
            <div className="h-[70vh] md:h-[75vh] w-[90%] md:w-[70vw] bg-white/95 rounded-2xl overflow-y-auto text-black flex flex-col ">
                <div className='bg-gray-300 h-10 flex items-center pl-6 list-none gap-2'>
                    <li className='bg-red-600 h-4 w-4 rounded-full'></li>
                    <li className='bg-yellow-300 h-4 w-4 rounded-full'></li>
                    <li className='bg-green-600 h-4 w-4 rounded-full'></li>
                </div>

                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
                    {/* Existing terminal outputs */}
                    {prevCommands.map((command, index) => (
                        <div key={index} className="px-4 py-2 text-orange-500 font-semibold">
                            <div className='mb-0.5'><p className='text-orange-500'>SVNIT/CSE/Nexus/User:~${command.input}</p></div>
                            {/* <div className='mt-0.5'><p>{command.output}</p></div> */}
                            {command.output}
                        </div>
                    ))}

                    {/* Form for new input */}
                    <form onSubmit={handleTerminalSubmit}>
                        <div className='px-4 py-2 text-orange-500 font-semibold flex '>
                            <p className='text-orange-500'>SVNIT/CSE/Nexus/User:~$</p>
                            <input
                                type="text"
                                placeholder={count === 0 ? 'nexus --help ' : null}
                                value={input}
                                onChange={handleInputChange}
                                className='outline-none border-none ml-1 basis-1/2 bg-transparent w-full'
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Terminal