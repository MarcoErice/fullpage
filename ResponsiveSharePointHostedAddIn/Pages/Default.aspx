<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <!-- CSS styles added to the following file -->
    <link type="text/css" href="../Content/App.css" rel="Stylesheet"/>
    <link type="text/css" href="../Content/toastr.css" rel="stylesheet" />
    <link type="text/css" href="../Content/bootstrap.css" rel="stylesheet" />
    <link type="text/css" href="../Content/bootstrap-dialog.css" rel="stylesheet" />
    <link type="text/css" href="../Content/DataTables/css/select.bootstrap.min.css" rel="stylesheet" />
    <link type="text/css" rel="stylesheet" href="https://cdn.datatables.net/1.10.8/css/jquery.dataTables.css">
     <!-- javascript references added to the following file -->
    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="../Scripts/bootstrap.js"></script>
    <script type="text/javascript" src="../Scripts/bootstrap-dialog.js"></script>
    <script type="text/javascript" src="../Scripts/toastr.min.js"></script>
    <script type="text/javascript" src="../Scripts/App.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/1.10.8/js/jquery.dataTables.min.js"></script>
    <script type="text/javascript" src="../Scripts/DataTables/dataTables.select.min.js"></script>
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div class="container">
        <h1><span class="label label-primary">Favorite files</span></h1>
        <div id="toolbar">
            <button type="button" value="Files" class="btn btn-info" onclick="Javascript: location.href = '../Lists/Files'">
                <span class='glyphicon glyphicon-upload'></span>
                SP List
            </button>
            <button type="button" class="btn btn-success" onclick='addNewFile();'>
                <span class='glyphicon glyphicon-plus'></span>
                Add New Item
            </button>
        </div>
   <p></p>
 <div id="FilesPanel">
 <table style="width: 100%;">
 <tr>
     <td>
        <div id="FilesGrid" style="width: 100%"></div>
     </td>
 </tr>
 </table>
 </div>
 <!-- Bootstrap Modal Dialog-->
<div class="modal fade" id="myModalNorm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">
                       <span aria-hidden="true">&times;</span>
                       <span class="sr-only">Close</span>
                </button>
                <h4 class="modal-title" id="myModalLabel">
                    Add New Item
                </h4>
            </div>
            <!-- Modal Body -->
            <div class="modal-body" id="modalBody">
                <form role="form" id="fileForm">
                  <div class="form-group">
                    <label>Title</label>
                      <input class="form-control" id="fileTitle"/>
                  </div>
                  <div class="form-group">
                    <label>Name</label>
                      <input class="form-control" id="fileName"/>
                  </div>
                  <div class="form-group">
                    <label>File Type</label>
                      <input class="form-control" id="fileType"/>
                  </div>
                     <div class="form-group">
                    <label>Team</label>
                      <input class="form-control" id="team"/>
                  </div>
                      <!-- hidden controls -->
                  <div style="display: none">
                      <input id="etag" />
                      <input id="fileId" />
                  </div>
                  </form>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-danger" data-dismiss="modal" onclick='updateFormLabel();'>
                        Cancel
                      </button>
                      <button type="submit" class="btn btn-primary" id="fileFormSubmit">
                        Submit
                      </button>
                  </div>
            </div>
        </div>
    </div>
</div>
</div>
</asp:Content>
