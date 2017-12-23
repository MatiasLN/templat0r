# Starting template for quick setup & development

## Quick Start
```
# Clone this repo
git clone https://github.com/MatiasLN/templat0r.git
# Navigate into the directory
cd /path/to/project/project-name
# Install the project's node dependencies
npm install
# Install the project's bower dependencies
bower install
```

## Requirements
- Gulp needs to be installed globally.
- npm needs to be installed globally.
- bower needs to be installed globally.

```
# Check if Gulp is installed
gulp -v

# Check if npm is installed
npm -v

# Check if bower is installed
bower -v
```

```
# Install gulp globally
npm install -g gulp
```


## Start project

```
# Clean directories and install bower packges if necessary 
gulp setup

# Start the local server and watch for changes on new files / excisting files.
gulp watch
```

### Useful Gulp commands

```
# Clean /dist directory and remove all files
gulp clean

# Copy and minify imges from assets to dist directory
gulp images

# Copy and run everything from scratch
gulp build
```