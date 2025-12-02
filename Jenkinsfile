pipeline {
    agent any
    environment {
        NODE_ENV = 'test'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Fawzia01/PetPal-PetCare-Management-.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                // Windows: use 'bat' instead of 'sh'
                bat 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                // Windows: use 'bat' instead of 'sh'
                bat 'npm test'
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
