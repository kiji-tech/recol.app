import { MetaData } from './MetaData';

export type LocationContentsType = {
  fieldId: string;
  contents: string;
  title: string;
  url: string;
  metaData?: MetaData;
};

export type ProductContentsType = {
  fieldId: string;
  contents: string;
  title: string;
  amazonUrl: string;
  rakutenUrl: string;
  metaData?: MetaData;
};

export type CategoryType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  name: string;
};

export type EyecatchType = {
  url: string;
  height: number;
  width: number;
};

export type ArticleType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  content: string;
  location: string;
  locationContentsList: LocationContentsType[];
  productContentList: ProductContentsType[];
  category?: CategoryType;
  eyecatch?: EyecatchType;
};

export class LocationContents {
  fieldId: string;
  contents: string;
  title: string;
  url: string;
  metaData?: MetaData;

  constructor(data: LocationContentsType) {
    this.fieldId = data.fieldId;
    this.contents = data.contents;
    this.title = data.title;
    this.url = data.url;
    this.metaData = data.metaData;
  }
}

export class ProductContents {
  fieldId: string;
  contents: string;
  title: string;
  amazonUrl: string;
  rakutenUrl: string;
  metaData?: MetaData;

  constructor(data: ProductContentsType) {
    this.fieldId = data.fieldId;
    this.contents = data.contents;
    this.title = data.title;
    this.amazonUrl = data.amazonUrl;
    this.rakutenUrl = data.rakutenUrl;
    this.metaData = data.metaData;
  }
}

export class Category {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  name: string;

  constructor(data: CategoryType) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.publishedAt = data.publishedAt;
    this.revisedAt = data.revisedAt;
    this.name = data.name;
  }
}

export class Eyecatch {
  url: string;
  height: number;
  width: number;

  constructor(data: EyecatchType) {
    this.url = data.url;
    this.height = data.height;
    this.width = data.width;
  }
}

export class Article {
  id: string = '';
  createdAt: string = '';
  updatedAt: string = '';
  publishedAt: string = '';
  revisedAt: string = '';
  title: string = '';
  content: string = '';
  location: string = '';
  locationContentsList: LocationContents[] = [];
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

  constructor(data: ArticleType) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.publishedAt = data.publishedAt;
    this.revisedAt = data.revisedAt;
    this.title = data.title;
    this.content = data.content;
    this.location = data.location;
    this.locationContentsList =
      data.locationContentsList &&
      data.locationContentsList.map((locationContents) => new LocationContents(locationContents));
    this.productContentList =
      data.productContentList &&
      data.productContentList.map((productContent) => new ProductContents(productContent));
    this.category = data.category ? new Category(data.category) : undefined;
    this.eyecatch = data.eyecatch ? new Eyecatch(data.eyecatch) : undefined;
  }
}
