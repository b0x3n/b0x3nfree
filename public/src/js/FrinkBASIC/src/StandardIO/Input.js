///////////////////////////////////////////////////////////
//  FrinkBASIC/src/StandardIO/Input.js                   //
///////////////////////////////////////////////////////////
//
//
//


    export const Input = objConfigure => {

        let     __input_buffer = false;
        let     __input_buffer_id = false;

        let     __script_name = false;
        let     __script_line = false;

        let     __mask_byte = false;
        let     __max_bytes = 0;

        let     __standardIO = false;


        const   _getline = (
            standardIO,
            tokens
        ) => {

            __standardIO = standardIO;

            if (tokens.length < 4)
                return `The getline instruction expects at least one parameter`;

            if (tokens.length > 4) {
                if (! /^[0-9]+$/.test(tokens[4]))
                    return `'${tokens[4]}' is not a valid length property for getline`;
                __max_bytes = parseInt(tokens[4]);
            }

            if (tokens.length > 5)
                __mask = tokens[5].substring(__max_bytes, (__max_bytes + 1));

            objConfigure['system_status'] = 'read_block';

            __input_buffer = '';
            __script_name = tokens[0];
            __script_line = tokens[1];
            __input_buffer_id = tokens[3];

            return true;

        };


        const   __process_input_char = key => {

            if (key.code === 'Enter') {
                const   __result = objConfigure['namespaces'].set_value(
                    __input_buffer_id,
                    __input_buffer
                );

                if (typeof __result === 'string')
                    objConfigure['error_message'] = __result;

                //objConfigure['sleep_cycles'] = 100;
                objConfigure['system_status'] = 'running';

                return;
            }

            __input_buffer += String.fromCharCode(key.keyCode);
            __standardIO['putchar'](
                __standardIO,
                [
                    __script_name,
                    __script_line,
                    'putchar',
                    String.fromCharCode(key.keyCode)
                ]
            );


            return true;

        };


        const   __initialise = () => {

            const   __rows = objConfigure['display']['rows'];
            const   __cols = objConfigure['display']['cols'];

            const   __handle_keypress = 

            // for (let row = 0; row < __rows; row++) {
            //     for (let col = 0; col < __cols; col++) {
            //         console.log(`${row}, ${col}`);
                    //const   __el = document.getElementById(`${objConfigure['target_id']}_cell_${row}_${col}`);
                    document.addEventListener('keypress', key => {
                        if (objConfigure['system_status'] !== 'read_block')
                            return;
        
                        __process_input_char(key);
                    });
            //     }
            // }

            return true;

        };


        __initialise();


        return {

            getline: _getline

        };

    };
