///////////////////////////////////////////////////////////
//  System16/s16a/src/core/Resolver.mjs                  //
///////////////////////////////////////////////////////////
//
//
//


///////////////////////////////////////////////////////////
//  The Resolver module.                                 //
///////////////////////////////////////////////////////////
//
    export const Resolver = (

        objOptions = {
            'obrace':       '(',
            'ebrace':       ')',
            'first_token':  2  
        }

    ) => {


        const   __eval_types = [
            'eq',
            'ne',
            'le',
            'ge',
            'lt',
            'gt',
            'and',
            'or'
        ];


///////////////////////////////////////////////////////////
//  _parse_expr()                                        //
///////////////////////////////////////////////////////////
//
        const   _parse_expr = (

            tokens

        ) => {

            let __rv = false;

            while (true)  {
                let objTokensExpr = __parse_tokens_expr(tokens);

                tokens = objTokensExpr.tokens;
                __rv= objTokensExpr.rv;

                if (! objTokensExpr.rv || typeof tokens === 'string')
                    break;
            }

            return tokens;

        };


///////////////////////////////////////////////////////////
//  Logical operators                                    //
///////////////////////////////////////////////////////////
//
        const   __eq = (lval, rval) => { return (lval === rval) ? 1 : 0; };
        const   __ne = (lval, rval) => { return (lval !== rval) ? 1 : 0; };
        const   __le = (lval, rval) => { return (lval <= rval) ? 1 : 0; };
        const   __ge = (lval, rval) => { return (lval >= rval) ? 1 : 0; };
        const   __lt = (lval, rval) => { return (lval < rval) ? 1 : 0; };
        const   __gt = (lval, rval) => { return (lval > rval) ?  1 : 0; };


        const   __and = (lval, rval) => { return (lval && rval) ? 1 : 0; };
        const   __or = (lval, rval) => { return (lval || rval) ? 1 : 0; };


        // const   __or = (lval, rval) => {
        //     let     __lval = false;
        //     let     __rval = false;

        //     if ((typeof lval === 'string' && lval !== 'false') || (typeof lval === 'number' && lval !== 0))
        //         __lval = true;
        //     if ((typeof rval === 'string' && rval !== 'false') || (typeof rval === 'number' && rval !== 0))
        //         __rval = true;

        //     return (__rval || __lval);
        // };


        const   __conditionals = {
            'eq': __eq,
            'ne': __ne,
            'le': __le,
            'ge': __ge,
            'lt': __lt,
            'gt': __gt,
            'and': __and,
            'or': __or
        };


///////////////////////////////////////////////////////////
//  __parse_tokens_expr()                                //
///////////////////////////////////////////////////////////
//
        const   __parse_tokens_expr = tokens => {

            let     __rv = false;

            let     obrace = 0;
            let     ebrace = -1;

            let     lval = false;
            let     rval = false;
            let     op = false;

            let     __modifier = '';


            for (obrace = (tokens.length - 1); obrace >= objOptions.first_token; obrace--) {
                if (tokens[obrace] === objOptions.ebrace)
                    ebrace = obrace;

                if (typeof tokens[obrace] === 'number')
                    continue;

                if (tokens[obrace] === objOptions.obrace) {
                    if (ebrace === -1)
                        return {
                            'tokens': `Error in file ${tokens[0]}, line ${tokens[1]}: Missing '${objOptions.ebrace}' character`,
                            'rv': false
                        };

                    if (((ebrace - obrace) % 2) || (ebrace - obrace) < 4)
                        return {
                            'tokens': `Error in file ${tokens[0]}, line ${tokens[1]}: Missing parameters inside '(expression)'`,
                            'rv': false
                        };

                    for (let token = (ebrace - 1); token >= (obrace + 2); token -= 2) {
                        console.log(`Resolving ${tokens}`);
                        rval = tokens[token];
                        op = tokens[(token - 1)];
                        lval = tokens[(token - 2)];

                        if (op === '+')
                            tokens[(token - 2)] = (parseInt(lval) + parseInt(rval)).toString();
                        else if (op === '-')
                            tokens[(token - 2)] = (parseInt(lval) - parseInt(rval)).toString();
                        else if (op === '/')
                            tokens[(token - 2)] = (parseInt(lval) / parseInt(rval)).toString();
                        else if (op === '*')
                            tokens[(token - 2)] = (parseInt(lval) * parseInt(rval)).toString();
                        else if (op === '%')
                            tokens[(token - 2)] = (parseInt(lval) % parseInt(rval)).toString();
                        else if (__conditionals.hasOwnProperty(op))
                            tokens[(token - 2)] = __conditionals[op](lval, rval);
                        else
                            return {
                                'tokens': `Error in file ${tokens[0]}, line ${tokens[1]}: Unknown operator ${op}`,
                                'rv': false
                            };
                            
                            console.log(`>>> RESULT === ${tokens[(token - 2)]}`)
                        tokens.splice((token - 1), 2);
                        ebrace -= 2;
                    }
                    
                    tokens.splice(ebrace, 1);
                    tokens.splice(obrace, 1);

                    if (__modifier)
                        tokens[obrace] = `${__modifier.trim()}${tokens[obrace].trim()}`;

                    ebrace = -1;

                    __rv = true;

                    break;
                }
            }

            if (ebrace > -1)
                return {
                    'tokens': `Error in file ${tokens[0]}, line ${tokens[1]}: Excess '${objOptions.ebrace}' token not part of any expression`,
                    'rv': __rv
                };

            return {
                'tokens': tokens,
                'rv': __rv
            };

        };


        return {

            parse_expr:             _parse_expr
        
        };

    };
