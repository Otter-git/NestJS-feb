import { Injectable } from '@nestjs/common';
import { getRandomInt } from '../news.service';

export type Comment = {
  id?: number;
  message: string;
  author: string;
};

export type CommentEdit = {
  message: string;
  author?: string;
};

@Injectable()
export class CommentsService {
  private readonly comments = {};

  create(idNews: number, comment: Comment) {
    if (!this.comments[idNews]) {
      this.comments[idNews] = [];
    }
    this.comments[idNews].push({ ...comment, id: getRandomInt() });
    return 'Комментарий создан';
  }

  find(idNews: number): Comment[] | null {
    return this.comments[idNews] || null;
  }

  edit(
    idNews: number,
    idComment: number,
    comment: CommentEdit,
  ): Comment | undefined {
    const indexEditedComment = this.comments[idNews].findIndex(
      (comment: Comment) => comment.id === idComment,
    );
    if (indexEditedComment !== -1) {
      this.comments[idNews][indexEditedComment] = {
        ...this.comments[idNews][indexEditedComment],
        ...comment,
      };

      return this.comments[idNews][indexEditedComment];
    }
    return undefined;
  }

  remove(idNews: number, idComment: number): Comment[] | null {
    if (!this.comments[idNews]) {
      return null;
    }
    const indexComment = this.comments[idNews].findIndex(
      (c) => c.id === idComment,
    );
    if (indexComment === -1) {
      return null;
    }
    return this.comments[idNews].splice(indexComment, 1);
  }
}
