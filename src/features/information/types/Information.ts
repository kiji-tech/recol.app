export type ImageType = {
  url: string;
  height: number;
  width: number;
};

export type InformationType = {
  id: string;
  title: string;
  body: string;
  startAt: string;
  endAt: string | undefined;
  image: ImageType | undefined;
  detailUrl: string | undefined;
  platform: string[] | undefined;
  isNotification: boolean;
};

/**
 * 画像クラス
 */
export class Image {
  url: string = '';
  height: number = 0;
  width: number = 0;

  constructor(data: ImageType) {
    this.url = data.url;
    this.height = data.height;
    this.width = data.width;
  }
}

/**
 * お知らせクラス
 */
export class Information {
  id: string = '';
  title: string = '';
  body: string = '';
  startAt: string = '';
  endAt: string | undefined;
  isNotification: boolean = true;
  image: Image | undefined;
  detailUrl: string | undefined;
  platform: string[] | undefined;

  constructor(data: InformationType) {
    this.id = data.id;
    this.title = data.title;
    this.body = data.body;
    this.startAt = data.startAt;
    this.endAt = data.endAt;
    this.image = data.image ? new Image(data.image) : undefined;
    this.detailUrl = data.detailUrl;
    this.platform = data.platform;
    this.isNotification = data.isNotification;
  }
}
