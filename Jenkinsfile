pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        DEPLOY_DIR = '/var/www/frontend' // Cambia esta ruta si tu destino local es diferente
    }

    stages {
        stage('Clonar repositorio') {
            steps {
                git branch: 'main', url: 'https://github.com/Beymarnexx/Gestion-calidad.git'
            }
        }

        stage('Instalar dependencias') {
            steps {
                dir('PRODUCCION/Frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Construir proyecto') {
            steps {
                dir('PRODUCCION/Frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Desplegar en entorno local') {
            steps {
                script {
                    // Asegúrate de tener permisos para esta operación
                    def outputPath = "${env.WORKSPACE}/PRODUCCION/Frontend/dist"
                    sh """
                        sudo rm -rf ${DEPLOY_DIR}
                        sudo mkdir -p ${DEPLOY_DIR}
                        sudo cp -r ${outputPath}/* ${DEPLOY_DIR}/
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Despliegue realizado correctamente.'
        }
        failure {
            echo 'El pipeline ha fallado.'
        }
    }
}
