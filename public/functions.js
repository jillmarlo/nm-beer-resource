console.log('Main JS file');
function toBeers(){
    console.log("in toBeers");
    $.ajax({
        url: '/beers',
        type: 'GET',
        success: function(result){
            // window.location.replace("./");
            console.log(result);
        }
    })
}

function updateBeer(id){
    $.ajax({
        url: '/beers/' + id,
        type: 'PUT',
        data: $('#update-beer').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
}

function updateBrewery(id){
    $.ajax({
        url: '/brewery/' + id,
        type: 'PUT',
        data: $('#update-brewery').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
}

function updateStyle(id){
    $.ajax({
        url: '/style/' + id,
        type: 'PUT',
        data: $('#update-style').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
}

function updateFlavor(id){
    $.ajax({
        url: '/flavor/' + id,
        type: 'PUT',
        data: $('#update-flavor').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
}

function deleteBeer(id){
    console.log('delete beer', id);
    $.ajax({
        url: '/beers/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
}

function deleteBrewery(id){
    $.ajax({
        url: '/brewery/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
}

function deleteStyle(id){
    $.ajax({
        url: '/style/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
}

function deleteFlavor(id){
    $.ajax({
        url: '/flavor/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
}