const host = `http://localhost:3000`

$(document).ready(function(){
    search('jakarta')


})

$('.menu .item')
  .tab()
;

// let key = $('#inputSearch').val()

function search(key){
    
    $.ajax({
        method: 'GET',
        url: `${host}/zomato/${key}`,
        headers: {
            // token: localStorage.getItem(token)
        }
    })
    .done(function(datas){
        console.log(datas);
        $('#list').empty()
        datas.forEach(data => {
            $('#list').append(`
            <div class="card" style="margin:10px;">
            <div class="image">
                <img src=${data.restaurant.featured_image} style="height:250px; ">
            </div>
            <div class="content">
                <div class="header">${data.restaurant.name}</div>
                <div class="meta">
                    <a>${data.restaurant.cuisines}</a>
                </div>
                <div class="description">
                    ${data.restaurant.location.address}
                </div>
                <br>
                <div class="description">
                    *average cost for two Person: Rp. ${data.restaurant.average_cost_for_two}
                </div>
            </div>
            <div class="extra content">
                <span class="right floated">
                    ${data.restaurant.user_rating.votes} Votes
                </span>
                <span>
                    <i class="star icon"></i>
                    rating: ${data.restaurant.user_rating.aggregate_rating}/5
                </span>
            </div>
        </div>
            `)
        });
        
    })
    .fail(function(err){
        console.log(err);
        
    })

}