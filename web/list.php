<?php
//
// Description
// -----------
// This function will return a list of newsletters to be published online.
//
// Returns
// -------
//
function ciniki_newsletters_web_list($ciniki, $tnid) {

    $strsql = "SELECT id, name, extension, permalink, description, "
        . "DATE_FORMAT(publish_date, '%Y') AS year "
        . "FROM ciniki_newsletter_files "
        . "WHERE tnid = '" . ciniki_core_dbQuote($ciniki, $tnid) . "' "
        . "AND type = 1 "
        . "AND (webflags&0x01) = 0 "
        . "ORDER BY publish_date DESC, name "
        . "";

    ciniki_core_loadMethod($ciniki, 'ciniki', 'core', 'private', 'dbHashQueryTree');
    return ciniki_core_dbHashQueryTree($ciniki, $strsql, 'ciniki.newsletters', array(
        array('container'=>'categories', 'fname'=>'year', 'name'=>'category',
            'fields'=>array('name'=>'year')),
        array('container'=>'files', 'fname'=>'name', 'name'=>'file',
            'fields'=>array('id', 'name', 'extension', 'permalink', 'description')),
        ));
}
?>
