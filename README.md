# Starting template for quick setup & development

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


## Quick Start

```
# Clone this repo
git clone https://github.com/MatiasLN/templat0r.git

# Navigate into the directory
cd /path/to/project/project-name

# Install the project's node dependencies
npm install

# Install the project's bower dependencies
gulp setup
```


## Start project

```
# Start the local server and watch for changes on new files / excisting files.
gulp watch
```


### Useful Gulp commands

```
# Clean dist directory and remove all files
gulp clean

# Copy and minify images from assets to dist directory manually
gulp images

# Copy fonts from assets to dist directory manually
gulp fonts

# Copy videos from assets to dist directory manually
gulp video

# Clean, copy and run everything from scratch
gulp build
```