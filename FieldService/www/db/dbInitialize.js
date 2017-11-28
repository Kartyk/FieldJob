(function () {

    "use strict";

    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {

        var db = sqlitePlugin.openDatabase({
            name: "emerson.sqlite",
            location: 'default'
        });

        var sqlUser = "CREATE TABLE IF NOT EXISTS User ('ID' INTEGER PRIMARY KEY  NOT NULL, 'ClarityID' TEXT, 'Currency' TEXT, 'Default_View' TEXT, 'Email' TEXT, 'Language' TEXT, 'Name' TEXT, 'OFSCId' TEXT, 'Password' TEXT, 'Time_Zone' TEXT, 'Type' TEXT, 'User_Name' TEXT, 'Work_Day' TEXT, 'Work_Hour' TEXT, 'Login_Status' TEXT, 'Last_Updated' TEXT)";

        var sqlTask = "CREATE TABLE IF NOT EXISTS Task ('Task_Number' INTEGER PRIMARY KEY  NOT NULL, 'Job_Description' TEXT, 'Duration' TEXT, 'Task_Status' TEXT, 'Customer_Name' TEXT, 'Street_Address' TEXT, 'City' TEXT, 'State' TEXT, 'Country' TEXT, 'Zip_Code' TEXT, 'Expense_Method' TEXT, 'Labor_Method' TEXT, 'Travel_Method' TEXT, 'Material_Method' TEXT, 'Service_Request' TEXT, 'Assigned' TEXT, 'Start_Date' TEXT, 'End_Date' TEXT, 'Submit_Status' TEXT, 'Email' TEXT, 'Date' TEXT, 'Type' TEXT, 'Activity_Id' TEXT, 'Work_Phone_Number' TEXT, 'Mobile_Phone_Number' TEXT, 'Address1' TEXT, 'SR_ID' TEXT, 'Name' TEXT, 'ResourceId' TEXT)";

        var sqlInternal = "CREATE TABLE IF NOT EXISTS Internal ('Activity_Id' INTEGER PRIMARY KEY  NOT NULL, 'Start_time' TEXT, 'End_time' TEXT, 'Activity_type' TEXT, 'ResourceId' TEXT)";

        var sqlSRNotes = "CREATE TABLE IF NOT EXISTS SRNotes ('Notes_ID' INTEGER, 'Service_Request' TEXT, 'Notes' TEXT, 'Notes_type' TEXT, 'Note_Description' TEXT, 'Created_By' TEXT, 'MobileCreatedBy' TEXT, 'Start_Date' TEXT, 'Last_updated_date' TEXT, 'Incident' TEXT, 'ResourceId' TEXT)";

        var sqlSRAttachment = "CREATE TABLE IF NOT EXISTS SRAttachment ('SRID' INTEGER, 'Reference_Number' TEXT, 'File_Attachment_ID' TEXT, 'Date_Created' TEXT, 'Content_Type' TEXT, 'User_File_Name' TEXT, 'Date_Last_Updated' TEXT, 'ResourceId' TEXT)";

        var sqlInstallBase = "CREATE TABLE IF NOT EXISTS InstallBase ('Installed_Base_ID' INTEGER, 'Product_Line' TEXT, 'Serial_Number' TEXT, 'TagNumber' TEXT, 'Original_PO_Number' TEXT, 'Task_Number' TEXT, 'Service_Request' TEXT, 'Assigned' TEXT, 'Start_Date' TEXT, 'End_Date' TEXT, 'ResourceId' TEXT)";

        var sqlContact = "CREATE TABLE IF NOT EXISTS Contact ('Contact_ID' INTEGER, 'Customer_Name' TEXT, 'Contact_Name' TEXT, 'Home_Phone' TEXT, 'Mobile_Phone' TEXT, 'Fax_Phone' TEXT, 'Office_Phone' TEXT, 'Email' TEXT, 'Foreign_Key' TEXT, 'Task_Number' TEXT, 'Service_Request' TEXT, 'Assigned' TEXT, 'Start_Date' TEXT, 'End_Date' TEXT, 'ResourceId' TEXT)";

        var sqlNote = "CREATE TABLE IF NOT EXISTS Note ('ID' INTEGER, 'Notes' TEXT, 'Notes_type' TEXT, 'Note_Description' TEXT, 'Created_By' TEXT, 'MobileCreatedBy' TEXT, 'Task_Number' TEXT, 'Service_Request' TEXT, 'Assigned' TEXT, 'Start_Date' TEXT, 'End_Date' TEXT, 'Last_updated_date' TEXT, 'SR_ID' TEXT, 'ResourceId' TEXT)";

        var sqlProject = "CREATE TABLE IF NOT EXISTS Project ('ID' INTEGER, 'Clarity_Contact' TEXT, 'P_ProjectManager' TEXT, 'P_Company' TEXT, 'P_ProjectNumber' TEXT, 'Requested' TEXT, 'ResourceId' TEXT)";

        var sqlOverTime = "CREATE TABLE IF NOT EXISTS OverTime ('OverTime_Shift_Code_ID' TEXT, 'Overtimeshiftcode' TEXT, 'Task' TEXT, 'Technician_ID' TEXT, 'Field_Job_ID' TEXT, 'Project' TEXT, 'Start_Date' TEXT, 'Date_Completed' TEXT, 'ResourceId' TEXT)";

        var sqlShiftCode = "CREATE TABLE IF NOT EXISTS ShiftCode ('Shift_Code_ID' TEXT, 'ShiftCodeName' TEXT, 'TaskNumber' TEXT, 'Technician_ID' TEXT, 'Field_Job_ID' TEXT, 'Project' TEXT, 'Start_Date' TEXT, 'Date_Completed' TEXT, 'ResourceId' TEXT)";

        var sqlChargeType = "CREATE TABLE IF NOT EXISTS ChargeType ('ID' INTEGER PRIMARY KEY  NOT NULL, 'Value' TEXT, 'ResourceId' TEXT)";

        var sqlChargeMethod = "CREATE TABLE IF NOT EXISTS ChargeMethod ('ID' INTEGER PRIMARY KEY  NOT NULL, 'Value' TEXT, 'ResourceId' TEXT)";

        var sqlFieldJobName = "CREATE TABLE IF NOT EXISTS FieldJobName ('TaskCode' INTEGER, 'JobName' TEXT, 'Task' TEXT, 'Technician_ID' TEXT, 'Project' TEXT, 'Start_Date' TEXT, 'Date_Completed' TEXT, 'ResourceId' TEXT)";

        var sqlWorkType = "CREATE TABLE IF NOT EXISTS WorkType ('ID' INTEGER PRIMARY KEY  NOT NULL, 'Value' TEXT, 'ResourceId' TEXT)";

        var sqlItem = "CREATE TABLE IF NOT EXISTS Item ('ID' INTEGER PRIMARY KEY  NOT NULL, 'Value' TEXT, 'Type' TEXT, 'ResourceId' TEXT)";

        var sqlCurrency = "CREATE TABLE IF NOT EXISTS Currency ('ID' INTEGER PRIMARY KEY  NOT NULL, 'Value' TEXT, 'ResourceId' TEXT)";

        var sqlExpenseType = "CREATE TABLE IF NOT EXISTS ExpenseType ('ID' INTEGER PRIMARY KEY  NOT NULL, 'Value' TEXT, 'ResourceId' TEXT)";

        var sqlNoteType = "CREATE TABLE IF NOT EXISTS NoteType ('ID' INTEGER PRIMARY KEY  NOT NULL, 'Value' TEXT, 'ResourceId' TEXT)";

        var sqlTime = "CREATE TABLE IF NOT EXISTS Time ('Time_Id' INTEGER PRIMARY KEY  NOT NULL, 'timeDefault' TEXT, 'Field_Job_Name' TEXT, 'Field_Job_Name_Id' TEXT, 'Charge_Type' TEXT, 'Charge_Type_Id' TEXT, 'Charge_Method' TEXT, 'Charge_Method_Id' TEXT, 'Work_Type' TEXT, 'Work_Type_Id' TEXT, 'Item' TEXT, 'Item_Id' TEXT, 'Description' TEXT, 'Time_Code' TEXT, 'Time_Code_Id' TEXT, 'Shift_Code' TEXT, 'Shift_Code_Id' TEXT, 'Date' TEXT, 'Duration' TEXT, 'Comments' TEXT, 'Task_Number' TEXT, 'ResourceId' TEXT)";

        var sqlExpense = "CREATE TABLE IF NOT EXISTS Expense ('Expense_Id' INTEGER PRIMARY KEY  NOT NULL, 'expenseDefault' TEXT, 'Date' TEXT, 'Expense_Type' TEXT, 'Expense_Type_Id' TEXT, 'Amount' TEXT, 'Currency' TEXT, 'Currency_Id' TEXT, 'Charge_Method' TEXT, 'Charge_Method_Id' TEXT, 'Justification' TEXT, 'Task_Number' TEXT, 'ResourceId' TEXT)";

        var sqlMaterial = "CREATE TABLE IF NOT EXISTS Material ('Material_Id' INTEGER PRIMARY KEY  NOT NULL, 'materialDefault' TEXT, 'Charge_Type' TEXT, 'Charge_Type_Id' TEXT, 'Description' TEXT, 'ItemName' TEXT, 'Product_Quantity' TEXT, 'Serial_Number' TEXT, 'Serial_In' TEXT, 'Serial_Out' TEXT, 'Task_Number' TEXT, 'ResourceId' TEXT)";

        var sqlNotes = "CREATE TABLE IF NOT EXISTS Notes ('Notes_Id' INTEGER PRIMARY KEY  NOT NULL, 'noteDefault' TEXT, 'Note_Type' TEXT, 'Note_Type_Id' TEXT, 'Date' TEXT, 'Created_By' TEXT, 'Notes' TEXT, 'Task_Number' TEXT, 'ResourceId' TEXT)";

        var sqlAttachment = "CREATE TABLE IF NOT EXISTS Attachment ('Attachment_Id' INTEGER PRIMARY KEY  NOT NULL, 'File_Name' TEXT, 'File_Type' TEXT, 'File_Path' TEXT, 'Type' TEXT, 'AttachmentType' TEXT, 'Created_Date' TEXT, 'Task_Number' TEXT, 'SRID' TEXT, 'ResourceId' TEXT)";

        var sqlEngineer = "CREATE TABLE IF NOT EXISTS Engineer ('Engineer_Id' INTEGER PRIMARY KEY  NOT NULL, 'followUp' boolean, 'salesQuote' boolean, 'salesVisit' boolean, 'salesLead' boolean, 'Follow_Up' TEXT, 'Spare_Quote' TEXT, 'Sales_Visit' TEXT, 'Sales_Head' TEXT, 'Sign_File_Path' TEXT, 'File_Name' TEXT, 'Task_Number' TEXT, 'ResourceId' TEXT)";

        db.transaction(function (tx) {

            tx.executeSql(sqlUser);
            // console.log('DB SUCCESS: USER');

            tx.executeSql(sqlTask);
            //console.log('DB SUCCESS: TASK');

            tx.executeSql(sqlInternal);
            //console.log('DB SUCCESS: INTERNAL');

            tx.executeSql(sqlSRNotes);
            //console.log('DB SUCCESS: SRNOTES');

            tx.executeSql(sqlSRAttachment);
            //console.log('DB SUCCESS: SRNOTES');

            tx.executeSql(sqlInstallBase);
            //console.log('DB SUCCESS: INSTALLBASE');

            tx.executeSql(sqlContact);
            //console.log('DB SUCCESS: CONTACT');

            tx.executeSql(sqlNote);
            //console.log('DB SUCCESS: NOTE');

            tx.executeSql(sqlProject);
            //console.log('DB SUCCESS: PROJECT');

            tx.executeSql(sqlOverTime);
            //console.log('DB SUCCESS: OVERTIME');

            tx.executeSql(sqlShiftCode);
            //console.log('DB SUCCESS: SHIFTCODE');

            tx.executeSql(sqlChargeType);
            //console.log('DB SUCCESS: CHARGETYPE');

            tx.executeSql(sqlChargeMethod);
            //console.log('DB SUCCESS: CHARGEMETHOD');

            tx.executeSql(sqlFieldJobName);
            //console.log('DB SUCCESS: FIELDJOBNAME');

            tx.executeSql(sqlWorkType);
            //console.log('DB SUCCESS: WORKTYPE');

            tx.executeSql(sqlItem);
            //console.log('DB SUCCESS: ITEM');

            tx.executeSql(sqlCurrency);
            //console.log('DB SUCCESS: CURRENCY');

            tx.executeSql(sqlExpenseType);
            //console.log('DB SUCCESS: EXPENSETYPE');

            tx.executeSql(sqlNoteType);
            //console.log('DB SUCCESS: NOTETYPE');

            tx.executeSql(sqlTime);
            //console.log('DB SUCCESS: TIME');

            tx.executeSql(sqlExpense);
            //console.log('DB SUCCESS: EXPENSE');

            tx.executeSql(sqlMaterial);
            //console.log('DB SUCCESS: MATERIAL');

            tx.executeSql(sqlNotes);
            //console.log('DB SUCCESS: NOTES');

            tx.executeSql(sqlAttachment);
            //console.log('DB SUCCESS: ATTACHMENT');

            tx.executeSql(sqlEngineer);
            //console.log('DB SUCCESS: ENGINEER');

        }, function (error) {

            console.log('DB INITIALIZE ERROR: ' + error.message);

        }, function () {

            console.log('DB INITIALIZED');
        });
    }

})();
