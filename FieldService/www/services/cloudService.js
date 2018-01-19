(function () {

    'use strict';

    app.factory('cloudService', cloudService);

    cloudService.$inject = ['$http', '$rootScope', '$window', '$location', '$q', 'localService', 'constantService', 'ofscService'];

    function cloudService($http, $rootScope, $window, $location, $q, localService, constantService, ofscService) {

        var url = conf.apiUrl;

        var service = {};

        service.login = login;
        service.getTechnicianProfile = getTechnicianProfile;

        service.getTaskInternalList = getTaskInternalList;
        service.getInternalList = getInternalList;

        service.getTaskDetails = getTaskDetails;
        service.getProjectDetails = getProjectDetails;
        service.getLOVDetails = getLOVDetails;
        service.getSR = getSR;

        service.updateDebrief = updateDebrief;
        service.updateOFSCStatus = updateOFSCStatus;

        service.createAttachment = createAttachment;
        service.downloadAttachment = downloadAttachment;

        service.deleteAPI = deleteAPI;

        service.setCredentials = setCredentials;
        service.clearCredentials = clearCredentials;

        return service;

        function login(formData, callback) {

            console.log('REQUEST LOGIN ', JSON.stringify(formData));

            return $http({

                method: 'GET',
                url: url + 'login_API/verify_login',
                headers: formData.header

            }).success(function (response) {

                console.log('RESPONSE LOGIN ', JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                callback(error);

                console.log('ERROR LOGIN ', JSON.stringify(error));
            });
        };

        function getTechnicianProfile(callback) {

            return $http({

                method: 'GET',
                url: url + 'Technician_Profile_Details/to_get_techpro?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getTechBackId()
                }

            }).success(function (response) {

                console.log('RESPONSE TECHNICIAN ', JSON.stringify(response));

                callback(response.technicianProfile);

            }).error(function (error) {

                callback(error);

                console.log('ERROR TECHNICIAN ', JSON.stringify(error));

            });
        };

        function getTaskInternalList(isLogin, callback) {

            var data = {};

            if (isLogin == "0" || constantService.getUser().Last_Updated_Task == undefined || constantService.getUser().Last_Updated_Task == null) {

                data = {
                    "isLogin": isLogin,
                    "resourceId": constantService.getResourceId(),
                    "fromDate": constantService.getStartDate(),
                    "toDate": constantService.getEndDate(),
                    "updateDate": ""
                };

            } else if (isLogin == "1") {

                data = {
                    "isLogin": isLogin,
                    "resourceId": constantService.getResourceId(),
                    "fromDate": constantService.getStartDate(),
                    "toDate": constantService.getEndDate(),
                    "updateDate": new Date(constantService.getUser().Last_Updated_Task).toISOString()
                };
            }

            console.log("REQUEST TASK " + JSON.stringify(data));

            console.log("START TASK " + new Date());

            var userObject = {
                'ID': constantService.getUser().ID,
                'Last_Updated_Task': new Date()
            };

            $http({

                method: 'POST',
                url: url + "getTaskList/get_list",
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getTaskListBackId()
                },
                data: data

            }).success(function (response) {

                localService.updateLastTask(userObject);

                console.log("END TASK " + new Date());

                console.log("RESPONSE TASK " + JSON.stringify(response));

                var taskList = [];

                var internalList = [];

                var taskInternalList = [];
                
                angular.forEach(response.getTaskList, function (item) {

                    if (item.TaskDetails && item.TaskDetails.length > 0) {

                        angular.forEach(item.TaskDetails, function (taskObject) {

                            taskObject.Type = "CUSTOMER";

                            taskObject.email = "";

                            taskObject.Date = new Date();

                            taskList.push(taskObject);
                        });
                    }

                    if (item.activities && item.activities.length > 0) {

                        angular.forEach(item.activities, function (internalObject) {

                            internalList.push(internalObject);
                        });
                    }
                });

                localService.insertTaskList(taskList, function (result) {

                    localService.insertInternalList(internalList, function (result) {

                        localService.getTaskList(function (taskListDB) {

                            localService.getInternalList(function (internalListDB) {

                                angular.forEach(taskListDB, function (taskObject) {

                                    taskInternalList.push(taskObject);
                                });

                                angular.forEach(internalListDB, function (internalObject) {

                                    var internalOFSCJSONObject = {};

                                    internalOFSCJSONObject.Start_Date = internalObject.Start_time;
                                    internalOFSCJSONObject.End_Date = internalObject.End_time;
                                    internalOFSCJSONObject.Type = "INTERNAL";
                                    internalOFSCJSONObject.Customer_Name = internalObject.Activity_type;
                                    internalOFSCJSONObject.Task_Number = internalObject.Activity_Id;

                                    taskInternalList.push(internalOFSCJSONObject);
                                });

                                constantService.setTaskList(taskInternalList);

                                console.log("END TASK INTERNAL " + new Date());

                                callback(taskInternalList);
                            });
                        });
                    });
                });

            }).error(function (error) {

                console.log("END TASK ERROR " + new Date());

                callback(error);

                console.log("ERROR TASK " + JSON.stringify(error));
            });
        };

        function getInternalList(callback) {

            var internalList = [];

            var startDate = new Date();

            startDate.setDate(startDate.getDate() + 15);

            var startDateISOFormat = startDate.toISOString();

            var endDate = new Date();

            endDate.setDate(endDate.getDate() + 45);

            var endDateISOFormat = endDate.toISOString();

            var data = {
                "resourceId": constantService.getResourceId(),
                "fromDate": startDateISOFormat,
                "toDate": endDateISOFormat
            };

            console.log("REQUEST INTERNAL " + JSON.stringify(data));

            console.log("START INTERNAL " + new Date());

            var userObject = {
                'ID': constantService.getUser().ID,
                'Last_Updated_Internal': new Date()
            };

            $http({

                method: 'GET',
                url: url + "Internal_OFSC/get_ids?resourceId=" + constantService.getResourceId()
                + "fromDate=" + startDateISOFormat
                + "toDate=" + endDateISOFormat,
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getInternalBackId()
                }

            }).success(function (response) {

                localService.updateLastInternal(userObject);

                console.log("END INTERNAL " + new Date());

                console.log("RESPONSE INTERNAL " + JSON.stringify(response));

                if (response && response.activities) {

                    callback(response.activities);

                } else {

                    callback(internalList);
                }

            }).error(function (error) {

                console.log("END INTERNAL ERROR " + new Date());

                callback(internalList);

                console.log("ERROR INTERNAL " + JSON.stringify(error));
            });
        };

        function getTaskDetails(isLogin, callback) {

            var data = {};

            if (isLogin == "0" || constantService.getUser().Last_Updated_Task_Detail == undefined || constantService.getUser().Last_Updated_Task_Detail == null) {

                data = {
                    "resourceId": constantService.getResourceId(),
                    "fromDate": constantService.getStartDate(),
                    "toDate": constantService.getEndDate(),
                    "updateDate": ""
                };

            } else if (isLogin == "1") {

                data = {
                    "resourceId": constantService.getResourceId(),
                    "fromDate": constantService.getStartDate(),
                    "toDate": constantService.getEndDate(),
                    "updateDate": new Date(constantService.getUser().Last_Updated_Task_Detail).toISOString()
                };
            }

            console.log("REQUEST TASK DETAIL " + JSON.stringify(data));

            console.log("START TASK DETAIL " + new Date());

            var userObject = {
                'ID': constantService.getUser().ID,
                'Last_Updated_Task_Detail': new Date()
            };

            $http({

                method: 'POST',
                url: url + "Combine_TaskDetails/Task_Combine",
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getTaskDetailBackId()
                },
                data: data

            }).success(function (response) {

                localService.updateLastTaskDetail(userObject);

                console.log("END TASK DETAIL " + new Date());

                console.log("RESPONSE TASK DETAIL " + JSON.stringify(response));

                var promises = [];

                angular.forEach(response.TaskDetails, function (item) {

                    if (item.InstallBase && item.InstallBase.length > 0) {

                        var deferInstall = $q.defer();

                        localService.insertInstallBaseList(item.InstallBase, function (result) {

                            deferInstall.resolve("success");

                            console.log("INSTALL BASE");
                        });

                        promises.push(deferInstall.promise);
                    }

                    if (item.Contacts && item.Contacts.length > 0) {

                        var deferContact = $q.defer();

                        localService.insertContactList(item.Contacts, function (result) {

                            deferContact.resolve("success");

                            console.log("CONTACTS");
                        });

                        promises.push(deferContact.promise);
                    }

                    if (item.Notes && item.Notes.length > 0) {

                        var deferNotes = $q.defer();

                        localService.insertNoteList(item.Notes, function (result) {

                            deferNotes.resolve("success");

                            console.log("NOTES");
                        });

                        promises.push(deferNotes.promise);
                    }

                    if (item.Attachments && item.Attachments.length > 0) {

                        var attachmentArray = [];

                        var filePath = cordova.file.dataDirectory;

                        angular.forEach(item.Attachments, function (item) {

                            var attachmentObject = {
                                Attachment_Id: item.Attachments_Id,
                                File_Path: filePath,
                                File_Name: item.User_File_Name,
                                File_Type: item.Content_type,
                                Type: "O",
                                AttachmentType: "O",
                                Created_Date: item.Date_Created,
                                Task_Number: item.Task_Number,
                                SRID: ""
                            };

                            attachmentArray.push(attachmentObject);
                        });

                        var deferAttachment = $q.defer();

                        localService.insertAttachmentList(attachmentArray, function (result) {

                            deferAttachment.resolve("success");

                            console.log("ATTACHMENTS");
                        });

                        promises.push(deferAttachment.promise);
                    }
                });

                console.log("LENGTH TASK DETAIL " + promises.length);

                $q.all(promises).then(
                    function (response) {

                        console.log("SUCCESS PROMISE TASK DETAIL");

                        callback("success");

                        console.log("END TASK DETAIL INSERT " + new Date());
                    },

                    function (error) {

                        console.log("FAILURE PROMISE TASK DETAIL");

                        callback("failure");

                        console.log("END TASK DETAIL INSERT " + new Date());
                    }
                );

            }).error(function (error) {

                console.log("END TASK DETAIL ERROR " + new Date());

                callback(error);

                console.log("ERROR TASK DETAIL " + JSON.stringify(error));
            });
        };

        function getProjectDetails(isLogin, projectArray, callback) {

            var data = {};

            if (isLogin == "0" || constantService.getUser().Last_Updated_Project == undefined || constantService.getUser().Last_Updated_Project == null) {

                data = {
                    "resourceId": constantService.getResourceId(),
                    "fromDate": constantService.getStartDate(),
                    "toDate": constantService.getEndDate(),
                    "updateDate": "",
                    "project_number": projectArray
                };

            } else if (isLogin == "1") {

                data = {
                    "resourceId": constantService.getResourceId(),
                    "fromDate": constantService.getStartDate(),
                    "toDate": constantService.getEndDate(),
                    "updateDate": new Date(constantService.getUser().Last_Updated_Project).toISOString(),
                    "project_number": projectArray
                };
            }

            console.log("REQUEST PROJECT " + JSON.stringify(data));

            console.log("START PROJECT " + new Date());

            var userObject = {
                'ID': constantService.getUser().ID,
                'Last_Updated_Project': new Date()
            };

            $http({

                method: 'POST',
                url: url + 'Project_Batch/Batch_Project',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getProjectBackId()
                },
                data: data

            }).success(function (response) {

                localService.updateLastProject(userObject);

                console.log("END PROJECT " + new Date());

                console.log("RESPONSE PROJECT " + JSON.stringify(response));

                var promises = [];

                angular.forEach(response.getProjectDetails, function (item) {

                    if (item.OverTImeShiftCode && item.OverTImeShiftCode.length > 0) {

                        var deferOverTime = $q.defer();

                        localService.insertOverTimeList(item.OverTImeShiftCode, function (result) {

                            deferOverTime.resolve("success");

                            console.log("OVER TIME");
                        });

                        promises.push(deferOverTime.promise);
                    }

                    if (item.ShiftCode && item.ShiftCode.length > 0) {

                        var deferShiftCode = $q.defer();

                        localService.insertShiftCodeList(item.ShiftCode, function (result) {

                            deferShiftCode.resolve("success");

                            console.log("SHIFT CODE");
                        });

                        promises.push(deferShiftCode.promise);
                    }

                    if (item.TaskName && item.TaskName.length > 0) {

                        var deferFieldJob = $q.defer();

                        localService.insertFieldJobNameList(item.TaskName, function (result) {

                            deferFieldJob.resolve("success");

                            console.log("FIELD JOB");
                        });

                        promises.push(deferFieldJob.promise);
                    }
                });

                console.log("LENGTH PROJECT DETAIL " + promises.length);

                $q.all(promises).then(
                    function (response) {

                        console.log("SUCCESS PROMISE PROJECT DETAIL");

                        callback("success");

                        console.log("END PROJECT DETAIL INSERT " + new Date());
                    },

                    function (error) {

                        console.log("FAILURE PROMISE PROJECT DETAIL");

                        callback("failure");

                        console.log("END PROJECT DETAIL INSERT " + new Date());
                    }
                );

            }).error(function (error) {

                console.log("END PROJECT ERROR " + new Date());

                callback("error");

                console.log("ERROR PROJECT " + JSON.stringify(error));
            });
        };

        function getLOVDetails(isLogin, callback) {

            var data = {};

            if (isLogin == "0" || constantService.getUser().Last_Updated_LOV == undefined || constantService.getUser().Last_Updated_LOV == null) {

                data = {
                    "isLogin": isLogin,
                    "resourceId": constantService.getResourceId(),
                    "fromDate": constantService.getStartDate(),
                    "toDate": constantService.getEndDate(),
                    "updateDate": ""
                };

            } else if (isLogin == "1") {

                data = {
                    "isLogin": isLogin,
                    "resourceId": constantService.getResourceId(),
                    "fromDate": constantService.getStartDate(),
                    "toDate": constantService.getEndDate(),
                    "updateDate": new Date(constantService.getUser().Last_Updated_LOV).toISOString()
                };
            }

            console.log("REQUEST LOV " + JSON.stringify(data));

            console.log("START LOV " + new Date());

            var userObject = {
                'ID': constantService.getUser().ID,
                'Last_Updated_LOV': new Date()
            };

            $http({

                method: 'POST',
                url: url + "getLOVDetails/LOV_Details",
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getLovBackId()
                }

            }).success(function (response) {

                localService.updateLastLOV(userObject);

                console.log("END LOV " + new Date());

                console.log("RESPONSE LOV " + JSON.stringify(response));

                var promises = [];

                angular.forEach(response.getLOVDetails, function (item) {

                    if (item.Charge_Method && item.Charge_Method.length > 0) {

                        var deferChargeMethod = $q.defer();

                        localService.insertChargeMethodList(item.Charge_Method, function (result) {

                            deferChargeMethod.resolve("success");

                            console.log("CHARGE METHOD");
                        });

                        promises.push(deferChargeMethod.promise);
                    }

                    if (item.Charge_Type && item.Charge_Type.length > 0) {

                        var deferChargeType = $q.defer();

                        localService.insertChargeTypeList(item.Charge_Type, function (result) {

                            deferChargeType.resolve("success");

                            console.log("CHARGE TYPE");
                        });

                        promises.push(deferChargeType.promise);
                    }

                    if (item.ExpenseType && item.ExpenseType.length > 0) {

                        var deferExpenseType = $q.defer();

                        localService.insertExpenseTypeList(item.ExpenseType, function (result) {

                            deferExpenseType.resolve("success");

                            console.log("EXPENSE TYPE");
                        });

                        promises.push(deferExpenseType.promise);
                    }

                    if (item.Notes_Type && item.Notes_Type.length > 0) {

                        var deferNoteType = $q.defer();

                        localService.insertNoteTypeList(item.Notes_Type, function (result) {

                            deferNoteType.resolve("success");

                            console.log("NOTE TYPE");
                        });

                        promises.push(deferNoteType.promise);
                    }

                    if (item.WorkType && item.WorkType.length > 0) {

                        var deferWorkType = $q.defer();

                        localService.insertWorkTypeList(item.WorkType, function (result) {

                            deferWorkType.resolve("success");

                            console.log("WORK TYPE");
                        });

                        promises.push(deferWorkType.promise);
                    }

                    if (item.Items && item.Items.length > 0) {

                        var deferItem = $q.defer();

                        localService.insertItemList(item.Items, function (result) {

                            deferItem.resolve("success");

                            console.log("ITEMS");
                        });

                        promises.push(deferItem.promise);
                    }

                    if (item.Currencies && item.Currencies.length > 0) {

                        var deferCurrency = $q.defer();

                        localService.insertCurrencyList(item.Currencies, function (result) {

                            deferCurrency.resolve("success");

                            console.log("CURRENCY");
                        });

                        promises.push(deferCurrency.promise);
                    }

                    if (item.UnitsOfMeasurement && item.UnitsOfMeasurement.length > 0) {

                        var deferUOM = $q.defer();

                        localService.insertUOMList(item.UnitsOfMeasurement, function (result) {

                            deferUOM.resolve("success");

                            console.log("UOM");
                        });

                        promises.push(deferUOM.promise);
                    }
                });

                console.log("LENGTH LOV " + promises.length);

                $q.all(promises).then(
                    function (response) {

                        console.log("SUCCESS PROMISE LOV");

                        callback("success");

                        console.log("END LOV INSERT " + new Date());
                    },

                    function (error) {

                        console.log("FAILURE PROMISE LOV");

                        callback("failure");

                        console.log("END LOV INSERT " + new Date());
                    }
                );

            }).error(function (error) {

                console.log("END LOV ERROR " + new Date());

                callback(error);

                console.log("ERROR LOV " + JSON.stringify(error));
            });
        };

        function getSR(isLogin, srNumberArray, callback) {

            var data = {};

            if (isLogin == "0" || constantService.getUser().Last_Updated_SR == undefined || constantService.getUser().Last_Updated_SR == null) {

                data = {
                    "updateDate": "",
                    "SRID": srNumberArray
                };

            } else {

                data = {
                    "updateDate": new Date(constantService.getUser().Last_Updated_SR).toISOString(),
                    "SRID": srNumberArray
                };
            }

            console.log("REQUEST SR " + JSON.stringify(data));

            console.log("START SR " + new Date());

            var userObject = {
                'ID': constantService.getUser().ID,
                'Last_Updated_SR': new Date()
            };

            $http({

                method: 'POST',
                url: url + 'SR_Batch/Batch_SR',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getSRBackId()
                },
                data: data

            }).success(function (response) {

                localService.updateLastSR(userObject);

                console.log("END SR " + new Date());

                console.log("RESPONSE SR " + JSON.stringify(response));

                var promises = [];

                angular.forEach(response.SRNoteAttachments, function (item) {

                    if (item.SRNotes && item.SRNotes.length > 0) {

                        var deferSRNotes = $q.defer();

                        localService.insertNoteList(item.SRNotes, function (result) {

                            deferSRNotes.resolve("success");

                            console.log("SRNOTES");
                        });

                        promises.push(deferSRNotes.promise);
                    }

                    if (item.SRAttachments && item.SRAttachments.length > 0) {

                        var attachmentArray = [];

                        var filePath = cordova.file.dataDirectory;

                        angular.forEach(item.SRAttachments, function (object) {

                            var attachmentObject = {
                                Attachment_Id: object.File_Attachment_ID,
                                File_Path: filePath,
                                File_Name: object.User_File_Name,
                                File_Type: object.Content_Type,
                                Type: "S",
                                AttachmentType: "S",
                                Created_Date: object.Date_Created,
                                Task_Number: "",
                                SRID: object.SRID
                            };

                            attachmentArray.push(attachmentObject);
                        });

                        var deferSRAttachments = $q.defer();

                        localService.insertAttachmentList(attachmentArray, function (result) {

                            deferSRAttachments.resolve("success");

                            console.log("SRATTACHMENTS");
                        });

                        promises.push(deferSRAttachments.promise);
                    }
                });

                $q.all(promises).then(
                    function (response) {

                        console.log("SUCCESS PROMISE SR");

                        callback("success");

                        console.log("END SR INSERT " + new Date());
                    },

                    function (error) {

                        console.log("FAILURE PROMISE SR");

                        callback("failure");

                        console.log("END SR INSERT " + new Date());
                    }
                );

            }).error(function (error) {

                console.log("END SR ERROR " + new Date());

                callback("error");

                console.log("ERROR SR " + JSON.stringify(error));
            });
        };

        function updateDebrief(formData, callback) {

            console.log("REQUEST DEBRIEF " + JSON.stringify(formData));

            console.log("START DEBRIEF " + new Date());

            $http({

                method: 'POST',
                url: url + 'combine_update/combine_update',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getDebriefBackId()
                },
                data: formData

            }).success(function (response) {

                console.log("END DEBRIEF " + new Date());

                console.log("RESPONSE DEBRIEF " + JSON.stringify(response));

                callback("success");

            }).error(function (error) {

                console.log("END DEBRIEF ERROR " + new Date());

                callback("failure");

                console.log("ERROR DEBRIEF " + JSON.stringify(error));
            });
        };

        function updateOFSCStatus(formData, callback) {

            var data = {
                "masteractivityId": formData.Activity_Id + "",
                "XA_TASK_STATUS": formData.XA_TASK_STATUS,
                "resourceId": constantService.getResourceId() + "",
                "OFSCdate": moment.utc(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                "TaskId": formData.TaskId + "",
                "email": formData.email != undefined ? formData.email : "",
                "CompletedDateOSC": formData.completeDate != undefined ? formData.completeDate : "",
                "followUp": formData.followUp != undefined ? formData.followUp : "",
                "salesQuote": formData.salesQuote != undefined ? formData.salesQuote : "",
                "salesVisit": formData.salesVisit != undefined ? formData.salesVisit : "",
                "salesLead": formData.salesLead != undefined ? formData.salesLead : "",
                "followuptext": formData.followuptext != undefined ? formData.followuptext : "",
                "sparequotetext": formData.sparequotetext != undefined ? formData.sparequotetext : "",
                "salesText": formData.salesText != undefined ? formData.salesText : "",
                "salesleadText": formData.salesleadText != undefined ? formData.salesleadText : "",
                "denySignature": formData.denySignature != undefined ? formData.denySignature : "",
                "signatureComments": formData.signatureComments != undefined ? formData.signatureComments : ""
            };

            console.log("START OFSC " + new Date());

            console.log("REQUEST OFSC " + JSON.stringify(data));

            $http({

                method: 'POST',
                //url: url + 'OFSC_Workflow/test_ofsc',
                url: url + 'OFSC_Workflow/workflow_OFSC',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getStatusBackId()
                },
                data: data

            }).success(function (response) {

                console.log("END OFSC " + new Date());

                console.log("RESPONSE OFSC " + JSON.stringify(response));

                callback("success");

            }).error(function (error) {

                console.log("END OFSC ERROR " + new Date());

                callback("failure");

                console.log("ERROR OFSC " + JSON.stringify(error));
            });
        };

        function createAttachment(attachment, callback) {

            console.log("START CREATE ATTACHMENT " + new Date());

            $http({

                method: 'POST',
                url: url + 'Create_Attachment/attachment_create',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getCreateBackId()
                },
                data: attachment

            }).success(function (response) {

                console.log("END CREATE ATTACHMENT " + new Date());

                console.log("RESPONSE CREATE ATTACHMENT " + JSON.stringify(response));

                callback("success");

            }).error(function (error) {

                console.log("END CREATE ATTACHMENT ERROR " + new Date());

                callback("failure");

                console.log("CREATE ATTACHMENT ERROR " + JSON.stringify(error));
            });
        };

        function downloadAttachment(attachmentObject, callback) {

            var data = {};

            if (attachmentObject.Task_Number != undefined && attachmentObject.Task_Number != null && attachmentObject.Task_Number != "") {

                data = {
                    "path": "/tasks",
                    "TaskID": attachmentObject.Task_Number,
                    "IncidentID": "",
                    "FileAttachmentID": attachmentObject.Attachment_Id
                };

            } else if (attachmentObject.SRID != undefined && attachmentObject.SRID != null && attachmentObject.SRID != "") {

                data = {
                    "path": "/incidents",
                    "TaskID": "",
                    "IncidentID": attachmentObject.SRID,
                    "FileAttachmentID": attachmentObject.Attachment_Id
                };
            }

            console.log("REQUEST DOWNLOAD ATTACHMENT " + JSON.stringify(data));

            console.log("START DOWNLOAD ATTACHMENT " + new Date());

            $http({

                method: 'POST',
                url: url + 'download_Attachment/download_attachments',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getDownloadBackId()
                },
                data: data

            }).success(function (response) {

                console.log("END DOWNLOAD ATTACHMENT " + new Date());

                // console.log("RESPONSE DOWNLOAD ATTACHMENT " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("END DOWNLOAD ATTACHMENT ERROR " + new Date());

                callback(error);

                if (error != undefined) {

                    console.log("ERROR DOWNLOAD ATTACHMENT " + JSON.stringify(error));
                }
            });
        };

        function deleteAPI(callback) {

            var data = {
                "resourceId": constantService.getResourceId(),
                //"updateDate": new Date("2017-12-24T06:59:59.202Z").toISOString()
                "updateDate": new Date(constantService.getUser().Last_Updated_Delete).toISOString(),
                "taskId": ""
            };

            console.log("REQUEST DELETE API " + JSON.stringify(data));

            console.log("START DELETE API " + new Date());

            var userObject = {
                'ID': constantService.getUser().ID,
                'Last_Updated_Delete': new Date()
            };

            $http({

                method: 'POST',
                url: url + 'Record_Deletion/Records_deleted',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getDeleteBackId()
                },
                data: data

            }).success(function (response) {

                localService.updateLastDelete(userObject);

                console.log("END DELETE API " + new Date());

                console.log("RESPONSE DELETE API " + JSON.stringify(response));

                var promises = [];

                var taskArray = [];
                var installArray = [];
                var noteArray = [];
                var contactArray = [];

                angular.forEach(response.DeletedRecords, function (item) {

                    if (item.Record_Deletion && item.Record_Deletion.length > 0) {

                        angular.forEach(item.Record_Deletion, function (object) {

                            if (object.Record_Type == "EngineerDisassociation") {

                                taskArray.push(object);

                            } else if (object.Record_Type == "Installed Base") {

                                installArray.push(object);

                            } else if (object.Record_Type == "Notes") {

                                noteArray.push(object);

                            } else if (object.Record_Type == "ContactDisassociation") {

                                contactArray.push(object);
                            }
                        });
                    }

                    if (item.Standard_Record_Deletion && item.Standard_Record_Deletion.length > 0) {

                        angular.forEach(item.Standard_Record_Deletion, function (object) {

                            if (object.Record_Type == "Field Jobs") {

                                taskArray.push(object);

                            } else if (object.Record_Type == "Contacts") {

                                contactArray.push(object);
                            }
                        });
                    }
                });

                if (taskArray.length > 0) {

                    var deferTask = $q.defer();

                    localService.deleteTaskRecord(taskArray, function (result) {

                        deferTask.resolve("success");

                        console.log("DELETE TASK");
                    });

                    promises.push(deferTask.promise);
                }

                if (installArray.length > 0) {

                    var deferInstall = $q.defer();

                    localService.deleteInstallRecord(installArray, function (result) {

                        deferInstall.resolve("success");

                        console.log("DELETE INSTALL");
                    });

                    promises.push(deferInstall.promise);
                }

                if (contactArray.length > 0) {

                    var deferContact = $q.defer();

                    localService.deleteContactRecord(contactArray, function (result) {

                        deferContact.resolve("success");

                        console.log("DELETE CONTACT");
                    });

                    promises.push(deferContact.promise);
                }

                if (noteArray.length > 0) {

                    var deferNote = $q.defer();

                    localService.deleteNoteRecord(noteArray, function (result) {

                        deferNote.resolve("success");

                        console.log("DELETE NOTE");
                    });

                    promises.push(deferNote.promise);
                }

                console.log("TASK " + taskArray.length);

                console.log("CONTACT " + contactArray.length);

                console.log("INSTALL " + installArray.length);

                console.log("NOTE " + noteArray.length);

                console.log("LENGTH " + promises.length);

                $q.all(promises).then(
                    function (response) {

                        console.log("SUCCESS PROMISE DELETE");

                        callback("success");

                        console.log("END DELETE " + new Date());
                    },

                    function (error) {

                        console.log("FAILURE PROMISE DELETE");

                        callback("failure");

                        console.log("END DELETE " + new Date());
                    }
                );

            }).error(function (error) {

                console.log("END DELETE API ERROR " + new Date());

                callback(error);

                console.log("DELETE API ERROR " + JSON.stringify(error));
            });
        };


        function setCredentials(email, password, userId) {

            var authData = Base64.encode(email + ':' + password);

            $rootScope.globals = {

                currentUser: {

                    email: email,
                    userId: userId,
                    authData: authData,
                    rootUrl: url
                },

                adminDetails: $rootScope.admin
            };

            $http.defaults.headers.common['Authorization'] = 'Basic ' + authData;

            // $cookieStore.put('advGlobalObj', $rootScope.globals);
        };

        function clearCredentials() {

            $rootScope.globals = {};

            // $cookieStore.remove('advGlobalObj');
        };
    }

    var Base64 = {

        keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        encode: function (input) {

            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        },

        decode: function (input) {

            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            var base64test = /[^A-Za-z0-9\+\/\=]/g;

            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {

                enc1 = this.keyStr.indexOf(input.charAt(i++));
                enc2 = this.keyStr.indexOf(input.charAt(i++));
                enc3 = this.keyStr.indexOf(input.charAt(i++));
                enc4 = this.keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

})();
