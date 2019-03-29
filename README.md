# Xpella parser

## Motivations

I needed to have a language that could be run on multiple platform (including browser), and that is completely isolated from its parent environment.

The only solution that matched these criterias was a custom language.

Another important point of this language was to make it possible to be run with the same context, like a stateful program, with a one-time initialization.
The idea behind that was to create a "cheap" (computational and database-wise) FaaS (Function as a Service) by only reusing the same context.

## What it does

Like a lot of other languages, it parses a source code input to create an AST (Abstract Syntax Tree).
This AST could then be stored to be run anywhere. It is transformed to binary using messagepack with custom types, which kills its size (compared to plain JSON).

## State of the project

The parser is about 90% finished, what remains to do is loops, and handle some edge cases in the syntax.

Runtime is WIP !
For now, i will do an executor-oriented runtime, but i may in the future implement transpilers to other (host) languages, if call stack size is really a huge problem.

## How to test it

First, install dependencies on both the main project (this repository's folder), and the demo (in the `demo` folder).

Go to the `demo` folder, and type `npm run serve`.
It will create a dev server, you can then browse the demo at `http://localhost:8080`.

The demo is based on Vue.js (project made with vue-cli 3).

## Licence

As it is more a concept than something useful, there is no licence for now.
If i release something useful, or at least fully working, i will licence it under the MIT licence.

## Feature List

Here is the complete list of what should be implemented.
Please be aware that features need to be implemented in the parser AND the runtime.
Order is arbitrary.

- [ ] Expressions :
  - [x] Simple math operations
  - [x] Method call
  - [x] Back operators (--i)
  - [x] Front operators (i++)
  - [x] Operator precedence
  - [x] Literals
  - [ ] Parenthesis
- [ ] Variables :
  - [x] Variable declaration
  - [x] Variable declaration with initialization
  - [x] Variable assignation
  - [ ] unset keyword
  - [x] Modifiers
    - [x] static
    - [x] const
- [ ] Types
  - [x] Type declaration
  - [x] Members
  - [x] Methods
  - [x] Constructors
  - [x] Member/method access
  - [x] Static access
  - [x] Instantiation
  - [x] Modifiers
    - [x] abstract
    - [x] static
    - [x] const (member)
    - [x] const (method, same semantic as c++)
  - [x] Access modifiers (public/private)
  - [ ] Operator overload
  - [ ] Inheritance
  - [ ] Type check/casting
  - [ ] Generics
- [ ] Functions :
  - [x] Declaration
  - [x] Call
  - [x] Parameters
  - [x] Return type
  - [ ] Generics
  - [ ] Anonymous
- [ ] Array type (generics needed)
- [x] Block construct (forced scope)
- [ ] Loops :
  - [ ] While
  - [ ] Do ... While
  - [ ] For
  - [ ] For each
  - [ ] continue keyword
  - [ ] break keyword
- [ ] Conditions :
  - [x] If ... else
  - [ ] Ternary
  - [ ] Switch
- [ ] Exception handling :
  - [ ] Throw keyword
  - [ ] Try ... catch
- [ ] General language features (implemented in the parser but not used for now) :
  - [ ] Comments
  - [ ] Documentation
  - [ ] Annotations