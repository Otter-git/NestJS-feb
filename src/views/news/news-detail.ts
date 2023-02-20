import { News } from '../../news/news.service';
import { CreateCommentDto } from 'src/news/comments/dtos/create-comments-dto';

export function renderNewsDetails(news: News, comments: CreateCommentDto[]) {
  const newsHtml = renderNewsBlock(news);
  let commentsListHtml = '';
  if (comments) {
    for (const comment of comments) {
      commentsListHtml += renderCommentsBlock(comment);
    }
  }
  return `
    <h1>Подробности</h1>
    <div>
      ${newsHtml}
      <div style="display: flex; flex-wrap: wrap">
        ${commentsListHtml}
      </div>
    </div>
  `;
}

function renderNewsBlock(news: News) {
  return `
  <div class="row">
  <div class = "col-lg-4 m-2">
    <div class="card">
      ${
        news.cover
          ? `<img class="card-img-top" src="${news.cover}" alt="...">`
          : ''
      }
      <div class="card-body">
        <h5 class="card-title">${news.title}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${news.author}</h6>
        <p class="card-text">${news.description}</p>
      </div>
    </div>
  </div>
  </div>
  `;
}

function renderCommentsBlock(comment: CreateCommentDto) {
  return `
  <div class="m-2">
    <div class="card">
      <div class="card-body">
        ${
          comment?.avatar
            ? `<img src="${comment.avatar}" style="background: #ccc; width: 75px; height: 75px; object-fit: cover;"/>`
            : '<div style="background: #ccc; width: 75px; height: 75px;" class="rounded-lg"></div>'
        }
        <h5 class="card-title">${comment.id}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${comment.author}</h6>
        <p class="card-text">${comment.message}</p>
      </div>
    </div>
  </div>
  `;
}
