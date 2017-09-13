//----  Alter Pop Up Menus that appear in Right Click (Browser and Grids)  ----

//var vUSERSCTXMENU = ',' + X.CCCWSSETTINGS.USERSCTXMENU + ','; //Custom Right Click Menu will be available only to users added in field 'USERSCTXMENU' (from Custom Memory Table 'CCCWSSETTINGS')
//var vSALSERIESCONV = ',' + X.CCCWSSETTINGS.SALSERIESCONV + ','; //Series that use custom conversion
//var vUSER = ',' + X.SYS.USER + ',';//Login User

function ON_CREATE() {
	ChangeContextMenus(); //====  Menus must be defined in ON_CREATE event ====
}

function ChangeContextMenus() {
	//Browser menus in Internal objects (SALDOC, PURDOC, ITEM, CUSTOMER, etc.) are created through a StringList that is named after BRMENU. Grid menu stringlist's name is GRIDMENU.

	//Change Browser menu
	//if (X.SYS.USER == 1001) {
		var vBrowserMenu = X.EXEC('CODE:ModuleIntf.FindXStrings', X.MODULE, 'BRMENU');
		X.EXEC('CODE:PiLib.TStringsSetItem', vBrowserMenu, 0, '201707191=1;SoftOne Conversion/ Custom Conversion');		//Alter StringList value
	
		//Add new values in StringList
		X.EXEC('CODE:PiLib.TStringsAdd', vBrowserMenu, '-=-');	
		X.EXEC('CODE:PiLib.TStringsAdd', vBrowserMenu, '201707192=1;Customer Financial Data');	
		X.EXEC('CODE:PiLib.TStringsAdd', vBrowserMenu, '201707193=1;Run DLL Form');
		X.EXEC('CODE:PiLib.TStringsAdd', vBrowserMenu, '-=-');		
		X.EXEC('CODE:PiLib.TStringsAdd', vBrowserMenu, '201707194=3;Item Availability');		
		
		X.EXEC('CODE:SysRequest.RefreshPopupMenu', X.MODULE, 'BRMENU', 1); //Refresh pop up menu
	//}

	//Change Lines menu
	var vGridMenu = X.EXEC('CODE:ModuleIntf.FindXStrings', X.MODULE, 'GRIDMENU');
	X.EXEC('CODE:PiLib.TStringsAdd', vGridMenu, '-=-');
	X.EXEC('CODE:PiLib.TStringsAdd', vGridMenu, '201707195=Custom Job 1');	
	X.EXEC('CODE:PiLib.TStringsAdd', vGridMenu, '201707196=Available Item Lots');	
	
	X.EXEC('CODE:SysRequest.RefreshPopupMenu', X.MODULE, 'GRIDMENU', 0);
	
	
	//var BrowserMenuText = X.EXEC('CODE:PiLib.TStringsGetText', vBrowserMenu);
	//var GridMenuText = X.EXEC('CODE:PiLib.TStringsGetText', vGridMenu); 
	//X.WARNING(BrowserMenuText);
	//X.WARNING(GridMenuText);
}

function EXECCOMMAND(cmd) {
	if (cmd == 201707191) { //Custom Conversion
		var vSelRecs;
		vSelRecs = X.GETPARAM('SELRECS');
		if (vSelRecs == '') {
			X.WARNING ('No records selected!');
			return;
		}		
		vSelRecs = vSelRecs.replace(/\?/g,",");
		var vds = X.GETSQLDATASET('SELECT DISTINCT SERIES FROM FINDOC WHERE '+ vSelRecs,null);

		if (vds.RECORDCOUNT > 1) {
			X.EXCEPTION ('The selected records cannot have different series!');
		}
		else {
			var vSeriesCustomConv = ',7001,7002,7003,'; //Define series that custom conversion is used
			var vSeries = ',' + vds.SERIES + ',';
			if (vSeriesCustomConv.indexOf(vSeries) > -1) {
				X.EXEC('XCMD:FORMIMPORT,SCRIPTNAME:SalesCustomConv');
			}
			else {
				X.EXEC('XCMD:CONVERTDLG,SOSOURCE:1351');
			}
		}
	}
	if (cmd == 201707192) {//Customer Financial Data
		var vSelRecs;
		vSelRecs = X.GETPARAM('SELRECS');
		if (vSelRecs == '') {
			X.WARNING ('No records selected!');
			return;
		}				
		vSelRecs = vSelRecs.replace(/\?/g,",");
		var vds = X.GETSQLDATASET('SELECT DISTINCT TRDR FROM FINDOC WHERE '+ vSelRecs,null);
		if (vds.RECORDCOUNT > 1) {
			X.WARNING('You have selected more than one customers!');
			return;
		}
		else if (vds.RECORDCOUNT == 1) {
			X.EXEC('XCMD:CUSTOMER[FORM=Financial data,AUTOLOCATE='+vds.TRDR+']');
		}
	}	
	if (cmd == 201707194) {//browser - Lines Analysis
		var vSelRecs;
		vSelRecs = X.GETPARAM('SELRECS');
		X.WARNING(vSelRecs);
		if (vSelRecs == '') {
			X.WARNING ('No records selected!');
			return;
		}				
		vSelRecs = vSelRecs.replace(/\?/g,",");
		var vds = X.GETSQLDATASET('SELECT DISTINCT MTRL FROM FINDOC INNER JOIN MTRLINES ON FINDOC.FINDOC=MTRLINES.FINDOC WHERE '+ vSelRecs,null);
		if (vds.RECORDCOUNT > 1) {
			X.WARNING('You have selected more than one items!');
			return;
		}
		else if (vds.RECORDCOUNT == 1) {
			X.EXEC('XCMD:ITEM[FORM=Availability,AUTOLOCATE='+vds.MTRL+']');
		}
	}		
	
	if (cmd == 201707195) {
		X.WARNING('Item '+ITELINES.X_NAME+ ' ..... custom Job 1!');
	}
	if (cmd == 201707196) {
		if (ITELINES.MTRL > 0) {
			X.EXEC('XCMD:ITEM[FORM=Available lots,AUTOLOCATE='+ITELINES.MTRL+']');
		}
	}	
}
