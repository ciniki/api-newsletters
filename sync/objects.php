<?php
//
// Description
// -----------
//
// Arguments
// ---------
//
// Returns
// -------
//
function ciniki_newsletters_sync_objects($ciniki, &$sync, $business_id, $args) {
	
	//
	// NOTES: When pushing a change, grab the history for the current session
	// When increment/partial/full, sync history on it's own
	//

	//
	// Working on version 2 of sync, completely object based
	//
	$objects = array();
	$objects['file'] = array(
		'name'=>'File',
		'table'=>'ciniki_newsletter_files',
		'fields'=>array(
			'type'=>array(),
			'extension'=>array(),
			'status'=>array(),
			'name'=>array(),
			'permalink'=>array(),
			'webflags'=>array(),
			'description'=>array(),
			'org_filename'=>array(),
			'publish_date'=>array(),
			'binary_content'=>array(),
			),
		'history_table'=>'ciniki_newsletter_history',
		);
	
	return array('stat'=>'ok', 'objects'=>$objects);
}
?>
