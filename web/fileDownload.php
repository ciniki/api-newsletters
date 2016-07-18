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
        . "ciniki_businesses.uuid AS business_uuid, "
        . "ciniki_newsletter_files.uuid, "
        . "ciniki_newsletter_files.name, "
        . "ciniki_newsletter_files.extension "
        . "FROM ciniki_newsletter_files, ciniki_businesses "
        . "WHERE ciniki_newsletter_files.business_id = '" . ciniki_core_dbQuote($ciniki, $business_id) . "' "
        . "AND ciniki_newsletter_files.type = 1 "
        . "AND CONCAT_WS('.', ciniki_newsletter_files.permalink, ciniki_newsletter_files.extension) = '" . ciniki_core_dbQuote($ciniki, $permalink) . "' "
        . "AND (ciniki_newsletter_files.webflags&0x01) = 0 "        // Make sure file is to be visible
        . "AND ciniki_newsletter_files.business_id = ciniki_businesses.id "
        . "AND ciniki_businesses.id = '" . ciniki_core_dbQuote($ciniki, $business_id) . "' "
        . "";
    $rc = ciniki_core_dbHashQuery($ciniki, $strsql, 'ciniki.newsletters', 'file');
    if( $rc['stat'] != 'ok' ) {
        return $rc;
    }
    if( !isset($rc['file']) ) {
        return array('stat'=>'noexist', 'err'=>array('pkg'=>'ciniki', 'code'=>'1110', 'msg'=>'Unable to find requested file'));
    }
    $file = $rc['file'];
    $file['filename'] = $file['name'] . '.' . $file['extension'];

    //
    // load from ciniki-storage
    //
    $storage_filename = $ciniki['config']['ciniki.core']['storage_dir'] . '/'
        . $file['business_uuid'][0] . '/' . $file['business_uuid']
        . '/ciniki.newsletters/'
        . $file['uuid'][0] . '/' . $file['uuid'];
    if( !file_exists($storage_filename) ) {
        return array('stat'=>'404', 'err'=>array('pkg'=>'ciniki', 'code'=>'1910', 'msg'=>"I'm sorry but the file you requests does not exist."));
    }

    $file['binary_content'] = file_get_contents($storage_filename);

    return array('stat'=>'ok', 'file'=>$file);
}
?>
