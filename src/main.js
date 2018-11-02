$( document ).ready(function() {
  let token = localStorage.getItem('token')
  if (!token) {
      window.location = './index.html'
  }
  gapi.load('auth2', function() {
    gapi.auth2.init();
  });



  console.log( "ready gos!" );
  
  function getHighlight(url) {
    return new Promise ((resolve, reject) => {
      $.ajax({
        url : url,
        method : "GET"
      })
      .done((data) => {
        const filterData = data.map(content => {
          const newContent = {};
          newContent.author = content.author;
          newContent.title = content.title;
          newContent.content = content.content;
          newContent.description = content.description;
          newContent.url = content.url;
          newContent.img = content.urlToImage;
          return newContent;
        }).filter(data => (data.img !== null && data.author !== null && data.content !== null && data.description !== null && data.title !== null))
        
        $.each(filterData, (index, value) => {
          $("#newsList").append(`<div id="newsContent" class="card">
                                <img class="card-img-top" src="${filterData[index].img}" alt="${filterData[index].title}">
                                <div class="card-body">
                                  <a class="card-title readMore text-black" href="#" id="${filterData[index].title}">${filterData[index].title}</a>
                                  <p class="card-text">${filterData[index].description}</p>
                                </div>
                                </div> `) 
        })
        resolve(filterData);
      })
      .catch((err) => {
        reject(err)
      })
    })
      
  }

  getHighlight(`http://localhost:3000/news`);

  $(".category").click(function() {
    $("#newsList").empty();
    console.log(this.id);
    getHighlight(`http://localhost:3000/news/${this.id}`)
    .then((data) => {
      console.log(data)
    })
    .catch(err => {
      resizeBy.status(500).json({
        err : err
      })
    })
    //getHighlight(`http://localhost:3000/news/${this.id}`)
  })

  $("#query").keyup(function(){
    $("#newsList").empty();
    console.log(this.value);
    getHighlight(`http://localhost:3000/news/search/${this.value}`)
    .then((data) => {
      console.log(data);
    })
    .catch(err => {
      res.status(500).json({
        err : err
      })
    })
  });

  function getDetailHighlight(url) {
    return new Promise ((resolve, reject) => {
      $.ajax({
        url : url,
        method : "GET"
      })
      .done((data) => {
        const filterData = data.map(content => {
          const newContent = {};
          newContent.author = content.author;
          newContent.title = content.title;
          newContent.content = content.content;
          newContent.description = content.description;
          newContent.url = content.url;
          newContent.img = content.urlToImage;
          return newContent;
        }).filter(data => (data.img !== null && data.author !== null && data.content !== null && data.description !== null && data.title !== null))
        resolve(filterData);
      })
      .catch((err) => {
        reject(err)
      })
    })
      
  }

  $("#newsList").on('click', '.readMore', event => {
    const title = $(event.currentTarget).attr('id');
    $("#newsList").empty();
    getDetailHighlight(`http://localhost:3000/news`)
    .then((data) => {
      const filterData = data.filter(content => content.title == title);
      $.each(filterData, (index, value) => {
        const content = filterData[index].content.split('[');
        $("#newsList").append(`<div id="newsContent" class="card">
                              <img class="card-img-top" src="${filterData[index].img}" alt="${filterData[index].title}">
                              <div class="card-body">
                                <h5 class="card-title">${filterData[index].title}</h5>
                                <p class="card-text">Author : ${filterData[index].author}</p>
                                <p class="card-text">${filterData[index].description}</p>
                                <p class="card-text">${content[0]}<a href="${filterData[index].url}">Read More</a></p>
                              </div>
                              </div> `) 
      })
    })
    .catch(err => {
      console.log(err);
      
    })
  })
  
});