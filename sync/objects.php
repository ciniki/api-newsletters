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
	ciniki_core_loadMethod($ciniki, 'ciniki', 'newsletters', 'private', 'objects');
	return ciniki_newsletters_objects($ciniki);
}
?>
