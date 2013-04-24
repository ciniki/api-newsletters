<?php
//
// Description
// ===========
// This function will return the file details and content so it can be sent to the client.
//
// Returns
// -------
//
function ciniki_newsletters_web_fileDownload($ciniki, $business_id, $permalink) {

	//
	// Get the file details
	//
	$strsql = "SELECT ciniki_newsletter_files.id, "
		. "ciniki_newsletter_files.name, "
		. "ciniki_newsletter_files.extension, "
		. "ciniki_newsletter_files.binary_content "
		. "FROM ciniki_newsletter_files "
		. "WHERE business_id = '" . ciniki_core_dbQuote($ciniki, $business_id) . "' "
		. "AND type = 1 "
		. "AND CONCAT_WS('.', permalink, extension) = '" . ciniki_core_dbQuote($ciniki, $permalink) . "' "
		. "AND (webflags&0x01) = 0 "		// Make sure file is to be visible
		. "";
	$rc = ciniki_core_dbHashQuery($ciniki, $strsql, 'ciniki.newsletters', 'file');
	if( $rc['stat'] != 'ok' ) {
		return $rc;
	}
	if( !isset($rc['file']) ) {
		return array('stat'=>'noexist', 'err'=>array('pkg'=>'ciniki', 'code'=>'1008', 'msg'=>'Unable to find requested file'));
	}
	$rc['file']['filename'] = $rc['file']['name'] . '.' . $rc['file']['extension'];

	return array('stat'=>'ok', 'file'=>$rc['file']);
}
?>
