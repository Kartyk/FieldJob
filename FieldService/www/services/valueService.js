(function () {

    'use strict';

    app.service('valueService', valueService);

    valueService.$inject = ['$http', '$rootScope', '$window', '$location', '$q', 'localService', 'cloudService', '$mdDialog'];

    function valueService($http, $rootScope, $window, $location, $q, localService, cloudService, $mdDialog) {

        var futureTask;

        var service = {};

        var resourceId = null;

        var userObject = {};

        var warrantyType = null;

        var taskId = null;

        var header = null;

        var networkStatus = false;

        var language = "";

        var debriefChanged = false;

        var enggTime = "";

        var custTime = "";

        var debrief = {
            task: {},
            taskList: [],
            installBase: [],
            contacts: [],
            taskNotes: [],
            taskAttachment: [],
            time: [],
            expense: [],
            material: [],
            notes: [],
            attachment: [],
            engineer: {},
            overTime: [],
            shiftCode: [],
            fieldName: [],
            chargeMethod: [],
            chargeType: [],
            expenseType: [],
            noteType: [],
            workType: [],
            item: [],
            currency: [],
            UOM: [],
            tool: []
        };

        var userType = {
            name: '',
            clarityType: '',
            defaultView: '',
            duration: ''
        };

        service.setResourceId = setResourceId;
        service.getResourceId = getResourceId;

        service.setUser = setUser;
        service.getUser = getUser;

        service.setUserType = setUserType;
        service.getUserType = getUserType;

        service.setHeader = setHeader;
        service.getHeader = getHeader;

        service.setTask = setTask;
        service.getTask = getTask;

        service.setTaskList = setTaskList;
        service.getTaskList = getTaskList;

        service.setInstallBase = setInstallBase;
        service.getInstallBase = getInstallBase;

        service.getContact = getContact;
        service.getTaskNotes = getTaskNotes;
        service.getTaskAttachment = getTaskAttachment;

        service.setTaskId = setTaskId;
        service.getTaskId = getTaskId;

        service.setTime = setTime;
        service.getTime = getTime;

        service.setExpense = setExpense;
        service.getExpense = getExpense;

        service.setMaterial = setMaterial;
        service.getMaterial = getMaterial;

        service.setNote = setNote;
        service.getNote = getNote;

        service.setAttachment = setAttachment;
        service.getAttachment = getAttachment;

        service.setEngineer = setEngineer;
        service.getEngineer = getEngineer;

        service.setOverTime = setOverTime;
        service.getOverTime = getOverTime;

        service.setShiftCode = setShiftCode;
        service.getShiftCode = getShiftCode;

        service.getChargeType = getChargeType;
        service.getChargeMethod = getChargeMethod;
        service.getFieldJob = getFieldJob;

        service.getWorkType = getWorkType;
        service.getItem = getItem;
        service.getCurrency = getCurrency;
        service.getUOM = getUOM;

        service.getTool = getTool;

        service.getExpenseType = getExpenseType;
        service.getNoteType = getNoteType;

        service.getDebrief = getDebrief;
        service.saveValues = saveValues;

        service.setWarrantyType = setWarrantyType;
        service.getWarrantyType = getWarrantyType;

        service.setNetworkStatus = setNetworkStatus;
        service.getNetworkStatus = getNetworkStatus;

        service.saveBase64File = saveBase64File;
        service.saveFile = saveFile;
        service.openFile = openFile;

        service.submitDebrief = submitDebrief;
        service.uploadAttachment = uploadAttachment;
        service.updateStatus = updateStatus;
        service.acceptTask = acceptTask;

        service.checkIfFutureDayTask = checkIfFutureDayTask;
        service.setIfFutureDateTask = setIfFutureDateTask;
        service.getIfFutureDateTask = getIfFutureDateTask;

        service.setLanguage = setLanguage;
        service.getLanguage = getLanguage;
        service.setDebriefChanged = setDebriefChanged;
        service.getDebriefChanged = getDebriefChanged
        service.setEnggSignTime = setEnggSignTime;
        service.setCustSignTime = setCustSignTime;
        service.getEnggSignTime = getEnggSignTime;
        service.getCustSignTime = getCustSignTime;
        service.startWorking = startWorking;
        service.syncData = syncData;
        service.showDialog = showDialog;

        return service;

        function setDebriefChanged(isChanged) {
            debriefChanged = isChanged;
        };

        function getDebriefChanged() {
            return debriefChanged;
        };

        function setLanguage(lang) {
            language = lang;
        };

        function getLanguage() {
            return language;
        };

        function setResourceId(id) {
            resourceId = id;
        };

        function getResourceId() {
            return resourceId;
        };

        function setUser(user) {

            userObject = user;

            setUserType();
        };

        function getUser() {
            return userObject;
        };

        function setIfFutureDateTask(value) {

            futureTask = value;
        };

        function getIfFutureDateTask() {
            return futureTask;
        };

        function setUserType() {

            userType.name = getUser().Name;

            userType.defaultView = getUser().Default_View;

            userType.duration = getUser().Work_Hour;

            if (getUser().ClarityID == "1" || getUser().ClarityID != "") {

                userType.clarityType = 'C';

            } else {

                userType.clarityType = 'NC';
            }
        };

        function getUserType() {
            return userType;
        };

        function setHeader(headerValue) {
            header = headerValue;
        };

        function getHeader() {
            return header;
        };

        function setTask(taskObject, callback) {

            console.log("SET TASK DETAILS");

            $rootScope.dbCall = true;

            debrief.task = taskObject;

            var promiseArray = [];

            var deferInstall = $q.defer();

            localService.getInstallBaseList(taskObject.Task_Number, function (response) {

                debrief.installBase = response;

                deferInstall.resolve("success");

                console.log("INSTALL");
            });

            promiseArray.push(deferInstall.promise);

            var deferContact = $q.defer();

            localService.getContactList(taskObject.Task_Number, function (response) {

                debrief.contacts = response;

                deferContact.resolve("success");

                console.log("CONTACTS");
            });

            promiseArray.push(deferContact.promise);

            var deferNote = $q.defer();

            localService.getNoteList(taskObject.Task_Number, function (response) {

                console.log("NOTES");

                localService.getSRNoteList(taskObject.SR_ID, function (result) {

                    debrief.taskNotes = response;

                    angular.forEach(result, function (item) {

                        debrief.taskNotes.push(item);
                    });

                    deferNote.resolve("success");

                    console.log("SR NOTES");
                });
            });

            promiseArray.push(deferNote.promise);

            var deferAttachment = $q.defer();

            localService.getAttachmentList(taskObject.Task_Number, "O", function (response) {

                console.log("ATTACHMENT");

                localService.getSRAttachmentList(taskObject.SR_ID, "S", function (result) {

                    debrief.taskAttachment = response;

                    angular.forEach(result, function (item) {

                        debrief.taskAttachment.push(item);
                    });

                    deferAttachment.resolve("success");

                    console.log("SR ATTACHMENT");
                });
            });

            promiseArray.push(deferAttachment.promise);

            var deferOverTime = $q.defer();

            localService.getOverTimeList(taskObject.Project_Number, function (response) {

                debrief.overTime = response;

                deferOverTime.resolve("success");

                console.log("OVER TIME");
            });

            promiseArray.push(deferOverTime.promise);

            var deferShiftCode = $q.defer();

            localService.getShiftCodeList(taskObject.Project_Number, function (response) {

                debrief.shiftCode = response;

                deferShiftCode.resolve("success");

                console.log("SHIFT CODE");
            });

            promiseArray.push(deferShiftCode.promise);

            var deferFieldJob = $q.defer();

            localService.getFieldJobNameList(taskObject.Project_Number, function (response) {

                debrief.fieldName = response;

                deferFieldJob.resolve("success");

                console.log("FIELD JOB");
            });

            promiseArray.push(deferFieldJob.promise);

            var deferChargeMethod = $q.defer();

            localService.getChargeMethodList(function (response) {

                debrief.chargeMethod = response;

                deferChargeMethod.resolve("success");

                console.log("CHARGE METHOD");
            });

            promiseArray.push(deferChargeMethod.promise);

            var deferChargeType = $q.defer();

            localService.getChargeTypeList(function (response) {

                debrief.chargeType = response;

                deferChargeType.resolve("success");

                console.log("CHARGE TYPE");
            });

            promiseArray.push(deferChargeType.promise);

            var deferExpenseType = $q.defer();

            localService.getExpenseTypeList(function (response) {

                debrief.expenseType = response;

                deferExpenseType.resolve("success");

                console.log("EXPENSE TYPE");
            });

            promiseArray.push(deferExpenseType.promise);

            var deferNoteType = $q.defer();

            localService.getNoteTypeList(function (response) {

                debrief.noteType = response;

                deferNoteType.resolve("success");

                console.log("NOTE TYPE");
            });

            promiseArray.push(deferNoteType.promise);

            var deferWorkType = $q.defer();

            localService.getWorkTypeList(function (response) {

                debrief.workType = response;

                deferWorkType.resolve("success");

                console.log("WORK TYPE");

            });

            promiseArray.push(deferWorkType.promise);

            var deferItem = $q.defer();

            localService.getItemList(function (response) {

                debrief.item = response;

                deferItem.resolve("success");

                console.log("ITEM");
            });

            promiseArray.push(deferItem.promise);

            var deferCurrency = $q.defer();

            localService.getCurrencyList(function (response) {

                debrief.currency = response;

                deferCurrency.resolve("success");

                console.log("CURRENCY");
            });

            promiseArray.push(deferCurrency.promise);

            var deferUOM = $q.defer();

            localService.getUOMList(function (response) {

                debrief.UOM = response;

                deferUOM.resolve("success");

                console.log("UOM");
            });

            promiseArray.push(deferUOM.promise);

            var deferTime = $q.defer();

            localService.getTimeList(taskObject.Task_Number, function (response) {

                debrief.time = response;

                deferTime.resolve("success");

                console.log("TIME");
            });

            promiseArray.push(deferTime.promise);

            var deferExpense = $q.defer();

            localService.getExpenseList(taskObject.Task_Number, function (response) {

                debrief.expense = response;

                deferExpense.resolve("success");

                console.log("EXPENSE");
            });

            promiseArray.push(deferExpense.promise);

            var deferMaterial = $q.defer();

            localService.getMaterialList(taskObject.Task_Number, function (response) {

                debrief.material = response;

                deferMaterial.resolve("success");

                console.log("MATERIAL");
            });

            promiseArray.push(deferMaterial.promise);

            var deferNotes = $q.defer();

            localService.getNotesList(taskObject.Task_Number, function (response) {

                debrief.notes = response;

                deferNotes.resolve("success");

                console.log("D NOTES");
            });

            promiseArray.push(deferNotes.promise);

            var deferAttach = $q.defer();

            localService.getAttachmentList(taskObject.Task_Number, "D", function (response) {

                debrief.attachment = response;

                deferAttach.resolve("success");

                console.log("D ATTACHMENT");
            });

            promiseArray.push(deferAttach.promise);

            var deferEngineer = $q.defer();

            localService.getEngineer(taskObject.Task_Number, function (response) {

                debrief.engineer = response;

                deferEngineer.resolve("success");

                console.log("ENGINEER");

            });

            promiseArray.push(deferEngineer.promise);

            var deferTool = $q.defer();

            localService.getToolList(taskObject.Task_Number, function (response) {

                debrief.tool = response;

                deferTool.resolve("success");

                console.log("TOOL");
            });

            promiseArray.push(deferTool.promise);

            $q.all(promiseArray).then(
                function (response) {

                    console.log("SET TASK SUCCESS ALL");

                    $rootScope.dbCall = false;

                    callback("success")
                },

                function (error) {

                    console.log("SET TASK FAILURE ALL");

                    $rootScope.dbCall = false;

                    callback("failure")
                }
            );
        };

        function getTask() {

            return debrief.task;
        };

        function setTaskList() {

            localService.getTaskList(function (response) {

                debrief.taskList = response;
            });
        };

        function getTaskList() {
            return debrief.taskList;
        };

        function setInstallBase(installBaseObject) {

            debrief.installBase = installBaseObject;
        };

        function getInstallBase() {

            return debrief.installBase;
        };

        function getContact() {

            return debrief.contacts;
        };

        function getTaskNotes() {

            return debrief.taskNotes;
        };

        function getTool() {

            return debrief.tool;
        };

        function getTaskAttachment() {

            return debrief.taskAttachment;
        };

        function setTaskId(task) {

            taskId = task;
        };

        function getTaskId() {

            return taskId;
        };

        function setTime(timeArray) {

            debrief.time = timeArray;
        };

        function getTime() {

            return debrief.time;
        };

        function setExpense(expenseArray) {

            debrief.expense = expenseArray;
        };

        function getExpense() {

            return debrief.expense;
        };

        function setMaterial(materialArray) {

            debrief.material = materialArray;
        };

        function getMaterial() {

            return debrief.material;
        };

        function setNote(noteArray) {

            debrief.notes = noteArray;
        };

        function getNote() {

            return debrief.notes;
        };

        function setAttachment(attachmentArray) {

            debrief.attachment = attachmentArray;
        };

        function getAttachment() {

            return debrief.attachment;
        };

        function setEngineer(engineerObject) {

            debrief.engineer = engineerObject;
        };

        function getEngineer() {

            return debrief.engineer;
        };

        function setOverTime(overTimeArray) {

            debrief.overTime = overTimeArray;
        };

        function getOverTime() {

            return debrief.overTime;
        };

        function setShiftCode(shiftCodeArray) {

            debrief.shiftCode = shiftCodeArray;
        };

        function getShiftCode() {

            return debrief.shiftCode;
        };

        function getChargeType() {

            return debrief.chargeType;
        };

        function getChargeMethod() {

            return debrief.chargeMethod;
        };

        function getFieldJob() {

            return debrief.fieldName;
        };

        function getWorkType() {

            return debrief.workType;
        };

        function getItem() {

            return debrief.item;
        };

        function getCurrency() {

            return debrief.currency;
        };

        function getUOM() {

            return debrief.UOM;
        };

        function getExpenseType() {

            return debrief.expenseType;
        };

        function getNoteType() {

            return debrief.noteType;
        };

        function getDebrief() {

            return debrief;
        };

        function setNetworkStatus(status) {

            networkStatus = status;
        };

        function getNetworkStatus() {

            return networkStatus;
        };

        function saveValues() {

            if (debrief.time.length == 0) {
                localService.deleteTime(debrief.task.Task_Number);
            }

            if (debrief.expense.length == 0) {
                localService.deleteExpense(debrief.task.Task_Number);
            }

            if (debrief.material.length == 0) {
                localService.deleteMaterial(debrief.task.Task_Number);
            }

            if (debrief.notes.length == 0) {
                localService.deleteNotes(debrief.task.Task_Number);
            }

            if (debrief.attachment.length == 0) {
                localService.deleteAttachment(debrief.task.Task_Number);
            }

            if (debrief.time.length > 0) {

                localService.deleteTime(debrief.task.Task_Number);
                localService.insertTimeList(debrief.time, function (result) {
                    console.log("Time Success")
                });
            }

            if (debrief.expense.length > 0) {

                localService.deleteExpense(debrief.task.Task_Number);
                localService.insertExpenseList(debrief.expense, function (result) {
                    console.log("Expense Success")
                });
            }

            if (debrief.material.length > 0) {

                localService.deleteMaterial(debrief.task.Task_Number);
                localService.insertMaterialList(debrief.material, function (result) {
                    console.log("Material Success")
                });
            }

            if (debrief.notes.length > 0) {

                localService.deleteNotes(debrief.task.Task_Number);
                localService.insertNotesList(debrief.notes, function (result) {
                    console.log("Notes Success")
                });
            }

            if (debrief.attachment.length > 0) {

                localService.deleteAttachment(debrief.task.Task_Number);
                localService.insertAttachmentList(debrief.attachment, function (result) {
                    console.log("Attachment Success")
                });
            }

            if (debrief.engineer != undefined && debrief.engineer.Task_Number != null) {

                localService.deleteEngineer(debrief.task.Task_Number);
                localService.insertEngineerList(debrief.engineer, function (result) {
                    console.log("Engineer Success")
                });
            }

            setDebriefChanged(false);
        };

        function setWarrantyType(type) {

            warrantyType = type;
        };

        function getWarrantyType() {

            return warrantyType;
        };

        function b64toBlob(b64Data, contentType, sliceSize) {

            contentType = contentType || '';

            sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);

            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {

                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);

                for (var i = 0; i < slice.length; i++) {

                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, {
                type: contentType
            });

            return blob;
        };

        function saveBase64File(folderpath, filename, content, contentType, defer) {

            var DataBlob = b64toBlob(content, contentType);

            // console.log("START WRITING");

            window.resolveLocalFileSystemURL(folderpath, function (dir) {

                // console.log("ACCESS GRANTED");

                dir.getFile(filename, {
                    create: true
                }, function (file) {

                    // console.log("FILE CREATED SUCCESSFULLY");

                    file.createWriter(function (fileWriter) {

                        // console.log("WRITING CONTENT TO FILE");

                        fileWriter.write(DataBlob);

                        if (defer != null)
                            defer.resolve();

                    }, function () {

                        console.log("UNABLE TO SAVE " + folderpath);
                    });
                });
            });
        };

        function saveFile(folderpath, filename, file) {

            var DataBlob = file;

            console.log("START WRITING");

            window.resolveLocalFileSystemURL(folderpath, function (dir) {

                console.log("ACCESS GRANTED");

                dir.getFile(filename, {
                    create: true
                }, function (file) {

                    console.log("FILE CREATED SUCCESSFULLY");

                    file.createWriter(function (fileWriter) {

                        console.log("WRITING CONTENT TO FILE");

                        fileWriter.write(DataBlob);

                    }, function () {

                        console.log("UNABLE TO SAVE " + folderpath);
                    });
                });
            });
        };

        function openFile(filePath, fileType, callback) {

            cordova.plugins.fileOpener2.open(filePath, fileType, {

                error: function (e) {
                    console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                    if (callback != null && callback != undefined) {
                        callback();
                    }
                },
                success: function () {
                    console.log('File opened successfully');
                }
            });
        };

        function copyDatabaseFile(dbName) {

            var sourceFileName = cordova.file.applicationDirectory + 'www/db/' + dbName;

            var targetDirName = cordova.file.dataDirectory;

            console.log("DB PATH", targetDirName);

            return Promise.all([

                new Promise(function (resolve, reject) {

                    resolveLocalFileSystemURL(sourceFileName, resolve, reject);
                }),

                new Promise(function (resolve, reject) {

                    resolveLocalFileSystemURL(targetDirName, resolve, reject);
                })

            ]).then(function (files) {

                var sourceFile = files[0];

                var targetDir = files[1];

                return new Promise(function (resolve, reject) {

                    targetDir.getFile(dbName, {}, resolve, reject);

                }).then(function () {

                    console.log("File already copied");

                }).catch(function () {

                    console.log("File doesn't exist, copying it");

                    return new Promise(function (resolve, reject) {

                        sourceFile.copyTo(targetDir, dbName, resolve, reject);

                    }).then(function () {

                        console.log("File copied");
                    });
                });
            });
        };

        function startWorking(item, callback) {

            var statusData = {
                "TaskId": item.Task_Number,
                "Activity_Id": item.Activity_Id,
                //"XA_TASK_STATUS": "11",
                "XA_TASK_STATUS": "10",
                "taskStatus": "Working"
            };

            cloudService.updateOFSCStatus(statusData, function (response) {

                console.log("Task Working " + JSON.stringify(response));

                var taskObject = {
                    Task_Status: "Working",
                    Task_Number: item.Task_Number,
                    Date: new Date(),
                    Submit_Status: "I"
                };

                localService.updateTaskSubmitStatus(taskObject, function (result) {

                    callback(result);
                });
            });
        };

        function acceptTask(item, callback) {

            var statusData = {
                "TaskId": item.Task_Number,
                "Activity_Id": item.Activity_Id,
                "XA_TASK_STATUS": "8",
                "taskStatus": "Accepted"
            };

            cloudService.updateOFSCStatus(statusData, function (response) {

                if (response == "success") {

                    var taskObject = {
                        Task_Status: "Accepted",
                        Task_Number: item.Task_Number,
                        Date: new Date(),
                        Submit_Status: "I",
                        Sync_Status: "I"
                    };

                    localService.updateTaskSubmitStatus(taskObject, function (result) {

                        callback("success");
                    });

                } else {

                    var taskObject = {
                        Task_Status: "Accepted",
                        Task_Number: item.Task_Number,
                        Date: new Date(),
                        Submit_Status: "P",
                        Sync_Status: "PA"
                    };

                    localService.updateTaskSubmitStatus(taskObject, function (result) {

                        callback("failure");
                    });
                }
            });
        };

        function submitDebrief(taskObject, taskId, callback) {

            var timeArray = [];
            var expenseArray = [];
            var materialArray = [];
            var notesArray = [];

            var timeJSONData = [];
            var expenseJSONData = [];
            var materialJSONData = [];
            var noteJSONData = [];

            localService.getTimeList(taskId, function (response) {

                timeArray = response;

                for (var i = 0; i < timeArray.length; i++) {

                    var chargeMethod;

                    if (getUserType().clarityType == 'C') {

                        chargeMethod = timeArray[i].Charge_Method_Id;

                    } else {

                        chargeMethod = "";
                    }

                    var shiftcode = "", timecode = "";

                    if (timeArray[i].Time_Code_Value != undefined) {
                        timecode = timeArray[i].Time_Code_Value;
                    }

                    if (timeArray[i].Shift_Code_Value != undefined) {
                        shiftcode = timeArray[i].Shift_Code_Value;
                    }

                    var startDate = new Date(timeArray[i].Date);
                    startDate.setHours(new Date(timeArray[i].Start_Time).getHours());
                    startDate.setMinutes(new Date(timeArray[i].Start_Time).getMinutes());

                    var endDate = new Date(timeArray[i].Date);
                    endDate.setHours(new Date(timeArray[i].End_Time).getHours());
                    endDate.setMinutes(new Date(timeArray[i].End_Time).getMinutes());

                    var timeData = {
                        "task_id": timeArray[i].Task_Number,
                        "shift_code": timeArray[i].Shift_Code_Id,
                        "overtime_shiftcode": timeArray[i].Time_Code_Id,
                        "shiftCodevalue": shiftcode,
                        "overTimeShiftCodevalue": timecode,
                        "charge_type": timeArray[i].Charge_Type_Id,
                        "duration": timeArray[i].Duration,
                        "comments": timeArray[i].Comments,
                        "labor_item": timeArray[i].Item_Id,
                        "labor_description": timeArray[i].Description,
                        "work_type": timeArray[i].Work_Type_Id,
                        "start_date": moment.utc(startDate).format("YYYY-MM-DDTHH:mm:ss.000Z"),
                        "end_date": moment.utc(endDate).format("YYYY-MM-DDTHH:mm:ss.000Z"),
                        "charge_method": chargeMethod,
                        "JobName": timeArray[i].Field_Job_Name_Id
                    };

                    timeJSONData.push(timeData);
                }

                localService.getExpenseList(taskId, function (response) {

                    expenseArray = response;

                    for (var i = 0; i < expenseArray.length; i++) {

                        var expenseData = {
                            "taskId": expenseArray[i].Task_Number,
                            "comments": expenseArray[i].Justification,
                            "currency": expenseArray[i].Currency_Id.toString(),
                            "distance": expenseArray[i].Distance,
                            "unitofmeasurement": expenseArray[i].UOM_Id,
                            "chargeMethod": expenseArray[i].Charge_Method_Id.toString(),
                            "ammount": expenseArray[i].Amount,
                            "date": moment.utc(new Date(expenseArray[i].Date)).format("YYYY-MM-DD"),
                            "expenseItem": expenseArray[i].Expense_Type_Id.toString()
                        };

                        expenseJSONData.push(expenseData);
                    }

                    localService.getMaterialList(taskId, function (response) {

                        materialArray = response;

                        angular.forEach(materialArray, function (item) {

                            var serialIn, serialOut, serialNo;

                            if (item.Serial_In != undefined) {

                                serialIn = item.Serial_In.split(",");
                            }

                            if (item.Serial_Out != undefined) {

                                serialOut = item.Serial_Out.split(",");
                            }

                            if (item.Serial_Number != undefined) {

                                serialNo = item.Serial_Number.split(",")
                            }

                            item.Serial_Type = [];

                            if (serialNo != undefined && serialNo.length > 0) {

                                angular.forEach(serialNo, function (serail) {

                                    var serialTypeObject = {};

                                    serialTypeObject.in = "";
                                    serialTypeObject.out = "";
                                    serialTypeObject.number = serail;

                                    if (serialTypeObject.number != "")
                                        item.Serial_Type.push(serialTypeObject);
                                });
                            }

                            if (serialIn != undefined && serialIn.length > 0 && serialOut != undefined && serialOut.length > 0) {

                                var index = 0;

                                angular.forEach(serialIn, function (serial) {

                                    var serialTypeObject = {};

                                    serialTypeObject.in = serial;
                                    serialTypeObject.out = serialOut[index];
                                    serialTypeObject.number = "";

                                    if (serialTypeObject.in != "")
                                        item.Serial_Type.push(serialTypeObject);

                                    index++;
                                });
                            }

                            angular.forEach(item.Serial_Type, function (key) {

                                var materialData = {
                                    "charge_method": item.Charge_Type_Id.toString(),
                                    "task_id": item.Task_Number,
                                    "item_description": item.Description,
                                    "product_quantity": "1",
                                    "comments": "",
                                    "item": item.ItemName,
                                    "serialin": key.in,
                                    "serialout": key.out,
                                    "serial_number": key.number
                                }

                                materialJSONData.push(materialData);
                            });
                        });

                        localService.getNotesList(taskId, function (response) {

                            notesArray = response;

                            for (var i = 0; i < notesArray.length; i++) {

                                var noteData = {
                                    "Notes_type": notesArray[i].Note_Type_Id,
                                    "notes_description": notesArray[i].Notes,
                                    "task_id": notesArray[i].Task_Number,
                                    "mobilecreatedDate": moment.utc(new Date(notesArray[i].Date)).format("YYYY-MM-DDTHH:mm:ss.000Z")
                                };

                                noteJSONData.push(noteData);
                            }

                            var formData = {
                                "Time": timeJSONData,
                                "expense": expenseJSONData,
                                "Material": materialJSONData,
                                "Notes": noteJSONData
                            };

                            cloudService.updateDebrief(formData, function (response) {

                                if (response == "success") {

                                    console.log("DEBRIEF");

                                    var taskChangeObject = {
                                        Task_Status: "Completed",
                                        Task_Number: taskId,
                                        Submit_Status: "P",
                                        Sync_Status: "PU"
                                    };

                                    localService.updateTaskSubmitStatus(taskChangeObject, function (result) {

                                        uploadAttachment(taskObject, taskId, callback);
                                    });

                                } else {

                                    var taskChangeObject = {
                                        Task_Status: "Completed",
                                        Task_Number: taskId,
                                        Submit_Status: "P",
                                        Sync_Status: "PD"
                                    };

                                    localService.updateTaskSubmitStatus(taskChangeObject, function (result) {

                                        callback("failure");
                                    });
                                }
                            });
                        });
                    });
                });
            });
        };

        function uploadAttachment(taskObject, taskId, callback) {

            localService.getAttachmentList(taskId, "D", function (response) {

                var promises = [];

                var attachmentJSONData = [];

                angular.forEach(response, function (attachment) {

                    var deferred = $q.defer();

                    var attachmentObject = {};

                    var fileName = attachment.File_Name.split(".")[0];

                    var attachFileName = fileName.trim(0, 34);

                    attachmentObject.taskId = attachment.Task_Number;
                    attachmentObject.contentType = attachment.File_Type;
                    attachmentObject.FileName = attachFileName + '.' + attachment.File_Name.split(".")[1];
                    attachmentObject.Description = attachment.File_Name.split(".")[0];
                    attachmentObject.Name = "";

                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

                        fs.root.getFile(attachment.File_Name, {
                            create: true,
                            exclusive: false
                        }, function (fileEntry) {

                            fileEntry.file(function (file) {

                                var reader = new FileReader();

                                reader.onloadend = function () {

                                    attachmentObject.Data = this.result.split(",")[1];

                                    attachmentJSONData.push(attachmentObject);

                                    deferred.resolve(attachmentObject);
                                };

                                reader.readAsDataURL(file);
                            });
                        });
                    });

                    promises.push(deferred.promise);
                });

                var deferred = $q.defer();

                promises.push(deferred.promise);

                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

                    fs.root.getFile("Report_" + taskId + "_en.pdf", {
                        create: true,
                        exclusive: false
                    }, function (fileEntry) {

                        fileEntry.file(function (file) {

                            var reader = new FileReader();

                            reader.onloadend = function () {

                                var reportObject = {
                                    "Data": this.result.split(",")[1],
                                    "FileName": "Report_" + taskId + "_en.pdf",
                                    "Description": "Report_" + taskId + "_en.pdf",
                                    "Name": "",
                                    "taskId": taskId,
                                    "contentType": "application/pdf"
                                };

                                deferred.resolve();

                                attachmentJSONData.push(reportObject);
                            };

                            reader.readAsDataURL(file);
                        });
                    });
                });

                if (taskObject.Country == "People's Republic of China" || taskObject.Country.toLowerCase() == "china") {

                    var deferredCh = $q.defer();

                    promises.push(deferredCh.promise);

                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

                        fs.root.getFile("Report_" + taskId + "_ch.pdf", {
                            create: true,
                            exclusive: false
                        }, function (fileEntry) {

                            fileEntry.file(function (file) {

                                var reader = new FileReader();

                                reader.onloadend = function () {

                                    var reportObjectCh = {
                                        "Data": this.result.split(",")[1],
                                        "FileName": "Report_" + taskId + "_ch.pdf",
                                        "Description": "Report_" + taskId + "_ch.pdf",
                                        "Name": "",
                                        "taskId": taskId,
                                        "contentType": "application/pdf"
                                    };

                                    deferredCh.resolve();

                                    attachmentJSONData.push(reportObjectCh);
                                };

                                reader.readAsDataURL(file);
                            });
                        });
                    });
                }

                $q.all(promises).then(function (response) {

                    var attachmentUploadJSON = {
                        "attachment": attachmentJSONData
                    };

                    console.log("START ATTACHMENT API " + new Date());

                    cloudService.createAttachment(attachmentUploadJSON, function (response) {

                        console.log("END ATTACHMENT API " + new Date());

                        if (response == "success") {

                            console.log("ATTACHMENT");

                            var taskChangeObject = {
                                Task_Status: "Completed",
                                Task_Number: taskId,
                                Submit_Status: "P",
                                Sync_Status: "PS"
                            };

                            localService.updateTaskSubmitStatus(taskChangeObject, function (result) {

                                updateStatus(taskObject, taskId, callback);
                            });

                        } else {

                            var taskChangeObject = {
                                Task_Status: "Completed",
                                Task_Number: taskId,
                                Submit_Status: "P",
                                Sync_Status: "PU"
                            };

                            localService.updateTaskSubmitStatus(taskChangeObject, function (result) {

                                callback("failure");
                            });
                        }
                    });

                }, function (error) {

                    var taskChangeObject = {
                        Task_Status: "Completed",
                        Task_Number: taskId,
                        Submit_Status: "P",
                        Sync_Status: "PU"
                    };

                    localService.updateTaskSubmitStatus(taskChangeObject, function (result) {

                        callback("failure");
                    });
                });
            });
        };

        function updateStatus(taskObject, taskId, callback) {

            localService.getEngineer(taskId, function (response) {

                if (response != undefined) {

                    var statusData = {
                        "TaskId": taskId,
                        "Activity_Id": taskObject.Activity_Id,
                        //"XA_TASK_STATUS": "3",
                        "XA_TASK_STATUS": "2",
                        "taskstatus": "Completed-Awaiting Review",
                        "email": taskObject.Email,
                        "completeDate": moment.utc(new Date(taskObject.Date)).format("YYYY-MM-DDTHH:mm:ss.000Z"),
                        "followUp": response.followUp + "",
                        "salesQuote": response.salesQuote + "",
                        "salesVisit": response.salesVisit + "",
                        "salesLead": response.salesLead + "",
                        "followuptext": response.Follow_Up,
                        "sparequotetext": response.Spare_Quote,
                        "salesText": response.Sales_Visit,
                        "salesleadText": response.Sales_Head,
                        "denySignature": response.isCustomerSignChecked + "",
                        "signatureComments": response.customerComments
                    };

                    cloudService.updateOFSCStatus(statusData, function (response) {

                        if (response == "success") {

                            console.log("STATUS");

                            var taskChangeObject = {
                                Task_Status: "Completed",
                                Task_Number: taskId,
                                Submit_Status: "I",
                                Sync_Status: "I"
                            };

                            localService.updateTaskSubmitStatus(taskChangeObject, function (result) {

                                callback("success");
                            });

                        } else {

                            var taskChangeObject = {
                                Task_Status: "Completed",
                                Task_Number: taskId,
                                Submit_Status: "P",
                                Sync_Status: "PS"
                            };

                            localService.updateTaskSubmitStatus(taskChangeObject, function (result) {

                                callback("failure");
                            });
                        }
                    });

                } else {

                    var taskChangeObject = {
                        Task_Status: "Completed",
                        Task_Number: taskId,
                        Submit_Status: "P",
                        Sync_Status: "PS"
                    };

                    localService.updateTaskSubmitStatus(taskChangeObject, function (result) {

                        callback("failure");
                    });
                }
            });
        };

        function checkIfFutureDayTask(selTask) {

            var currDate = new Date;

            var selDate = new Date(selTask.Start_Date.split(" ")[0]);

            // console.log(currDate);
            //
            // console.log(selDate);

            if (selDate.getFullYear() > currDate.getFullYear()) {

                return true;

            } else if (selDate.getFullYear() === currDate.getFullYear()) {

                if (selDate.getMonth() > currDate.getMonth()) {

                    return true;

                } else if (selDate.getMonth() === currDate.getMonth()) {

                    if (selDate.getDate() > currDate.getDate()) {

                        return true;
                    }
                }
            }

            return false;
        };

        function syncData() {

            cloudService.getTaskList(function (response) {

            });

            cloudService.getInstallBaseList();
            cloudService.getContactList();
            cloudService.getNoteList();

            cloudService.getOverTimeList();
            cloudService.getShiftCodeList();

            cloudService.getChargeType();
            cloudService.getChargeMethod();
            cloudService.getFieldJobName();

            cloudService.getWorkType();
            cloudService.getItem();
            cloudService.getCurrency();

            cloudService.getExpenseType();
            cloudService.getNoteType();

        };

        function setEnggSignTime(time) {
            enggTime = time;
        };

        function setCustSignTime(time) {
            custTime = time;
        };

        function getEnggSignTime() {
            return enggTime;
        };

        function getCustSignTime() {
            return custTime;
        };

        function showDialog(item) {

            $mdDialog.show({
                locals: { dataToPass: item },
                controller: DialogController,
                templateUrl: "app/views/statusDialog.html",
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: false
            }).then(function (selected) {

                // $scope.status = "You said the information was '" + selected + "'.";

            }, function () {

                //$scope.status = "You cancelled the dialog.";
            });

            function DialogController($scope, $mdDialog, dataToPass) {

                $scope.ok = function () {

                    $mdDialog.hide();
                }

                $scope.cancel = function () {

                    $mdDialog.hide();
                }
            }
        }
    }
})();
