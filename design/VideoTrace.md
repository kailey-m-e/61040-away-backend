# User Journey Video Trace

[Requesting] Received request for path: /UserAuthentication/authenticate


Requesting.request {
  username: 'kaileyme',
  password: 'Redape74',
  path: '/UserAuthentication/authenticate'
} => { request: '019a61ae-18de-743f-b2b2-f7da52435fbb' }
UserAuthentication.authenticate { username: 'kaileyme', password: 'Redape74' } => {}
Sessioning.create { user: '019a540f-8c86-7031-a735-6fd89bc79eeb' } => { session: '019a61ae-1b13-719b-9305-87878fc1992a' }


Requesting.respond {
  request: '019a61ae-18de-743f-b2b2-f7da52435fbb',
  session: '019a61ae-1b13-719b-9305-87878fc1992a',
  user: '019a540f-8c86-7031-a735-6fd89bc79eeb'
} => { request: '019a61ae-18de-743f-b2b2-f7da52435fbb' }


[Requesting] Received request for path: /Posting/_getPosts


Requesting.request {
  session: '019a61ae-1b13-719b-9305-87878fc1992a',
  path: '/Posting/_getPosts'
} => { request: '019a61ae-1cb1-726a-87dd-44d943ecc2ec' }


Requesting.respond { request: '019a61ae-1cb1-726a-87dd-44d943ecc2ec', results: [] } => { request: '019a61ae-1cb1-726a-87dd-44d943ecc2ec' }


[Requesting] Received request for path: /Posting/create


Requesting.request {
  title: 'Weekend in Maine',
  city: 'Portland',
  region: 'Maine',
  country: 'United States',
  start: '2025-11-01',
  end: '2025-11-02',
  description: 'Pretty leaves and great eats!!',
  session: '019a61ae-1b13-719b-9305-87878fc1992a',
  path: '/Posting/create'
} => { request: '019a61ae-84e2-7a84-905a-649a89bc57de' }


Posting.create {
  creator: '019a540f-8c86-7031-a735-6fd89bc79eeb',
  title: 'Weekend in Maine',
  city: 'Portland',
  region: 'Maine',
  country: 'United States',
  start: '2025-11-01',
  end: '2025-11-02',
  description: 'Pretty leaves and great eats!!'
} => { post: '019a61ae-8563-78ce-93d1-0bc6a1091c84' }


Requesting.respond {
  request: '019a61ae-84e2-7a84-905a-649a89bc57de',
  post: '019a61ae-8563-78ce-93d1-0bc6a1091c84'
} => { request: '019a61ae-84e2-7a84-905a-649a89bc57de' }


[Requesting] Received request for path: /Posting/_getPosts
Requesting.request {
  session: '019a61ae-1b13-719b-9305-87878fc1992a',
  path: '/Posting/_getPosts'
} => { request: '019a61ae-86de-7b69-9aa4-f1fa5a3597e6' }


Requesting.respond {
  request: '019a61ae-86de-7b69-9aa4-f1fa5a3597e6',
  results: [
    {
      post: '019a61ae-8563-78ce-93d1-0bc6a1091c84',
      postData: [Object]
    }
  ]
} => { request: '019a61ae-86de-7b69-9aa4-f1fa5a3597e6' }


[Requesting] Received request for path: /Posting/_getPosts


Requesting.request {
  session: '019a61ae-1b13-719b-9305-87878fc1992a',
  path: '/Posting/_getPosts'
} => { request: '019a61ae-88de-791b-a41a-d0857c73b1f1' }


Requesting.respond {
  request: '019a61ae-88de-791b-a41a-d0857c73b1f1',
  results: [
    {
      post: '019a61ae-8563-78ce-93d1-0bc6a1091c84',
      postData: [Object]
    }
  ]
} => { request: '019a61ae-88de-791b-a41a-d0857c73b1f1' }


[Requesting] Received request for path: /Wishlist/_getPlaces
Requesting.request {
  session: '019a61ae-1b13-719b-9305-87878fc1992a',
  path: '/Wishlist/_getPlaces'
} => { request: '019a61ae-bac2-7f6b-b38a-a716f379b945' }


Requesting.respond { request: '019a61ae-bac2-7f6b-b38a-a716f379b945', results: [] } => { request: '019a61ae-bac2-7f6b-b38a-a716f379b945' }


[Requesting] Received request for path: /Wishlist/addPlace


Requesting.request {
  session: '019a61ae-1b13-719b-9305-87878fc1992a',
  city: 'Providence',
  region: 'Rhode Island',
  country: 'United States',
  path: '/Wishlist/addPlace'
} => { request: '019a61ae-dd8b-7f49-9cec-a638c968788a' }


Wishlist.addPlace {
  user: '019a540f-8c86-7031-a735-6fd89bc79eeb',
  city: 'Providence',
  region: 'Rhode Island',
  country: 'United States'
} => { place: '019a61ae-de5e-7ff3-904f-ab91812fef26' }


