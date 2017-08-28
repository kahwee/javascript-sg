---
title: "macOS Commands"
date: 2017-08-28T11:41:43-07:00
published: true
tags: ["macos", "cli", "command"]
---

My work computer is using macOS Sierra with a touch bar. As much as I am excited about this new computer, using it hasn't been particularly smooth. Therefore I'm consolidating a list of commands that has helped me get around using macOS. You may find this helpful too. If you like to contribute, hit on up on Github.

## Reindexing Spotlight

When some of your applications are no longer listed in Spotlight, this reindexes

```sh
sudo mdutil -E /
```

Sometimes the in-built video camera doesn't work after you close and open the laptop lid. It says "No Connected Camera" and Chrome may not detect you have a camera. Fix that by running this:

```sh
sudo killall VDCAssistant
```
