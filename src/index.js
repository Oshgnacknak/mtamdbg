import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import parse from './parse';
import MTAM from './mtam';

const CODE = `
0000: CALL          18[CB]    ; main
0001: HALT                   

fibRec:
0002: LOAD   (1)    -1[LB]    ; n
0003: LOADL         0        
0004: gtI                    
0005: JUMPIF (0)    17[CB]   
0006: LOAD   (1)    -3[LB]    ; a
0007: printInt                ; printInt
0008: printLine               ; printLine
0009: LOAD   (1)    -2[LB]    ; b
000a: LOAD   (1)    -3[LB]    ; a
000b: LOAD   (1)    -2[LB]    ; b
000c: addI                   
000d: LOAD   (1)    -1[LB]    ; n
000e: LOADL         1        
000f: subI                   
0010: CALL          2[CB]     ; fibRec
0011: RETURN (0)    3        

main:
0012: LOADL         0        
0013: LOADL         1        
0014: LOADL         20       
0015: CALL          2[CB]     ; fibRec
0016: RETURN (0)    0        
`;

const mtam = window.mtam = new MTAM(parse(CODE));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App mtam={mtam} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
