

class Grammar {
    // array of strings representing current grammar
    grammar : string[] = new Array();
    // start squence of the grammar
    axiom: string;
    // number of iterations of grammar
    depth: number;
    branchMap: string[] = new Array();

    constructor(a: string, d: number) {
        this.axiom = a;
        this.depth = d;
        this.branchMap.push("b[+b]b[-b]");
        this.branchMap.push("-[+b]b[-b]");
        this.branchMap.push("[-^b[++f]b[-f]b]");
        this.branchMap.push("b[-b]b[+b]");
        this.branchMap.push("+^[-b]b[+b]");
        this.branchMap.push("[+b[--fb]b[+f]b]");
        // initialize grammar array
        for(let i = 0; i < this.axiom.length; i++) {
            this.grammar.push(this.axiom[i]);
        }
        this.expand();
    }

    expand() {
        for(let d = 0; d < this.depth; d++) {
            var newGrammar = new Array();
            for(let i = 0; i < this.grammar.length; i++) {
                // concatenate result of string mapping to the new grammar
                if(this.grammar[i] == "[" || this.grammar[i] == "]") {
                    newGrammar.push(this.grammar[i]);
                } else {
                    newGrammar = newGrammar.concat(this.expandString(this.grammar[i]));
                }
            }
            this.grammar = newGrammar;
        }
    }

    // TODO: add probability mappings
    expandString(s: string) : string[] {
        let rand = Math.random();
        let rule: string = " ";
        if(s == "-") {
            return ["-","b", "+"];
        } else if (s == "b") { // branch
            rand *= this.branchMap.length;
            rule = this.branchMap[Math.floor(rand)];
        } else if (s == '+') {
            return ["-"];
        } else if (s == "") {

        } else if (s == "f") { // leaf or flower
            return ["f"];
        }
        // turn string into string[] and return
        let array = [];
        for(let i = 0; i < rule.length; i++) {
            array.push(rule.charAt(i));
        }
        return array;
    }

    getGrammar(): string[] {
        return  this.grammar;
    }

}

export default Grammar;