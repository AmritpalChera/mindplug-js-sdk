import axios, {AxiosInstance} from "axios";
import { DeleteType, DeleteUploadType, ISDKProps, ProjectType, QueryType, QueryVectors, SearchWebType, StoreFileProps, StoreProps, StoreWebProps, UniversalProps } from "./types";
import Bottleneck from "bottleneck";
import { Configuration, OpenAIApi } from "openai";

class CustomFormData extends FormData {
  getHeaders() {
      return {}
  }
}

export const limiterOpenai = new Bottleneck({
  maxConcurrent: 1,
  minTime: 50
});

const devUrl = 'http://localhost:3001/api';
const prodUrl = 'https://connect.mindplug.io/api';


export default class Mindplug {
  private mindplug: AxiosInstance;
  private mindplugFile: AxiosInstance;
  private openai: OpenAIApi;

  constructor(props: ISDKProps) {
    this.mindplug = axios.create({
      baseURL: prodUrl,
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${props.mindplugKey}`
      }
    });

    this.mindplugFile = axios.create({
      baseURL: prodUrl,
      headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${props.mindplugKey}`
      }
    });

    this.openai = new OpenAIApi(new Configuration({
      apiKey: props.openaiKey,
      formDataCtor: CustomFormData
    }));
  }

  async store(data: StoreProps) {
    return this.mindplug.post('/data/store', {
      db: data.db,
      collection: data.collection,
      content: data.content,
      metadata: data.metadata || {},
      vectorId: data.vectorId,
      chunkSize: data.chunkSize
    }).then((res: any) => res.data).catch((err: any) => err.response.data);
  }

  async storePDF(data: StoreFileProps) {
    const form = new FormData();
    if (data.file.size > 50000000) throw "File limit is 50MB"
    form.append('file', data.file);
    const fileParsed = await this.mindplugFile.post('https://experai.ue.r.appspot.com/parse/pdf', form).then((res: any) => res.data);
    return this.mindplug.post('/data/store/multi', {
      data: fileParsed?.data,
      collection: data.collection,
      db: data.db,
      chunkSize: data.chunkSize,
      metadata: data.metadata
    }).then((res: any) => res.data).catch((err: any) => err.response.data);;
  }

  async storeWeb(data: StoreWebProps) {
    return this.mindplug.post('/data/store/webpage', {
      db: data.db,
      collection: data.collection,
      url: data.url,
      metadata: data.metadata || {},
      chunkSize: data.chunkSize
    }).then((res: any) => res.data).catch((err: any) => err.response.data);
  }

  async storeAudio(data: StoreFileProps) {
    const response = await this.openai.createTranscription(data.file, 'whisper-1', undefined, 'json', 1, 'en');
    const content = response.data?.text;
    return this.store({ ...data, content });
  }

  async deleteByIds(data: DeleteType) {
    return this.mindplug.post("/data/delete", {
      db: data.db,
      collection: data.collection,
      vectorIds: data.vectorIds
    }).then((res: any) => res.data).catch((err: any) => err.response.data);
  }

  async deleteByUploadId(data: DeleteUploadType) {
    return this.mindplug.post('/data/deleteupload', {
      db: data.db,
      collection: data.collection,
      uploadId: data.uploadId
    }).then((res: any) => res.data).catch((err: any) => err.response.data);
  }

  async query(data: QueryType) {
    return this.mindplug.post('/data/query', {
      db: data.db,
      collection: data.collection,
      search: data.search,
      count: data.count,
      metadataFilters: data.metadataFilters
    }).then((res: any) => res.data).catch((err: any) => err.response.data);
  }

  async queryByIds(data: QueryVectors) {
    return this.mindplug.post('/data/vectors', {
      db: data.db,
      collection: data.collection,
      vectorIds: data.vectorIds
    }).then((res: any) => res.data).catch((err: any) => err.response.data);
  }

  async queryByCollection(data: UniversalProps) {
    return this.mindplug.post('/collection/vectors', {
      db: data.db,
      collection: data.collection,
    }).then((res: any) => res.data).catch((err: any) => err.response.data);
  }

  async listProjects() {
    return this.mindplug.post('/db/list', {}).then((res: any) => res.data).catch((err: any) => err.response.data);
  }

  async deleteProject(data: ProjectType) {
    return this.mindplug.post('/db/delete', {db: data.db}).then((res: any) => res.data).catch((err: any) => err.response.data);
  }

  async listCollections(data: ProjectType) {
    return this.mindplug.post('/collection/list', {db: data.db}).then((res: any) => res.data).catch((err: any) => err.response.data);
  }

  async deleteCollection(data: UniversalProps) {
    return this.mindplug.post('/collection/delete', {
      db: data.db,
      collection: data.collection,
    }).then((res: any) => res.data).catch((err: any) => err.response.data);
  }

  async searchWeb(data: SearchWebType) {
    return this.mindplug.post('/smart/web', { search: data.search}).then((res: any) => res.data).catch((err: any) => err.response.data);
  }

  async parseWebpage(url: string) {
    return this.mindplug.post('/smart/parseWeb', { url }).then((res: any) => res.data).catch((err: any) => err.response.data);
  }

  async summarizeText(text: string, amountCharacters?: number) {
    return this.mindplug.post('/smart/summarize', {text, amountCharacters}).then((res: any) => res.data).catch((err: any) => err.response.data);
  }

  async oneLiner(text: string, instructions?: string) {
    return this.mindplug.post('/smart/oneLiner', {text, instructions}).then((res: any) => res.data).catch((err: any) => err.response.data);
  }
}
