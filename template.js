function onBodyLoad() {
	document.addEventListener("deviceready", PhonegapLoaded, false);
}

/*
 * Adding template
 */
function PhonegapLoaded() {
	var homepageresult = document.getElementById('homepageresult');
	homepageresult.innerHTML = "Welcome to our PhoneGap Build Application";
	document.getElementById("addTemplateButton").addEventListener("click", addTemplate);
	//$("#homepageresult").trigger("create"); // zelf toegevoegd test
} // end phonegaploaded()
function addTemplate() {
	var db = window.openDatabase("greetings", "1.0", "Greetings Database", 1000000);
	db.transaction(tryAddingRow, errorAdding, rowAdded);
}
function tryAddingRow(tx) {
	var templateData = document.getElementById("templatedata").value;
	tx.executeSql('CREATE TABLE IF NOT EXISTS Templates (id INTEGER PRIMARY KEY AUTOINCREMENT, Template TEXT NOT NULL)');
	tx.executeSql('INSERT INTO Templates(Template) VALUES("'+ templateData + '")', rowAdded, errorAdding);
}
function rowAdded() {
	document.getElementById("addtemplateresult").innerHTML = "New Template successfully added";
	document.getElementById("templatedata").value = "";
}
function errorAdding(err) {
	document.getElementById("addtemplateresult").innerHTML = "Error occurred while adding template: " + err.code;
}

/*
 * List template
 */
function listTemplate() {
	var db = window.openDatabase("greetings", "1.0", "Greetings Database", 1000000);
	db.transaction(tryFetchingRows, errorFetchingRows);
}
function tryFetchingRows(tx) {
	tx.executeSql('SELECT * FROM Templates', [], successFetching, errorFetchingRows);
}
function successFetching(tx, result) {
	var templatesinfo = "";
	var len = result.rows.length;
	var listtemplateresult = document.getElementById("listtemplateresult");
	if (len>0) {
		templatesinfo += '<ul id = "listoftemplates" data-role = "listview" data-inset = "true" data-theme = "b">';
		for (var i=0; i<len; i++){
			templatesinfo += '<li>'+ result.rows.item(i).Template + '</li>';
		}
		templatesinfo += '</ul>';
		listtemplateresult.innerHTML = templatesinfo;	
	}
	else {
		listtemplateresult.innerHTML = "There are no templates defined";
	}
	$("#listtemplateresult").trigger("create");
}
function errorFetchingRows(err) {
	document.getElementById("listtemplateresult").innerHTML = "Error occurred while fetching templates: " + err.code;
}

/*
 * Delete template
 */
function deleteTemplates() {
	var db = window.openDatabase("greetings", "1.0", "Greetings Database", 1000000);
	db.transaction(fetchTemplatesToDelete, errorFetchingTemplateToDelete);
}
function fetchTemplatesToDelete(tx) {
	tx.executeSql('SELECT * FROM Templates', [], showTemplatesToDelete, errorFetchingTemplateToDelete);
}
function showTemplatesToDelete(tx, result) {
	var tempinfo = "";
	var len = result.rows.length;
	var deltemplateresult = document.getElementById("deltemplateresult");
	if(len>0) {
		tempinfo += 'Choose the templates to delete followed by Delete button<br/><br/>';
		tempinfo += '<div data-role = "fieldcontain">';
		tempinfo += '<fieldset data-role = "controlgroup">';
		for (var i=0;i<len;i++) {
			tempinfo += '<input type = "checkbox" name = "'+result.rows.item(i).id+'" id = "'+result.rows.item(i).id+'" value = "'+result.rows.item(i).id+'">';
			tempinfo += '<label for = "'+result.rows.item(i).id+'">'+result.rows.item(i).Template + '</label>';
		}
		tempinfo += '</fieldset>';
		tempinfo += '</div>';
		deltemplateresult.innerHTML = tempinfo;
	}
	else {
		deltemplateresult.innerHTML = "There are no templates defined";
	}
	$("#deltemplateresult").trigger("create");
}
function errorFetchingTemplateToDelete(err) {
	document.getElementById("deltemplateresult").innerHTML = "Error occurred while accessing templates: " + err.code;
}
function deleteTemplateFromTable() {
	var db = window.openDatabase("greetings", "1.0", "Greetings Database", 1000000);
	db.transaction(tryDeletingTemplates, errorDeletingTemplates);
}
function tryDeletingTemplates(tx) {
	var idsToDelete = "";
	var deldiv = document.getElementById("deltemplateresult").getElementsByTagName("INPUT");
	for (var i=0;i<deldiv.length;i++) {
		if (deldiv[i].type.toUpperCase() == 'CHECKBOX') {
			if(deldiv[i].checked)
				idsToDelete += deldiv[i].value+", ";
		}
	}
	if(idsToDelete.trim().length > 0) {
		idsToDelete = idsToDelete.substring(0, idsToDelete.length - 2);
		tx.executeSql('DELETE FROM Templates where id in (' +idsToDelete + ')', [], templatesDeleted, errorDeletingTemplates);
	}
	else {
		document.getElementById("deltemplateresult").innerHTML = "No template selected ";
	}
	$("#deltemplist").trigger("create");
}
function templatesDeleted() {
	document.getElementById("deltemplateresult").innerHTML = "Selected templates successfully deleted";
	$("#deltemplateresult").trigger("create");
}
function errorDeletingTemplates(err) {
	document.getElementById("deltemplateresult").innerHTML = "Error occurred while deleting templates: " + err.code;
}

