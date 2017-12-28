app.controller('taskOverFlowController', function ($scope, $http, $state, $rootScope, cloudService, valueService, constantService, localService, ofscService, $translate) {

    $scope.myVar = false;

    $rootScope.Islogin = true;

    $rootScope.closed = false;

    $scope.ProductQuantity = 1;

    $scope.isFutureDate = valueService.getIfFutureDateTask();

    $rootScope.showDebrief = false;

    $rootScope.selectedCategory = 'Field Service';

    changeLanguage(valueService.getLanguage());

    function changeLanguage(lang) {

        valueService.setLanguage(lang);

        switch (lang) {
            case "en":
                $translate.use('en').then(function () {
                    console.log('English Used');
                });
                break;
            case "fr":
                $translate.use('fr').then(function () {
                    console.log('french Used');
                });
                break;
            case "ch":
                $translate.use('jp').then(function () {
                    console.log('Chinese Used');
                });
                break;
            case "":
                $translate.use('en').then(function () {
                    console.log('English Used');
                });
                break;
            default:
                break;
        }
    }

    $scope.toggle = function () {
        $scope.myVar = !$scope.myVar;
    };

    if ($scope.selectedTask.Task_Status == 'Assigned') {
        $rootScope.accepted = false;
    } else {
        $rootScope.accepted = true;
    }

    $scope.taskId = $rootScope.selectedTask.Task_Number;

    $scope.taskDetails = $rootScope.selectedTask;

    valueService.setTaskId($scope.taskDetails.Task_Number);

    $scope.isVisible = false;

    var map = null;

    var geoCoder = null;

    var customerAddress = null;

    setValues();

    function setValues() {

        if (valueService.getNetworkStatus()) {

            if (valueService.getTask().Country == "People's Republic of China" || valueService.getTask().Country.toLowerCase() == "china") {

                $scope.isChina = true;

                customerAddress = $scope.taskDetails.Street_Address + "," + $scope.taskDetails.City;

                if (customerAddress.match(/[\u3400-\u9FBF]/)) {

                    $scope.isBaidu = true;

                } else {

                    $scope.isBaidu = false;
                }

            } else {

                $scope.isChina = false;

                $scope.first = true;
            }
        }
    }

    $scope.mapClicked = function () {

        if (valueService.getNetworkStatus()) {

            console.log("CLICK " + map);

            $scope.isVisible = !$scope.isVisible;

            $scope.mapIsClicked = !$scope.mapIsClicked;

            visibleMap();
        }
    };

    function visibleMap() {

        if ($scope.isChina) {

            if ($scope.isBaidu) {

                baiduMap();

            } else {

                questMap();
            }

        } else {

            if ($scope.first) {

                googleMap();

                $scope.first = false;
            }
        }
    }

    function baiduMap() {

        console.log("CUSTOMER ADDRESS" + customerAddress);

        if (BMap != undefined) {

            map = new BMap.Map("baiduMap");

            geoCoder = new BMap.Geocoder();

            var longitude = 118.807395;

            var latitude = 32.065315;

            var contextMenu = new BMap.ContextMenu();
           
            map.enableScrollWheelZoom();

            map.enableKeyboard();

            map.disableDoubleClickZoom();

            map.addControl(new BMap.NavigationControl());

            map.addControl(new BMap.MapTypeControl({
                mapTypes: [
                    BMAP_NORMAL_MAP,
                    BMAP_HYBRID_MAP
                ]
            }));

            geoCoder.getPoint(customerAddress, function (point) {

                console.log("POINT " + JSON.stringify(point));

                if (point) {

                    longitude = point.lng;

                    latitude = point.lat;                
                }

                var pointer = new BMap.Point(longitude, latitude);

                var marker = new BMap.Marker(pointer);

                map.addOverlay(marker);

                map.centerAndZoom(pointer, 14);
            });
        }
    }

    function questMap() {

        if (L != undefined) {

            L.mapquest.key = 'E1jRKUfN0osMSzrInmuAH2glsmHmneU3';

            L.mapquest.geocoding().geocode(customerAddress, createMap);

            function createMap(error, response) {

                var location = response.results[0].locations[0];

                var latLng = location.displayLatLng;

                map = L.mapquest.map('map', {
                    center: latLng,
                    layers: L.mapquest.tileLayer('map'),
                    zoom: 14
                });

                var customIcon = L.mapquest.icons.circle({
                    primaryColor: '#3b5998'
                });

                L.marker(latLng, { icon: customIcon }).addTo(map);
            }
        }
    }

    function googleMap() {

        if (google != undefined) {

            map = new google.maps.Map(document.getElementById('googleMap'), {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8
            });

            if (map != null) {

                geoCoder = new google.maps.Geocoder();

                geoCoder.geocode({
                    'address': $scope.taskDetails.Zip_Code
                }, function (results, status) {

                    if (status == google.maps.GeocoderStatus.OK) {

                        var latitude = results[0].geometry.location.lat();

                        var longitude = results[0].geometry.location.lng();

                        var latlng = new google.maps.LatLng(latitude, longitude);

                        map.setCenter(latlng);

                        //map.setCenter(results[0].geometry.location);

                        var marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location
                        });

                    } else {

                        console.log("GOOGLE GEOCODER ERROR");
                    }
                });

                google.maps.event.trigger(document.getElementById('googleMap'), 'resize');
            }
        }
    }

    var contactArray = valueService.getContact();

    $scope.taskDetails.Contacts = contactArray;

    constantService.setUserEmailId(contactArray);

    $scope.taskDetails.InstallBase = [];

    angular.forEach(valueService.getInstallBase(), function (key, value) {

        if (key.Task_Number == $scope.taskId) {

            var install = {};

            install.Product_Line = key.Product_Line;
            install.Serial_Number = key.Serial_Number;
            install.tagNo = key.TagNumber;
            install.orginalNo = key.Original_PO_Number;
            install.Item_Number = key.Item_Number;
            install.Description = key.Description;

            $scope.taskDetails.InstallBase.push(install);

            $rootScope.selectedTask = $scope.taskDetails;

            valueService.setTask($scope.taskDetails, function (response) {

            });
        }
    });

    $scope.contacts = [
        { name: "Santiago Munez", No: "+(832)534678", email: "Santiago.munex@rolce.com" },
        { name: "Munex Montanio", No: "+(832)534678", email: "Santiago.munex@rolce.com" }
    ];

    $scope.tasks = [];

    $scope.defaultTasks = ["1/2 SOCKET", "Cage Retainer Tool", "Power Torque Erench", "Plyers", "3/4 SOCKET"];

    $scope.goToBack = function () {

        if (valueService.getUserType().defaultView == "My Task") {

            $state.go("myFieldJob");
            $rootScope.selectedItem = 2;
            $rootScope.showTaskDetail = false;

        } else {

            $state.go("myTask");
            $rootScope.selectedItem = 1;
            $rootScope.showTaskDetail = false;
        }

    };

    $scope.goToOnsiteReq = function () {
        $state.go('todo');
    };

    $scope.add = function () {

        $scope.tasks.push($scope.title);
        //$scope.title='';
        $scope.TodoForm.title.$setPristine();
        $scope.TodoForm.title.$setPristine(true);
        $scope.title = '';
    };

    $scope.delete = function () {
        $scope.tasks.splice(this.$index, 1);
    };

    $scope.items = [];

    $scope.addItem = function () {

        $scope.items.push($scope.item);
        $scope.MaterialForm.item.$setPristine();
        $scope.MaterialForm.item.$setPristine(true);
        $scope.item = '';
    };

    $scope.deleteItem = function () {

        $scope.items.splice(this.$index, 1);
    };

    $scope.startWork = function () {

        if ($scope.selectedTask.Task_Status == 'Accepted') {

            if (valueService.getNetworkStatus()) {

                $rootScope.dbCall = true;

                valueService.startWorking(valueService.getTask(), function () {

                    $scope.selectedTask.Task_Status = "Working";

                    $rootScope.showWorkingBtn = false;

                    $rootScope.dbCall = false;

                    cloudService.getTaskInternalList("0", function (response) {

                        $state.go($state.current, {}, { reload: true });
                    });
                });

            } else {

                var taskObject = {
                    Task_Status: "Working",
                    Task_Number: valueService.getTask().Task_Number,
                    Submit_Status: "A",
                    Date: new Date()
                };

                localService.updateTaskSubmitStatus(taskObject, function (result) {

                    localService.getTaskList(function (response) {

                        localService.getInternalList(function (internalresponse) {

                            angular.forEach(internalresponse, function (item) {

                                var internalOFSCJSONObject = {};

                                internalOFSCJSONObject.Start_Date = item.Start_time;
                                internalOFSCJSONObject.End_Date = item.End_time;
                                internalOFSCJSONObject.Type = "INTERNAL";
                                internalOFSCJSONObject.Customer_Name = item.Activity_type;
                                internalOFSCJSONObject.Task_Number = item.Activity_Id;

                                response.push(internalOFSCJSONObject);
                            });

                            constantService.setTaskList(response);

                            $rootScope.showWorkingBtn = false;

                            $state.go($state.current, {}, { reload: true });

                        });
                    });
                });
            }
        }
    };

    $scope.accept = function () {

        console.log("STATUS " + $scope.selectedTask.Task_Status);

        if ($scope.selectedTask.Task_Status == 'Assigned') {

            if (valueService.getNetworkStatus()) {

                $rootScope.dbCall = true;

                valueService.acceptTask(valueService.getTask(), function (result) {

                    $rootScope.showAccept = false;

                    $rootScope.showWorkingBtn = true;

                    $rootScope.dbCall = false;
                    $scope.selectedTask.Task_Status = "Accepted";
                    cloudService.getTaskInternalList("0", function (response) {

                        $state.go($state.current, {}, { reload: true });
                        $scope.selectedTask.Task_Status = "Accepted";
                    });
                });

            } else {

                var taskObject = {
                    Task_Status: "Accepted",
                    Task_Number: valueService.getTask().Task_Number,
                    Submit_Status: "A",
                    Date: new Date()
                };

                localService.updateTaskSubmitStatus(taskObject, function (result) {

                    localService.getTaskList(function (response) {

                        localService.getInternalList(function (internalresponse) {

                            angular.forEach(internalresponse, function (item) {

                                var internalOFSCJSONObject = {};

                                internalOFSCJSONObject.Start_Date = item.Start_time;
                                internalOFSCJSONObject.End_Date = item.End_time;
                                internalOFSCJSONObject.Type = "INTERNAL";
                                internalOFSCJSONObject.Customer_Name = item.Activity_type;
                                internalOFSCJSONObject.Task_Number = item.Activity_Id;

                                response.push(internalOFSCJSONObject);
                            });

                            constantService.setTaskList(response);

                            $rootScope.showAccept = false;

                            $rootScope.showWorkingBtn = true;

                            $scope.selectedTask.Task_Status = "Accepted";

                            $state.go($state.current, {}, { reload: true });

                        });
                    });
                });
            }
        }
    };
});

