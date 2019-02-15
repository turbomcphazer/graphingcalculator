class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

function reportError() {
    return error;
}

function parseFormula(s) {
    var tokens = preparse(s);

    if (tokens.length == 0) {
        error = "Parsing error";
        return null;
    }
    else {
        tokens = convertToRPN(tokens);
        return tokens;
    }
}

function doUnaryOp(op, value) {

    switch(op) {
        case "sin":
            return Math.sin(value);
        case "cos":
            return Math.cos(value);
        case "tan":
            return Math.tan(value);
        case "asin":
            try {
                result = Math.asin(value);
            }
            catch(err) {
                result = null;
            }
            return result;
        case "acos":
            try {
                result = Math.acos(value);
            }
            catch(err) {
                result = null;
            }
            return result;
        case "atan":
            try {
                result = Math.atan(value);
            }
            catch(err) {
                result = null;
            }
            return result;
        case "sinh":
            return Math.sinh(value)
        case "cosh":
            return Math.cosh(value)
        case "tanh":
            return Math.tanh(value)
        case "abs":
            return Math.abs(value)
        case "sqrt":
            try {
                result = Math.sqrt(value);
            }
            catch(err) {
                result = null;
            }
            return result;
        case "log":
            try {
                result = Math.log(value);
            }
            catch(err) {
                result = null;
            }
            return result;
        case "logten":
            try {
                result = Math.log10(value);
            }
            catch(err) {
                result = null;
            }
            return result;
        case "int":
            return int(value);
        case "ceil":
            return Math.ceil(value);
        case "floor":
            return Math.floor(value);
        case "sign":
            if (value == 0) {
                return 0
            }
            else {
                return value / Math.abs(value);
            }
    }

    error = "Unrecognized function";
    return null;
}

function doBinaryOp(op, val1, val2) {
    switch (op) {
    case "+":
        try {
            result = val1 + val2;
        }
        catch(err) {
            result = null;
        }
        return result;
    case "-":
        try {
            result = val2 - val1;
        }
        catch(err) {
            result = null;
        }
        return result;
    case "*":
        try {
            result = val1 * val2
        }
        catch(err) {
            result = null;
        }
        return result;
    case "/":
        if (val1 != 0) {
            try {
                result = val2 / val1;
            }
            catch(err) {
                result = None;
            }
            return result;
        }
        else {
            print("Divide by zero");
            return val2;
        }
    case "^":
        try {
            result = Math.pow(val2, val1);
        }
        catch(err) {
            result = None;
        }
        return result;
    case "%":
        try {
            if (val2 < 0) {
                val2 = val1 - Math.abs(val2) % val1;
            }
            result = val2 % val1;
        }
        catch(err) {
            result = None;
        }
        return result;
    }
}

function precedence(val) {
    if (inset(val, "+-"))
        return 0;
    if (inset(val, "*/%"))
        return 1;
    if (inset(val, "^"))
        return 2;
    return 3;
}

function associativity(val) {
    if (inset(val, "^")) {
        return RIGHT
    }
    return LEFT
}

function operandCount(val) {
    if (inset(val, "+-*/%^")) {
        return 2
    }
    return 1
}

function inset(c, set) {
    return (set.includes(c));
}

function isdigit(c) {
    return "0123456789".includes(c);
}

function isalpha(c) {
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".includes(c);
}

