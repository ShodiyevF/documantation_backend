create database responses;

drop table responses cascade;
create table responses(
    response_id serial primary key,
    response_status boolean not null,
    response_status_code text not null,
    response_keys jsonb not null,
    response_description varchar(1024),
    response_created_at timestamp with time zone default current_timestamp
);

-- Insert mock data into the responses table
INSERT INTO responses (response_status, response_status_code, response_keys) VALUES
(true, '200 OK', '[
  {
    "keys": null,
    "key_name": "status",
    "key_types": [
      "string"
    ],
    "key_mock_value": "200",
    "key_description": null
  },
  {
    "keys": null,
    "key_name": "message",
    "key_types": [
      "string"
    ],
    "key_mock_value": "Logged",
    "key_description": null
  },
  {
    "keys": [
      {
        "keys": null,
        "key_name": "authorization_id",
        "key_types": [
          "string"
        ],
        "key_mock_value": "9f558ee3-aae2-453a-8a42-817b60d53725",
        "key_description": null
      },
      {
        "keys": null,
        "key_name": "login_type",
        "key_types": [
          "string"
        ],
        "key_mock_value": "sms",
        "key_description": null
      },
      {
        "keys": null,
        "key_name": "is_new_user",
        "key_types": [
          "boolean"
        ],
        "key_mock_value": "false",
        "key_description": null
      },
      {
        "keys": null,
        "key_name": "password_hint",
        "key_types": [
          "string",
          "null"
        ],
        "key_mock_value": "maktabimdagi sevgim",
        "key_description": null
      },
      {
        "keys": [
            {
                "keys": null,
                "key_name": "id",
                "key_types": [
                    "string"
                ],
                "key_mock_value": "9f558ee3-aae2-453a-8a42-817b60d53725",
                "key_description": null
            },
            {
                "keys": null,
                "key_name": "name",
                "key_types": [
                    "string"
                ],
                "key_mock_value": "fayzulloh",
                "key_description": null
            },
            {
                "keys": null,
                "key_name": "created_at",
                "key_types": [
                    "string"
                ],
                "key_mock_value": "20.10.2024",
                "key_description": null
            },
        ],
        "key_name": "datas",
        "key_types": [
          "object"
        ],
        "key_mock_value": "{\n    id: \"9f558ee3-aae2-453a-8a42-817b60d53725\",\n    name: \"fayzulloh\",\n    created_at: \"20.10.2024\"\n}",
        "key_description": null
      }
    ],
    "key_name": "data",
    "key_types": [
      "object"
    ],
    "key_mock_value": "{\n    authorization_id: \"9f558ee3-aae2-453a-8a42-817b60d53725\",\n    login_type: \"sms\",\n    is_new_user: false,\n    password_hint: \"test\"\n}",
    "key_description": null
  }
]');



drop table responses cascade;
create table responses(
  response_id serial primary key,
  response_status boolean not null,
  response_status_code text not null,
  response_description varchar(1024),
  response_created_at timestamp with time zone default current_timestamp
);

drop table response_keys cascade;
create table response_keys(
  rk_id serial primary key,
  rk_name text not null,
  rk_types text[] not null,
  rk_mock_value text,
  rk_description varchar(128),
  rk_parent_id int references response_keys(rk_id),
  rk_response_id int not null references responses(response_id),
  rk_created_at timestamp with time zone default current_timestamp
);

-- Insert the 'project' key as a parent
INSERT INTO response_keys (rk_name, rk_types, rk_mock_value, rk_description, rk_response_id)
VALUES
  ('project_platforms', ARRAY['jsonb'], '{"platform_name": "Twitter", "platform_date": "20-01-2023"}', 'Project details as a JSON object', 1)
RETURNING rk_id;

-- Insert other fields with 'project_key_id' as the parent
INSERT INTO response_keys (rk_name, rk_types, rk_mock_value, rk_description, rk_parent_id, rk_response_id)
VALUES
  ('platform_name', ARRAY['text'], 'Twitter', 'Name of registered platform', 10, 1),
  ('platform_date', ARRAY['text'], '20-01-2023', 'Date of registered platform', 10, 1);
  ('api_route', ARRAY['text'], '/api/users', 'Route of the API', NULL, 1),
  ('api_method', ARRAY['text'], 'GET', 'HTTP method used by the API', NULL, 1),
  ('api_description', ARRAY['text'], NULL, 'Description of the API', NULL, 1),
  ('api_created_at', ARRAY['timestamptz'], '2024-10-29T18:52:27.333Z', 'Timestamp of API creation', NULL, 1),

  -- Link 'project_id' and 'project_name' to 'project'
  ('project_id', ARRAY['uuid'], 'b6592148-3f70-4e5c-bd08-c69d2e091d5f', 'ID of the associated project', 1, 1),
  ('project_name', ARRAY['text'], 'Kassa nazorati', 'Name of the associated project', 1, 1);


-- Recursive CTE to build hierarchical structure for response_keys
WITH RECURSIVE key_hierarchy AS (
  -- Base case: select all root-level keys where rk_parent_id is NULL
  SELECT 
    rk_id,
    rk_name AS key_name,
    rk_types AS key_types,
    rk_mock_value AS key_mock_value,
    rk_description AS key_description,
    rk_parent_id,
    rk_response_id
  FROM 
    response_keys
  WHERE 
    rk_parent_id IS NULL AND rk_response_id = 1  -- Specify the response_id
  
  UNION ALL
  
  -- Recursive case: select all child keys linked to their parent
  SELECT 
    child.rk_id,
    child.rk_name AS key_name,
    child.rk_types AS key_types,
    child.rk_mock_value AS key_mock_value,
    child.rk_description AS key_description,
    child.rk_parent_id,
    child.rk_response_id
  FROM 
    response_keys child
  INNER JOIN 
    key_hierarchy parent ON child.rk_parent_id = parent.rk_id
)

-- Final selection with nested JSON structure
SELECT jsonb_agg(
  jsonb_build_object(
    'keys', (
      SELECT jsonb_agg(jsonb_build_object(
          'keys', NULL,
          'key_name', child.key_name,
          'key_types', child.key_types,
          'key_mock_value', child.key_mock_value,
          'key_description', child.key_description
        ))
      FROM key_hierarchy child
      WHERE child.rk_parent_id = parent.rk_id
    ),
    'key_name', parent.key_name,
    'key_types', parent.key_types,
    'key_mock_value', parent.key_mock_value,
    'key_description', parent.key_description
  )
) AS response_keys_hierarchy
FROM key_hierarchy parent
WHERE parent.rk_parent_id IS NULL;

