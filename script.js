customElements.define('comment-box', class extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
      <style>
        /* Стили для блока комментариев */
        .comments {
          margin-top: 20px;
          border: 1px solid;
        }
        .comments .comment:nth-child(odd) + .comment{
          background-color: #f2f2f2;
        }
        textarea {
          width: 99%;
          resize: none;
        }
      </style>
      </p>
      <textarea id="commentInput" placeholder="Введите ваш комментарий" rows="4"></textarea>
      <button id="submitBtn">Отправить</button>
      <div class="comments"></div>
    `;
    shadowRoot.getElementById('submitBtn').addEventListener('click', () => {
      const comment = document.createElement('div');
      comment.className = 'comment';
      const commentTemplate = document.getElementById('commentTemplate');
      const content = commentTemplate.content.cloneNode(true);
      comment.appendChild(content);
      comment.querySelector('slot').textContent = shadowRoot.getElementById('commentInput').value;
      if (comment.querySelector('slot').textContent === "") {
        alert("Пустой комментарий");
      }
      else{
        shadowRoot.querySelector('.comments').appendChild(comment);
        shadowRoot.getElementById('commentInput').value = '';
      }
      this.setupListeners(comment);
    });
  }

  setupListeners(comment) {
    // Логика для кнопок внутри комментария
    comment.querySelector('.like-btn').addEventListener('click', () => {
      const count = comment.querySelector('.like-count');
      count.textContent = parseInt(count.textContent) + 1;
    });

    comment.querySelector('.delete-btn').addEventListener('click', () => {
      comment.remove();
    });

    comment.querySelector('.reply-btn').addEventListener('click', () => {
      const nestedComments = comment.querySelector('.nested-comments');
      const nestedCommentInput = document.createElement('textarea');
      nestedCommentInput.placeholder = 'Введите ваш комментарий';
      nestedComments.appendChild(nestedCommentInput);
      const nestedSubmitBtn = document.createElement('button');
      nestedSubmitBtn.textContent = 'Отправить';
      nestedComments.appendChild(nestedSubmitBtn);
      nestedSubmitBtn.addEventListener('click', () => {
        const nestedComment = document.createElement('div');
        nestedComment.className = 'comment';
        const commentTemplate = document.getElementById('commentTemplate');
        const content = commentTemplate.content.cloneNode(true);
        nestedComment.appendChild(content);
        nestedComment.querySelector('slot').textContent = nestedCommentInput.value;
        if (nestedComment.querySelector('slot').textContent === "") {
          alert("Пустой комментарий");
        }
        else{
          nestedComments.insertBefore(nestedComment, nestedCommentInput);
          nestedCommentInput.remove();
          nestedSubmitBtn.remove();
        }
        this.setupListeners(nestedComment);
      });
    });
  }
});