// return a list of tokens
function preparse(s) {

    s = s.replace(" ","");
    var tokens = [];
    var index = 0;
    var curindex = 0;

    while (index < s.length) {

        curindex = index;

        // parse operators
        if (index < s.length) {
            if (inset(s.charAt(index), "+-*/^%")) {
                if (!(s.charAt(index) == "-" && (tokens == [] || tokens[tokens.length-1].type == "operator" || tokens[tokens.length-1].value == "("))) {
                    tokens.push(new Token("operator", s.charAt(index)));
                    index += 1;
                }
            }
        }

        // parse parens
        if (index < s.length) {
            if (inset(s.charAt(index), "()")) {
                if (tokens.length > 0 && tokens[tokens.length-1].type == "number") { // implicit multiplication
                    tokens.push(new Token("operator", "*"));
                }
                tokens.push(new Token("paren", s.charAt(index)));
                index += 1;
            }
        }

        // parse numbers
        var numberbuffer = "";
        while (index < s.length && (isdigit(s.charAt(index)) || s.charAt(index) == "." || (s.charAt(index) == "-" && numberbuffer == "" && (tokens == [] || tokens[tokens.length-1].type == "operator" || tokens[tokens.length-1].value == "(")))) {
            numberbuffer += s.charAt(index);
            index += 1;
        }
        if (numberbuffer != "") {
            try {
                tokens.push(new Token("number", parseFloat(numberbuffer)));
            }
            catch(err) {
                error = "Parsing error";
            }
        }

        // parse letters
        var letterbuffer = "";
        while (index < s.length && isalpha(s.charAt(index))) {
            letterbuffer += s.charAt(index);
            index += 1;
        }
        if (letterbuffer != "") {
            if (letterbuffer.length == 1) {
                if (tokens.length > 0 && tokens[tokens.length-1].type == "number") { // implicit multiplication
                    tokens.push(new Token("operator", "*"));
                }
                tokens.push(new Token("variable", letterbuffer));
            }
            else {
                tokens.push(new Token("function", letterbuffer));
            }
        }

        if (index == curindex) {
            //console.log("Warning: unrecognized character " + s.charAt(index).toString());
            index += 1;
        }
    }

    tokens.forEach(function(token) {
       console.log(token.type + " " + token.value);
    });

    return tokens;
}

function convertToRPN(tokens) {

    var outQ = [];
    var opStack = [];

    tokens.forEach(function(token) {
        if ((token.type == "number") || (token.type == "variable")) {
            outQ.push(new Token(token.type, token.value));
        }
        else if (token.type == "function") {
            opStack.push(new Token(token.type, token.value));
        }
        else if (token.type == "operator") {
            while (opStack.length > 0 && opStack[opStack.length-1].value != "(" &&
            (opStack[opStack.length-1].type == "function" || (opStack[opStack.length-1].type == "operator" && precedence(opStack[opStack.length-1].value) > precedence(token.value))
            || (opStack[opStack.length-1].type == "operator" && precedence(opStack[opStack.length-1].value) == precedence(token.value) && associativity(opStack[opStack.length-1].value) == LEFT))) {
                outQ.push(opStack.pop());
            }
            opStack.push(new Token(token.type, token.value));
        }
        else if (token.value == "(") {
            opStack.push(new Token(token.type, token.value));
        }
        else if (token.value == ")") {
            while (opStack.length > 0 && opStack[opStack.length-1].value != "(") {
                outQ.push(opStack.pop());
            }
            if (opStack.length == 0) { // didn't find a (
                error = "Mismatched parenthesis";
                return null;
            }
            opStack.pop(); // otherwise get rid of that (
        }
    });

    while (opStack.length > 0) {
        if (opStack[opStack.length-1].value == "(") {
            error = "Mismatched parenthesis";
            return null;
        }
        outQ.push(opStack.pop());
    }

    error = "";
    return outQ;
}

function evaluate(tokens, x) {

    var numStack = [];
    if (error == "") {
        tokens.forEach(function(token) {
            if (token.type == "number") {
                numStack.push(token.value);
            }
            if (token.type == "variable") {
                token.value = x;
                numStack.push(token.value);
            }
            if (token.type == "function" || token.type == "operator") {
                if (operandCount(token.value) == 1) {
                    if (numStack.length > 0) {
                        val = numStack.pop();
                        result = doUnaryOp(token.value, val);
                        if (error != "") {
                            return null;
                        }
                        numStack.push(result);
                    }
                    else {
                        error = "Missing operand";
                        return null;
                    }
                }
                else {
                    if (numStack.length > 1) {
                        val1 = numStack.pop();
                        val2 = numStack.pop();
                        result = doBinaryOp(token.value, val1, val2);
                        numStack.push(result);
                    }
                    else {
                        error = "Missing operand";
                        return null;
                    }
                }
            }
        });
    }

    if (numStack.length > 0) {
        error = "";
        return numStack[0];
    }
    else {
        return null;
    }
}

function checkFormula(s) {

    var xsamplerate = 1000;
    var val = [];

    x = -xsize;

    tokens = parseFormula(s);

    evaluate(tokens, 1); // test evaluation to update error codes

    if (tokens != null) {
        while (x < xsize) {
            val.push(evaluate(tokens, x));
            x += xsize / xsamplerate;
        }
    }

    if (val.length == 0 || reportError() != "") {
        return false;
    }

    return val;

}