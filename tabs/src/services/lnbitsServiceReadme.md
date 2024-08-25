## Symbolic Link

This is a symbolic link to the `lnbitsServices.ts` in the parent project.

## Link creation

This should be automatically created when you run `npm install` since we have added:

```
  "scripts": {
    "postinstall": "node create-symlink.js"
  },
```

See `create-symlink.js`
