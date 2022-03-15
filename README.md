# [Collaborative Tier Lists](https://ctl.flynna.uk)
## What is this?
#### Summary
Collaborative Tier Lists is a web app which lets people create tier lists for multiple people to complete. The average tiers will be shown, so that the tier list represents the opinions of multiple people.  
This is a really early version.  
*(someone please rewrite this section)*

#### What can you do with it?
- Make a list
- Submit your tiers to a list
- View the list lol

#### What's planned?
- Public tier list finder on the homepage
- Searching for public tier lists
- Touchscreen support lol

#### When will this be even relatively usable?
never lol. those things above? not gonna happen. unless someone cool makes a pull request

 
## Setup
If you just want to use the app to make a list, go to [the official site](https://ctl.ocean.lol). Otherwise, if you want to install the app to develop, test or host it or whatever, follow these setup instructions.

#### Installing
1. clone this
2. `npm install`

#### Database
1. `npm install sequelize-cli -g`
2. `sequelize db:migrate`

#### Configuration
Create a file in the project root called `cfg.json` and include the following contents.
```json
{
    "port": 8080,
    "host": "http://localhost:8080",
    "identificatorHost": "https://identificator.xyz",
    "secret": "someRandomString"
}
```
Edit them according to your needs:  
`"port"`: The port the express server listens on.  
`"host"`: The root URL the app will be accessed from.  
`"identificatorHost"`: The Identificator host. If you don't know what this is, [check this out](https://identificator.xyz).  
`"secret"`: The secret for the cookies.

#### Start
`npm start`
