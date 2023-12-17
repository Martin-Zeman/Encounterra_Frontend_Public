#!/bin/bash

# Check if both email and password are provided as command-line arguments
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <email> <password>"
  exit 1
fi

# Assign command-line arguments to variables
email="$1"
password="$2"
login_url="https://encounterra.com/api/login"
url_user_data="https://encounterra.com/api/user_data"
cookie_file="cookie.txt"

# Make a POST request to the login endpoint
response=$(curl -c $cookie_file -X POST -H "Content-Type: application/json" -d "{\"email\":\"$email\",\"password\":\"$password\"}" $login_url)

# Print the authentication response
#echo "Authentication Response: $response"

# Check if the login was successful
if [ "$(echo $response | jq -r '.status')" != "success" ]; then
  echo "Login failed. Check your credentials."
  exit 1
fi

# Extract the access token from the response
access_token=$(echo $response | jq -r '.data.AccessToken')
#echo "Access Token: $access_token"

# Make a GET request to the user_data endpoint with the access token
user_data_response=$(curl -b $cookie_file -H "Authorization: Bearer $access_token" $url_user_data)

# Print the user data response
echo "User Data: $user_data_response"
