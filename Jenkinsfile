pipeline {
  agent any
  parameters {
    booleanParam(defaultValue: false, description: "opis parametru", name: "firstBoolean")
    string(defaultValue: "DEV", description: "opis parametru", name: "enviroment")
    choice(choices: ["DEV", "QA", "STG", "PROD"], description: "opis parametru", name: "envs")
  }
  environment {
    def exampleBoolean = true
    def exampleString = "Hello"
    def exampleNumber = 5
  }
  triggers {
    cron("H 5 * * 1")
  }
  tools {
    nodejs 'nodejs-24-1-0'
  }
  stages {
    stage("Cleanup") {
      steps {
        script {
          def innerString = "innerstring"
        }
        deleteDir()
        exampleFunction("cleanup stage")
      }
    }
    stage("Inicjalizacja") {
      steps {
        echo "booleanParam jest ustawiony na: ${params.firstBoolean}"
        echo "string jest ustawiony na: ${params.enviroment}"
        echo "choice jest ustawiony na: ${params.envs}"
        echo "-------------"
        echo "exampleBoolean ${exampleBoolean}"
      }
    }
    stage("Install") {
      steps {
        echo "Instalacja pakietów"
        // sh 'npm run i'
      }
    }
    stage("Test") {
      parallel {
        stage("Backend Unit Tests") {
          steps {
            echo "Uruchamiam backend unit tests"
            // sh 'npm run test:backend:unit'
          }
        }
        stage("Backend Integration Tests") {
          steps {
            echo "Uruchamiam backend integration tests"
            // sh 'npm run test:backend:integration'
          }
        }
        stage("Frontend Unit Tests") {
          steps {
            echo "Uruchamiam frontend unit tests"
            // sh 'npm run test:frontend:unit'
          }
        }
        stage("Frontend E2E Tests") {
          steps {
            echo "Uruchamiam frontend e2e tests"
            // sh 'npm run test:frontend:e2e'
          }
        }
      }
    }
    stage("Build") {
      parallel {
        stage("Backend Build") {
          steps {
            script {
              if (params.exampleNumber == 5) {
                return
              } else {
                echo "number is not equal build failed"
              }
            }
            echo "== Backend Build =="
            // sh 'npm run build:backend'
          }
        }
        stage("Frontend Build") {
          steps {
            echo "== Frontend Build =="
            // sh 'npm run build:frontend'
          }
        }
      }
    }
    stage('Deploy') {
      steps {
        echo "Ansible"
        // sh 'ansible-playbook -i inventory.ini deploy.yml'
      }
    }
    stage("Release") {
      steps {
        echo "Publikacja zakończona"
      }
    }
  }
}

def exampleFunction(String exampleText) {
  def myString = exampleText
  echo "example string to ${myString}"
}