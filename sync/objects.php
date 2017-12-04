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
function ciniki_newsletters_sync_objects($ciniki, &$sync, $tnid, $args) {
    ciniki_core_loadMethod($ciniki, 'ciniki', 'newsletters', 'private', 'objects');
    return ciniki_newsletters_objects($ciniki);
}
?>
