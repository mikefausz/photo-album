$(document).ready(function () {

var createAlbumCoverTempl = function(album) {
  var albumCoverTempl = _.template($('#albumCoverTempl').html());
  return albumCoverTempl(album);
};

var setTopViewHtml = function() {
  var albumCovers = getAlbumCovers(albums);
  var topViewHtml = "";
  _.each(albumCovers, function(albumCover) {
    topViewHtml += createAlbumCoverTempl(albumCover);
  });
  $('.top-view').find('.album-covers').html(topViewHtml);
};

var getAlbumCovers = function(albums) {
  var albumCoversArr = [];
  albumCoversArr = albums.map(function(album) {
    return {
      title: album.title,
      coverUrl: album.coverUrl,
    };
  });
  return albumCoversArr;
};

// alternate album cover getters

// var getAlbumCoverUrl = function(album) {
//   var albumCoverObj = album.photos.filter(function(photo) {
//     return photo.album_cover === true;
//   });
//   return albumCoverObj[0].url;
// }

// var getAlbumCoverUrl = function(album) {
//   return album.coverUrl;
// }

var setAlbumViewNav = function() {
  var albumTitleHtml = "";
  _.each(albums, function(album) {
    albumTitleHtml += "<a rel='album-view' id='" + album.title + "' href='#'><li>"+ album.title + "</li></a>";
  });
  $('#album-titles', '.album-view').html(albumTitleHtml);
};

var createAlbumPhotoTempl = function(photo) {
  var albumPhotoTempl = _.template($('#albumPhotoTempl').html());
  return albumPhotoTempl(photo);
};

var setAlbumViewHtml = function(albumTitle) {
  var albumPhotos = getAlbumPhotos(albumTitle);
  var albumViewHtml = "";
    _.each(albumPhotos, function(photo) {
      albumViewHtml += createAlbumPhotoTempl(photo);
    });
  $('.album-view').find('.album-photos').html(albumViewHtml);
};

var getAlbumPhotos = function(albumTitle) {
  var albumPhotos = albums.filter(function(album) {
    return album.title === albumTitle;
  });
  return albumPhotos[0].photos;
};

var grabNewPhoto = function() {
  var title = $('input[name="title"]').val();
  var author = $('input[name="author"]').val();
  var url = $('input[name="url"]').val();
  $('input[type="text"]').val("");
  return {
    title: title,
    author: author,
    url: url,
  };
};

var getCurrentAlbum = function() {
  var currentAlbumTitle = $('.album-view').attr('id');
  var currentAlbumArr = albums.filter(function(album) {
    return album.title === currentAlbumTitle;
  });
  return currentAlbumArr[0];
};

var setPhotoViewHtml = function(title, author, imageUrl) {
  var photoInfoHtml = "<h2>" + title + "</h2>"
    + "<h3>" + author +"</h3>";
  $('.photo-view').find('.photo-info').html(photoInfoHtml);
  $('.photo-view').css({'background-image': imageUrl});
};

// on link click
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
      var title = $(this).find($('.title')).text();
      var author = $(this).find($('.author')).text();
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
      var nextTitle = $nextPhoto.find('.title').text();
      var nextAuthor = $nextPhoto.find('.author').text();
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
      var prevTitle = $prevPhoto.find('.title').text();
      var prevAuthor = $prevPhoto.find('.author').text();
      var prevImageUrl = $prevPhoto.find('.photo-div').css('background-image');
      setPhotoViewHtml(prevTitle, prevAuthor, prevImageUrl);
      $prevPhoto.addClass('current-photo');
      $currentPhoto.removeClass('current-photo');
    }
    // if make cover button clicked, make current background url coverUrl
    else if (selectedPage === ".make-cover") {
      var currentPhotoBg = $('.photo-view').css('background-image');
      var currentPhotoUrl = currentPhotoBg.replace('url("', '').replace('")', '');
      getCurrentAlbum().coverUrl = currentPhotoUrl;
    }
    else {
      setTopViewHtml();
    }
});

// on add photo button click
$('form').on("submit", function(event) {
    event.preventDefault();
    // get info from input boxes and append to html
    var newPhoto = grabNewPhoto();
    var currentAlbum = getCurrentAlbum();
    getCurrentAlbum().photos.push(newPhoto);
    setAlbumViewHtml(currentAlbum.title);
    if ($('input[name="make-cover"]').prop('checked')) {
      getCurrentAlbum().coverUrl = newPhoto.url;
      $('input[name="make-cover"]').prop('checked', false);
    }
});

setTopViewHtml();
});
