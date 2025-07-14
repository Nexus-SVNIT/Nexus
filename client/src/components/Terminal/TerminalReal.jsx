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
  // const pagesOfNexus = ["home", "events", "team", "forms", "about", "contact"];
  const pagesOfNexus = [
    "home",
    "team",
    "achievements",
    "events",
    "forms",
    "connect",
    "projects",
    "coding",
    "interview-experiences",
    "about",
  ];
  const nexusCommands = ["--help", "about"];
  const codingValidate = (arrayOfInputWords) => {
    const platforms = ["codeforces", "codechef", "leetcode"];
    const branches = ["CS", "AI"];
    let codingProfile = {
      search: undefined,
      year: undefined,
      branch: undefined,
      platform: undefined,
      status: undefined,
    };
    if (arrayOfInputWords.length === 2) {
      return "/coding";
    }
    for (let i = 2; i < arrayOfInputWords.length; i += 2) {
      switch (arrayOfInputWords[i]) {
        case "-s":
          codingProfile.search = arrayOfInputWords[i + 1];
          break;
        case "-y":
          codingProfile.year = parseInt(arrayOfInputWords[i + 1]) % 2000;
          break;
        case "-p":
          if (!platforms.includes(arrayOfInputWords[i + 1].toLowerCase())) {
            return "platformUndefined";
          }
          codingProfile.platform = arrayOfInputWords[i + 1].toLowerCase();
          break;
        case "-b":
          if (!branches.includes(arrayOfInputWords[i + 1].toUpperCase())) {
            return "branchUndefined";
          }
          codingProfile.branch = arrayOfInputWords[i + 1].toUpperCase();
          break;
        case "-a":
          switch (arrayOfInputWords[i + 1]) {
            case "0":
              codingProfile.status = "current";
              break;
            case "1":
              codingProfile.status = "alumni";
              break;
          }
        default:
          return "filterUndefined";
      }
    }
    let params = new URLSearchParams();
    for (let key in codingProfile) {
      if (codingProfile[key] != undefined) {
        params.append(key, codingProfile[key]);
      }
    }
    let path = "/coding?" + params.toString();
    return path;
  };

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
          arrayOfInputWords.length % 2 === 0 &&
          arrayOfInputWords[1] === "coding" //particularly if its coding page, using seperate flags on it
        ) {
          const path = codingValidate(arrayOfInputWords);
          console.log(path);
          switch (path) {
            case "platformUndefined": //when -p tag is used incorrectly
              return (
                <div className="mt-0.5 text-red-900">
                  <p>
                    Platform does not exist. Select among codeforces, leetcode
                    or codechef.
                  </p>
                </div>
              );
            case "branchUndefined": //when -b tage is used incorrectly
              return (
                <div className="mt-0.5 text-red-900">
                  <p>Branch does not exist. Select between CS or AI.</p>
                </div>
              );
            case "filterUndefined": //if an invalid tag is used
              return (
                <div className="mt-0.5 text-red-900">
                  <p>Wrong Command ask "nexus --help" for commands</p>
                </div>
              );
            default:
              navigate(path);
              return <div className="mt-0.5"></div>;
          }
        } else if (
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
                <div className="mt-0.5">
                  <p>
                    The Nexus Terminal allows you to navigate around this
                    website while giving you the joy of using command line
                    interface. To get help with the commands, use the following:
                  </p>
                </div>
                <div className="lg:ga flex w-full gap-4 text-xs md:gap-6 md:text-sm">
                  <span className="text-teal-300">cd home</span>
                  <span>: Redirect to Home Page</span>
                </div>
                <div className="lg:ga flex w-full gap-4 text-xs md:gap-6 md:text-sm">
                  <span>cd {`[page]`}</span>
                  <span>: Redirect to a particular page</span>
                </div>
                <div>cd coding</div>
                <div className="lg:ga flex w-full gap-4 text-xs md:gap-6 md:text-sm">
                  <span></span>
                  <span>-s: Search user.</span>
                </div>
                <div className="lg:ga flex w-full gap-4 text-xs md:gap-6 md:text-sm">
                  <span></span>
                  <span>-b: Filter for branch. Use CS or AI.</span>
                </div>
                <div className="lg:ga flex w-full gap-4 text-xs md:gap-6 md:text-sm">
                  <span></span>
                  <span>
                    -a: Filter for status. Use 0 for alumni or 1 for current
                    student.
                  </span>
                </div>
                <div className="lg:ga flex w-full gap-4 text-xs md:gap-6 md:text-sm">
                  <span></span>
                  <span>
                    -p: Filter for platform. Use codeforces, codechef or
                    leetcode.
                  </span>
                </div>
                <div className="lg:ga flex w-full gap-4 text-xs md:gap-6 md:text-sm">
                  <span></span>
                  <span>-y: Filter for batch.</span>
                </div>
                <div className="lg:ga flex w-full gap-4 text-xs md:gap-6 md:text-sm">
                  <span>cls</span>
                  <span>: Clear Terminal</span>
                </div>
                <div className="lg:ga flex w-full gap-4 text-xs md:gap-6 md:text-sm">
                  <span>ls</span>
                  <span>: List of pages</span>
                </div>
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
            <div className="mt-0.5 flex w-full flex-col gap-2 text-xs md:text-sm">
              <div className="lg:ga flex w-full gap-4 text-xs md:gap-6 md:text-sm">
                <span className="text-teal-300">cd home</span>
                <span>: You are here</span>
              </div>
              <div>cd team</div>
              <div>cd achievements</div>
              <div>cd events</div>
              <div>cd forms</div>
              <div>cd connect</div>
              <div>cd projects</div>
              <div>cd coding</div>
              <div>cd interview-experiences</div>
              <div>cd about</div>
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
      <p className="text-gray-400 text-base md:text-[1.25rem]">
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
              className="text-orange-500 px-4 py-2 font-semibold"
            >
              <div className="mb-0.5">
                <p className="text-orange-500 text-xs md:text-base">
                  SVNIT/DoCSE \& DoAI/Nexus/User:~${command.input}
                </p>
              </div>
              {/* <div className='mt-0.5'><p>{command.output}</p></div> */}
              {command.output}
            </div>
          ))}

          {/* Form for new input */}
          <form onSubmit={handleTerminalSubmit}>
            <div className="text-orange-500 flex px-4 py-2 font-semibold ">
              <p className="text-orange-500 text-xs md:text-base">
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
