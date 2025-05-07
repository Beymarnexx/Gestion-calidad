pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        DEPLOY_DIR = 'C:\\deploy\\frontend' // Cambiar si es necesario
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
                    bat '''
                        if exist node_modules rmdir /s /q node_modules
                        if exist package-lock.json del package-lock.json
                        npm install
                    '''
                }
            }
        }

        stage('Construir proyecto') {
            steps {
                dir('PRODUCCION/Frontend') {
                    bat 'npx vite build'
                }
            }
        }

        stage('Desplegar en entorno local') {
            steps {
                script {
                    def outputPath = "${env.WORKSPACE}\\PRODUCCION\\Frontend\\dist"
                    bat """
                        if exist "${DEPLOY_DIR}" rmdir /s /q "${DEPLOY_DIR}"
                        mkdir "${DEPLOY_DIR}"
                        xcopy /E /I /Y "${outputPath}" "${DEPLOY_DIR}\\"
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Despliegue realizado correctamente.'
        }
        failure {
            echo '❌ El pipeline ha fallado.'
        }
    }
}
