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
                    image 'sunilsahu0123/java-maven-node-docker-agent-image:latest'
                    args '--user 108 -v /var/run/docker.sock:/var/run/docker.sock' // mount Docker socket to access the host's Docker daemon
                }
            }
            steps { 
                checkout scm
            }
        }
        stage('Maven Build and Test') {
            agent {
                docker {
                    image 'sunilsahu0123/java-maven-node-docker-agent-image:latest'
                    args '--user 108 -v /var/run/docker.sock:/var/run/docker.sock' // mount Docker socket to access the host's Docker daemon
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
                    image 'sunilsahu0123/java-maven-node-docker-agent-image:latest'
                    args '--user 108 -v /var/run/docker.sock:/var/run/docker.sock' // mount Docker socket to access the host's Docker daemon
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
                }
            }
        }
        stage('Deployment') {
            agent {
                docker {
                    image 'sunilsahu0123/java-maven-node-docker-agent-image:latest'
                    args '--user 108 -v /var/run/docker.sock:/var/run/docker.sock' // mount Docker socket to access the host's Docker daemon
                }
            }
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'github-token', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        sh '''
                        sed -i 's/\\(image:.*:\\)[0-9]*/\\1 $BUILD_NUMBER/' ./k8s/deployment-ui.yml
                        sed -i 's/\\(image:.*:\\)[0-9]*/\\1 $BUILD_NUMBER/' ./k8s/deployment-api.yml
                        cat ./k8s/deployment-ui.yml
                        cat ./k8s/deployment-api.yml
                        git config user.email "$GIT_USER"
                        git config user.name "$GIT_USER"
                        git config user.password "$GIT_PASS"
                        git add ./k8s/deployment-ui.yml ./k8s/deployment-api.yml
                        git commit -m 'Updated the deployment-ui.yml deployment-api.yml | Jenkins Pipeline'
                        git status
                        git remote -v
                        git push
                        '''
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