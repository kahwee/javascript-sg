---
title: "Migrating from Wordpress to Hugo"
date: 2017-09-01T19:41:16-07:00
tags:
  - hugo
---

## Why Hugo

I wanted something more optimized on the web and that means static site generators are the way to go. WordPress has it's own security issues and static site is close to impenetrable. Do note that I am not using much of the advance features of WordPress such as gallery creation and the well-crafted SEO plugins available. I really didn't have much to lose when I migrate to another tool.

I have been using Hugo for at least 3 months now. I am impressed by the amount of time required to generate my content. Using Hugo allows me to manage my content via Github and that's a huge plus for me.

### The Netlify advantage

This isn't sponsored by Netlify but using Netlify together with Hugo is such a time-saver. I first heard of Netlify at a JAM Stack workshop in Google LaunchPad (San Francisco) and gave it a try. Netlify handles the deployment for you and puts your file in the CDN. If you don't need extra multiple user support, you're good for the free tier.

## Installing the plugin

[Cyrill Schumacher](https://github.com/SchumacherFM) wrote a super helpful plugin that you can install in your WordPress instance. Called [wordpress-to-hugo-exporter](https://github.com/SchumacherFM/wordpress-to-hugo-exporter), it does exactly as advertised.

To install, go to the [Github page](https://github.com/SchumacherFM/wordpress-to-hugo-exporter) and click on the green "Clone or download" button and then click on "Download ZIP."

Once you're done, go to your WordPress Admin page and click on Plugins -> Add New. On the top, there "Upload Plugin". Upload the ZIP file you have just downloaded. If the upload fails, check that you granted the correct permissions in your web server's `wp-content` directory.

## Installing plugin prerequisites

Not that the plugin uses a PHP class called ZipArchive which is not installed by default. If you're using PHP 7.0 like I am, you need to run:

```sh
sudo apt-get install php7.0-zip
```

If you have PHP 7.1 or PHP 5.6 instead, use one of these:

```sh
sudo apt-get install php7.1-zip
sudo apt-get install php5.6-zip
```

If you're using Docker php ext:

```sh
docker-php-ext-install zip
```

If you're using Apache's PHP module, be sure to restart Apache HTTPD:

```sh
sudo service apache2 restart
```

## Disable Jetpack's Image Performance

Make sure you turn off Jetpack's Image Performance feature which uses the CDN. This changes your WordPress images URL to the ones in WordPress's CDN. I doubt you will want that.

## Exporting to Hugo

Phew, that's a bit of work. Now go to your WordPress Admin again and activate the plugin you have just installed.

Then you can see a new menu item in Tools -> Export to Hugo.

Clicking on it will give you the file `hugo-export.zip`.

## What's in hugo-export.zip

This is a sample of how my blog structure looks like:

```
drwxr-xr-x@    - kahwee  1 Sep 19:39 about
.rw-rw-rw-@   80 kahwee  2 Sep  2:39 config.yaml
drwxr-xr-x@    - kahwee  1 Sep 19:39 contact
drwxr-xr-x@    - kahwee  1 Sep 19:39 post
drwxr-xr-x@    - kahwee  1 Sep 19:39 resume
drwxr-xr-x@    - kahwee  1 Sep 19:39 wp-content
```

All my posts are inside `post`, there are more than 1,500 files extracted.

The images in `wp-content` are also extracted out for you:

```
└── wp-content
    └── uploads
        └── 2015
            ├── 07
            │   ├── 5164-1024x615.jpg
            │   ├── 5164-150x150.jpg
            │   ├── 5164-300x180.jpg
            │   ├── 5164-825x510.jpg
            │   ├── 5164.jpg
```
These files are meant to be in the `content` directory.

## Export quality

### Front Matter

Here's a sample segment for what it has exported. I am incredibly thankful this worked out. My tags, categories and URLs are preserved too:

```
---
title: How to install Composer in Windows
author: kahwee
type: post
date: 2013-01-05T16:20:14+00:00
url: /2013/install-composer-windows/
categories:
  - Code
tags:
  - command prompt
  - composer
  - console
  - how-to
  - php
  - php cli
  - postgresql
  - tip
  - windows
  - windows 7
  - xampp
```

### Code

I used a WordPress plugin called Crayon Syntax Highlight which doesn't export correctly. It looks like this now:

```
[code language=&#8221;bash&#8221;]C:Program FilesCommon FilesMicrosoft SharedWindows Live;C:Program Files (x86)Common FilesMicrosoft SharedWindows Live;C:Program Files (x86)NVIDIA CorporationPhysXCommon;%SystemRoot%system32;%SystemRoot%;%SystemRoot%System32Wbem;%SYSTEMROOT%System32WindowsPowerShellv1.0;C:Program Files (x86)Windows LiveShared;C:Program Files (x86)SproutCorebin;N:vagrantvagrantbin;C:Program Files (x86)QuickTimeQTSystem[/code]

Append your XAMPP PHP directory at the back of what is already there:

[code language=&#8221;bash&#8221;];C:xamppphp[/code]
```

A little disappointed there but they are really old tutorials and aren't relevant anyway.

### Markdown

The plugin converted my HTML to Markdown which is very nice. I will say it works mostly well with these tiny omissions:

* Smart quotes: `And you&#8217;re done` should have been `And you're done`
* Smart quotes: `&#8221;` and `&#8220;` should have been `"`
* `&#8212;` should have been an em dash
* `&#8211;` should have been an en dash
* `img` tags don't get converted

