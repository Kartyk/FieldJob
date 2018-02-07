app.controller('todoController', function ($scope, $http, $state, $rootScope, cloudService, valueService, localService, ofscService, constantService) {

    $scope.myVar = false;

    $rootScope.Islogin = true;

    $rootScope.closed = false;

    $scope.ProductQuantity = 1;

    // $scope.isFutureDateInTodo = valueService.getIfFutureDateTask();
    $scope.isFutureDate = valueService.getIfFutureDateTask();

    $scope.toggle = function () {

        $scope.myVar = !$scope.myVar;
    };

    $scope.noteArray = [];

    $scope.taskId = valueService.getTask().Task_Number;

    $scope.noteArray = valueService.getTaskNotes();

    $scope.attachmentArray = valueService.getTaskAttachment();

    $scope.attachments = [];

    angular.forEach($scope.attachmentArray, function (attachment) {

        var attachmentObject = {};

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

            fs.root.getFile(attachment.File_Name, { create: true, exclusive: false }, function (fileEntry) {

                fileEntry.file(function (file) {

                    var reader = new FileReader();

                    reader.onloadend = function () {

                        console.log("Successful file read: " + this.result);

                        attachment.base64 = this.result.split(",")[1];

                        attachment.contentType = attachment.File_Type;

                        attachment.filename = attachment.File_Name.split(".")[0];

                        attachment.Date_Created = attachment.Created_Date;

                        attachment.filetype = attachment.File_Name.split(".")[1];

                        $scope.$apply();
                    };

                    reader.readAsDataURL(file);
                });
            });
        });
    });

    $scope.openResource = function (item) {

        valueService.openFile(item.File_Path + item.File_Name, item.File_Type);
    };

    $scope.contacts = [
        { name: "Santiago Munez", No: "+(832)534678", email: "Santiago.munex@rolce.com" },
        { name: "Munex Montanio", No: "+(832)534678", email: "Santiago.munex@rolce.com" }
    ];

    $scope.tasks = [];

    $scope.defaultTasks = [];

    $scope.goToBack = function () {
        $state.go('myTask');
    };

    $scope.toolList = [];

    $scope.toolList = valueService.getTool();

    $scope.add = function () {

        console.log()

        if ($scope.title != "" && $scope.title != undefined) {

            var toolObject = {
                ID: $scope.taskId + "" + ($scope.toolList.length + 1),
                Tool_Name: $scope.title,
                Task_Number: $scope.taskId
            };

            $scope.toolList.push(toolObject);

            localService.deleteTool($scope.taskId);
            localService.insertToolList($scope.toolList, function (response) {

                $scope.TodoForm.title.$setPristine();
                $scope.TodoForm.title.$setPristine(true);
                $scope.title = '';
            });
        }
    };

    $scope.delete = function () {

        $scope.toolList.splice(this.$index, 1);

        var i = 1;

        angular.forEach($scope.toolList, function (response) {

            response.ID = $scope.taskId + "" + i;

            i++;

            console.log("DELETE " + JSON.stringify(response));
        });

        localService.deleteTool($scope.taskId);

        localService.insertToolList($scope.toolList, function (response) {

            $scope.TodoForm.title.$setPristine();
            $scope.TodoForm.title.$setPristine(true);
            $scope.title = '';
        });
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

    $scope.mapClicked = function () {
        $scope.mapIsClicked = !$scope.mapIsClicked;
    }

    $scope.startWork = function () {

        if ($scope.selectedTask.Task_Status == 'Accepted') {

            if (valueService.getNetworkStatus()) {

                $rootScope.dbCall = true;

                valueService.startWorking(valueService.getTask(), function () {

                    $scope.selectedTask.Task_Status = "Working";

                    $rootScope.showWorkingBtn = false;

                    $rootScope.dbCall = false;

                    cloudService.getTaskInternalList("1", function (response) {

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
               // valueService.showDialog("Accept");
            }
        }
    }

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

                    cloudService.getTaskInternalList("1", function (response) {

                        $state.go($state.current, {}, { reload: true });

                        $scope.selectedTask.Task_Status = "Accepted";
                    });
                });

            } else {

                var taskObject = {
                    Task_Status: "Accepted",
                    Task_Number: valueService.getTask().Task_Number,
                    Submit_Status: "P",
                    Date: new Date(),
                    Sync_Status: "PA"
                };
              //  valueService.showDialog("Accept");
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
