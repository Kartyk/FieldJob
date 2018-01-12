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

        var contactsCCEmail = "";

        var contentType = 'application/json';

        // DEV

        var authKey = "Basic QTQ3MjE0NF9FTUVSU09OTU9CSUxFQ0xPVURfTU9CSUxFX0FOT05ZTU9VU19BUFBJRDpZLm81amxkaHVtYzF2ZQ==";

        var loginBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        var techBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        var taskListBackEndId = "cb0399de-d185-4cf1-ac60-9012d20add71";

        var internalBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        var taskDetailBackEndId = "91276bb5-acb5-4bfc-8673-fadf21173a4f";

        var projectBackEndId = "91276bb5-acb5-4bfc-8673-fadf21173a4f";

        var lovBackEndId = "cb0399de-d185-4cf1-ac60-9012d20add71";

        var srBackEndId = "91276bb5-acb5-4bfc-8673-fadf21173a4f";

        var debriefBackEndId = "cb0399de-d185-4cf1-ac60-9012d20add71";

        var statusBackEndId = "cb0399de-d185-4cf1-ac60-9012d20add71";

        var createBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        var downloadBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        var deleteBackEndId = "a0f02e4c-cc58-4aa7-bba9-78e57a000b59";


        //SIT

        //var authKey = "Basic QTQ3MjE0NF9FTUVSU09OTU9CSUxFVEVTVEVOVl9NT0JJTEVfQU5PTllNT1VTX0FQUElEOm9ma3U1ZG4xUHZscS5t";

        //var loginBackEndId = "e4ecc164-2b7a-49ab-a00c-8ea1209d7886";

        //var techBackEndId = "e4ecc164-2b7a-49ab-a00c-8ea1209d7886";

        //var taskListBackEndId = "d8ba9d1b-20c9-4586-9037-5846804a002a";

        //var internalBackEndId = "69559620-94dc-4bdc-9054-85d42cef7f6a";

        //var taskDetailBackEndId = "4548d523-e5cb-419f-98a1-020a7de64f86";

        //var projectBackEndId = "4548d523-e5cb-419f-98a1-020a7de64f86";

        //var lovBackEndId = "d8ba9d1b-20c9-4586-9037-5846804a002a";

        //var srBackEndId = "4548d523-e5cb-419f-98a1-020a7de64f86";

        //var debriefBackEndId = "86c8aa7b-193c-4dd7-bf3b-fb6fc11442e8";

        //var statusBackEndId = "69559620-94dc-4bdc-9054-85d42cef7f6a";

        //var createBackEndId = "e4ecc164-2b7a-49ab-a00c-8ea1209d7886";

        //var downloadBackEndId = "fb4010a8-02b7-4e20-88d0-d7f4029f6bd0";

        //var deleteBackEndId = "4548d523-e5cb-419f-98a1-020a7de64f86";


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

        service.setUserEmailId = setUserEmailId;
        service.getUserEmailId = getUserEmailId;

        service.setCCEmailID = setCCEmailID;
        service.getCCEmailID = getCCEmailID;

        service.setTimeZone = setTimeZone;
        service.getTimeZone = getTimeZone;

        service.setStagesArray = setStagesArray;
        service.getStagesArray = getStagesArray;

        service.getLoginBackId = getLoginBackId;
        service.getTechBackId = getTechBackId;
        service.getTaskListBackId = getTaskListBackId;
        service.getInternalBackId = getInternalBackId;
        service.getTaskDetailBackId = getTaskDetailBackId;
        service.getProjectBackId = getProjectBackId;
        service.getLovBackId = getLovBackId;
        service.getSRBackId = getSRBackId;
        service.getDebriefBackId = getDebriefBackId;
        service.getStatusBackId = getStatusBackId;
        service.getCreateBackId = getCreateBackId;
        service.getDownloadBackId = getDownloadBackId;
        service.getDeleteBackId = getDeleteBackId;

        return service;

        function getLoginBackId() {

            return loginBackEndId;
        };

        function getTechBackId() {

            return techBackEndId;
        };

        function getTaskListBackId() {

            return taskListBackEndId;
        };

        function getInternalBackId() {

            return internalBackEndId;
        };

        function getTaskDetailBackId() {

            return taskDetailBackEndId;
        };

        function getProjectBackId() {

            return projectBackEndId;
        };

        function getLovBackId() {

            return lovBackEndId;
        };

        function getSRBackId() {

            return srBackEndId;
        };

        function getDebriefBackId() {

            return debriefBackEndId;
        };

        function getStatusBackId() {

            return statusBackEndId;
        };

        function getCreateBackId() {

            return createBackEndId;
        };

        function getDownloadBackId() {

            return downloadBackEndId;
        };

        function getDeleteBackId() {

            return deleteBackEndId;
        };

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

        function setStagesArray(stages) {

            stagesArray = stages;
        };

        function getStagesArray() {

            return stagesArray;
        };

        function getAuthor() {

            return authKey;
        };

        function getContentType() {

            return contentType;
        };
    }
})();
