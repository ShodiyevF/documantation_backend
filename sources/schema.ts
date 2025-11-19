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
    enum?: any[];
    example?: string;
}

interface INumberPayload extends IPayloadBase {
    type: 'number';
    min?: number;
    max?: number;
    pattern?: RegExp;
    enum?: any[];
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

// type Payload = IStringPayload | INumberPayload | IBooleanPayload | INullPayload | IArrayPayload | IObjectPayload | IFileType

type BaseChild<T> = Omit<T, 'example'> & {
    is_required?: boolean;
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
        properties: {
            user_first_name: {
                type: 'string',
            },
            user_last_name: {
                type: 'string'
            },
            user_father_name: {
                type: 'string',
            },
            user_age: {
                type: 'number',
            },
            user_phone_numbers: {
                type: 'array',
                items: {
                    type: 'string',
                }
            },
            user_branches: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        branch_id: {
                            type: 'string',
                        },
                        branch_name: {
                            type: 'string'
                        },
                        branch_employees: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    employee_id: {
                                        type: 'string',
                                    },
                                    employee_name: {
                                        type: 'string'
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
        }
    ]
}

const object: IObjectPayload = {
    type: 'object',
    properties: {
        user_first_name: {
            type: 'string',
        },
        user_last_name: {
            type: 'string'
        },
        user_father_name: {
            type: 'string'
        },
        user_age: {
            type: 'number',
        },
        user_phone_numbers: {
            type: 'array',
            items: {
                type: 'string',
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