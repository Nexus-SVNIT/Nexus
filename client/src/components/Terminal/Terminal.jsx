import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Terminal = () => {
  const [input, setInput] = useState("");
  const [prevCommands, setPrevCommands] = useState([]); // Displayed commands
  const [commandHistory, setCommandHistory] = useState([]); // All entered commands
  const [count, setCount] = useState(0);
  const [historyIndex, setHistoryIndex] = useState(null); // For up/down navigation
  const scrollContainerRef = useRef();
  const navigate = useNavigate();

  // const commands = ["cd", "nexus", "ls", "cls", "exit", "register"];
  const nexusPages = [
    "team",
    "achievements",
    "events",
    "forms",
    "alumni-network",
    "projects",
    "coding",
    "interview-experiences",
    "about",
  ];
  // const nexusSubcommands = ["--help", "about"];

  useEffect(() => {
    // Scroll to the bottom when the component mounts or when new content is added
    scrollContainerRef.current.scrollTop =
      scrollContainerRef.current.scrollHeight;
  }, [prevCommands]); // Assuming prevCommands is the array of terminal outputs

  const handleInputChange = (e) => setInput(e.target.value.toLowerCase()); // will convert any input to lower change, so terminal is mobile friendly now
  // Handle up/down arrow key navigation
  const handleInputKeyDown = (e) => {
    if (commandHistory.length === 0) return;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHistoryIndex((prev) => {
        const newIndex = prev === null ? commandHistory.length - 1 : Math.max(prev - 1, 0);
        setInput(commandHistory[newIndex] || "");
        return newIndex;
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHistoryIndex((prev) => {
        if (prev === null) return null;
        const newIndex = Math.min(prev + 1, commandHistory.length);
        if (newIndex === commandHistory.length) {
          setInput("");
          return null;
        } else {
          setInput(commandHistory[newIndex] || "");
          return newIndex;
        }
      });
    }
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    const output = terminalFunction(trimmedInput);
    setCount(count + 1);

    // Always update commandHistory except for empty input
    if (trimmedInput !== "") {
      setCommandHistory((prev) => [...prev, trimmedInput]);
    }

    if (output === 0) {
      setPrevCommands([]); // Clear display, but keep commandHistory
    } else {
      setPrevCommands((prev) => [...prev, { input: trimmedInput, output }]);
    }

    setInput("");
    setHistoryIndex(null); // Reset history navigation after submit
  };

  const codingValidate = (args) => {
    const platforms = ["codeforces", "codechef", "leetcode"];
    const branches = ["CS", "AI", "DS", "IS"];
    const codingProfile = {
      search: undefined,
      year: undefined,
      branch: undefined,
      grad: undefined,
      platform: undefined,
      status: undefined,
    };

    if (args.length === 2) return "/coding";

    for (let i = 2; i < args.length; i += 2) {
      const flag = args[i];
      const value = args[i + 1];

      switch (flag) {
        case "-s":
          codingProfile.search = value;
          break;
        case "-y":
          codingProfile.year = parseInt(value) % 2000;
          break;
        case "-p":
          if (!platforms.includes(value))
            return "platformUndefined";
          codingProfile.platform = value;
          break;
        case "-b":
          if (!branches.includes(value.toUpperCase())) return "branchUndefined";
          codingProfile.branch = value.toUpperCase();
          break;
        case "-a":
          switch (value) {
            case "0":
              codingProfile.status = "current";
              break;
            case "1":
              codingProfile.status = "alumni";
              break;
          }
          break;
        case "-g":
          switch (value) {
            case "ug":
              codingProfile.grad = "U";
              break;
            case "pg":
              codingProfile.grad = "P";
              break;
            case "phd":
              codingProfile.grad = "D";
              break;
            default:
              return "gradUndefined";
          }
          break;
        default:
          return "filterUndefined";
      }
    }

    const params = new URLSearchParams();
    for (const key in codingProfile) {
      if (codingProfile[key] !== undefined) {
        params.append(key, codingProfile[key]);
      }
    }

    return `/coding?${params.toString()}`;
  };

  const terminalFunction = (inputStr) => {
    // splitting the input with to check whether it is correct command or not
    const args = inputStr.split(" ");
    const [command, ...rest] = args;

    // iterating through commands whether it matches any of the commands in the list
    switch (command) {
      case "": //no input given
        return;

      case "cd":
        if (args.length % 2 === 0 && args[1] === "coding") {
          //particularly if its coding page, using seperate flags on it
          const path = codingValidate(args);
          switch (path) {
            case "platformUndefined": //when -p tag is used incorrectly
              return (
                <ErrorMsg text="Platform does not exist or data unavailable. Use codeforces, leetcode or codechef." />
              );
            case "branchUndefined": //when -b tag is used incorrectly
              return (
                <ErrorMsg text="Branch does not exist. Use CS/AI (for UG), CS/DS/IS (for PG)." />
              );
            case "gradUndefined": //when -g tag is used incorrectly
              return (
                <ErrorMsg text="Graduation Level does not exist. Use ug, pg or phd." />
              );
            case "filterUndefined": //if an invalid tag is used
              return (
                <ErrorMsg text='Wrong Command. Ask "nexus --help" for commands.' />
              );
            default:
              navigate(path); //redirect to the coding page with query params
              return <div className="mt-0.5" />;
          }
        } else if (args.length === 2 && args[1] === 'home') {
          navigate(`/`); // reloads home
          return <div className="mt-0.5" />;
        } else if (args.length === 2 && nexusPages.includes(args[1])) {
          navigate(`/${args[1]}`); // redirect to the args[1] page
          return <div className="mt-0.5" />;
        } else if (args.length === 2) {
          return <ErrorMsg text={`Page ${args[1]} doesn't exist.`} />;
        } else {
          return (
            <ErrorMsg text='Wrong Command. Ask "nexus --help" for commands.' />
          );
        }

      case "nexus":
        switch (args[1]) {
          case "--help":
            return <HelpMessage />;
          case "about":
            return <AboutMessage />;
          default:
            return (
              <ErrorMsg text='Wrong Command. Ask "nexus --help" for commands.' />
            );
        }

      case "ls":
        return args.length === 1 ? (
          <PageList />
        ) : (
          <ErrorMsg text='Wrong Command. Ask "nexus --help" for commands.' />
        );

      case "cls":
        return args.length === 1 ? (
          0
        ) : (
          <ErrorMsg text='Wrong Command. Ask "nexus --help" for commands.' />
        );

      case "register":
        return args.length === 2 ? (
          <ErrorMsg text={`Event ${args[1]} is not accepting`} />
        ) : (
          <ErrorMsg text='Wrong Command. Ask "nexus --help" for commands.' />
        );

      default:
        return (
          <ErrorMsg text='Wrong Command. Ask "nexus --help" for commands.' />
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
                onKeyDown={handleInputKeyDown}
                className="ml-1 w-full basis-1/2 border-none bg-transparent text-xs outline-none md:text-base"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Components

const HelpMessage = () => (
  <div className="mt-0.5 flex flex-col gap-2 text-xs md:text-sm">
    <p>
      The Nexus Terminal lets you navigate the website via command-line
      interface. Use the following commands:
    </p>
    {[
      ["cd [page]", "Redirect to a particular page"],
      ["cd coding", ""],
      ["", "-s: Search user"],
      ["", "-b: Filter by branch (CS/AI/DS/IS)"],
      ["", "-a: Filter by status (0=current, 1=alumni)"],
      ["", "-p: Platform (codeforces/codechef/leetcode)"],
      ["", "-y: Year"],
      ["", "-g: Graduation Level (ug/pg/phd)"],
      ["cls", "Clear terminal"],
      ["ls", "List available pages"],
      ["nexus --help", "Show this help message"],
      ["nexus about", "About Nexus"],
    ].map(([cmd, desc], i) => (
      <div key={i} className="flex gap-4">
        <span>{cmd}</span>
        <span>{desc}</span>
      </div>
    ))}
  </div>
);

const PageList = () => (
  // list of all pages of nexus
  <div className="mt-0.5 flex flex-col gap-2 text-xs md:text-sm">
    {[
      ["cd home", "You are here"],
      "cd team",
      "cd achievements",
      "cd events",
      "cd forms",
      "cd alumni-network",
      "cd projects",
      "cd coding",
      "cd interview-experiences",
      "cd about",
    ].map((item, i) =>
      Array.isArray(item) ? (
        <div key={i} className="flex gap-4">
          <span className="text-teal-300">{item[0]}</span>
          <span>{item[1]}</span>
        </div>
      ) : (
        <div key={i}>{item}</div>
      ),
    )}
  </div>
);

const AboutMessage = () => (
  <div className="mt-0.5 flex flex-col gap-2 text-xs md:text-sm">
    <p>
      Nexus is the buzzing hub for computer science minds at SVNIT Surat. We
      bring together CSE and AI students who are passionate about tech,
      learning, and growth.{" "}
    </p>
    <p>
      At Nexus, it's not just about academics — it's about building skills,
      exploring interests, and growing together. We aim to spark innovation,
      encourage curiosity, and shape a community ready to take on the digital
      world.{" "}
    </p>
    <p>
      Whether it's coding, collaboration, or creativity — Nexus is where it all
      connects.
    </p>
  </div>
);

const ErrorMsg = ({ text }) => (
  <div className="mt-0.5 text-red-900">
    <p>{text}</p>
  </div>
);

const SimpleMsg = ({ text }) => (
  <div className="mt-0.5">
    <p>{text}</p>
  </div>
);

export default Terminal;
