import { Injectable } from '@nestjs/common';

export interface News {
  id?: number;
  title: string;
  description: string;
  author: string;
  countView?: number;
}

export interface NewsEdit {
  title?: string;
  description?: string;
  author?: string;
  countView?: number;
}

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

@Injectable()
export class NewsService {
  private readonly news: News[] = [
    {
      id: 1,
      title: 'First news',
      description: 'Hurray',
      author: 'frog',
      countView: 12,
    },
  ];

  create(news: News): News {
    const id = getRandomInt(0, 99999);
    const finallNews = {
      ...news,
      id: id,
    };
    this.news.push(finallNews);
    return finallNews;
  }

  find(id: News['id']): News | undefined {
    return this.news.find((news) => news.id === id);
  }

  edit(id: number, news: NewsEdit): News | undefined {
    const indexEditedNews = this.news.findIndex((news) => news.id === id);
    if (indexEditedNews !== -1) {
      this.news[indexEditedNews] = {
        ...this.news[indexEditedNews],
        ...news,
      };

      return this.news[indexEditedNews];
    }
    return undefined;
  }

  getAll(): News[] {
    return this.news;
  }

  remove(id: News['id']): boolean {
    const indexRemoveNews = this.news.findIndex((news) => news.id === id);
    if (indexRemoveNews !== -1) {
      this.news.splice(indexRemoveNews, 1);
      return true;
    }
    return false;
  }
}
