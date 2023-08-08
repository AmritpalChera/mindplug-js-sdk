
export interface ISDKProps {
  mindplugKey: string;
  openaiKey?: string;
}

type JSONAny = {
  [key: string]: any
}

export interface UniversalProps {
  db: string;
  collection: string;
}

export interface StorePropBaseTypes extends UniversalProps {
  metadata?: JSONAny;
  chunkSize?: number;
}

export interface StoreProps extends StorePropBaseTypes {
  content: string;
  vectorId?: string;
}

export interface StoreFileProps extends StorePropBaseTypes {
  file: File;
}

export interface StoreWebProps extends StorePropBaseTypes {
  url: string;
}

export interface DeleteType extends UniversalProps {
  vectorIds: string[];
}

export interface DeleteUploadType extends UniversalProps {
  uploadId: string;
}

export interface QueryType extends UniversalProps {
  search: string;
  count: number;
  metadataFilters?: JSONAny;
}

export interface QueryVectors extends UniversalProps {
  vectorIds: string[];
}

export interface ProjectType {
  db: string;
}

export interface SearchWebType {
  search: string;
}