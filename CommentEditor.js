/*
Copyright (C) 2013 EllisLab, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
ELLISLAB, INC. BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Except as contained in this notice, the name of EllisLab, Inc. shall not be
used in advertising or otherwise to promote the sale, use or other dealings
in this Software without prior written authorization from EllisLab, Inc.
*/

/*

This is a modified version of the script provided by EllisLab, Inc.
The original can be found here: https://github.com/EllisLab/CommentEditor

Modifications made by Tim Murtaugh (@murtaugh)

The modifications:
	1. re-worked so we could put the function in our external JS file, instead of directly in the page
	2. give us more control over the animations that reveal and hide the elements
	3. added a confirmation dialogue for closing comments
	
*/

$.fn.CommentEditor = function(options) {

	var OPT;

	// "url" should match whatever result your system returns for this tag: {exp:comment:ajax_edit_url}

	OPT = $.extend({
			url: '/?ACT=XX',
			comment_body: '.comment-body',
			showEditor: '.edit-link',
			hideEditor: '.cancel-edit',
			saveComment: '.submit-edit',
			closeComment: '.mod-link'
	}, options);

	var view_elements = [OPT.comment_body, OPT.showEditor, OPT.closeComment, OPT.showEmbed].join(','),
			edit_elements = '.edit-comment';

	return this.each(function() {
			var id = this.id,
			parent = $(this);

			parent.find(OPT.showEditor).click(function() { showEditor(id); return false; });
			parent.find(OPT.hideEditor).click(function() { hideEditor(id); return false; });
			parent.find(OPT.saveComment).click(function() { saveComment(id); return false; });
			parent.find(OPT.closeComment).click(function() { closeComment(id); return false; });
	});

	function showEditor(id) {
			$("#"+id)
					.find(view_elements).css('opacity', '.1').end()
					.find(edit_elements).slideDown('fast').end();
	}

	function hideEditor(id) {
			$("#"+id)
					.find(view_elements).css('opacity', '1').end()
					.find(edit_elements).slideUp('fast');
	}
	
	
	// If you have secure forms turned on (and you ought to) you need to make the value of the {XID_HASH} variable
	// available to this script. At the moment, the script is looking for an element that looks like this:
	// <span id="page-state" data-xid="{XID_HASH}"></span>
	// (It can be any type of element. Perhaps the parent container for your comments.)
	
	var getHash;

	function closeComment(id) {
	
		var confirmClose = confirm('Are you sure?');
		
		if (confirmClose == true) {
         
			if (getHash == null) {
				getHash = $("#page-state").data('xid');
			}
			
			var data = {status: "close", comment_id: id, XID: getHash};

			$.post(OPT.url, data, function (res) {
				if (res.error) {
					return $.error('Could not moderate comment.');
				}

				hash = res.XID;
				$('input[name=XID]').val(hash);
				$('#' + id).fadeOut('fast');
				// reset the hash based on the response from the server
				getHash = hash;
		
			 });
		}
	}

	function saveComment(id) {

		if (getHash == null) {
			getHash = $("#page-state").data('xid');
		}
		
		var content = $("#"+id).find('.edit-comment'+' textarea').val(),
		data = {comment: content, comment_id: id, XID: getHash};

		$.post(OPT.url, data, function (res) {
			if (res.error) {
				return $.error('Could not save comment.');
			}

			hash = res.XID;
			$('input[name=XID]').val(hash);
			$("#"+id).find('.comment-body').html(res.comment);
			hideEditor(id);
			// reset the hash based on the response from the server
			getHash = hash;
		});
	}
};
