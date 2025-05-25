import { MetaData } from './MetaData';

export type LocationContents = {
  fieldId: string;
  contents: string;
  title: string;
  url: string;
  metaData?: MetaData;
};

export type ProductContents = {
  fieldId: string;
  contents: string;
  title: string;
  amazonUrl: string;
  rakutenUrl: string;
  metaData?: MetaData;
};

export type Article = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  content: string;
  location: string;
  locationContentsList?: LocationContents[];
  productContentList?: ProductContents[];
  category?: {
    id: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    revisedAt: string;
    name: string;
  };
  eyecatch?: {
    url: string;
    height: number;
    width: number;
  };
};