/*
 * Edit template
 */
function editTemplate() {
        var db = window.openDatabase("greetings", "1.0", "Greetings Database", 1000000);
        db.transaction(fetchTemplatesToEdit, errorFetchingTemplatesToEdit);
}
function fetchTemplatesToEdit(tx) {
        tx.executeSql('SELECT * FROM Templates', [], displayingTemplatesToEdit, errorFetchingTemplatesToEdit);
}
function displayingTemplatesToEdit(tx, result) {
        var templistinfo = "";
        var len = result.rows.length;
        var edittemplateresult = document.getElementById("edittemplateresult");
        if (len > 0) {
            templistinfo += '<ul id = "ListofTemplates" data-role = "listview" data-inset = "true" data-theme = "b">';
            templistinfo += '<li data-role = "divider">Tap the templates to edit</li>';
            for (var i = 0; i<len; i++) {
                templistinfo += '<li><a id = "'+result.rows.item(i).id+'" href = "#templatemodificationform" onclick =\n\
                                "javascript:tryFetchingSelectedTemplate(' + result.rows.item(i).id +');">' + 
                                result.rows.item(i).Template + '</a></li>';
            }
            templistinfo += '</ul>';
            edittemplateresult.innerHTML = templistinfo;
        }
        else {
            edittemplateresult.innerHTML = "There are no templates defined";
        }
        $("#edittemplateresult").trigger("create");
} // end displayingTemplatesToEdit
function errorFetchingTemplatesToEdit(err) {
        document.getElementById("edittemplateresult").innerHTML = "Error occurred while accessing templates: " + err.code;
}
function tryFetchingSelectedTemplate(templateID) {
        var db = window.openDatabase("greetings", "1.0", "Greetings Database", 1000000);
        db.transaction(function(tx) {fetchSelectedTemplate(tx, templateID);}, errorFetchingSelectedTemplate);
}
function fetchSelectedTemplate(tx, templateID) {
        tx.executeSql('SELECT * FROM Templates where id in (' + templateID + ')', [], showSelectedTemplate, errorFetchingSelectedTemplate);
}
function showSelectedTemplate(tx, result) {
        var showtemplate = "";
        var len = result.rows.length;
        var modifytemplateresult = document.getElementById("modifytemplateresult");
        if (len > 0) {
            showtemplate += 'Template <input type = "text" id = "newtemplatedata" value = "'+result.rows.item(0).Template +'">';
            showtemplate += '<input type = "button" id = "editTemplateButton" value = "Edit Template"/>';
            modifytemplateresult.innerHTML = showtemplate;
        }
        else {
            modifytemplateresult.innerHTML = "No template defined";
        }
        $("#modifytemplateresult").trigger("create");
        document.getElementById("editTemplateButton").addEventListener("click", function(){editTemplateTable(result.rows.item(0).id);},false);
}
function errorFetchingSelectedTemplate(err) {
        document.getElementById("edittemplateresult").innerHTML = "Error occurred while accesssing template: " + err.code;
}
function editTemplateTable(templateID) {
        var db = window.openDatabase("greetings", "1.0", "Greetings Database", 1000000);
        db.transaction(function(tx) {tryEditingTemplateTable(tx, templateID);}, errorEditingTemplateTable);
}
function tryEditingTemplateTable(tx, templateID) {
        var newtempdata = document.getElementById("newtemplatedata").value;
        tx.executeSql('UPDATE Templates Set Template = "'+newtempdata + '" where id in ('+ templateID + ')', [], templateTableEdited, errorEditingTemplateTable);
}
function templateTableEdited(tx, result) {
        alert("Template table successfully edited");
}
function errorEditingTemplateTable(err) {
        alert("Error occurred while editing Templates table: " + err.code);
}







