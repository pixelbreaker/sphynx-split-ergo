# openscad-ts
openscad fully "typed"
wrapper for open scad to generate source files.  Main goal is solve some issues I have with openscad language structure.

1.  IDE assistance - as a fully typed API, vscode will be able to guide proper usage and documentation on each method will show up instantly.
2.  fluent API, i kept all the keywords the same as original language except i made it fluent as well. i.e.
3.  benefit from javascript's first class functions and module system.
4.  statically including Kurt Hutten's round-anything library
https://github.com/Irev-Dev/Round-Anything/
I had implemented the same thing using vector math and unions - which i felt was slightly more elegant.  However his implementation is more practical, by generationg a list of points - this list can further be leveraged by the extrude rounded functions.

# usage
1. check out this project
2. npm install
3. npm watch
4. start editing files under projects, scad files will output into "target" folder
5. open openscad on the generated file
      * turn on "Automatic review and preview" mode
      * changes to the projects files will automatically propagate to openscad