export default class MTAM {
    constructor(instructions) {
        this.instructions = instructions;
        this.lb = 0;
        this.cp = 0;
        this.stack = [];
        this.output = '';
    }

    opcodes = {
        LOAD: inst => {
            const addr = this.getAddress(inst);
            const data = this.read(addr, inst.size);
            this.push(data);
        },
        LOADL: inst => {
            this.stack.push(inst.offset);
        },
        STORE: inst => {
            const data = this.pop(inst.size);
            const addr = this.getAddress(inst);
            this.write(addr, data);
        },
        CALL: inst => {
            const st = this.st;
            this.stack.push(this.lb);
            this.stack.push(this.cp+1);
            this.lb = st
            return this.getAddress(inst);
        },
        RETURN: inst => {
            const res = this.pop(inst.size);
            const cp = this.stack.pop();
            this.lb = this.stack.pop();
            this.pop(inst.offset);
            this.push(res);
            return cp;
        },
        PUSH: inst => {
            for (let i = 0; i < inst.offset; i++) {
                this.stack.push(0);
            }
        },
        JUMP: inst => {
            return this.getAddress(inst);
        },
        JUMPIF: inst => {
            const addr = this.getAddress(inst);
            const cond = this.stack.pop();
            if (cond === inst.size) {
                return addr;
            }
        },
        HALT: inst => {
            return this.halt;
        },
        negI: this.unaryPrimitive(x => -x),
        addI: this.binaryPrimitive((x, y) => x + y),
        subI: this.binaryPrimitive((x, y) => x - y),
        mulI: this.binaryPrimitive((x, y) => x * y),
        divI: this.binaryPrimitive((x, y) => Math.floor(x / y)),
        modI: this.binaryPrimitive((x, y) => x % y),
        eqI: this.binaryPrimitive((x, y) => x === y),
        neI: this.binaryPrimitive((x, y) => x !== y),
        ltI: this.binaryPrimitive((x, y) => x < y),
        leI: this.binaryPrimitive((x, y) => x <= y),
        gtI: this.binaryPrimitive((x, y) => x > y),
        geI: this.binaryPrimitive((x, y) => x >= y),
        printInt: inst => {
            const x = this.stack.pop();
            this.print(String(x));
        },
        printLine: inst => {
            this.print('\n');
        }
    }

    unaryPrimitive(f) {
        return () => {
            const x = this.stack.pop();
            const y = f(x);
            this.stack.push(+y);
        };
    }

    binaryPrimitive(f) {
        return () => {
            const y = this.stack.pop();
            const x = this.stack.pop();
            const z = f(x, y);
            this.stack.push(+z);
        };
    }

    get cb() { return 0; }
    get ct() { return this.instructions.length; }
    get pb() { return 0xffff; } // Unless these are actuall addresses in the code, we will cheat here
    get pt() { return this.pb + this.opcodes.length - 15; }
    get sb() { return 0; }
    get st() { return this.stack.length; }

    isRunning() {
        return this.cp >= 0;
    }

    halt() {
        this.cp = -1;
    }

    step() {
        const inst = this.instructions[this.cp];

        const opcode = this.opcodes[inst.opcode];
        if (!opcode) {
            throw new Error(`Opcode ${inst.opcode} is not implemented yet`);
        }

        const cp = opcode(inst);
        this.cp = cp !== undefined ? cp : this.cp+1;
    }

    write(addr, data) {
        for (let i = 0; i < data.length; i++) {
            this.stack[addr + i] = data[i];
        }
    }

    read(addr, size) {
        return this.stack.slice(addr, addr + size);
    }

    getAddress(inst) {
        const reg = this[inst.register.toLowerCase()];
        return reg + inst.offset;
    }

    push(data) {
        for (let i = 0; i < data.length; i++) {
            this.stack.push(data[i]);
        }
    }

    pop(size) {
        return this.stack.splice(this.stack.length - size, this.stack.length);
    }
    
    print(string) {
        this.output += string;
    }
}
