---
timestamp: 'Sun Oct 19 2025 07:47:58 GMT-0400 (Eastern Daylight Time)'
parent: '[[..\20251019_074758.b1f321c1.md]]'
content_id: 7af4b77368dec04edf4a4a144f86758387ca31b8afcd11801f87093620e57752
---

# prompt: I recently had to regenerate an API key because I accidentally pushed mine to GitHub. Now, I get the following error when trying to run a Context prompt:

error: Uncaught (in promise) ApiError: {"error":{"message":"{\n  "error": {\n    "code": 400,\n    "message": "API key expired. Please renew the API key.",\n    "status": "INVALID\_ARGUMENT",\n    "details": \[\n      {\n        "@type": "type.googleapis.com/google.rpc.ErrorInfo",\n        "reason": "API\_KEY\_INVALID",\n        "domain": "googleapis.com",\n        "metadata": {\n          "service": "generativelanguage.googleapis.com"\n        }\n      },\n      {\n        "@type": "type.googleapis.com/google.rpc.LocalizedMessage",\n        "locale": "en-US",\n        "message": "API key expired. Please renew the API key."\n      }\n    ]\n  }\n}\n","code":400,"status":"Bad Request"}}
const apiError = new ApiError({

How can I fix this?
