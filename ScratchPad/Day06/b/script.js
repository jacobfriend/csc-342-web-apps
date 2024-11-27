const howls = [
    {
      user: "@student",
      message: "This is a sample howl. #example"
    },
    {
      user: "@graduate",
      message: "Another sample howl for the feed!"
    },
    {
      user: "@student",
      message: "This is a sample howl. #example"
    },
    {
      user: "@faculty",
      message: "This is a sample howl. #example"
    },
    {
      user: "@student",
      message: "This is a sample howl. #example"
    },
    {
      user: "@graduate",
      message: "This is a sample howl. #example"
    },
    {
      user: "@graduate",
      message: "Yet another howl to showcase the feed layout."
    }
  ];
  
  const howlList = document.querySelector('#howl-list');

    howls.forEach(howl => {
        let newHowl = document.createElement("div");
        newHowl.className = "howl container";

        let user = document.createElement("div");
        user.className = 'user';
        user.textContent = `${howl.user}`;

        let content = document.createElement("div");
        content.className = 'content';
        content.textContent = `${howl.message}`;
        
        let actions = document.createElement("div");
        actions.className = 'actions';
        
        let like = document.createElement("a");
        let rehowl = document.createElement("a");
        let reply = document.createElement("a");
        reply.textContent = "Reply";
        rehowl.textContent = "Rehowl";
        like.textContent = "Like";

        actions.appendChild(reply);
        actions.appendChild(rehowl);
        actions.appendChild(like);
        newHowl.appendChild(user);
        newHowl.appendChild(content);
        newHowl.appendChild(actions);
        howlList.appendChild(newHowl);
    });

  /* HTML to Create
  <div class="howl container">
    <div class="user">@user3</div>
    <div class="content">Yet another howl to showcase the feed layout.</div>
    <div class="actions">
      <a href="#">Reply</a>
      <a href="#">Rehowl</a>
      <a href="#">Like</a>
    </div>
  </div>
  */
  