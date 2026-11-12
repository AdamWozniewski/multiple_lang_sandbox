pipeline {
  agent any
  parameters {
    booleanParam(defaultValue: false, description: "opis parametru", name: "firstBoolean")
    string(defaultValue: "DEV", description: "opis parametru", name: "enviroment")
    choice(choices: ["DEV", "QA", "STG", "PROD"], description: "opis parametru", name: "envs")
  }
  environment {
    EXAMPLE_BOOLEAN = "true"
  }
  triggers {
    cron("H 5 * * 1")
  }
  options {
    timestamps()
    ansiColor('xterm')
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
        sh 'cd apps/recipe-api && bun install'
      }
    }
    stage("Test") {
      parallel {
        stage("Backend EXPRESS tests") {
          stages {
            stage("Unit Tests") {
              steps {
                echo "Uruchamiam - Unit Tests"
                //sh 'cd apps/backend && bun run test:run'
              }
            }
            stage("Integration Tests") {
              steps {
                echo "Uruchamiam - Integration Tests"
                //sh 'npm run test:backend:integration'
              }
            }
            stage("E2E Tests") {
              steps {
                echo "Uruchamiam - E2E Tests"
                //sh 'npm run test:backend:integration'
              }
            }
          }
        }

        stage("Backend NEST tests") {
          stages {
            stage("Unit Tests") {
              steps {
                echo "Uruchamiam - Unit Tests"
                //sh 'cd apps/recipe-api && bun run test:run'
              }
            }
            stage("Integration Tests") {
              steps {
                echo "Uruchamiam - Integration Tests"
                //sh 'cd apps/recipe-api && bun run test:run'
              }
            }
          }
        }

        stage("Frontend ANGULAR tests") {
          stages {
            stage("Unit Tests") {
              steps {
                echo "Uruchamiam - Unit Tests"
                //sh 'cd apps/angular && bun run test:run'
              }
            }
            stage("Integration Tests") {
              steps {
                echo "Uruchamiam - Integration Tests"
                //sh 'cd apps/angular && bun run test:run'
              }
            }
            stage("E2E Tests") {
              steps {
                echo "Uruchamiam - Integration Tests"
                //sh 'cd apps/angular && bun run test:run'
              }
            }
          }
        }
      }
    }
    stage("Build") {
      parallel {
        stage("Backend Build") {
          steps {
            script {
              if (env.EXAMPLE_BOOLEAN == "true") {
                return
              } else {
                echo "number is not equal build failed"
              }
            }
            echo "== Backend Build =="
            // sh 'cd apps/backend && bun run build:backend'
          }
        }
        stage("backend NEST Build") {
          steps {
            echo "== Frontend Build =="
            // sh 'cd apps/recipe-api && bun run build'
          }
        }
        stage("Frontend ANGULAR Build") {
          steps {
            echo "== Frontend Build =="
            // sh 'cd apps/angular && bun run build:frontend'
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
  post {
    always {
        echo "Pipeline zakończony"
        deleteDir()
    }
    success {
        echo "*** SUCCESS ***"
    }
    failure {
        echo "--- FAILED ---"
    }
  }
}

def exampleFunction(String exampleText) {
  def myString = exampleText
  echo "example string to ${myString}"
}