# Faida

![alt text](<Structure.png>)

## Command History 

```bash
npm i axios bcryptjs jsonwebtoken nodemailer react-hot-toast mongoose
```

No need to add express in Nextjs (has built-in express alternatives), would be using jwt and nodemailer services as well as mongoose for the ORM to communicate with db, react-hot-toast for popup notification stuff. 

Create a .env file in the root folder with the following lines:

MONGO_URI=Go to connect button to get the URI
SECRET_TOKEN=yourchoicechoosewhatever
DOMAIN=http://localhost:3000
MAIL_USER= In mailTrap go to My Sandbox and below 
MAIL_PASS= you will find the credentials under the node.Js tab
