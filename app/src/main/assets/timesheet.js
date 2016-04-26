//variables
var Messages = {
    ErrorInStablishingServerConnection: "خطا در برقراری ارتباط با سرور",
    PleaseWait: "لطفا صبر کنید...",
    EntryHourIsEmpty: "زمان ورود وارد نشده است",
    ExitHourIsEmpty: "زمان خروج وارد نشده است",
    DeleteTimeSheetIsSuccessful: "کارکرد مورد نظر حذف گردید",
};

var Captions = {
    SearchTimeSheet: "جستجوی ساعت کارکرد",
    RegisterTimeSheet: "ثبت کارکرد",
    DeleteTimeSheet: "حذف کارکرد",
};

//general
function FillSelector(selectMode, id, items, value) {
    try {

        //remove all previous options
        $('#' + id + ' option').remove();

        var html = "";
        $.each(items, function (i, item) {
            html += "<option value='" + item.Value + "'>" + item.Text + "</option>";
        });
        $('#' + id).append(html);

        switch (selectMode) {
            case 'FIRST':
                $('#' + id).val($('#' + id + ' option:first').val());
                break;
            case 'LAST':
                $('#' + id).val($('#' + id + ' option:last').val());
                break;
            case 'VALUE':
                $('#' + id).val(value);
                break;
        }
    } catch (e) {
        console.log(e);
    }
};

function ToString(item) {
    try {
        var strObj = "";
        strObj += " AccountId='" + item.AccountId + "'";
        strObj += " Year='" + item.Year + "'";
        strObj += " Month='" + item.Month + "'";
        strObj += " Day='" + item.Day + "'";
        strObj += " WeekDay='" + item.WeekDay + "'";
        strObj += " WeekDayDescription='" + item.WeekDayDescription + "'";
        strObj += " ProjectId='" + item.ProjectId + "'";
        strObj += " ProjectName='" + item.ProjectName + "'";
        strObj += " TaskId='" + item.TaskId + "'";
        strObj += " EntryHour='" + item.EntryHour + "'";
        strObj += " EntryMinute='" + item.EntryMinute + "'";
        strObj += " EntryTime='" + item.EntryTime + "'";
        strObj += " ExitHour='" + item.ExitHour + "'";
        strObj += " ExitMinute='" + item.ExitMinute + "'";
        strObj += " ExitTime='" + item.ExitTime + "'";
        strObj += " IsApproved='" + item.IsApproved + "'";
        strObj += " IsMission='" + item.IsMission + "'";
        strObj += " WorkHour='" + item.WorkHour + "'";
        strObj += " WorkMinute='" + item.WorkMinute + "'";
        strObj += " WorkTime='" + item.WorkTime + "'";
        strObj += " ";
        return strObj;
    } catch (e) {
        console.log(e);
    }
};

function ShowMessage(mode, message) {

    $('#divMessage').removeClass('hidden');
    $('#divMessage').removeClass('visible');
    $('#divMessage').removeClass('alert-warning');
    $('#divMessage').removeClass('alert-success');
    $('#divMessage').removeClass('alert-info');

    switch (mode) {
        case 'RESET':
            $('#divMessage').addClass('hidden');
            $('#divMessage').text("");

            $('html,body').animate({ scrollTop: 0 }, 'fast'); //page exception
            return;
        case 'WARNING':
            $('#divMessage').addClass('alert-warning');
            break;
        case 'INFO':
            $('#divMessage').addClass('alert-info');
            break;
        case 'SUCCESS':
            $('#divMessage').addClass('alert-success');
            break;
    };

    $('#divMessage').text(message);
    $('#divMessage').addClass('visible');
};

