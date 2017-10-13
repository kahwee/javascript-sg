---
title: How to do HTTP to HTTPS redirect
date: 2017-09-11T22:35:09.734Z
description: How to do HTTP to HTTPS redirect in nginx
image: null
---
Some ways to redirect HTTP to HTTPS. This isn't an exhaustive list and it helps if you know the configuration of your server.

If you are using Amazon Web Services Elastic Load Balancer (ELB), your server will be accessed by the load balancer on `localhost:80`. 

```
server {
  listen 80;
  listen [::]:80;
  root /var/www/health-check;
  server_name kahwee.com ss.kahwee.com

  if ($http_x_forwarded_proto != 'https') {
    return 301 https://$server_name$request_uri;
  }

  location / {
    proxy_pass http://localhost:3100;
  }
}
```
