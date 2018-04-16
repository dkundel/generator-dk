<!-- BADGES:START -->

<!-- BADGES:END -->

# <%= moduleName %>

> <%= projectDescription %>

<% if (type !== 'node') { %>## Installation

```bash
npm install <%= moduleName %>
```

<%_ } _%><% if (type === 'module') { %>## Setup

```bash
git clone git@github.com:<%= githubAccount %>/<%= repositoryName %>.git
cd <%= repositoryName %>
npm install
```

<%_ } _%>

## Contributing

Contributions are always welcomed! Feel free to create an [issue](/issues) or submit a [pull request](/pull) for any changes.

### How to create a PR

If your change is in one of the Markdown files, the easiest path might be to use GitHub's ["Edit File"](https://help.github.com/articles/editing-files-in-your-repository/) functionality. For any code-related changes you want to:

1.  Fork the repository
2.  Clone your fork & install dependencies on your computer:

```bash
git clone git@github.com:YOUR_GITHUB_NAME/<%= repositoryName %>.git
cd <%= repositoryName %>
npm install
```

3.  Create a branch for your changes
4.  Make changes
5.  Run `npm test` before commiting.
6.  Create a Pull Request

<!-- Insert CoC notice -->

## Contributors

<!-- Insert contributors -->

## License

<%= license %>
