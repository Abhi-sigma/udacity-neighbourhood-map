var ViewModel = function() {

    var placeObject = {
        "kathmandu": [

            {
                "locations": [
                    [{
                            "name": "Pashupatinath Temple"
                        },
                        {
                            "position": {
                                lat: 27.7104641,
                                lng: 85.34868879999999
                            }
                        },
                        {
                            "type": "temple"
                        }
                    ],
                    // add an array of objects to add location
                    [{
                            "name": "Swayambhunath"
                        },
                        {
                            "position": {
                                lat: 27.8104641,
                                lng: 85.34868879999999
                            }
                        },
                        {
                            "type": "temple"
                        }
                    ],
                    [{
                            "name": "Thamel"
                        },
                        {
                            "position": {
                                lat:  27.71539,
                                lng: 85.31232899999998
                            }
                        },
                        {
                            "type": "market"
                        }
                    ]
                ]
            },
            // use another array to put other locations,
            // put comma after array and put name,position,type
            {
                "coords": {
                    lat: 27.700769,
                    lng: 85.300140
                }
            }
        ],
        "bhaktapur": [{
                "locations": [
                    [{
                            "name": "Bhaktapur Durbar Square"
                        },
                        {
                            "position": {
                                lat: 27.672115,
                                lng: 85.42833900000005
                            }
                        },
                        {
                            "type": "heritage"
                        }
                    ],
                    [{
                            "name": "Patan Durbar Square"
                        },
                        {
                            "position": {
                                lat: 27.682115,
                                lng: 85.42933900000003
                            }
                        },
                        {
                            "type": "heritage"
                        }
                    ]
                ]

            },

            {
                "coords": {
                    lat: 27.700769,
                    lng: 85.300140
                }
            }
        ]


    };




    var self = this;

    self.mapper = {
        "temple": "https://d30y9cdsu7xlg0.cloudfront.net/png/2364-200.png",
        "heritage": "http://neo-environmental.co.uk/wp-content/uploads/heritage_icon.png",
        "market": "https://d30y9cdsu7xlg0.cloudfront.net/png/100392-200.png"
    };

    // observable to hold location when the initial list is filtered
    self.filteredList = ko.observableArray();
    // observable to hold information about initial locations
    self.allLocations = ko.observableArray();
    // observable to hold text input,this observable is subsribed to the onchange function
    self.inputValue = ko.observable('');
    // onservable which toggles display of initial locations
    self.mainLocations = ko.observable(true);
    // observable when no results are found
    self.nonresults = ko.observable(false);
    // observable to hold the info about the location clicked
    self.mapinfo = ko.observable("Places To Visit In Kathmandu Valley");
    // get all locations on script loads
    getAllLocation(self.allLocations, placeObject);
    // declaring variable to hold array of markers
    self.visibleMarkerArray=[];
    // obseravles for displaying map errors
    self.mapError=ko.observable("");
    self.isMapError=ko.observable(false);
    self.smallScreen=ko.observable("false");
    // observable for toggling icons on small screen
    self.isTabsCollapsed=ko.observable(false);
    self.onchangefunction = function() {
        // remove any previously filtered locations
        self.filteredList([]);
        // sets nonresults as false which may have occured from previous searches
        self.nonresults(false);
        // remove all the markers from map 
        // this makes sure all the markers are removed when any input is received
        removeMarker(self.visibleMarkerArray);
        // if the user types any character  in input box
        if (self.inputValue().length > 0) {
            // reinitialise filtered list observable array
            // loop through array of all locations
            for (var i = 0; i < self.allLocations().length; i++) 
            {
                // the first location object
                var place_object = self.allLocations()[i];
                // console.log(place_object);
                // check if the input string is in the name property
                if (self.allLocations()[i][0].name.toLowerCase().indexOf(self.inputValue().toLowerCase()) != -1) {
                    // remove all the markers from map 
                    removeMarker(self.visibleMarkerArray);
                    // console.log("inside loop");
                    // push the location inside filtered list
                    self.filteredList.push(place_object);
                    // highlight the search term
                    highlightSearchTerm(".filtered_locations",self.inputValue());
                    // some result has occured,hide initial list
                    self.mainLocations(false);
                    // make a marker of the selected location
                    self.visibleMarkerArray = makeMarker(self.filteredList());
                } 
                else {
                    // no results found,hide initial list and show no results found in non
                    // results observable
                    self.mainLocations(false);
                    self.nonresults(true); 
                    

                }

            
        }

        
    }
    else {
            // input has been cleared
            // make all initial markers
            self.visibleMarkerArray = makeMarker(self.allLocations());
            // show initial location list
            self.mainLocations(true);
            // hide no results
            self.nonresults(true);
            // set map info observable to initial text
            self.mapinfo("Places To Visit In Kathmandu Valley");
            // console.log("inside else");
            


        }

};
};


