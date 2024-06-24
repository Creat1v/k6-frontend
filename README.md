# Building and Running the Container

This guide will walk you through the steps to build and run the container for the k6s-frontend project.

## Prerequisites
Before you begin, ensure that you have the following installed on your machine:
- Docker
- Git

## Steps
1. Clone the repository:
    ```
    git clone https://github.com/Creat1v/k6-frontend.git
    ```

2. Navigate to the project directory:
    ```
    cd k6-frontend
    ```

3. Build the Docker image:
    ```
    docker build -t k6-frontend .
    ```

4. Run the container:
    ```
    docker run -it -p 3000:3000 k6-frontend
    ```

5. Access the application in your browser:
    ```
    http://localhost:3000
    ```

If you want to exec into the container:
```bash
docker exec -it $(docker ps | grep -i k6-frontend | awk '{print $1}')  /bin/bash
```

That's it! You have successfully built and run the container for the k6-frontend project. Enjoy!