#!/usr/bin/env node

import * as meow from 'meow';
import <%= name %> from './';

const cli = meow(
  `
    Usage
      $ <%= name %> <input>

    Options
      --rainbow, -r  Include a rainbow

    Examples
      $ <%= name %> unicorns --rainbow
      🌈 unicorns 🌈
`,
  {
    flags: {
      rainbow: {
        type: 'boolean',
        alias: 'r',
      },
    },
  }
);

console.log(cli.input[0], cli.flags);
<%= name %>();
