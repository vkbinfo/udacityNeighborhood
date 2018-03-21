var favPlaces=[
    {
        name:"Diesel Cafe",
        geoLocation:{lat:12.873828, lng:74.852752},
        id:0
    },
    {
        name:"Crumbs",
        geoLocation:{lat:12.877424, lng:74.841844},
        id:1
    },
    {
        name:"Tide Cafe",
        geoLocation:{lat:12.875310,lng:74.840524},
        id:2
    },
    {
        name:"Lincoln Cafe",
        geoLocation:{lat:12.881044,lng:74.861724},
        id:3
    },
    {
        name:"Kadri Park",
        geoLocation:{lat:12.888945,lng:74.856276},
        id:4
    },
    {
        name:"Brio Café and Grill",
        geoLocation:{lat:12.872288,lng:74.844983},
        id:5
    }

]

var urlFourSquareStart="https://api.foursquare.com/v2/venues/search?"+
"client_id=C3L2LG1EZLNAPO2OXGREUS4FBRG3IRIOBZQTZKVN4YSPLODI&"+
"client_secret=F02TBDINCLW2V20N5SCZ2ZN5DNZEREI1HZ0SLGEPLFMLZNGY&"+
"v=20130815&limit=1&ll=";
var urlFourSquareEnd="&query=";




function viewModel(){
    var that = this;
    that.markers=markers;

    that.clickEventOnPlaceList=function(element){
        var marker=markers[element.id];
        infoWindow[element.id].open(map,marker);
    };
    //The most wonderful thing about computed and observable that
    //ko automatically update the searchResults whenever query (value of input
    // filed) is updated, Isn't it awesome.
    that.query = ko.observable('');
    that.searchResults = ko.computed(function() {
    var q = that.query().toLowerCase();
    return favPlaces.filter(function(i) {
        var queryExist= i.name.toLowerCase().indexOf(q) >= 0;
      return queryExist;
  });
});

//function to hide markers.
 that.Listmarkers=ko.computed(function(){
     var list=[];
     that.searchResults().forEach(function(data){
         list.push(data.id);
        });

     for(var i =0;i< favPlaces.length;i++){
         var marker=markers[i];
         if (list.includes(i)){
             marker.setMap(map);
         }
         else{
             marker.setMap(null);
        }
     };
    });

//let's use foursquare API
    that.gettingInfoAboutPlaces=function(){
    favPlaces.forEach(function(place){
        var name=place.name;
        var lat=place.geoLocation.lat;
        var lng=place.geoLocation.lng;
        var urlToGetJson=urlFourSquareStart+lat+","+lng+urlFourSquareEnd+name;
        $.getJSON(urlToGetJson).done(function(data){
            var placeData=data.response.venues[0];
            var addressArray=placeData.location.formattedAddress;
            var webLink="<div><a href='https://foursquare.com/v/"+placeData.id+
            "'>Web link for this place</a></div>";
            var addressString='';
            addressArray.forEach(function(element){
                addressString += element + ", ";
            });
            infoWindow[place.id].setContent("<div>"+name+"</div><div>"+
            addressString+"</div>"+webLink);

        }).fail(function(){
            console.log("iamhere");
            alert("Something went wrong with Internet.");
        })
    })
}
that.gettingInfoAboutPlaces();
};

var map;
var markers=[];
var infoWindow=[];
function initMap(){
    //let's create a google map object and we will do stuff there
    map = new google.maps.Map(document.getElementById('map'),
    {center:{lat:12.875310,lng:74.840524},zoom:13});
    // let's create a marker on map, which tells about some information
    favPlaces.forEach(function(data){
        var marker = new google.maps.Marker({
            position:data.geoLocation,
            map:map,
            title:data.name});
        var popupInfoWindow = new google.maps.InfoWindow({
            content: data.name
            });
        //now lets add a click listener to the marker object, so when we clicks
        // it pops up the information.
        infoWindow.push(popupInfoWindow);
        marker.addListener('click',function(){
            //now we have to bind the infoWindow, map and the marker, its great.
            popupInfoWindow.open(map,marker);
        });
        markers.push(marker);
    });
    //let's create a window, when someone clicks we can show some
    //information

    //we are setting our ko viewmodel, Because we need markers to manuplate on
    //the map.
    ko.applyBindings(new viewModel());
};


//error handling for google maps
function errorHandling() {
	alert("Google Maps has failed to load. Please check your internet connection and try again.");
}
