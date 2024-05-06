export type AuthorDto = {
  uuid: string;
  name: string;
};

export type GeneralNoticeDto = {
  id: number;
  title: string;
  author: AuthorDto;
  createdAt: Date;
  tags: string[];
  views: number;
  langs: string[];
  content: string;
  isReminded: boolean;
  deadline: Date | null;
  currentDeadline: Date | null;
  imageUrls?: string[];
  documentUrls?: string[];
};

export type GetNoticeReturn = {
  total: number;
  list: GeneralNoticeDto[];
};