Requesting.respond {
  request: '019a61ae-dd8b-7f49-9cec-a638c968788a',
  place: '019a61ae-de5e-7ff3-904f-ab91812fef26'
} => { request: '019a61ae-dd8b-7f49-9cec-a638c968788a' }


[Requesting] Received request for path: /Wishlist/_getPlaces


Requesting.request {
  session: '019a61ae-1b13-719b-9305-87878fc1992a',
  path: '/Wishlist/_getPlaces'
} => { request: '019a61ae-dfc8-7a89-a4ee-bb117fa7c19e' }


Requesting.respond {
  request: '019a61ae-dfc8-7a89-a4ee-bb117fa7c19e',
  results: [
    {
      place: '019a61ae-de5e-7ff3-904f-ab91812fef26',
      placeData: [Object]
    }
  ]
} => { request: '019a61ae-dfc8-7a89-a4ee-bb117fa7c19e' }


[Requesting] Received request for path: /Wishlist/_getPlaces


Requesting.request {
  session: '019a61ae-1b13-719b-9305-87878fc1992a',
  path: '/Wishlist/_getPlaces'
} => { request: '019a61ae-e17a-7829-bc06-0a52b3fdc13b' }


Requesting.respond {
  request: '019a61ae-e17a-7829-bc06-0a52b3fdc13b',
  results: [
    {
      place: '019a61ae-de5e-7ff3-904f-ab91812fef26',
      placeData: [Object]
    }
  ]
} => { request: '019a61ae-e17a-7829-bc06-0a52b3fdc13b' }


[Requesting] Received request for path: /Wishlist/addPlace


Requesting.request {
  session: '019a61ae-1b13-719b-9305-87878fc1992a',
  city: 'Niagara Falls',
  region: 'Ontario',
  country: 'Canada',
  path: '/Wishlist/addPlace'
} => { request: '019a61ae-ff2d-7cf7-bdff-7d3e6fd5268b' }


Wishlist.addPlace {
  user: '019a540f-8c86-7031-a735-6fd89bc79eeb',
  city: 'Niagara Falls',
  region: 'Ontario',
  country: 'Canada'
} => { place: '019a61ae-ffed-7d9d-88d5-ac8b5cc9f1be' }


Requesting.respond {
  request: '019a61ae-ff2d-7cf7-bdff-7d3e6fd5268b',
  place: '019a61ae-ffed-7d9d-88d5-ac8b5cc9f1be'
} => { request: '019a61ae-ff2d-7cf7-bdff-7d3e6fd5268b' }


[Requesting] Received request for path: /Wishlist/_getPlaces
Requesting.request {
  session: '019a61ae-1b13-719b-9305-87878fc1992a',
  path: '/Wishlist/_getPlaces'
} => { request: '019a61af-013e-7fa5-8525-10771b555810' }
Requesting.respond {
  request: '019a61af-013e-7fa5-8525-10771b555810',
  results: [
    {
      place: '019a61ae-de5e-7ff3-904f-ab91812fef26',
      placeData: [Object]
    },
    {
      place: '019a61ae-ffed-7d9d-88d5-ac8b5cc9f1be',
      placeData: [Object]
    }
  ]
} => { request: '019a61af-013e-7fa5-8525-10771b555810' }


[Requesting] Received request for path: /Wishlist/_getPlaces
Requesting.request {
  session: '019a61ae-1b13-719b-9305-87878fc1992a',
  path: '/Wishlist/_getPlaces'
} => { request: '019a61af-02f1-75b5-98d6-6facbe55d171' }
Requesting.respond {
  request: '019a61af-02f1-75b5-98d6-6facbe55d171',
  results: [
    {
      place: '019a61ae-ffed-7d9d-88d5-ac8b5cc9f1be',
      placeData: [Object]
    },
    {
      place: '019a61ae-de5e-7ff3-904f-ab91812fef26',
      placeData: [Object]
    }
  ]
} => { request: '019a61af-02f1-75b5-98d6-6facbe55d171' }


[Requesting] Received request for path: /Friending/_getFriends
Requesting.request {
  session: '019a61ae-1b13-719b-9305-87878fc1992a',
  path: '/Friending/_getFriends'
} => { request: '019a61af-1913-7ae8-be00-81974636b814' }


[Requesting] Received request for path: /Friending/_getIncomingRequests


[Requesting] Received request for path: /Friending/_getOutgoingRequests
Requesting.respond { request: '019a61af-1913-7ae8-be00-81974636b814', results: [] } => { request: '019a61af-1913-7ae8-be00-81974636b814' }


Requesting.request {
  session: '019a61ae-1b13-719b-9305-87878fc1992a',
  path: '/Friending/_getIncomingRequests'
} => { request: '019a61af-19e6-7d8d-90cd-56e8aff1e88b' }


