///////////////////////////////////////////////////////////
//  public/src/js/Blox.js                                //
///////////////////////////////////////////////////////////
//
//
//

    export const Blox = (

        objConfigure = {

            'target_id': 'header_blox',
            'blox_cell_class': 'blox_cell',
            'width': 4,
            'height': 4,
            'frequency': 30000,
            'animation_duration': 1000,
            'animation_frame': 100,
            'spacing': 1,
            'blox': [
                "000000000000000000000000000000000",
                "000000000000000000000000000000000",
                "001000000111000000000111000000000",
                "001000001001100000001000100000000",
                "001111001010101101100011001111000",
                "001000101100100010001000101000100",
                "001111000111001101100111001000100",
                "000000000000000000000000000000000",
                "000000000000000000000000000000000"
            ],
            'attrs': {
                '0': {
                    'background-color': '#1E90FF'
                },
                '1': {
                    'background-color': '#FFF'
                }
            }

        }

    ) => {
        
        const   __objPairs = [
            {
                'first': {},
                'last': {
                    '0': { 'background-color': 'rgba(0, 0, 0, 0.01)' },
                    '1': { 'background-color': '#1E90FF' }
                }
            },
            {
                'first': {},
                'last': {
                    '0': { 'background-color': 'rgba(0, 0, 0, 0.01)' },
                    '1': { 'background-color': '#FFCC00' }
                }
            },
            {
                'first': {},
                'last': {
                    '0': { 'background-color': '#1E90FF' },
                    '1': { 'background-color': '#FFF' }
                }
            },
            {
                'first': {},
                'last': {
                    '0': { 'background-color': '#FFCC00' },
                    '1': { 'background-color': 'rgba(0, 0, 0, 0.01)' }
                }
            },
            // {
            //     'first': {},
            //     'last': {
            //         '0': { 'background-color': '#FFF' },
            //         '1': { 'background-color': '#1E90FF' }
            //     }
            // },
            // {
            //     'first': {},
            //     'last': {
            //         '0': { 'background-color': '#FFF' },
            //         '1': { 'background-color': '#FFCC00' }
            //     }
            // },
            {
                'first': {},
                'last': {
                    '0': { 'background-color': '#1E90FF' },
                    '1': { 'background-color': 'rgba(0, 0, 0, 0.01)' }
                }
            },
            {
                'first': {},
                'last': {
                    '0': { 'background-color': '#FFCC00' },
                    '1': { 'background-color': 'rgba(0, 0, 0, 0.01)' }
                }
            }
        ];


///////////////////////////////////////////////////////////
//  __build_html()                                       //
///////////////////////////////////////////////////////////
//
        const   __build_html = () => {

            const   __el = $(`#${objConfigure['target_id']}`);
            const   __attrs = objConfigure['attrs'];

            const   __width = objConfigure['width'];
            const   __height = objConfigure['height'];

            let     __col_offset = 0;
            let     __row_offset = 0;

            for (let row = 0; row < objConfigure['blox'].length; row++) {
                __col_offset = 0;

                for (let col = 0; col < objConfigure['blox'][row].length; col++) {
                    const   __char = objConfigure['blox'][row].substring(col, (col + 1));

                    __el.append(`
                        <div
                            id="${objConfigure['target_id']}_cell_${row}_${col}"
                            class="${objConfigure['blox_cell_class']}"
                            style="
                                top: ${(__height * row) + __row_offset}px;
                                left: ${(__width * col) + __col_offset}px;
                                width: ${__width}px;
                                height: ${__height}px;
                            "
                        >
                            &nbsp;
                        </div>
                    `);

                    if (objConfigure.hasOwnProperty('spacing'))
                        __col_offset += objConfigure['spacing'];

                    if (__attrs.hasOwnProperty(__char))
                        $(`#${objConfigure['target_id']}_cell_${row}_${col}`).css(__attrs[__char]);
                    else
                        $(`#${objConfigure['target_id']}_cell_${row}_${col}`).css({
                            'visibility': 'hidden'
                        });
                }

                if (objConfigure.hasOwnProperty('spacing'))
                    __row_offset += objConfigure['spacing'];
            }

        };


///////////////////////////////////////////////////////////
//  __horizontal_animation()                             //
///////////////////////////////////////////////////////////
//
        const   __horizontal_animation = (
            objFirst,
            objLast,
            row,
            direction
        ) => {

            if (row < 0 || row >= objConfigure['blox'].length)
                return;

            setTimeout(() => {
                if (direction === 'top_to_bottom')
                    __horizontal_animation(objFirst, objLast, (row + 1), direction);
                else
                    __horizontal_animation(objFirst, objLast, (row - 1), direction);
            }, objConfigure['animation_frame']);

            for (let col = 0; col < objConfigure['blox'][row].length; col++) {
                const   __char = objConfigure['blox'][row].substring(col, (col + 1));

                if (objFirst.hasOwnProperty(__char)) {
                    $(`#${objConfigure['target_id']}_cell_${row}_${col}`).stop().animate(
                        objFirst[__char],
                        objConfigure['animation_duration'],
                        "linear"
                    );
                }
            
                if (objLast.hasOwnProperty(__char)) {
                    setTimeout(() => {
                        if (objLast.hasOwnProperty(__char)) {
                            $(`#${objConfigure['target_id']}_cell_${row}_${col}`).stop().animate(
                                objLast[__char],
                                objConfigure['animation_duration'],
                                "linear"
                            );
                        }
                    }, objConfigure['animation_duration']);
                }
            }

        };


///////////////////////////////////////////////////////////
//  __vertical_animation()                               //
///////////////////////////////////////////////////////////
//
        const   __vertical_animation = (
            objFirst,
            objLast,
            col,
            direction
        ) => {

            if (col < 0 || col >= objConfigure['blox'][0].length)
                return;

            setTimeout(() => {
                if (direction === 'left_to_right')
                    __vertical_animation(objFirst, objLast, (col + 1), direction);
                else
                    __vertical_animation(objFirst, objLast, (col - 1), direction);
            }, objConfigure['animation_frame']);

            for (let row = 0; row < objConfigure['blox'].length; row++) {
                const   __char = objConfigure['blox'][row].substring(col, (col + 1));

                if (objFirst.hasOwnProperty(__char)) {
                    $(`#${objConfigure['target_id']}_cell_${row}_${col}`).stop().animate(
                        objFirst[__char],
                        objConfigure['animation_duration'],
                        "linear"
                    );
                }
            
                if (objLast.hasOwnProperty(__char)) {
                    setTimeout(() => {
                        if (objLast.hasOwnProperty(__char)) {
                            $(`#${objConfigure['target_id']}_cell_${row}_${col}`).stop().animate(
                                objLast[__char],
                                objConfigure['animation_duration'],
                                "linear"
                            );
                        }
                    }, objConfigure['animation_duration']);
                }
            }

        };


///////////////////////////////////////////////////////////
//  __top_to_bottom()                                    //
///////////////////////////////////////////////////////////
//
        const   __top_to_bottom = (
            objFirst = { 
                '0': { 'background-color': '#FFF' },
                '1': { 'background-color': '#1E90FF' }
            },
            objLast = {
                '0': { 'background-color': '#1E90FF' },
                '1': { 'background-color': '#FFF' }
            }
        ) => {

            __horizontal_animation(
                objFirst,
                objLast,
                0,
                'top_to_bottom'
            );

        };


///////////////////////////////////////////////////////////
//  __top_to_bottom()                                    //
///////////////////////////////////////////////////////////
//
        const   __bottom_to_top = (
            objFirst = { 
                '0': { 'background-color': '#FFF' },
                '1': { 'background-color': '#1E90FF' }
            },
            objLast = {
                '0': { 'background-color': '#1E90FF' },
                '1': { 'background-color': '#FFF' }
            }
        ) => {

            __horizontal_animation(
                objFirst,
                objLast,
                (objConfigure['blox'].length - 1),
                'bottom_to_top'
            );

        };


///////////////////////////////////////////////////////////
//  __left_to_right()                                    //
///////////////////////////////////////////////////////////
//
        const   __left_to_right = (
            objFirst = { 
                '0': { 'background-color': '#FFF' },
                '1': { 'background-color': '#1E90FF' }
            },
            objLast = {
                '0': { 'background-color': '#1E90FF' },
                '1': { 'background-color': '#FFF' }
            }
        ) => {

            __vertical_animation(
                objFirst,
                objLast,
                0,
                'left_to_right'
            );

        };


///////////////////////////////////////////////////////////
//  __right_to_left()                                    //
///////////////////////////////////////////////////////////
//
        const   __right_to_left = (
            objFirst = { 
                '0': { 'background-color': '#FFF' },
                '1': { 'background-color': '#1E90FF' }
            },
            objLast = {
                '0': { 'background-color': '#1E90FF' },
                '1': { 'background-color': '#FFF' }
            }
        ) => {

            __vertical_animation(
                objFirst,
                objLast,
                (objConfigure['blox'][0].length - 1),
                'right_to_left'
            );

        };


///////////////////////////////////////////////////////////
//  __animate_cols()                                     //
///////////////////////////////////////////////////////////
//
        const   __animate_cols = (
            objFirst,
            objLast,
            row,
            col,
            direction
        ) => {

            if (row < 0 || row >= objConfigure['blox'].length)
                return;
            if (col < 0 || col >= objConfigure['blox'][row].length)
                return;

            const   __char = objConfigure['blox'][row].substring(col, (col + 1));

            if (objFirst.hasOwnProperty(__char)) {
                $(`#${objConfigure['target_id']}_cell_${row}_${col}`).stop().animate(
                    objFirst[__char],
                    objConfigure['animation_duration'],
                    "linear"
                );
            }

            if (objLast.hasOwnProperty(__char)) {
                setTimeout(() => {    
                    $(`#${objConfigure['target_id']}_cell_${row}_${col}`).stop().animate(
                        objLast[__char],
                        objConfigure['animation_duration'],
                        "linear"
                    );
                }, objConfigure['animation_frame']);
            }

            setTimeout(() => {
                if (direction === 'top_left' || direction === 'bottom_left')
                    col++;
                else
                    col--;
                __animate_cols(objFirst, objLast, row, col, direction);
            }, objConfigure['animation_frame']);
        };


///////////////////////////////////////////////////////////
//  __animate_rows()                                     //
///////////////////////////////////////////////////////////
//
        const   __animate_rows = (
            objFirst,
            objLast,
            row,
            direction
        ) => {

            if (row < 0 || row >= objConfigure['blox'].length)
                return;
            
            let     col = 0;

            if (direction !== 'top_left' && direction !== 'bottom_left')
                col = (objConfigure['blox'][row].length - 1);
                
            __animate_cols(objFirst, objLast, row, col, direction);

            setTimeout(() => {
                if (direction === 'top_left' || direction === 'top_right')
                    row++;
                else
                    row--;
                __animate_rows(objFirst, objLast, row, direction);
            }, objConfigure['animation_frame']);

        };


///////////////////////////////////////////////////////////
//  __top_left_diagonal()                                //
///////////////////////////////////////////////////////////
//
        const   __top_left_diagonal = (
            objFirst = { 
                '0': { 'background-color': '#FFF' },
                '1': { 'background-color': '#1E90FF' }
            },
            objLast = {
                '0': { 'background-color': '#1E90FF' },
                '1': { 'background-color': '#FFF' }
            }
        ) =>
        {

            __animate_rows(objFirst, objLast, 0, 'top_left');

        };


///////////////////////////////////////////////////////////
//  __top_right_diagonal()                               //
///////////////////////////////////////////////////////////
//
        const   __top_right_diagonal = (
            objFirst = { 
                '0': { 'background-color': '#FFF' },
                '1': { 'background-color': '#1E90FF' }
            },
            objLast = {
                '0': { 'background-color': '#1E90FF' },
                '1': { 'background-color': '#FFF' }
            }
        ) =>
        {

            __animate_rows(
                objFirst,
                objLast,
                0,
                'top_right'
            );

        };


///////////////////////////////////////////////////////////
//  __bottom_left_diagonal()                             //
///////////////////////////////////////////////////////////
//
        const   __bottom_left_diagonal = (
            objFirst = { 
                '0': { 'background-color': '#FFF' },
                '1': { 'background-color': '#1E90FF' }
            },
            objLast = {
                '0': { 'background-color': '#1E90FF' },
                '1': { 'background-color': '#FFF' }
            }
        ) =>
        {

            __animate_rows(
                objFirst,
                objLast,
                (objConfigure['blox'].length - 1),
                'bottom_left'
            );

        };


///////////////////////////////////////////////////////////
//  __bottom_right_diagonal()                            //
///////////////////////////////////////////////////////////
//
        const   __bottom_right_diagonal = (
            objFirst = { 
                '0': { 'background-color': '#FFF' },
                '1': { 'background-color': '#1E90FF' }
            },
            objLast = {
                '0': { 'background-color': '#1E90FF' },
                '1': { 'background-color': '#FFF' }
            }
        ) =>
        {

            __animate_rows(
                objFirst,
                objLast,
                (objConfigure['blox'].length - 1),
                'bottom_right'
            );

        };


///////////////////////////////////////////////////////////
//  __animate()                                          //
///////////////////////////////////////////////////////////
//
        const   __animate = () => {

            const   __directions = [
                __top_to_bottom,
                __bottom_to_top,
                __left_to_right,
                __right_to_left,
                __top_left_diagonal,
                __top_right_diagonal,
                __bottom_left_diagonal,
                __bottom_right_diagonal
            ];

            const   __index = Math.floor(Math.random() * __directions.length);
            const   __pair_index = Math.floor(Math.random() * __objPairs.length);

            const   _direction = __directions[__index];

            _direction(
                __objPairs[__pair_index]['first'],
                __objPairs[__pair_index]['last']
            );

            objConfigure['timeout_id'] = setTimeout(() => {
                __animate();
            }, objConfigure['frequency']);

        };


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const   __initialise = () => {

            __build_html();
            __animate();

        };


        __initialise();

    };

