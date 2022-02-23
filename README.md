# Description
This repo contains a small project that demonstrates a bug in TypeORM.
The issue occurs on any sql driver when using a column transformer in conjunction
with relation loading. The value passed to the sql template is not being run through
the transformers first like it ought to be.

While it does not crash here because SQLlite never crashes, this same example
wouldn't even syntax check in sticter engines and column types. e.g. using a UUID
column in postgres.

# How to run
1. `npm install`
2. `npm start`

Observe the _parameters_ printed in the debug for the final select.
They are being passed to the sql driver raw, without having been transformed.

The parameter value is `'"1"'` instead of the expected `1` because the transformer
was not executed on the value.
