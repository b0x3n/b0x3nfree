///////////////////////////////////////////////////////////
//  public/src/js/Router.js                              //
///////////////////////////////////////////////////////////
//
//
//


    export const Router = () => {

        let     _route = false;
        let     _context = false;
        let     _page = false;


        let     _content = {
            'url': window.__base_url,
            'home': '/public/pages/home.html',
            'projects': {
                'project_1': '/public/projects/Project_1.html',
                'project_2': '/public/projects/Project_2.html'
            },
            '404': '/public/pages/404.html'
        };


///////////////////////////////////////////////////////////
//  __set_route()                                        //
///////////////////////////////////////////////////////////
//
        const   __set_route = (

            route = window.location.hash

        ) => {

            if (route === '') {
                _route = false;
                _context = 'home';
                _page = _content[_context];
                return;
            }

            if (route.substring(0, 1) === '#')
                route = route.substring(1);

            const   __params = route.split('/');

            if (__params > 2) {
                _context = '404';
                _page = _content[_context];
                return;
            }

            _context = __params[0];

            if (! _content.hasOwnProperty(_context)) {
                _context = '404';
                _page = _content[_context];
                return;
            }

            if (__params.length === 2)
                _page = __params[1];
            else {
                if (typeof _content[_context] !== 'object')
                    _page = _content[_context];
                else {
                    _page = `/public/${_context}/index.html`;
                    return;
                }
            }

            if (! _content[_context].hasOwnProperty(_page)) {
                _context = '404'; 
                _page = _content[_context][_page];
                return;
            }
            else
                _page = _content[_context][_page];

        };


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const   __initialise = () =>
        {

            __set_route();
            _load_page();

            $('a').on('click', function() {
                let __id = $(this).attr('id').substring(5);
                alert(__id);
                if (__id === 'home')
                    __id = '';
                else
                    __id = `#${__id}`;

                __set_route();
                $('#content').stop().animate({
                    'opacity': 0.01,
                }, 500, "linear", () => {
                    _load_page(__id);
                });
            });

            $('nav a').on('mouseenter', function() {
                let __id = $(this).attr('id').substring(5);
                $(this).stop().animate({
                    'color': '#1E90FF'
                }, 250, "linear");
            });

            $('nav a').on('mouseleave', function() {
                let __id = $(this).attr('id').substring(5);
                $(this).stop().animate({
                    'color': '#FFCC00'
                }, 250, "linear");
            });

        };


///////////////////////////////////////////////////////////
//  _load_page()                                         //
///////////////////////////////////////////////////////////
//
        const   _load_page = (

            route = false,
            target_id = 'content'
        
        ) => {

            if (route !== false)
                __set_route(route);

            $(`#${target_id}`).load(_content['url'] + _page);

            $(`#${target_id}`).animate({
                'opacity': '0.99'
            }, 1000, "linear");

        };


        __initialise();


        return {

            load_page: _load_page

        };

    };
