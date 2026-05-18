interface IPayloadBase {
    type: 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object' | 'file';
    example?: any;
    description?: string;
}

interface IStringPayload extends IPayloadBase {
    type: 'string';
    min_length?: number;
    max_length?: number;
    pattern?: RegExp;
    enum_list?: any[];
    example?: string;
}

interface INumberPayload extends IPayloadBase {
    type: 'number';
    min?: number;
    max?: number;
    pattern?: RegExp;
    enum_list?: any[];
    example?: number;
}

interface IBooleanPayload extends IPayloadBase {
    type: 'boolean';
    example?: boolean;
}

interface INullPayload extends IPayloadBase {
    type: 'null';
    example?: null;
}

interface IArrayPayload extends IPayloadBase {
    type: 'array';
    items_min_length?: number;
    items_max_length?: number;
    items: ChildPayload;
    example?: any[];
}

interface IObjectPayload extends IPayloadBase {
    type: 'object';
    properties: {
        [key: string]: ChildPayload
    }
    example?: object;
}

interface IFileType extends IPayloadBase {
    type: 'file';
    max_size?: number;
    mime_types?: string[];
}

type BaseChild<T> = Omit<T, 'example'> & {
    is_required: boolean;
};

type ChildPayload =
| BaseChild<IStringPayload>
| BaseChild<INumberPayload>
| BaseChild<IBooleanPayload>
| BaseChild<INullPayload>
| (BaseChild<IArrayPayload> & {
    items: ChildPayload;
})
| (BaseChild<IObjectPayload> & {
    properties: Record<string, ChildPayload>;
});

type Payload = IStringPayload | INumberPayload | IBooleanPayload | INullPayload | IArrayPayload | IObjectPayload | IFileType


const string: IStringPayload = {
    type: 'string',
    example: 'test'
}

const number: INumberPayload = {
    type: 'number',
    example: 1
}

const nulll: INullPayload = {
    type: 'null',
    example: null
}

const array: IArrayPayload = {
    type: 'array',
    items: {
        type: 'object',
        is_required: false,
        properties: {
            user_id: {
                type: 'string',
                is_required: true
            },
            user_first_name: {
                type: 'string',
                is_required: true
            },
            user_last_name: {
                type: 'string',
                is_required: true
            },
            user_father_name: {
                type: 'string',
                is_required: true
            },
            user_age: {
                type: 'number',
                is_required: true
            },
            user_phone_numbers: {
                type: 'array',
                is_required: false,
                items: {
                    type: 'string',
                    is_required: false
                }
            },
            user_branches: {
                is_required: false,
                type: 'array',
                items: {
                    is_required: false,
                    type: 'object',
                    properties: {
                        branch_id: {
                            type: 'string',
                            is_required: false,
                        },
                        branch_name: {
                            type: 'string',
                            is_required: false,
                        },
                        branch_employees: {
                            type: 'array',
                            is_required: false,
                            items: {
                                is_required: false,
                                type: 'object',
                                properties: {
                                    employee_id: {
                                        type: 'string',
                                        is_required: false,
                                    },
                                    employee_name: {
                                        type: 'string',
                                        is_required: false,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    example: [
        {
            user_first_name: 'fayzulloh',
            user_last_name: 'shodiyev',
            user_father_name: `zarifjon o'g'li`,
            user_age: 19,
            user_phone_numbers: ['998912007435', '998200097766'],
            user_branches: [
                {
                    branch_id: 'a4ca3ff1-ea0c-42d4-bdab-1edd30ef9bac',
                    branch_name: 'Bosh ofis',
                    branch_employees: [
                        {
                            employee_id: 'a4ca3ff1-ea0c-42d4-bdab-1edd30ef9bac',
                            employee_name: 'Fayzulloh',
                        }
                    ],
                }
            ],
        },
    ]
}

const object: IObjectPayload = {
    type: 'object',
    properties: {
        user_first_name: {
            type: 'string',
            is_required: false,
        },
        user_last_name: {
            type: 'string',
            is_required: false,
        },
        user_father_name: {
            type: 'string',
            is_required: false,
        },
        user_age: {
            type: 'number',
            is_required: false,
        },
        user_phone_numbers: {
            type: 'array',
            is_required: false,
            items: {
                type: 'string',
                is_required: false,
            }
        }
    },
    example: {
        user_first_name: 'fayzulloh',
        user_last_name: 'shodiyev',
        user_father_name: `zarifjon o'g'li`,
        user_age: 19,
        user_phone_numbers: ['998912007435', '998200097766']
    }
}

const file: IFileType = {
    type: 'file',
    max_size: 999,
    mime_types: ['image/jpeg', 'image/png']
}

// EXAMPLE
// {
//     type: 'object',
//     properties: {
//         user_id: {
//             type: 'string',
//             is_required: true,
//             pattern: ['adsasd'],
//         },
//         user_phone_numbers: {
//             type: 'array',
//             is_required: true,
//             items: {
//                 type: 'object',
//                 properties: {
//                     phone_number: {
//                         type: 'string',
//                         is_required: true
//                     }
//                 }
//             }
//         },
//         user_image: {
//             is_required: false,
//             type: 'file',
//             max_size: 100,
//             mime_types: ['adasd']
//         }
//     }
// }