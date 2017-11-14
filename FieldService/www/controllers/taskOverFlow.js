app.controller('taskOverFlowController', function ($scope, $http, $state, $rootScope, cloudService, valueService, constantService, localService,ofscService) {

    $scope.myVar = false;

    $rootScope.Islogin = true;

    $rootScope.closed = false;

    $scope.ProductQuantity = 1;

    $scope.isFutureDate = valueService.getIfFutureDateTask();

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
                        center: { lat: -34.397, lng: 150.644 },
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

            valueService.setTask($scope.taskDetails);
        }
    });

    $scope.contacts = [
        {name: "Santiago Munez", No: "+(832)534678", email: "Santiago.munex@rolce.com"},
        {name: "Munex Montanio", No: "+(832)534678", email: "Santiago.munex@rolce.com"}
    ];

    $scope.tasks = [];

    $scope.defaultTasks = ["1/2 SOCKET", "Cage Retainer Tool", "Power Torque Erench", "Plyers", "3/4 SOCKET"];

    $scope.goToBack = function () {
        $state.go('myTask');
        $rootScope.selectedItem = 1;
        $rootScope.showTaskDetail = false;
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

    $scope.accept = function () {

        console.log("STATUS " + $scope.selectedTask.Task_Status);

        if ($scope.selectedTask.Task_Status == 'Assigned') {

            if (valueService.getNetworkStatus()) {

                valueService.acceptTask(valueService.getTask().Task_Number);

                $scope.selectedTask.Task_Status = "Accepted";
                var data = {
                    "resourceId": constantService.getUser().OFSCId,
                    "date": moment(new Date()).utcOffset(constantService.getTimeZone()).format('YYYY-MM-DD')
                };
                ofscService.activate_resource(data, function (response) {

                    if (response != undefined && response != null) {

                        console.log("ACTIVATE RESOURCE " + JSON.stringify(response));

                        var updateStatus =
                            {
                                "activityId": $scope.selectedTask.Activity_Id,
                                "XA_TASK_STATUS": "8"
                            }

                        ofscService.updateStatus(updateStatus, function (response) {

                            var activityDetails =
                                {
                                    "activityId": $scope.selectedTask.Activity_Id,
                                   
                                }

                            ofscService.activityDetails($scope.selectedTask.Activity_Id, function (response) {
                                if (response != undefined && response.items != undefined && response.items.length > 0) {
                                    angular.forEach(response.items, function (item) {
                                        var date = new Date(item.date);
                                        if (new Date(item.date).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0))
                                        {
                                            var startActivityData =
                                                {
                                                    "activityId": response.items[0].activityId,

                                                }
                                            ofscService.start_activity(startActivityData, function (response) {

                                            })
                                        }
                                    })
                                   
                                }

                            })
                        })
                    }
                });
                $rootScope.showAccept = false;

            } else {

                var taskObject = {
                    Task_Status: "Accepted",
                    Task_Number: valueService.getTask().Task_Number,
                    Submit_Status: "A",
                    Date: new Date()
                };

                localService.updateTaskSubmitStatus(taskObject);

                localService.getTaskList(function (response) {

                    constantService.setTaskList(response);
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
