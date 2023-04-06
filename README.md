# Lambda Function for the Environment Project

This lambda function receives the information sent by the microcontroller 
with the sensors from the dwell and after it is storaged in a SQL DB, which holds
the values of the environmental variables.

This Function also provides a  way to retrieve an array with the values storaged
into the table.

TODO left create and endpoint that queries by the created date of the row.

## Request Body Send Record

To send data to the DB, the request body must follow this shape.

```json
{
    "pressure": 401.1,
    "temperature": 402.2,
    "humidity": 403.3,
    "luminity": 404.4,
    "place": "POSTMAN-TEST"
}
```

Ensure to set a valid "place" value, in this case is for testing.

The service will return 201 as status if the format and type of the data are valid

## Response for the Query of all Data

```json
{
    "result": [
        {
            "id": "1",
            "created_at": "2023-03-31T18:53:08.320Z",
            "pressure": 75234.78,
            "temperature": 24.731,
            "humidity": 50.165,
            "luminity": 17.5,
            "place": "SOACHA-TEST"
        },
        {
            "id": "2",
            "created_at": "2023-03-31T18:54:33.816Z",
            "pressure": 75235.88,
            "temperature": 24.777,
            "humidity": 49.988,
            "luminity": 15.833,
            "place": "SOACHA-TEST"
        }
    ]
}
```

An array of object as each of these as a record in the DB.