Requesting.request {
  session: '019a61ae-1b13-719b-9305-87878fc1992a',
  path: '/Friending/_getOutgoingRequests'
} => { request: '019a61af-19ec-71df-9d62-1a09722adebb' }


Requesting.respond { request: '019a61af-19ec-71df-9d62-1a09722adebb', results: [] } => { request: '019a61af-19ec-71df-9d62-1a09722adebb' }


Requesting.respond {
  request: '019a61af-19e6-7d8d-90cd-56e8aff1e88b',
  results: [
    {
      friendId: '019a618f-b3e8-7fdb-a469-89e117340788',
      username: 'amy'
    }
  ]
} => { request: '019a61af-19e6-7d8d-90cd-56e8aff1e88b' }


[Requesting] Received request for path: /Friending/acceptFriend


Requesting.request {
  session: '019a61ae-1b13-719b-9305-87878fc1992a',
  friend: 'amy',
  path: '/Friending/acceptFriend'
} => { request: '019a61af-2c1a-7af3-8611-35ed248a13f3' }


Friending.acceptFriend {
  user: '019a540f-8c86-7031-a735-6fd89bc79eeb',
  friend: '019a618f-b3e8-7fdb-a469-89e117340788'
} => {}


Requesting.respond { request: '019a61af-2c1a-7af3-8611-35ed248a13f3' } => { request: '019a61af-2c1a-7af3-8611-35ed248a13f3' }


[Requesting] Received request for path: /Friending/_getIncomingRequests


[Requesting] Received request for path: /Friending/_getFriends


Requesting.request {
  session: '019a61ae-1b13-719b-9305-87878fc1992a',
  path: '/Friending/_getIncomingRequests'
} => { request: '019a61af-2ef5-7e1f-b333-55a8c1728afa' }


Requesting.request {
  session: '019a61ae-1b13-719b-9305-87878fc1992a',
  path: '/Friending/_getFriends'
} => { request: '019a61af-2f08-7e1f-8dab-9150c034817e' }


Requesting.respond { request: '019a61af-2ef5-7e1f-b333-55a8c1728afa', results: [] } => { request: '019a61af-2ef5-7e1f-b333-55a8c1728afa' }


Requesting.respond {
  request: '019a61af-2f08-7e1f-8dab-9150c034817e',
  results: [
    {
      friendId: '019a618f-b3e8-7fdb-a469-89e117340788',
      username: 'amy'
    }
  ]
} => { request: '019a61af-2f08-7e1f-8dab-9150c034817e' }


[Requesting] Received request for path: /Posting/_getPosts


Requesting.request {
  session: '019a61ae-1b13-719b-9305-87878fc1992a',
  friendUsername: 'amy',
  path: '/Posting/_getPosts'
} => { request: '019a61af-4273-7414-8a08-84c9c3c77d1d' }


Requesting.respond {
  request: '019a61af-4273-7414-8a08-84c9c3c77d1d',
  results: [
    {
      post: '019a6190-692f-706a-bd0e-dab9df015c8c',
      postData: [Object]
    },
    {
      post: '019a6190-cda8-75d9-9001-49b4574c7d53',
      postData: [Object]
    }
  ]
} => { request: '019a61af-4273-7414-8a08-84c9c3c77d1d' }


Requesting.respond {
  request: '019a61af-4273-7414-8a08-84c9c3c77d1d',
  results: [
    {
      post: '019a61ae-8563-78ce-93d1-0bc6a1091c84',
      postData: [Object]
    }
  ]
} => { request: '019a61af-4273-7414-8a08-84c9c3c77d1d' }


[Requesting] Received request for path: /Posting/_getPosts


Requesting.request {
  session: '019a61ae-1b13-719b-9305-87878fc1992a',
  path: '/Posting/_getPosts'
} => { request: '019a61af-701d-7e31-a92c-652db0faec9c' }


Requesting.respond {
  request: '019a61af-701d-7e31-a92c-652db0faec9c',
  results: [
    {
      post: '019a61ae-8563-78ce-93d1-0bc6a1091c84',
      postData: [Object]
    }
  ]
} => { request: '019a61af-701d-7e31-a92c-652db0faec9c' }
==> Detected service running on port 10000
==> Docs on specifying a port: https://render.com/docs/web-services#port-binding


[Requesting] Received request for path: /Posting/_getPosts


Requesting.request {
  session: '019a61ae-1b13-719b-9305-87878fc1992a',
  path: '/Posting/_getPosts'
} => { request: '019a61b6-3f0b-7aba-8a21-e3c6512054c5' }


Requesting.respond {
  request: '019a61b6-3f0b-7aba-8a21-e3c6512054c5',
  results: [
    {
      post: '019a61ae-8563-78ce-93d1-0bc6a1091c84',
      postData: [Object]
    }
  ]
} => { request: '019a61b6-3f0b-7aba-8a21-e3c6512054c5' }
