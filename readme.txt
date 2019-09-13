node app.js --site='tstplaneta'

node logsReader.js --site='tstbarguzin' --parent='7dfe3eef-fe01-4778-938e-51d7d2c304eb'
node logsReader.js --site='tstbarguzin'

node bugsReader.js --site='tstbarguzin'



npm install -g webdriver-manager
webdriver-manager update

host
127.0.0.1 localhost