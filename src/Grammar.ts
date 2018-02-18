

class Grammar {
    // array of strings representing current grammar
    grammar : string[] = new Array();
    // start squence of the grammar
    axiom: string;
    // number of iterations of grammar
    depth: number;

    constructor(a: string, d: number) {
        this.axiom = a;
        this.depth = d;
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
        if(s == "-") {
            return ["-","b", "+"];
        } else if (s == "b") {
            return ["b", "[", "+", "b", "]", "b", "[", "-", "b", "]", "b"];
        } else if (s == '+') {
            return ["-"];
        }
    }

    getGrammar(): string[] {
        return  this.grammar;
    }

}

export default Grammar;