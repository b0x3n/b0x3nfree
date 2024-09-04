///////////////////////////////////////////////////////////
//  public/src/js/Router.js                              //
///////////////////////////////////////////////////////////
//
//
//

    export const Router = () => {

        const   _objMouseenter = { 'color': '#1E90FF' };
        const   _objMouseleave = { 'color': '#FFCC00' };
        const   _mouse_anim_duration = 250;

        const   _content_id = 'content';

        const   _routes = {
            'home': '/public/pages/Home.html',
            'projects': '/public/projects/index.html',
            'project_1': '/public/projects/Project_1.html',
            'project_2': '/public/projects/Project_2.html'
        };

        const   _not_found = '/public/pages/404.html';

        const   _pages = [];
        let     _page = false;


///////////////////////////////////////////////////////////
//  __preload_pages()                                    //
///////////////////////////////////////////////////////////
//
        const   __preload_pages = () => {

            Object.keys(_routes).forEach(key => {
                $(`#${_content_id}`).append(`
                    <div id="${_content_id}_${key}" class="page"></div>
                `);

                $(`#${_content_id}_${key}`).load(_routes[key]);
            });

            $(`#${_content_id}`).append(`
                <div id="page_404" class="page"></div>
            `);

            $(`#page_404`).load(_not_found);

        };


///////////////////////////////////////////////////////////
//  __initialise_links()                                 //
///////////////////////////////////////////////////////////
//
        const   __initialise_links = () => {

            $('.page_link').on('click', function() {
                const   __id = $(this).attr('id').substring(5);

                if (! _routes.hasOwnProperty(__id))
                    _page = false;
                else
                    _page = __id;

                $('.page').stop().animate({
                    'opacity': 0.01
                }, 500, "linear", () => {
                    _load_page(true);
                });
            });

            $('.page_link').on('mouseenter', function() {
                $(this).stop().animate(_objMouseenter, _mouse_anim_duration, "linear");
            });

            $('.page_link').on('mouseleave', function() {
                $(this).stop().animate(_objMouseleave, _mouse_anim_duration, "linear");
            });

        };


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const   __initialise = () => {

            let __hash = window.location.hash;

            __preload_pages();

            if (__hash === '')
                __hash = 'home';

            if (__hash.substring(0, 1) === '#')
                __hash = __hash.substring(1);

            if (! _routes.hasOwnProperty(__hash))
                    _page = false;
            else
                _page = _routes[__hash];

            _load_page();

            setTimeout(() => {
            __initialise_links();
            }, 500);

        };


///////////////////////////////////////////////////////////
//  _load_page()                                         //
///////////////////////////////////////////////////////////
//
        const   _load_page = (
            is_link = false
        ) => {

            $(`.page`).css({
                'display': 'none',
                'opacity': '0.01'
            });

            if (! is_link)
                _page = Object.keys(_routes).find(key => _routes[key] === _page);

            if (! _routes.hasOwnProperty(_page)) {
                $('#page_404').css('display', 'block');
                $(`#page_404`).stop().animate({
                    'opacity': '0.99'
                }, 500, "linear");
            }
            else {
                $(`#${_content_id}_${_page}`).css('display', 'block');
                $(`#${_content_id}_${_page}`).stop().animate({
                    'opacity': '0.99'
                }, 500, "linear");
            }
        };


        __initialise();


        return {
        
            load_page: _load_page

        };

    };
