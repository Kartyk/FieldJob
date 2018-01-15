(function () {

    "use strict";

    app.factory("localService", localService);

    localService.$inject = ["$http", "$rootScope", "$window", "$location", "$q", "constantService"];

    function localService($http, $rootScope, $window, $location, $q, constantService) {

        var service = {};

        var db;

        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {

            db = sqlitePlugin.openDatabase({
                name: "emerson.sqlite",
                location: "default"
            });
        }

        service.getUserLogin = getUserLogin;
        service.updateSyncStatus = updateSyncStatus;
        service.updateLastSync = updateLastSync;
        service.updateLastTask = updateLastTask;
        service.updateLastInternal = updateLastInternal;
        service.updateLastTaskDetail = updateLastTaskDetail;
        service.updateLastProject = updateLastProject;
        service.updateLastLOV = updateLastLOV;
        service.updateLastSR = updateLastSR;
        service.updateLastDelete = updateLastDelete;

        service.getUser = getUser;
        service.insertUserList = insertUserList;
        service.updateUser = updateUser;
        service.deleteUser = deleteUser;

        service.insertTaskList = insertTaskList;
        service.insertInternalList = insertInternalList;

        service.insertInstallBaseList = insertInstallBaseList;
        service.insertContactList = insertContactList;
        service.insertNoteList = insertNoteList;
        service.insertAttachmentList = insertAttachmentList;
        service.insertOverTimeList = insertOverTimeList;
        service.insertShiftCodeList = insertShiftCodeList;
        service.insertFieldJobNameList = insertFieldJobNameList;

        service.insertChargeMethodList = insertChargeMethodList;
        service.insertChargeTypeList = insertChargeTypeList;
        service.insertExpenseTypeList = insertExpenseTypeList;
        service.insertNoteTypeList = insertNoteTypeList;
        service.insertWorkTypeList = insertWorkTypeList;
        service.insertItemList = insertItemList;
        service.insertCurrencyList = insertCurrencyList;
        service.insertUOMList = insertUOMList;

        service.insertTimeList = insertTimeList;
        service.insertExpenseList = insertExpenseList;
        service.insertMaterialList = insertMaterialList;
        service.insertNotesList = insertNotesList;
        service.insertEngineerList = insertEngineerList;
        service.insertToolList = insertToolList;

        service.getTaskList = getTaskList;
        service.getInternalList = getInternalList;

        service.getSRAttachmentList = getSRAttachmentList;
        service.getAttachmentListType = getAttachmentListType;

        service.getInstallBaseList = getInstallBaseList;
        service.getContactList = getContactList;
        service.getNoteList = getNoteList;
        service.getSRNoteList = getSRNoteList;
        service.getAttachmentList = getAttachmentList;
        service.getOverTimeList = getOverTimeList;
        service.getShiftCodeList = getShiftCodeList;
        service.getFieldJobNameList = getFieldJobNameList;

        service.getChargeMethodList = getChargeMethodList;
        service.getChargeTypeList = getChargeTypeList;
        service.getExpenseTypeList = getExpenseTypeList;
        service.getNoteTypeList = getNoteTypeList;
        service.getWorkTypeList = getWorkTypeList;
        service.getItemList = getItemList;
        service.getCurrencyList = getCurrencyList;
        service.getUOMList = getUOMList;

        service.getTimeList = getTimeList;
        service.getExpenseList = getExpenseList;
        service.getMaterialList = getMaterialList;
        service.getNotesList = getNotesList;
        service.getEngineer = getEngineer;
        service.getToolList = getToolList;

        service.getPendingTaskList = getPendingTaskList;
        service.getAcceptTaskList = getAcceptTaskList;

        service.deleteTaskList = deleteTaskList;
        service.deleteInternalList = deleteInternalList;

        service.deleteInstallBaseList = deleteInstallBaseList;
        service.deleteContactList = deleteContactList;
        service.deleteNoteList = deleteNoteList;
        service.deleteAttachmentList = deleteAttachmentList;
        service.deleteOverTimeList = deleteOverTimeList;
        service.deleteShiftCodeList = deleteShiftCodeList;
        service.deleteFieldJobNameList = deleteFieldJobNameList;

        service.deleteChargeMethodList = deleteChargeMethodList;
        service.deleteChargeTypeList = deleteChargeTypeList;
        service.deleteExpenseTypeList = deleteExpenseTypeList;
        service.deleteNoteTypeList = deleteNoteTypeList;
        service.deleteWorkTypeList = deleteWorkTypeList;
        service.deleteItemList = deleteItemList;
        service.deleteCurrencyList = deleteCurrencyList;

        service.deleteTimeList = deleteTimeList;
        service.deleteExpenseList = deleteExpenseList;
        service.deleteMaterialList = deleteMaterialList;
        service.deleteNotesList = deleteNotesList;
        service.deleteEngineerList = deleteEngineerList;
        service.deleteToolList = deleteToolList;

        service.deleteTime = deleteTime;
        service.deleteExpense = deleteExpense;
        service.deleteMaterial = deleteMaterial;
        service.deleteNotes = deleteNotes;
        service.deleteAttachment = deleteAttachment;
        service.deleteEngineer = deleteEngineer;
        service.deleteTool = deleteTool;

        service.deleteTaskRecord = deleteTaskRecord;
        service.deleteInstallRecord = deleteInstallRecord;
        service.deleteContactRecord = deleteContactRecord;
        service.deleteNoteRecord = deleteNoteRecord;

        service.updateTaskSubmitStatus = updateTaskSubmitStatus;
        service.updateTaskEmail = updateTaskEmail;
        service.updateAttachmentDownloadStatus = updateAttachmentDownloadStatus;

        service.updateTaskStatus = updateTaskStatus;
        service.updateInstallBaseStatus = updateInstallBaseStatus;
        service.updateContactStatus = updateContactStatus;
        service.updateNoteStatus = updateNoteStatus;
        service.updateAttachmentStatus = updateAttachmentStatus;
        service.updateOverTimeStatus = updateOverTimeStatus;
        service.updateShiftCodeStatus = updateShiftCodeStatus;
        service.updateFieldJobStatus = updateFieldJobStatus;

        return service;

        function getUserLogin(encrypt, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM User WHERE encrypt = ?", [encrypt], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    // console.log("GET USER DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET USER SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET USER TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function updateSyncStatus(userObject) {

            // console.log("USER UPDATE OBJECT =====> " + JSON.stringify(userObject));

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE User SET Sync_Status = ? WHERE ID = ?";

                insertValues.push(userObject.Sync_Status);
                insertValues.push(userObject.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    // console.log("USER ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("USER UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                // console.log("USER UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function updateLastSync(userObject) {

            // console.log("USER UPDATE OBJECT =====> " + JSON.stringify(userObject));

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE User SET Last_Updated = ? WHERE ID = ?";

                insertValues.push(userObject.Last_Updated);
                insertValues.push(userObject.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    // console.log("USER ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("USER UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                // console.log("USER UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function updateLastTask(userObject) {

            // console.log("USER UPDATE OBJECT =====> " + JSON.stringify(userObject));

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE User SET Last_Updated_Task = ? WHERE ID = ?";

                insertValues.push(userObject.Last_Updated_Task);
                insertValues.push(userObject.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    // console.log("USER ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("USER UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                // console.log("USER UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function updateLastInternal(userObject) {

            // console.log("USER UPDATE OBJECT =====> " + JSON.stringify(userObject));

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE User SET Last_Updated_Internal = ? WHERE ID = ?";

                insertValues.push(userObject.Last_Updated_Internal);
                insertValues.push(userObject.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    // console.log("USER ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("USER UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                // console.log("USER UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function updateLastTaskDetail(userObject) {

            // console.log("USER UPDATE OBJECT =====> " + JSON.stringify(userObject));

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE User SET Last_Updated_Task_Detail = ? WHERE ID = ?";

                insertValues.push(userObject.Last_Updated_Task_Detail);
                insertValues.push(userObject.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    // console.log("USER ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("USER UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                // console.log("USER UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function updateLastProject(userObject) {

            // console.log("USER UPDATE OBJECT =====> " + JSON.stringify(userObject));

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE User SET Last_Updated_Project = ? WHERE ID = ?";

                insertValues.push(userObject.Last_Updated_Project);
                insertValues.push(userObject.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    // console.log("USER ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("USER UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                // console.log("USER UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function updateLastLOV(userObject) {

            // console.log("USER UPDATE OBJECT =====> " + JSON.stringify(userObject));

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE User SET Last_Updated_LOV = ? WHERE ID = ?";

                insertValues.push(userObject.Last_Updated_LOV);
                insertValues.push(userObject.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    // console.log("USER ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("USER UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                // console.log("USER UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function updateLastSR(userObject) {

            // console.log("USER UPDATE OBJECT =====> " + JSON.stringify(userObject));

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE User SET Last_Updated_SR = ? WHERE ID = ?";

                insertValues.push(userObject.Last_Updated_SR);
                insertValues.push(userObject.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    // console.log("USER ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("USER UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                // console.log("USER UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function updateLastDelete(userObject) {

            // console.log("USER UPDATE OBJECT =====> " + JSON.stringify(userObject));

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE User SET Last_Updated_Delete = ? WHERE ID = ?";

                insertValues.push(userObject.Last_Updated_Delete);
                insertValues.push(userObject.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    // console.log("USER ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("USER UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                // console.log("USER UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function getUser(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM User", [], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    // console.log("GET USER DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET USER SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET USER TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function insertUserList(response, callback) {

            var responseList = response;

            var promises = [];

            var deferred = $q.defer();

            db.transaction(function (transaction) {

                var sqlSelect = "SELECT * FROM User WHERE ID = " + responseList.ID;

                // console.log("USER  ====> " + sqlSelect);

                transaction.executeSql(sqlSelect, [], function (tx, res) {

                    var rowLength = res.rows.length;

                    // console.log("USER LENGTH ====> " + rowLength);

                    if (rowLength > 0) {

                        updateUserValues(responseList, deferred);

                    } else {

                        insertUser(responseList, deferred);
                    }

                }, function (tx, error) {

                    // console.log("USER SELECT ERROR: " + error.message);

                    deferred.reject(error);
                });

            }, function (error) {

                // console.log("USER SELECT TRANSACTION ERROR: " + error.message);

                deferred.reject(error);
            });

            // console.log("USER OBJECT =====> " + JSON.stringify(responseList));

            promises.push(deferred.promise);

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS USER");
                },

                function (error) {
                    callback("ERROR USER");
                }
            );
        };

        function insertUser(userObject, defer) {

            // console.log("USER INSERT OBJECT =====> " + JSON.stringify(userObject));

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO User VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(userObject.ID);
                insertValues.push(userObject.ClarityID);
                insertValues.push(userObject.Currency);
                insertValues.push(userObject.Default_View);
                insertValues.push(userObject.Email);

                insertValues.push(userObject.Language);
                insertValues.push(userObject.Name);
                insertValues.push(userObject.OFSCId);
                insertValues.push(userObject.Password);
                insertValues.push(userObject.Time_Zone);

                insertValues.push(userObject.Type);
                insertValues.push(userObject.User_Name);
                insertValues.push(userObject.Work_Day);
                insertValues.push(userObject.Work_Hour);
                insertValues.push(userObject.Login_Status);
                insertValues.push(userObject.Sync_Status);
                insertValues.push(userObject.Last_Updated);
                insertValues.push(userObject.Last_Updated_Task);
                insertValues.push(userObject.Last_Updated_Internal);
                insertValues.push(userObject.Last_Updated_Task_Detail);
                insertValues.push(userObject.Last_Updated_Project);
                insertValues.push(userObject.Last_Updated_LOV);
                insertValues.push(userObject.Last_Updated_SR);
                insertValues.push(userObject.Last_Updated_Delete);
                insertValues.push(userObject.encrypt);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    // console.log("USER INSERT ID: " + res.insertId);

                    defer.resolve(res);

                }, function (tx, error) {

                    // console.log("USER INSERT ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("USER INSERT TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function updateUserValues(userObject, defer) {

            // console.log("USER UPDATE OBJECT =====> " + JSON.stringify(userObject));

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE User SET ClarityID = ?, Currency = ?, Default_View = ?, Email = ?, Language = ?, Name = ?, OFSCId = ?, Password = ?, Time_Zone = ?, Type = ?, User_Name = ?, Work_Day = ?, Work_Hour = ?, Login_Status = ?, Sync_Status = ?, Last_Updated = ?, Last_Updated_Task = ?, Last_Updated_Internal = ?, Last_Updated_Task_Detail = ?, Last_Updated_Project = ?, Last_Updated_LOV = ?, Last_Updated_SR = ?, Last_Updated_Delete = ?, encrypt = ?  WHERE ID = ?";

                insertValues.push(userObject.ClarityID);
                insertValues.push(userObject.Currency);
                insertValues.push(userObject.Default_View);
                insertValues.push(userObject.Email);

                insertValues.push(userObject.Language);
                insertValues.push(userObject.Name);
                insertValues.push(userObject.OFSCId);
                insertValues.push(userObject.Password);
                insertValues.push(userObject.Time_Zone);

                insertValues.push(userObject.Type);
                insertValues.push(userObject.User_Name);
                insertValues.push(userObject.Work_Day);
                insertValues.push(userObject.Work_Hour);
                insertValues.push(userObject.Login_Status);
                insertValues.push(userObject.Sync_Status);
                insertValues.push(userObject.Last_Updated);
                insertValues.push(userObject.Last_Updated_Task);
                insertValues.push(userObject.Last_Updated_Internal);
                insertValues.push(userObject.Last_Updated_Task_Detail);
                insertValues.push(userObject.Last_Updated_Project);
                insertValues.push(userObject.Last_Updated_LOV);
                insertValues.push(userObject.Last_Updated_SR);
                insertValues.push(userObject.Last_Updated_Delete);
                insertValues.push(userObject.encrypt);

                insertValues.push(userObject.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    // console.log("USER ROW AFFECTED: " + res.rowsAffected);

                    defer.resolve(res);

                }, function (tx, error) {

                    // console.log("USER UPDATE ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("USER UPDATE TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function updateUser(userObject, callback) {

            // console.log("USER UPDATE OBJECT =====> " + JSON.stringify(userObject));

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE User SET Login_Status = ?  WHERE ID = ?";

                insertValues.push(userObject.Login_Status);
                insertValues.push(userObject.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    // console.log("USER ROW AFFECTED: " + res.rowsAffected);

                    callback("success");

                }, function (tx, error) {

                    // console.log("USER UPDATE ERROR: " + error.message);

                    callback("success");
                });

            }, function (error) {

                // console.log("USER UPDATE TRANSACTION ERROR: " + error.message);

                callback("success");
            });
        };

        function deleteUser() {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlDelete = "DELETE FROM User";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("USER DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function insertTaskList(response, callback) {

            var responseList = response;

            var promises = [];

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    var deferred = $q.defer();

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM Task WHERE Task_Number = " + responseList[i].Task_Number;

                        // console.log("TASK  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            // console.log("TASK LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateTask(responseList[i], deferred);

                            } else {

                                insertTask(responseList[i], deferred);
                            }

                        }, function (tx, error) {

                            // console.log("TASK SELECT ERROR: " + error.message);

                            deferred.reject(error);
                        });

                    }, function (error) {

                        // console.log("TASK SELECT TRANSACTION ERROR: " + error.message);

                        deferred.reject(error);
                    });

                    // console.log("TASK OBJECT =====> " + JSON.stringify(responseList[i]));

                    promises.push(deferred.promise);

                })(i);
            }

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS TASK");
                },

                function (error) {
                    callback("ERROR TASK");
                }
            );
        };

        function updateTask(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Task SET Job_Description = ?, Duration = ?, Task_Status = ?, Customer_Name =?, Street_Address = ?, City = ?, State = ?, Country = ?, Zip_Code = ?, Expense_Method = ?, Labor_Method = ?, Travel_Method = ?, Material_Method = ?, Service_Request = ?, Assigned = ?, Start_Date = ?, End_Date = ?, Activity_Id = ?, Work_Phone_Number = ?, Mobile_Phone_Number = ?, Address1 = ?, SR_ID = ?, Name = ?, Contact_Name = ?, ResourceId = ?, Charge_Type = ?, Project_Number = ? WHERE Task_Number = ?";

                insertValues.push(responseList.Job_Description);
                insertValues.push(responseList.Duration);
                insertValues.push(responseList.Task_Status);
                insertValues.push(responseList.Customer_Name);
                insertValues.push(responseList.Street_Address);
                insertValues.push(responseList.City);
                insertValues.push(responseList.State);
                insertValues.push(responseList.Country);
                insertValues.push(responseList.Zip_Code);
                insertValues.push(responseList.Expense_Method);
                insertValues.push(responseList.Labor_Method);
                insertValues.push(responseList.Travel_Method);
                insertValues.push(responseList.Material_Method);
                insertValues.push(responseList.Service_Request);
                insertValues.push(responseList.Assigned);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.End_Date);
                insertValues.push(responseList.Activity_Id);
                insertValues.push(responseList.Work_Phone_Number);
                insertValues.push(responseList.Mobile_Phone_Number);
                insertValues.push(responseList.Address1);
                insertValues.push(responseList.SR_ID);
                insertValues.push(responseList.Name);
                insertValues.push(responseList.Contact_Name);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.Charge_Type);
                insertValues.push(responseList.Project_Number);
                insertValues.push(responseList.Task_Number);

                // console.log("TASK UPDATE VALUES =====> " + insertValues);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    // console.log("TASK ROW AFFECTED: " + res.rowsAffected);

                    defer.resolve(res);

                }, function (tx, error) {

                    // console.log("TASK UPDATE ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("TASK UPDATE TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertTask(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Task VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.Task_Number);
                insertValues.push(responseList.Job_Description);
                insertValues.push(responseList.Duration);
                insertValues.push(responseList.Task_Status);
                insertValues.push(responseList.Customer_Name);
                insertValues.push(responseList.Street_Address);
                insertValues.push(responseList.City);
                insertValues.push(responseList.State);
                insertValues.push(responseList.Country);
                insertValues.push(responseList.Zip_Code);
                insertValues.push(responseList.Expense_Method);
                insertValues.push(responseList.Labor_Method);
                insertValues.push(responseList.Travel_Method);
                insertValues.push(responseList.Material_Method);
                insertValues.push(responseList.Service_Request);
                insertValues.push(responseList.Assigned);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.End_Date);
                insertValues.push("I");
                insertValues.push(responseList.Email);
                insertValues.push(responseList.Date);
                insertValues.push(responseList.Type);
                insertValues.push(responseList.Activity_Id);
                insertValues.push(responseList.Work_Phone_Number);
                insertValues.push(responseList.Mobile_Phone_Number);
                insertValues.push(responseList.Address1);
                insertValues.push(responseList.SR_ID);
                insertValues.push(responseList.Name);
                insertValues.push(responseList.Contact_Name);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.Charge_Type);
                insertValues.push(responseList.Project_Number);
                insertValues.push("I");

                // console.log("TASK INSERT VALUES =====> " + insertValues);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    // console.log("TASK INSERT ID: " + res.insertId);

                    defer.resolve(res);

                }, function (tx, error) {

                    // console.log("TASK INSERT ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("TASK INSERT TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertInternalList(response, callback) {

            var responseList = response;

            var promises = [];

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    var deferred = $q.defer();

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM Internal WHERE Activity_Id = " + responseList[i].Activity_Id;

                        // console.log("INTERNAL  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            // console.log("INTERNAL LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateInternal(responseList[i], deferred);

                            } else {

                                insertInternal(responseList[i], deferred);
                            }

                        }, function (tx, error) {

                            // console.log("INTERNAL SELECT ERROR: " + error.message);

                            deferred.reject(error);
                        });

                    }, function (error) {

                        // console.log("INTERNAL SELECT TRANSACTION ERROR: " + error.message);

                        deferred.reject(error);
                    });

                    // console.log("INTERNAL OBJECT =====> " + JSON.stringify(responseList[i]));

                    promises.push(deferred.promise);

                })(i);
            }

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS");
                },

                function (error) {
                    callback("ERROR");
                }
            );
        };

        function updateInternal(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Internal SET Start_time = ?, End_time = ?, Activity_type = ?, ResourceId = ? WHERE Activity_Id = ?";

                insertValues.push(responseList.Start_time);
                insertValues.push(responseList.End_time);
                insertValues.push(responseList.Activity_type);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.Activity_Id);

                // console.log("INTERNAL UPDATE VALUES =====> " + insertValues);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    // console.log("INTERNAL ROW AFFECTED: " + res.rowsAffected);

                    defer.resolve(res);

                }, function (tx, error) {

                    // console.log("INTERNAL UPDATE ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("INTERNAL UPDATE TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertInternal(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Internal VALUES (?, ?, ?, ?, ?)";

                insertValues.push(responseList.Activity_Id);
                insertValues.push(responseList.Start_time);
                insertValues.push(responseList.End_time);
                insertValues.push(responseList.Activity_type);
                insertValues.push(constantService.getResourceId());

                // console.log("INTERNAL INSERT VALUES =====> " + insertValues);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    // console.log("INTERNAL INSERT ID: " + res.insertId);

                    defer.resolve(res);

                }, function (tx, error) {

                    // console.log("INTERNAL INSERT ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("INTERNAL INSERT TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertInstallBaseList(response, callback) {

            var responseList = response;

            var promises = [];

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    var deferred = $q.defer();

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM InstallBase WHERE Installed_Base_ID = " + responseList[i].Installed_Base_ID + " AND Task_Number = " + responseList[i].Task_Number;

                        // console.log("INSTALLBASE  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            // console.log("INSTALLBASE LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateInstallBase(responseList[i], deferred);

                            } else {

                                insertInstallBase(responseList[i], deferred);
                            }

                        }, function (tx, error) {

                            // console.log("INSTALLBASE SELECT ERROR: " + error.message);

                            deferred.reject(error);
                        });

                    }, function (error) {

                        // console.log("INSTALLBASE SELECT TRANSACTION ERROR: " + error.message);

                        deferred.reject(error);
                    });

                    // console.log("INSTALLBASE OBJECT =====> " + JSON.stringify(responseList[i]));

                    promises.push(deferred.promise);

                })(i);
            }

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS");
                },

                function (error) {
                    callback("ERROR");
                }
            );
        };

        function updateInstallBase(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE InstallBase SET Product_Line = ?, Serial_Number = ?, TagNumber = ?, Original_PO_Number =?, Service_Request = ?, Assigned = ?, Start_Date = ?, End_Date = ?, ResourceId = ?, Item_Number=?, Description=?  WHERE Installed_Base_ID = ? AND Task_Number = ?";

                insertValues.push(responseList.Product_Line);
                insertValues.push(responseList.Serial_Number);
                insertValues.push(responseList.TagNumber);
                insertValues.push(responseList.Original_PO_Number);
                insertValues.push(responseList.Service_Request);
                insertValues.push(responseList.Assigned);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.End_Date);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.Item_Number);
                insertValues.push(responseList.Description);
                insertValues.push(responseList.Installed_Base_ID);
                insertValues.push(responseList.Task_Number);

                // console.log("INSTALLBASE UPDATE VALUES =====> " + insertValues);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("INSTALLBASE ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("INSTALLBASE UPDATE ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("INSTALLBASE UPDATE TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertInstallBase(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO InstallBase VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)";

                insertValues.push(responseList.Installed_Base_ID);
                insertValues.push(responseList.Product_Line);
                insertValues.push(responseList.Serial_Number);
                insertValues.push(responseList.TagNumber);
                insertValues.push(responseList.Original_PO_Number);
                insertValues.push(responseList.Task_Number);
                insertValues.push(responseList.Service_Request);
                insertValues.push(responseList.Assigned);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.End_Date);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.Item_Number);
                insertValues.push(responseList.Description);

                // console.log("INSTALLBASE INSERT VALUES =====> " + insertValues);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("INSTALLBASE INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    // console.log("INSTALLBASE INSERT ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("INSTALLBASE INSERT TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertContactList(response, callback) {

            var responseList = response;

            var promises = [];

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {


                    var deferred = $q.defer();

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM Contact WHERE Contact_ID = " + responseList[i].Contact_ID + " AND Task_Number = " + responseList[i].Task_Number;

                        // console.log("CONTACT  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            // console.log("CONTACT LENGTH ====> " + rowLength);


                            if (rowLength > 0) {

                                updateContact(responseList[i], deferred);

                            } else {

                                insertContact(responseList[i], deferred);
                            }


                        }, function (tx, error) {

                            // console.log("CONTACT SELECT ERROR: " + error.message);

                            deferred.reject(error);
                        });

                    }, function (error) {

                        // console.log("CONTACT SELECT TRANSACTION ERROR: " + error.message);

                        deferred.reject(error);
                    });

                    // console.log("CONTACT OBJECT =====> " + JSON.stringify(responseList[i]));

                    promises.push(deferred.promise);

                })(i);
            }

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS");
                },

                function (error) {
                    callback("ERROR");
                }
            );
        };

        function updateContact(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Contact SET Customer_Name = ?, Contact_Name = ?, Home_Phone = ?, Mobile_Phone = ?, Fax_Phone = ?, Office_Phone = ?, Email = ?, Foreign_Key = ?, Service_Request = ?, Assigned = ?, Start_Date = ?, End_Date = ?, Default_value = ?, Contacts_Preferences = ?, ResourceId = ?  WHERE Contact_ID = ? AND Task_Number = ?";

                insertValues.push(responseList.Customer_Name);
                insertValues.push(responseList.Contact_Name);
                insertValues.push(responseList.Home_Phone);
                insertValues.push(responseList.Mobile_Phone);
                insertValues.push(responseList.Fax_Phone);
                insertValues.push(responseList.Office_Phone);
                insertValues.push(responseList.Email);
                insertValues.push(responseList.Foreign_Key);
                insertValues.push(responseList.Service_Request);
                insertValues.push(responseList.Assigned);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.End_Date);
                insertValues.push(responseList.Default_value);
                insertValues.push(responseList.Contact_Preference);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.Contact_ID);
                insertValues.push(responseList.Task_Number);

                // console.log("CONTACT UPDATE VALUES =====> " + insertValues);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("CONTACT ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("CONTACT UPDATE ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("CONTACT UPDATE TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertContact(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Contact VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.Contact_ID);
                insertValues.push(responseList.Customer_Name);
                insertValues.push(responseList.Contact_Name);
                insertValues.push(responseList.Home_Phone);
                insertValues.push(responseList.Mobile_Phone);
                insertValues.push(responseList.Fax_Phone);
                insertValues.push(responseList.Office_Phone);
                insertValues.push(responseList.Email);
                insertValues.push(responseList.Foreign_Key);
                insertValues.push(responseList.Task_Number);
                insertValues.push(responseList.Service_Request);
                insertValues.push(responseList.Assigned);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.End_Date);
                insertValues.push(responseList.Default_value);
                insertValues.push(responseList.Contact_Preference);
                insertValues.push(constantService.getResourceId());

                // console.log("CONTACT INSERT VALUES =====> " + insertValues);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("CONTACT INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    // console.log("CONTACT INSERT ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("CONTACT INSERT TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertNoteList(response, callback) {

            var responseList = response;

            var promises = [];

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    var deferred = $q.defer();

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM Note WHERE Notes_ID = ? AND Service_Request = ?";

                        // console.log("NOTE  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [responseList[i].Notes_ID, responseList[i].Service_Request], function (tx, res) {

                            var rowLength = res.rows.length;

                            // console.log("NOTE LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateNote(responseList[i], deferred);

                            } else {

                                insertNote(responseList[i], deferred);
                            }

                        }, function (tx, error) {

                            // console.log("NOTE SELECT ERROR: " + error.message);

                            deferred.reject(error);
                        });

                    }, function (error) {

                        // console.log("NOTE SELECT TRANSACTION ERROR: " + error.message);

                        deferred.reject(error);
                    });

                    // console.log("NOTE OBJECT =====> " + JSON.stringify(responseList[i]));

                    promises.push(deferred.promise);

                })(i);
            }

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS");
                },

                function (error) {
                    callback("ERROR");
                }
            );
        };

        function updateNote(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Note SET Notes = ?, Notes_type = ?, Note_Description = ?, Created_By = ?, MobileCreatedBy = ?, Task_Number = ?, Assigned = ?, Start_Date = ?, End_Date = ?, Last_updated_date = ?, Incident = ?, ResourceId = ?  WHERE Notes_ID = ? AND Service_Request =?";

                insertValues.push(responseList.Notes);
                insertValues.push(responseList.Notes_type);
                insertValues.push(responseList.Note_Description);
                insertValues.push(responseList.Created_By);
                insertValues.push(responseList.MobileCreatedBy);
                insertValues.push(responseList.Task_Number);
                insertValues.push(responseList.Assigned);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.End_Date);
                insertValues.push(responseList.Last_updated_date);
                insertValues.push(responseList.Incident);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.Notes_ID);
                insertValues.push(responseList.Service_Request);


                // console.log("NOTE UPDATE VALUES =====> " + insertValues);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("NOTE ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("NOTE UPDATE ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("NOTE UPDATE TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertNote(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Note VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.Notes_ID);
                insertValues.push(responseList.Notes);
                insertValues.push(responseList.Notes_type);
                insertValues.push(responseList.Note_Description);
                insertValues.push(responseList.Created_By);
                insertValues.push(responseList.MobileCreatedBy);
                insertValues.push(responseList.Task_Number);
                insertValues.push(responseList.Service_Request);
                insertValues.push(responseList.Assigned);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.End_Date);
                insertValues.push(responseList.Last_updated_date);
                insertValues.push(responseList.Incident);
                insertValues.push(constantService.getResourceId());

                // console.log("NOTE INSERT VALUES =====> " + insertValues);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("Note INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    // console.log("NOTE INSERT ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("NOTE INSERT TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertAttachmentList(response, callback) {

            var responseList = response;

            var promises = [];

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    var deferred = $q.defer();

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM Attachment WHERE Attachment_Id = " + responseList[i].Attachment_Id;

                        // console.log("ATTACHMENT  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            // console.log("ATTACHMENT LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateAttachment(responseList[i], deferred);

                            } else {

                                insertAttachment(responseList[i], deferred);
                            }

                        }, function (tx, error) {

                            // console.log("ATTACHMENT SELECT ERROR: " + error.message);

                            deferred.reject(error);
                        });

                    }, function (error) {

                        // console.log("ATTACHMENT SELECT TRANSACTION ERROR: " + error.message);

                        deferred.reject(error);
                    });

                    // console.log("ATTACHMENT OBJECT =====> " + JSON.stringify(responseList[i]));

                    promises.push(deferred.promise);

                })(i);
            }

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS");
                },

                function (error) {
                    callback("ERROR");
                }
            );
        };

        function updateAttachment(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Attachment SET File_Name = ?, File_Type = ?, File_Path = ?, Type = ?, AttachmentType = ?,Created_Date = ?, Task_Number = ?, SRID = ?, ResourceId = ? WHERE Attachment_Id = ?";

                insertValues.push(responseList.File_Name);
                insertValues.push(responseList.File_Type);
                insertValues.push(responseList.File_Path);
                insertValues.push(responseList.Type);
                insertValues.push(responseList.AttachmentType);
                insertValues.push(responseList.Created_Date);
                insertValues.push(responseList.Task_Number);
                insertValues.push(responseList.SRID);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.Attachment_Id);


                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("ATTACHMENT ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("ATTACHMENT UPDATE ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("ATTACHMENT UPDATE TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertAttachment(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Attachment VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.Attachment_Id);
                insertValues.push(responseList.File_Name);
                insertValues.push(responseList.File_Type);
                insertValues.push(responseList.File_Path);
                insertValues.push(responseList.Type);
                insertValues.push(responseList.AttachmentType);
                insertValues.push(responseList.Created_Date);
                insertValues.push(responseList.Task_Number);
                insertValues.push(responseList.SRID);
                insertValues.push("0");
                insertValues.push(constantService.getResourceId());

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("ATTACHMENT INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    // console.log("ATTACHMENT INSERT ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("ATTACHMENT INSERT TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertOverTimeList(response, callback) {

            var responseList = response;

            var promises = [];

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    var deferred = $q.defer();

                    db.transaction(function (transaction) {

                        var insertValues = [];

                        var sqlSelect = "SELECT * FROM OverTime WHERE OverTime_Shift_Code_ID = ? AND Project_Number = ?";

                        // console.log("OVERTIME  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [responseList[i].OverTime_Shift_Code_ID, responseList[i].Project_Number], function (tx, res) {

                            var rowLength = res.rows.length;

                            // console.log("OVERTIME LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateOverTime(responseList[i], deferred);

                            } else {

                                insertOverTime(responseList[i], deferred);
                            }

                        }, function (tx, error) {

                            // console.log("OVERTIME SELECT ERROR: " + error.message);

                            deferred.reject(error);
                        });

                    }, function (error) {

                        // console.log("OVERTIME SELECT TRANSACTION ERROR: " + error.message);

                        deferred.reject(error);
                    });

                    // console.log("OVERTIME OBJECT =====> " + JSON.stringify(responseList[i]));

                    promises.push(deferred.promise);

                })(i);
            }

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS");
                },

                function (error) {
                    callback("ERROR");
                }
            );
        };

        function updateOverTime(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE OverTime SET Overtimeshiftcode = ?, Technician_ID = ?, Field_Job_ID = ?, Project = ?, Start_Date = ?, Date_Completed = ?, ResourceId = ?  WHERE OverTime_Shift_Code_ID = ? AND Project_Number = ?";

                insertValues.push(responseList.Overtimeshiftcode);
                insertValues.push(responseList.Technician_ID);
                insertValues.push(responseList.Field_Job_ID);
                insertValues.push(responseList.Project);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.Date_Completed);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.OverTime_Shift_Code_ID);
                insertValues.push(responseList.Project_Number);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("OVERTIME ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("OVERTIME UPDATE ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("OVERTIME UPDATE TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertOverTime(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO OverTime VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.OverTime_Shift_Code_ID);
                insertValues.push(responseList.Overtimeshiftcode);
                insertValues.push(responseList.Project_Number);
                insertValues.push(responseList.Technician_ID);
                insertValues.push(responseList.Field_Job_ID);
                insertValues.push(responseList.Project);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.Date_Completed);
                insertValues.push(constantService.getResourceId());

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("OVERTIME INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    // console.log("OVERTIME INSERT ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("OVERTIME INSERT TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertShiftCodeList(response, callback) {

            var responseList = response;

            var promises = [];

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    var deferred = $q.defer();

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM ShiftCode WHERE Shift_Code_ID = ? AND Project_Number = ?";

                        // console.log("SHIFTCODE  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [responseList[i].Shift_Code_ID, responseList[i].Project_Number], function (tx, res) {

                            var rowLength = res.rows.length;

                            // console.log("SHIFTCODE LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateShiftCode(responseList[i], deferred);

                            } else {

                                insertShiftCode(responseList[i], deferred);
                            }

                        }, function (tx, error) {

                            // console.log("SHIFTCODE SELECT ERROR: " + error.message);

                            deferred.reject(error);
                        });

                    }, function (error) {

                        // console.log("SHIFTCODE SELECT TRANSACTION ERROR: " + error.message);

                        deferred.reject(error);
                    });

                    // console.log("SHIFTCODE OBJECT =====> " + JSON.stringify(responseList[i]));

                    promises.push(deferred.promise);

                })(i);
            }

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS");
                },

                function (error) {
                    callback("ERROR");
                }
            );
        };

        function updateShiftCode(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE ShiftCode SET ShiftCodeName = ?, Technician_ID = ?, Field_Job_ID = ?, Start_Date = ?, Date_Completed = ?, Project = ?, ResourceId = ?  WHERE Shift_Code_ID = ? AND Project_Number = ?";

                insertValues.push(responseList.ShiftCodeName);
                insertValues.push(responseList.Technician_ID);
                insertValues.push(responseList.Field_Job_ID);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.Date_Completed);
                insertValues.push(responseList.Project);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.Shift_Code_ID);
                insertValues.push(responseList.Project_Number);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("SHIFTCODE ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("SHIFTCODE UPDATE ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("SHIFTCODE UPDATE TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertShiftCode(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO ShiftCode VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.Shift_Code_ID);
                insertValues.push(responseList.ShiftCodeName);
                insertValues.push(responseList.Project_Number);
                insertValues.push(responseList.Technician_ID);
                insertValues.push(responseList.Field_Job_ID);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.Date_Completed);
                insertValues.push(responseList.Project);
                insertValues.push(constantService.getResourceId());

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("SHIFTCODE INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    // console.log("SHIFTCODE INSERT ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("SHIFTCODE INSERT TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertFieldJobNameList(response, callback) {

            var responseList = response;

            var promises = [];

            angular.forEach(responseList, function (item) {

                var deferred = $q.defer();

                db.transaction(function (transaction) {

                    var sqlSelect = "SELECT * FROM FieldJobName WHERE TaskCode = ? AND Project_Number = ?";

                    transaction.executeSql(sqlSelect, [item.TaskCode, item.Project_Number], function (tx, res) {

                        var rowLength = res.rows.length;

                        // console.log("FIELDJOBNAME LENGTH ====> " + rowLength);

                        if (rowLength > 0) {

                            updateFieldJobName(item, deferred);

                        } else {

                            insertFieldJobName(item, deferred);
                        }

                    }, function (tx, error) {

                        // console.log("FIELDJOBNAME SELECT ERROR: " + error.message);

                        deferred.resolve(error);
                    });

                }, function (error) {

                    // console.log("FIELDJOBNAME SELECT TRANSACTION ERROR: " + error.message);

                    deferred.resolve(error);
                });

                // console.log("FIELDJOBNAME OBJECT =====> " + JSON.stringify(item));

                promises.push(deferred.promise);

            });

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS");
                },

                function (error) {
                    callback("ERROR");
                }
            );
        };

        function updateFieldJobName(responseList, defer, i) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE FieldJobName SET JobName = ?, Technician_ID = ?, Project = ?, Start_Date = ?, Date_Completed = ?, ResourceId = ?  WHERE TaskCode = ? AND Project_Number = ?";

                insertValues.push(responseList.JobName);
                insertValues.push(responseList.Technician_ID);
                insertValues.push(responseList.Project);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.Date_Completed);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.TaskCode);
                insertValues.push(responseList.Project_Number);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("FIELDJOBNAME ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("FIELDJOBNAME UPDATE ERROR: " + error.message);

                    defer.resolve(error);
                });

            }, function (error) {

                // console.log("FIELDJOBNAME UPDATE TRANSACTION ERROR: " + error.message);

                defer.resolve(error);
            });
        };

        function insertFieldJobName(responseList, defer, i) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO FieldJobName VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.TaskCode);
                insertValues.push(responseList.JobName);
                insertValues.push(responseList.Project_Number);
                insertValues.push(responseList.Technician_ID);
                insertValues.push(responseList.Project);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.Date_Completed);
                insertValues.push(constantService.getResourceId());

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("FIELDJOBNAME INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    // console.log("FIELDJOBNAME INSERT ERROR: " + error.message);

                    defer.resolve(error);
                });

            }, function (error) {

                // console.log("FIELDJOBNAME INSERT TRANSACTION ERROR: " + error.message);

                defer.resolve(error);
            });
        };

        function insertChargeMethodList(response, callback) {

            var responseList = response;

            var promises = [];

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    var deferred = $q.defer();

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM ChargeMethod WHERE ID = " + responseList[i].ID;

                        // console.log("CHARGEMETHOD  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            // console.log("CHARGEMETHOD LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateChargeMethod(responseList[i], deferred);

                            } else {

                                insertChargeMethod(responseList[i], deferred);
                            }

                        }, function (tx, error) {

                            // console.log("CHARGEMETHOD SELECT ERROR: " + error.message);

                            deferred.reject(error);
                        });

                    }, function (error) {

                        // console.log("CHARGEMETHOD SELECT TRANSACTION ERROR: " + error.message);

                        deferred.reject(error);
                    });

                    // console.log("CHARGEMETHOD OBJECT =====> " + JSON.stringify(responseList[i]));

                    promises.push(deferred.promise);

                })(i);
            }

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS");
                },

                function (error) {
                    callback("ERROR");
                }
            );
        };

        function updateChargeMethod(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE ChargeMethod SET Value = ?, ResourceId = ?  WHERE ID = ?";

                insertValues.push(responseList.Value);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("CHARGEMETHOD ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("CHARGEMETHOD UPDATE ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("CHARGEMETHOD UPDATE TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertChargeMethod(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO ChargeMethod VALUES (?, ?, ?)";

                insertValues.push(responseList.ID);
                insertValues.push(responseList.Value);
                insertValues.push(constantService.getResourceId());

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("CHARGEMETHOD INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    // console.log("CHARGEMETHOD INSERT ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("CHARGEMETHOD INSERT TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertChargeTypeList(response, callback) {

            var responseList = response;

            var promises = [];

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    var deferred = $q.defer();

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM ChargeType WHERE ID = " + responseList[i].ID;

                        // console.log("CHARGETYPE  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            // console.log("CHARGETYPE LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateChargeType(responseList[i], deferred);

                            } else {

                                insertChargeType(responseList[i], deferred);
                            }

                        }, function (tx, error) {

                            // console.log("CHARGETYPE SELECT ERROR: " + error.message);

                            deferred.reject(error);
                        });

                    }, function (error) {

                        // console.log("CHARGETYPE SELECT TRANSACTION ERROR: " + error.message);

                        deferred.reject(error);
                    });

                    // console.log("CHARGETYPE OBJECT =====> " + JSON.stringify(responseList[i]));

                    promises.push(deferred.promise);

                })(i);
            }

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS");
                },

                function (error) {
                    callback("ERROR");
                }
            );
        };

        function updateChargeType(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE ChargeType SET Value = ?, ResourceId = ?  WHERE ID = ?";

                insertValues.push(responseList.Value);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("CHARGETYPE ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("CHARGETYPE UPDATE ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("CHARGETYPE UPDATE TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertChargeType(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO ChargeType VALUES (?, ?, ?)";

                insertValues.push(responseList.ID);
                insertValues.push(responseList.Value);
                insertValues.push(constantService.getResourceId());

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("CHARGETYPE INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    // console.log("CHARGETYPE INSERT ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("CHARGETYPE INSERT TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertExpenseTypeList(response, callback) {

            var responseList = response;

            var promises = [];

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    var deferred = $q.defer();

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM ExpenseType WHERE ID = " + responseList[i].ID;

                        // console.log("EXPENSETYPE  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            // console.log("EXPENSETYPE LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateExpenseType(responseList[i], deferred);

                            } else {

                                insertExpenseType(responseList[i], deferred);
                            }

                        }, function (tx, error) {

                            // console.log("EXPENSETYPE SELECT ERROR: " + error.message);

                            deferred.reject(error);
                        });

                    }, function (error) {

                        // console.log("EXPENSETYPE SELECT TRANSACTION ERROR: " + error.message);

                        deferred.reject(error);
                    });

                    // console.log("EXPENSETYPE OBJECT =====> " + JSON.stringify(responseList[i]));

                    promises.push(deferred.promise);

                })(i);
            }

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS");
                },

                function (error) {
                    callback("ERROR");
                }
            );
        };

        function updateExpenseType(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE ExpenseType SET Value = ?, ResourceId = ?  WHERE ID = ?";

                insertValues.push(responseList.Value);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("EXPENSETYPE ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("EXPENSETYPE UPDATE ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("EXPENSETYPE UPDATE TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertExpenseType(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO ExpenseType VALUES (?, ?, ?)";

                insertValues.push(responseList.ID);
                insertValues.push(responseList.Value);
                insertValues.push(constantService.getResourceId());

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("EXPENSETYPE INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    // console.log("EXPENSETYPE INSERT ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("EXPENSETYPE INSERT TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertNoteTypeList(response, callback) {

            var responseList = response;

            var promises = [];

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    var deferred = $q.defer();

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM NoteType WHERE ID = " + responseList[i].ID;

                        // console.log("NOTETYPE  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            // console.log("NOTETYPE LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateNoteType(responseList[i], deferred);

                            } else {

                                insertNoteType(responseList[i], deferred);
                            }

                        }, function (tx, error) {

                            // console.log("NOTETYPE SELECT ERROR: " + error.message);

                            deferred.reject(error);
                        });

                    }, function (error) {

                        // console.log("NOTETYPE SELECT TRANSACTION ERROR: " + error.message);

                        deferred.reject(error);
                    });

                    // console.log("NOTETYPE OBJECT =====> " + JSON.stringify(responseList[i]));

                    promises.push(deferred.promise);

                })(i);
            }

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS");
                },

                function (error) {
                    callback("ERROR");
                }
            );
        };

        function updateNoteType(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE NoteType SET Value = ?, ResourceId = ?  WHERE ID = ?";

                insertValues.push(responseList.Value);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("NOTETYPE ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("NOTETYPE UPDATE ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("NOTETYPE UPDATE TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertNoteType(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO NoteType VALUES (?, ?, ?)";

                insertValues.push(responseList.ID);
                insertValues.push(responseList.Value);
                insertValues.push(constantService.getResourceId());

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("NOTETYPE INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    // console.log("NOTETYPE INSERT ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("NOTETYPE INSERT TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertWorkTypeList(response, callback) {

            var responseList = response;

            var promises = [];

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    var deferred = $q.defer();

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM WorkType WHERE ID = " + responseList[i].ID;

                        // console.log("WORKTYPE  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            // console.log("WORKTYPE LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateWorkType(responseList[i], deferred);

                            } else {

                                insertWorkType(responseList[i], deferred);
                            }

                        }, function (tx, error) {

                            // console.log("WORKTYPE SELECT ERROR: " + error.message);

                            deferred.reject(error);
                        });

                    }, function (error) {

                        // console.log("WORKTYPE SELECT TRANSACTION ERROR: " + error.message);

                        deferred.reject(error);
                    });

                    // console.log("WORKTYPE OBJECT =====> " + JSON.stringify(responseList[i]));

                    promises.push(deferred.promise);

                })(i);
            }

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS");
                },

                function (error) {
                    callback("ERROR");
                }
            );
        };

        function updateWorkType(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE WorkType SET Value = ?, ResourceId = ? WHERE ID = ?";

                insertValues.push(responseList.Value);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("WORKTYPE ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("WORKTYPE UPDATE ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("WORKTYPE UPDATE TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertWorkType(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO WorkType VALUES (?, ?, ?)";

                insertValues.push(responseList.ID);
                insertValues.push(responseList.Value);
                insertValues.push(constantService.getResourceId());

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("WORKTYPE INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    // console.log("WORKTYPE INSERT ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("WORKTYPE INSERT TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertItemList(response, callback) {

            var responseList = response;

            var promises = [];

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    var deferred = $q.defer();

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM Item WHERE ID = " + responseList[i].ID;

                        // console.log("ITEM  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            // console.log("ITEM LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateItem(responseList[i], deferred);

                            } else {

                                insertItem(responseList[i], deferred);
                            }

                        }, function (tx, error) {

                            // console.log("ITEM SELECT ERROR: " + error.message);

                            deferred.reject(error);
                        });

                    }, function (error) {

                        // console.log("ITEM SELECT TRANSACTION ERROR: " + error.message);

                        deferred.reject(error);
                    });

                    // console.log("ITEM OBJECT =====> " + JSON.stringify(responseList[i]));

                    promises.push(deferred.promise);

                })(i);
            }

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS");
                },

                function (error) {
                    callback("ERROR");
                }
            );
        };

        function updateItem(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Item SET Value = ?, Type = ?, ResourceId = ?  WHERE ID = ?";

                insertValues.push(responseList.Value);
                insertValues.push(responseList.Type);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("ITEM ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("ITEM UPDATE ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("ITEM UPDATE TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertItem(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Item VALUES (?, ?, ?, ?)";

                insertValues.push(responseList.ID);
                insertValues.push(responseList.Value);
                insertValues.push(responseList.Type);
                insertValues.push(constantService.getResourceId());

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("ITEM INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    // console.log("ITEM INSERT ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("ITEM INSERT TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertCurrencyList(response, callback) {

            var responseList = response;

            var promises = [];

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    var deferred = $q.defer();

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM Currency WHERE ID = " + responseList[i].ID;

                        // console.log("CURRENCY  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            // console.log("CURRENCY LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateCurrency(responseList[i], deferred);

                            } else {

                                insertCurrency(responseList[i], deferred);
                            }

                        }, function (tx, error) {

                            // console.log("CURRENCY SELECT ERROR: " + error.message);

                            deferred.reject(error);
                        });

                    }, function (error) {

                        // console.log("CURRENCY SELECT TRANSACTION ERROR: " + error.message);

                        deferred.reject(error);
                    });

                    // console.log("CURRENCY OBJECT =====> " + JSON.stringify(responseList[i]));

                    promises.push(deferred.promise);

                })(i);
            }

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS");
                },

                function (error) {
                    callback("ERROR");
                }
            );
        };

        function updateCurrency(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Currency SET Value = ?, ResourceId = ?  WHERE ID = ?";

                insertValues.push(responseList.Value);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("CURRENCY ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("CURRENCY UPDATE ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("CURRENCY UPDATE TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertCurrency(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Currency VALUES (?, ?, ?)";

                insertValues.push(responseList.ID);
                insertValues.push(responseList.Value);
                insertValues.push(constantService.getResourceId());

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("CURRENCY INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    // console.log("CURRENCY INSERT ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("CURRENCY INSERT TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertUOMList(response, callback) {

            var responseList = response;

            var promises = [];

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    var deferred = $q.defer();

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM UOM WHERE ID = " + responseList[i].ID;

                        // console.log("UOM  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            // console.log("UOM LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateUOM(responseList[i], deferred);

                            } else {

                                insertUOM(responseList[i], deferred);
                            }

                        }, function (tx, error) {

                            // console.log("UOM SELECT ERROR: " + error.message);

                            deferred.reject(error);
                        });

                    }, function (error) {

                        // console.log("UOM SELECT TRANSACTION ERROR: " + error.message);

                        deferred.reject(error);
                    });

                    // console.log("UOM OBJECT =====> " + JSON.stringify(responseList[i]));

                    promises.push(deferred.promise);

                })(i);
            }

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS");
                },

                function (error) {
                    callback("ERROR");
                }
            );
        };

        function updateUOM(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE UOM SET Value = ?, ResourceId = ?  WHERE ID = ?";

                insertValues.push(responseList.Value);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("UOM ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("UOM UPDATE ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("UOM UPDATE TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertUOM(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO UOM VALUES (?, ?, ?)";

                insertValues.push(responseList.ID);
                insertValues.push(responseList.Value);
                insertValues.push(constantService.getResourceId());

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("UOM INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    // console.log("UOM INSERT ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("UOM INSERT TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertTimeList(response, callback) {

            var responseList = response;

            var promises = [];

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    var deferred = $q.defer();

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM Time WHERE Time_Id = " + responseList[i].Time_Id;

                        // console.log("TIME  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            // console.log("TIME LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateTime(responseList[i], deferred);

                            } else {

                                insertTime(responseList[i], deferred);
                            }

                        }, function (tx, error) {

                            // console.log("TIME SELECT ERROR: " + error.message);

                            deferred.reject(error);
                        });

                    }, function (error) {

                        // console.log("TIME SELECT TRANSACTION ERROR: " + error.message);

                        deferred.reject(error);
                    });

                    // console.log("TIME OBJECT =====> " + JSON.stringify(responseList[i]));

                    promises.push(deferred.promise);

                })(i);
            }

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS");
                },

                function (error) {
                    callback("ERROR");
                }
            );
        };

        function updateTime(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Time SET timeDefault = ?, Field_Job_Name = ?, Field_Job_Name_Id = ?, Charge_Type = ?, Charge_Type_Id = ?, Charge_Method = ?, Charge_Method_Id = ?, Work_Type = ?, Work_Type_Id = ?, Item = ?, Item_Id = ?, Description = ?, Time_Code = ?, Time_Code_Id = ?, Time_Code_Value=?,Shift_Code = ?, Shift_Code_Id = ?,Shift_Code_Value=?, Date = ?, Duration = ?, Comments = ?, ResourceId = ?  WHERE Time_Id = ? AND Task_Number = ?";

                insertValues.push(responseList.timeDefault);
                insertValues.push(responseList.Field_Job_Name);
                insertValues.push(responseList.Field_Job_Name_Id);
                insertValues.push(responseList.Charge_Type);
                insertValues.push(responseList.Charge_Type_Id);
                insertValues.push(responseList.Charge_Method);
                insertValues.push(responseList.Charge_Method_Id);
                insertValues.push(responseList.Work_Type);
                insertValues.push(responseList.Work_Type_Id);
                insertValues.push(responseList.Item);
                insertValues.push(responseList.Item_Id);
                insertValues.push(responseList.Description);
                insertValues.push(responseList.Time_Code);
                insertValues.push(responseList.Time_Code_Id);
                insertValues.push(responseList.Time_Code_Value);
                insertValues.push(responseList.Shift_Code);
                insertValues.push(responseList.Shift_Code_Id);
                insertValues.push(responseList.Shift_Code_Value);
                insertValues.push(responseList.Date);
                insertValues.push(responseList.Duration);
                insertValues.push(responseList.Comments);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.Time_Id);
                insertValues.push(responseList.Task_Number);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("TIME ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("TIME UPDATE ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("TIME UPDATE TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertTime(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Time VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)";

                insertValues.push(responseList.Time_Id);
                insertValues.push(responseList.timeDefault);
                insertValues.push(responseList.Field_Job_Name);
                insertValues.push(responseList.Field_Job_Name_Id);
                insertValues.push(responseList.Charge_Type);
                insertValues.push(responseList.Charge_Type_Id);
                insertValues.push(responseList.Charge_Method);
                insertValues.push(responseList.Charge_Method_Id);
                insertValues.push(responseList.Work_Type);
                insertValues.push(responseList.Work_Type_Id);
                insertValues.push(responseList.Item);
                insertValues.push(responseList.Item_Id);
                insertValues.push(responseList.Description);
                insertValues.push(responseList.Time_Code);
                insertValues.push(responseList.Time_Code_Id);
                insertValues.push(responseList.Time_Code_Value);
                insertValues.push(responseList.Shift_Code);
                insertValues.push(responseList.Shift_Code_Id);
                insertValues.push(responseList.Shift_Code_Value);
                insertValues.push(responseList.Date);
                insertValues.push(responseList.Duration);
                insertValues.push(responseList.Comments);
                insertValues.push(responseList.Task_Number);
                insertValues.push(constantService.getResourceId());

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("TIME INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    // console.log("TIME INSERT ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("TIME INSERT TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertExpenseList(response, callback) {

            var responseList = response;

            var promises = [];

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    var deferred = $q.defer();

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM Expense WHERE Expense_Id = " + responseList[i].Expense_Id;

                        // console.log("EXPENSE  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            // console.log("EXPENSE LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateExpense(responseList[i], deferred);

                            } else {

                                insertExpense(responseList[i], deferred);
                            }

                        }, function (tx, error) {

                            // console.log("EXPENSE SELECT ERROR: " + error.message);

                            deferred.reject(error);
                        });

                    }, function (error) {

                        // console.log("EXPENSE SELECT TRANSACTION ERROR: " + error.message);

                        deferred.reject(error);
                    });

                    // console.log("EXPENSE OBJECT =====> " + JSON.stringify(responseList[i]));

                    promises.push(deferred.promise);

                })(i);
            }

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS");
                },

                function (error) {
                    callback("ERROR");
                }
            );
        };

        function updateExpense(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Expense SET expenseDefault = ?, Date = ?, Expense_Type = ?, Expense_Type_Id = ?, Amount = ?, Currency = ?, Currency_Id = ?, Distance = ?, UOM = ?, UOM_Id = ?, Charge_Method = ?, Charge_Method_Id = ?, Justification = ?, ResourceId = ? WHERE Expense_Id = ? AND Task_Number = ?";

                insertValues.push(responseList.expenseDefault);
                insertValues.push(responseList.Date);
                insertValues.push(responseList.Expense_Type);
                insertValues.push(responseList.Expense_Type_Id);
                insertValues.push(responseList.Amount);
                insertValues.push(responseList.Currency);
                insertValues.push(responseList.Currency_Id);
                insertValues.push(responseList.Distance);
                insertValues.push(responseList.UOM);
                insertValues.push(responseList.UOM_Id);
                insertValues.push(responseList.Charge_Method);
                insertValues.push(responseList.Charge_Method_Id);
                insertValues.push(responseList.Justification);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.Expense_Id);
                insertValues.push(responseList.Task_Number);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("EXPENSE ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("EXPENSE UPDATE ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("EXPENSE UPDATE TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertExpense(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Expense VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.Expense_Id);
                insertValues.push(responseList.expenseDefault);
                insertValues.push(responseList.Date);
                insertValues.push(responseList.Expense_Type);
                insertValues.push(responseList.Expense_Type_Id);
                insertValues.push(responseList.Amount);
                insertValues.push(responseList.Currency);
                insertValues.push(responseList.Currency_Id);
                insertValues.push(responseList.Distance);
                insertValues.push(responseList.UOM);
                insertValues.push(responseList.UOM_Id);
                insertValues.push(responseList.Charge_Method);
                insertValues.push(responseList.Charge_Method_Id);
                insertValues.push(responseList.Justification);
                insertValues.push(responseList.Task_Number);
                insertValues.push(constantService.getResourceId());

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("EXPENSE INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    // console.log("EXPENSE INSERT ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("EXPENSE INSERT TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertMaterialList(response, callback) {

            var responseList = response;

            var promises = [];

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    var deferred = $q.defer();

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM Material WHERE Material_Id = " + responseList[i].Material_Id;

                        // console.log("MATERIAL  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            // console.log("MATERIAL LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateMaterial(responseList[i], deferred);

                            } else {

                                insertMaterial(responseList[i], deferred);
                            }

                        }, function (tx, error) {

                            // console.log("MATERIAL SELECT ERROR: " + error.message);

                            deferred.reject(error);
                        });

                    }, function (error) {

                        // console.log("MATERIAL SELECT TRANSACTION ERROR: " + error.message);

                        deferred.reject(error);
                    });

                    // console.log("MATERIAL OBJECT =====> " + JSON.stringify(responseList[i]));

                    promises.push(deferred.promise);

                })(i);
            }

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS");
                },

                function (error) {
                    callback("ERROR");
                }
            );
        };

        function updateMaterial(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Material SET materialDefault = ?, Charge_Type = ?, Charge_Type_Id = ?, Description = ?, ItemName = ?, Product_Quantity = ?, Serial_Number = ?, Serial_In = ?, Serial_Out = ?, ResourceId = ? WHERE Material_Id = ? AND Task_Number = ?";

                insertValues.push(responseList.materialDefault);
                insertValues.push(responseList.Charge_Type);
                insertValues.push(responseList.Charge_Type_Id);
                insertValues.push(responseList.Description);
                insertValues.push(responseList.ItemName);
                insertValues.push(responseList.Product_Quantity);
                insertValues.push(responseList.Serial_Number);
                insertValues.push(responseList.Serial_In);
                insertValues.push(responseList.Serial_Out);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.Material_Id);
                insertValues.push(responseList.Task_Number);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("MATERIAL ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("MATERIAL UPDATE ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("MATERIAL UPDATE TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertMaterial(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Material VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.Material_Id);
                insertValues.push(responseList.materialDefault);
                insertValues.push(responseList.Charge_Type);
                insertValues.push(responseList.Charge_Type_Id);
                insertValues.push(responseList.Description);
                insertValues.push(responseList.ItemName);
                insertValues.push(responseList.Product_Quantity);
                insertValues.push(responseList.Serial_Number);
                insertValues.push(responseList.Serial_In);
                insertValues.push(responseList.Serial_Out);
                insertValues.push(responseList.Task_Number);
                insertValues.push(constantService.getResourceId());

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("MATERIAL INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    // console.log("MATERIAL INSERT ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("MATERIAL INSERT TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertNotesList(response, callback) {

            var responseList = response;

            var promises = [];

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    var deferred = $q.defer();

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM Notes WHERE Notes_Id = " + responseList[i].Notes_Id;

                        // console.log("NOTES  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            // console.log("NOTES LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateNotes(responseList[i], deferred);

                            } else {

                                insertNotes(responseList[i], deferred);
                            }

                        }, function (tx, error) {

                            // console.log("NOTES SELECT ERROR: " + error.message);

                            deferred.reject(error);
                        });

                    }, function (error) {

                        // console.log("NOTES SELECT TRANSACTION ERROR: " + error.message);

                        deferred.reject(error);
                    });

                    // console.log("NOTES OBJECT =====> " + JSON.stringify(responseList[i]));

                    promises.push(deferred.promise);

                })(i);
            }

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS");
                },

                function (error) {
                    callback("ERROR");
                }
            );
        };

        function updateNotes(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Notes SET noteDefault = ?, Note_Type = ?, Note_Type_Id = ?, Date = ?, Created_By = ?, Notes = ?, ResourceId = ? WHERE Notes_Id = ? AND Task_Number = ?";

                insertValues.push(responseList.noteDefault);
                insertValues.push(responseList.Note_Type);
                insertValues.push(responseList.Note_Type_Id);
                insertValues.push(responseList.Date);
                insertValues.push(responseList.Created_By);
                insertValues.push(responseList.Notes);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.Notes_Id);
                insertValues.push(responseList.Task_Number);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("NOTES ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("NOTES UPDATE ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("NOTES UPDATE TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertNotes(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Notes VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.Notes_Id);
                insertValues.push(responseList.noteDefault);
                insertValues.push(responseList.Note_Type);
                insertValues.push(responseList.Note_Type_Id);
                insertValues.push(responseList.Date);
                insertValues.push(responseList.Created_By);
                insertValues.push(responseList.Notes);
                insertValues.push(responseList.Task_Number);
                insertValues.push(constantService.getResourceId());

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("NOTES INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    // console.log("NOTES INSERT ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("NOTES INSERT TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertEngineerList(response, callback) {

            var responseList = response;

            var promises = [];

            var deferred = $q.defer();

            db.transaction(function (transaction) {

                var sqlSelect = "SELECT * FROM Engineer WHERE Engineer_Id = " + responseList.Engineer_Id;

                // console.log("ENGINEER  ====> " + sqlSelect);

                transaction.executeSql(sqlSelect, [], function (tx, res) {

                    var rowLength = res.rows.length;

                    // console.log("ENGINEER LENGTH ====> " + rowLength);

                    if (rowLength > 0) {

                        updateEngineer(responseList, deferred);

                    } else {

                        insertEngineer(responseList, deferred);
                    }

                }, function (tx, error) {

                    // console.log("ENGINEER SELECT ERROR: " + error.message);

                    deferred.reject(error);
                });

            }, function (error) {

                // console.log("ENGINEER SELECT TRANSACTION ERROR: " + error.message);

                deferred.reject(error);
            });

            promises.push(deferred.promise);

            // console.log("ENGINEER OBJECT =====> " + JSON.stringify(responseList));

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS");
                },

                function (error) {
                    callback("ERROR");
                }
            );

        };

        function updateEngineer(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Engineer SET Follow_Up = ?, Spare_Quote= ?, Sales_Visit = ?, Sales_Head =?, Sign_File_Path =?, File_Name =?, Task_Number = ?, isCustomerSignChecked = ?, customerComments = ?, ResourceId = ?  WHERE Engineer_Id = ?";

                insertValues.push(responseList.Follow_Up);
                insertValues.push(responseList.Spare_Quote);
                insertValues.push(responseList.Sales_Visit);
                insertValues.push(responseList.Sales_Head);
                insertValues.push(responseList.Sign_File_Path);
                insertValues.push(responseList.File_Name);
                insertValues.push(responseList.Task_Number);
                insertValues.push(responseList.isCustomerSignChecked);
                insertValues.push(responseList.customerComments);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.Engineer_Id);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("ENGINEER ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("ENGINEER UPDATE ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("ENGINEER UPDATE TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertEngineer(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Engineer VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.Engineer_Id);
                insertValues.push(responseList.followUp);
                insertValues.push(responseList.salesQuote);
                insertValues.push(responseList.salesVisit);
                insertValues.push(responseList.salesLead);
                insertValues.push(responseList.Follow_Up);
                insertValues.push(responseList.Spare_Quote);
                insertValues.push(responseList.Sales_Visit);
                insertValues.push(responseList.Sales_Head);
                insertValues.push(responseList.Sign_File_Path);
                insertValues.push(responseList.File_Name);
                insertValues.push(responseList.Task_Number);
                insertValues.push(responseList.isCustomerSignChecked);
                insertValues.push(responseList.customerComments);
                insertValues.push(constantService.getResourceId());

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("ENGINEER INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    // console.log("ENGINEER INSERT ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("ENGINEER INSERT TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertToolList(response, callback) {

            var responseList = response;

            var promises = [];

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    var deferred = $q.defer();

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM Tool WHERE ID = " + responseList[i].ID;

                        // console.log("TOOL  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            // console.log("TOOL LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateTool(responseList[i], deferred);

                            } else {

                                insertTool(responseList[i], deferred);
                            }

                        }, function (tx, error) {

                            // console.log("TOOL SELECT ERROR: " + error.message);

                            deferred.reject(error);
                        });

                    }, function (error) {

                        // console.log("TOOL SELECT TRANSACTION ERROR: " + error.message);

                        deferred.reject(error);
                    });

                    // console.log("TOOL OBJECT =====> " + JSON.stringify(responseList[i]));

                    promises.push(deferred.promise);

                })(i);
            }

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS");
                },

                function (error) {
                    callback("ERROR");
                }
            );
        };

        function updateTool(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Tool SET Tool_Name = ?, Task_Number = ?, ResourceId = ? WHERE ID = ?";

                insertValues.push(responseList.Tool_Name);
                insertValues.push(responseList.Task_Number);
                insertValues.push(constantService.getResourceId());
                insertValues.push(responseList.ID);

                // console.log("TOOL UPDATE VALUES =====> " + insertValues);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("TOOL ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("TOOL UPDATE ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("TOOL UPDATE TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function insertTool(responseList, defer) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Tool VALUES (?, ?, ?, ?)";

                insertValues.push(responseList.ID);
                insertValues.push(responseList.Tool_Name);
                insertValues.push(responseList.Task_Number);
                insertValues.push(constantService.getResourceId());

                // console.log("TOOL INSERT VALUES =====> " + insertValues);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    defer.resolve(res);

                    // console.log("TOOL INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    // console.log("TOOL INSERT ERROR: " + error.message);

                    defer.reject(error);
                });

            }, function (error) {

                // console.log("TOOL INSERT TRANSACTION ERROR: " + error.message);

                defer.reject(error);
            });
        };

        function deleteTaskList() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM Task";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("TASK DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteInternalList() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM Internal";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("INTERNAL DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteInstallBaseList() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM InstallBase";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("INSTALLBASE DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteContactList() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM Contact";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("CONTACT DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteNoteList() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM Note";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("NOTE DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteAttachmentList() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM Attachment";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("ATTACHMENT DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteOverTimeList() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM OverTime";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("OVERTIME DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteShiftCodeList() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM ShiftCode";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("SHIFTCODE DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteFieldJobNameList() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM FieldJobName";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("FIELDJOBNAME DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteChargeMethodList() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM ChargeMethod";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("CHARGEMETHOD DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteChargeTypeList() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM ChargeType";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("CHARGETYPE DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteExpenseTypeList() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM ExpenseType";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("EXPENSETYPE DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteNoteTypeList() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM NoteType";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("NOTETYPE DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteWorkTypeList() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM WorkType";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("WORKTYPE DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteItemList() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM Item";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("ITEM DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteCurrencyList() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM Currency";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("CURRENCY DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteTimeList() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM Time";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("TIME DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteExpenseList() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM Expense";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("EXPENSE DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteMaterialList() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM Material";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("MATERIAL DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteNotesList() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM Notes";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("NOTES DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteEngineerList() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM Engineer";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("ENGINEER DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteToolList() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM Tool";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("TOOL DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteSRNotesList() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM SRNotes";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("SRNOTES DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteTime(taskId) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlDelete = "DELETE FROM Time WHERE Task_Number = " + taskId;

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("TIME DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteExpense(taskId) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlDelete = "DELETE FROM Expense WHERE Task_Number = " + taskId;

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("EXPENSE DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteMaterial(taskId) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlDelete = "DELETE FROM Material WHERE Task_Number = " + taskId;

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("MATERIAL DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteNotes(taskId) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlDelete = "DELETE FROM Notes WHERE Task_Number = " + taskId;

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("NOTES DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteAttachment(taskId) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlDelete = "DELETE FROM Attachment WHERE Task_Number = " + taskId;

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("ATTACHMENT DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteEngineer(taskId) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlDelete = "DELETE FROM Engineer WHERE Task_Number = " + taskId;

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("ENGINEER DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteTool(taskId) {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM Tool WHERE Task_Number = " + taskId;

                transaction.executeSql(sqlDelete);

            }, function (error) {

                // console.log("TOOL DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteTaskRecord(response, callback) {

            var responseList = response;

            var promises = [];

            angular.forEach(responseList, function (item) {

                var deferred = $q.defer();

                db.transaction(function (transaction) {

                    var sqlSelect = "SELECT * FROM Task WHERE Task_Number = " + item.Record_ID;

                    transaction.executeSql(sqlSelect, [], function (tx, res) {

                        var rowLength = res.rows.length;

                        // console.log("TASK ROW LENGTH " + rowLength);

                        if (rowLength > 0) {

                            db.transaction(function (transaction) {

                                var sqlDelete = "DELETE FROM Task WHERE Task_Number = " + item.Record_ID;

                                transaction.executeSql(sqlDelete, [], function (tx, res) {

                                    deferred.resolve(res);

                                }, function (error) {

                                    // console.log("TASK DELETE TRANSACTION ERROR: " + error.message);

                                    deferred.reject(error);
                                });

                            }, function (error) {

                                // console.log("TASK DELETE TRANSACTION ERROR: " + error.message);

                                deferred.reject(error);
                            });

                        } else {

                            deferred.resolve("success");
                        }

                    }, function (tx, error) {

                        // console.log("TASK SELECT ERROR: " + error.message);

                        deferred.reject(error);
                    });

                }, function (error) {

                    // console.log("TASK SELECT TRANSACTION ERROR: " + error.message);

                    deferred.reject(error);
                });

                // console.log("TASK OBJECT =====> " + JSON.stringify(item));

                promises.push(deferred.promise);
            });

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS TASK");
                },

                function (error) {
                    callback("ERROR TASK");
                }
            );
        };

        function deleteInstallRecord(response, callback) {

            var responseList = response;

            var promises = [];

            angular.forEach(responseList, function (item) {

                var deferred = $q.defer();

                db.transaction(function (transaction) {

                    var sqlSelect = "SELECT * FROM InstallBase WHERE Installed_Base_ID = " + item.Record_ID;

                    transaction.executeSql(sqlSelect, [], function (tx, res) {

                        var rowLength = res.rows.length;

                        // console.log("INSTALL ROW LENGTH " + rowLength);

                        if (rowLength > 0) {

                            db.transaction(function (transaction) {

                                var sqlDelete = "";

                                if (item.TaskID != undefined && item.TaskID != null && item.TaskID != "") {

                                    sqlDelete = "DELETE FROM InstallBase WHERE Installed_Base_ID = " + item.Record_ID + " AND Task_Number = " + item.TaskID;

                                } else {

                                    sqlDelete = "DELETE FROM InstallBase WHERE Installed_Base_ID = " + item.Record_ID;
                                }

                                transaction.executeSql(sqlDelete, [], function (tx, res) {

                                    deferred.resolve(res);

                                }, function (error) {

                                    // console.log("INSTALL DELETE TRANSACTION ERROR: " + error.message);

                                    deferred.reject(error);
                                });

                            }, function (error) {

                                // console.log("INSTALL DELETE TRANSACTION ERROR: " + error.message);

                                deferred.reject(error);
                            });

                        } else {

                            deferred.resolve("success");
                        }

                    }, function (tx, error) {

                        // console.log("INSTALL SELECT ERROR: " + error.message);

                        deferred.reject(error);
                    });

                }, function (error) {

                    // console.log("INSTALL SELECT TRANSACTION ERROR: " + error.message);

                    deferred.reject(error);
                });

                // console.log("INSTALL OBJECT =====> " + JSON.stringify(item));

                promises.push(deferred.promise);
            });

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS INSTALL");
                },

                function (error) {
                    callback("ERROR INSTALL");
                }
            );
        };

        function deleteContactRecord(response, callback) {

            var responseList = response;

            var promises = [];

            angular.forEach(responseList, function (item) {

                var deferred = $q.defer();

                db.transaction(function (transaction) {

                    var sqlSelect = "SELECT * FROM Contact WHERE Contact_ID = " + item.Record_ID;

                    transaction.executeSql(sqlSelect, [], function (tx, res) {

                        var rowLength = res.rows.length;

                        // console.log("CONTACT ROW LENGTH " + rowLength);

                        if (rowLength > 0) {

                            db.transaction(function (transaction) {

                                var sqlDelete = "DELETE FROM Contact WHERE Contact_ID = " + item.Record_ID;

                                transaction.executeSql(sqlDelete, [], function (tx, res) {

                                    deferred.resolve(res);

                                }, function (error) {

                                    // console.log("CONTACT DELETE TRANSACTION ERROR: " + error.message);

                                    deferred.reject(error);
                                });

                            }, function (error) {

                                // console.log("CONTACT DELETE TRANSACTION ERROR: " + error.message);

                                deferred.reject(error);
                            });

                        } else {

                            deferred.resolve("success");
                        }

                    }, function (tx, error) {

                        // console.log("CONTACT SELECT ERROR: " + error.message);

                        deferred.reject(error);
                    });

                }, function (error) {

                    // console.log("CONTACT SELECT TRANSACTION ERROR: " + error.message);

                    deferred.reject(error);
                });

                // console.log("CONTACT OBJECT =====> " + JSON.stringify(item));

                promises.push(deferred.promise);
            });

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS CONTACT");
                },

                function (error) {
                    callback("ERROR CONTACT");
                }
            );
        };

        function deleteNoteRecord(response, callback) {

            var responseList = response;

            var promises = [];

            angular.forEach(responseList, function (item) {

                var deferred = $q.defer();

                db.transaction(function (transaction) {

                    var sqlSelect = "SELECT * FROM Note WHERE Notes_ID = " + item.Record_ID;

                    transaction.executeSql(sqlSelect, [], function (tx, res) {

                        var rowLength = res.rows.length;

                        // console.log("NOTE ROW LENGTH " + rowLength);

                        if (rowLength > 0) {

                            db.transaction(function (transaction) {

                                var sqlDelete = "DELETE FROM Note WHERE Notes_ID = " + item.Record_ID;

                                transaction.executeSql(sqlDelete, [], function (tx, res) {

                                    deferred.resolve(res);

                                }, function (error) {

                                    // console.log("NOTE DELETE TRANSACTION ERROR: " + error.message);

                                    deferred.reject(error);
                                });

                            }, function (error) {

                                // console.log("NOTE DELETE TRANSACTION ERROR: " + error.message);

                                deferred.reject(error);
                            });

                        } else {

                            deferred.resolve("success");
                        }

                    }, function (tx, error) {

                        // console.log("NOTE SELECT ERROR: " + error.message);

                        deferred.reject(error);
                    });

                }, function (error) {

                    // console.log("NOTE SELECT TRANSACTION ERROR: " + error.message);

                    deferred.reject(error);
                });

                // console.log("NOTE OBJECT =====> " + JSON.stringify(item));

                promises.push(deferred.promise);
            });

            $q.all(promises).then(
                function (response) {
                    callback("SUCCESS NOTE");
                },

                function (error) {
                    callback("ERROR NOTE");
                }
            );
        };

        function getTaskList(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Task WHERE ResourceId = ?", [constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    // console.log("GET TASK DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET TASK SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET TASK TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getInternalList(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Internal WHERE ResourceId = ?", [constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    // console.log("GET INTERNAL DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET INTERNAL SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET INTERNAL TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getInstallBaseList(taskId, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM InstallBase WHERE Task_Number = ? AND ResourceId = ?", [taskId, constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    // console.log("GET INSTALLBASE DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET INSTALLBASE SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET INSTALLBASE TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getContactList(taskId, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Contact WHERE Task_Number = ? AND ResourceId = ?", [taskId, constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    // console.log("GET CONTACT DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET CONTACT SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET CONTACT TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getNoteList(taskId, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Note WHERE Task_Number = ? AND ResourceId = ?", [taskId, constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    // console.log("GET NOTE DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET NOTE SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET NOTE TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getSRNoteList(taskId, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Note WHERE Incident = ? AND ResourceId = ?", [taskId, constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    // console.log("GET NOTE DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET NOTE SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET NOTE TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getAttachmentList(taskId, type, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Attachment WHERE Task_Number = ? AND Type = ? AND ResourceId = ?", [taskId, type, constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    // console.log("GET ATTACHMENT DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET ATTACHMENT SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET ATTACHMENT TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getOverTimeList(taskId, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM OverTime WHERE Project_Number = ? AND ResourceId = ?", [taskId, constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    // console.log("GET OVERTIME DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET OVERTIME SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET OVERTIME TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getShiftCodeList(taskId, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM ShiftCode  WHERE Project_Number = ? AND ResourceId = ?", [taskId, constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    // console.log("GET SHIFTCODE DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET SHIFTCODE SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET SHIFTCODE TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getFieldJobNameList(taskNumber, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM FieldJobName WHERE Project_Number = ? AND ResourceId = ?", [taskNumber, constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    // console.log("GET FIELDJOBNAME DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET FIELDJOBNAME SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET FIELDJOBNAME TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getChargeMethodList(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM ChargeMethod WHERE ResourceId = ?", [constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    // console.log("GET CHARGEMETHOD DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET CHARGEMETHOD SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET CHARGEMETHOD TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getChargeTypeList(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM ChargeType WHERE ResourceId = ?", [constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    // console.log("GET CHARGETYPE DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET CHARGETYPE SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET CHARGETYPE TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getExpenseTypeList(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM ExpenseType WHERE ResourceId = ?", [constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    // console.log("GET EXPENSETYPE DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET EXPENSETYPE SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET EXPENSETYPE TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getNoteTypeList(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM NoteType WHERE ResourceId = ?", [constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    // console.log("GET NOTETYPE DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET NOTETYPE SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET NOTETYPE TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getWorkTypeList(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM WorkType WHERE ResourceId = ?", [constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    // console.log("GET WORKTYPE DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET WORKTYPE SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET WORKTYPE TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getItemList(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Item WHERE ResourceId = ?", [constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    // console.log("GET ITEM DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET ITEM SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET ITEM TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getCurrencyList(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Currency WHERE ResourceId = ?", [constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    // console.log("GET CURRENCY DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET CURRENCY SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET CURRENCY TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getUOMList(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM UOM WHERE ResourceId = ?", [constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    // console.log("GET UOM DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET UOM SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET UOM TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getTimeList(taskId, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Time WHERE Task_Number = ? AND ResourceId = ?", [taskId, constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    value.reverse();

                    // console.log("GET TIME DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET TIME SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET TIME TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getExpenseList(taskId, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Expense WHERE Task_Number = ? AND ResourceId = ?", [taskId, constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    value.reverse();

                    // console.log("GET EXPENSE DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET EXPENSE SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET EXPENSE TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getMaterialList(taskId, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Material WHERE Task_Number = ? AND ResourceId = ?", [taskId, constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    value.reverse();

                    // console.log("GET MATERIAL DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET MATERIAL SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET MATERIAL TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getNotesList(taskId, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Notes WHERE Task_Number = ? AND ResourceId = ?", [taskId, constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    value.reverse();

                    // console.log("GET NOTES DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET NOTES SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET NOTES TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getEngineer(taskId, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Engineer WHERE Task_Number = ? AND ResourceId = ?", [taskId, constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    var value = res.rows.item(0);

                    // console.log("GET ENGINEER DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET ENGINEER SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET ENGINEER TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getToolList(taskId, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Tool WHERE Task_Number = ? AND ResourceId = ?", [taskId, constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    value.reverse();

                    // console.log("GET TOOL DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET TOOL SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET TOOL TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getSRAttachmentList(taskId, type, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Attachment WHERE SRID = ? AND Type = ? AND ResourceId = ?", [taskId, type, constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    // console.log("GET ATTACHMENT DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET ATTACHMENT SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET ATTACHMENT TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getAttachmentListType(type, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Attachment WHERE Type = ? AND ResourceId = ? AND Attachment_Status = ?", [type, constantService.getResourceId(), "0"], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    // console.log("GET ATTACHMENT DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET ATTACHMENT SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET ATTACHMENT TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getPendingTaskList(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Task WHERE Submit_Status = ? AND ResourceId = ?", ["P", constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    // console.log("GET TASK PENDING DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET TASK PENDING SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET TASK PENDING TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getAcceptTaskList(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Task WHERE Submit_Status = ? AND ResourceId = ?", ["A", constantService.getResourceId()], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    // console.log("GET TASK ACCEPT DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    // console.log("GET TASK ACCEPT SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                // console.log("GET TASK ACCEPT TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function updateTaskSubmitStatus(responseList, callback) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Task SET Task_Status = ?, Submit_Status = ?, Date = ?, Sync_Status = ?  WHERE Task_Number = ?";

                insertValues.push(responseList.Task_Status);
                insertValues.push(responseList.Submit_Status);
                insertValues.push(responseList.Date);
                insertValues.push(responseList.Sync_Status);
                insertValues.push(responseList.Task_Number);

                // console.log("TASK UPDATE VALUES =====> " + insertValues);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    // console.log("TASK ROW AFFECTED: " + res.rowsAffected);

                    callback(res);

                }, function (tx, error) {

                    // console.log("TASK UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                // console.log("TASK UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function updateTaskEmail(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Task SET Email = ?  WHERE Task_Number = ?";

                insertValues.push(responseList.Email);
                insertValues.push(responseList.Task_Number);

                // console.log("TASK UPDATE VALUES =====> " + insertValues);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    // console.log("TASK ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("TASK UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                // console.log("TASK UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function updateAttachmentDownloadStatus(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Attachment SET Attachment_Status = ?  WHERE Attachment_Id = ?";

                insertValues.push(responseList.Attachment_Status);
                insertValues.push(responseList.Attachment_Id);

                // console.log("ATTACHMENT UPDATE VALUES =====> " + insertValues);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    // console.log("ATTACHMENT ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    // console.log("ATTACHMENT UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                // console.log("ATTACHMENT UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function updateTaskStatus(callback) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Task SET Status = ?";

                insertValues.push("0");

                // console.log("TASK UPDATE VALUES =====> " + insertValues);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    // console.log("TASK ROW AFFECTED: " + res.rowsAffected);

                    callback(res);

                }, function (tx, error) {

                    // console.log("TASK UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                // console.log("TASK UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function updateInstallBaseStatus(callback) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE InstallBase SET Status = ?";

                insertValues.push("0");

                // console.log("TASK UPDATE VALUES =====> " + insertValues);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    // console.log("TASK ROW AFFECTED: " + res.rowsAffected);

                    callback(res);

                }, function (tx, error) {

                    // console.log("TASK UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                // console.log("TASK UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function updateContactStatus(callback) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Contact SET Status = ?";

                insertValues.push("0");

                // console.log("TASK UPDATE VALUES =====> " + insertValues);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    // console.log("TASK ROW AFFECTED: " + res.rowsAffected);

                    callback(res);

                }, function (tx, error) {

                    // console.log("TASK UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                // console.log("TASK UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function updateNoteStatus(callback) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Note SET Status = ?";

                insertValues.push("0");

                // console.log("TASK UPDATE VALUES =====> " + insertValues);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    // console.log("TASK ROW AFFECTED: " + res.rowsAffected);

                    callback(res);

                }, function (tx, error) {

                    // console.log("TASK UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                // console.log("TASK UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function updateAttachmentStatus(callback) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Attachment SET Status = ?";

                insertValues.push("0");

                // console.log("TASK UPDATE VALUES =====> " + insertValues);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    // console.log("TASK ROW AFFECTED: " + res.rowsAffected);

                    callback(res);

                }, function (tx, error) {

                    // console.log("TASK UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                // console.log("TASK UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function updateShiftCodeStatus(callback) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE ShiftCode SET Status = ?";

                insertValues.push("0");

                // console.log("TASK UPDATE VALUES =====> " + insertValues);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    // console.log("TASK ROW AFFECTED: " + res.rowsAffected);

                    callback(res);

                }, function (tx, error) {

                    // console.log("TASK UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                // console.log("TASK UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function updateOverTimeStatus(callback) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE OverTime SET Status = ?";

                insertValues.push("0");

                // console.log("TASK UPDATE VALUES =====> " + insertValues);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    // console.log("TASK ROW AFFECTED: " + res.rowsAffected);

                    callback(res);

                }, function (tx, error) {

                    // console.log("TASK UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                // console.log("TASK UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function updateFieldJobStatus(callback) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE FieldJobName SET Status = ?";

                insertValues.push("0");

                // console.log("TASK UPDATE VALUES =====> " + insertValues);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    // console.log("TASK ROW AFFECTED: " + res.rowsAffected);

                    callback(res);

                }, function (tx, error) {

                    // console.log("TASK UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                // console.log("TASK UPDATE TRANSACTION ERROR: " + error.message);
            });
        };
    }

})
    ();
