(function($){
	jQuery.fn.ipmask = function(opt){
		var param = $.extend({
			ver: 'v4'
		}, opt),
            input = this,
            curVal = '',

            v4maskRegFull = new RegExp("^(25[0-5]|2[0-4][0-9]|[1][0-9]{2}|[1-9][0-9]|[0-9])(\\.(25[0-5]|2[0-4][0-9]|[1][0-9]{2}|[1-9][0-9]|[0-9])){3}$"),
            v4maskRegPart = new RegExp("^(25[0-5]|2[0-4][0-9]|[1][0-9]{2}|[1-9][0-9]|[0-9])((\\.)|(\\.(25[0-5]|2[0-4][0-9]|[1][0-9]{2}|[1-9][0-9]|[0-9])){0,1}){0,3}$"),

            checkKey = function(val){

                // if last symbol dot return false
                if(curVal.substring(curVal.length-1) == '.' && val == '.') return false;

                // check cur input symbol
                if(v4maskRegPart.test(curVal+val)) return true;
                // if no, try after add dot delimiter
                else if(v4maskRegPart.test(curVal+'.'+val)) {
                    input.val(curVal+'.');
                    return true;
                }
                else return false;
            },

            // add delimiter if need
            addDot = function(key,replaceDot){
                curVal = input.val();
                if((key != '.' && (!v4maskRegPart.test(curVal+key+1) && v4maskRegPart.test(curVal+key+'.')) || replaceDot)) {
                    input.val(curVal+key+'.');
                    return true;
                }
                return false;
            },

            onKeypress = function(e){
                var k = e.which;
                curVal = input.val();

                var replaceDot = false;
                // raplace , or ' ' for . and set flag replaceDot
                if(k == 44 || k == 32) {
                    k = 46;
                    replaceDot = true;
                }

                if (e.ctrlKey || e.altKey || e.metaKey || k<32) {
                    return true;
                }else if (k){
                    var key = String.fromCharCode(k);

                    // init check and return 
                    if(!checkKey(key)) return e.preventDefault();
                    // try add dot
                    else return addDot(key,replaceDot)?e.preventDefault():true;

                }
            },
            onBlur = function(){ if(!v4maskRegFull.test(input.val())) input.val(''); }

        return this.bind('keypress',onKeypress).bind('blur',onBlur);
	};
})(jQuery);