# Xpella parser

## Motivations

I needed to have a language that could be run on multiple platform (including browser), and that was completely isolated from its parent environment.

The only solution that matched these criterias was a custom language.

Another important point of this language was to make it possible to be run with the same context, like a stateful program, with a one-time initialization.
The idea behind that was to create a "cheap" (computational and database-wise) FaaS (Function as a Service) by only reusing the same context.

## What it does

Like a lot of other languages, it parses a source code input to create an AST (Abstract Syntax Tree).
This AST could then be stored to be run anywhere. It is transformed to binary using messagepack with custom types, which kills its size (compared to plain JSON).

## State of the project

The parser is about 90% finished, what remains to do is loops, and handle some edge cases in the syntax.

Runtime is WIP !
For now, i will do a simple executor oriented runtime, but i may in the future implement transpilers to other (host) languages, if call stack size is really a huge problem.

## How to test it

First, install dependencies on both the main project (this repository's folder), and the demo (in the `demo` folder).

Go to the `demo` folder, and type `npm run serve`.
It will create a dev server, you can then browse the demo at `http://localhost:8080`.

The demo is based on Vue.js (project made with vue-cli 3).

## Licence

As it is more a concept than something useful, there is no licence for now.
If i release something useful, or at least fully working, i will licence it under the MIT licence.