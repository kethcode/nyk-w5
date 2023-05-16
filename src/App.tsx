import { EVMResults, Stack, Memory, Storage } from "./components";
import { useState, useMemo, useRef } from "react";
import { Analytics } from "@vercel/analytics/react";

import "./App.css";

type vEVMState = {
  code: string;
  data: string;
  value: string;
  pc: string;
  stack: string[];
  mem: string;
  storageKey: string[];
  storageData: string[];
  logs: string[];
  output: string;
};

export function App() {
  const [textCode, setTextCode] = useState("");
  const [textData, setTextData] = useState("");
  const [textValue, setTextValue] = useState("");
  const [bytecode, setBytecode] = useState("");
  const [data, setData] = useState("");
  const [value, setValue] = useState("");

  const [executing, setExecuting] = useState<boolean>();

  const [puzzleId, setPuzzleId] = useState(1);
  const [puzzleDesc, setPuzzleDesc] = useState<string>();
  const [puzzleRefLink, setPuzzleRefLink] = useState<string>();
  const [puzzleAnswer, setPuzzleAnswer] = useState<vEVMState>();
  const [puzzleStatus, setPuzzleStatus] = useState<boolean>();

  const [activePuzzle, setActivePuzzle] = useState(1);

  const setPuzzle = () => {
    setPuzzleStatus(false);
    switch (puzzleId) {
      case 1:
        setPuzzleDesc(
          `Ethereum runs on the EVM, a virtual CPU.\n\n` +
            `The CPU executes a program representated in bytecode, shows asa  string of hex. Every 2 hex characters is 1 byte, and each byte is a command or data.\n\n` +
            `This is what you see when you examine a compiled contract on etherscan or remix, and it is all the EVM actually knows. Everything else is abstraction and tooling.\n\n` +
            `eg: 608060405234801561001057600080fd5b50613a46806100206000396000f3fe608060405234801561001057...`
        );
        setPuzzleAnswer({
          code: "",
          data: "",
          value: "",
          pc: "",
          stack: [""],
          mem: "",
          storageKey: [],
          storageData: [],
          logs: [],
          output: "",
        });
        setPuzzleRefLink(undefined);
        setActivePuzzle(1);

        return;
      case 2:
        setPuzzleDesc(
          `The Stack is temporary memory used by the EVM. It provides 1024 slots of 32 bytes each.\n\n` +
            `It's called a stack because you pile up values. The last value you push to the stack goes on top, and values are retrieved in order from the top to bottom when you read from the stack.\n\n` +
            `The stack is used for all operations, including math, memory, and storage.\n`
        );
        setPuzzleAnswer({
          code: "",
          data: "",
          value: "",
          pc: "",
          stack: [""],
          mem: "",
          storageKey: [],
          storageData: [],
          logs: [],
          output: "",
        });
        setPuzzleRefLink(undefined);
        setActivePuzzle(2);

        return;
      case 3:
        setPuzzleDesc(
          `There are 32 variants of PUSH, corresponding to the size of the data you want to push. A PUSH of any size takes an entire 32 byte slot. The hex data you are pushing follows the opcode.\n\n` +
            `To place 0xFF on the top of the stack:\nPUSH1 0xFF\n\nwhich looks like this in bytecode:\n0x60FF\n\n` +
            `Place the hex value 0x10 on the stack.`
        );
        setPuzzleRefLink("www.evm.codes/#60?fork=shanghai");
        setPuzzleAnswer({
          code: "",
          data: "",
          value: "",
          pc: "",
          stack: [
            "0x0000000000000000000000000000000000000000000000000000000000000010",
          ],
          mem: "",
          storageKey: [],
          storageData: [],
          logs: [],
          output: "",
        });
        setActivePuzzle(3);

        return;

      case 4:
        setPuzzleDesc(
          `Aside from the Stack, the EVM allows to access as much Memory as you're willing to buy.\n\n` +
            `Compilers place structure on this memory; Solidity defines the first 160bytes for you. We're operating on the raw EVM though, so you have direct access to all of it.\n\n` +
            `This memory is not broken up into 32 bytes like the stack, but is instead continuous. You can access any location you want, with the proper opcodes.\n\n` +
            `However, accessing a location higher in memory initializes all unused values below it to zero. This is called memory expansion, and can get very expensive.\n\n` +
            `Some opcode, like RETURN, only operate on memory, so we're going to practice Memory next.`
        );
        setPuzzleAnswer({
          code: "",
          data: "",
          value: "",
          pc: "",
          stack: [""],
          mem: "",
          storageKey: [],
          storageData: [],
          logs: [],
          output: "",
        });
        setActivePuzzle(4);

        return;
      case 5:
        setPuzzleDesc(
          `MSTORE is an opcode that takes data from the stack and places it in memory.\n\n` +
            `example: (store FF at A0 in memory)\n\n` +
            `PUSH1 0xFF : 0x60FF\n` +
            `PUSH1 0xA0 : 0x60A0\n` +
            `MSTORE : 0x52\n\n` +
            `Unlike PUSH, you need to specify where in memory to want the data. There are no data alignment constraints; you can place the data anywhere. However, MSTORE pushes 32 bytes.  We'll learn MSTORE8 later which pushes 1 byte.\n\n` +
            `If you place the data higher in memory, unused skipped memory locations are fill with zero. Note that this Memory Expansion can get expensive in contracts.\n\n` +
            `Place the hex value 0x10 on the stack, then move it to memory location 0x20.\n\n` +
            `You will notice some memory expansion in your answer.`
        );
        setPuzzleAnswer({
          code: "",
          data: "",
          value: "",
          pc: "",
          stack: [],
          mem: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010",
          storageKey: [],
          storageData: [],
          logs: [],
          output: "",
        });
        setActivePuzzle(5);
        return;
      case 6:
        setPuzzleDesc(
          `Storage is the core of the blockchain. It is the global hard drive that everyone can read and write.\n\n` +
            `It's also very expensive; at current ETH prices, it's tens of thousands of dollars per MB. There are other options like IPFS, but for now, only store what you absolutely need onchain, and be clever about it if you can.\n\n` +
            `The vEVM we're using emulates storage, so you wont incur any costs while solving the tutorial.\n\n` +
            `You store values by specifying a storage slot as a 32 byte hex value, and then 32 byte value you want to store there. You can then retrieve that value later by reading from the same slot.\n\n` +
            `You can also store values in the same slot, overwriting the previous value.\n`
        );
        setPuzzleAnswer({
          code: "",
          data: "",
          value: "",
          pc: "",
          stack: [""],
          mem: "",
          storageKey: [],
          storageData: [],
          logs: [],
          output: "",
        });
        setActivePuzzle(6);

        return;
      case 7:
        setPuzzleDesc(
          `SSTORE is an opcode that takes data from the stack and places it in storage.\n\n` +
            `example: (store FF at A0 in storage)\n\n` +
            `PUSH1 0xFF : 0x60FF\n` +
            `PUSH1 0xA0 : 0x60A0\n` +
            `SSTORE : 0x55\n\n` +
            `Place the hex value 0x10 on the stack, then move it to storage slot 0x30.`
        );
        setPuzzleAnswer({
          code: "",
          data: "",
          value: "",
          pc: "",
          stack: [],
          mem: "",
          storageKey: [
            "0x0000000000000000000000000000000000000000000000000000000000000030",
          ],
          storageData: [
            "0x0000000000000000000000000000000000000000000000000000000000000010",
          ],
          logs: [],
          output: "",
        });
        setActivePuzzle(7);
        return;
      case 8:
        setPuzzleDesc(
          `Show me what you've got.\n\n` +
            `The final state should have:\n` +
            `0x10 on the stack\n` +
            `0x20 in memory at location 0x00 (as a 32byte value)\n` +
            `0x30 in storage at location 0x00\n\n` +
            `Screencap when you've got it right and tweet it at @kethcode.\n`
        );
        setPuzzleAnswer({
          code: "",
          data: "",
          value: "",
          pc: "",
          stack: [
            "0x0000000000000000000000000000000000000000000000000000000000000010",
          ],
          mem: "0x0000000000000000000000000000000000000000000000000000000000000020",
          storageKey: [
            "0x0000000000000000000000000000000000000000000000000000000000000000",
          ],
          storageData: [
            "0x0000000000000000000000000000000000000000000000000000000000000030",
          ],
          logs: [],
          output: "",
        });
        setActivePuzzle(8);
        return;
      case 9:
        setPuzzleDesc(
          `The arithmetic opcodes take two imputs from the stack, and place the answer on the stack.\n\n` +
            `You have the basic opcodes you would expect: ADD, MUL, SUB, DIV, MOD, and EXP.  These all assume unsigned operation: only positive numbers. If you fall below zero, or exceed 2^256, you'll get an overlfow error.\n\n` +
            `There are also signed versions: SDIV and SMOD. Negative values may give you an answer instead of an overflow error.\n\n` +
            `Lastly, there are multistep operations: ADDMOD and MULMOD. These allow ADD and MUL results to exceed the 2^256 limit before the MOD operation occurs.\n`
        );
        setPuzzleAnswer({
          code: "",
          data: "",
          value: "",
          pc: "",
          stack: [""],
          mem: "",
          storageKey: [],
          storageData: [],
          logs: [],
          output: "",
        });
        setActivePuzzle(9);

        return;

      case 10:
        setPuzzleDesc(
          `There are plenty of ways you can do this, but use at least 3 OPCODEs to place 0x100 on the stack.\n`
        );
        setPuzzleAnswer({
          code: "",
          data: "",
          value: "",
          pc: "",
          stack: [
            "0x0000000000000000000000000000000000000000000000000000000000000100",
          ],
          mem: "",
          storageKey: [""],
          storageData: [""],
          logs: [],
          output: "",
        });
        setActivePuzzle(8);
      default:
        return;
    }
  };

  const checkAnswer = (results: vEVMState) => {
    if (!puzzleAnswer) return;
    switch (puzzleId) {
      case 3:
        if (isEqual(results.stack, puzzleAnswer.stack)) {
          console.log("correct!");
          setPuzzleStatus(true);
        } else {
          console.log("incorrect!");
          setPuzzleStatus(false);
        }
        return;
      case 5:
        if (results.mem === puzzleAnswer.mem) {
          console.log("correct!");
          setPuzzleStatus(true);
        } else {
          console.log("incorrect!");
          setPuzzleStatus(false);
        }
        return;
      case 7:
        if (
          isEqual(results.storageData, puzzleAnswer.storageData) &&
          isEqual(results.storageKey, puzzleAnswer.storageKey)
        ) {
          console.log("correct!");
          setPuzzleStatus(true);
        } else {
          console.log("incorrect!");
          setPuzzleStatus(false);
        }
        return;
      case 8:
        console.log("stack: ", isEqual(results.stack, puzzleAnswer.stack));
        console.log("mem: ", results.mem === puzzleAnswer.mem);
        console.log(
          "storageData: ",
          isEqual(results.storageData, puzzleAnswer.storageData)
        );
        console.log(
          "storageKey: ",
          isEqual(results.storageKey, puzzleAnswer.storageKey)
        );

        if (
          isEqual(results.stack, puzzleAnswer.stack) &&
          results.mem === puzzleAnswer.mem &&
          isEqual(results.storageData, puzzleAnswer.storageData) &&
          isEqual(results.storageKey, puzzleAnswer.storageKey)
        ) {
          console.log("correct!");
          setPuzzleStatus(true);
        } else {
          console.log("incorrect!");
          setPuzzleStatus(false);
        }
        return;
      case 10:
        if (
          results.code.length > 10 &&
          isEqual(results.stack, puzzleAnswer.stack)
        ) {
          console.log("correct!");
          setPuzzleStatus(true);
        } else {
          console.log("incorrect!");
          setPuzzleStatus(false);
        }
        return;
      default:
        return;
    }
  };

  // https://stackoverflow.com/questions/62459785/comparing-two-state-arrays-in-react-will-not-return-a-boolean-true-if-they-are
  // https://stackoverflow.com/a/62459873
  function isEqual(value: any, other: any) {
    // Get the value type
    var type = Object.prototype.toString.call(value);

    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other)) {
      return false;
    }

    // If items are not an object or array, return false
    if (["[object Array]", "[object Object]"].indexOf(type) < 0) {
      return false;
    }

    // Compare the length of the length of the two items
    var valueLen =
      type === "[object Array]" ? value.length : Object.keys(value).length;
    var otherLen =
      type === "[object Array]" ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) {
      return false;
    }
    // Compare two items
    var compare = function (item1: any, item2: any) {
      // Get the object type
      var itemType = Object.prototype.toString.call(item1);

      // If an object or array, compare recursively
      if (["[object Array]", "[object Object]"].indexOf(itemType) >= 0) {
        if (!isEqual(item1, item2)) {
          return false;
        }
      }

      // Otherwise, do a simple comparison
      else {
        // If the two items are not the same type, return false
        if (itemType !== Object.prototype.toString.call(item2)) return false;

        // Else if it's a function, convert to a string and compare
        // Otherwise, just compare
        if (itemType === "[object Function]") {
          if (item1.toString() !== item2.toString()) return false;
        } else {
          if (item1 !== item2) return false;
        }
      }
    };

    // Compare properties
    if (type === "[object Array]") {
      for (var i = 0; i < valueLen; i++) {
        if (compare(value[i], other[i]) === false) return false;
      }
    } else {
      for (var key in value) {
        if (value.hasOwnProperty(key)) {
          if (compare(value[key], other[key]) === false) return false;
        }
      }
    }

    // If nothing failed, return true
    return true;
  }

  const sendParamters = () => {
    if (textCode.length != 0) {
      // console.log("textCode: [%d]", textCode, textCode.length);
      setBytecode(textCode);
      setData(textData);
      setValue(textValue);
      // console.log("submitting [%d]:", bytecode, bytecode.length % 2);
      setExecuting(true);
    } else {
      setExecuting(false);
    }
  };

  const [evmResults, setEvmResults] = useState<vEVMState>();
  const returnEvmResults = (results: vEVMState) => {
    setEvmResults(results);
    setExecuting(false);
    if (results) {
      checkAnswer(results);
    }
  };

  const [update, triggerUpdate] = useState(0);

  const checkAndExecute = (input: string) => {
    // console.log("input: [%d]", input, input.length);
    setTextCode(input);
    if (input) {
      if (input.length % 2 == 0) {
        triggerUpdate(update + 1);
      }
    }
  };

  const updateResult = useMemo(() => sendParamters(), [update]);
  const puzzleIdResult = useMemo(() => setPuzzle(), [puzzleId]);

  return (
    <>
      <header>
        <div className="header">
          <h1>NotYourKeys</h1>
        </div>
      </header>
      <div className="main">
        <div className="columns">
          <div className="col left">
            <button
              className={
                activePuzzle === 1
                  ? "button-puzzle-select active"
                  : "button-puzzle-select"
              }
              onClick={(e) => setPuzzleId(1)}
            >
              Lesson: EVM
            </button>
            <button
              className={
                activePuzzle === 2
                  ? "button-puzzle-select active"
                  : "button-puzzle-select"
              }
              onClick={(e) => setPuzzleId(2)}
            >
              Lesson: Stack
            </button>
            <button
              className={
                activePuzzle === 3
                  ? "button-puzzle-select active"
                  : "button-puzzle-select"
              }
              onClick={(e) => setPuzzleId(3)}
            >
              OPCODE: PUSH
            </button>
            <button
              className={
                activePuzzle === 4
                  ? "button-puzzle-select active"
                  : "button-puzzle-select"
              }
              onClick={(e) => setPuzzleId(4)}
            >
              Lesson: Memory
            </button>
            <button
              className={
                activePuzzle === 5
                  ? "button-puzzle-select active"
                  : "button-puzzle-select"
              }
              onClick={(e) => setPuzzleId(5)}
            >
              OPCODE: MSTORE
            </button>
            <button
              className={
                activePuzzle === 6
                  ? "button-puzzle-select active"
                  : "button-puzzle-select"
              }
              onClick={(e) => setPuzzleId(6)}
            >
              Lesson: Storage
            </button>
            <button
              className={
                activePuzzle === 7
                  ? "button-puzzle-select active"
                  : "button-puzzle-select"
              }
              onClick={(e) => setPuzzleId(7)}
            >
              OPCODE: SSTORE
            </button>
            <button
              className={
                activePuzzle === 8
                  ? "button-puzzle-select active"
                  : "button-puzzle-select"
              }
              onClick={(e) => setPuzzleId(8)}
            >
              QUIZ
            </button>
            <button
              className={
                activePuzzle === 9
                  ? "button-puzzle-select active"
                  : "button-puzzle-select"
              }
              onClick={(e) => setPuzzleId(9)}
            >
              Lesson: Math
            </button>
            <button
              className={
                activePuzzle === 10
                  ? "button-puzzle-select active"
                  : "button-puzzle-select"
              }
              onClick={(e) => setPuzzleId(10)}
            >
              Opcode: Math
            </button>
          </div>
          {puzzleId == 3 ||
          puzzleId == 5 ||
          puzzleId == 7 ||
          puzzleId == 8 ||
          puzzleId == 10 ? (
            <div className="col center">
              <div className="box">{puzzleDesc}</div>
              <textarea
                autoFocus
                className="textarea-terminal"
                value={textCode}
                placeholder="type your bytecode answer here"
                onChange={(e) => checkAndExecute(e.target.value)}
              />
              {executing ? (
                <button className="button-execute on">Executing...</button>
              ) : (
                <button className="button-waiting on">Awaiting Input...</button>
              )}
              {bytecode && (
                <EVMResults
                  bytecode={bytecode}
                  data={data}
                  value={value}
                  returnEvmResults={returnEvmResults}
                />
              )}
              {puzzleStatus && (
                <div className="answer-box">
                  SUCCESS.
                  <br></br>
                  <br></br>
                  YOU DID IT.
                </div>
              )}
            </div>
          ) : (
            <div className="col center">
              <div className="box">{puzzleDesc}</div>
            </div>
          )}

          <div className="col right">
            <Stack stack={evmResults?.stack} />
            <Memory memory={evmResults?.mem} />
            <Storage
              storageData={evmResults?.storageData}
              storageKey={evmResults?.storageKey}
            />
            {/* {evmResults?.stack && evmResults?.stack.length > 0 && (
              <Stack stack={evmResults.stack} />
            )}
            {evmResults?.mem && evmResults?.mem.length > 2 && (
              <Memory memory={evmResults.mem} />
            )}
            {evmResults?.storageData &&
              evmResults?.storageKey &&
              evmResults?.storageData.length > 0 &&
              evmResults?.storageKey.length > 0 && (
                <Storage
                  storageData={evmResults?.storageData}
                  storageKey={evmResults?.storageKey}
                />
              )} */}
          </div>
        </div>
      </div>

      <footer>
        <a href="https://vevm-demo.vercel.app" target={"_blank"}>
          https://vevm-demo.vercel.app
        </a>
        <a href="https://www.evm.codes" target={"_blank"}>
          https://www.evm.codes
        </a>
        <a
          href="https://ethereum.github.io/execution-specs/autoapi/ethereum/shanghai/vm"
          target={"_blank"}
        >
          https://ethereum.github.io/execution-specs/autoapi/ethereum/shanghai/vm
        </a>
        <a href="https://etherscan.io" target={"_blank"}>
          https://etherscan.io
        </a>
        <a href="https://github.com/kethcode/vEVM" target={"_blank"}>
          https://github.com/kethcode/vEVM
        </a>
        <a href="https://www.4byte.directory" target={"_blank"}>
          https://www.4byte.directory
        </a>
        <a
          href="https://emn178.github.io/online-tools/keccak_256.html"
          target={"_blank"}
        >
          https://emn178.github.io/online-tools/keccak_256.html
        </a>
        <a
          href="https://www.browserling.com/tools/utc-to-unix"
          target={"_blank"}
        >
          https://www.browserling.com/tools/utc-to-unix
        </a>
      </footer>
      <Analytics />
    </>
  );
}
