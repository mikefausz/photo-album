var appTemplates = {};

// DID NOT IMPLEMENT
appTemplates.albumCovers = [
  "<script type='text/template' id='albumCoverTempl'>",
    <a rel="album-view" id="<%= title %>" href="#">
      <li class="album-box">
        <div class="album-div" style="background-image: url(<%= coverUrl %>)">
            <div class="tint">
            </div>
            <div class="thumb-caption">
              <h1><%= title %></h1>
            </div>
          </div>
      </li>
    </a>
  </script>].join("");

appTemplates.albumPhotos = [

<script type="text/template" id="albumPhotoTempl">
  <a rel="photo-view" id="<%= title %>" href="#">
    <li class='photo-box'>
      <div class='photo-div' style='background-image: url( <%= url %> )'>
        <div class='tint'>
        </div>
      </div>
      <div class='thumb-caption'>
        <h1 class='title'> <%= title %> </h1>
        <!-- <% if (typeof(author) !== "undefined") { %> -->
          <h2 class='author'> <%= author %> </h2>
        <!-- <% } %> -->
      </div>
    </li>
  </a>
</script>].join("");
