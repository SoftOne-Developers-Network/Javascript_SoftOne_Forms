//1. Add HTML to blob fields (function AddHTMLtoBlob)
//2. Get HTML data from blob fields (function GetHTMLFromBlob)
//The following example uses the object SOMAIL (Emails) and the blob field SOMAIL.SOBODY.

function GetHTMLFromBlob(TableName, FieldName) {
    var vdsTable = X.EXEC('CODE:ModuleIntf.GetDataSet', X.MODULE, TableName);
    var vBlobField = X.EXEC('CODE:ModuleIntf.GetField', vdsTable, FieldName);
    var vBlobPointer = X.EXEC('CODE:SOHTMLDOC.CreateDoc', 2, vBlobField);
    var strHTML = X.EXEC('CODE:SOHTMLDOC.GetDocHTMLPart', vBlobPointer);

    X.EXEC('CODE:SOHtmlDoc.DestroyDoc', vBlobPointer);
    return strHTML;
}

function AddHTMLtoBlob(strhtml, TableName, FieldName) {
    var vdsTable = X.EXEC('CODE:ModuleIntf.GetDataSet', X.MODULE, TableName);
    var vBlobField = X.EXEC('CODE:ModuleIntf.GetField', vdsTable, FieldName);
    X.EXEC('CODE:ModuleIntf.DatasetEdit', vdsTable);
    var vBlobPointer = X.EXEC('CODE:SOHTMLDOC.CreateDoc', 1, strhtml);
    var strHTML = X.EXEC('CODE:SOHTMLDOC.SaveDoctoBlob', vBlobPointer, vBlobField);
    X.EXEC('CODE:SOHtmlDoc.DestroyDoc', vBlobPointer);
}

function EXECCOMMAND(cmd) {
    if (cmd == 20151201)
        X.WARNING(GetHTMLFromBlob('SOMAIL', 'SOBODY'));
}


function ON_SOACTION_COMMENTS() {
    var myHTML;
    myHTML = '<HTML><HEAD><TITLE>My Page</TITLE> ' +
        '<META content="text/html; charset=utf-8" http-equiv=Content-Type> ' +
        '</HEAD><BODY> ' +
        '<span style="font-size:18px; font-family: Segoe UI;">HTML text added from code </span><br />' +
        '</BODY></HTML>';
    AddHTMLtoBlob(myHTML, 'SOMAIL', 'SOBODY');
}
