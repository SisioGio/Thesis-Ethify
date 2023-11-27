# Thesis-Ethify

Thesis project illustrating how the discusses and implemented solutions might help companies with the most common accounting processes such as invocie exchange data, payment processing and invoice processing.

## Installation

```bash
mkdir project
cd project
git pull https://github.com/SisioGio/Thesis-Ethify
cd 'Thesis-Ethify'
# Install server dependencies
npm install
# Install client dependencies
cd client
npm install
```

Mysql is required and it must be configured in the file

```
server/config/db.config.js
```

## Usage

The system is using AWS service to upload the generated invoices, that's why it's required to set-up the required tokens in the **.env** file

```javascript
TOKEN_KEY = "RANDOM STRING FOR JWT TOKENS";
AWS_ACCESS_KEY = "AWS_ACCESS_TOKEN";
AWS_SECRET_ACCESS_KEY = "AWS_SECRET_ACCESS_KEY";
AWS_BUCKET_NAME = "AWS_BUCKET_NAME";
```

After updating the **.env** file, server and client can be activated as described below:

### Server

```bash
npm start

```

### Client

```bash
cd client
npm start

```