var VM = new ViewModel();
ko.applyBindings(VM);

VM.inputValue.subscribe(function() {
    VM.onchangefunction();
});


        /**
* @description gets all locations from object and pushes
    the object inside observable
* @param {array} observable array from which to extract the locations
* @param {object} object which holds diffeerent locations
* @returns  undefined
*/
function getAllLocation(observable_array, placeObject) {

    console.log(placeObject);
    // loop through all places in placeObject
    for (var place in placeObject) {
        if(placeObject.hasOwnProperty(place)){
        console.log(place);
        // hold a array of all locations inside a place
        var number_of_places = placeObject[place][0].locations;
        console.log(number_of_places);
        for (i = 0; i < number_of_places.length; i++) {
            console.log(observable_array());
            observable_array.push(number_of_places[i]);
        }
    }
    }
}


       /**
* @description makes markers on the map from a observable array of locations
and sets content on infowindow and adds click listener on the marker
* @param {array} observable array

* @returns {array} an array of markers
*/
function makeMarker(array) {
    console.log(array);
    // initialise a empty array
    // this is an array that always hold all the markers
    // currently on screen
    var visibleMarkerArray = [];
    // loop through each item in observable array and push
    // inside visible marker array
    array.forEach(function(item) {
        var marker = new google.maps.Marker({
            position: item[1].position,
            animation: google.maps.Animation.DROP,
            map: map
        });
        var infowindow = new google.maps.InfoWindow({

        });
        // setting a infowindow property on marker
        // this property can be accessed by calling infowindow on marker
        marker.infowindow = infowindow;
        setContentFromWikipedia(infowindow, item[0].name);
        // console.log(infowindow.contentText);
        google.maps.event.addListener(marker,'click', function() {
            infowindow.open(map, marker);
            toggleBounce(marker);

        });
        //console.log(item[1].position);
        visibleMarkerArray.push(marker);
        // map.setCenter(item[1].position);
    });
    return visibleMarkerArray;
}

 /* @description removes markers on the map from a observable array of locations
* @param {array} observable array 

* @returns undefined 
*/

function removeMarker(array) {
    array.forEach(function(item) {
        item.setMap(null);
        // map.setCenter(item[1].position);
    });

}

function animateMarkerOnClick(data) {
    // console.log(data[1].position.lat);
    var array = VM.visibleMarkerArray;
    var marker = getMarkerReference(data, array);
    console.log(marker);
    console.log(content);
    var content = marker.infowindow.contentText;
    console.log(content);
    VM.mapinfo(content);
    map.setCenter(marker.getPosition());
    toggleBounce(marker);

}

 /* @description gets the marker reference
* @param {object} object associated with the item in loop
  @param {array} observable array or array


* @returns {object} marker object
*/

