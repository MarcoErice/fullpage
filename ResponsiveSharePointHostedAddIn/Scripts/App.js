'use strict';
var RestUrl = "../_api/lists/getbytitle('Files')/items";
$(document).ready(function () {
    PopulateGrid();
    $('#fileFormSubmit').click(function (e) {
        //Check for edit or new and call update or add function
        if ($('#myModalLabel').html() == 'Add New Item') {
            addFile($('#fileTitle').val(), $('#fileName').val(), $('#fileType').val(), $('#team').val());
        } else {
            UpdateFiles($('#fileId').val());
        }
    });
});
function PopulateGrid() {
    //Clear datatables
    $('#FilesGrid').empty();
    //Get File list items
    $.ajax({
        url: RestUrl,
        method: "GET",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: function (data) {
            if (data.d.results.length > 0) {
                //construct HTML Table from the JSON Data
                $('#FilesGrid').append(GenerateTableFromJson(data.d.results));
                //Bind the HTML data with Jquery DataTable
                var oTable = $('#FilesTable').dataTable({
                    //control which datatable options available
                    dom: 'Bfrltip',
                    //add select functionality to datatable
                    select: true,
                    //adjust column widths
                    "columns": [
                    null,
                    null,
                    null,
                    null,
                    null,
                    { "width": "8%" }
                    ],
                    //remove sort icon from actions column
                    "aoColumnDefs": [
                    { "bSortable": false, "aTargets": [5] }
                    ]
                });
            } else {
                $('#FilesGrid').append("<span>No Files Found.</span>");
            }
        },
        error: function (data) {
            $('#FilesGrid').append("<span>Error Retreiving Item. Error : " + JSON.stringify(data) + "</span>");
        }
    });
};
//Generate html table values
function GenerateTableFromJson(objArray) {
    var tableContent =
        '<table id="FilesTable" class="table table-striped table-bordered" cellspacing="0" width="100%">' +
            '<thead><tr>' + '<th>ID</th>' + '<th>Title</th>' + '<th>FileName</th>' + '<th>FileType</th>' +
            '<th>Team</th>' + '<th>Actions</th>' + '</tr></thead>';
    for (var i = 0; i < objArray.length; i++) {
        tableContent += '<tr>';
        tableContent += '<td>' + objArray[i].Id + '</td>';
        tableContent += '<td>' + objArray[i].Title + '</td>';
        tableContent += '<td>' + objArray[i].FileName + '</td>';
        tableContent += '<td>' + objArray[i].FileType + '</td>';
        tableContent += '<td>' + objArray[i].Team + '</td>';
        tableContent += "<td><a id='" + objArray[i].Id + "' href='#' style='color: orange' class='confirmEditFileLink'>" +
            "<i class='glyphicon glyphicon-pencil' title='Edit Item'></i></a>&nbsp&nbsp";
        tableContent += "<a id='" + objArray[i].Id + "' href='#' style='color: red' class='confirmDeleteFileLink'>" +
            "<i class='glyphicon glyphicon-remove' title='Delete File'></i></a>&nbsp&nbsp";
        tableContent += "<a id='" + objArray[i].Id + "' href='#' class='confirmListItemDetailsLink'>" +
            "<i class='glyphicon glyphicon-cog' title='Link to List Item'></i></a></td>";
        tableContent += '</tr>';
    }
    return tableContent;
};
// Edit button click event
$(document).on('click', '.confirmEditFileLink', function (e) {
    e.preventDefault();
    var id = this.id;
    var requestUri = "../_api/web/lists/getByTitle('Files')/items(" + id + ")";
    $.ajax({
        url: requestUri,
        method: "GET",
        contentType: "application/json;odata=verbose",
        headers: { "accept": "application/json;odata=verbose" },
        success: function (data) {
            $('#fileTitle').val(data.d.Title);
            $('#fileName').val(data.d.FileName);
            $('#fileType').val(data.d.FileType);
            $('#team').val(data.d.Team);
            $('#fileId').val(data.d.Id);
            $('#myModalLabel').html('Edit Item');
            $('#myModalNorm').modal('show');
            $("#etag").val(data.d.__metadata.etag);
        }
    });
});
//Link to files list item
$(document).on('click', '.confirmListItemDetailsLink', function (e) {
    e.preventDefault();
    var id = this.id;
    var requestUri = "../Lists/Files/DispForm.aspx?ID=" + id;
    window.location.href = requestUri;
});
// Delete button click event
$(document).on('click', '.confirmDeleteFileLink', function (e) {
    e.preventDefault();
    var id = this.id;
    BootstrapDialog.show({
        size: BootstrapDialog.SIZE_SMALL,
        type: BootstrapDialog.TYPE_DANGER,
        title: "Delete confirmation",
        message: "Are you sure you want to Delete this Item?",
        buttons: [
            {
                label: "Confirm",
                cssClass: 'btn-primary',
                action: function (dialog) {
                    dialog.close();
                    var restUrl = "../_api/web/lists/GetByTitle('Files')/items(" + id + ")";
                    jQuery.ajax({
                        url: restUrl,
                        type: "DELETE",
                        headers: {
                            Accept: "application/json;odata=verbose",
                            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                            "IF-MATCH": "*"
                        }
                    });
                    toastr.success("Successfully Deleted.", "Success");
                    PopulateGrid();
                }
            },
            {
                label: "Cancel",
                action: function (dialog) {
                    dialog.close();
                }
            }
        ]
    });
});
//Update Model Label
function updateFormLabel() {
    $('#myModalLabel').html('Add New Item');
};
//Populate then display model dialog for add file button clicked
function addNewFile() {
    $('#myModalLabel').html('Add New Item');
    $('#fileTitle').val('');
    $('#fileName').val('');
    $('#fileType').val('');
    $('#team').val('');
    $('#fileId').val('');
    $('#myModalNorm').modal('show');
};
//Edit item function
function UpdateFiles(id) {
    var fileTitle = $("#fileTitle").val();
    var fileName = $("#fileName").val();
    var fileType = $("#fileType").val();
    var team = $("#team").val();
    var eTag = $("#etag").val();
    var requestUri = "../_api/web/lists/getByTitle('Files')/items(" + id + ")";
    var requestHeaders = {
        "accept": "application/json;odata=verbose",
        "X-HTTP-Method": "MERGE",
        "X-RequestDigest": $('#__REQUESTDIGEST').val(),
        "If-Match": eTag
    }
    var fileData = {
        __metadata: { "type": "SP.Data.FilesListItem" },
        Title: fileTitle,
        FileName: fileName,
        FileType: fileType,
        Team: team
    };
    var requestBody = JSON.stringify(fileData);

    return $.ajax({
        url: requestUri,
        type: "POST",
        contentType: "application/json;odata=verbose",
        headers: requestHeaders,
        data: requestBody
    });
}
//Add File function
var addFile = function (fileTitle, fileName, fileType, team) {
    var requestUri = "../_api/web/lists/getByTitle('Files')/items";
    var requestHeaders = {
        "accept": "application/json;odata=verbose",
        "content-type": "application/json;odata=verbose",
        "X-RequestDigest": $('#__REQUESTDIGEST').val()
    }
    var fileData = {
        __metadata: { "type": "SP.Data.FilesListItem" },
        Title: fileTitle,
        FileName: fileName,
        FileType: fileType,
        Team: team
    };
    var requestBody = JSON.stringify(fileData);
    return $.ajax({
        url: requestUri,
        type: "POST",
        headers: requestHeaders,
        data: requestBody
    });

};