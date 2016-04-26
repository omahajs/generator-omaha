[ESLint](http://eslint.org/) Rules for Security
-------------------------
> Not all lint rules are just for style.  Some address [MITRE](https://cwe.mitre.org/) defined software weaknesses.  *All* promote writing *better* code.

[CWE-95](https://cwe.mitre.org/data/definitions/95) - **Eval is bad**
- [`no-eval`](http://eslint.org/docs/rules/no-eval)
- [`no-implied-eval`](http://eslint.org/docs/rules/no-implied-eval)

[CWE-398](https://cwe.mitre.org/data/definitions/398.html) - **Indicator of Poor Code Quality**
- [`complexity`](http://eslint.org/docs/rules/complexity)
- [`no-unused-vars`](http://eslint.org/docs/rules/no-unused-vars)
- [`max-depth`](http://eslint.org/docs/rules/max-depth)
- [`max-nested-callbacks`](http://eslint.org/docs/rules/max-nested-callbacks)
- [`max-params`](http://eslint.org/docs/rules/max-params)
- [`no-empty`](http://eslint.org/docs/rules/no-empty)
- [`no-unused-vars`](http://eslint.org/docs/rules/no-unused-vars)
- [`strict`](http://eslint.org/docs/rules/strict)
- [`no-unreachable`](http://eslint.org/docs/rules/no-unreachable)

[CWE-407](https://cwe.mitre.org/data/definitions/407.html) - **Algorithmic Complexity**
- [`complexity`](http://eslint.org/docs/rules/complexity)

[CWE-456](https://cwe.mitre.org/data/definitions/456.html) - **Missing Initialization of a Variable**
- [`strict`](http://eslint.org/docs/rules/strict)
- [`no-undef`](http://eslint.org/docs/rules/no-undef)

[CWE-457](https://cwe.mitre.org/data/definitions/457.html) - **Use of Uninitialized Variable**
- [`strict`](http://eslint.org/docs/rules/strict)
- [`no-undef`](http://eslint.org/docs/rules/no-undef)

[CWE-478](https://cwe.mitre.org/data/definitions/478) - **Missing Default Case in Switch Statement**
- [`default-case`](http://eslint.org/docs/rules/default-case)

[CWE-483](https://cwe.mitre.org/data/definitions/483) - **Incorrect Block Delimitation**
- [`curly`](http://eslint.org/docs/rules/curly)

[CWE-484](https://cwe.mitre.org/data/definitions/484) - **Omitted Break Statement in Switch**
- [`no-fallthrough`](http://eslint.org/docs/rules/no-fallthrough)

[CWE-489](https://cwe.mitre.org/data/definitions/489) - **Leftover Debug Code**
- [`no-alert`](http://eslint.org/docs/rules/no-alert)
- [`no-console`](http://eslint.org/docs/rules/no-console)
- [`no-debugger`](http://eslint.org/docs/rules/no-debugger)

[CWE-561](https://cwe.mitre.org/data/definitions/561) - **Dead Code**
- [`no-unreachable`](http://eslint.org/docs/rules/no-unreachable)

[CWE-570](https://cwe.mitre.org/data/definitions/570) - **Expression is Always False**
- [`no-constant-condition`](http://eslint.org/docs/rules/no-constant-condition)

[CWE-571](https://cwe.mitre.org/data/definitions/570) - **Expression is Always True**
- [`no-constant-condition`](http://eslint.org/docs/rules/no-constant-condition)

[CWE-704](https://cwe.mitre.org/data/definitions/704.html) - **Incorrect Type Conversion or Cast**
- [`eqeqeq`](http://eslint.org/docs/rules/eqeqeq)
