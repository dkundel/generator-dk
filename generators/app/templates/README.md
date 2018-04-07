<%_ if (type === 'module') { _%>
[![npm](https://img.shields.io/npm/v/<%= moduleName %>.svg?style=flat-square)](https://npmjs.com/packages/<%= moduleName %>) [![npm](https://img.shields.io/npm/dt/<%= moduleName %>.svg?style=flat-square)](https://npmjs.com/packages/<%= moduleName %>) <%_ } _%>
<%_ if (travis) { _%>[![npm](https://img.shields.io/npm/l/node-env-run.svg?style=flat-square)](/LICENSE) [![Build Status](https://travis-ci.org/dkundel/node-env-run.svg?branch=master)](https://travis-ci.org/dkundel/node-env-run)<%_ } _%>
<%_ if (useContributors) { _%>
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors) <%_ } _%>

# <%= moduleName %>

> <%= projectDescription %>

<% if (type === 'module') { %>## Installation

```bash
npm install <%= moduleName %>
```

<%_ } _%><% if (type !== 'module') { %>## Setup

```bash
git clone TODO
cd <% moduleName %>
npm install
```

<%_ } _%>

## Contributors

<!-- Insert contributors -->

## License

<%= license %>
