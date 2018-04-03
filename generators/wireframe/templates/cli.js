#!/usr/bin/env node
'use strict';
const meow = require('meow');
const { <%= name %> } = require('.');

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

<%= name %>(cli.input[0], cli.flags);
