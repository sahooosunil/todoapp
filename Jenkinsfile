pipeline {
    agent none
    environment {
        DOCKER_IMAGE = 'sunilsahu0123/todoapi'
        DOCKER_IMAGE_UI = 'sunilsahu0123/todoui'
        DOCKER_CREDENTIALS = 'docker-hub-credential'
        SONARQUBE_ENV = 'SonarQube'
    }
    stages {
        stage('Checkout') {
            agent {
                docker {
                    image 'maven:3.9.5-eclipse-temurin-17'
                    args '-u root'
                }
            }
            steps { // Added steps block
                checkout scm
            }
        }
        stage('Maven Build and Test') {
            agent {
                docker {
                    image 'maven:3.9.5-eclipse-temurin-17'
                    args '-u root'
                }
            }
            steps {
                script {
                    dir('todoapi') {
                        sh 'mvn clean verify'
                    }
                }
            }
        }
        stage('SonarQube Analysis') {
            agent {
                docker {
                    image 'maven:3.9.5-eclipse-temurin-17'
                    args '-u root'
                }
            }
            steps {
                script {
                    dir('todoapi') {
                        withSonarQubeEnv(){
                            sh "mvn sonar:sonar -Dsonar.projectKey=todoapp -Dsonar.projectName='todoapp'"
                        }
                    }
                }
            }
        }
        stage('Docker Build and Push') {
            agent {
                docker {
                    image 'sunilsahu0123/java-maven-node-docker-agent-image:latest'
                    args '--user root -v /var/run/docker.sock:/var/run/docker.sock' // mount Docker socket to access the host's Docker daemon
                }
            }
            steps {
                script {
                    dir('todoapi') {
                        def buildNumber = env.BUILD_NUMBER
                        def imageTag = "${env.DOCKER_IMAGE}:${buildNumber}"
                        sh "docker build -t ${imageTag} ."
                        withDockerRegistry([credentialsId: env.DOCKER_CREDENTIALS]) {
                            sh "docker push ${imageTag}"
                        }
                    }
                    dir('todo-app-ui') {
                        def buildNumber = env.BUILD_NUMBER
                        def imageTag = "${env.DOCKER_IMAGE_UI}:${buildNumber}"
                        sh "docker build -t ${imageTag} ."
                        withDockerRegistry([credentialsId: env.DOCKER_CREDENTIALS]) {
                            sh "docker push ${imageTag}"
                        }
                    }
                }
            }
        }
        stage('Deployment') {
            agent {
                docker {
                    image 'maven:3.9.5-eclipse-temurin-17'
                    args '-u root'
                }
            }
            seteps {
                script {
                    dir('k8s') {
                        withCredentials(credentialsId: 'github-token') {
                            sh '''
                            sed -i 's/\(image:.*:\)[0-9]*/\1${env.BUILD_NUMBER}/' deployment-ui.yml
                            sed -i 's/\(image:.*:\)[0-9]*/\1${env.BUILD_NUMBER}/' deployment-api.yml
                            git add deployment-ui.yml
                            git add deployment-api.yml
                            git commit -m 'Updated the deployment-ui.yml deployment-api.yml | Jenkins Pipeline'
                            git push https://github.com/sahooosunil/todoapp.git HEAD:main
                            '''
                        }
                    }    
                }
            }
        }
    }
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}