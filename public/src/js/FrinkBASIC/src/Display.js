///////////////////////////////////////////////////////////
//  FrinkBASIC/src/Display.js                            //
///////////////////////////////////////////////////////////
//
//
//


    export const Display = objConfigure => {

        const   _display = {

            'element': objConfigure['element'],

            'cell_width': 0,
            'cell_height': 0,

            'height': 0,
            'width': 0,
            'rows': 0,
            'cols': 0

        };


///////////////////////////////////////////////////////////
//  __get_cell_size()                                    //
///////////////////////////////////////////////////////////
//
        const   __get_cell_size = () => {

            const   __new_el = document.createElement('div');

            __new_el.classList.add(objConfigure['cell_class']);

            __new_el.id = 'cell_width_test';
            __new_el.style.fontFamily = objConfigure['font_family'];
            __new_el.style.fontSize = objConfigure['font_size'];
            __new_el.textContent = "{";

            _display['element'].appendChild(__new_el);

            _display['cell_height'] = parseInt(objConfigure['font_size'].replace('px', ''));
            _display['cell_width'] = __new_el.offsetWidth;

            __new_el.remove();

        };


///////////////////////////////////////////////////////////
//  __build_display()                                    //
///////////////////////////////////////////////////////////
//
        const   __build_display = () => {

            for (let row = 0; row < _display['rows']; row++) {
                for (let col = 0; col < _display['cols']; col++) {
                    const   __new_el = document.createElement('div');

                    __new_el.classList.add(objConfigure['cell_class']);
                    __new_el.id = `${objConfigure['target_id']}_cell_${row}_${col}`;
                    __new_el.style.fontFamily = objConfigure['font_family'];
                    __new_el.style.fontSize = objConfigure['font_size'];
                    __new_el.style.top = `${((row * _display['cell_height']) + _display['padding_top'])}px`;
                    __new_el.style.left = `${((col * _display['cell_width']) + _display['padding_left'])}px`;
                    __new_el.style.lineHeight = objConfigure['font_size'];
                    __new_el.style.color = objConfigure['display_color'];
                    __new_el.style.backgroundColor = objConfigure['display_background'];
                    __new_el.style.display = 'block';
                    __new_el.style.opacity = '0.99';
                    __new_el.style.index = (row * col);
                    __new_el.innerHTML = "&nbsp;";

                    _display['element'].appendChild(__new_el);
                }
            }

            console.log(`Built display`)

        };


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const   __initialise = () => {

            const   __page_element = document.getElementById(objConfigure['page_id']);
            const   __page_display = __page_element.style.display;
        
            if (__page_display === 'none')
                __page_element.style.display = 'block';

            _display['height'] = _display['element'].offsetHeight;
            _display['width'] = _display['element'].offsetWidth;

            __get_cell_size();

            _display['rows'] = Math.floor(_display['height'] / _display['cell_height']);
            _display['cols'] = Math.floor(_display['width'] / _display['cell_width']);

            _display['padding_top'] = Math.floor((_display['height'] % _display['cell_height']) / 2);
            _display['padding_left'] = Math.floor((_display['width'] % _display['cell_width']) / 2);

            __build_display();

            __page_element.style.display = __page_display;
            
        };


        __initialise();


        return {

            display: _display

        };

    };
