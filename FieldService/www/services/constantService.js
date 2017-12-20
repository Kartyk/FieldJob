(function () {

    'use strict';

    app.service('constantService', constantService);

    constantService.$inject = ['$http', '$rootScope', '$window', '$location'];

    function constantService($http, $rootScope, $window, $location) {

        var service = {};

        var userObject = {};

        var resourceId = null;

        var lastUpdated = null;

        var timeZone = null;

        var contactsEmail = [];

        var taskList = [];

        var contactsCCEmail = null;

        var contentType = 'application/json';

        // DEV

        //var authKey = "Basic QTQ3MjE0NF9FTUVSU09OTU9CSUxFQ0xPVURfTU9CSUxFX0FOT05ZTU9VU19BUFBJRDpZLm81amxkaHVtYzF2ZQ==";

        //var taskBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        //var chargeBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        //var shiftBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        //var fieldBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        //var materialBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        //var ofscBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        //var acceptBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        //var expenseBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        //var internalBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        //var srBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        //var timeDataBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        //var ofscNewBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        //var updateStatusBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        // var combinedBackEndId = "cb0399de-d185-4cf1-ac60-9012d20add71";


        //SIT

         var authKey = "Basic QTQ3MjE0NF9FTUVSU09OTU9CSUxFVEVTVEVOVl9NT0JJTEVfQU5PTllNT1VTX0FQUElEOm9ma3U1ZG4xUHZscS5t";
        
         var taskBackEndId = "b043c17e-7dcd-41a5-abc6-39fa2f8ab0a6";
        
         var internalBackEndId = "fe3b9068-deca-4a48-88f7-b73b19274b12";
        
         var chargeBackEndId = "e4ecc164-2b7a-49ab-a00c-8ea1209d7886";
        
         var shiftBackEndId = "e4ecc164-2b7a-49ab-a00c-8ea1209d7886";
        
         var fieldBackEndId = "e4ecc164-2b7a-49ab-a00c-8ea1209d7886";
        
         var materialBackEndId = "e4ecc164-2b7a-49ab-a00c-8ea1209d7886";
        
         var ofscBackEndId = "b043c17e-7dcd-41a5-abc6-39fa2f8ab0a6";
        
         var ofscNewBackEndId = "69559620-94dc-4bdc-9054-85d42cef7f6a";
        
         var acceptBackEndId = "e4ecc164-2b7a-49ab-a00c-8ea1209d7886";
        
         var expenseBackEndId = "e4ecc164-2b7a-49ab-a00c-8ea1209d7886";
        
         var srBackEndId = "fb4010a8-02b7-4e20-88d0-d7f4029f6bd0";
        
         var timeDataBackEndId = "f85ff6e6-01f5-4a38-aa55-ec0625ec41f9";
        
         var updateStatusBackEndId = "f32be367-6afc-4dca-b379-b0dbc3f6ef5a";

         var expensesBackEndId = "16807770-ff88-468b-a729-059fc92b32f7";

         var combinedBackEndId = "d8ba9d1b-20c9-4586-9037-5846804a002a";

         var newBackEndId = "02593e79-7fe6-4296-baf6-ea2a1448638c";

        var stagesArray = {};

        var startDate = new Date();

        startDate.setDate(startDate.getDate() - 15);

        var startDateISOFormat = startDate.toISOString();

        var endDate = new Date();

        endDate.setDate(endDate.getDate() + 15);

        var endDateISOFormat = endDate.toISOString();

        service.setResourceId = setResourceId;
        service.getResourceId = getResourceId;

        service.setUser = setUser;
        service.getUser = getUser;

        service.setLastUpdated = setLastUpdated;
        service.getLastUpdated = getLastUpdated;

        service.getStartDate = getStartDate;
        service.getEndDate = getEndDate;

        service.setTaskList = setTaskList;
        service.getTaskList = getTaskList;

        service.getContentType = getContentType;
        service.getAuthor = getAuthor;

        service.getTaskBackId = getTaskBackId;
        service.getInternalBackId = getInternalBackId;
        service.getChargeBackId = getChargeBackId;
        service.getFieldBackId = getFieldBackId;
        service.getShiftBackId = getShiftBackId;
        service.getMaterialBackId = getMaterialBackId;
        service.getOfscBackId = getOfscBackId;
        service.getNewOfscBackId = getNewOfscBackId;
        service.getCombinedBackId = getCombinedBackId;
        service.getAcceptBackId = getAcceptBackId;
        service.getSRBackId = getSRBackId;
        service.getTimeDataBackId = getTimeDataBackId;
        service.getUpdateStatusBackId = getUpdateStatusBackId;
        service.getExpenseBackEndId = service.getExpenseBackEndId;
        service.getNewBackEndId = service.getNewBackEndId;

        service.setUserEmailId = setUserEmailId;
        service.getUserEmailId = getUserEmailId;

        service.setCCEmailID = setCCEmailID;
        service.getCCEmailID = getCCEmailID;

        service.setTimeZone = setTimeZone;
        service.getTimeZone = getTimeZone;

        service.setStagesArray = setStagesArray;
        service.getStagesArray = getStagesArray;

        service.getExpenseTypeBackendId = getExpenseTypeBackendId;

        return service;

        function getExpenseTypeBackendId() {
            return expenseBackEndId;
        }

        function setResourceId(id) {
            resourceId = id;
        };

        function getResourceId() {
            return resourceId;
        };

        function setUser(user) {

            userObject = user;

            setTimeZone(userObject.Time_Zone);

            $rootScope.uName = userObject.Name;
        };

        function getUser() {
            return userObject;
        };

        function setLastUpdated(lastUpdate) {
            lastUpdated = lastUpdate;
        };

        function getLastUpdated() {
            return lastUpdated;
        };

        function setTimeZone(zone) {
            timeZone = zone;
        };

        function getTimeZone() {

            return timeZone;
        };

        function setUserEmailId(id) {

            for (var i = 0; i < id.length; i++) {

                contactsEmail.push(id[i].Email);
            }
        };

        function getUserEmailId() {

            return contactsEmail;
        };

        function setCCEmailID(email) {

            contactsCCEmail = email;
        };

        function getCCEmailID() {

            return contactsCCEmail;
        };

        function getNewBackEndId() {

            return newBackEndId;
        };

        function getStartDate() {

            return startDateISOFormat;
        };

        function getEndDate() {

            return endDateISOFormat;
        };

        function setTaskList(response) {

            taskList = response;
        };

        function getTaskList() {

            return taskList;
        };

        function getAuthor() {

            return authKey;
        };

        function getTaskBackId() {

            return taskBackEndId;
        };

        function getTimeDataBackId() {

            return timeDataBackEndId;
        };

        function getInternalBackId() {

            return internalBackEndId;
        };

        function getChargeBackId() {

            return chargeBackEndId;
        };

        function getFieldBackId() {

            return fieldBackEndId;
        };

        function getShiftBackId() {

            return shiftBackEndId;
        };

        function getExpenseBackEndId() {

            return expensesBackEndId;
        }

        function getUpdateStatusBackId() {

            return updateStatusBackEndId;
        };

        function getMaterialBackId() {

            return materialBackEndId;
        };

        function getOfscBackId() {

            return ofscBackEndId;
        };

        function getNewOfscBackId() {

            return ofscNewBackEndId;
        };

        function getCombinedBackId() {

            return combinedBackEndId;
        };

        function getAcceptBackId() {

            return acceptBackEndId;
        };

        function getSRBackId() {

            return srBackEndId;
        };

        function getContentType() {

            return contentType;
        };

        function setStagesArray(stages) {
            stagesArray = stages;
        };

        function getStagesArray() {
            return stagesArray;
        };
    }
})();