// var geocoder; //global variable for GEOCoder
//
// var map; //global variable for Baidu Map
//
// function initialize() {
//
//     //get map-canvas as Baidu Map painting area
//
//     map = new BMap.Map("map");
//
//     var point = newBMap.Point(116.30814954222, 40.056885091681);
//
//     map.centerAndZoom(point, 16); //you have centralize the map
//
//     map.addControl(newBMap.NavigationControl()); //add Navigation Controller
//
//     map.addControl(new BMap.MapTypeControl()); //add Map Type Controller
//
//     map.addControl(new BMap.OverviewMapControl()); //add Overview Map Controller
//
//     map.enableScrollWheelZoom(); //scroll wheel zoom is not working well in Mac book
//
//     map.removeControl(CopyrightControl);
//
//     map.addOverlay(new BMap.Marker(point)); //create new maker
//
//     geocoder = new BMap.Geocoder(); //create new GEO coder //add event listener depends on needs.
//
//     map.addEventListener('zoomend', function () {
//
//     });
//
//     //show content in InfoWindow
//     function createInfoWindowContent(address, latlng) {
//
//         return [address, 'LatLng:' + latlng.lat + ',' + latlng.lng].join('');
//     }
//
//     //Convert new address into Map Marker on Baidu Map
//     function codeAddress() {
//
//     }
//
//     var address = "chennai";
//
//     geocoder.getPoint(address, function (point) {
//
//         alert(point.lat + point.lng);
//
//         //if the GEO coder error, then it will return null.
//         if (point) {
//
//             map.centerAndZoom(point, 16);
//
//             var marker = new BMap.Marker(point);
//
//             map.addOverlay(marker);
//
//             var opts = {
//                 width: 250,
//                 height: 50
//             };
//
//             var infoWindow = newBMap.InfoWindow(createInfoWindowContent(address, point), opts);
//
//             map.openInfoWindow(infoWindow, map.getCenter());
//         }
//     });
// }
//
// initialize(); //Call initialize function
// var customerAddress = {
//     addressComponent: {
//         city: 'city name',
//         district: 'County name',
//         province: 'name of province',
//         street: 'street name',
//         streetNumber: 'house number'
//     },
//     cityCode: 'city code'
// };
//google.maps.event.trigger(document.getElementById('map'), 'resize');
