# openscad-ts
openscad fully "typed"
wrapper for open scad to generate source files.  Main goal is solve some issues I have with openscad language structure.

1.  IDE assistance - as a fully typed API, vscode will be able to guide proper usage and documentation on each method will show up instantly.
2.  fluent API, i kept all the keywords the same as original language except i made it fluent as well. i.e.
3.  benefit from javascript's first class functions and module system.

# usage
1. check out this project
2. npm install
3. npm watch
4. start editing files under projects, scad files will output into "target" folder
5. open openscad on the generated file
      * turn on "Automatic review and preview" mode
      * changes to the projects files will automatically propagate to openscad