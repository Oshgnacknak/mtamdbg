import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import parse from './parse';

const CODE = `
0000: CALL          2[CB]     ; main
0001: HALT

main:
0002: PUSH          1         ; x
0003: PUSH          1         ; c
0004: LOADL         0
0005: STORE  (1)    2[LB]
0006: LOADL         0
0007: JUMPIF (0)    14[CB]
0008: LOADL         0
0009: printString             ; printString
000a: printLine               ; printLine
000b: LOAD   (1)    2[LB]     ; x
000c: STORE  (1)    2[LB]
000d: JUMP          6[CB]
000e: LOADL         1
000f: printString             ; printString
0010: LOAD   (1)    3[LB]     ; c
0011: printInt                ; printInt
0012: LOADL         2
0013: printString             ; printString
0014: printLine               ; printLine
0015: RETURN (0)    0
`;

console.table(parse(CODE));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
