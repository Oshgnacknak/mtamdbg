import React, { useReducer } from 'react';
import './App.css';

function App({ mtam }) {
    const [,forceUpdate] = useReducer(x => x + 1, 0);

    function step() {
        if (mtam.isRunning()) {
            mtam.step();
            forceUpdate();
        }
    }

    function renderInstruction(inst, index) {
        return (
            <li
                key={index}
                className={index === mtam.cp ? 'current-instruction' : ''}
                value={index}
            >
                {inst.opcode}
                {inst.size !== null ? ` (${inst.size})` : undefined}
                {inst.offset !== null ? ` ${inst.offset}` : undefined}
                {inst.register !== null ? `[${inst.register}]` : undefined}
            </li>
        );
    }

    return (
        <div className='App'>
            <p><button onClick={step}>Step</button></p>
            <h1>Registers</h1>
            <p>
                CB: {mtam.cb},
                CT: {mtam.ct},
                BP: {mtam.bp},
                PT: {mtam.pt},
                SB: {mtam.sb},
                ST: {mtam.st},
                LB: {mtam.lb},
                CP: {mtam.cp}
            </p>
            <h1>Code</h1>
            <ol>
                {mtam.instructions.map(renderInstruction)}
            </ol>
            <h1>Output</h1>
            <pre>{mtam.output}</pre>
        </div>
    );
}

export default App;
