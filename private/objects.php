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
function ciniki_newsletters_objects($ciniki) {
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
			'checksum'=>array(),
			),
		'history_table'=>'ciniki_newsletter_history',
		);
	
	return array('stat'=>'ok', 'objects'=>$objects);
}
?>
