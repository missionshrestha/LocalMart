
<h1 align="center">🛒 Local Mart</h1>
<em align="center">A platform for local Nepalese sellers to promote their products to national and worldwide markets.</em>

## About ℹ️ 

There has been an upsurge in online transactions in Nepal as internet access has increased.
People are now more at ease buying and selling things online. Taking advantage of this
possibility, various online retailers such as Daraz, SastoDeal, and others have been able to
establish a market for vendors to sell their products online. However, based on the patterns of
these establishments, it appears that they are marketing foreign branded products rather than
Nepali products. According to several surveys, many foreigners and Nepali locals want to
buy original Nepali local products, however, there is no adequate platform for these Nepali
products to reach the market. Thus we prefer to carry out this project to provide a platform
for local Nepalese sellers to promote their products to national and worldwide markets.


## Run Locally (Backend Development Environment) ⚒️

#### You can run the application through `Uvicorn`

```bash
# Clone the repository
$ git clone https://github.com/ashutoshbr/LocalMart
$ cd LocalMart/backend

# Setup virtual environment
$ python -m venv venv
$ source ./venv/bin/activate

# Install Requirements
$ pip install -r requirements.txt

# Place the .env file in the root directory

# Start the server (Listens on port 8000)
$ uvicorn app.main:app --reload
```

## Run Locally (Frontend Development Environment) 

Prerequisite: You need to have <a href="https://nodejs.org/dist/v16.18.0/node-v16.18.0-x64.msi">Node.js</a>  installed in your system. 

On the terminal,
```bash
$ cd LocalMart/frontend

$ npm install 

# Place the .env.local file in the frontend directory which declare the follwing variable
# NEXT_PUBLIC_BACKEND_API ="Location at which your backend server is running"

# Start the server
$ npm run dev
```