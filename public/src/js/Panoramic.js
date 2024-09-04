///////////////////////////////////////////////////////////
//  public/src/js/Panoramic.js                           //
///////////////////////////////////////////////////////////
//
//  TODO - resizing breaks the rotation at the seams.
//

    export const Panoramic = (

        objConfig = {
            'duration': 500000,
            'url': '',
            'path': '/public/images/panoramic/',
            'images': [
                '360_landscape_1_clipped.jpg',
                '360_landscape_2_clipped.jpg',
                '360_landscape_3_clipped.jpg'
            ]
        }

    ) => {

        let _paths = [];
        let _image_width = 0;

        let _direction;


///////////////////////////////////////////////////////////
//  __rotation()                                         //
///////////////////////////////////////////////////////////
//
        const   __rotation = () => {

            let _left_from = '0px';
            let _left_to = `-${_image_width - 2}px`;
            let _right_from = `${_image_width - 2}px`;
            let _right_to = '0px';

            if (_direction === 'right')
            {
                _left_from = '0px';
                _left_to = `${_image_width - 2}px`;
                _right_from = `-${_image_width - 2}px`;
                _right_to = '0px';
            }

            $('#panoramic_right').css('left', _right_from);
            $('#panoramic_left').css('left', _left_from);

            $(`#panoramic_right`).animate({
                'left': _right_to
            }, objConfig.duration, "linear");
        
            $(`#panoramic_left`).animate({
                'left': _left_to
            }, objConfig.duration, "linear", () => {
                __rotation(_direction);
            });

        };


///////////////////////////////////////////////////////////
//  __handle_resize()                                    //
///////////////////////////////////////////////////////////
//
        const   __handle_resize = () => {

            $('#panoramic_left, #panoramic_right').stop();
            _image_width = parseInt($(`#panoramic_image_left`).css('width').replace('px', ''));
            $('#panoramic_left, #panoramic_right').css('width', `${_image_width}px`);
    
            if (_direction === 'right')
            {
                const   _left_pos = parseInt($(`#panoramic_left`).css('left').replace('px', ''));
                $(`#panoramic_right`).css({
                    'left': `${_left_pos - _image_width}px`
                });
            }

            __rotation();

        };


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const __initialise = () => {

            objConfig.images.forEach(image => {
                _paths.push(`${objConfig.url}${objConfig.path}${image}`);
            });

            let _image_no = Math.floor(Math.random() * objConfig.images.length);
            _direction = Math.floor(Math.random() * 2);

            if (_direction === 1)
                _direction = 'right';
            else
                _direction = 'left';

            $(`#panoramic_left`).append(`<img id="panoramic_image_left" src="${_paths[_image_no]}" width="auto" height="100%">`)

            setTimeout(() => {            
                $(`#panoramic_right`).append(`<img id="panoramic_image_right" src="${_paths[_image_no]}" width="auto" height="100%">`);
                _image_width = $(`#panoramic_image_left`).css('width').replace('px', '');
                $(`#panoramic_left, #panoramic_right`).css({
                    'width': `${_image_width}px`
                });
                __rotation();
            }, 50);

            $(window).on('resize', () => {
                __handle_resize();
            });

        };


        __initialise();

    };
