## main goal

- This project is for fun and testing my skill for how to assemble REST API with limited ip and hiding API token from client side.
- For informatic website, just go https://royaleapi.com
- Current issues 
    - /api/card respond only card names and card images, and images not with consistent size.
    - clashroyale API https://api.clashroyale.com/v1 need fixed ip to call (That would not happen if called on client side) and API key (should not exposed on client side)
    
## testing for clash royale API 

- Register and generate a key for local https://developer.clashroyale.com/
- add env variable .env.local API_KEY=[API_TOKEN]

### clash royale api generate certain JWT binding to ip as API KEY
Still figuring out proxy to fixed ip work or not

## joy UI
alpha version of MUI variant. 
Still trying

## Following Generated by Create Next App 
and not deleted yet
## Getting Started

First, run the development server:

```bash
yarn [install]
yarn dev
```

For running on production env
```
yarn build
yarn start
```