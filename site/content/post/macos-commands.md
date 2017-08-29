---
title: "macOS Commands"
date: 2017-08-28T11:41:43-07:00
description: Quick fixes for macOS issues using the Terminal
published: true
tags:
- macos
- cli
- command
- terminal
---

My work computer is using macOS Sierra with a touch bar. As much as I am excited about this new computer, using it hasn't been particularly smooth. Therefore I'm consolidating a list of commands that has helped me get around using macOS. You may find this helpful too. If you like to contribute, change it on [Github](https://github.com/kahwee/javascript-sg/blob/master/site/content/post/macos-commands.md).

## Reindexing Spotlight

When some of your applications are no longer listed in Spotlight, this reindexes

```sh
sudo mdutil -E /
```

## Reload the MacBook Pro video camera

Sometimes the in-built video camera doesn't work after you close and open the laptop lid. It says "No Connected Camera" and Chrome may not detect you have a camera. Fix that by running this:

```sh
sudo killall VDCAssistant
```

## Highly-opinionated apps

### Installing Xcode

```sh
xcode-select --install
```

### Terminal apps

To install brew, see [instructions](https://brew.sh/).

Install using `brew`:

```sh
set -k
# The above line makes comments work in interactive mode for zsh
brew install zsh       # zsh is my prefered shell
brew install fasd      # Navigate based on frequency
brew install wget curl # Convenient downloading of files
brew install exa       # Nice ls alternative
brew install git       # Modern repository
brew install ruby      # Update to latest ruby
brew install tree      # Easy tree visualization

```

### brew cask apps

Install using `brew cask`:

```sh
set -k
# The above line makes comments work in interactive mode for zsh
brew cask install iterm2     # Modern Terminal interface
brew cask install iina       # Modern video player
brew cask install brave      # Modern and safe browser
brew cask install slack      # Communication tool for work purposes
brew cask install appcleaner # AppCleaner

```

### Enhancing Quick Look

List of useful Quick Look plugins for developers


```sh
set -k
# The above line makes comments work in interactive mode for zsh
brew cask install qlmarkdown     # Quick Look Markdown
brew cask install quicklook-json # Quick Look JSON
brew cask install qlcolorcode    # Quick Look syntax highlighting

```

### Python development

```sh
set -k
# The above line makes comments work in interactive mode for zsh
brew install python
pip install --upgrade setuptools
pip install --upgrade pip
```

### Node.js / JavaScript development


```sh
set -k
# The above line makes comments work in interactive mode for zsh
brew install yarn      # A moderately faster npm equivalent
brew install nvm       # node versioning manager
```
