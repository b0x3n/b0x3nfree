///////////////////////////////////////////////////////////
//  FrinkBASIC/src/StandardIO/Cursor.js                  //
///////////////////////////////////////////////////////////
//
//
//


    export const Cursor = objConfigure => {

        let     _enabled = false;

        let     _frequency = 1000;
        let     _state = false;
        let     _cursor_color = objConfigure['namespaces'].get_value('display.color', 'standard');
        let     _cursor_background = objConfigure['namespaces'].get_value('display.backgroundColor', 'standard');

        const   _position = {
            'row': 0,
            'col': 0
        };


///////////////////////////////////////////////////////////
//  __flip_cursor()                                      //
///////////////////////////////////////////////////////////
//
        const   __flip_cursor = () => {

            if (_position.col < 0)
                _position.col = 0;

            const   __el = document.getElementById(`${objConfigure['target_id']}_cell_${_position.row}_${_position.col}`);

        
            _enabled = setTimeout(() => {
                __flip_cursor();
            }, _frequency);

            if (! _state) {
                __el.style.color = _cursor_background.value;
                __el.style.backgroundColor = _cursor_color.value;
            }
            else {
                __el.style.color = _cursor_color.value;
                __el.style.backgroundColor = _cursor_background.value;
            }

            _state = (! _state);

        };


///////////////////////////////////////////////////////////
//  _enable_cursor()                                     //
///////////////////////////////////////////////////////////
//
        const   _enable_cursor = (
            standardIO
        ) => {

            if (_enabled !== false)
                return false;
            
            __flip_cursor();

            return true;

        };


///////////////////////////////////////////////////////////
//  _disable_cursor()                                    //
///////////////////////////////////////////////////////////
//
        const   _disable_cursor = (
            color = false,
            backgroundColor = false
        ) => {

            if (! _enabled)
                return false;

            clearTimeout(_enabled);
            _enabled = false;

            const   __el = document.getElementById(`${objConfigure['target_id']}_cell_${_position.row}_${_position.col}`);

            if (color)
                __el.style.color = color;
            else
                __el.style.color = _cursor_color.value;

            if (backgroundColor)
                __el.style.backgroundColor = backgroundColor;
            else
                __el.style.backgroundColor = _cursor_background.value;

            return true;

        };


///////////////////////////////////////////////////////////
//  _move_cursor()                                       //
///////////////////////////////////////////////////////////
//
        const   _move_cursor = (
            standardIO,
            tokens,
            color = false,
            backgroundColor = false
        ) => {

            if (tokens.length != 5)
                return `The move_cursor instruction expects exactly two parameters, hmm-hey!`;

            let     __row = parseInt(tokens[3]);
            let     __col = parseInt(tokens[4]);

            let     __rows = objConfigure['display']['rows'];
            let     __cols = objConfigure['display']['cols'];

            if (__col >= __cols) {
                __col = 0;
                if (__row < (__rows - 1))
                    __row++;
            }

            const   __cursor_state = _enabled;

            if (__cursor_state !== false)
                _disable_cursor(color, backgroundColor);

            _position.row = __row;
            _position.col = __col;

            if (__cursor_state !== false)
                _enable_cursor();

            return true;
            
        };


        return {

            enable_cursor: _enable_cursor,
            disable_cursor: _disable_cursor,
            move_cursor: _move_cursor,

            position: _position

        };

    };
