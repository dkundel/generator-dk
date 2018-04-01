<% if (type === 'module') { %>
[![npm](https://img.shields.io/npm/v/<%= moduleName %>.svg?style=flat-square)](https://npmjs.com/packages/<%= moduleName %>) [![npm](https://img.shields.io/npm/dt/<%= moduleName %>.svg?style=flat-square)](https://npmjs.com/packages/<%= moduleName %>) <% } %>
<% if (travis) { %>[![npm](https://img.shields.io/npm/l/node-env-run.svg?style=flat-square)](/LICENSE) [![Build Status](https://travis-ci.org/dkundel/node-env-run.svg?branch=master)](https://travis-ci.org/dkundel/node-env-run)<% } %>
<% if (useContributors) { %>
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors) <% } %>

# <%= moduleName %>

> <%= projectDescription %>

<% if (type === 'module') { %>## Installation

```bash
npm install <%= moduleName %>
```

<% } %><% if (type !== 'module') { %>## Setup

```bash
git clone TODO
cd <% moduleName %>
npm install
```

<% } %>

## Contributors

<!-- Insert contributors -->

## License

<%= license %>