function SwitchPage(mode) {

    $('#divSearch').addClass("hidden");
    $('#divEdit').addClass("hidden");
    $('#divDelete').addClass("hidden");
    $('#divHeader').text("");

    switch (mode) {
        case 'SEARCH':
            $('#divSearch').removeClass("hidden");
            $('#divHeader').text(Captions.SearchTimeSheet);
            break;
        case 'EDIT':
            $('#divEdit').removeClass("hidden");
            $('#divHeader').text(Captions.RegisterTimeSheet);
            break;
        case 'DELETE':
            $('#divDelete').removeClass("hidden");
            $('#divHeader').text(Captions.DeleteTimeSheet);
            break;
    };
};

function SuspendPage(mode, value) {
    console.log(mode + ' ' + value);
    switch (mode) {
        case 'SEARCH':
            if (value == true) {
                $('#btnSearch').attr("disabled", "disabled");
                $('#ddlMonth').attr("disabled", "disabled");
                $('#ddlYear').attr("disabled", "disabled");
            }

            if (value == false) {
                $('#btnSearch').removeAttr("disabled");
                $('#ddlMonth').removeAttr("disabled");
                $('#ddlYear').removeAttr("disabled");
            }
            break;
        case 'EDIT':
            if (value == true) {
                $('#ddlProjectYear').attr("disabled", "disabled");
                $('#ddlProjectGroup').attr("disabled", "disabled");
                $('#ddlProject').attr("disabled", "disabled");
                $('#ddlEntryMinute').attr("disabled", "disabled");
                $('#ddlEntryHour').attr("disabled", "disabled");
                $('#ddlExitMinute').attr("disabled", "disabled");
                $('#ddlExitHour').attr("disabled", "disabled");
                $('#chkMission').attr("disabled", "disabled");
                $('#btnRegister').attr("disabled", "disabled");
                $('#btnBack').attr("disabled", "disabled");
            }

            if (value == false) {
                $('#ddlProjectYear').removeAttr("disabled");
                $('#ddlProjectGroup').removeAttr("disabled");
                $('#ddlProject').removeAttr("disabled");
                $('#ddlEntryMinute').removeAttr("disabled");
                $('#ddlEntryHour').removeAttr("disabled");
                $('#ddlExitMinute').removeAttr("disabled");
                $('#ddlExitHour').removeAttr("disabled");
                $('#chkMission').removeAttr("disabled");
                $('#btnRegister').removeAttr("disabled");
                $('#btnBack').removeAttr("disabled");
            }
            break;
        case 'DELETE':
            break;
    }
};

function Select(token, userId, calendarId, year, month) {

    SuspendPage('SEARCH', true);

    //calling ajax function
    var request = $.ajax({
        method: "GET",
        url: dal.url + "sheet?token=" + token + "&userId=" + userId + "&calendarId=" + calendarId + "&year=" + year + "&month=" + month,
        jsonpCallback: "timesheet",
        dataType: "jsonp",
        async: false
    });

    request.done(function (data, status, request) {

        try {
            $('#resultBody').find('tr').remove();

            if (data == null || data.length == 0) {
                var html = "<tr>";
                html += "       <td colspan='9' class='noresult'>";
                html += "           رکوردی یافت نگردید.";
                html += "       </td>";
                html += "   </tr>";

                $('#resultBody').append(html);
                return;
            }

            $.each(data, function (i, item) {

                var html = "<tr" + ToString(item) + ">";
                html += "       <td>";
                html += "           <img src='images/pen.png' />";
                html += "       </td>";
                html += "       <td>";
                html += "           <img src='images/garbage.png' />";
                html += "       </td>";
                html += "       <td>";
                html += item.Day
                html += "       </td>";
                html += "       <td>";
                html += item.WeekDayDescription;
                html += "       </td>";
                html += "       <td>";
                html += item.ProjectName;
                html += "       </td>";
                html += "       <td>";
                html += item.EntryTime;
                html += "       </td>";
                html += "       <td>";
                html += item.ExitTime;
                html += "       </td>";
                html += "       <td>";
                html += item.WorkTime;
                html += "       </td>";
                html += "       <td>";
                if (item.IsMission == true) {
                    html += "<img src='images/check.png' />";
                }
                html += "       </td>";
                html += "   </tr>";

                $('#resultBody').append(html);
            });

            //click all edit buttons
            $('#resultBody tr img').each(function (i, item) {

                if (item.src.indexOf("pen.png") > 0) {
                    $(item).click(Edit_RowCommand);
                }

                if (item.src.indexOf("garbage.png") > 0) {
                    $(item).click(Delete_RowCommand);
                }
            });
        } catch (e) {
            console.log(e);
        }
    });

    request.fail(function () {
        console.log('search methods fails');
        ShowMessage('WARNING', Messages.ErrorInStablishingServerConnection);
    });

    request.always(function () {
        SuspendPage('SEARCH', false);
    });
};

