app.controller('myTaskController', function ($scope, $compile, $timeout, uiCalendarConfig, $rootScope, $state, $http, cloudService, localService, valueService, $filter, constantService) {

    $scope.showSearchTaskDiv = false;

    $rootScope.Islogin = true;

    $rootScope.headerName = 'Field Service';

    $rootScope.selectedCategory = 'Field Service';

    var eventsArray = [];

    localService.getTaskList(function (response) {

        constantService.setTaskList(response);

        $scope.myTaskDetails = response;
    });

    getTask();

    function getTask() {

        console.log("GET TASK IN " + JSON.stringify(constantService.getTaskList()));

        if (constantService.getTaskList()) {

            $scope.myTaskDetails = constantService.getTaskList();

            setEventArray(constantService.getTaskList());

            eventInit();

        } else {

            localService.getTaskList(function (response) {

                if (response) {

                    $scope.myTaskDetails = response;

                    constantService.setTaskList(response)

                    console.log("GET TASK IN DB" + $rootScope.myTaskDetails);

                    setEventArray(response);

                    eventInit();
                }
            });
        }
    }

    function setEventArray(response) {

        if (response != null && response.length > 0) {

            response.forEach(function (item) {

                if (item.Type == "CUSTOMER") {


                    // var startDate = item.Start_Date.split(' ');
                    var startDateTime = moment(item.Start_Date).format("YYYY-MM-DDTHH:mm:ss");
                    // var startDateTime = startDate[0] + "T" + startDate[1];

                    // var endDate = item.End_Date.split(' ');
                    var endDateTime = moment(item.End_Date).format("YYYY-MM-DDTHH:mm:ss");
                    // var endDateTime = endDate[0] + "T" + endDate[1];

                    var customerInfo = item.Customer_Name + "\n" + item.Street_Address + "\n" + item.City + "\n" + item.State + "\n" + item.Zip_Code;


                    //  if (item.Task_Status == 'Accepted' || item.Task_Status == 'Assigned'||) {
                    eventsArray.push({
                        title: customerInfo,
                        textEscape: true,
                        start: startDateTime,
                        end: endDateTime,
                        Task_Number: item.Task_Number,
                        Task_Status: item.Task_Status,
                        Job_Description: item.Job_Description,
                        Start_Date: item.Start_Date,
                        End_Date: item.End_Date,
                        Assigned: item.Assigned,
                        Service_Request: item.Service_Request,
                        Expense_Method: item.Expense_Method,
                        Labor_Method: item.Labor_Method,
                        Travel_Method: item.Travel_Method,
                        Material_Method: item.Material_Method,
                        Duration: item.Duration,
                        Customer_Name: item.Customer_Name,
                        Street_Address: item.Street_Address,
                        City: item.City,
                        State: item.State,
                        Zip_Code: item.Zip_Code,
                        Expense_Method: item.Expense_Method,
                        Labor_Method: item.Labor_Method,
                        Travel_Method: item.Travel_Method,
                        Material_Method: item.Material_Method
                    });
                } else {
                    var startDateTime = moment(item.Start_Date).format("YYYY-MM-DDTHH:mm:ss");
                    // var startDateTime = startDate[0] + "T" + startDate[1];

                    // var endDate = item.End_Date.split(' ');
                    var endDateTime = moment(item.End_Date).format("YYYY-MM-DDTHH:mm:ss");
                    // var endDateTime = endDate[0] + "T" + endDate[1];

                    var customerInfo = item.Customer_Name;

                    eventsArray.push({
                        title: customerInfo,
                        textEscape: true,
                        start: startDateTime,
                        end: endDateTime,
                        Type: item.Type
                    });
                }
                //  }
            });
        }
    }

    function eventInit() {

        var minTimeVal = "07:00:00";

        var maxTimeVal = "24:00:00";

        $("fc-left").addClass("col-md-4");

        $('#calendar').fullCalendar({
            customButtons: {
                monthButton: {
                    text: 'month',
                    click: function () {
                        $scope.showMonth = true;
                    }
                },
                myCalendar: {
                    text: 'My Calendar',
                    click: function (item) {
                        $state.go('myTask');
                    }
                },
                myTask: {
                    text: 'My Field Job',
                    click: function () {

                        $rootScope.apicall = true;

                        $rootScope.apicall = false;

                        $state.go("myFieldJob");

                        $rootScope.tabClicked = true;

                        $rootScope.selectedItem = 2;
                    }
                }
            },
            header: {
                left: 'myCalendar,myTask',
                right: 'prev,title,next today',
                center: 'agendaWeek,agendaDay,month'
            },
            //defaultDate: '2017-09-12',
            defaultView: 'agendaWeek',
            navLinks: true,
            editable: false,
            eventLimit: true,
            views: {
                month: {
                    eventLimit: 2
                }
            },
            allDaySlot: false,
            minTime: minTimeVal,
            maxTime: maxTimeVal,
            events: eventsArray,
            eventClick: function (event, jsEvent, view) {

                //console.log("EVENT " + JSON.stringify(event));

                $rootScope.selectedTask = event;

                valueService.setTask(event);

                $rootScope.selectedItem = 3;

                $rootScope.showTaskDetail = true;

                if (event.Task_Status == 'Field Job Completed' || event.Task_Status == 'Completed') {

                    $scope.showStartWork = false;
                    $scope.showDebriefBtn = true;
                    $rootScope.showAccept = false;
                    $rootScope.completedTask = true;

                    $state.go('debrief');

                }
                else if (event.Task_Status == 'Assigned')
                {
                    $scope.showStartWork = true;
                    $rootScope.showAccept = true;
                    $scope.showDebriefBtn = false;
                    $state.go('taskOverFlow');
                }
                else if (event.Task_Status == 'Accepted')
                {
                    $scope.showStartWork = true;
                    $scope.showDebriefBtn = true;
                    $rootScope.showAccept = false;
                    $state.go('taskOverFlow');
                }
                else if (event.Type == 'INTERNAL')
                {

                }
                else {

                    $state.go('taskOverFlow');
                }
            
            },
            eventRender: function (event, element) {

                if (event.Task_Status == 'Completed') {

                    element.addClass("completedEvent");

                } else if (event.Task_Status == 'Accepted') {

                    element.addClass("acceptedEvent");

                } else {

                    element.addClass("assignedEvent");
                }
            }
        });
    }

    $scope.goToDate = function () {

        console.log($scope.selectedDate);

        if ($scope.selectedDate) {

            var date = new Date($scope.selectedDate).toDateString("yyyy-MM-dd");

            $('#calendar').fullCalendar('gotoDate', date);
        }
    }

    $scope.today = function () {

        $scope.dt = new Date();
    };

    $scope.today();

    $scope.clear = function () {

        $scope.dt = null;
    };

    $scope.options = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };

    // Disable weekend selection
    /*function disabled(data) {
        var date = data.date,
        mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }*/

    $scope.toggleMin = function () {
        $scope.options.minDate = $scope.options.minDate ? null : new Date();
    };

    $scope.toggleMin();

    $scope.setDate = function (year, month, day) {

        $scope.dt = new Date(year, month, day);
    };

    var tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    var afterTomorrow = new Date(tomorrow);

    afterTomorrow.setDate(tomorrow.getDate() + 1);

    $scope.events = [{date: tomorrow, status: 'full'}, {date: afterTomorrow, status: 'partially'}];

    function getDayClass(data) {

        var date = data.date,
            mode = data.mode;

        if (mode === 'day') {

            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {

                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }

    $scope.onAcceptCall = function () {

        $state.go('Task Overflow');
    };

    $scope.query = {

        order: 'name',
        limit: 9,
        page: 1
    };

    $scope.changeSearch = function (data) {

        $scope.taskInput = data;
    };

    $scope.changeTaskStatus = function (taskStatus) {

        console.log(taskStatus);

        if (taskStatus == "All") {

            $scope.selectedTaskStatus = undefined;

        } else {

            $scope.selectedTaskStatus = taskStatus;
        }
    };

    $scope.getStatus = ["All", "Assigned", "Accepted", "Completed"];

    $scope.searchTask = function () {

        $scope.showSearchTaskDiv = !$scope.showSearchTaskDiv;
    };

    $scope.onclickOfTask = function (task) {

        console.log("TASK " + JSON.stringify(task));

        $scope.selectedTask = task;

        valueService.setTask(task);

        $rootScope.completedTask = false;

        $scope.notFutureDate = valueService.checkIfFutureDayTask(task);

        valueService.setIfFutureDateTask($scope.notFutureDate);

        switch (task.Task_Status) {

            case 'Field Job Completed':

                //$rootScope.showDebrief = true;
                //$rootScope.showTaskDetail = true;

                $scope.showStartWork = false;
                $scope.showDebriefBtn = true;
                $rootScope.showAccept = false;
                $rootScope.completedTask = true;

                break;

            case 'Completed':

                //$rootScope.showDebrief = true;
                //$rootScope.showTaskDetail = true;

                $scope.showStartWork = false;
                $scope.showDebriefBtn = true;
                $rootScope.completedTask = true;
                $rootScope.showAccept = false;

                break;

            case 'Assigned':

                //$rootScope.showDebrief = false;
                // $rootScope.showTaskDetail = true;

                $scope.showStartWork = true;
                $rootScope.showAccept = true;
                $scope.showDebriefBtn = false;

                break;

            case 'Accepted':

                //$rootScope.showDebrief = true;
                //$rootScope.showTaskDetail = true;

                $scope.showStartWork = true;
                $scope.showDebriefBtn = true;
                $rootScope.showAccept = false;

                break;

            default:
                break;
        }
    }

    $scope.calendarView = function () {

        $state.go('myTask');

        $rootScope.selectedItem = 1;
    };

    $scope.startWork = function () {

        $state.go('taskOverFlow');
    };

    $rootScope.showTaskOrDebrief = function (id) {

        $rootScope.selectedItem = id;

        $rootScope.selectedTask = $scope.selectedTask;

        if (id == 3) {

            $rootScope.showTaskDetail = true;

            $rootScope.selectedCategory = 'Field Job Overview';

        } else {

            $rootScope.showDebrief = true;

            $rootScope.selectedCategory = 'Field Job#' + $rootScope.selectedTask.Task_Number;

            $state.go('debrief');
        }
    }
});
