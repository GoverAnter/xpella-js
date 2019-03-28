# Xpella parser

## Motivations

I needed to have a language that could be run on multiple platform (including browser), and that was completely isolated from its parent environment.

The only solution that matched these criterias was a custom language.

## What it does

Like a lot of other languages, it parses a source code input to create an AST (Abstract Syntax Tree).
This AST could then be stored to be run anywhere. It is transformed to binary using messagepack with custom types, which kills its size (compared to plain JSON).

## State of the project

The parser is about 90% finished, what remains to do is loops, and handle some edge cases in the syntax.

Runtime is nowhere near done !
The main problem is the maximum call stack size of many languages, including Javascript.
Either it needs a stack guard, but this pattern is inefficient, or it needs to be transpiled, but that last point is not best due to the needed ability to run it on multiple host languages.

## How to test it

First, install dependencies on both the main project (this repository's folder), and the demo (in the `demo` folder).

Go to the `demo` folder, and type `npm run serve`.
It will create a dev server, you can then browse the demo at `http://localhost:8080`.

The demo is based on Vue.js (project made with vue-cli 3).

## Licence

As it is more a concept than something useful, there is no licence for now.
If i release something useful, or at least fully working, i will licence it under the MIT licence.