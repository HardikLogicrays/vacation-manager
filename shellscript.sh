curl --location --request POST 'http://127.0.0.1:8000/api/create-user/' \
--header 'Content-Type: application/json' \
--header 'Cookie: csrftoken=CZdAXJboEzh58MgtoRd3Ll3dydqM129tRznarp7MUBpZB9BlquZSlOMTOHE0DV91' \
--data-raw '{
    "emp_name": "test",
    "email": "test@gmail.com",
    "password": "test@123",
    "confirm_password": "test@123"
}'

