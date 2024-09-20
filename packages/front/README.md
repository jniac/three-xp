# Front

```
pnpm dev
```

## Important

[.svgrrc](.svgrrc) is f*** necessary since it prevents [SVGO](https://svgo.dev/) 
from optmizing the imported svg, since those svg internal hierarchies are sometimes
used to create animation (eg. feedback).
