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
        service.getTaskDetails = getTaskDetails;
        service.getLOVDetails = getLOVDetails;
        service.getProjectDetails = getProjectDetails;

        service.getSRNotesList = getSRNotesList;
        service.getSRAttachmentList = getSRAttachmentList;

        service.updateAcceptTask = updateAcceptTask;
        service.startTask = startTask;

        service.createAttachment = createAttachment;
        service.downloadAttachment = downloadAttachment;

        service.updateDebrief = updateDebrief;
        service.updateOFSCStatus = updateOFSCStatus;

        service.getTaskList = getTaskList;
        service.getInternalList = getInternalList;

        service.getInstallBaseList = getInstallBaseList;
        service.getContactList = getContactList;
        service.getNoteList = getNoteList;
        service.getAttachmentList = getAttachmentList;
        service.getOverTimeList = getOverTimeList;
        service.getShiftCodeList = getShiftCodeList;
        service.getFieldJobName = getFieldJobName;

        service.getChargeMethod = getChargeMethod;
        service.getChargeType = getChargeType;
        service.getExpenseType = getExpenseType;
        service.getNoteType = getNoteType;
        service.getWorkType = getWorkType;
        service.getItem = getItem;
        service.getCurrency = getCurrency;

        service.uploadTime = uploadTime;
        service.uploadExpense = uploadExpense;
        service.uploadMaterial = uploadMaterial;
        service.uploadNote = uploadNote;

        service.getTaskListCloud = getTaskListCloud;
        service.getInstallBaseListCloud = getInstallBaseListCloud;
        service.getContactListCloud = getContactListCloud;
        service.getNoteListCloud = getNoteListCloud;
        service.getProjectListCloud = getProjectListCloud;
        service.getOverTimeListCloud = getOverTimeListCloud;
        service.getShiftCodeListCloud = getShiftCodeListCloud;
        service.getFieldJobNameCloud = getFieldJobNameCloud;
        service.getChargeMethodCloud = getChargeMethodCloud;
        service.getChargeTypeCloud = getChargeTypeCloud;
        service.getWorkTypeCloud = getWorkTypeCloud;
        service.getItemCloud = getItemCloud;
        service.getCurrencyCloud = getCurrencyCloud;

        service.setCredentials = setCredentials;
        service.clearCredentials = clearCredentials;

        service.OfscActions = OfscActions;

        return service;

        function login(formData, callback) {

            console.log('Login Data', JSON.stringify(formData));

            return $http({

                method: 'GET',
                url: url + 'login_API/verify_login',
                headers: formData.header

            }).success(function (response) {

                console.log('Login Response', JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                callback(error);

                console.log('Login Error', JSON.stringify(error));


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

                console.log('Technician Response', JSON.stringify(response));

                callback(response.technicianProfile);

            }).error(function (error) {

                callback(error);

                console.log('Technician Error', JSON.stringify(error));

            });
        };

        function getTaskInternalList(isLogin, callback) {

            var data = {};

            if (isLogin == "0") {

                data = {
                    "isLogin": isLogin,
                    "fromDate": constantService.getStartDate(),
                    "toDate": constantService.getEndDate(),
                    "updateDate": "",
                    "resourceId": constantService.getResourceId()
                };

            } else if (isLogin == "1") {

                data = {
                    "isLogin": isLogin,
                    "fromDate": constantService.getStartDate(),
                    "toDate": constantService.getEndDate(),
                    "updateDate": new Date(constantService.getUser().Last_Updated).toISOString(),
                    "resourceId": constantService.getResourceId()
                };
            }

            console.log("TASK REQUEST " + JSON.stringify(data));

            console.log("START TASK " + new Date());

            $http({

                method: 'POST',
                url: url + "getTaskList/get_list",
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getCombinedBackId()
                },
                data: data

            }).success(function (response) {

                console.log("END TASK " + new Date());

                console.log("TASK RESPONSE " + JSON.stringify(response));

                var taskList = [];

                var internalList = [];

                var taskInternalList = [];

                getInternalList(function (resultInternal) {

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

                    if (resultInternal && resultInternal.length > 0) {

                        angular.forEach(resultInternal, function (internalObject) {

                            internalList.push(internalObject);
                        });
                    }

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

                                    console.log("TASK INTERNAL LIST INSERT SUCCESS");

                                    constantService.setTaskList(taskInternalList);

                                    callback(taskInternalList);

                                    console.log("TASK INTERNAL END " + new Date());
                                });
                            });
                        });
                    });
                });

            }).error(function (error) {

                console.log("END TASK ERROR " + new Date());

                callback(error);

                console.log("TASK ERROR " + JSON.stringify(error));
            });
        };

        function getInternalList(callback) {

            var internalList = [];

            var startDate = new Date();

            startDate.setDate(startDate.getDate() + 15);

            var startDateISOFormat = moment(startDate).format('YYYY-MM-DD');

            var endDate = new Date();

            endDate.setDate(endDate.getDate() + 45);

            var endDateISOFormat = moment(endDate).format('YYYY-MM-DD');

            console.log("START INTERNAL " + new Date());

            $http({

                method: 'POST',
                url: url + 'Internal_OFSC/get_ids',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getInternalBackId()
                },
                data: {
                    "resourceId": constantService.getResourceId(),
                    "fromDate": startDateISOFormat,
                    "toDate": endDateISOFormat
                }

            }).success(function (response) {

                console.log("END INTERNAL " + new Date());

                console.log("INTERNAL RESPONSE " + JSON.stringify(response.activities));

                if (response && response.activities) {

                    callback(response.activities);

                } else {

                    callback(internalList);
                }

            }).error(function (error) {

                console.log("END INTERNAL ERROR======> " + new Date());

                callback(internalList);

                console.log("INTERNAL ERROR " + JSON.stringify(error));
            });
        };

        function getTaskDetails(isLogin, callback) {

            var data = {};

            if (isLogin == "0") {

                data = {
                    "isLogin": isLogin,
                    "fromDate": constantService.getStartDate(),
                    "toDate": constantService.getEndDate(),
                    "updateDate": "",
                    "resourceId": constantService.getResourceId()
                };

            } else if (isLogin == "1") {

                data = {
                    "isLogin": isLogin,
                    "fromDate": constantService.getStartDate(),
                    "toDate": constantService.getEndDate(),
                    "updateDate": new Date(constantService.getUser().Last_Updated).toISOString(),
                    "resourceId": constantService.getResourceId()
                };
            }

            console.log("TASK DETAIL REQUEST " + JSON.stringify(data));

            console.log("START TASK DETAIL " + new Date());

            $http({

                method: 'POST',
                url: url + "getTaskDetails/get_Tasks",
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getCombinedBackId()
                },
                data: data

            }).success(function (response) {

                console.log("END TASK DETAIL " + new Date());

                console.log("TASK DETAIL RESPONSE " + JSON.stringify(response));

                var promises = [];

                angular.forEach(response.getTaskDetails, function (item) {

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

                    if (item.FileID && item.FileID.length > 0) {

                        var attachmentArray = [];

                        var filePath = cordova.file.dataDirectory;

                        angular.forEach(item.FileID, function (item) {

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

                console.log("LENGTH TASK DETAILS " + promises.length);

                $q.all(promises).then(
                    function (response) {

                        console.log("TASK DETAILS INSERT SUCCESS");

                        callback("success");

                        console.log("END TASK DETAILS INSERT " + new Date());
                    },

                    function (error) {

                        console.log("TASK DETAILS INSERT FAILURE");

                        callback("failure");

                        console.log("END TASK DETAILS INSERT END " + new Date());
                    }
                );

            }).error(function (error) {

                console.log("END TASK DETAIL ERROR " + new Date());

                callback(error);

                console.log("TASK DETAIL ERROR " + JSON.stringify(error));
            });
        };

        function getProjectDetails(projectArray, callback) {

            console.log("START PROJECT " + new Date());

            console.log("PROJECT REQUEST " + projectArray);

            $http({

                method: 'POST',
                url: url + 'getProjectDetails/Project_Number',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getProjectBackId()
                },
                data: { "projectNumber": projectArray }

            }).success(function (response) {

                console.log("END PROJECT " + new Date());

                console.log("PROJECT RESPONSE " + JSON.stringify(response));

                var promises = [];

                angular.forEach(response.ProjectDetails, function (item) {

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

                console.log("LENGTH PROJECT DETAILS " + promises.length);

                $q.all(promises).then(
                    function (response) {

                        console.log("PROJECT DETAILS INSERT SUCCESS");

                        callback("success");

                        console.log("END PROJECT DETAILS INSERT " + new Date());
                    },

                    function (error) {

                        console.log("PROJECT DETAILS INSERT FAILURE");

                        callback("failure");

                        console.log("END PROJECT DETAILS INSERT " + new Date());
                    }
                );

            }).error(function (error) {

                console.log("END PROJECT ERROR " + new Date());

                callback("error");

                console.log("PROJECT ERROR " + JSON.stringify(error));
            });

        };

        function getLOVDetails(isLogin, callback) {

            var data = {};

            if (isLogin == "0") {

                data = {
                    "isLogin": isLogin,
                    "fromDate": constantService.getStartDate(),
                    "toDate": constantService.getEndDate(),
                    "updateDate": "",
                    "resourceId": constantService.getResourceId()
                };

            } else if (isLogin == "1") {

                data = {
                    "isLogin": isLogin,
                    "fromDate": constantService.getStartDate(),
                    "toDate": constantService.getEndDate(),
                    "updateDate": new Date(constantService.getUser().Last_Updated).toISOString(),
                    "resourceId": constantService.getResourceId()
                };
            }

            console.log("LOV REQUEST " + JSON.stringify(data));

            console.log("START LOV " + new Date());

            $http({

                method: 'POST',
                url: url + "getLOVDetails/LOV_Details",
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getCombinedBackId()
                }

            }).success(function (response) {

                console.log("END LOV " + new Date());

                console.log("LOV RESPONSE " + JSON.stringify(response));

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

                        console.log("LOV INSERT SUCCESS");

                        callback("success");

                        console.log("END LOV INSERT " + new Date());
                    },

                    function (error) {

                        console.log("LOV INSERT FAILURE");

                        callback("failure");

                        console.log("END LOV INSERT " + new Date());
                    }
                );

            }).error(function (error) {

                console.log("END LOV ERROR " + new Date());

                callback(error);

                console.log("LOV ERROR " + JSON.stringify(error));
            });
        };

        function getSRNotesList(srNumberArray, callback) {

            console.log("SR NOTES REQUEST" + JSON.stringify({ "SRNum": srNumberArray }));

            console.log("START SR NOTES " + new Date());

            $http({

                method: 'POST',
                url: url + 'Fetch_NotesSR/notes_SR',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getSRBackId()
                },
                data: { "SRNum": srNumberArray }

            }).success(function (response) {

                console.log("END SR NOTES " + new Date());

                console.log("SR NOTES RESPONSE " + JSON.stringify(response));

                var noteArray = [];

                angular.forEach(response.Notes_by_SRs, function (item) {

                    angular.forEach(item.NotesSR, function (object) {

                        noteArray.push(object);
                    });
                });

                localService.insertSRNotesList(noteArray, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("END SR NOTES ERROR " + new Date());

                callback("error");

                console.log("SR NOTES ERROR " + JSON.stringify(error));
            });
        };

        function getSRAttachmentList(srNumberArray, callback) {

            console.log("SR ATTACHMENT REQUEST " + JSON.stringify({ "SRID": srNumberArray }));

            console.log("START SR ATTACHMENT " + new Date());

            $http({

                method: 'POST',
                url: url + 'Fetch_SRAttachments/SR_Attachment',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getSRBackId()
                },
                data: { "SRID": srNumberArray }

            }).success(function (response) {

                console.log("END SR ATTACHMENT " + new Date());

                console.log("SR ATTACHMENT RESPONSE " + JSON.stringify(response));

                $rootScope.apicall = true;

                var attachmentArray = [];

                var filePath = cordova.file.dataDirectory;

                angular.forEach(response.Attachment_by_SRs, function (item) {

                    angular.forEach(item.AttachmentbySR, function (object) {

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
                });

                localService.insertAttachmentList(attachmentArray, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("END SR ATTACHMENT ERROR " + new Date());

                callback("error");

                console.log("SR ATTACHMENT ERROR " + JSON.stringify(error));
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

                console.log("CREATE ATTACHMENT RESPONSE " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("END CREATE ATTACHMENT ERROR " + new Date());

                callback(error);

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

            console.log("START DOWNLOAD ATTACHMENT " + + new Date());

            console.log("DOWNLOAD ATTACHMENT REQUEST " + JSON.stringify(data));

            $http({

                method: 'POST',
                url: url + 'download_Attachment/download_attachments',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getSRBackId()
                },
                data: data

            }).success(function (response) {

                console.log("END DOWNLOAD ATTACHMENT " + + new Date());

                // console.log("DOWNLOAD ATTACHMENT RESPONSE " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("END DOWNLOAD ATTACHMENT ERROR " + + new Date());

                callback(error);

                if (error != undefined) {

                    console.log("DOWNLOAD ATTACHMENT ERROR " + JSON.stringify(error));
                }
            });
        };

        function updateDebrief(formData, callback) {

            console.log("START DEBRIEF " + + new Date());

            console.log("DEBRIEF REQUEST " + JSON.stringify(formData));

            $http({

                method: 'POST',
                url: url + 'combine_update/combine_update',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getCombinedBackId()
                },
                data: formData

            }).success(function (response) {

                console.log("END DEBRIEF " + + new Date());

                console.log("DEBRIEF RESPONSE " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("END DEBRIEF ERROR " + + new Date());

                callback(error);

                console.log("DEBRIEF ERROR " + JSON.stringify(error));
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

            console.log("START OFSC " + + new Date());

            console.log("OFSC REQUEST " + JSON.stringify(data));

            $http({

                method: 'POST',
                url: url + 'OFSC_Workflow/test_ofsc',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getCombinedBackId()
                },
                data: data

            }).success(function (response) {

                console.log("END OFSC " + + new Date());

                console.log("OFSC RESPONSE " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("END OFSC ERROR " + + new Date());

                callback(error);

                console.log("OFSC ERROR " + JSON.stringify(error));
            });
        };



        function updateAcceptTask(formData, callback) {

            console.log("Accept Task Data", JSON.stringify(formData));

            return $http({

                method: 'POST',
                url: url + 'UpdateTaskDetails/update',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getUpdateStatusBackId()
                },
                data: formData

            }).success(function (response) {

                console.log("AcceptTask Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("AcceptTask Error " + JSON.stringify(error));

                callback(error);
            });
        };

        function startTask(formData, callback) {

            console.log("Start Task Data", JSON.stringify(formData));

            return $http({

                method: 'POST',
                url: url + 'StartworkAPI/to_startwork?taskId=' + formData.taskId
                + '&taskStatus=' + formData.taskStatus,
                headers: formData.header

            }).success(function (response) {

                console.log("Start Task Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("Start Task Error " + JSON.stringify(error));

                callback(error);
            });
        };

        function getTaskList(callback) {

            var taskArray = [];

            var internalOFSCResponse = [];

            $http({

                method: 'GET',
                url: url + 'TaskDetails_Combined/Task_Details?resourceId=' + constantService.getResourceId()
                + '&fromDate=' + constantService.getStartDate()
                + '&toDate=' + constantService.getEndDate(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getNewOfscBackId()
                }

            }).success(function (response) {

                console.log("Task Response " + JSON.stringify(response.TaskDetails));

                getInternalList(function (internalresponse) {

                    angular.forEach(internalresponse, function (item) {

                        var internalOFSCJSONObject = {};

                        internalOFSCJSONObject.Start_Date = item.Start_time;
                        internalOFSCJSONObject.End_Date = item.End_time;
                        internalOFSCJSONObject.Type = "INTERNAL";
                        internalOFSCJSONObject.Customer_Name = item.Activity_type;
                        internalOFSCJSONObject.Task_Number = item.Activity_Id;

                        internalOFSCResponse.push(internalOFSCJSONObject);
                    });

                    angular.forEach(response.TaskDetails, function (item) {

                        item.Type = "CUSTOMER";

                        item.email = "";

                        item.Date = new Date();

                        taskArray.push(item);
                    });

                    localService.insertTaskList(taskArray, function (result) {

                        console.log("TASK");

                        angular.forEach(internalOFSCResponse, function (item) {

                            taskArray.push(item);
                        });

                        constantService.setTaskList(taskArray);

                        callback(taskArray);

                    });
                });

            }).error(function (error) {

                console.log("Task Error " + JSON.stringify(error));

                callback(error);
            });
        };

        function getInstallBaseList(callback) {

            $http({

                method: 'GET',
                url: url + 'InstallBase/install_base?resourceId=' + constantService.getResourceId()
                + '&fromDate=' + constantService.getStartDate()
                + '&toDate=' + constantService.getEndDate(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getNewBackEndId()
                }

            }).success(function (response) {

                console.log("Install Base Response " + JSON.stringify(response));

                localService.insertInstallBaseList(response.InstallBase, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("Install Base Error " + JSON.stringify(error));

                callback("error");
            });
        };

        function getContactList(callback) {

            console.log("START DATE " + constantService.getStartDate() + " END DATE" + constantService.getEndDate());

            $http({

                method: 'GET',
                url: url + 'Contact/contacts_api?resourceId=' + constantService.getResourceId()
                + '&fromDate=' + constantService.getStartDate()
                + '&toDate=' + constantService.getEndDate(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getExpenseBackEndId()
                }

            }).success(function (response) {

                console.log("Contact Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertContactList(response.Contacts, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("Contact Error " + JSON.stringify(error));

                callback("error");
            });
        };

        function getNoteList(callback) {

            $http({

                method: 'GET',
                url: url + 'Notes/notes_api?resourceId=' + constantService.getResourceId()
                + '&fromDate=' + constantService.getStartDate()
                + '&toDate=' + constantService.getEndDate(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("Note Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertNoteList(response.Notes, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("Note Error " + JSON.stringify(error));

                callback("error");
            });
        };

        function getAttachmentList(callback) {

            $http({

                method: 'GET',
                url: url + 'FileID/to_getfileid?Id=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getSRBackId()
                }

            }).success(function (response) {

                console.log("Attachment Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                var attachmentArray = [];

                var filePath = cordova.file.dataDirectory;

                angular.forEach(response.FileID, function (item) {

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

                localService.insertAttachmentList(attachmentArray, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("Attachment Error " + JSON.stringify(error));

                callback("error");
            });
        };

        function getOverTimeList(callback) {

            $http({

                method: 'GET',
                url: url + 'OverTImeShiftCode/to_get_overtimeshiftcode?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("OverTime Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertOverTimeList(response.OverTImeShiftCode, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("OverTime Error " + JSON.stringify(error));

                callback("error");
            });
        };

        function getShiftCodeList(callback) {

            $http({

                method: 'GET',
                url: url + 'Shiftcode_API/to_get_shiftcode?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("ShiftCode Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertShiftCodeList(response.ShiftCode, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("ShiftCode Error " + JSON.stringify(error));

                callback("error");
            });
        };

        function getFieldJobName(callback) {

            $http({

                method: 'GET',
                url: url + 'TaskName/to_get_taskname?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("FieldJob Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertFieldJobNameList(response.TaskName, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("Field Job Error " + JSON.stringify(error));

                callback("error");
            });
        };

        function getChargeMethod(callback) {

            $http({

                method: 'GET',
                url: url + 'ChargeMethodLOV/chrgmthd?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("ChargeMethod Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertChargeMethodList(response.Charge_Method, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("Charge Method Error " + JSON.stringify(error));

                callback("error");
            });
        };

        function getChargeType(callback) {

            $http({

                method: 'GET',
                url: url + 'ChargeTypeLov/charge_type?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("ChargeType Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertChargeTypeList(response.Charge_Type, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("Charge Type Error " + JSON.stringify(error));

                callback("error");
            });
        };

        function getExpenseType(callback) {

            $http({

                method: 'GET',
                url: url + 'ExpenseTypeLOV/expense_type?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getInternalBackId()
                }

            }).success(function (response) {

                console.log("ExpenseType Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertExpenseTypeList(response.ExpenseType, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("ExpenseType Error " + JSON.stringify(error));

                callback("error");
            });
        };

        function getNoteType(callback) {

            $http({

                method: 'GET',
                url: url + 'NotesTypeLOV/notes_type?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getOfscBackId()
                }

            }).success(function (response) {

                console.log("NoteType Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertNoteTypeList(response.Notes_Type, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("NoteType Error " + JSON.stringify(error));

                callback("error");
            });
        };

        function getWorkType(callback) {

            $http({

                method: 'GET',
                url: url + 'workTypeLOV/work_type?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("WorkType Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertWorkTypeList(response.Charge_Method, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("WorkType Error " + JSON.stringify(error));

                callback("error");
            });
        };

        function getItem(callback) {

            $http({

                method: 'GET',
                url: url + 'Items_LOV/item_lov?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getSRBackId()
                }

            }).success(function (response) {

                console.log("Item Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertItemList(response.Items, function (result) {

                    callback("success");

                });

            }).error(function (error) {

                console.log("Item Error " + JSON.stringify(error));

                callback("error");
            });
        };

        function getCurrency(callback) {

            $http({

                method: 'GET',
                url: url + 'CurrenciesLOV/get_currency?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("Currency Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertCurrencyList(response.Charge_Method, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("Currency Error " + JSON.stringify(error));

                callback("error");
            });
        };


        function uploadTime(timedata, callback) {

            console.log("Time Data " + JSON.stringify(timedata));

            return $http({

                method: 'POST',
                url: url + 'Time_API/time_data',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getNewBackEndId()
                },
                data: timedata

            }).success(function (response) {

                console.log("Upload Time Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("Upload Time Error " + JSON.stringify(error));

                callback(error);
            });
        };

        function uploadExpense(expenseData, callback) {

            console.log("Expense Data " + JSON.stringify(expenseData));
            //SIT 16807770-ff88-468b-a729-059fc92b32f7
            return $http({

                method: 'POST',
                url: url + 'Expense_API/expense_pull',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": "02593e79-7fe6-4296-baf6-ea2a1448638c"
                },
                data: expenseData

            }).success(function (response) {

                console.log("Upload Expense Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("Upload Expense Error " + JSON.stringify(error));

                callback(error);
            });
        };

        function uploadMaterial(materialData, callback) {

            var urlWarranty = "Material_API/material_update";

            console.log("Material Data" + JSON.stringify(materialData));

            $http({

                method: 'POST',
                url: url + urlWarranty,
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                },
                data: materialData

            }).success(function (response) {

                console.log("Upload Material Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("Upload Material Error " + JSON.stringify(error));

                callback(error);
            });
        };

        function uploadNote(noteData, callback) {

            console.log("Note Data", JSON.stringify(noteData));

            return $http({

                method: 'POST',
                url: url + 'Update_Notes_API/to_update_notes',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getNewBackEndId()
                },
                data: noteData

            }).success(function (response) {

                console.log("Upload Note Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("Upload Note Error " + JSON.stringify(error));

                callback(error);
            });
        };

        function getTaskListCloud(formData, callback) {

            console.log("Task Cloud Data", JSON.stringify(formData));

            $http({

                method: 'GET',
                url: url + 'TaskDetails/Resource_ID_taskdetails?resourceId=' + formData.resourceId
                + '&fromDate=' + formData.startDate
                + '&toDate=' + formData.endDate,
                headers: formData.header

            }).success(function (response) {

                console.log("Task Cloud Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("Task Cloud Error " + JSON.stringify(error));

                callback(error);
            });
        };

        function getInstallBaseListCloud(formData, callback) {

            console.log("InstallBase Cloud Data", JSON.stringify(formData));

            $http({

                method: 'GET',
                url: url + 'InstallBase/install_base?resourceId=' + formData.resourceId
                + '&fromDate=' + formData.startDate
                + '&toDate=' + formData.endDate,
                headers: formData.header

            }).success(function (response) {

                console.log("InstallBase Cloud Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("InstallBase Cloud Error " + JSON.stringify(error));

                callback(error);
            });
        };

        function getContactListCloud(formData, callback) {

            console.log("Contact Cloud Data", JSON.stringify(formData));

            $http({

                method: 'GET',
                url: url + 'Contact/contacts_api?resourceId=' + formData.resourceId
                + '&fromDate=' + formData.startDate
                + '&toDate=' + formData.endDate,
                headers: formData.header

            }).success(function (response) {

                console.log("Contact Cloud Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("Contact Cloud Error " + JSON.stringify(error));

                callback(error);
            });
        };

        function getNoteListCloud(callback) {

            $http({

                method: 'GET',
                url: url + 'Notes/notes_api?resourceId=' + constantService.getResourceId()
                + '&fromDate=' + constantService.getStartDate()
                + '&toDate=' + constantService.getEndDate(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getTaskBackId()
                }

            }).success(function (response) {

                console.log("Note Cloud Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("Note Cloud Error " + JSON.stringify(error));

                callback(error);
            });
        };

        function getProjectListCloud(formData, callback) {

            console.log("Project Cloud Data", JSON.stringify(formData));

            $http({

                method: 'GET',
                url: url + 'Project_API/to_get_project?resourceId=' + formData.resourceId
                + '&fromDate=' + formData.startDate
                + '&toDate=' + formData.endDate,
                headers: formData.header

            }).success(function (response) {

                console.log("Project Cloud Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("Project Cloud Error " + JSON.stringify(error));

                callback(error);
            });
        };

        function getOverTimeListCloud(callback) {

            $http({

                method: 'GET',
                url: url + 'OverTImeShiftCode/to_get_overtimeshiftcode?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getShiftBackId()
                }

            }).success(function (response) {

                console.log("OverTime Cloud Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("OverTime Cloud Error " + JSON.stringify(error));

                callback(error);
            });
        };

        function getShiftCodeListCloud(callback) {

            $http({

                method: 'GET',
                url: url + 'Shiftcode_API/to_get_shiftcode?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getShiftBackId()
                }

            }).success(function (response) {

                console.log("ShiftCode Cloud Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("ShiftCode Cloud Error " + JSON.stringify(error));

                callback(error);
            });
        };

        function getFieldJobNameCloud(callback) {

            $http({

                method: 'GET',
                url: url + 'TaskName/to_get_taskname?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getFieldBackId()
                }

            }).success(function (response) {

                // console.log("downloadAttachment Cloud Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                callback(error);
            });
        };

        function getChargeMethodCloud(callback) {

            $http({

                method: 'GET',
                url: url + 'ChargeMethodLOV/chrgmthd?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                // console.log("downloadAttachment Cloud Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                callback(error);
            });
        };

        function getChargeTypeCloud(callback) {

            $http({

                method: 'GET',
                url: url + 'ChargeTypeLov/charge_type?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                // console.log("downloadAttachment Cloud Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                callback(error);
            });
        };

        function getWorkTypeCloud(callback) {

            $http({

                method: 'GET',
                url: url + 'workTypeLOV/work_type?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("WorkType Response " + JSON.stringify(response));

                callback(response);

                //  localService.insertWorkTypeList(response.Charge_Method);

            }).error(function (error) {

                console.log("WorkType Error " + JSON.stringify(error));

                callback(error);
            });
        };

        function getItemCloud(callback) {

            $http({

                method: 'GET',
                url: url + 'Items_LOV/item_lov?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("Item Response " + JSON.stringify(response));

                callback(response);

                //localService.insertItemList(response.Charge_Method);

            }).error(function (error) {

                console.log("Item Error " + JSON.stringify(error));

                callback(error);
            });
        };

        function getCurrencyCloud(callback) {

            $http({

                method: 'GET',
                url: url + 'CurrenciesLOV/get_currency?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("Currency Response " + JSON.stringify(response));

                callback(response);

                //localService.insertCurrencyList(response.Charge_Method);

            }).error(function (error) {

                console.log("Currency Error " + JSON.stringify(error));

                callback(error);
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

        function OfscActions(activateId, isWork, callback) {

            var data = {
                "resourceId": constantService.getUser().OFSCId,
                "date": moment(new Date()).utcOffset(constantService.getTimeZone()).format('YYYY-MM-DD')
            };

            ofscService.activate_resource(data, function (response) {

                if (response != undefined && response != null) {

                    console.log("ACTIVATE RESOURCE " + JSON.stringify(response));

                    var updateStatus = {};

                    if (isWork) {

                        //updateStatus = {
                        //    "activity_id": activateId,
                        //    "XA_TASK_STATUS": "11"
                        //};
                        //SIT
                        updateStatus = {
                            "activity_id": activateId,
                            "XA_TASK_STATUS": "10"
                        };

                    } else {
                        //SIT
                        updateStatus = {
                            "activity_id": activateId,
                            "XA_TASK_STATUS": "2"
                        };
                        //DEV
                        //updateStatus = {
                        //    "activity_id": activateId,
                        //    "XA_TASK_STATUS": "3"
                        //};
                    }

                    ofscService.updateStatus(updateStatus, function (response) {

                        var activityDetails = {
                            "activityId": activateId
                        };

                        ofscService.activityDetails(activateId, function (response) {

                            if (response != undefined && response.items != undefined && response.items.length > 0) {

                                var startActivity = false;

                                angular.forEach(response.items, function (item) {

                                    var date = new Date(item.startTime);

                                    if (date.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)) {

                                        startActivity = true;

                                        var startActivityData = {
                                            "activity_id": item.activityId + "",
                                            "time": moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                                        };

                                        console.log("startActivityData " + startActivityData.activityId);

                                        ofscService.start_activity(startActivityData, function (response) {

                                            if (!isWork) {

                                                var complete = {
                                                    "activityId": startActivityData.activity_id,
                                                    "date": moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                                                };

                                                console.log("completeActivityId " + complete.activityId);

                                                console.log("completeActivityDate " + complete.date);
                                                //DEV
                                                //var updateTaskSegement = {
                                                //    "activity_id": startActivityData.activity_id,
                                                //    "XA_TASK_STATUS": "3"
                                                //};
                                                //SIT
                                                var updateTaskSegement = {
                                                    "activity_id": startActivityData.activity_id,
                                                    "XA_TASK_STATUS": "2"
                                                };

                                                console.log("updateTaskSegment " + JSON.stringify(updateTaskSegement));

                                                ofscService.updateStatus(updateTaskSegement, function (response) {

                                                    if (response) {

                                                        ofscService.complete_activity(complete, function (response) {

                                                            callback();
                                                        });
                                                    }
                                                });

                                            } else {

                                                callback();
                                            }
                                        });
                                    }
                                });

                                if (!startActivity) {

                                    callback();

                                }
                                //else if (!startActivity)
                                //{
                                //    ofscService.complete_activity(data, function (response) {
                                //        callback();
                                //    })
                                //}
                            } else {
                                callback();
                            }
                        });
                    });
                }
            });
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
