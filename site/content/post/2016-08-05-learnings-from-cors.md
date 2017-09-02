---
date: 2016-08-05T00:00:00Z
published: true
title: Learnings from CORS
description: Using CORS
url: /2016/08/05/learnings-from-cors.html
aliases:
- /2016/06/12/how-to-make-vary-origin-in-aws-s3.html
tags:
- example
- cors
- amazon
- aws
- s3
- server
---

CORS is a little hard to understand. I'll give you a quick overview of what it is about.

There are two main modes of CORS:

1. basic CORS which is `withCredentials` set to `false`
2. preflight CORS which is `withCredentials` set to `true`

Let's look at the first case.

## Basic CORS

Basic CORS just want your server response to match an allowable origin. It isn't uncommon to see servers returning with

```
Access-Control-Allow-Origin: *
```

This means it matches any domain name.

If the server returns three of the same header, like this:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Origin: *
Access-Control-Allow-Origin: *
```

...browsers interpret it as:

```
Access-Control-Allow-Origin: *, *, *
```

...which is invalid.

You will get the error message -- "XMLHttpRequest cannot load http://example.com. The 'Access-Control-Allow-Origin' header contains multiple values '*, *, *', but only one is allowed. Origin 'http://example.com' is therefore not allowed access."

## Preflight CORS

This has `withCredentials` set to true and it disallows `Access-Control-Allow-Origin` to be set to an `*`.

When the request sends a header with a specified `Origin`, it has to return the same value back as `Access-Control-Allow-Origin`.

For example, in the request you have header:

```
Origin: http://example.com
```

Expected server response is:

```
Access-Control-Allow-Origin: http://example.com
```

Returning an `*` is not allowed and you will be returned with an error.

Possible Apache2 (httpd) configuration could be:

```perl
SetEnvIf Origin "(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)*\.?(:\d+)?(\/*)?)" AccessControlAllowOrigin=$0
Header always set Access-Control-Allow-Origin %{AccessControlAllowOrigin}e env=AccessControlAllowOrigin
<If "-z reqenv('AccessControlAllowOrigin')">
  Header set Access-Control-Allow-Origin "*"
</If>
```

Possible nginx configuration could be:

```perl
add_header "Access-Control-Allow-Origin" $http_origin;
```

## Making vary origin work for AWS S3

I've been trying to make Vary Origin work with Amazon Web Services S3. Here is how.

You need to Add CORS Configuration. Paste in the following:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  <CORSRule>
    <AllowedOrigin>http*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
  </CORSRule>
  <CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
  </CORSRule>
</CORSConfiguration>
```

### How to test

Open the terminal or command line and using curl:

```sh
curl -sI \
  -H "Origin: https://kw.sg" \
  -H "Access-Control-Request-Method: GET" \
  https://s3.amazonaws.com/animate-vpaid-bridge/sample-1.xml
```

I sent the origin as https://kw.sg

Notice that in the response, `Access-Control-Allow-Origin` is `https://kw.sg`:

```
HTTP/1.1 200 OK
x-amz-id-2: 0BcMkyAeoPt/w/oevI+qtn1ihpODlDkxkqKlVg76L+OLxzPM1mxLXjRhbU3ZkQw7esOrtpFDaVU=
x-amz-request-id: 8AFE776F01F4A04B
Date: Wed, 10 Aug 2016 21:09:46 GMT
Access-Control-Allow-Origin: https://kw.sg
Access-Control-Allow-Methods: GET
Access-Control-Max-Age: 3000
Access-Control-Allow-Credentials: true
Vary: Origin, Access-Control-Request-Headers, Access-Control-Request-Method
Last-Modified: Thu, 18 Feb 2016 02:01:48 GMT
ETag: "826700c1df4af9fea1aea4e7b36035e7"
Accept-Ranges: bytes
Content-Type: text/xml
Content-Length: 1888
Server: AmazonS3
```

Now lets try sending only the Origin without `Access-Control-Request-Method`:

```sh
curl -sI \
  -H "Origin: https://kw.sg" \
  https://s3.amazonaws.com/animate-vpaid-bridge/sample-1.xml
```

Notice that in the response, `Access-Control-Allow-Origin` is `*`:

```
HTTP/1.1 200 OK
x-amz-id-2: yjG+iEUBzesZscpgzU9qwAplYzTBoX2oLty9zPCEybE90BYF8oJDXZ03XaqvGcIq0QU2qU19b18=
x-amz-request-id: 7BC3744AC964A9F6
Date: Wed, 10 Aug 2016 21:39:43 GMT
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD
Vary: Origin, Access-Control-Request-Headers, Access-Control-Request-Method
Last-Modified: Thu, 18 Feb 2016 02:01:48 GMT
ETag: "826700c1df4af9fea1aea4e7b36035e7"
Accept-Ranges: bytes
Content-Type: text/xml
Content-Length: 1888
Server: AmazonS3
```

Note the above where I am able to get the Access-Control-Allow-Origin to return https://kw.sg as well.
