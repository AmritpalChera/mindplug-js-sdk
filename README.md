## <a href="https://mindplug.io" target="blank" rel="noreferrer, noopener">Mindplug</a> 
Mindplug is the easiest solution to creating and managing embeddings. Add long term memory to your LLMs, perform semantic data analysis and easily filter data based on metadata. Connect your app to external web sources using our smart endpoint.

### Install Mindplug
NPM:
```
npm install mindplug
```
yarn:
```
yarn add mindplug
```
<br/>

### Initialize Mindplug
Obtain an API key from <a href="https://mindplug.io" target="blank" rel="noreferrer, noopener">Mindplug</a>  dashboard.
```
import Mindplug from 'mindplug';
const mindplug = new Mindplug({mindplugKey: <SAMPLE KEY>});
```
<br />


### Store data
#### All storage of data requires a db and a collection.
Store text. Requires content
```
mindplug.store({
  db: "first database",
  collection: "any collection",
  content: "hello, sample text to store",
});
```
Store PDF file. Requires an object of type File under 20MB
```
mindplug.storePDF({
  db: "first database",
  collection: "any collection",
  file: <SAMPLE FILE>
});
```
Store Webpage. Requires the webpage url
```
mindplug.storeWeb({
  db: "first database",
  collection: "any collection",
  url: "https://mindplug.io"
});
```
Store audio. Requires a MP3 or WAV file under 20MB
```
// must pass an openaiKey to constructor
mindplug.storeAudio({
  db: "first database",
  collection: "any collection",
  file: <SAMPLE FILE> 
});
```
#### Storing - Advanced Techniques
A `metadata` of type JSON and a `chunkSize` of type number may also be passed to each storage function. Metadata is used to easily filter for data. Chunksize is used to split large data into smaller batches. By default the data is split in about 1024 character chunks.
```
mindplug.store({
  db: "first database",
  collection: "any collection",
  content: "hello, sample text to store",
  metadata: {
    purpose: "to learn"
  },
  chunkSize: 512
});
```

### Query data
Semantic search. Search stored data by meaning of text.
```
mindplug.query({
  db: "first database",
  collection: "any collection",
  search: "What fruit is in the fridge?"
});
```

Query by vector ids.
```
mindplug.queryByIds({
  db: "first database",
  collection: "any collection",
  vectorIds: ["ID-1", "ID-2"]
});
```

Query by collection. Returns the recent 10 vectors from the collection.
```
mindplug.queryByCollection({
  db: "first database",
  collection: "any collection"
});
```
#### Query - Advanced Techniques
By default, mindplug returns the 3 best matches for the searched data. You can change this by passing a `count` parameter. You can also filter the stored data based on metadata by passing in a `metadataFilters` parameter.
```
mindplug.query({
  db: "first database",
  collection: "any collection",
  search: "What are the benefits of Solana blockchain?",
  metadataFilters: {
    genre: ["technology", "blockchain"]
  },
  count: 1
});
```
For more information on using metadataFilters, please see our API <a href="https://docs.mindplug.io/api/query/using-metadata-filters" target="blank" rel="noreferrer, noopener">documentation</a>


### Delete data
Delete by vector ids.
```
mindplug.deleteByIds({
  db: "first database",
  collection: "any collection",
  vectorIds: ["ID-1", "ID-2"]
});
```
Delete by upload id. Upload id is returned every time new data is stored
```
mindplug.deleteByUploadId({
  db: "first database",
  collection: "any collection",
  uploadId: "UPLOAD-ID"
});
```
Delete collection. Also deletes all vectors stored within.
```
mindplug.deleteCollection({
  db: "first database",
  collection: "any collection"
});
```
Delete project. Also deletes all collections and vectors stored within.
```
mindplug.deleteProject({
  db: "first database"
});
```
### List data
List Collections.
```
mindplug.listCollections({
  db: "first database"
});
```
List projects.
```
mindplug.listProjects();
```

### Smart
Google search from select sources.
```
mindplug.searchWeb({
  search: "How to cook pasta?"
});
```
### About
Mindplug is developed by the team at Bored Labs, the parent company of the team behind <a href="https://experai.com" target="blank" rel="noreferrer, noopener">ExperAI</a>, a chatbot application where you can interact with any AI expert instantly. 

The experts of ExperAI use mindplug for long term memory and data analysis. We've proven to support production level applications with great reliability. Our goal is to provide the easiest solution to semantic search. To support our goal, we've also built a <a href="https://mindplug.io" target="blank" rel="noreferrer, noopener">frontend app</a> for Mindplug to allow users to interact with embeddings with no code. We keep it boring :)# mindplug-js-sdk
