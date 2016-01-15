# noSQL_Team_VW
no SQL Team Joshua Vecsei und Jonas Weber


##First Steps:
1. download https://www.elastic.co/downloads/elasticsearch
2. elasticsearch config: Add `script.inline: on` to config/elasticsearch.yaml
3. `git clone https://github.com/ajaguar/noSQL_Team_VW.git``
4. `cd noSQL_Team_VW/`
5. `npm install`
6. start elasticsearch
7. `npm run dev` (develop) oder `npm start`

###elasticsearch config

Add `script.inline: on` to config/elasticsearch.yaml

###Develop start with:

npm run dev


###Start Server:

npm start


###Sites:

http://localhost:8888/#/upload -> upload file

http://localhost:8888/#/ -> search file

###Services:

POST - http://localhost:8888/document -> Upload new document with POST-Parameter 'document'

GET - http://localhost:8888/document?search=[keyword] -> Search for documents containing this keyword
