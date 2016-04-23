//variables
var Messages = {
    EnterPersonalCodeAndPassword: "شماره پرسنلی و رمز عبور خود را وارد نمایید.",
    PersonelCodeIsNotValid: "شماره پرسنلی وارد شده معتبر نمی باشد.",
    PersonelCodeIsEmpty: "شماره پرسنلی وارد نشده است.",
    PasswordIsNotValid: "رمز عبور وارد شده معتبر نمی باشد.",
    PasswordIsEmpty: "رمز عبور وارد نشده است.",
    ErrorInStablishingServerConnection: "خطا در برقراری ارتباط با سرور",
    PleaseWait: "لطفا صبر کنید...",
    EntryHourIsEmpty: "زمان ورود وارد نشده است",
    ExitHourIsEmpty: "زمان خروج وارد نشده است",
    UserNameOrPasswordIsWrong: "نام کاربری و یا رمز عبور صحیح نمی باشد",
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

function SuspendPage(value) {
    if (value == true) {
        $('#txtUserName').attr("disabled", "disabled");
        $('#txtPassword').attr("disabled", "disabled");
        $('#btnLogin').attr("disabled", "disabled");
        $('#btnDirect').attr("disabled", "disabled");
    }
    if (value == false) {
        $('#txtUserName').removeAttr("disabled");
        $('#txtPassword').removeAttr("disabled");
        $('#btnLogin').removeAttr("disabled");
        $('#btnDirect').removeAttr("disabled");
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////EVENTS//////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

function Page_Load() {
    $("#txtUserName").val('1071');
    $("#txtPassword").val('2167');
};

function btnLogin_Click() {
    try {

        ShowMessage('RESET', null);

        //emptiness
        if (validation.isEmpty(txtUserName.value) == true) {
            ShowMessage('WARNING', Messages.PersonelCodeIsEmpty);
            return;
        }
        else if (validation.isEmpty(txtPassword.value) == true) {
            ShowMessage('WARNING', Messages.PasswordIsEmpty);
            return;
        }
            //validation
        else if (validation.matchPattern(txtUserName.value, "personalcode") == false) {
            ShowMessage('WARNING', Messages.PersonelCodeIsNotValid);
            return;
        }
        else if (validation.matchPattern(txtPassword.value, "password") == false) {
            ShowMessage('WARNING', Messages.PasswordIsNotValid);
            return;
        }

        ShowMessage('INFO', Messages.PleaseWait);

        SuspendPage(true);

        //calling ajax function
        var request = $.ajax({
            method: "GET",
            url: dal.url + "login?token=" + dal.token + "&userId=" + txtUserName.value + "&password=" + txtPassword.value,
            jsonpCallback: "login",
            dataType: "jsonp"
        });

        request.done(function (data, status, request) {
            if (status == "success" && data == null) {
                ShowMessage('WARNING', Messages.UserNameOrPasswordIsWrong);
            }
            else
            {
                dal.authenticatedUser = data;
                window.location = "timesheet.html";
            }
            
        });

        request.fail(function () {
            ShowMessage('WARNING', Messages.ErrorInStablishingServerConnection);
        });

        request.always(function () {
            SuspendPage(false);
        });
        
        //if (typeof (dataAccess) != 'undefined') {
        //    dataAccess.createSession(dal.authenticatedUser.Id,
        //                            dal.authenticatedUser.FullName,
        //                            dal.authenticatedUser.CalendarId,
        //                            dal.authenticatedUser.PositionId,
        //                            dal.authenticatedUser.IsManager,
        //                            dal.authenticatedUser.Address,
        //                            dal.authenticatedUser.IsNotified,
        //                            dal.authenticatedUser.Token,
        //                            dal.authenticatedUser.Roles[0].Role + "," + dal.authenticatedUser.Roles[1].Role);
        //}

    } catch (e) {
        console.log(e);
        ShowMessage('WARNING', e.message);
    }
};

function btnDirect_Click() {
    try {

        window.location = "timesheet.html";

    } catch (e) {
        console.log(e);
        ShowMessage('WARNING', e.message);
    }
};

//initialization
$(document).ready(Page_Load);
$('#btnLogin').click(btnLogin_Click);
$('#btnDirect').click(btnDirect_Click);