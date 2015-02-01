//
// The newsletters app 
//
function ciniki_newsletters_main() {
	this.webFlags = {
		'1':{'name':'Hidden'},
		};
	this.fileTypes = {
		'1':'Newsletter',
		};
	this.init = function() {
		//
		// Setup the main panel to list the collection
		//
		this.menu = new M.panel('Files',
			'ciniki_newsletters_main', 'menu',
			'mc', 'medium', 'sectioned', 'ciniki.newsletters.main.menu');
		this.menu.data = {};
		this.menu.sections = {
			'newsletters':{'label':'Newsletters',
				'type':'simplegrid', 'num_cols':1,
				'headerValues':null,
				'cellClasses':[''],
				'addTxt':'Add Newsletter',
				'addFn':'M.ciniki_newsletters_main.showAdd(\'M.ciniki_newsletters_main.showMenu();\',\'1\');',
				}
			};
		this.menu.cellValue = function(s, i, j, d) {
			if( j == 0 ) { return d.file.name; }
		};
		this.menu.rowFn = function(s, i, d) {
			return 'M.ciniki_newsletters_main.showEdit(\'M.ciniki_newsletters_main.showMenu();\', \'' + d.file.id + '\');'; 
		};
		this.menu.sectionData = function(s) { 
			return this.data[s];
		};
		this.menu.addButton('add', 'Add', 'M.ciniki_newsletters_main.showAdd(\'M.ciniki_newsletters_main.showMenu();\');');
		this.menu.addClose('Back');

		//
		// The panel to display the add form
		//
		this.add = new M.panel('Add File',
			'ciniki_newsletters_main', 'add',
			'mc', 'medium', 'sectioned', 'ciniki.newsletters.main.edit');
		this.add.default_data = {'type':'1'};
		this.add.data = {};	
// FIXME:		this.add.uploadDropFn = function() { return M.ciniki_newsletters_main.uploadDropImagesAdd; };
		this.add.sections = {
			'_file':{'label':'File', 'fields':{
				'uploadfile':{'label':'', 'type':'file', 'hidelabel':'yes'},
			}},
			'info':{'label':'Information', 'type':'simpleform', 'fields':{
				'name':{'label':'Title', 'type':'text'},
				'publish_date':{'label':'Date', 'type':'date'},
				'webflags':{'label':'Web', 'type':'flags', 'toggle':'yes', 'join':'yes', 'flags':this.webFlags},
			}},
			'_description':{'label':'Description', 'type':'simpleform', 'fields':{
				'description':{'label':'', 'type':'textarea', 'size':'small', 'hidelabel':'yes'},
			}},
			'_save':{'label':'', 'buttons':{
				'save':{'label':'Save', 'fn':'M.ciniki_newsletters_main.addFile();'},
			}},
		};
		this.add.fieldValue = function(s, i, d) { 
			if( this.data[i] != null ) {
				return this.data[i]; 
			} 
			return ''; 
		};
		this.add.addButton('save', 'Save', 'M.ciniki_newsletters_main.addFile();');
		this.add.addClose('Cancel');

		//
		// The panel to display the edit form
		//
		this.edit = new M.panel('File',
			'ciniki_newsletters_main', 'edit',
			'mc', 'medium', 'sectioned', 'ciniki.newsletters.main.edit');
		this.edit.file_id = 0;
		this.edit.data = null;
		this.edit.sections = {
			'info':{'label':'Details', 'type':'simpleform', 'fields':{
				'name':{'label':'Title', 'type':'text'},
				'publish_date':{'label':'Date', 'type':'date'},
				'webflags':{'label':'Web', 'type':'flags', 'toggle':'yes', 'join':'yes', 'flags':this.webFlags},
			}},
			'_description':{'label':'Description', 'type':'simpleform', 'fields':{
				'description':{'label':'', 'type':'textarea', 'size':'small', 'hidelabel':'yes'},
			}},
			'_save':{'label':'', 'buttons':{
				'save':{'label':'Save', 'fn':'M.ciniki_newsletters_main.saveFile();'},
				'download':{'label':'Download', 'fn':'M.ciniki_newsletters_main.downloadFile(M.ciniki_newsletters_main.edit.file_id);'},
				'delete':{'label':'Delete', 'fn':'M.ciniki_newsletters_main.deleteFile(M.ciniki_newsletters_main.edit.file_id);'},
			}},
		};
		this.edit.fieldValue = function(s, i, d) { 
			return this.data[i]; 
		}
		this.edit.sectionData = function(s) {
			return this.data[s];
		};
		this.edit.fieldHistoryArgs = function(s, i) {
			return {'method':'ciniki.newsletters.fileHistory', 'args':{'business_id':M.curBusinessID, 'file_id':this.file_id, 'field':i}};
		};
		this.edit.addButton('save', 'Save', 'M.ciniki_newsletters_main.saveFile();');
		this.edit.addClose('Cancel');
	}

	this.start = function(cb, appPrefix, aG) {
		args = {};
		if( aG != null ) {
			args = eval(aG);
		}

		//
		// Create container
		//
		var appContainer = M.createContainer(appPrefix, 'ciniki_newsletters_main', 'yes');
		if( appContainer == null ) {
			alert('App Error');
			return false;
		}

		this.showMenu(cb);
	}

	this.showMenu = function(cb, listby, category) {
		this.menu.data = {};
		var rsp = M.api.getJSONCb('ciniki.newsletters.fileList', {'business_id':M.curBusinessID, 'type':'1'}, function(rsp) {
			if( rsp.stat != 'ok' ) {
				M.api.err(rsp);
				return false;
			}
			var p = M.ciniki_newsletters_main.menu;
			p.data = {'newsletters':rsp.files};
			p.refresh();
			p.show(cb);
		});
	};

	this.showAdd = function(cb, type) {
		this.add.reset();
		this.add.data = {};
		if( type != null ) {
			this.add.data = {'type':type};
		}
		this.add.refresh();
		this.add.show(cb);
	}

	this.addFile = function() {
		var f = this.add.formFieldValue(this.add.sections._file.fields.uploadfile, 'uploadfile');
		if( f == null || f == '' ) {
			alert("You must specify a file");
			return false;
		}
		var n = this.add.formFieldValue(this.add.sections.info.fields.name, 'name');
		if( n == this.add.data.name ) {
			alert("You must specify a name");
			return false;
		}

		var c = this.add.serializeFormData('yes');
		if( c != null ) {
			var rsp = M.api.postJSONFormData('ciniki.newsletters.fileAdd', 
				{'business_id':M.curBusinessID, 'type':'1'}, c,
				function(rsp) {
					if( rsp.stat != 'ok' ) {
						M.api.err(rsp);
						return false;
					} else {
						M.ciniki_newsletters_main.add.close();
					}
				});
		}
	};

	this.showEdit = function(cb, fid) {
		if( fid != null ) {
			this.edit.file_id = fid;
		}
		var rsp = M.api.getJSONCb('ciniki.newsletters.fileGet', {'business_id':M.curBusinessID, 
			'file_id':this.edit.file_id}, function(rsp) {
				if( rsp.stat != 'ok' ) {
					M.api.err(rsp);
					return false;
				}
				var p = M.ciniki_newsletters_main.edit;
				p.data = rsp.file;
				p.refresh();
				p.show(cb);
			});
	};

	this.saveFile = function() {
		var c = this.edit.serializeFormData('no');

		if( c != '' ) {
			var rsp = M.api.postJSONFormData('ciniki.newsletters.fileUpdate', 
				{'business_id':M.curBusinessID, 'file_id':this.edit.file_id}, c,
					function(rsp) {
						if( rsp.stat != 'ok' ) {
							M.api.err(rsp);
							return false;
						} else {
							M.ciniki_newsletters_main.edit.close();
						}
					});
		}
	};

	this.deleteFile = function(fid) {
		if( confirm('Are you sure you want to delete \'' + this.edit.data.name + '\'?  All information about it will be removed and unrecoverable.') ) {
			var rsp = M.api.getJSONCb('ciniki.newsletters.fileDelete', {'business_id':M.curBusinessID, 
				'file_id':M.ciniki_newsletters_main.edit.file_id}, function(rsp) {
					if( rsp.stat != 'ok' ) {
						M.api.err(rsp);
						return false;
					} 
					M.ciniki_newsletters_main.edit.close();
				});
		}
	};

	this.downloadFile = function(fid) {
		M.api.openFile('ciniki.newsletters.fileDownload', {'business_id':M.curBusinessID, 'file_id':fid});
	};
}
