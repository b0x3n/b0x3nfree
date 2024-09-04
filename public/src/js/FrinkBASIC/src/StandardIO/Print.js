///////////////////////////////////////////////////////////
//  FrinkBASIC/src/StandardIO/Print.js                   //
///////////////////////////////////////////////////////////
//
//
//

    import * as Timer from "./../Timer.js";


    export const Print = objConfigure => {


        let     __print_column = 0;
        let     __print_timer = 0;

        let     __color = false;
        let     __backgroundColor = false;

        let     __element = false;

        let     __attribute_bold = false;


///////////////////////////////////////////////////////////
//  _putchar()                                           //
///////////////////////////////////////////////////////////
//
        const   _putchar = (
            standardIO,
            tokens
        ) => {

            let     __row = standardIO['position']['row'];
            let     __col = standardIO['position']['col'];

            if (tokens[3].trim() === '')
                tokens[3] = '&nbsp';

            document.getElementById(`${objConfigure['target_id']}_cell_${__row}_${__col}`).innerHTML = tokens[3];
            
            standardIO['move_cursor'](
                standardIO,
                [
                    tokens[0],
                    tokens[1],
                    'move_cursor',
                    __row,
                    (__col + 1)
                ]
            );

            return true;

        };


        const   __set_print_colors = () => {

            const   __fg = objConfigure['namespaces'].get_value('display.color');
            const   __bg = objConfigure['namespaces'].get_value('display.backgroundColor');

            if (typeof __fg !== 'string')
                __color = __fg.value;
            if (typeof __bg !== 'string')
                __backgroundColor = __bg.value;

        };


        let     __set_print_timer = () => {

            const   __timer = objConfigure['namespaces'].get_value('system.print_timer');

            if (typeof __timer !== 'string')
                __print_timer = __timer.value;

        };


        const   __process_attribute = (
            token,
            char_no
        ) => {

            let     __input_string = '';

            while (char_no < token.length) {
                if (token.substring(char_no, (char_no + 1)) === "\\" && token.substring((char_no + 1), (char_no + 2)) === ".") {
                    char_no += 2;
                    break;
                }

                __input_string += token.substring(char_no, ++char_no);
            }

            if (__input_string === 'bold')
                __attribute_bold = (! __attribute_bold);

            return char_no;

        };


///////////////////////////////////////////////////////////
//  _print()                                             //
///////////////////////////////////////////////////////////
//
        const   _print = (
            standardIO,
            tokens,
            char_no = 0
        ) => {

            __set_print_colors();
            __set_print_timer();

            const   __rows = objConfigure['display']['rows'];
            const   __cols = objConfigure['display']['cols'];

            if (char_no >= tokens[3].length) {
                if (objConfigure['system_status'] === 'blocking')
                    objConfigure['system_status'] = 'running';
                return;
            }

            if (! char_no) {
                if (typeof tokens[3] === 'number')
                    tokens[3] = tokens[3].toString();
                if (tokens[3].substring(0, 1) === '"')
                    tokens[3] = tokens[3].substring(1, (tokens[3].length - 1));
                objConfigure['system_status'] = 'blocking';
                if (tokens.length === 3)
                    return;
                if (tokens.length > 5)
                    return `There are too many parameters for the print instruction`;
                if (tokens.length === 5) {
                    __print_timer = parseInt(tokens[4]);
                    objConfigure['namespaces'].set_value(
                        'system.print_timer',
                        __print_timer
                    );
                    tokens.splice(4, 1);
                }
            }

        //for (let char_no = 0; char_no < tokens[3].length; char_no++) {
            let     __row = standardIO['position']['row'];
            let     __col = standardIO['position']['col'];

            let     __char = tokens[3].substring(char_no, (char_no + 2));

            if (__col >= __cols) {
                __col = (__print_column - 1);
                standardIO['position']['col'] = __col;
                if ((__row + 1) < __rows) {
                    __row++;
                    standardIO['position']['row'] = __row;
                }
            }

            if (__char.substring(0, 1) === "\\" && __char.substring(1, 2) === "n") {
                __char = '&nbsp;';
                __row++;
                __col = (__print_column - 1);
                char_no++;
            }
            else if (__char.substring(0, 1) === "\\" && __char.substring(1, 2) === "\\") {
                __char = '';
                char_no++;
            }
            else if (__char.substring(0, 1) === "\\" && __char.substring(1, 2) === "\.") {
                char_no += 2;
                const   __result = __process_attribute(tokens[3], char_no);
                if (typeof __result === 'string')
                    return __result;
                char_no = __result;
                return _print(standardIO, tokens, char_no);
            }
            else {
                __char = tokens[3].substring(char_no, (char_no + 1));

                if (__char.trim() === '')
                    __char = '&nbsp';
            }

            if (__element !== false)
                __char = __element.replace('%char', __char).replace('%color', __color).replace('%backgroundColor', __backgroundColor);
            
            standardIO['move_cursor'](
                standardIO,
                [
                    tokens[0],
                    tokens[1],
                    'move_cursor',
                    __row,
                    (__col + 1)
                ]
            );

            let     __el;
            
            if (__col >= 0)
                __el = document.getElementById(`${objConfigure['target_id']}_cell_${__row}_${__col}`);
            else
                __el = document.getElementById(`${objConfigure['target_id']}_cell_${__row}_0`);

            if (__char !== '') {
                __el.innerHTML = __char;

                __el.style.color = __color;
                __el.style.backgroundColor = __backgroundColor;

                if (__attribute_bold) __el.style.fontWeight = 'bold';
            }

            if (__print_timer > 0) {
                setTimeout(() => {
                    _print(standardIO, tokens, (char_no + 1));
                }, __print_timer);
            }
            else
                _print(standardIO, tokens, (char_no + 1));

            return true;

        };


///////////////////////////////////////////////////////////
//  _mvprint()                                           //
///////////////////////////////////////////////////////////
//
        const   _mvprint = (
            standardIO,
            tokens
        ) => {

            if (tokens.length !== 6)
                return `The mvprint instruction expects exactly 3 parameters`;

            const   __row = parseInt(tokens[3]);
            const   __col = parseInt(tokens[4]);

            __print_column = __col;

            tokens.splice(3, 2);

            standardIO['move_cursor'](
                standardIO,
                [
                    tokens[0],
                    tokens[1],
                    'move_cursor',
                    __row,
                    __col
                ]
            );

            return _print(standardIO, tokens);

        };


        const   _mvprintlink = (
            standardIO,
            tokens
        ) => {


            if (tokens.length !== 8)
                return `The mvprintlink instruction expects exactly 7 parameters`;

            __element = `<a class="cell_link" href="${tokens[7]}://${tokens[6]}">%char</a>`;
            tokens.splice(6, 2);

            return _mvprint(
                standardIO,
                tokens
            );

        };
        

        return {

            putchar: _putchar,
            print: _print,
            mvprint: _mvprint,
            mvprintlink: _mvprintlink

        };

    };
