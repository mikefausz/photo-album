// $(document).ready(function () {
  var setTopViewHtml = function() {
  var albumCovers = getAlbumCovers(albums);
  var topViewHtml = "<ul>";
    albumCovers.forEach(function(albumCover) {
      topViewHtml += "<a rel='album-view' id='" + albumCover.title + "' href='#'>"
          + "<li class='album-box'>"
            + "<div class='album-div' style='background-image: url(" + albumCover.cover_url + ")'>"
              + "<div class='tint'>"
              + "</div>"
              + "<div class='thumb-caption'>"
                + "<h2>" + albumCover.title + "</h2>"
              + "</div>"
            + "</div>"
          + "</li>"
        "</a>"
    });
    topViewHtml += "</ul>";
  $('.top-view').find('.container').html(topViewHtml);
};

var getAlbumCovers = function(albums) {
  var albumCoversArr = [];
  albumCoversArr = albums.map(function(album) {
    return {
      title: album.title,
      cover_url: getAlbumCoverUrl(album),
    };
  });
  return albumCoversArr;
};

var getAlbumCoverUrl = function(album) {
  var albumCoverObj = album.photos.filter(function(photo) {
    return photo.album_cover === true;
  });
  return albumCoverObj[0].url;
}


var setAlbumViewNav = function() {
  var albumTitleHtml = "<ul><a rel='top-view' href='#'><li><i class='fa fa-th'></i></li></a>"
  albums.forEach(function(album) {
    albumTitleHtml += "<a rel='album-view' id='" + album.title + "' href='#'><li>"+ album.title + "</li></a>";
  });
  albumTitleHtml += "</ul><a rel='new-photo-drop' href='#'><li><i class='fa fa-plus-square'></i></li></a>"
    + "<form action='index.html' method='post'>"
      + "<div class='new-photo'>"
        + "<input type='text' id='title' placeholder='Title'/>"
      + "</div>"
      + "<div class='new-photo'>"
        + "<input type='text' id='author' placeholder='Author'/>"
      + "</div>"
      + "<div class='new-photo'>"
        + "<input type='text' id='url' placeholder='URL'/>"
      + "</div>"
      + "<div class='button new-photo'>"
        + "<button type='add-photo'>Add Photo</button>"
      + "</div>"
    + "</form>";
  $('nav', '.album-view').html(albumTitleHtml);
};

var setAlbumViewHtml = function(albumTitle) {
  var albumPhotos = getAlbumPhotos(albumTitle);
  var albumViewHtml = "<ul class='album-photos'>";
    albumPhotos.forEach(function(photo) {
      albumViewHtml += "<a rel='photo-view' id='" + photo.title + "' href='#'>"
        + "<li class='photo-box'>"
          + "<div class='photo-div' style='background-image: url(" + photo.url + ")'>"
            + "<div class='tint'>"
            + "</div>"
          + "</div>"
          + "<div class='thumb-caption'>"
            + "<h2 class='title'>" + photo.title + "</h2>"
            + "<h3 class='author'>" +photo.author + "</h3>"
          + "</div>"
        + "</li>"
      + "</a>";
    });
    albumViewHtml += "</ul>";
  $('.album-view').find('.container').html(albumViewHtml);
}

var getAlbumPhotos = function(albumTitle) {
  var albumPhotos = albums.filter(function(album) {
    return album.title === albumTitle;
  });
  return albumPhotos[0].photos;
}

var grabNewPhoto = function() {
  var title = $('input[id="title"]').val();
  var author = $('input[id="author"]').val();
  var url = $('input[id="url"]').val();
  $('input[type="text"]').val("");
  return {
    title: title,
    author: author,
    url: url,
    album_cover: false,
  };
}

var getCurrentAlbum = function() {
  var currentAlbumTitle = $('.album-view').attr('id');
  var currentAlbumArr = albums.filter(function(album) {
    return album.title === currentAlbumTitle;
  });
  return currentAlbumArr[0];
}

var setPhotoViewHtml = function(title, author, imageUrl) {
  var photoInfoHtml = "<li><h2>" + title + "</h2></li>"
    + "<li><h3>" + author +"</h3></li>";
  $('.photo-view').find('.photo-info').html(photoInfoHtml);
  $('.photo-view').css({'background-image': imageUrl});
}

// on click
var $navItem = $('body').find('a');
$('body').on("click", 'a', function(event) {
    event.preventDefault();
    // toggle visible class for related page
    var selectedPage = "." + $(this).attr('rel');
    $(selectedPage).siblings().removeClass('visible');
    $(selectedPage).addClass('visible');
    // if album-view link clicked, load in selected album photos
    if (selectedPage === ".album-view") {
      setAlbumViewNav();
      var selectedAlbumTitle = $(this).attr('id');
      $(selectedPage).attr('id', selectedAlbumTitle);
      setAlbumViewHtml(selectedAlbumTitle);
    }
    // if add photo icon clicked, show form
    if (selectedPage === ".new-photo-drop") {
      if ( $( "form" ).is( ":hidden" ) ) {
        $( "form" ).slideDown( "slow" );
      }
      else {
        $( "form" ).slideUp( "slow" );
      }
    }
    // if photo-view clicked, change background to selected photo
    else if (selectedPage === ".photo-view") {
      $(this).addClass('current-photo');
      $(this).siblings().removeClass('current-photo');
      var title = $(this).find($('h2')).text();
      var author = $(this).find($('h3')).text();
      var imageUrl = $(this).find('.photo-div').css('background-image');
      setPhotoViewHtml(title, author, imageUrl);
    }
    // if next photo arrow clicked, load next photo in album
    else if (selectedPage === ".next-photo" ) {
      var $currentPhoto = $('.current-photo');
      // determine if there is another photo in album
      if ($('.current-photo').next().length) {
        var $nextPhoto = $currentPhoto.next();
      }
      // if not, wrap to first photo in album
      else {
        var $nextPhoto = $currentPhoto.siblings().first();
      }
      var nextTitle = $nextPhoto.find('h2').text();
      var nextAuthor = $nextPhoto.find('h3').text();
      var nextImageUrl = $nextPhoto.find('.photo-div').css('background-image');
      setPhotoViewHtml(nextTitle, nextAuthor, nextImageUrl);
      $nextPhoto.addClass('current-photo');
      $currentPhoto.removeClass('current-photo');
    }
    // if previous photo arrow clicked, load previous photo in album
    else if (selectedPage === ".prev-photo") {
      var $currentPhoto = $('.current-photo');
      // determine if there is a previous photo
      if ($('.current-photo').prev().length) {
        var $prevPhoto = $currentPhoto.prev();
      }
      // if not, wrap to last photo in album
      else {
        var $prevPhoto = $currentPhoto.siblings().last();
      }
      var prevTitle = $prevPhoto.find('h2').text();
      var prevAuthor = $prevPhoto.find('h3').text();
      var prevImageUrl = $prevPhoto.find('.photo-div').css('background-image');
      setPhotoViewHtml(prevTitle, prevAuthor, prevImageUrl);
      $prevPhoto.addClass('current-photo');
      $currentPhoto.removeClass('current-photo');
    }
});

// on add photo button click
$('body').on("click", 'button', function(event) {
    event.preventDefault();
    // get info from input boxes and append to html
    var newPhoto = grabNewPhoto();
    var currentAlbum = getCurrentAlbum();
    currentAlbum.photos.push(newPhoto);
    setAlbumViewHtml(currentAlbum.title);
});

setTopViewHtml();
// });
