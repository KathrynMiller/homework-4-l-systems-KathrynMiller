

class Grammar {
    // array of strings representing current grammar
    grammar : string[] = new Array();
    // start squence of the grammar
    axiom: string;
    // number of iterations of grammar
    depth: number;
    branchMap: string[] = new Array();
    leafMap: string[] = new Array();

    constructor(a: string, d: number) {
        this.axiom = a;
        this.depth = d;
        // branch expansions (mostly just slightly changed reiterations)
          this.branchMap.push("+bf[+b>f]");
          this.branchMap.push("-bf[+b]");
          this.branchMap.push("*b<f[+>f]");
          this.branchMap.push(".bf[*bf]");

        // initialize grammar array
        this.grammar = this.grammar.concat(this.axiom.split(""));
        this.expand();
    }

    expand() {
        for(let d = 0; d < this.depth; d++) {
            var newGrammar = new Array();
            for(let i = 0; i < this.grammar.length; i++) {
                // concatenate result of string mapping to the new grammar
                if(this.grammar[i] == "[" || this.grammar[i] == "]") {
                    newGrammar = newGrammar.concat([this.grammar[i]]);
                } else {
                    newGrammar = newGrammar.concat(this.expandString(this.grammar[i]));
                }
            }
            this.grammar = newGrammar;
        }
    }

    expandString(s: string) : string[] {
        let rand = Math.random();
        let rule: string = "";
        if (s == "b") { // branch
            rand *= this.branchMap.length;
            rule = this.branchMap[Math.floor(rand)];
        } else if (s == "t") { // trunk, just pass down linearly
            return ["t"];
        }
        return rule.split("");
    }

    getGrammar(): string[] {
        return this.grammar;
    }

}

export default Grammar;