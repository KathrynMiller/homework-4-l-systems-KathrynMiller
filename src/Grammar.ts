

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
        this.branchMap.push("[+>fb[+>f]b[-f]f]");
        this.branchMap.push("[+>f[+>f]b[+>f]b[+>f]b]");
        this.branchMap.push("[*-fbb[.-f]fb]");
        this.branchMap.push("[*-fb[.-f]b[*-f]b[*>f]]");
        this.branchMap.push("[*-fb[.-f]b[*-f]b[*+f]]");
        this.branchMap.push("[-*fb[-*f]b]");
        this.branchMap.push("[-*f[-*f]b[-*f]b]");
        this.branchMap.push("[+<fb[--.f]fb]");
        this.branchMap.push("[+*fb[-+.f]fb]");
        this.branchMap.push("[*-fbf*f[.+f]fb]");
        this.branchMap.push("[*+fbf[.+f][*-f]b[.+f]]");
        this.branchMap.push("[*-fb[.-f]bf[*-f].b[*+f]]");
        // leaf expansions
        this.leafMap.push("[+f]");
        this.leafMap.push("[.f]");
        this.leafMap.push("[-f]");
        this.leafMap.push("[*f]");
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
        if (s == "b") { // branch
            rand *= this.branchMap.length;
            rule = this.branchMap[Math.floor(rand)];
        } else if (s == "f") { // leaf or flower
            rand *= this.leafMap.length;
            rule = this.leafMap[Math.floor(rand)];
        } else if (s == "t") { // trunk, just pass down linearly
            return ["t"];
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