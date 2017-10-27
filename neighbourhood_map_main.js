var viewModel = function() {

            const places_object = {
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


            }




            var self = this;

            self.mapper = {
                "temple": "https://d30y9cdsu7xlg0.cloudfront.net/png/2364-200.png",
                "heritage": "http://neo-environmental.co.uk/wp-content/uploads/heritage_icon.png",
                "market": "https://d30y9cdsu7xlg0.cloudfront.net/png/100392-200.png"
            }

            // observable to hold location when the initial list is filtered
            self.filtered_list = ko.observableArray();
            // observable to hold information about initial locations
            self.all_locations = ko.observableArray();
            // observable to hold text input,this observable is subsribed to the onchange function
            self.inputvalue = ko.observable('');
            // onservable which toggles display of initial locations
            self.main_locations = ko.observable(true);
            // observable when no results are found
            self.nonresults = ko.observable(false);
            // observable to hold the info about the location clicked
            self.mapinfo = ko.observable("Places To Visit In Kathmandu Valley");
            // get all locations on script loads
            get_all_location(self.all_locations, places_object);
            // declaring variable to hold array of markers
            self.visible_marker_array
            self.onchangefunction = function() {
                // remove any previously filtered locations
                $(".filtered_locations").children("div").remove();
                // sets nonresults as false which may have occured from previous searches
                self.nonresults(false);
                // remove all the markers from map 
                // this makes sure all the markers are removed when any input is received
                // also remove not found html from any previous searches
                remove_marker(self.visible_marker_array);
                // if the user types any character  in input box
                if (self.inputvalue().length > 0) {
                    // reinitialise filtered list observable array
                    self.filtered_list([]);
                    // loop through array of all locations
                    for (var i = 0; i < self.all_locations().length; i++) 
                    {
                        // the first location object
                        var place_object = self.all_locations()[i];
                        // console.log(place_object);
                        // check if the input string is in the name property
                        if (self.all_locations()[i][0].name.toLowerCase().indexOf(self.inputvalue().toLowerCase()) != -1) {
                            // remove all the markers from map 
                            remove_marker(self.visible_marker_array);
                            // console.log("inside loop");
                            // push the location inside filtered list
                            self.filtered_list.push(place_object);
                            // highlight the search term
                            highlight_search_term(".filtered_locations",self.inputvalue())
                            // some result has occured,hide initial list
                            self.main_locations(false);
                            // make a marker of the selected location
                            self.visible_marker_array = make_marker(self.filtered_list());



                        } 
                        else {
                            // no results found,hide initial list and show no results found in non
                            // results observable
                            self.main_locations(false);
                            self.nonresults(true); 
                            

                        }

                    
                }

                
            }
            else {
                    // input has been cleared
                    // make all initial markers
                    self.visible_marker_array = make_marker(self.all_locations());
                    // show initial location list
                    self.main_locations(true);
                    // hide no results
                    self.nonresults(true);
                    // set map info observable to initial text
                    self.mapinfo("Places To Visit In Kathmandu Valley");
                    // console.log("inside else");
                    


                }

        }
    }


        var VM = new viewModel();
        ko.applyBindings(VM);

        VM.inputvalue.subscribe(function() {
            VM.onchangefunction();
        });


                /**
        * @description gets all locations from object and pushes
            the object inside observable
        * @param {array} observable array from which to extract the locations
        * @param {object} object which holds diffeerent locations
        * @returns  undefined
        */
        function get_all_location(observable_array, places_object) {

            console.log(places_object);
            // loop through all places in places_object
            for (place in places_object) {
                console.log(place);
                // hold a array of all locations inside a place
                number_of_places = places_object[place][0].locations;
                console.log(number_of_places);
                for (i = 0; i < number_of_places.length; i++) {
                    console.log(observable_array());
                    observable_array.push(number_of_places[i])
                }
            }
        }


               /**
        * @description makes markers on the map from a observable array of locations
        and sets content on infowindow and adds click listener on the marker
        * @param {array} observable array
        
        * @returns {array} an array of markers
        */
        function make_marker(array) {
            console.log(array);
            var visible_marker_array = [];
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
                set_content_from_wikipedia(infowindow, item[0].name);
                console.log(infowindow.contentText);
                marker.addListener('click', function() {
                    infowindow.open(map, marker);
                    toggleBounce(marker);

                });
                //console.log(item[1].position);
                visible_marker_array.push(marker);
                // map.setCenter(item[1].position);
            });
            return visible_marker_array
        }

         /* @description removes markers on the map from a observable array of locations
        * @param {array} observable array 
        
        * @returns undefined 
        */

        function remove_marker(array) {
            array.forEach(function(item) {
                item.setMap(null);
                // map.setCenter(item[1].position);
            });

        }

        function animate_marker_on_click(data) {
            // console.log(data[1].position.lat);
            var array = VM.visible_marker_array;
            var marker = get_marker_reference(data, array);
            // console.log(marker);
            // console.log(content);
            var content = marker.infowindow.contentText;
            VM.mapinfo(content);
            google.maps.event.addListener(marker, 'click', toggleBounce(marker));

        }

         /* @description gets the marker reference
        * @param {object} object associated with the item in loop
          @param {array} observable array or array
        
        
        * @returns {object} marker object
        */

        function get_marker_reference(data, array) {
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
                    return array[i]
                    console.log("marker"+array[i])
                    break

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
            }
        }


          /* @description sets content for infowindow on marker,
          queries the wikipedia api and sets results on dom and marker infowindow
        * @param {object} marker infowindow
          @param {string} string to send in a ajax call
        
        
        * @returns {} undefined
        */
        function set_content_from_wikipedia(infowindow, place_name) {
            // pass
            var endpoint = " https://en.wikipedia.org/w/api.php";
            var self = this;
            $.ajax({
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

                success: function(data) {
                    // console.log(data);
                    // get the page id from the results
                    var first_page_id = Object.keys(data.query.pages)[0];
                    // get the content in property extract
                    var content = data.query.pages[first_page_id].extract;
                    // set short content for marker
                    var info_content = "<p>Data provided by Wikipedia</p>" + data.query.pages[first_page_id].extract.slice(0, 200) + "...."+ "<br><br><br>click on list view to see the details";
                    // console.log(data.query.pages[first_page_id].extract);
                    infowindow.setContent(info_content);
                    // set full content for associated dom
                    infowindow.contentText = "<p class='wikiheading' >Data provided by Wikipedia</p>" + content


                },
                // in case it fails
                fail:function(){
                    infowindow.contentText="Oops looks like you we are unable to retrieve the location data";
                    infowindow.setContent("Oops looks like you we are unable to retrieve the location data");
                },
            });

        }

        /* @description highlights the search term on the dom element text
        * @param {string} class name of div which contains the list of locations name
          @param {string} input from search field
        
        
        * @returns {object} marker object
        */
        function highlight_search_term(container,input){
            var array_of_text_containers=$(container).find("li");
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

        // register a click function on icon to show
        // input field on small screen

        $(document).ready(function(){
            $(".closing_icon").on("click",function(){
                $(".closing_icon").toggleClass("glyphicon-remove-circle");
                $(".search-section").toggle("display");

            });
        })

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
            VM.visible_marker_array = make_marker(VM.all_locations());

        }
