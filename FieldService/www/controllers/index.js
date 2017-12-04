app.controller('indexController', function ($q, $scope, $state, $timeout, $mdSidenav, $mdDialog, $translate, $rootScope, usSpinnerService, cloudService, localService, valueService, constantService, ofscService) {

    $scope.onlineStatus = false;

    $rootScope.dbCall = false;

    $rootScope.Islogin = false;

    $scope.userName = "";

    if (valueService.getNetworkStatus()) {

        $scope.onlineStatus = true;

    } else {

        $scope.onlineStatus = false;
    }

    $scope.spinnerLoading = true;

    $rootScope.closed = false;

    $rootScope.selectedCategory = 'Field Service';

    $scope.collapsedClass = "";

    $scope.franceFlag = true;

    $scope.chinaFlag = true;

    $scope.stopSpin = function () {

        console.log('Stop Spinner');

        usSpinnerService.stop('spinner-1');
    };

    $scope.openLeftMenu = function () {

        console.log('show');

        $mdSidenav('left').toggle();
    };

    $scope.changeLanguage = function (lang) {

        valueService.setLanguage(lang);

        switch (lang) {

            case "en":

                $scope.usFlag = false;
                $scope.franceFlag = true;
                $scope.chinaFlag = true;

                $translate.use('en').then(function () {
                    console.log('English Used');
                });

                $('#calendar').fullCalendar('destroy');

                $rootScope.eventInit("en");

                break;

            case "fr":

                $scope.usFlag = true;
                $scope.franceFlag = false;
                $scope.chinaFlag = true;

                $translate.use('fr').then(function () {

                    console.log('French Used');

                    $('#calendar').fullCalendar('destroy');

                    $rootScope.eventInit("fr");
                });

                break;

            case "ch":

                $scope.usFlag = true;
                $scope.franceFlag = true;
                $scope.chinaFlag = false;

                $translate.use('jp').then(function () {

                    console.log('Chinese Used');

                    $('#calendar').fullCalendar('destroy');

                    $rootScope.eventInit("ch");
                });

                break;

            default:
                break;
        }
    }

    $scope.sideNavItems = [
        {
            id: 1,
            displayName: "My Calendar",
            name: "MyCalendar",
            controller: "myTask",
            image: "images/calendar/Rectangle8.png",
            imageSelected: "images/calendar/Rectangle8copy.png"
        },
        {
            id: 2,
            displayName: "My Field Job",
            name: "MyTask",
            controller: "myTask",
            image: "images/mytask/Shape36.png",
            imageSelected: "images/mytask/myTaskSel.png"
        },
        {
            id: 3,
            displayName: "Field Job Overview",
            name: "TaskOverview",
            controller: "taskOverflow",
            image: "images/taskoverview/taskoverview.png",
            imageSelected: "images/taskoverview/taskOverflowSel.png"
        },
        {
            id: 4,
            displayName: "Debrief",
            name: "Debrief",
            controller: "debrief",
            image: "images/debrief/brief copy.png",
            imageSelected: "images/debrief/brief.png"
        }
    ];

    $rootScope.selectedItem = $scope.sideNavItems[0].id;

    $scope.menuClick = function (item) {

        $rootScope.selectedItem = item.id;

        $rootScope.tabClicked = true;

        $rootScope.columnclass = "col-sm-11";

        if (valueService.getDebriefChanged()) {

            $mdDialog.show({
                locals: {dataToPass: item},
                controller: DialogController,
                templateUrl: "app/views/Dialog.html",
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: false
            }).then(function (selected) {

                // $scope.status = "You said the information was '" + selected + "'.";

            }, function () {

                //$scope.status = "You cancelled the dialog.";
            });

        } else {

            sideNavigation(item);
        }
    }

    function DialogController($scope, $mdDialog, dataToPass) {

        $scope.saveData = function () {

            $rootScope.saveValues();

            sideNavigation(dataToPass);

            $mdDialog.hide();

            $rootScope.showDebrief = false;
        }

        $scope.cancel = function () {

            sideNavigation(dataToPass);

            $mdDialog.hide();

            valueService.setDebriefChanged(false);

            $rootScope.showDebrief = false;
        }
    }

    function sideNavigation(item) {

        switch (item.name) {

            case "MyCalendar":

                $scope.myCalendar = true;

                $scope.taskOverview = false;

                $rootScope.showDebrief = false;

                $rootScope.showTaskDetail = false;

                $state.go(item.controller);

                $rootScope.selectedCategory = 'Field Service'

                break;

            case "MyTask":

                $rootScope.showDebrief = false;

                $rootScope.showTaskDetail = false;

                $state.go("myFieldJob");

                $rootScope.selectedCategory = 'My Field Job';

                break;

            case "TaskOverview":

                $scope.taskOverview = true;

                $scope.myCalendar = false;

                $state.go("taskOverFlow");

                break;

            case "Debrief":

                $scope.taskOverview = true;

                $scope.myCalendar = false;

                $state.go(item.controller);

                $rootScope.selectedCategory = 'Debrief'

            default:
                break;
        }
    }

    $scope.menuToggle = function () {

        if ($rootScope.closed == true) {

            $rootScope.closed = false;

            $scope.collapsedClass = ""

        } else {

            $rootScope.closed = true;

            $scope.collapsedClass = "collapsed"
        }
    }

    $scope.menuIconClicked = function () {
        $scope.hideNavLeft = !$scope.hideNavLeft;
    }

    $scope.signOut = function () {

        var userObject = {
            'ID': constantService.getUser().ID,
            'Login_Status': "0"
        };

        localService.updateUser(userObject);

        $state.go('login');

        // localService.deleteTaskList();
        // localService.deleteInternalList();
        // localService.deleteInstallBase();
        // localService.deleteContact();
        // localService.deleteNote();
        //
        // localService.deleteOverTime();
        // localService.deleteShiftCode();
        //
        // localService.deleteChargeType();
        // localService.deleteChargeMethod();
        // localService.deleteFieldJobName();
        //
        // localService.deleteWorkType();
        // localService.deleteItem();
        // localService.deleteCurrency();
        //
        // localService.deleteExpenseType();
        // localService.deleteNoteType();
        //
        // localService.deleteTimeList();
        // localService.deleteExpenseList();
        // localService.deleteNotesList();
        // localService.deleteMaterialList();
        // localService.deleteAttachmentList();
        // localService.deleteEngineerList();
        //
        // localService.deleteUser();
    }

    $scope.export2PDF = function () {

        html2canvas(document.getElementById('exportthis'), {

            onrendered: function (canvas) {

                var data = canvas.toDataURL();

                var docDefinition = {

                    content: [{
                        image: data,
                        width: 500,
                    }]
                };

                pdfMake.createPdf(docDefinition).download("Score_Details.pdf");
            }
        });
    }

    $scope.login = function () {

        var baseData = $scope.userName.toLowerCase() + ":" + $scope.password;

        var authorizationValue = window.btoa(baseData);

        if (valueService.getNetworkStatus()) {

            $rootScope.dbCall = true;

            console.log($scope.userName);

            $rootScope.uName = $scope.userName;

            var data = {
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + authorizationValue,
                    'oracle-mobile-backend-id': constantService.getChargeBackId()
                }
            };

            localService.deleteUser();

            cloudService.login(data, function (response) {

                if (response && response != null && response.ID != undefined && response.ID != "") {

                    valueService.setResourceId(response['ID']);

                    constantService.setResourceId(response['ID']);

                    cloudService.getTechnicianProfile(function (response) {

                        var userObject = {
                            ID: response[0].ID,
                            ClarityID: response[0].ClarityID,
                            Currency: response[0].Currency,
                            Default_View: response[0].Default_View,
                            Email: response[0].Email,
                            Language: response[0].Language,
                            Name: response[0].Name,
                            OFSCId: response[0].OFSCId,
                            Password: response[0].Password,
                            Time_Zone: response[0].Time_Zone,
                            Type: response[0].Type,
                            User_Name: response[0].User_Name,
                            Work_Day: response[0].Work_Day,
                            Work_Hour: response[0].Work_Hour,
                            Login_Status: "1",
                            Last_updated: new Date(),
                            encrypt: authorizationValue
                        };

                        localService.insertUser(userObject);

                        localService.getUser(function (response) {

                            console.log("USER =====> " + JSON.stringify(response));

                            constantService.setUser(response[0]);

                            valueService.setUser(response[0]);

                            var data = {
                                "resourceId": constantService.getUser().OFSCId,
                                "date": moment(new Date()).utcOffset(constantService.getTimeZone()).format('YYYY-MM-DD')
                            };

                            ofscService.activate_resource(data, function (response) {

                            });

                            syncSubmit("0");
                        });
                    });

                } else {

                    $scope.loginError = true;

                    $rootScope.dbCall = false;
                }
            });

        } else {

            localService.getUserLogin(authorizationValue, function (response) {

                console.log("USER =====> " + JSON.stringify(response));

                if (response.length > 0) {

                    var userObject = {
                        'ID': response[0].ID,
                        'Login_Status': "1"
                    };

                    localService.updateUserLogin(userObject, function (result) {

                        localService.getUser(function (response) {

                            console.log("USER =====> " + JSON.stringify(response));

                            if (response.length > 0) {

                                angular.forEach(response, function (item) {

                                    if (item.Login_Status == "1") {

                                        constantService.setUser(item);

                                        valueService.setUser(item);
                                    }
                                });

                                if (constantService.getUser().ID !== null) {

                                    valueService.setResourceId(constantService.getUser().ID);

                                    constantService.setResourceId(constantService.getUser().ID);

                                    if (constantService.getUser().Default_View == "My Task") {

                                        $rootScope.selectedItem = 2;

                                        localService.getTaskList(function (response) {

                                            console.log("MY FIELD JOB =====> " + JSON.stringify(response));

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

                                                $state.go('myFieldJob');
                                            });
                                        });

                                    } else {

                                        localService.getTaskList(function (response) {

                                            console.log("MY CALENDAR =====> " + JSON.stringify(response));

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

                                                $state.go('myTask');
                                            });
                                        });
                                    }

                                } else {

                                    $scope.loginError = true;
                                }
                            } else {

                                $scope.loginError = true;
                            }
                        });
                    });
                } else {

                    $scope.loginError = true;
                }
            });
        }

        console.log("Login END");
    }

    $scope.syncFunctionality = function () {

        syncSubmit("1");
    }

    function syncSubmit(isLogin) {

        console.log("NETWORK " + valueService.getNetworkStatus());

        var promises = [];

        if (valueService.getNetworkStatus()) {

            $rootScope.dbCall = true;

            var deferAccept = $q.defer();

            localService.getAcceptTaskList(function (response) {

                console.log("SYNC ACCEPT");

                if (response.length > 0) {

                    var i = 0;

                    angular.forEach(response, function (item) {

                        var deferred = $q.defer();

                        valueService.acceptTask(item.Task_Number, function (result) {

                            cloudService.OfscActions(item.Activity_Id, true, function (res) {

                                $rootScope.showAccept = false;

                                deferred.resolve("success");

                                if ((response.length - 1) == i) {
                                    deferAccept.resolve("Accept");
                                }

                                i++;
                            });
                        });

                        promises.push(deferred.promise);
                    });

                } else {

                    deferAccept.resolve("Accept");
                }
            });

            promises.push(deferAccept.promise);

            var deferSubmit = $q.defer();

            localService.getPendingTaskList(function (response) {

                console.log("SYNC SUBMIT");

                if (response.length > 0) {

                    var j = 0;

                    angular.forEach(response, function (item) {

                        var deferred = $q.defer();

                        valueService.submitDebrief(item, item.Task_Number, function (result) {

                            console.log("SUBMIT DEBRIEF");

                            cloudService.OfscActions(item.Activity_Id, false, function (res) {

                                deferred.resolve("success");

                                console.log("DEBRIEF SUCCESS");

                                if ((response.length - 1) == j) {
                                    deferSubmit.resolve("Submit");
                                }

                                j++;
                            });
                        });

                        promises.push(deferred.promise);
                    });

                } else {

                    deferSubmit.resolve("Submit");
                }
            });

            promises.push(deferSubmit.promise);

            console.log("PENDING UPDATE LENGTH " + promises.length);

            $q.all(promises).then(
                function (response) {

                    console.log("SYNC DATA ACCEPT SUBMIT SUCCESS");

                    if (isLogin == "0") {
                        fetchData(isLogin);
                    } else if (isLogin == "1") {
                        syncData(isLogin);
                    }
                },

                function (error) {

                    console.log("SYNC DATA ACCEPT SUBMIT FAILURE");

                    if (isLogin == "0") {
                        fetchData(isLogin);
                    } else if (isLogin == "1") {
                        syncData(isLogin);
                    }
                }
            );
        }
    }

    function fetchData(isLogin) {

        cloudService.getTaskInternalList(isLogin, function (response) {

            var promiseArray = [];

            var deferTaskDetail = $q.defer();

            cloudService.getTaskDetails(isLogin, function (result) {

                deferTaskDetail.resolve("success");
            });

            promiseArray.push(deferTaskDetail.promise);

            var deferLOV = $q.defer();

            cloudService.getLOVDetails(isLogin, function (result) {

                deferLOV.resolve("success");
            });

            promiseArray.push(deferLOV.promise);

            var srNumberArray = [];

            angular.forEach(constantService.getTaskList(), function (item) {

                if (item.SR_ID != undefined) {

                    if (srNumberArray.indexOf(item.SR_ID) === -1) {

                        srNumberArray.push(item.SR_ID);
                    }
                }
            });

            if (srNumberArray.length > 10) {

                var strArray = [];

                var i = 1;

                angular.forEach(srNumberArray, function (item) {

                    if (i <= srNumberArray.length) {

                        strArray.push(item);

                        if (i % 10 == 0) {

                            var deferSRNotes = $q.defer();

                            cloudService.getSRNotesList(strArray, function (response) {

                                console.log("SRNOTES");

                                deferSRNotes.resolve("success");
                            });

                            var deferSRAttachment = $q.defer();

                            cloudService.getSRAttachmentList(strArray, function (response) {

                                console.log("SRATTACHMENT");

                                deferSRAttachment.resolve("success");
                            });

                            strArray = [];

                            promiseArray.push(deferSRNotes.promise);

                            promiseArray.push(deferSRAttachment.promise);

                        } else if (i == srNumberArray.length) {

                            var deferSRNotesFinal = $q.defer();

                            cloudService.getSRNotesList(strArray, function (response) {

                                console.log("SRNOTES");

                                deferSRNotesFinal.resolve("success");
                            });

                            var deferSRAttachmentFinal = $q.defer();

                            cloudService.getSRAttachmentList(strArray, function (response) {

                                console.log("SRATTACHMENT");

                                deferSRAttachmentFinal.resolve("success");
                            });

                            strArray = [];

                            promiseArray.push(deferSRNotesFinal.promise);

                            promiseArray.push(deferSRAttachmentFinal.promise);
                        }

                        i++;
                    }
                });

            } else {

                var deferSRNotes = $q.defer();

                cloudService.getSRNotesList(srNumberArray, function (response) {

                    console.log("SRNOTES");

                    deferSRNotes.resolve("success");
                });

                var deferSRAttachment = $q.defer();

                cloudService.getSRAttachmentList(srNumberArray, function (response) {

                    console.log("SRATTACHMENT");

                    deferSRAttachment.resolve("success");
                });

                promiseArray.push(deferSRNotes.promise);

                promiseArray.push(deferSRAttachment.promise);
            }

            console.log("LENGTH LOGIN " + promiseArray.length);

            $q.all(promiseArray).then(
                function (response) {

                    console.log("LOGIN SUCCESS ALL");

                    if ($state.current.name == "myFieldJob" || $state.current.name == "myTask") {

                        $state.go($state.current, {}, {reload: true});

                    } else if ($state.current.name == "login") {

                        if (valueService.getUserType().defaultView == "My Task") {

                            $state.go("myFieldJob");

                            $rootScope.selectedItem = 2;
                            $rootScope.showTaskDetail = false;
                            $rootScope.showDebrief = false;

                        } else {

                            $state.go("myTask");

                            $rootScope.selectedItem = 1;
                            $rootScope.showTaskDetail = false;
                            $rootScope.showDebrief = false;
                        }

                    } else {

                        valueService.setTask(valueService.getTask(), function () {

                            $state.go($state.current, {}, {reload: true});

                        });
                    }

                    $rootScope.dbCall = false;

                    getAttachments();
                },

                function (error) {

                    console.log("LOGIN FAILURE ALL");

                    if ($state.current.name == "myFieldJob" || $state.current.name == "myTask") {

                        $state.go($state.current, {}, {reload: true});

                    } else if ($state.current.name == "login") {

                        if (valueService.getUserType().defaultView == "My Task") {

                            $state.go("myFieldJob");

                            $rootScope.selectedItem = 2;
                            $rootScope.showTaskDetail = false;
                            $rootScope.showDebrief = false;

                        } else {

                            $state.go("myTask");

                            $rootScope.selectedItem = 1;
                            $rootScope.showTaskDetail = false;
                            $rootScope.showDebrief = false;
                        }

                    } else {

                        valueService.setTask(valueService.getTask(), function () {

                            $state.go($state.current, {}, {reload: true});

                        });
                    }

                    $rootScope.dbCall = false;

                    getAttachments();
                }
            );
        });
    }

    function syncData(isLogin) {

        cloudService.getTaskInternalList(isLogin, function (response) {

            var promiseArray = [];

            var deferTaskDetail = $q.defer();

            cloudService.getTaskDetails(isLogin, function (result) {

                deferTaskDetail.resolve("success");
            });

            promiseArray.push(deferTaskDetail.promise);

            var deferLOV = $q.defer();

            cloudService.getLOVDetails(isLogin, function (result) {

                deferLOV.resolve("success");
            });

            promiseArray.push(deferLOV.promise);

            var srNumberArray = [];

            angular.forEach(constantService.getTaskList(), function (item) {

                if (item.SR_ID != undefined) {

                    if (srNumberArray.indexOf(item.SR_ID) === -1) {

                        srNumberArray.push(item.SR_ID);
                    }
                }
            });

            if (srNumberArray.length > 10) {

                var strArray = [];

                var i = 1;

                angular.forEach(srNumberArray, function (item) {

                    if (i <= srNumberArray.length) {

                        strArray.push(item);

                        if (i % 10 == 0) {

                            var deferSRNotes = $q.defer();

                            cloudService.getSRNotesList(strArray, function (response) {

                                console.log("SRNOTES");

                                deferSRNotes.resolve("success");
                            });

                            var deferSRAttachment = $q.defer();

                            cloudService.getSRAttachmentList(strArray, function (response) {

                                console.log("SRATTACHMENT");

                                deferSRAttachment.resolve("success");
                            });

                            strArray = [];

                            promiseArray.push(deferSRNotes.promise);

                            promiseArray.push(deferSRAttachment.promise);

                        } else if (i == srNumberArray.length) {

                            var deferSRNotesFinal = $q.defer();

                            cloudService.getSRNotesList(strArray, function (response) {

                                console.log("SRNOTES");

                                deferSRNotesFinal.resolve("success");
                            });

                            var deferSRAttachmentFinal = $q.defer();

                            cloudService.getSRAttachmentList(strArray, function (response) {

                                console.log("SRATTACHMENT");

                                deferSRAttachmentFinal.resolve("success");
                            });

                            strArray = [];

                            promiseArray.push(deferSRNotesFinal.promise);

                            promiseArray.push(deferSRAttachmentFinal.promise);
                        }

                        i++;
                    }
                });

            } else {

                var deferSRNotes = $q.defer();

                cloudService.getSRNotesList(srNumberArray, function (response) {

                    console.log("SRNOTES");

                    deferSRNotes.resolve("success");
                });

                var deferSRAttachment = $q.defer();

                cloudService.getSRAttachmentList(srNumberArray, function (response) {

                    console.log("SRATTACHMENT");

                    deferSRAttachment.resolve("success");
                });

                promiseArray.push(deferSRNotes.promise);

                promiseArray.push(deferSRAttachment.promise);
            }

            console.log("LENGTH SYNC " + promiseArray.length);

            $q.all(promiseArray).then(
                function (response) {

                    var userObject = {
                        'ID': constantService.getUser().ID,
                        'Last_updated': new Date()
                    };

                    localService.updateLastSync(userObject);

                    console.log("SYNC SUCCESS ALL");

                    if ($state.current.name == "myFieldJob" || $state.current.name == "myTask") {

                        $state.go($state.current, {}, {reload: true});

                    } else if ($state.current.name == "login") {

                        if (valueService.getUserType().defaultView == "My Task") {

                            $state.go("myFieldJob");

                            $rootScope.selectedItem = 2;
                            $rootScope.showTaskDetail = false;
                            $rootScope.showDebrief = false;

                        } else {

                            $state.go("myTask");

                            $rootScope.selectedItem = 1;
                            $rootScope.showTaskDetail = false;
                            $rootScope.showDebrief = false;
                        }

                    } else {

                        valueService.setTask(valueService.getTask(), function () {

                            $state.go($state.current, {}, {reload: true});

                        });
                    }

                    $rootScope.dbCall = false;

                    getAttachments();
                },

                function (error) {

                    var userObject = {
                        'ID': constantService.getUser().ID,
                        'Last_updated': new Date()
                    };

                    localService.updateLastSync(userObject);

                    console.log("SYNC FAILURE ALL");

                    if ($state.current.name == "myFieldJob" || $state.current.name == "myTask") {

                        $state.go($state.current, {}, {reload: true});

                    } else if ($state.current.name == "login") {

                        if (valueService.getUserType().defaultView == "My Task") {

                            $state.go("myFieldJob");

                            $rootScope.selectedItem = 2;
                            $rootScope.showTaskDetail = false;
                            $rootScope.showDebrief = false;

                        } else {

                            $state.go("myTask");

                            $rootScope.selectedItem = 1;
                            $rootScope.showTaskDetail = false;
                            $rootScope.showDebrief = false;
                        }

                    } else {

                        valueService.setTask(valueService.getTask(), function () {

                            $state.go($state.current, {}, {reload: true});

                        });
                    }

                    $rootScope.dbCall = false;

                    getAttachments();
                }
            );
        });
    }

    function getAttachments() {

        localService.getAttachmentListType("O", function (response) {

            angular.forEach(response, function (item) {

                cloudService.downloadAttachment(item, function (result) {

                    if (result != undefined && result != null && result.data != undefined && result.data != null) {

                        var base64Code = result.data;

                        valueService.saveBase64File(item.File_Path, item.File_Name, base64Code, item.File_Type);
                    }
                });
            });
        });

        localService.getAttachmentListType("S", function (response) {

            angular.forEach(response, function (item) {

                cloudService.downloadAttachment(item, function (result) {

                    if (result != undefined && result != null && result.data != undefined && result.data != null) {

                        var base64Code = result.data;

                        valueService.saveBase64File(item.File_Path, item.File_Name, base64Code, item.File_Type);
                    }
                });
            });
        });
    }

    function getData() {

        cloudService.getTaskList(function (response) {

            var promiseArray = [];

            var deferInstall = $q.defer();

            cloudService.getInstallBaseList(function (result) {

                console.log("INSTALL");

                deferInstall.resolve("success");
            });

            promiseArray.push(deferInstall.promise);

            var deferContact = $q.defer();

            cloudService.getContactList(function (result) {

                console.log("CONTACT");

                deferContact.resolve("success");
            });

            promiseArray.push(deferContact.promise);

            var deferNote = $q.defer();

            cloudService.getNoteList(function (result) {

                console.log("NOTES");

                deferNote.resolve("success");
            });

            promiseArray.push(deferNote.promise);

            var deferOverTime = $q.defer();

            cloudService.getOverTimeList(function (result) {

                console.log("OVERTIME");

                deferOverTime.resolve("success");
            });

            promiseArray.push(deferOverTime.promise);

            var deferShiftCode = $q.defer();

            cloudService.getShiftCodeList(function (result) {

                console.log("SHIFTCODE");

                deferShiftCode.resolve("success");
            });

            promiseArray.push(deferShiftCode.promise);

            var deferChargeType = $q.defer();

            cloudService.getChargeType(function (result) {

                console.log("CHARGETYPE");

                deferChargeType.resolve("success");
            });

            promiseArray.push(deferChargeType.promise);

            var deferChargeMethod = $q.defer();

            cloudService.getChargeMethod(function (result) {

                console.log("CHARGEMETHOD");

                deferChargeMethod.resolve("success");
            });

            promiseArray.push(deferChargeMethod.promise);

            var deferFieldJob = $q.defer();

            cloudService.getFieldJobName(function (result) {

                console.log("FIELDJOB");

                deferFieldJob.resolve("success");
            });

            promiseArray.push(deferFieldJob.promise);

            var deferWorkType = $q.defer();

            cloudService.getWorkType(function (result) {

                console.log("WORKTYPE");

                deferWorkType.resolve("success");
            });

            promiseArray.push(deferWorkType.promise);

            var deferItem = $q.defer();

            cloudService.getItem(function (result) {

                console.log("ITEM");

                deferItem.resolve("success");
            });

            promiseArray.push(deferItem.promise);

            var deferCurrency = $q.defer();

            cloudService.getCurrency(function (result) {

                console.log("CURRENCY");

                deferCurrency.resolve("success");
            });

            promiseArray.push(deferCurrency.promise);

            var deferExpense = $q.defer();

            cloudService.getExpenseType(function (result) {

                console.log("EXPENSETYPE");

                deferExpense.resolve("success");
            });

            promiseArray.push(deferExpense.promise);

            var deferNoteType = $q.defer();

            cloudService.getNoteType(function (result) {

                console.log("NOTETYPE");

                deferNoteType.resolve("success");
            });

            promiseArray.push(deferNoteType.promise);

            var deferAttachment = $q.defer();

            cloudService.getAttachmentList(function (result) {

                console.log("ATTACHMENT");

                deferAttachment.resolve("success");
            });

            promiseArray.push(deferAttachment.promise);

            var srNumberArray = [];

            angular.forEach(constantService.getTaskList(), function (item) {

                if (item.SR_ID != undefined) {

                    if (srNumberArray.indexOf(item.SR_ID) === -1) {

                        srNumberArray.push(item.SR_ID);
                    }
                }
            });

            if (srNumberArray.length > 10) {

                var strArray = [];

                var i = 1;

                angular.forEach(srNumberArray, function (item) {

                    if (i <= srNumberArray.length) {

                        strArray.push(item);

                        if (i % 10 == 0) {

                            var deferSRNotes = $q.defer();

                            cloudService.getSRNotesList(strArray, function (response) {

                                console.log("SRNOTES");

                                deferSRNotes.resolve("success");
                            });

                            var deferSRAttachment = $q.defer();

                            cloudService.getSRAttachmentList(strArray, function (response) {

                                console.log("SRATTACHMENT");

                                deferSRAttachment.resolve("success");
                            });

                            strArray = [];

                            promiseArray.push(deferSRNotes.promise);

                            promiseArray.push(deferSRAttachment.promise);

                        } else if (i == srNumberArray.length) {

                            var deferSRNotesFinal = $q.defer();

                            cloudService.getSRNotesList(strArray, function (response) {

                                console.log("SRNOTES");

                                deferSRNotesFinal.resolve("success");
                            });

                            var deferSRAttachmentFinal = $q.defer();

                            cloudService.getSRAttachmentList(strArray, function (response) {

                                console.log("SRATTACHMENT");

                                deferSRAttachmentFinal.resolve("success");
                            });

                            strArray = [];

                            promiseArray.push(deferSRNotesFinal.promise);

                            promiseArray.push(deferSRAttachmentFinal.promise);
                        }

                        i++;
                    }
                });

            } else {

                var deferSRNotes = $q.defer();

                cloudService.getSRNotesList(srNumberArray, function (response) {

                    console.log("SRNOTES");

                    deferSRNotes.resolve("success");
                });

                var deferSRAttachment = $q.defer();

                cloudService.getSRAttachmentList(srNumberArray, function (response) {

                    console.log("SRATTACHMENT");

                    deferSRAttachment.resolve("success");
                });

                promiseArray.push(deferSRNotes.promise);

                promiseArray.push(deferSRAttachment.promise);
            }

            console.log("LENGTH SYNC " + promiseArray.length);

            $q.all(promiseArray).then(
                function (response) {

                    console.log("LOGIN SUCCESS ALL");

                    if ($state.current.name == "myFieldJob" || $state.current.name == "myTask") {

                        $state.go($state.current, {}, {reload: true});

                    } else if ($state.current.name == "login") {

                        if (valueService.getUserType().defaultView == "My Task") {

                            $state.go("myFieldJob");

                            $rootScope.selectedItem = 2;
                            $rootScope.showTaskDetail = false;
                            $rootScope.showDebrief = false;

                        } else {

                            $state.go("myTask");

                            $rootScope.selectedItem = 1;
                            $rootScope.showTaskDetail = false;
                            $rootScope.showDebrief = false;
                        }

                    } else {

                        valueService.setTask(valueService.getTask(), function () {

                            $state.go($state.current, {}, {reload: true});

                        });
                    }

                    $rootScope.dbCall = false;

                    getAttachments();
                },

                function (error) {

                    console.log("LOGIN FAILURE ALL");

                    if ($state.current.name == "myFieldJob" || $state.current.name == "myTask") {

                        $state.go($state.current, {}, {reload: true});

                    } else if ($state.current.name == "login") {

                        if (valueService.getUserType().defaultView == "My Task") {

                            $state.go("myFieldJob");

                            $rootScope.selectedItem = 2;
                            $rootScope.showTaskDetail = false;
                            $rootScope.showDebrief = false;

                        } else {

                            $state.go("myTask");

                            $rootScope.selectedItem = 1;
                            $rootScope.showTaskDetail = false;
                            $rootScope.showDebrief = false;
                        }

                    } else {

                        valueService.setTask(valueService.getTask(), function () {

                            $state.go($state.current, {}, {reload: true});

                        });
                    }

                    $rootScope.dbCall = false;

                    getAttachments();
                }
            );
        });
    }
});
