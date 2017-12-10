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

    displayMap();

    function displayMap() {

        console.log(valueService.getTask());

        if (valueService.getTask().Country == "People's Republic of China") {

            if (valueService.getNetworkStatus()) {

                var map = new BMap.Map("allmap");

                map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);

                map.addControl(new BMap.MapTypeControl({
                    mapTypes: [
                        BMAP_NORMAL_MAP,
                        BMAP_HYBRID_MAP
                    ]
                }));

                map.setCurrentCity("??");

                map.enableScrollWheelZoom(true);
            }
            $scope.chinaUser = true;

        } else {

            $scope.chinaUser = false;
        }
    }

    $(function () {

        var mapClose = true;

        var firstload = true;

        var map;

        $('#mapToggle').click(function () {

            if (firstload) {
                if (valueService.getNetworkStatus()) {
                    map = new google.maps.Map(document.getElementById('map'), {
                        center: {lat: -34.397, lng: 150.644},
                        zoom: 8
                    });

                    firstload = false;

                    codeAddress($scope.taskDetails.Zip_Code);
                }
            }

            if (mapClose) {

                if ($scope.chinaUser == false) {
                    if (valueService.getNetworkStatus()) {
                        document.getElementById('map').style.display = "block";

                        google.maps.event.trigger(document.getElementById('map'), 'resize');

                        mapClose = false;
                    }

                } else {

                    document.getElementById('allmap').style.display = "block";

                    mapClose = false;
                }

            } else {

                if ($scope.chinaUser == false) {

                    document.getElementById('map').style.display = "none";

                    mapClose = true;

                } else {

                    document.getElementById('allmap').style.display = "none";

                    mapClose = true;
                }
            }
        });

        function codeAddress(address) {

            var geocoder = new google.maps.Geocoder();

            geocoder.geocode({
                'address': address
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
                    /*alert("Geocode was not successful for the following reason: " + status);*/
                }
            });
        }
    });

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

            $scope.taskDetails.InstallBase.push(install);

            $rootScope.selectedTask = $scope.taskDetails;

            valueService.setTask($scope.taskDetails, function (response) {

            });
        }
    });

    $scope.contacts = [
        {name: "Santiago Munez", No: "+(832)534678", email: "Santiago.munex@rolce.com"},
        {name: "Munex Montanio", No: "+(832)534678", email: "Santiago.munex@rolce.com"}
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
    }

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

                valueService.startWorking(valueService.getTask().Task_Number, function () {

                    $scope.selectedTask.Task_Status = "Working";

                    cloudService.OfscActions($scope.selectedTask.Activity_Id, true, function (response) {

                        $rootScope.showWorkingBtn = false;

                        $rootScope.dbCall = false;

                        var taskObject = {
                            Task_Status: "Working",
                            Task_Number: valueService.getTask().Task_Number,
                            Submit_Status: "I",
                            Date: new Date()
                        };

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

                                $state.go($state.current, {}, { reload: true });

                            });
                        });
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

                            $state.go($state.current, {}, { reload: true });

                            $rootScope.showWorkingBtn = false;

                        });
                    });
                });
            }
        }
    }

    $scope.accept = function () {

        console.log("STATUS " + $scope.selectedTask.Task_Status);

        if ($scope.selectedTask.Task_Status == 'Assigned') {

            if (valueService.getNetworkStatus()) {

                $rootScope.dbCall = true;

                valueService.acceptTask(valueService.getTask().Task_Number, function () {

                    $scope.selectedTask.Task_Status = "Accepted";

                    updateStatus = {
                        "activity_id": $scope.selectedTask.Activity_Id,
                        "XA_TASK_STATUS": "8"
                    };

                    //SIT
                    //updateStatus = {
                    //    "activity_id": $scope.selectedTask.Activity_Id,
                    //    "XA_TASK_STATUS": "8"
                    //};

                    ofscService.updateStatus(updateStatus, function (response) {

                        $rootScope.showAccept = false;
                        $rootScope.showWorkingBtn = true;
                        $rootScope.dbCall = false;
                    });

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

                            $state.go($state.current, {}, { reload: true });
                        });
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

                            $state.go($state.current, {}, { reload: true });
                            
                        });
                    });
                });
            }
        }
    };

    $scope.mapClicked = function () {

        $scope.mapIsClicked = !$scope.mapIsClicked;
    };
});

// angular.forEach(valueService.getContact(), function (key, value) {
//
//     var contactObj = {};
//
//     contactObj.Contact_Name = key.Contact_Name;
//     contactObj.Home_Phone = key.Home_Phone;
//     contactObj.Mobile_Phone = key.Mobile_Phone;
//     contactObj.Fax_Phone = key.Fax_Phone;
//     contactObj.Office_Phone = key.Office_Phone;
//     contactObj.Email = key.Email;
//
//     contactArray.push(contactObj);
//
// });
