function isDigit(c) {
    return ('0' <= c && c <= '9');
}

function isHexDigit(c) {
    return isDigit(c)
        || ('a' <= c && c <= 'f')
        || ('A' <= c && c <= 'F');
}

function isWhitespace(c) {
    return /\s/.test(c);
}

function isAlpha(c) {
    return ('a' <= c && c <= 'z')
        || ('A' <= c && c <= 'Z');
}

function isAlphaNumeric(c) {
    return ('a' <= c && c <= 'z')
        || ('A' <= c && c <= 'Z')
        || ('0' <= c && c <= '9');
}

class Lexer {
    constructor(source) {
        this.source = source;
        this.index = 0;
    }

    peek() {
        return this.source[this.index];
    }

    read() {
        return this.source[this.index++];
    }

    accept(c) {
        const d = this.read();
        if (d !== c) {
            throw new Error(`Unexpected character '${d}', expected '${c}'`)
        }
    }

    eof() {
        return this.index >= this.source.length;
    }

    test(pred) {
        const c = this.peek();
        return pred(c);
    }

    takeWhile(pred) {
        let res = '';

        while (!this.eof()) {
            const c = this.peek();

            if (pred(c)) {
                res += this.read();
            } else {
                break;
            }
        }

        return res;
    }

    skipWhile(pred) {
        while (this.test(pred)) {
            this.index++;
        }
    }
}

class Parser {
    constructor(source) {
        this.lexer = new Lexer(source);
        this.labels = [];
    }

    parse() {
        const instructions = [];

        while (!this.lexer.eof()) {
            this.parseLabel();

            this.skipWhitespace();
            if (this.lexer.test(isAlpha)) {
                instructions.push(this.parseInstruction());
            }
        }

        return instructions;
    }

    parseLabel() {
        this.skipWhitespace();
        const label = this.lexer.takeWhile(isAlphaNumeric);

        this.skipWhitespace();
        this.lexer.accept(':');

        this.labels.push(label);
    }

    parseInstruction() {
        let register = null;
        let offset = null;
        let size = null;

        this.skipWhitespace();
        const opcode = this.lexer.takeWhile(isAlpha);

        switch(opcode) {
        case 'LOAD':
        case 'LOADI':
        case 'STORE':
        case 'STOREI':
        case 'RETURN':
        case 'POP':
        case 'JUMPIF':
            size = this.parseSize();
            break;
        default:
            break;
        }

        switch(opcode) {
        case 'LOAD':
        case 'LOADA':
        case 'LOADL':
        case 'STORE':
        case 'CALL':
        case 'RETURN':
        case 'PUSH':
        case 'POP':
        case 'JUMP':
        case 'JUMPIF':
            offset = this.parseOffset();
            break;
        default:
            break;
        }

        switch(opcode) {
        case 'LOAD':
        case 'LOADA':
        case 'STORE':
        case 'CALL':
        case 'JUMP':
        case 'JUMPIF':
            register = this.parseRegister();
            break;
        default:
            break;
        }

        this.skipWhitespace();
        if (this.lexer.peek() === ';') {
            this.parseComment();
        }

        const labels = this.labels.splice(0, this.labels.length);
        return { opcode, size, offset, register, labels };
    }

    parseSize() {
        this.skipWhitespace();
        this.lexer.accept('(');
        this.skipWhitespace();
        const size = this.lexer.takeWhile(isDigit);
        this.skipWhitespace();
        this.lexer.accept(')');
        return parseInt(size);
    }

    parseOffset() {
        this.skipWhitespace();

        let sign = 1;
        if (this.lexer.peek() === '-') {
            this.lexer.read();
            sign = -1;
        }

        this.skipWhitespace();
        const offset = this.lexer.takeWhile(isDigit);

        return sign * parseInt(offset);
    }

    parseRegister() {
        this.skipWhitespace();
        this.lexer.accept('[');

        const reg = this.lexer.takeWhile(isAlpha);
        console.assert(reg !== '');

        this.skipWhitespace();
        this.lexer.accept(']');

        return reg;
    }

    parseAddress() {
        this.skipWhitespace();
        const addr = this.lexer.takeWhile(isHexDigit);
        console.assert(addr !== '');
        return parseInt('0x' + addr);
    }

    parseComment() {
        this.lexer.skipWhile(c => c !== '\n');
        this.lexer.read();
    }

    skipWhitespace() {
        this.lexer.skipWhile(isWhitespace);
    }
}

export default function parse(source) {
    const parser = new Parser(source);
    return parser.parse();
}
