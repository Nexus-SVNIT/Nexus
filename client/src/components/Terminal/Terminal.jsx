import React, { useState } from "react";
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Terminal = () => {
  const [input, setInput] = useState("");
  const [prevCommands, setTerminalCommands] = useState([]);
  const [count, setCount] = useState(0);

  const incrementCount = () => {
    setCount(count + 1);
  };

  const commandsOfTerminal = ["cd", "nexus", "ls", "cls", "exit", "register"];
  const pagesOfNexus = ["home", "events", "team", "forms", "about", "contact"];
  const nexusCommands = ["--help", "about"];
  const scrollContainerRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to the bottom when the component mounts or when new content is added
    scrollContainerRef.current.scrollTop =
      scrollContainerRef.current.scrollHeight;
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
      setTerminalCommands((prevCommands) => [
        ...prevCommands,
        { input, output },
      ]);
    }
    setInput("");
  };

  const terminalFunction = (input) => {
    // splitting the input with to check whether it is correct command or not
    let arrayOfInputWords = input.split(" ");

    // iterating through commands whether it matches any of the commands in the list
    switch (arrayOfInputWords[0]) {
      case "": // no input given
        break;
      case commandsOfTerminal[0]: // case for the cd
        // check if the command has less or more words
        if (
          arrayOfInputWords.length === 2 &&
          pagesOfNexus.includes(arrayOfInputWords[1])
        ) {
          navigate("/" + arrayOfInputWords[1]);
          return <div className="mt-0.5"></div>;
          // redirect to the arrayOfInputWords[1] page
        } else if (arrayOfInputWords.length === 2) {
          return (
            <div className="mt-0.5 text-red-900">
              <p>Page {arrayOfInputWords[1]} Doesn't exists</p>
            </div>
          );
        } else {
          return (
            <div className="mt-0.5 text-red-900">
              <p>Wrong Command ask "nexus --help" for commands</p>
            </div>
          );
        }

      case commandsOfTerminal[1]: // case for the nexus commands
        switch (arrayOfInputWords[1]) {
          case nexusCommands[0]: // nexus --help
            return (
              <div className="mt-0.5 flex w-full flex-col gap-2 text-xs md:text-sm">
                {/* <div className="text-xs md:text-sm">
                  <div className="text-teal-300">cd home</div>
                  <div className="text-teal-300">cd team</div>
                  <div className="text-teal-300">cd events</div>
                  <div className="text-teal-300">cd about</div>
                  <div className="text-teal-300">cd forms</div>
                  <div className="text-teal-300">cd contactus</div>
                  <div className="text-teal-300">ls</div>
                </div>
                <div className="text-xs md:text-sm">
                  <div>Redirect to Home Page</div>
                  <div>Redirect to Team Page</div>
                  <div>Redirect to Events Page</div>
                  <div>Redirect to About Page</div>
                  <div>Redirect to Forms Page</div>
                  <div>Redirect to ContactUs Page</div>
                  <div>List all the pages available</div>
                </div> */}

                <div className="lg:ga flex w-full gap-4 text-xs md:gap-6 md:text-sm">
                  <span className="text-teal-300">cd home</span>
                  <span>Redirect to Home Page</span>
                </div>
                <div>cd team</div>
                <div>cd events</div>
                <div>cd about</div>
                <div>cd forms</div>
                <div>cd contactus</div>
                <div>ls</div>
              </div>
            );
            break;
          case nexusCommands[1]: // nexus about
            return (
              <div className="mt-0.5">
                <p>Nexus About</p>
              </div>
            );
            break;
          default:
            return (
              <div className="mt-0.5 text-red-900">
                <p>Wrong Command ask "nexus --help" for commands</p>
              </div>
            );
            break;
        }
        break;
      case commandsOfTerminal[2]: // case for the ls
        // check if the command has more words other than ls
        if (arrayOfInputWords.length === 1) {
          return (
            <div className="mt-0.5">
              <p>List of Pages Soon....</p>
            </div>
          );
          // list all the pages of nexus
        } else {
          return (
            <div className="mt-0.5 text-red-900">
              Wrong Command ask "nexus --help" for commands
            </div>
          );
        }
        break;
      case commandsOfTerminal[3]: // case for the cls
        // check if the command has more words other than cls
        if (arrayOfInputWords.length === 1) {
          return 0;
        } else {
          return (
            <div className="mt-0.5 text-red-900">
              <p>Wrong Command ask "nexus --help" for commands</p>
            </div>
          );
        }
        break;
      case commandsOfTerminal[5]: // case for the register
        // check if the command is correct
        if (arrayOfInputWords.length == 2) {
          // check if the event name exists in the database or not
          // else if the event is there but not accepting registrations
          return (
            <div className="mt-0.5 text-red-900">
              <p>Event ${arrayOfInputWords[1]} is not accepting</p>
            </div>
          );
          // else if the event is not found
          return (
            <div className="mt-0.5 text-red-900">
              <p>Event ${arrayOfInputWords[1]} is not found</p>
            </div>
          );
        } else {
          return (
            <div className="mt-0.5 text-red-900">
              <p>Wrong Command ask "nexus --help" for commands</p>
            </div>
          );
        }
      default:
        return (
          <div className="mt-0.5 text-red-900">
            <p>Wrong Command ask "nexus --help" for commands</p>
          </div>
        );
    }
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 ">
      <h2 className="text-2xl font-semibold">$ Nexus Terminal</h2>
      <p className="text-base text-gray-400 md:text-[1.25rem]">
        Interact to know more about Nexus...
      </p>
      <div className="flex h-[50vh] w-[90%] flex-col overflow-y-auto rounded-2xl bg-white/95 text-black md:h-[75vh] md:w-[70vw] ">
        <div className="flex h-10 list-none items-center gap-2 bg-black/25 pl-6">
          <li className="h-4 w-4 rounded-full bg-red-600"></li>
          <li className="h-4 w-4 rounded-full bg-yellow-300"></li>
          <li className="h-4 w-4 rounded-full bg-green-600"></li>
        </div>

        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
          {/* Existing terminal outputs */}
          {prevCommands.map((command, index) => (
            <div
              key={index}
              className="px-4 py-2 font-semibold text-orange-500"
            >
              <div className="mb-0.5">
                <p className="text-xs text-orange-500 md:text-base">
                  SVNIT/DoCSE \& DoAI/Nexus/User:~${command.input}
                </p>
              </div>
              {/* <div className='mt-0.5'><p>{command.output}</p></div> */}
              {command.output}
            </div>
          ))}

          {/* Form for new input */}
          <form onSubmit={handleTerminalSubmit}>
            <div className="flex px-4 py-2 font-semibold text-orange-500 ">
              <p className="text-xs text-orange-500 md:text-base">
                SVNIT/DoCSE \& DoAI/Nexus/User:~$
              </p>
              <input
                type="text"
                placeholder={count === 0 ? "nexus --help " : null}
                value={input}
                onChange={handleInputChange}
                className="ml-1 w-full basis-1/2 border-none bg-transparent text-xs outline-none md:text-base"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
