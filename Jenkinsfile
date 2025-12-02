pipeline {
    agent any
    environment {
        NODE_ENV = 'test'
    }
    stages {
        stage('Checkout') {
            steps {
                // Checkout the main branch
                git branch: 'main', url: 'https://github.com/Fawzia01/PetPal-PetCare-Management-.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                // Install Node.js dependencies
                sh 'npm install'
                // If on Windows, replace sh with bat:
                // bat 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                // Run your Jest tests
                sh 'npm test'
                // On Windows: bat 'npm test'
            }
        }
    }
    post {
        always {
            echo 'Build finished'
        }
        success {
            echo 'Tests passed ✅'
        }
        failure {
            echo 'Tests failed ❌'
        }
    }
}
