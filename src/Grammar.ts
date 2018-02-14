

class Grammar {
    // array of strings representing current grammar
    grammar : string[] = new Array();
    // start squence of the grammar
    axiom: string = "AB";
    // number of iterations of grammar
    depth: number = 5;

    constructor() {
        // initialize grammar array
        for(let i = 0; i < this.axiom.length; i++) {
            this.grammar.push(this.axiom[i]);
        }
    }

    expand() {
        for(let d = 0; d < this.depth; d++) {
            var newGrammar = new Array();
            for(let i = 0; i < this.grammar.length; i++) {
                // concatenate result of string mapping to the new grammar
                if(this.grammar[i] == "[" || this.grammar[i] == "]") {
                    newGrammar.push(this.grammar[i]);
                } else {
                    newGrammar.concat(this.mapString(this.grammar[i]));
                }
            }
            this.grammar = newGrammar;
        }
    }

    mapString(s: string) : string[] {
        if(s == "a") {
            return ["a","b", "a"];
        } else if (s == "b") {
            return ["a"];
        }
    }

    getGrammar(): string[] {
        return  this.grammar;
    }

}