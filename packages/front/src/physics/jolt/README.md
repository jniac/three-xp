# Jolt Patch

Jolt WASM prevent "node" error by checking for the existence of "process": 
```
...,da="object"==typeof process...
```
but in react / Next project the process may exist without being a node process.
So Jolt prevents the app to be built, in devn or prod, or both.
