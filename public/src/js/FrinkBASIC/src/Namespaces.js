///////////////////////////////////////////////////////////
//  FrinkBASIC/src/Namespace.js                          //
///////////////////////////////////////////////////////////
//
//
//


    export const Namespaces = () => {

        const   _namespaces = {};
        let     _namespace = 'standard';


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const   __initialise = () => {

            _new_namespace(_namespace);

        };


///////////////////////////////////////////////////////////
//  __find_object()                                      //
///////////////////////////////////////////////////////////
//
        const   __find_object = (
            labels,
            label_no,
            namespace,
            objNamespace,
            chain = ''
        ) => {

            if (label_no >= labels.length)
                return { 'value': objNamespace };

            if (! objNamespace.hasOwnProperty(labels[label_no]))
                return `Label ${namespace}:${chain} ${labels[label_no]} not found`;

            chain += (chain === '') ? labels[label_no] : `.${labels[label_no]}`;

            return __find_object(
                labels,
                (label_no + 1),
                namespace,
                objNamespace[labels[label_no]],
                chain
            );

        };


///////////////////////////////////////////////////////////
//  __set_chain()                                        //
///////////////////////////////////////////////////////////
//
        const   __set_chain = (
            labels,
            value,
            label_no,
            namespace,
            objNamespace,
            chain = ''
        ) => {

            chain += namespace;

            if (! objNamespace.hasOwnProperty(labels[label_no]))
                objNamespace[labels[label_no]] = {};

            if ((label_no + 1) >= labels.length) {
                console.log(`Setting ${chain} >>> ${labels[label_no]} = ${value}`)
                objNamespace[labels[label_no]] = value;
                return true;
            }

            return __set_chain(
                labels,
                value,
                (label_no + 1),
                namespace,
                objNamespace[labels[label_no]]
            );

        };


///////////////////////////////////////////////////////////
//  __delete_chain()                                     //
///////////////////////////////////////////////////////////
//
        const   __delete_chain = (
            labels,
            label_no,
            namespace,
            objNamespace,
            chain = ''
        ) => {

            if (! objNamespace.hasOwnProperty(labels[label_no]))
                return `Label ${namespace}:${chain} ${labels[label_no]} not found`;

            if ((label_no + 1) >= labels.length) {
                delete objNamespace[labels[label_no]];
                return;
            }

            chain += (chain === '') ? labels[label_no] : `.${labels[label_no]}`;

            return __delete_chain(
                labels,
                (label_no + 1),
                namespace,
                objNamespace[labels[label_no]],
                chain
            );

        };


///////////////////////////////////////////////////////////
//  _check_label()                                       //
///////////////////////////////////////////////////////////
//
        const   _check_label = (
            namespace,
            label = false
        ) => {

            if (label === false) {
                if (! /^[a-zA-Z0-9_]+$/.test(namespace))
                    return `Cannot create namespace ${namespace} - contains invalid characters`;
                if (_namespaces.hasOwnProperty(namespace))
                    return `Cannot create namespace ${namespace} - already exists`;
            }
            else {
                return false;
            }

            return true;

        };


///////////////////////////////////////////////////////////
//  _new_namespace()                                     //
///////////////////////////////////////////////////////////
//
        const   _new_namespace = namespace => {

            const   __result = _check_label(namespace);

            if (typeof __result === 'string')
                return __result;

            _namespaces[namespace] = {
                'label': [],
                'data': []
            };

            return true;

        };

    
///////////////////////////////////////////////////////////
//  _use_namespace()                                     //
///////////////////////////////////////////////////////////
//
        const   _use_namespace = namespace => {

            if (! _namespaces.hasOwnProperty(namespace))
                return `Namespace '${namespace}' doesn't exist`;

            _namespace = namespace;

            return true;

        };


///////////////////////////////////////////////////////////
//  _delete_namespace()                                  //
///////////////////////////////////////////////////////////
//
        const   _delete_namespace = namespace => {
            
            if (! _namespaces.hasOwnProperty(namespace))
                return `Cannot delete namespace ${namespace} - doesn't exist`;
            if (namespace === 'standard')
                return `Cannot delete default ${namespace} namespace`;

            delete _namespaces[namespace];

            return true;

        };


///////////////////////////////////////////////////////////
//  _get_value()                                         //
///////////////////////////////////////////////////////////
//
        const   _get_value = (
            label,
            namespace = false
        ) => {

            if (namespace === false)
                namespace = _namespace;

            if (! Object.keys(_namespaces).includes(namespace))
                return `Namespace ${namespace} doesn't exist`;

            return __find_object(
                label.split('.'),
                0,
                namespace,
                _namespaces[namespace]
            );

        };


///////////////////////////////////////////////////////////
//  _set_value()                                         //
///////////////////////////////////////////////////////////
//
        const   _set_value = (
            label,
            value,
            namespace = false
        ) => {
            if (namespace === false)
                namespace = _namespace;

            if (! _namespaces.hasOwnProperty(namespace))
                return `Namespace ${namespace} doesn't exist`;

            __set_chain(
                label.split('.'),
                value,
                0,
                namespace,
                _namespaces[namespace]
            );

        };


///////////////////////////////////////////////////////////
//  _delete_value()                                      //
///////////////////////////////////////////////////////////
//
        const   _delete_value = (
            label,
            namespace
        ) => {
            
            if (namespace === _namespace) {
                if (namespace === 'standard')
                    return `Cannot delete the standard namespace`;
                _namespace = 'standard';
            }

            if (! _namespaces.hasOwnProperty(namespace))
                return `Cannot delete namespace ${namespace} - doesn't exist`;

            return __delete_chain(
                label.split('.'),
                0,
                namespace,
                _namespaces[namespace]
            );

        };


        __initialise();


        return {

            check_label: _check_label,
            new_namespace: _new_namespace,
            use_namespace: _use_namespace,
            delete_namespace: _delete_namespace,

            get_value: _get_value,
            set_value: _set_value,
            delete_value: _delete_value,

            namespaces: _namespaces

        };

    };

