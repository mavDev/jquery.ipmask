$.fn.setCursorPosition = function(pos) {
    this.each(function(index, elem) {
        if (elem.setSelectionRange) {
            elem.setSelectionRange(pos, pos);
        } else if (elem.createTextRange) {
            var range = elem.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    });
    return this;
};

(function($){
    jQuery.fn.ipmask = function(opt){
        var param = $.extend({
                ver: 'v4'
            }, opt),
            input,curVal = {}, key, selStart, selEnd// set in onKeypress

            v4maskRegFull = new RegExp("^(25[0-5]|2[0-4][0-9]|[1][0-9]{2}|[1-9][0-9]|[0-9])(\\.(25[0-5]|2[0-4][0-9]|[1][0-9]{2}|[1-9][0-9]|[0-9])){3}$"),
            v4maskRegPart = new RegExp("^(25[0-5]|2[0-4][0-9]|[1][0-9]{2}|[1-9][0-9]|[0-9])((\\.)|(\\.(25[0-5]|2[0-4][0-9]|[1][0-9]{2}|[1-9][0-9]|[0-9])){0,1}){0,3}$"),
            v4maskDoubleDot = new RegExp("\\.\\."),

            placeholder = '  .  .  .  ',

            checkKey = function(val){

                // test inputed char
                if((v4maskRegPart.test(curVal.start+val+curVal.end) || v4maskRegPart.test(curVal.start+val+'.'+curVal.end)) && (!v4maskDoubleDot.test(curVal.start+val+curVal.end) || !v4maskDoubleDot.test(curVal.start+'.'+val+curVal.end))) return true;
                else return false;
            },

            // test to add next dot
            addDot = function(key){

                if(key != '.' && (!v4maskRegPart.test((curVal.start+key)+1+curVal.end) && v4maskRegPart.test(curVal.start+key+'.'+curVal.end))) {
                    return true;
                }
                return false;
            },

            setInput = function(str,selStart,key){
                // get array: explode by dot and remove empty elements from array
                parts = $.grep(str.length?str.split('.'):[str],function(item){
                    return item != '';
                });

                if(parts.length<4) {

                    for(var i=(4-parts.length);i>0;i--){
                        parts.push('  ');
                    }
                }
                input.val(parts.join('.')).setCursorPosition(selStart+(addDot(key)?2:1));
            },

            onFocus = function(e){
                // set placeholder
                if(!$(this).val().length) $(this).val(placeholder).setCursorPosition(0);
            },

            onKeypress = function(e){
                var k = e.which?e.which:e.keyCode;

                // del firefox
                if(k==46 && e.which==0) k=0;

                // replace . and space for dot
                if(k == 44 || k == 32) {
                    k = 46;
                }

                if((k!=0 && k!=8) && (e.ctrlKey || e.altKey || e.metaKey || k<=39)) return true;
                else if(k!=0 && k!=8 && (k<48 && k>57)) return e.preventDefault();

                input = $(this);
                selStart = input[0].selectionStart;
                selEnd = input[0].selectionEnd;
                curVal.val = input.val();

                // del all spaces and last dot
                curVal.val = curVal.val.replace(/([ ]){1,2}(([ ]{0,2}\.{0,1}[ ]{0,2}){1,3})/,'');

                curVal.start = curVal.val.substring(0,selStart); // before cursor
                curVal.end = curVal.val.substring(selEnd); // after cursor
                curVal.end = curVal.end == '.' ? '' : curVal.end; // remove if dot

                var key = String.fromCharCode(k)?String.fromCharCode(k):'';

                if(k==0){ //delete
                    curVal.end = curVal.end.substring(1);
                    selStart--;
                }else if(k==8){ // backspace

                    // if need remove last dot
                    if(curVal.start.substring(curVal.start.length-2).search('\\.') >= 0) {
                        curVal.start = curVal.start.substring(0,curVal.start.length-1);
                        selStart-=2;
                    }

                    curVal.start = curVal.start.substring(0,curVal.start.length-1);
                    selStart--;
                }

                if(key){

                    if(checkKey(key)){
                        str = curVal.start+key+curVal.end;

                    } else str = curVal.start+curVal.end;

                    setInput(str,selStart,key);

                }

                return e.preventDefault();
            },
            onBlur = function(){ if(!v4maskRegFull.test($(this).val())) $(this).val(''); }

        return this.on('keypress',onKeypress).on('blur',onBlur).on('focus',onFocus);
    };
})(jQuery);