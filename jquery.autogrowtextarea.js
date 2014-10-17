/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <jevin9@gmail.com> wrote this file. As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return. Jevin O. Sewaruth
 * ----------------------------------------------------------------------------
 *
 * Autogrow Textarea Plugin Version v3.0
 * http://www.technoreply.com/autogrow-textarea-plugin-3-0
 * 
 * THIS PLUGIN IS DELIVERD ON A PAY WHAT YOU WHANT BASIS. IF THE PLUGIN WAS USEFUL TO YOU, PLEASE CONSIDER BUYING THE PLUGIN HERE :
 * https://sites.fastspring.com/technoreply/instant/autogrowtextareaplugin
 *
 * Date: October 15, 2012
 */

/*
 * Modified by Kim Grönqvist @ 2014-10-17
 *
 * Guard against multiple instances. Add destroy and update methods.
 */

;(function ($) {
    
    function AutoGrow (element, options) {
        var self = this;
        
        self.element = element;

        self.createMirror = function (textarea) {
            $(textarea).after('<div class="autogrow-textarea-mirror"></div>');
            return $(textarea).next('.autogrow-textarea-mirror')[0];
        };

        self.sendContentToMirror = function (textarea) {
            var mirror = self.mirror;
            
            mirror.innerHTML = String(textarea.value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br />') + '.<br/>.';

            if ($(textarea).height() != $(mirror).height())
                $(textarea).height($(mirror).height());
        };

        self.growTextarea = function (textarea) {
            self.sendContentToMirror(textarea);
        };
        
        self.init();
    }

    AutoGrow.prototype.init = function () {
        var self = this,
            el = self.element;
        
		// Create a mirror
		var mirror = self.mirror = self.createMirror(el);
		
		// Style the mirror
		mirror.style.display = 'none';
		mirror.style.wordWrap = 'break-word';
		mirror.style.whiteSpace = 'normal';
		mirror.style.padding = $(el).css('padding');
		mirror.style.width = $(el).css('width');
		mirror.style.fontFamily = $(el).css('font-family');
		mirror.style.fontSize = $(el).css('font-size');
		mirror.style.lineHeight = $(el).css('line-height');

		// Style the textarea
		el.style.overflow = "hidden";
		el.style.minHeight = el.rows+"em";

		// Bind the textarea's event
		$(el).on('input', function () { self.growTextarea(el); });
        
		// Fire the event for text already present
		self.sendContentToMirror(el);
    };

    AutoGrow.prototype.update = function () {
        this.growTextarea(this.element);
    };

    $.fn.autoGrow = function (options) {
        return this.each(function () {
            if (!$.data(this, 'autoGrow')) {
                $.data(this, 'autoGrow', new AutoGrow(this, options));
            } else {
                if (options === 'update') {
                    $.data(this, 'autoGrow').update();
                } else if (options === 'destroy') {
                    $(this).off('input');
                    $.data(this, 'autoGrow', null);
                } else {
                    $.data(this, 'autoGrow').update();
                }
            }
        });
    };
    
})($);