function getMarkerReference(data, array) {
    for (var i = 0; i < array.length; i++) {
        // console.log(data[1].position.lat);
        // console.log(array[0].position.lat());
        // console.log(data[0].name + " : " + array[i].position.lat());
        // console.log(data[0].name + " : " + array[i].position.lng());
        var marker_lat = data[1].position.lat;
        var marker_lng = data[1].position.lng;
        // console.log(marker_lat);
        // console.log(marker_lng);
        if (marker_lat == array[i].position.lat() && marker_lng == array[i].position.lng()) {
            return array[i];

        }

    }

}
// sets an animation,
function toggleBounce(marker) {
    // check for any previous animation
    if (marker.getAnimation() !== null) {
        // if any animation present,remove it
        marker.setAnimation(null);
        // if not, add animation
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function()
            {
                marker.setAnimation(null);
                marker.infowindow.close();
            },2100);
    }
}


  /* @description sets content for infowindow on marker,
  queries the wikipedia api and sets results on dom and marker infowindow
* @param {object} marker infowindow
  @param {string} string to send in a ajax call


* @returns {} undefined
*/
function setContentFromWikipedia(infowindow, place_name) {
    // pass
    var endpoint = " https://en.wikipedia.org/w/api.php";
    var self = this;
    var request=$.ajax({
        url: endpoint,
        type: 'GET',
        data: {
            "action": "query",
            "format": "json",
            "prop": "extracts",
            "explaintext": "",
            "exintro": "",
            "exlimit": "max",
            "redirects": "",
            "titles": place_name,


        },
        async: true,
        cache: false,
        crossDomain: true,
        dataType: 'jsonp',
        // timeout:10000
        // had to set this as workaround since jsonp request doesnt invoke
        // fail method,timeout secs is more than enough time to retrieve data
        // the wikipedia api responds with success even with no results,
        // that case is handled by if condition in success function,whereas
        // this timeout can deal with other errors like network error.
        // tested this by blocking api url in chrome
        
        // update:after reviewers suggestion,upgraded to jquery version 2.2.4
        // and fail method works.yipeee..

    });
    request.done(function(data){
        // some results
        if(data.query){
            // get the page id from the results
            var first_page_id = Object.keys(data.query.pages)[0];
            // get the content in property extract
            var content = data.query.pages[first_page_id].extract;
            // set short content for marker
            var info_content = "<p>Data provided by Wikipedia</p>" + data.query.pages[first_page_id].extract.slice(0, 200) + "...."+ "<br><br><br>click on list view to see the details";
            // console.log(data.query.pages[first_page_id].extract);
            infowindow.setContent(info_content);
            // set full content for associated dom
            infowindow.contentText = "<p class='wikiheading' >Data provided by Wikipedia</p>" + content;
            
        }
        // zero results
        else{
             // alert("in sucess")
             infowindow.contentText="<p class='error-text'>ERROR: Oops looks like  we "+
              "are unable to retrieve the location data....</p>";
             infowindow.setContent("error:Oops looks like  we are unable to retrieve the location data");
            
        }
    });

    request.fail(function(jqXHR,textStatus){
        // alert("fail");
        console.log("error");
        VM.mapinfo("Error in loading location data from wikipedia...");
        infowindow.contentText="<p class='error-text'>ERROR: Oops looks like  we are unable to retrieve the location data</p>";
        infowindow.setContent("error:Oops looks like  we are unable to retrieve the location data");

    });

}

/* @description highlights the search term on the dom element text
* @param {string} class name of div which contains the list of locations name
  @param {string} input from search field


* @returns {object} marker object
*/
function highlightSearchTerm(container,input){
    var array_of_text_containers=$(container).find(".location_name");
    console.log(typeof(array_of_text_containers));
    $.each(array_of_text_containers,function(index,item){
    console.log((item));
    var text=$(item).text();
    // console.log(text);
    // console.log(input);
        $(item).html(function(){
            return input ?
        text.replace(new RegExp('('+input+')','gi'), '<span style="color:red">$1</span>')
       : text;
        });
    });
}

// toggles input on small screen
function toggleIcon(){
    if(VM.isTabsCollapsed() === true){
        $(".search-section").toggle("display");
        VM.isTabsCollapsed(false);
    }
    else{
        $(".search-section").toggle("display");
        VM.isTabsCollapsed(true);
    }
}

// callback function on map error
function mapError(err){
    VM.isMapError(true);
    VM.mapError("<img class='error-gif' src='https://media.giphy.com/media/gMq5BfFDVXi8M/giphy.gif'><p class='error-text'>"+
        "Sorry,Maps not loaded,try again <br> Reason:  "+err+"</p>" );

}

//callback function for google maps load 
function initMap() {
    // Create a map object and specify the DOM element for display.
    var kathmandu = {
        lat: 27.700769,
        lng: 85.300140
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: kathmandu,
        zoom: 10
    });
    VM.visibleMarkerArray = makeMarker(VM.allLocations());

}