function FillSearchYear(token, userId, calendarId) {

    SuspendPage('SEARCH', true);

    var request = $.ajax({
        method: "GET",
        url: dal.url + "option",
        jsonpCallback: "option",
        dataType: "jsonp",
        timeout: 5000,
        data: { mode: 'AllYearsOfCalendar', token: token, userId: userId, calendarId: calendarId, year: 0, group: 0 },
        async: false
    });

    request.done(function (data, status, request) {
        FillSelector('LAST', 'ddlYear', data, null);
    });

    request.fail(function (e) {
        console.log(e);
        ShowMessage('WARNING', Messages.ErrorInStablishingServerConnection);
    });

    request.always(function () {
        SuspendPage('SEARCH', false);
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////EVENTS//////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

function Page_Load() {
    try {

        ShowMessage('RESET', '');

        //loading previous loggined user session if exists
        //if (typeof (dataAccess) != 'undefined')
        //    dal.authenticatedUser = dataAccess.isExistSession();
        //else
        //    dal.authenticatedUser = null;

        //display help message to user
        var html = "<tr>";
        html += "       <td colspan='5' class='noresult'>";
        html += "           سال و ماه مورد نظر را خود را انتخاب نمایید.";
        html += "       </td>";
        html += "   </tr>";
        $('#resultBody').append(html);

        SwitchPage('SEARCH');

        //loading year combo
        FillSearchYear(dal.authenticatedUser.Token, dal.authenticatedUser.Id, dal.authenticatedUser.CalendarId);
    } catch (e) {
        console.log(e);
    }
};

function btnSearch_Click() {
    try {

        ShowMessage('RESET', '');

        var year = $('#ddlYear').val();
        var month = $('#ddlMonth').val();

        //loading session temporary
        Select(dal.authenticatedUser.Token, dal.authenticatedUser.Id, dal.authenticatedUser.CalendarId, year, month);

    } catch (e) {
        console.log(e);
    }
};

function Edit_RowCommand() {
    try {

        ShowMessage('RESET', '');

        //get row ids
        var projectId = $(this).parents('tr').attr('projectId');
        var year = $(this).parents('tr').attr('year');
        var month = $(this).parents('tr').attr('month');
        var day = $(this).parents('tr').attr('day');
        var taskId = $(this).parents('tr').attr('taskId');

        $('#ProjectId').val(projectId);
        $('#Year').val(year);
        $('#Month').val(month);
        $('#Day').val(day);
        $('#TaskId').val(taskId);

        //new record
        if (projectId == "0") {

            //clear page
            $("#ddlProjectYear").val("-1");
            $("#ddlProjectGroup").val("-1");
            $("#ddlProject").val("");
            $("#ddlEntryHour").val("00");
            $("#ddlEntryMinute").val("00");
            $("#ddlExitHour").val("00");
            $("#ddlExitMinute").val("00");
            $('#chkMission').val("");

            SuspendPage('EDIT', true);

            //Project Years
            var request = $.ajax({
                method: "GET",
                url: dal.url + "option",
                jsonpCallback: "option",
                dataType: "jsonp",
                timeout: 5000,
                data: { mode: 'AllProjectYears', token: dal.authenticatedUser.Token, userId: dal.authenticatedUser.Id, calendarId: 0, year: 0, group: 0 }
            });

            request.done(function (data, status, request) {

                FillSelector('VALUE', 'ddlProjectYear', data, year);

                ////continue...Project Groups
                var request = $.ajax({
                    method: "GET",
                    url: dal.url + "option",
                    jsonpCallback: "option",
                    dataType: "jsonp",
                    timeout: 5000,
                    data: { mode: 'AllProjectGroups', token: dal.authenticatedUser.Token, userId: dal.authenticatedUser.Id, calendarId: 0, year: 0, group: 0 }
                });

                request.done(function (data, status, request) {

                    FillSelector('FIRST', 'ddlProjectGroup', data, "-1");

                    ////continue...Projects
                    var request = $.ajax({
                        method: "GET",
                        url: dal.url + "option",
                        jsonpCallback: "option",
                        dataType: "jsonp",
                        timeout: 5000,
                        data: { mode: 'ProjectsOfYearAndGroup', token: dal.authenticatedUser.Token, userId: dal.authenticatedUser.Id, calendarId: 0, year: year, group: -1 }
                    });

                    request.done(function (data, status, request) {

                        FillSelector('FIRST', 'ddlProject', data, 0);

                    });

                    request.fail(function (e) {
                        console.log(e);
                        warning(Messages.ErrorInStablishingServerConnection);

                    });

                    request.always(function () {
                        SuspendPage('EDIT', false);
                    });
                });

                request.fail(function (e) {
                    console.log(e);
                    ShowMessage('WARNING', Messages.ErrorInStablishingServerConnection);
                    SuspendPage('EDIT', false);
                });
            });

            request.fail(function (e) {
                console.log(e);
                ShowMessage('WARNING', Messages.ErrorInStablishingServerConnection);
                SuspendPage('EDIT', false);
            });
        }

            //edit record
        else if (projectId != "0") {
            var tr = $("#resultBody tr[projectId=" + projectId + "][day=" + day + "][taskId=" + taskId + "]");

            var entryHour = tr.attr('entryHour');
            var entryMinute = tr.attr('entryMinute');
            var exitHour = tr.attr('exitHour');
            var exitMinute = tr.attr('exitMinute');
            var isMission = tr.attr('isMission');

            $("#ddlEntryHour").val(utility.toDoubleO(entryHour));
            $("#ddlEntryMinute").val(utility.toDoubleO(entryMinute));
            $("#ddlExitHour").val(utility.toDoubleO(exitHour));
            $("#ddlExitMinute").val(utility.toDoubleO(exitMinute));

            if (isMission == "true") {
                $('#chkMission').val("on");
            }

            //FillEditCombos("93AE8F6D-DEAD-4B20-B9A4-02A062F87971", 1071, year, projectId);
            SuspendPage('EDIT', true);

            //Project Years
            var request = $.ajax({
                method: "GET",
                url: dal.url + "option",
                jsonpCallback: "option",
                dataType: "jsonp",
                timeout: 5000,
                data: { mode: 'AllProjectYears', token: dal.authenticatedUser.Token, userId: dal.authenticatedUser.Id, calendarId: 0, year: 0, group: 0 }
            });

            request.done(function (data, status, request) {

                FillSelector('VALUE', 'ddlProjectYear', data, year);

                ////continue...Project Groups
                var request = $.ajax({
                    method: "GET",
                    url: dal.url + "option",
                    jsonpCallback: "option",
                    dataType: "jsonp",
                    timeout: 5000,
                    data: { mode: 'AllProjectGroups', token: dal.authenticatedUser.Token, userId: dal.authenticatedUser.Id, calendarId: 0, year: 0, group: 0 }
                });

                request.done(function (data, status, request) {

                    FillSelector('FIRST', 'ddlProjectGroup', data, "-1");

                    ////continue...Projects
                    var request = $.ajax({
                        method: "GET",
                        url: dal.url + "option",
                        jsonpCallback: "option",
                        dataType: "jsonp",
                        timeout: 5000,
                        data: { mode: 'ProjectsOfYearAndGroup', token: dal.authenticatedUser.Token, userId: dal.authenticatedUser.Id, calendarId: 0, year: year, group: -1 }
                    });

                    request.done(function (data, status, request) {

                        FillSelector('VALUE', 'ddlProject', data, projectId);

                    });

                    request.fail(function (e) {
                        console.log(e);
                        warning(Messages.ErrorInStablishingServerConnection);

                    });

                    request.always(function () {
                        SuspendPage('EDIT', false);
                    });
                });

                request.fail(function (e) {
                    console.log(e);
                    ShowMessage('WARNING', Messages.ErrorInStablishingServerConnection);
                    SuspendPage('EDIT', false);
                });
            });

            request.fail(function (e) {
                console.log(e);
                ShowMessage('WARNING', Messages.ErrorInStablishingServerConnection);
                SuspendPage('EDIT', false);
            });
        }

        SwitchPage('EDIT');
        $('#divHeader').text("ثبت کارکرد - " + day + " " + utility.toPersianMonth(month) + " " + year);

    } catch (e) {
        console.log(e);
    }
};

function Delete_RowCommand() {
    try {

        ShowMessage('RESET', '');

        //get row ids
        var projectId = $(this).parents('tr').attr('projectId');
        var year = $(this).parents('tr').attr('year');
        var month = $(this).parents('tr').attr('month');
        var day = $(this).parents('tr').attr('day');
        var taskId = $(this).parents('tr').attr('taskId');

        $('#ProjectId').val(projectId);
        $('#Year').val(year);
        $('#Month').val(month);
        $('#Day').val(day);
        $('#TaskId').val(taskId);

        //new record
        if (projectId == "0") {
            //do nothing
        }
        else if (projectId != "0") {

            SwitchPage('DELETE');
            $('#spanDeleteMessage').text("آیا از حذف کارکرد مربوط به روز " + day + " " + utility.toPersianMonth(month) + " " + year + " اطمینان دارید؟");
            $('#divHeader').text("حذف کارکرد - " + day + " " + utility.toPersianMonth(month) + " " + year);
        }

    } catch (e) {
        console.log(e);
    }
};


function btnBack_Click() {
    try {

        ShowMessage('RESET', '');

        SwitchPage('SEARCH');
    } catch (e) {
        console.log(e);
    }
};

function btnRegister_Click() {
    try {

        ShowMessage('RESET', '');

        //grab tr
        var projectId = $('#ProjectId').val();
        var year = $('#Year').val();
        var month = $('#Month').val();
        var day = $('#Day').val();
        var taskId = $('#TaskId').val();

        var tr = $("#resultBody tr[projectId=" + projectId + "][day=" + day + "][taskId=" + taskId + "]");

        //get user entries
        var weekdayDescription = tr.attr('weekdayDescription');
        var entryHour = parseInt($("#ddlEntryHour").val(), null);
        var entryMinute = parseInt($("#ddlEntryMinute").val(), null);
        var entryTime = utility.toTime(entryHour, entryMinute);
        var exitHour = parseInt($("#ddlExitHour").val(), null);
        var exitMinute = parseInt($("#ddlExitMinute").val(), null);
        var exitTime = utility.toTime(exitHour, exitMinute);
        var workHour = utility.round((exitHour * 60 + exitMinute - entryHour * 60 - entryMinute) / 60, 0, 'HALF_DOWN');
        var workMinute = (exitHour * 60 + exitMinute - entryHour * 60 - entryMinute) % 60;
        var workTime = utility.toDoubleO(workHour) + ":" + utility.toDoubleO(workMinute);
        var projectGroupId = $("#ddlProjectGroup").val();
        var projectGroupName = $("#ddlProjectGroup").text();
        var projectId = $("#ddlProject").val();
        var projectName = $("#ddlProject option:selected").text();
        var isMission = $('#chkMission').val() == "on";

        //emptiness
        if (entryHour == 0 && entryMinute == 0) {
            ShowMessage('WARNING', Messages.EntryHourIsEmpty);
            return;
        }
        else if (exitHour == 0 && exitMinute == 0) {
            ShowMessage('WARNING', Messages.ExitHourIsEmpty);
            return;
        }

        //set new attributes
        tr.attr('projectId', projectId);
        tr.attr('projectName', projectName);
        //tr.attr('taskId', '0');
        tr.attr('entryHour', entryHour);
        tr.attr('entryMinute', entryMinute);
        tr.attr('entryTime', entryTime);
        tr.attr('exitHour', exitHour);
        tr.attr('exitMinute', exitMinute);
        tr.attr('exitTime', exitTime);
        tr.attr('isApproved', 'false');
        tr.attr('isMission', 'false');
        tr.attr('workHour', workHour);
        tr.attr('workMinute', workMinute);
        tr.attr('workTime', workMinute);


        //remove old td
        tr.find('td').remove();

        //insert new tds
        var html = "       <td>";
        html += "           <img src='images/pen.png' />";
        html += "       </td>";
        html += "       <td>";
        html += "           <img src='images/garbage.png' />";
        html += "       </td>";
        html += "       <td>";
        html += day;
        html += "       </td>";
        html += "       <td>";
        html += weekdayDescription;
        html += "       </td>";
        html += "       <td>";
        html += projectName;
        html += "       </td>";
        html += "       <td>";
        html += entryTime;
        html += "       </td>";
        html += "       <td>";
        html += exitTime;
        html += "       </td>";
        html += "       <td>";
        html += workTime;
        html += "       </td>";
        html += "       <td>";
        if (isMission == true) {
            html += "<img src='images/check.png' />";
        }
        html += "       </td>";

        tr.append(html);

        //inject event to command buttons
        $("#resultBody tr[projectId=" + projectId + "][day=" + day + "][taskId=" + taskId + "] img").each(function (i, item) {

            if (item.src.indexOf("pen.png") > 0) {
                $(item).click(Edit_RowCommand);
            }

            if (item.src.indexOf("garbage.png") > 0) {
                $(item).click(Delete_RowCommand);
            }

        });

        SwitchPage('SEARCH');

    } catch (e) {
        console.log(e);
    }
};

function btnConfirmDelete_Click() {
    try {

        ShowMessage('RESET', '');

        var projectId = $('#ProjectId').val();
        var day = $('#Day').val();
        var taskId = $('#TaskId').val();

        var tr = $("#resultBody tr[projectId=" + projectId + "][day=" + day + "][taskId=" + taskId + "]");

        tr.attr('projectId', '0');
        tr.attr('projectName', '');
        tr.attr('taskId', '0');
        tr.attr('entryHour', '0');
        tr.attr('entryMinute', '0');
        tr.attr('entryTime', '00:00');
        tr.attr('exitHour', '0');
        tr.attr('exitMinute', '0');
        tr.attr('exitTime', '00:00');
        tr.attr('isApproved', 'false');
        tr.attr('isMission', 'false');
        tr.attr('workHour', '0');
        tr.attr('workMinute', '0');
        tr.attr('workTime', '00:00');

        tr.find('td').remove();

        var html = "       <td colspan='5'>";
        html += day + " " + tr.attr('WeekDayDescription');
        html += "           <img src='images/pen.png' />";
        html += "           <img src='images/garbage.png' />";
        html += "       </td>";

        var html = "       <td>";
        html += "           <img src='images/pen.png' />";
        html += "       </td>";
        html += "       <td>";
        html += "           <img src='images/garbage.png' />";
        html += "       </td>";
        html += "       <td>";
        html += day
        html += "       </td>";
        html += "       <td>";
        html += tr.attr('WeekDayDescription');
        html += "       </td>";
        html += "       <td>";
        html += "       </td>";
        html += "       <td>";
        html += "       </td>";
        html += "       <td>";
        html += "       </td>";
        html += "       <td>";
        html += "       </td>";
        html += "       <td>";
        html += "       </td>";

        tr.append(html);

        //inject event to command buttons
        $("#resultBody tr[projectId=0][day=" + day + "][taskId=0] img").each(function (i, item) {

            if (item.src.indexOf("pen.png") > 0) {
                $(item).click(Edit_RowCommand);
            }

            if (item.src.indexOf("garbage.png") > 0) {
                $(item).click(Delete_RowCommand);
            }
        });

        SwitchPage('SEARCH');
        ShowMessage('INFO', Messages.DeleteTimeSheetIsSuccessful);
    } catch (e) {
        console.log(e);
    }
};

function btnCancelDelete_Click(e) {
    try {
        ShowMessage('RESET', '');

        SwitchPage('SEARCH');
    } catch (e) {
        console.log(e);
    }
};

function ddlProjectYear_Change(e) {
    try {

        ShowMessage('RESET', '');
        SuspendPage('EDIT', true);

        var year = $('#ddlProjectYear').val();

        ////continue...Project Groups
        var request = $.ajax({
            method: "GET",
            url: dal.url + "option",
            jsonpCallback: "option",
            dataType: "jsonp",
            timeout: 5000,
            data: { mode: 'AllProjectGroups', token: dal.authenticatedUser.Token, userId: dal.authenticatedUser.Id, calendarId: 0, year: year, group: 0 }
        });

        request.done(function (data, status, request) {

            FillSelector('FIRST', 'ddlProjectGroup', data, null);

            ////continue...Projects
            var request = $.ajax({
                method: "GET",
                url: dal.url + "option",
                jsonpCallback: "option",
                dataType: "jsonp",
                timeout: 5000,
                data: { mode: 'ProjectsOfYearAndGroup', token: dal.authenticatedUser.Token, userId: dal.authenticatedUser.Id, calendarId: 0, year: year, group: -1 }
            });

            request.done(function (data, status, request) {

                FillSelector('FIRST', 'ddlProject', data, null);

            });

            request.fail(function (e) {
                console.log(e);
                warning(Messages.ErrorInStablishingServerConnection);

            });

            request.always(function () {
                SuspendPage('EDIT', false);
            });
        });

        request.fail(function (e) {
            console.log(e);
            ShowMessage('WARNING', Messages.ErrorInStablishingServerConnection);
            SuspendPage('EDIT', false);
        });

    } catch (e) {
        console.log(e);
    }
};

function ddlProjectGroup_Change(e) {
    try {

        ShowMessage('RESET', '');
        SuspendPage('EDIT', true);

        var year = $('#ddlProjectYear').val();
        var group = $('#ddlProjectGroup').val();

        ////continue...Projects
        var request = $.ajax({
            method: "GET",
            url: dal.url + "option",
            jsonpCallback: "option",
            dataType: "jsonp",
            timeout: 5000,
            data: { mode: 'ProjectsOfYearAndGroup', token: dal.authenticatedUser.Token, userId: dal.authenticatedUser.Id, calendarId: 0, year: year, group: group }
        });

        request.done(function (data, status, request) {

            FillSelector('FIRST', 'ddlProject', data, null);

        });

        request.fail(function (e) {
            console.log(e);
            warning(Messages.ErrorInStablishingServerConnection);
        });

        request.always(function () {
            SuspendPage('EDIT', false);
        });
    } catch (e) {
        console.log(e);
    }
};

//initializations
$(document).ready(Page_Load);
$('#btnSearch').click(btnSearch_Click);
$('#btnBack').click(btnBack_Click);
$('#btnRegister').click(btnRegister_Click);
$('#btnConfirmDelete').click(btnConfirmDelete_Click);
$('#btnCancelDelete').click(btnCancelDelete_Click);
$('#ddlProjectYear').change(ddlProjectYear_Change);
$('#ddlProjectGroup').change(ddlProjectGroup_Change);
